import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, TablePaginationActions } from "../../../../../components";

import palette                   from "../../../../../theme/adminTheme/palette";
import { parkingMgntRepository } from "../../../../../repositories";

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

const ParkingCarMgntTable = props => {
	const classes = useStyles();

	const { className, history, menuKey, rootUrl, parkingCars, getParkingCars, pageInfo, setPageInfo, staticContext, isLoading, ...rest } = props;
	const [selectedObjects, setSelectedObjects] = useState([]);

	// 체크박스 전체 선택 Handler
	const handleSelectAll = event => {
		let selectedList;
		event.target.checked ? selectedList = parkingCars.map(parkingCar => parkingCar) : selectedList = [];
		setSelectedObjects(selectedList);
	}

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
	}

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
		getParkingCars(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getParkingCars(0, event.target.value);
	};

	// 등록 페이지로 이동 Handler
	const handleOpenRegisterPage = event => {
		history.push(`${rootUrl}/parkingCarMgnt/edit`);
	};

	// Row 클릭시 Detail 페이지로 이동 Handler
	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/parkingCarMgnt/${obj.park_car_numb}`);
	};

	// 전체 삭제 Handler
	const handleDeleteAllClick = async () => {

		let deleteParam = {item: []}

		// 선택된 데이터의 상태 값 검사
		handleAlertToggle(
			"isConfirmOpen",
			"등록차량 삭제",
			"선택하신 등록차량 데이터가 모두 삭제가 됩니다. \n 정말로 데이터를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				await selectedObjects.map(async (obj) => {
					deleteParam.item.push({park_car_numb : obj.park_car_numb})
				});

				const param = JSON.stringify(deleteParam)

				await parkingMgntRepository.deleteParkingReservation(param);

				handleAlertToggle(
					"isOpen",
					"삭제완료",
					"선택된 등록차량 정보 모두를 삭제 하였습니다.",
					() => {
						setSelectedObjects([]);
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
				await getParkingCars(pageInfo.page, pageInfo.size);
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	const slice = () => (0, pageInfo.size);

	// 테이블 각 Row Render 함수
	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.park_car_numb}>

			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>

			{/*동*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.dong_numb}
			</MC.TableCell>

			{/*호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.ho_numb}
			</MC.TableCell>

			{/*차량번호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{!`${obj.car_numb}`.includes("null") ? `${obj.car_numb}` : ""}
			</MC.TableCell>

			{/*차량이름*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{!`${obj.park_type_info}`.includes("null") ? `${obj.park_type_info}` : ""}
			</MC.TableCell>

			{/*차량 사이즈*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{`${obj.car_clss_info}`}
			</MC.TableCell>

			{/*차량 타입*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{`${obj.car_type_info}`}
			</MC.TableCell>

		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"차량 정보"}
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
								color:                  selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.error.main,
								borderColor:            selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.12)" : palette.error.main,
								marginLeft:             10,
								borderTopLeftRadius:    4,
								borderBottomLeftRadius: 4
							}}
							onClick={handleDeleteAllClick}>
							삭제
						</MC.Button>
					</MC.ButtonGroup>
				} />

			<MC.Divider />

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							{/*테이블 헤더 표시 - 동, 호, 차량번호, 차량 이름, 차량 크기, 차량 종류*/}
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"} padding={"checkbox"}>
										<MC.Checkbox
											checked={
												parkingCars ?
													(parkingCars.length === 0 ? false : selectedObjects.length === parkingCars.length) : false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0
												&& selectedObjects.length < (parkingCars ? parkingCars.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>동</MC.TableCell>
									<MC.TableCell align={"center"}>호</MC.TableCell>
									<MC.TableCell align={"center"}>차량번호</MC.TableCell>
									<MC.TableCell align={"center"}>차량구분</MC.TableCell>
									<MC.TableCell align={"center"}>차량크기</MC.TableCell>
									<MC.TableCell align={"center"}>차량종류</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>

							{/*테이블 바디 표시 - objView 함수 사용*/}
							<MC.TableBody>
								{
									!isLoading ?
										(
											parkingCars.length === 0 ?
												<MC.TableRow>
													<MC.TableCell colSpan={7} align="center">
														조회된 등록주차차량 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												parkingCars.slice(slice).map(objView)
										)
										:
										<MC.TableRow>
											<MC.TableCell colSpan={7} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
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
}

export default ParkingCarMgntTable;
