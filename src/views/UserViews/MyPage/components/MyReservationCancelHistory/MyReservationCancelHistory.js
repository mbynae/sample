import React, { useState, useEffect } from "react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";
import PerfectScrollbar               from "react-perfect-scrollbar";
import { resrvHistRepository }        from "../../../../../repositories";
import { withRouter }                 from "react-router-dom";
import { inject, observer }           from "mobx-react";
import { TablePaginationActions }     from "../../../../../components";
import NumberFormat                   from "react-number-format";
import moment                         from "moment";

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

const MyReservationCancelHistory = props => {
	const classes = useStyles();

	const {SignInStore, value, setAlertOpens, handleAlertToggle} = props;
	const [tabNumb, setTabNumb] = useState(0);	// 예약현황 유형(0:시설, 1:강좌)
	const [revCancelHistoryList, setRevCancelHistoryList] = useState([]);
	const [rootUrl, setRootUrl] = useState("");

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
			await generateRootUrl();
			await getMyRevCancelHistory();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};


	// 탭 변경 시 시설 또는 강좌 예약내역 호출
	useEffect(() => {
		getMyRevCancelHistory();
	}, [tabNumb])

	const handleChange = (event, newValue) => {
		setTabNumb(newValue);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getMyRevCancelHistory(page, pageInfo.size);
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
		getMyRevCancelHistory(0, event.target.value);
	};

	const getMyRevCancelHistory = (page, size) => {
		let fclt_code = tabNumb === 0 ? "0000" : "9000"
		resrvHistRepository.getRevCancelHistoryList(fclt_code,{
			page: page ? page : 0,
			size: size ? size : 10,
			sort:'DESC'
		}).then(result => {
			setRevCancelHistoryList(result.data_json_array);
			setPageInfo(result.paginginfo)
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
					getMyRevCancelHistory(1, 10);
				});
			},
			"아니오",
			() => {
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);
	}

	return (
		<div hidden={value !== 5} className={classes.root}>

			<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>

				<MC.Grid item style={{ width: "100%", marginTop: 45 }}>
					<MC.AppBar position="static">
						<MC.Tabs
							value={tabNumb}
							onChange={handleChange}
							aria-label="simple tabs example"
							style={{ backgroundColor: "#fff" }}
							textColor="primary">
							<MC.Tab label="시설환불현황" {...a11yProps(0)} />
							<MC.Tab label="강좌환불현황" {...a11yProps(1)} />
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
													<MC.TableCell align={"center"}>취소일</MC.TableCell>
													<MC.TableCell align={"center"}>환불금액</MC.TableCell>
												</MC.TableRow>
											</MC.TableHead>
											<MC.TableBody>
												{
													revCancelHistoryList && revCancelHistoryList.length > 0 ?
														(
															revCancelHistoryList.map((revCancelHistory, index) => (
																<MC.TableRow key={index} hover>
																	<MC.TableCell align="center">{revCancelHistory.prgm_name}</MC.TableCell>
																	<MC.TableCell align="center">
																		{revCancelHistory.rsvt_strt_date} {(revCancelHistory.rsvt_strt_date && revCancelHistory.rsvt_end_date) && "~"} {revCancelHistory.rsvt_end_date}
																	</MC.TableCell>
																	<MC.TableCell align="center">
																		{revCancelHistory.prgm_strt_time && (revCancelHistory.prgm_strt_time.substring(0, 5))}
																		{(revCancelHistory.prgm_strt_time && revCancelHistory.prgm_end_time) && " ~ "}
																		{revCancelHistory.prgm_end_time && (revCancelHistory.prgm_end_time.substring(0, 5))}
																	</MC.TableCell>
																	<MC.TableCell align="center">{revCancelHistory.detl_info && revCancelHistory.detl_info.substring(0, 2)}</MC.TableCell>
																	<MC.TableCell align="center">{revCancelHistory.pymt_amt == null || revCancelHistory.pymt_amt == "0.00" ? "0" : <NumberFormat value={Math.floor(revCancelHistory.pymt_amt)} displayType={'text'} thousandSeparator={true} />}</MC.TableCell>
																	<MC.TableCell align="center">{moment(revCancelHistory.rfnd_dttm).format("YYYY-MM-DD")}</MC.TableCell>
																	<MC.TableCell align="center">{revCancelHistory.rfnd_amt == null || revCancelHistory.rfnd_amt == "0.00" ? "0" : <NumberFormat value={Math.floor(revCancelHistory.rfnd_amt)} displayType={'text'} thousandSeparator={true} />}</MC.TableCell>
																</MC.TableRow>
															))
														)
														:
														(
															<MC.TableRow hover>
																<MC.TableCell colSpan={7} align="center">
																	조회된 취소/환불 내역이 없습니다.
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
													<MC.TableCell align={"center"}>금액(원)</MC.TableCell>
													<MC.TableCell align={"center"}>취소일</MC.TableCell>
													<MC.TableCell align={"center"}>환불금액</MC.TableCell>
												</MC.TableRow>
											</MC.TableHead>
											<MC.TableBody>
												{
													revCancelHistoryList && revCancelHistoryList.length > 0 ?
														(
															revCancelHistoryList.map((revCancelHistory, index) => (
																<MC.TableRow key={index} hover>
																	<MC.TableCell align="center">{revCancelHistory.prgm_name}</MC.TableCell>
																	<MC.TableCell align="center">
																		{revCancelHistory.rsvt_strt_date} {(revCancelHistory.rsvt_strt_date && revCancelHistory.rsvt_end_date) && "~"} {revCancelHistory.rsvt_end_date}
																	</MC.TableCell>
																	<MC.TableCell align="center">
																		{revCancelHistory.prgm_strt_time && (revCancelHistory.prgm_strt_time.substring(0, 5))}
																		{(revCancelHistory.prgm_strt_time && revCancelHistory.prgm_end_time) && " ~ "}
																		{revCancelHistory.prgm_end_time && (revCancelHistory.prgm_end_time.substring(0, 5))}
																	</MC.TableCell>
																	<MC.TableCell align="center">{revCancelHistory.pymt_amt == null || revCancelHistory.pymt_amt == "0.00" ? "0" : <NumberFormat value={Math.floor(revCancelHistory.pymt_amt)} displayType={'text'} thousandSeparator={true} />}</MC.TableCell>
																	<MC.TableCell align="center">{revCancelHistory.rfnd_dttm}</MC.TableCell>
																	<MC.TableCell align="center">{revCancelHistory.rfnd_amt == null || revCancelHistory.rfnd_amt == "0.00" ? "0" : <NumberFormat value={Math.floor(revCancelHistory.rfnd_amt)} displayType={'text'} thousandSeparator={true} />}</MC.TableCell>
																</MC.TableRow>
															))
														)
														:
														(
															<MC.TableRow hover>
																<MC.TableCell colSpan={7} align="center">
																	조회된 취소/환불 내역이 없습니다.
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

export default inject("SignInStore","UserSignInStore", "UserAptComplexStore", "ResidentReservationStore")(withRouter(observer(MyReservationCancelHistory)));
