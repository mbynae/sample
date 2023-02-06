import React, { useState } from "react";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as ML from "@material-ui/lab";

import PhoneCallbackTwoToneIcon  from "@material-ui/icons/PhoneCallbackTwoTone";
import LocalPrintshopTwoToneIcon from "@material-ui/icons/LocalPrintshopTwoTone";

import { DateFormat, PhoneHyphen } from "../../../../../components";
import { visitingCarRepository }   from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:              {},
	content:           {
		padding: 0
	},
	nameContainer:     {
		display:    "flex",
		alignItems: "center"
	},
	actions:           {
		padding:        theme.spacing(1),
		paddingLeft:    theme.spacing(2),
		paddingRight:   theme.spacing(2),
		justifyContent: "space-between"
	},
	body5:             {
		...theme.typography.body5,
		whiteSpace: "pre-line"
	},
	formControlSelect: {
		width:  130,
		height: 36
	},
	select:            {
		paddingLeft:   13,
		paddingTop:    8,
		paddingBottom: 8
	},
	tableHead:         {
		height:          50,
		minHeight:       50,
		maxHeight:       50,
		backgroundColor: "transparent"
	},
	body4:             {
		...theme.typography.body4,
		color:      "#ffffff",
		height:     24,
		lineHeight: "24px"
	},
	tableHeadCell:     {
		height:     "50px !important",
		fontWeight: "bold",
		color:      "#222222"
	},
	tableHeadCellFont: {
		fontSize:                       14,
		width:                          "15%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width:    "50%"
		}
	},
	dotDivider:        {
		width:           "4px",
		height:          "4px",
		margin:          "8px",
		backgroundColor: "#c4c4c4"
	}
}));

const VisitingCarsTable = props => {
	const classes = useStyles();
	const {
		      className,
		      history,
		      menuKey,
		      rootUrl,
		      VisitingCarStore,
		      isMobile,
		      visitingCars,
		      getVisitingCars,
		      categories,
		      pageInfo,
		      setPageInfo,
		      staticContext,
		      handleAlertToggle,
		      setAlertOpens,
		      ...rest
	      } = props;

	const [sizeOptions] = useState([10, 15, 30, 50, 100]);
	const [selectSizeOption, setSelectSizeOption] = useState(10);

	const handleSelectSizeOption = (event) => {
		setSelectSizeOption(event.target.value);
		setPageInfo(prev => {
			return {
				...prev,
				page: 1,
				size: event.target.value
			};
		});
		getVisitingCars(1, event.target.value);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getVisitingCars(page, pageInfo.size);
	};

	const [selectedObjects, setSelectedObjects] = useState([]);
	const [isSelectAll, setIsSelectAll] = useState(false);

	const handleSelectAll = event => {
		let selectedList;
		if ( event.target ) {
			event.target.checked ? selectedList = visitingCars.map(visitingCar => visitingCar) : selectedList = [];
			setIsSelectAll(event.target.checked);
		} else {
			event ? selectedList = visitingCars.map(visitingCar => visitingCar) : selectedList = [];
			setIsSelectAll(event);
		}
		setSelectedObjects(selectedList);
	};

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

	const handleDeleteAllClick = async () => {

		let deleteParam = {item: []}

		// 선택된 데이터의 상태 값 검사
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"선택하신 방문차량예약 데이터가 모두 삭제가 됩니다. \n 정말로 데이터를 삭제하겠습니까?",
			"확인",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				await selectedObjects.map(async (obj) => {
					deleteParam.item.push({park_use_numb : obj.park_use_numb})
				});

				const param = JSON.stringify(deleteParam)

				await visitingCarRepository.deleteParkingReservation(param, true);

				handleAlertToggle(
					"isOpen",
					undefined,
					"선택된 방문차량예약 정보 모두를 삭제 하였습니다.",
					undefined,
					() => {
						setSelectedObjects([]);
						setAlertOpens(prev => { return { ...prev, isOpen: false }; });
					}
				);
				await getVisitingCars(pageInfo.page, pageInfo.size);
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);
	};

	const getTotalPage = () => {
		let totalPage = Math.floor(pageInfo.total / pageInfo.size);
		if ( pageInfo.total % pageInfo.size > 0 ) {
			totalPage++;
		}
		return totalPage;
	};

	const handleOpenRegisterPage = event => {
		history.push(`${rootUrl}/${menuKey}/edit`);
	};

	//--------------------NOT USE-----------------------//
	// const handleRowClick = (obj) => {
	// 	history.push(`${rootUrl}/${menuKey}/` + obj.park_use_numb);
	// };

	const objView = (obj, index) => (

		<MC.TableRow
			hover
			style={{ borderBottom: index === (visitingCars.length - 1) && "2px solid #222222" }}
			key={obj.park_use_numb}>

			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>

			{
				isMobile ?
					(
						<>
							{/*방문차량예약명*/}
							<MC.TableCell align={"left"} key={obj.park_use_numb}>
								<MC.Grid container direction="column" justify={"center"} alignItems={"flex-start"}>
									<MC.Grid item style={{ fontSize: 14 }}>
										<DateFormat date={obj.park_strt_dttm} format={"YYYY-MM-DD HH시"} />
										~
										<DateFormat date={obj.park_end_dttm} format={"YYYY-MM-DD HH시"} />
									</MC.Grid>
									<MC.Grid item>
										<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}>
											<MC.Grid item style={{ fontSize: 12 }}>
												차량번호 &nbsp; <span style={{ fontWeight: "normal" }}>{`${obj.car_numb}`}</span>
											</MC.Grid>
											<MC.Grid item style={{ color: "#dedede" }}>&nbsp;|&nbsp;</MC.Grid>
											<MC.Grid item style={{ fontSize: 12 }}>
												방문목적&nbsp;
												<span style={{ fontWeight: "normal" }}>
												{
													obj.vist_code === "VT" ? "세대방문" :
														obj.vist_code === "IS" ? "기타" :
															obj.vist_code === "GT" && obj.vist_purp
												}
												</span>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
									<MC.Grid item>
										등록일 <span style={{ fontWeight: "normal" }}><DateFormat date={obj.reg_dttm} format={"YYYY.MM.DD"} /></span>
									</MC.Grid>
								</MC.Grid>
							</MC.TableCell>
						</>
					)
					:
					(
						<>
							{/*방문일시*/}
							<MC.TableCell align={"left"} key={obj.park_use_numb}>
								<DateFormat date={obj.park_strt_dttm} format={"YYYY-MM-DD HH시"} />
								~
								<DateFormat date={obj.park_end_dttm} format={"YYYY-MM-DD HH시"} />
							</MC.TableCell>

							{/*차량번호*/}
							<MC.TableCell align={"center"}>
								{`${obj.car_numb}`}
							</MC.TableCell>

							{/*방문목적*/}
							<MC.TableCell align={"center"}>
								{
									obj.vist_code === "VT" ? "세대방문" :
										obj.vist_code === "IS" ? "기타" :
											obj.vist_code === "GT" && obj.vist_purp
								}
							</MC.TableCell>

							{/*등록일*/}
							<MC.TableCell
								style={{}}
								align={"center"}>
								<DateFormat date={obj.reg_dttm} format={"YYYY.MM.DD"} />
							</MC.TableCell>
						</>
					)
			}

		</MC.TableRow>
	);

	return (
		<div
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"flex-end"} style={{ marginTop: 30 }}>
				<MC.Grid item>
					<MC.Typography className={classes.body5}>
						총&nbsp;
						<span style={{ color: "#449CE8" }}>
							{pageInfo.total}
						</span>
						개의 방문예약이 있습니다.
					</MC.Typography>
				</MC.Grid>
				<MC.Grid item>
					<MC.FormControl variant="outlined" className={classes.formControlSelect}>
						<MC.Select
							id="sizeOptions"
							name="sizeOptions"
							value={selectSizeOption}
							className={clsx(classes.formControlSelect, classes.body5)}
							classes={{
								select: classes.select
							}}
							onChange={handleSelectSizeOption}>
							{
								sizeOptions.map((so, index) => (
									<MC.MenuItem key={index} value={so}>{`${so} 개씩 보기`}</MC.MenuItem>
								))
							}
						</MC.Select>
					</MC.FormControl>
				</MC.Grid>
			</MC.Grid>

			<MC.Table style={{ marginTop: 16 }}>
				<MC.TableHead className={classes.tableHead}>
					{
						isMobile ?
							(
								<MC.TableRow className={classes.tableRow} style={{ borderTop: "2px solid #222222" }}>
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
									<MC.TableCell
										className={clsx(classes.body4, classes.tableHeadCell)}
										align={"left"}
										onClick={() => handleSelectAll(!isSelectAll)}>
										전체선택
									</MC.TableCell>
								</MC.TableRow>
							)
							:
							(
								<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
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
									<MC.TableCell className={clsx(classes.body4, classes.tableHeadCell)} align={"center"}>방문일시</MC.TableCell>
									<MC.TableCell
										className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
										align={"center"}>
										차량번호
									</MC.TableCell>
									<MC.TableCell
										className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
										align={"center"}>
										방문목적
									</MC.TableCell>
									<MC.TableCell
										className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
										align={"center"}>
										등록일
									</MC.TableCell>
								</MC.TableRow>
							)
					}

				</MC.TableHead>
				<MC.TableBody>
					{
						visitingCars ?
							(
								visitingCars.length === 0 ?
									<MC.TableRow>
										<MC.TableCell colSpan={isMobile ? 2 : 5} align="center">
											조회된 방문차량예약 데이터가 한 건도 없네요.
										</MC.TableCell>
									</MC.TableRow>
									:
									visitingCars.map(objView)
							)
							:
							<MC.TableRow>
								<MC.TableCell colSpan={isMobile ? 2 : 5} align="center">
									<MC.CircularProgress color="secondary" />
								</MC.TableCell>
							</MC.TableRow>
					}
				</MC.TableBody>
			</MC.Table>

			<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}
			         style={{ width: "100%", marginTop: 40 }}>
				<MC.Button
					size="large"
					disabled={selectedObjects.length === 0}
					disableElevation
					style={{ padding: 0, borderRadius: 0, width: isMobile? "44%" : 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)", marginRight: 10 }}
					onClick={handleDeleteAllClick}>
					삭제
				</MC.Button>
				<MC.Button
					variant="contained"
					size="large"
					color="primary"
					disableElevation
					style={{ padding: 0, borderRadius: 0, width: isMobile? "44%" : 140, height: 40 }}
					onClick={handleOpenRegisterPage}>
					등록
				</MC.Button>
			</MC.Grid>

			<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", marginTop: 49 }}>
				<ML.Pagination
					count={getTotalPage()}
					page={pageInfo.page}
					onChange={handlePageChange}
					showFirstButton
					showLastButton />
			</MC.Grid>

		</div>
	);
};

export default VisitingCarsTable;
