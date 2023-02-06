import React, { useState, useEffect } from "react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";
import PerfectScrollbar               from "react-perfect-scrollbar";
import { resrvHistRepository }        from "../../../../../repositories";
import palette                        from "../../../../../theme/adminTheme/palette";
import { withRouter }                 from "react-router-dom";
import { inject, observer }           from "mobx-react";
import { TablePaginationActions }     from "../../../../../components";
import NumberFormat                   from "react-number-format";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		width:                          "100%",
		[theme.breakpoints.down("xs")]: {
			width:    "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin:   0
		},
		minHeight: "500px"
	},
	inner: {
		minWidth: 1148
	},
}));

const MyReservationHistory = props => {

	const classes = useStyles();

	const { value, setAlertOpens, handleAlertToggle, history, reserveMenu, rootUrl} = props;
	const [tabNumb, setTabNumb] = useState(parseInt(reserveMenu));	// 예약현황 유형(0:시설, 1:강좌)
	const [revHistoryList, setRevHistoryList] = useState([]);

	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});

	const a11yProps = index => {
		return {
			id:              `tab-${index}`,
			"aria-controls": `tabpanel-${index}`
		};
	};

	function TabPanel(props) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<MC.Box p={0}>
						<div>{children}</div>
					</MC.Box>
				)}
			</div>
		);
	}

	useEffect(() => {
		const init = async () => {
			await getMyRevHistory();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	// 탭 변경 시 시설 또는 강좌 예약내역 호출
	useEffect(() => {
		getMyRevHistory();
	}, [tabNumb])

	const handleChange = (event, newValue) => {
		setTabNumb(newValue);

		history.push(rootUrl + "/myPage/" + value + "/" + newValue)
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getMyRevHistory(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value,
				sort:'DESC'
			};
		});
		getMyRevHistory(0, event.target.value);
	};

	const getMyRevHistory = (page, size) => {
		let fclt_code = tabNumb === 0 ? "0000" : "9000"
		resrvHistRepository.getRevHistoryList(fclt_code,{
			page: page ? page : 0,
			size: size ? size : 10,
			sort:'DESC'
		}).then(result => {
			setRevHistoryList(result.data_json_array);
			setPageInfo(result.paginginfo);
		});
	}

	const getTotalPage = () => {
		let totalPage = Math.floor(pageInfo.total / pageInfo.size);
		if ( pageInfo.total % pageInfo.size > 0 ) {
			totalPage++;
		}
		return totalPage;
	};

	function handleDetailClick(obj){
		if(obj.rsvt_stat=="2030"){
			handleAlertToggle(
				"isOpen",
				undefined,
				"예약 완료된 상품입니다. 관리사무소에 문의해 주시기 바랍니다.",
				undefined,
				() => {
					setAlertOpens(prev => { return { ...prev, isOpen: false }; });
				}
			);
			return false;
		}

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			`취소를 진행 하시겠습니까?`,
			"예",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				let param = {
					item:[
						{
							prgm_numb: obj.prgm_numb,
							rsvt_numb: obj.rsvt_numb
						}
					]
				};

				const resrvHistorySearchMypage = resrvHistRepository.getResrvDeleteUpdate(param,"N");

				resrvHistorySearchMypage.then((data) => {
					getMyRevHistory(0, 10);
				});
			},
			"아니오",
			() => {
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);
	}

	function autoHypenPhone(str){
		str = str.replace(/[^0-9]/g, '');
		var tmp = '';
		if( str.length < 4){
			return str;
		}else if(str.length < 7){
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3);
			return tmp;
		}else if(str.length < 11){
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3, 3);
			tmp += '-';
			tmp += str.substr(6);
			return tmp;
		}else{
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3, 4);
			tmp += '-';
			tmp += str.substr(7);
			return tmp;
		}
		return str;
	}

	return (
		<div hidden={value !== 4} className={classes.root}>

			<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>

				<MC.Grid item style={{ width: "100%", marginTop: 45 }}>
					<MC.AppBar position="static">
						<MC.Tabs
							value={tabNumb}
							onChange={handleChange}
							aria-label="simple tabs example"
							style={{ backgroundColor: "#fff" }}
							textColor="primary">
							<MC.Tab label="시설예약현황" {...a11yProps(0)} />
							<MC.Tab label="강좌예약현황" {...a11yProps(1)} />
						</MC.Tabs>
					</MC.AppBar>

					<TabPanel value={tabNumb} index={0}>
						<MC.Card style={{ overflow: "visible", minHeight: 400}}>
							<MC.CardContent>
								<PerfectScrollbar>
									<div className={classes.inner}>
										<MC.Table size="medium">
											<MC.TableHead>
												<MC.TableRow>
													<MC.TableCell align={"center"}>시설명</MC.TableCell>
													<MC.TableCell align={"center"}>기간</MC.TableCell>
													<MC.TableCell align={"center"}>시간</MC.TableCell>
													<MC.TableCell align={"center"}>좌석</MC.TableCell>
													<MC.TableCell align={"center"}>금액(원)</MC.TableCell>
													<MC.TableCell align={"center"}>상태</MC.TableCell>
													<MC.TableCell align={"center"}>관리</MC.TableCell>
												</MC.TableRow>
											</MC.TableHead>
											<MC.TableBody>
												{
													revHistoryList && revHistoryList.length > 0 ?
														(
															revHistoryList.map((revHistory, index) => (
																<MC.TableRow key={index} hover>
																	<MC.TableCell align="center">{revHistory.prgm_name}</MC.TableCell>
																	<MC.TableCell align="center">
																		{revHistory.rsvt_strt_date} {(revHistory.rsvt_strt_date && revHistory.rsvt_end_date) && "~"} {revHistory.rsvt_end_date}
																	</MC.TableCell>
																	<MC.TableCell align="center">
																		{/*{revHistory.rsvt_strt_time && (revHistory.rsvt_strt_time.substring(0, 2) + "시 " + revHistory.rsvt_strt_time.substring(3, 5) + "분")}*/}
																		{revHistory.rsvt_strt_time && (revHistory.rsvt_strt_time.substring(0, 5))}
																		{(revHistory.rsvt_strt_time && revHistory.rsvt_strt_time) && " ~ "}
																		{/*{revHistory.rsvt_end_time && (revHistory.rsvt_end_time.substring(0, 2) + "시 " + revHistory.rsvt_end_time.substring(3, 5) + "분")}*/}
																		{revHistory.rsvt_end_time && (revHistory.rsvt_end_time.substring(0, 5))}
																	</MC.TableCell>
																	<MC.TableCell align="center">{revHistory.detl_numb}{revHistory.detl_numb && "번"}</MC.TableCell>
																	<MC.TableCell align="center">{revHistory.pymt_amt == null || revHistory.pymt_amt == "0.00" ? "0" : <NumberFormat value={Math.floor(revHistory.pymt_amt)} displayType={'text'} thousandSeparator={true} />}</MC.TableCell>
																	<MC.TableCell align="center">{revHistory.rstatus}</MC.TableCell>
																	<MC.TableCell align="center">
																		{revHistory.rsvt_stat == "2010" ? <MC.Button
																			style={{
																				color:                  palette.error.main,
																				borderColor:            palette.error.main,
																				marginLeft:             10,
																				borderTopLeftRadius:    4,
																				borderBottomLeftRadius: 4
																			}}
																			onClick={() =>handleDetailClick(revHistory)}>
																			취소
																		</MC.Button> : revHistory.rsvt_stat == "2020" ? <MC.Button
																			style={{
																				color:                  palette.error.main,
																				borderColor:            palette.error.main,
																				marginLeft:             10,
																				borderTopLeftRadius:    4,
																				borderBottomLeftRadius: 4
																			}}
																			onClick={() =>handleDetailClick(revHistory)}>
																			취소
																		</MC.Button> : revHistory.rsvt_stat == "2030" ? <MC.Button
																			style={{
																				color:                  palette.error.main,
																				borderColor:            palette.error.main,
																				marginLeft:             10,
																				borderTopLeftRadius:    4,
																				borderBottomLeftRadius: 4
																			}}
																			onClick={() =>handleDetailClick(revHistory)}>
																			취소
																		</MC.Button> : ""}
																	</MC.TableCell>
																</MC.TableRow>
															))
														)
														:
														(
															<MC.TableRow hover>
																<MC.TableCell colSpan={7} align="center">
																	조회된 시설예약 내역이 없습니다.
																</MC.TableCell>
															</MC.TableRow>
														)
												}
											</MC.TableBody>
										</MC.Table>
									</div>
								</PerfectScrollbar>
							</MC.CardContent>
						</MC.Card>
					</TabPanel>

					<TabPanel value={tabNumb} index={1}>
						<MC.Card style={{ overflow: "visible", minHeight: 400}}>
							<MC.CardContent>
								<PerfectScrollbar>
									<div className={classes.inner}>
										<MC.Table size="medium">
											<MC.TableHead>
												<MC.TableRow>
													<MC.TableCell align={"center"}>강좌명</MC.TableCell>
													<MC.TableCell align={"center"}>기간</MC.TableCell>
													<MC.TableCell align={"center"}>시간</MC.TableCell>
													<MC.TableCell align={"center"}>문의처</MC.TableCell>
													<MC.TableCell align={"center"}>금액(원)</MC.TableCell>
													<MC.TableCell align={"center"}>상태</MC.TableCell>
													<MC.TableCell align={"center"}>관리</MC.TableCell>
												</MC.TableRow>
											</MC.TableHead>
											<MC.TableBody>
												{
													revHistoryList && revHistoryList.length > 0 ?
														(
															revHistoryList.map((revHistory, index) => (
																<MC.TableRow key={index} hover>
																	<MC.TableCell align="center">{revHistory.prgm_name}</MC.TableCell>
																	<MC.TableCell align="center">
																		{revHistory.rsvt_strt_date} {(revHistory.rsvt_strt_date && revHistory.rsvt_end_date) && "~"} {revHistory.rsvt_end_date}
																	</MC.TableCell>
																	<MC.TableCell align="center">
																		{/*{revHistory.rsvt_strt_time && (revHistory.rsvt_strt_time.substring(0, 2) + "시 " + revHistory.rsvt_strt_time.substring(3, 5) + "분")}*/}
																		{revHistory.rsvt_strt_time && (revHistory.rsvt_strt_time.substring(0, 5))}
																		{(revHistory.rsvt_strt_time && revHistory.rsvt_strt_time) && " ~ "}
																		{/*{revHistory.rsvt_end_time && (revHistory.rsvt_end_time.substring(0, 2) + "시 " + revHistory.rsvt_end_time.substring(3, 5) + "분")}*/}
																		{revHistory.rsvt_end_time && (revHistory.rsvt_end_time.substring(0, 5))}
																	</MC.TableCell>
																	<MC.TableCell align="center">{autoHypenPhone(revHistory.oprt_teln)}</MC.TableCell>
																	<MC.TableCell align="center">{revHistory.pymt_amt == null || revHistory.pymt_amt == "0.00" ? "0" : <NumberFormat value={Math.floor(revHistory.pymt_amt)} displayType={'text'} thousandSeparator={true} />}</MC.TableCell>
																	<MC.TableCell align="center">{revHistory.rstatus}</MC.TableCell>
																	<MC.TableCell align="center">
																		{revHistory.rsvt_stat == "2010" ? <MC.Button
																			style={{
																				color:                  palette.error.main,
																				borderColor:            palette.error.main,
																				marginLeft:             10,
																				borderTopLeftRadius:    4,
																				borderBottomLeftRadius: 4
																			}}
																			onClick={() =>handleDetailClick(revHistory)}>
																			취소
																		</MC.Button> : revHistory.rsvt_stat == "2020" ? <MC.Button
																			style={{
																				color:                  palette.error.main,
																				borderColor:            palette.error.main,
																				marginLeft:             10,
																				borderTopLeftRadius:    4,
																				borderBottomLeftRadius: 4
																			}}
																			onClick={() =>handleDetailClick(revHistory)}>
																			취소
																		</MC.Button> : revHistory.rsvt_stat == "2030" ? <MC.Button
																			style={{
																				color:                  palette.error.main,
																				borderColor:            palette.error.main,
																				marginLeft:             10,
																				borderTopLeftRadius:    4,
																				borderBottomLeftRadius: 4
																			}}
																			onClick={() =>handleDetailClick(revHistory)}>
																			취소
																		</MC.Button> : ""}
																	</MC.TableCell>
																</MC.TableRow>
															))
														)
														:
														(
															<MC.TableRow hover>
																<MC.TableCell colSpan={7} align="center">
																	조회된 강좌예약 내역이 없습니다.
																</MC.TableCell>
															</MC.TableRow>
														)
												}
											</MC.TableBody>
										</MC.Table>
									</div>
								</PerfectScrollbar>
							</MC.CardContent>
						</MC.Card>
					</TabPanel>
				</MC.Grid>

				<MC.Grid item style={{ width: "100%", marginTop: 30 }}>
					<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
						<MC.TablePagination
							component="div"
						  labelDisplayedRows={({ from, to, count }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
							labelRowsPerPage={"페이지당 목록 수 : "}
							count={pageInfo.total}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
							ActionsComponent={TablePaginationActions}
							page={pageInfo.page}
							rowsPerPage={pageInfo.size}
							rowsPerPageOptions={[10, 15, 30, 50, 100]}/>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
		</div>
	);
};

export default inject("SignInStore","UserSignInStore", "UserAptComplexStore", "ResidentReservationStore")(withRouter(observer(MyReservationHistory)));
