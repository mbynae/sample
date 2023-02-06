import React, { useState, useEffect }                    from "react";
import { inject, observer }                              from "mobx-react";
import * as MC                                           from "@material-ui/core";
import * as MS                                           from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog }             from "../../../components";
import { ResrvMgntSearchBar, ResrvForm, ResrvMgntTable } from "./components";
import palette                                           from "../../../theme/adminTheme/palette";
import { toJS }                                          from "mobx";
import { resrvHistRepository, userMgntRepository }       from "../../../repositories";
import moment                                            from "moment";

const useStyles = MS.makeStyles(theme => ({
	root: {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	},
	buttonLayoutRight: {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "center"
	},
	divider: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	paper: {
		padding: theme.spacing(2)
	},
}));


const ResrvMgnt = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, UserMgntStore, history } = props;
	const [rootUrl, setRootUrl] = useState("");
	const [selectedUser, setSelectedUser] = useState({});
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "예약관리",
			href: `${rootUrl}/dashboard`
		},
		{
			title: "예약하기",
			href: `${rootUrl}/reservation`
		}
	]);

	const [tab, setTab] = useState(0); // 시설, 강좌 Tab

	// Date Handler
	const getDate = (date, isFrom) => moment(date).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if (!isFrom) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 2);
		}
		return date;
	};

	const [userMgnts, setUserMgnts] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page: UserMgntStore.pageInfo.page,
		size: UserMgntStore.pageInfo.size,
		total: UserMgntStore.pageInfo.total
	});
	const [isOpen, setIsOpen] = useState(false);	// 예약 폼 공개 여부
	const [expanded, setExpanded] = useState(false);	// 검색필터 공개 여부
	const [tableExpanded, setTableExpanded] = useState(true);

	// 입력된 Reservation Info
	const [reservationInfo, setReservationInfo] = useState({
		facility: "",
		ticket: "",
		additional: "",
		rsvt_strt_date: dateInit(true),
		rsvt_strt_time: "09",
		rsvt_end_date: dateInit(false),
		rsvt_end_time: "18"
	});
	// Validation
	const [errors, setErrors] = useState({
		facility: false,
		ticket: false,
		additional: false,
		detl_numb: false,
		rsvt_strt_time: false,
		rsvt_end_time: false
	});

	const [selectedMembNumb, setSelectedMembNumb] = useState(""); // 선택된 유저의 멤버 번호
	const [fcltAdditionalFlag, setFcltAdditionalFlag] = useState(false); // 추가상품 여부에 따른 Flag
	const [prtmClss, setPrtmClss] = useState(""); // 이용권 유형 - 10: 일회, 20: 시간, 40: 일간, 60: 월간

	// 좌석 리스트 조회 - Only 시설
	const [seatList, setSeatList] = useState([]);
	const [selectedSeat, setSelectedSeat] = useState(-1);
	const [seatListFlag, setSeatListFlag] = useState(false);
	const getSeatList = (prgm_numb, prtm_clss, buttonClicked) => {

		let params = {
			//prgm_numb: fcltAdditionalFlag ? reservationInfo.ticket.split("|")[0] : reservationInfo.additional.split("|")[0],
			prgm_numb: prgm_numb,
			seachtype: "DAY"
		};
		if (prtm_clss === "10" || prtm_clss === "20" || prtm_clss === "40" || prtm_clss === "60") {
			params = {
				...params,
				seachdate: moment(reservationInfo.rsvt_strt_date).format("YYYY-MM-DD"),
				seachtype: "DAY"
			};
		}
		if (prtm_clss === "10" || prtm_clss === "20") {
			params = {
				...params,
				seachtype: "HOUR",
				seachtime: reservationInfo.rsvt_strt_time + ":00:00"
			};
		}

		const paramJson = JSON.stringify(params);

		resrvHistRepository.getSeatList(paramJson)
			.then(result => {
				setSeatListFlag(true);
				if (prtm_clss === "10" || prtm_clss === "20") {
					// 시작시간 기준로 좌석 현황 조회
					setSeatList(result.data_json.timedetail[0].rsvtseatdetail);
				} else {
					// 시작일 기준으로 좌석 현황 조회
					setSeatList(result.data_json.daydetail[0].rsvtseatdetail);
				}
			}).catch(e => {
			setSeatListFlag(false);
			if (buttonClicked) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"좌석이 등록되지 않았습니다. \n 좌석 선택을 제외하고 진행해주세요.",
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					}
				);
			}
		});
	};

	// 세부 강좌 리스트 조회 - Only 강좌
	const [selectedCourse, setSelectedCourse] = useState(-1); // 선택된 강좌 아이템
	const [courseAdditionalList, setCourseAdditionalList] = useState([]); // 강좌 리스트
	// 추가상품 정보 조회
	const getCourseAdditionalList = (value) => {
		resrvHistRepository.getFcltSearch({ memb_numb: selectedMembNumb }, "rsvtprgmlistload/" + value)
			.then(result => {
				setCourseAdditionalList(result.data_json_array);
			});
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle()
	});

	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn: () => noCallback()
				};
			}
		);
	};

	const handleGoBack = () => {
		setSelectedUser({});
		setIsOpen(false);
		setExpanded(false);
		setTableExpanded(true);
	};

	const handleReserve = () => {

		let addParam = {};

		// 시설 Submit
		if (tab === 0) {
			addParam.fclt_code = "0000";
			addParam.fclt_numb = reservationInfo.facility;
			addParam.prgm_numb = fcltAdditionalFlag ? reservationInfo.ticket.split("|")[0] : reservationInfo.additional.split("|")[0];
			addParam.memb_numb = selectedMembNumb;

			if (prtmClss === "10" || prtmClss === "20" || prtmClss === "60") {
				addParam.rsvt_strt_time = reservationInfo.rsvt_strt_time + ":00:00"; // 예약 시작 시간
				addParam.rsvt_end_time = reservationInfo.rsvt_end_time + ":59:59"; // 예약 종료 시간
			}
			if (prtmClss === "40" || prtmClss === "60") {
				addParam.rsvt_end_date = moment(reservationInfo.rsvt_end_date).format("YYYY-MM-DD"); // 예약 종료 날짜
			}
			if (prtmClss === "10" || prtmClss === "20" || prtmClss === "40" || prtmClss === "60") {
				addParam.rsvt_strt_date = moment(reservationInfo.rsvt_strt_date).format("YYYY-MM-DD"); // 예약 시작 날짜
			}
			if (selectedSeat !== -1) {
				addParam.detl_numb = selectedSeat; // 좌석
			}

			const params = JSON.stringify(addParam);

			// Validation Check
			if (reservationInfo.facility === "" || reservationInfo.ticket === "" || (!fcltAdditionalFlag && reservationInfo.additional === "")
				|| errors.rsvt_strt_time === true || errors.rsvt_end_time === true) {
				setErrors(prev => {
					return {
						...prev,
						facility: reservationInfo.facility === "",
						ticket: reservationInfo.ticket === "",
						additional: reservationInfo.additional === ""
					};
				});
			}
			// 좌석 선택 안했을 경우
			else if (seatListFlag && selectedSeat === -1) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"좌석을 선택해주세요.",
					() => {
						setErrors(prev => {
							return {
								...prev,
								detl_numb: selectedSeat === -1
							};
						});
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					}
				);
			} else {
				handleAlertToggle(
					"isConfirmOpen",
					undefined,
					"선택하신 정보로 예약 신청을 하시겠습니까?",
					async () => {
						await setAlertOpens(prev => {
							return { ...prev, isConfirmOpen: false };
						});
						resrvHistRepository
							.addReservationInsert("", params, false)
							.then(result => {
								handleAlertToggle(
									"isOpen",
									undefined,
									"신청되었습니다.\n관리사무소에서 확인 후 최종 예약이 진행됩니다.",
									() => {
										setAlertOpens(prev => {
											return { ...prev, isOpen: false };
										});
										history.push(`${rootUrl}/resrvHist`);
									}
								);
							}).catch(e => {
							handleAlertToggle(
								"isOpen",
								e.msg,
								e.errormsg + "\n",
								() => {
									setAlertOpens(prev => {
										return { ...prev, isOpen: false };
									});
								},
								undefined
							);
						});
					},
					() => {
						setAlertOpens(prev => {
							return { ...prev, isConfirmOpen: false };
						});
					}
				);
			}
		}

		// 강좌 Submit
		else {

			// Validation Check
			if (reservationInfo.facility === "" || reservationInfo.ticket === "") {
				setErrors(prev => {
					return {
						...prev,
						facility: reservationInfo.facility === "",
						ticket: reservationInfo.ticket === ""
					};
				});
			}
			// 세부 강좌 선택 안했을 경우 Check
			else if (selectedCourse === -1) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"강좌를 선택해주세요.",
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					}
				);
			} else {

				const selectedCourseObj = courseAdditionalList[selectedCourse];

				addParam.fclt_code = "0000";
				addParam.fclt_numb = reservationInfo.facility;
				addParam.memb_numb = selectedMembNumb;
				addParam.prgm_numb = selectedCourseObj.prgm_numb;
				addParam.rsvt_strt_date = selectedCourseObj.prgm_strt_date;
				addParam.rsvt_end_date = selectedCourseObj.prgm_end_date;
				addParam.rsvt_strt_time = selectedCourseObj.prgm_strt_time;
				addParam.rsvt_end_time = selectedCourseObj.prgm_end_time;

				const params = JSON.stringify(addParam);

				handleAlertToggle(
					"isConfirmOpen",
					undefined,
					"선택하신 정보로 예약 신청을 하시겠습니까?",
					async () => {
						await setAlertOpens(prev => {
							return { ...prev, isConfirmOpen: false };
						});
						resrvHistRepository
							.addReservationInsert("", params, false)
							.then(result => {
								handleAlertToggle(
									"isOpen",
									undefined,
									"신청되었습니다.\n관리사무소에서 확인 후 최종 예약이 진행됩니다.",
									() => {
										setAlertOpens(prev => {
											return { ...prev, isOpen: false };
										});
										history.push(`${rootUrl}/resrvHist`);
									}
								);
							}).catch(e => {
							handleAlertToggle(
								"isOpen",
								e.msg,
								e.errormsg + "\n",
								() => {
									setAlertOpens(prev => {
										return { ...prev, isOpen: false };
									});
								},
								undefined
							);
						});
					},
					() => {
						setAlertOpens(prev => {
							return { ...prev, isConfirmOpen: false };
						});
					}
				);
			}
		}
	};

	const getUserMgnts = async (page, size) => {
		let searchInfo = toJS(UserMgntStore.userMgntSearch);

		let searchParams = {
			aptId: AptComplexStore.aptComplex.id
		};

		if (searchInfo.building) {
			searchParams.building = searchInfo.building;
		}

		if (searchInfo.unit) {
			searchParams.unit = searchInfo.unit;
		}

		if (searchInfo.name) {
			searchParams.name = searchInfo.name;
		}

		if (searchInfo.phoneNumber) {
			searchParams.phoneNumber = searchInfo.phoneNumber;
		}

		if (searchInfo.userId) {
			searchParams.userId = searchInfo.userId;
		}

		// ------------------------------------------------------------------------------------------------------------- 검색 필터에 의한 사용자 목록 조회
		let findUserMgnts = await userMgntRepository.getUserMgnts({
			...searchParams,
			direction: "DESC",
			page: page ? page : 0,
			size: size ? size : 10,
			sort: "id"
		});

		setUserMgnts(findUserMgnts.content);
		setPageInfo({
			page: findUserMgnts.pageable.page,
			size: findUserMgnts.pageable.size,
			total: findUserMgnts.total
		});

		UserMgntStore.setPageInfo({
			page: findUserMgnts.pageable.page,
			size: findUserMgnts.pageable.size,
			total: findUserMgnts.total
		});
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs}/>

			<MC.Typography variant="h2" gutterBottom style={{ marginTop: 10 }}>
				예약하기
			</MC.Typography>
			<MC.Divider className={classes.divider}/>

			<ResrvMgntSearchBar
				history={props.history}
				rootUrl={rootUrl}
				selectedUser={selectedUser}
				setSelectedUser={setSelectedUser}
				userMgnts={userMgnts}
				setUserMgnts={setUserMgnts}
				pageInfo={pageInfo}
				setPageInfo={setPageInfo}
				setIsOpen={setIsOpen}
				expanded={expanded}
				setExpanded={setExpanded}
				getUserMgnts={getUserMgnts}
			/>

			<div className={classes.content}>
				<ResrvMgntTable
					history={history}
					rootUrl={rootUrl}
					userMgnts={userMgnts}
					getUserMgnts={getUserMgnts}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					setSelectedMembNumb={setSelectedMembNumb}
					setIsOpen={setIsOpen}
					setExpanded={setExpanded}
					tableExpanded={tableExpanded}
					setTableExpanded={setTableExpanded}
					setPrtmClss={setPrtmClss}
				  setFcltAdditionalFlag={setFcltAdditionalFlag}
				  setSeatListFlag={setSeatListFlag}
					setReservationInfo={setReservationInfo}
					setErrors={setErrors}
					dateInit={dateInit}
				/>
			</div>

			<div className={classes.content}>
				{
					isOpen === true &&
					<MC.Paper elevation={2} className={classes.paper}>
						<MC.Grid item xs={12} md={12}>
							<ResrvForm
								tab={tab}
								setTab={setTab}
								dateInit={dateInit}
								getDate={getDate}
								SignInStore={SignInStore}
								AptComplexStore={AptComplexStore}
								UserMgntStore={UserMgntStore}
								handleAlertToggle={handleAlertToggle}
								selectedUser={selectedUser}
								selectedMembNumb={selectedMembNumb}
								reservationInfo={reservationInfo}
								setReservationInfo={setReservationInfo}
								alertOpens={alertOpens}
								setAlertOpens={setAlertOpens}
								fcltAdditionalFlag={fcltAdditionalFlag}
								setFcltAdditionalFlag={setFcltAdditionalFlag}
								getSeatList={getSeatList}
								seatList={seatList}
								selectedSeat={selectedSeat}
								setSelectedSeat={setSelectedSeat}
								errors={errors}
								setErrors={setErrors}

								selectedCourse={selectedCourse}
								setSelectedCourse={setSelectedCourse}
								courseAdditionalList={courseAdditionalList}
								setCourseAdditionalList={setCourseAdditionalList}
								getCourseAdditionalList={getCourseAdditionalList}

								prtmClss={prtmClss}
								setPrtmClss={setPrtmClss}
								seatListFlag={seatListFlag}
								setSeatListFlag={setSeatListFlag}
							/>
						</MC.Grid>

						<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
							<MC.ButtonGroup
								aria-label="text primary button group"
								size="large"
								style={{ marginTop: 12 }}
								color="primary">
								<MC.Button
									style={{
										color: palette.error.main,
										borderColor: palette.error.main,
										marginLeft: 10,
										borderTopLeftRadius: 4,
										borderBottomLeftRadius: 4
									}}
									onClick={handleGoBack}>
									취소
								</MC.Button>
								<MC.Button
									variant="outlined"
									color="primary"
									onClick={handleReserve}>
									예약
								</MC.Button>
							</MC.ButtonGroup>
						</MC.Grid>
					</MC.Paper>
				}
			</div>

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
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "UserMgntStore")(observer(ResrvMgnt));
