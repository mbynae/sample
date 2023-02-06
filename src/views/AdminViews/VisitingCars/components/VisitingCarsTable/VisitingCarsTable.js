import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, TablePaginationActions } from "../../../../../components";

import palette                   from "../../../../../theme/adminTheme/palette";
import { visitingCarMgntRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:          {},
	content:       {
		padding: 0
	},
	inner:         {
		minWidth: 1530
	},
	nameContainer: {
		display:    "flex",
		alignItems: "center"
	},
	actions:       {
		padding:        theme.spacing(1),
		paddingLeft:    theme.spacing(2),
		paddingRight:   theme.spacing(2),
		justifyContent: "space-between"
	}
}));

const VisitingCarsTable = props => {
	const classes = useStyles();

	const { className, history, menuKey, rootUrl, visitingCars, getVisitingCars, pageInfo, setPageInfo, isLoading, staticContext, ...rest } = props;
	const [selectedObjects, setSelectedObjects] = useState([]);

	// 체크박스 전체 선택 Handler
	const handleSelectAll = event => {
		let selectedList;
		event.target.checked ? selectedList = visitingCars.map(visitingCar => visitingCar) : selectedList = [];
		setSelectedObjects(selectedList);
	};

	// 체크박스 개별 선택 Handler
	const handleSelectOne = (event, selectedObject) => {
		const selectedIndex = selectedObjects.indexOf(selectedObject);
		let newSelectedObjects = [];

		if ( selectedIndex === -1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects, selectedObject);
		} else if ( selectedIndex === 0 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if ( selectedIndex === selectedObjects.length - 1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
		} else if ( selectedIndex > 0 ) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}

		setSelectedObjects(newSelectedObjects);
	};

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});

	// Modal Toggle
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};

	// Page Change Handler
	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getVisitingCars(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getVisitingCars(0, event.target.value);
	};

	// 선택된 Item 전체 삭제 Handler
	const handleDeleteAllClick = async (clicked) => {

		let deleteParam = {item: []}

		// 선택된 데이터의 상태 값 검사
		handleAlertToggle(
			"isConfirmOpen",
			clicked === "restore" ? "방문차량예약 복원" : "방문차량예약 삭제",
			clicked === "restore" ? "삭제되었던 방문차량예약 데이터가 모두 복구됩니다. \n 정말로 데이터를 복구하시겠습니까?"
				:
				"선택하신 방문차량예약 데이터가 모두 삭제가 됩니다. \n 정말로 데이터를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				// 복구 버튼 선택 시 복구, 삭제 버튼 클릭 시 삭제
				await selectedObjects.map(async (obj) => {
						deleteParam.item.push({park_use_numb : obj.park_use_numb, use_at : clicked === "restore" ? "Y" : "N"})
				});

				const param = JSON.stringify(deleteParam)

				await visitingCarMgntRepository.deleteParkingReservation(param);

				handleAlertToggle(
					"isOpen",
					clicked === "restore" ? "복구완료" : "삭제완료",
					clicked === "restore" ? "선택된 방문차량예약 정보 모두를 복구 하였습니다." : "선택된 방문차량예약 정보 모두를 삭제 하였습니다.",
					() => {
						setSelectedObjects([]);
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
				await getVisitingCars(pageInfo.page, pageInfo.size);
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	// 등록 페이지로 이동 Handler
	const handleOpenRegisterPage = event => {
		history.push(`${rootUrl}/visitingCar/edit`);
	};

	// Row 클릭시 Detail 페이지로 이동 Handler
	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/visitingCar/${obj.park_use_numb}`);
	};

	const slice = () => (0, pageInfo.size);

	// 테이블 각 Row Render 함수
	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.park_use_numb}>

			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>

			{/*동*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.dong_numb}
			</MC.TableCell>

			{/*호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.ho_numb}
			</MC.TableCell>

			{/*차량번호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{`${obj.car_numb}`}
			</MC.TableCell>

			{/*방문일시*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				<DateFormat date={obj.park_strt_dttm ? obj.park_strt_dttm : ""} format={"YYYY-MM-DD HH시"} />
				~
				<DateFormat date={obj.park_end_dttm ? obj.park_end_dttm : ""} format={"YYYY-MM-DD HH시"} />
			</MC.TableCell>

			{/*삭제여부*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{`${obj.vist_code_info}`}
			</MC.TableCell>

			{/*삭제여부*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{`${obj.use_at === "Y" ? "정상" : "삭제"}`}
			</MC.TableCell>

			{/*----------NOT USE----------*/}
			{/*등록일*/}
			{/*<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>*/}
			{/*	<DateFormat date={obj.reg_dttm} format={"YYYY-MM-DD"} />*/}
			{/*</MC.TableCell>*/}

		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"방문차량예약 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
				titleTypographyProps={{ variant: "h4" }}
				action={
					<MC.ButtonGroup
						aria-label="text primary button group"
						style={{ marginTop: 12 }}
						color="primary">
						<MC.Button
							disabled={selectedObjects.length === 0}
							style={{
								color:                  selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : "#3f51b5",
								borderColor:            selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.12)" : "#3f51b5",
								marginLeft:             10,
								borderTopLeftRadius:    4,
								borderBottomLeftRadius: 4
							}}
							onClick={(e) => handleDeleteAllClick("restore")}>
							복원
						</MC.Button>
						<MC.Button
							disabled={selectedObjects.length === 0}
							style={{
								color:                  selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.error.main,
								borderColor:            selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.12)" : palette.error.main,
								marginLeft:             10,
								borderTopLeftRadius:    4,
								borderBottomLeftRadius: 4
							}}
							onClick={(e) => handleDeleteAllClick("delete")}>
							삭제
						</MC.Button>
					</MC.ButtonGroup>
				} />

			<MC.Divider />

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"} padding={"checkbox"}>
										<MC.Checkbox
											checked={
												visitingCars ?
													(visitingCars.length === 0 ? false : selectedObjects.length === visitingCars.length) : false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0
												&& selectedObjects.length < (visitingCars ? visitingCars.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>동</MC.TableCell>
									<MC.TableCell align={"center"}>호</MC.TableCell>
									<MC.TableCell align={"center"}>차량번호</MC.TableCell>
									<MC.TableCell align={"center"}>방문일시</MC.TableCell>
									<MC.TableCell align={"center"}>방문목적</MC.TableCell>
									<MC.TableCell align={"center"}>상태</MC.TableCell>
									{/*<MC.TableCell align={"center"}>등록일</MC.TableCell>*/}
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									isLoading ?
										<MC.TableRow hover>
											<MC.TableCell colSpan={7} align="center">
												<MC.CircularProgress color="secondary"/>
											</MC.TableCell>
										</MC.TableRow>
										:
										visitingCars.length === 0 ?
											<MC.TableRow>
												<MC.TableCell colSpan={7} align="center">
													조회된 방문차량예약 데이터가 한 건도 없네요.
												</MC.TableCell>
											</MC.TableRow>
											:
											visitingCars.slice(slice).map(objView)
								}
							</MC.TableBody>

						</MC.Table>
					</div>
				</PerfectScrollbar>
			</MC.CardContent>

			<MC.Divider />
			<MC.CardActions className={classes.actions}>
				<MC.Grid
					container
					justify={"space-between"}
					alignItems={"center"}>
					<MC.Grid item>
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button onClick={handleOpenRegisterPage}>
								등록
							</MC.Button>
						</MC.ButtonGroup>
					</MC.Grid>
					<MC.Grid item>
						<MC.TablePagination
							component="div"
							count={pageInfo.total}
							labelDisplayedRows={({ from, to, count }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
							labelRowsPerPage={"페이지당 목록 수 : "}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
							ActionsComponent={TablePaginationActions}
							page={pageInfo.page}
							rowsPerPage={pageInfo.size}
							rowsPerPageOptions={[10, 15, 30, 50, 100]} />
					</MC.Grid>
				</MC.Grid>
			</MC.CardActions>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>
			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>

		</MC.Card>
	);
};

export default VisitingCarsTable;
