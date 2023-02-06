import React, { useState } from "react";

import * as MC                                                         from "@material-ui/core";
import * as MS                                                         from "@material-ui/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider }                 from "@material-ui/pickers";
import MomentUtils                                                     from "@date-io/moment";
import { FacilityReservationSeatDialog }                               from "../../components";
import CalendarTodayOutlinedIcon                                       from "@material-ui/icons/CalendarTodayOutlined";
import ErrorOutlineIcon                                                from "@material-ui/icons/ErrorOutline";
import palette                                                         from "../../../../../theme/userTheme/palette";
import { resrvHistRepository, useGuideRepository, prgmMgntRepository } from "../../../../../repositories";
import moment                                                          from "moment";

const useStyles = MS.makeStyles(theme => ({
	root: {
		padding: "20px 40px"
	},
	formControl: {},
	tableRoot: {
		marginTop: 30,
		borderTop: "2px solid #449CE8"
	},
	cellTitle: {
		backgroundColor: "#f9f9f9",
		width: 150,
		height: "auto",
		paddingLeft: 21,
		[theme.breakpoints.down("xs")]: {
			width: 120
		}
	},
	cellContent: {
		width: "auto",
		paddingLeft: 20,
		paddingRight: 20,
		[theme.breakpoints.down("xs")]: {
			width: 200,
			paddingLeft: 15,
			paddingRight: 15
		}
	},
	body4: {
		...theme.typography.body4
	},
	buttonLayoutRight: {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
		marginTop: 60
	},
	datePickerContainer: {
		width: "100%",
		"& fieldset": {
			// borderRadius: 0
		}
	},
	datePicker: {
		paddingTop: 10,
		paddingBottom: 10,
		margin: 0,
		height: 30
	},
	calendarButton: {
		padding: 0,
		paddingTop: 2,
		"& svg": {
			fontSize: 16
		}
	},
	reservInfoField: {
		marginTop: 40,
		padding: "10px 15px",
		backgroundColor: "#fafafa",
		minHeight: 200
	},
	dayWithContainer: {
		position: "relative"
	}
}));

const FacilityReservationRegisterForm = props => {

	const classes = useStyles();

	const timeList = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
		"12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

	const steps = ["시설 선택", "자리 선택", "예약 확인"]; // 각 Steps Label
	const [activeStep, setActiveStep] = useState(0); // 현재 Active Step

	const [basketReservation, setBasketReservation] = useState({}); // 임시 예약 등록 저장 State

	const {
		history, rootUrl, isMobile, alertOpens, setAlertOpens, handleAlertToggle,
		facilityBigList, getFacilityMidList, facilityMidList,
		facilityAdditionalList, getFacilityAdditionalList, facilityAdditionalFlag, prtmclss, setPrtmclss
	} = props; // Props

	const [seatImage, setSeatImage] = useState("");
	// 배치도 Dialog
	const [notiOpen, setNotiOpen] = useState({
		isOpen: false,
		yesFn: () => handleTermsToggle()
	});
	const handleTermsToggle = (key, yesCallback) => {
		setNotiOpen(prev => {
			return {
				...prev,
				isOpen: true,
				yesFn: () => yesCallback()
			};
		});
	};
	// 배치도 버튼 Handler
	const handleNotiOpen = () => {

		let prgm_numb = facilityAdditionalFlag ? reservationObj.prgm_numb.split("|")[0] : reservationObj.third.split("|")[0];

		prgmMgntRepository.getPrgmSeat(prgm_numb, true)
			.then(result => {
				if (result.img.fileInfo) {
					setSeatImage(result.img.fileInfo.imag_path)
				}
			});

		handleTermsToggle(
			"isOpen",
			() => {
				setNotiOpen(prev => {
					return {
						...prev,
						isOpen: false
					};
				});
			}
		);
	};

	// 취소 버튼 Handler
	const handleGoBack = () => {
		history.goBack();
	};

	const [holidayList, setHolidayList] = useState([]); // 단지 휴일 일자
	// Date Handler
	const getDate = (date, isFrom) => moment(date).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const handleDateChange = (key, date, value, isFrom) => {
		setReservationObj(prev => {
			return {
				...prev,
				[key]: getDate(date, isFrom)
			};
		});
	};
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if (!isFrom) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 2);
		}
		return date;
	};
	// 단지 휴일 날짜 비활성화
	const disableDate = (date) => {

		const dateInterditesRaw = holidayList.map(mapItem => mapItem.holi_date);

		return dateInterditesRaw.includes(moment(date).format("YYYY-MM-DD"));

	};
	// 단지 휴일 조회 API 호출
	const getHolidayList = () => {

		let date = getDate(new Date(), true);
		let oneMonth = date.month(date.month() + 1);
		date = getDate(new Date(), true);
		let twoMonth = date.month(date.month() + 2);
		//date = getDate(new Date(), true);
		//let threeMonth = date.month(date.month() + 3);

		let tempHolidayList = [];

		resrvHistRepository.getHolidayList(moment(dateInit(true)).format("YYYY-MM-DD"))
			.then(result => {
				tempHolidayList = [...tempHolidayList, ...result.data_json_array];
				resrvHistRepository.getHolidayList(moment(oneMonth).format("YYYY-MM-DD"))
					.then(result => {
						tempHolidayList = [...tempHolidayList, ...result.data_json_array];
						resrvHistRepository.getHolidayList(moment(twoMonth).format("YYYY-MM-DD"))
							.then(result => {
								tempHolidayList = [...tempHolidayList, ...result.data_json_array];
								//setHolidayList(tempHolidayList.filter((filterItem, index) => filterItem.rsvt_psbl_at === "N").map(mapItem => mapItem.holi_date));
								setHolidayList(tempHolidayList.filter((filterItem, index) => filterItem.rsvt_psbl_at === "N"));
							});
					});
			});
	};
	// DatePicker 휴일 Tooltip Render
	const renderDayInPicker = (date, selectedDate, dayInCurrentMonth, dayComponent) => {

		let tempHolidayList = holidayList.map(mapItem => mapItem.holi_date)

		// Mindate, Maxdate 기준 선택 불가
		if (date < dateInit(true).subtract(1, "days") || date > dateInit(false)) {
			return (<MC.Tooltip title={"선택 불가"}>
				<div className={classes.dayWithContainer}>
					{dayComponent}
				</div>
			</MC.Tooltip>);
		}
		// 지정 시설 휴일 선택 불가
		else if (tempHolidayList.includes(moment(date).format("YYYY-MM-DD"))) {

			// 해당 휴일에 해당하는 Index ==> For 휴일 명칭 조회
			let index = holidayList.findIndex(item => item.holi_date === moment(date).format("YYYY-MM-DD"))

			return (<MC.Tooltip title={holidayList[index] === "" ? "시설 휴일" : holidayList[index].holi_name}>
				<div className={classes.dayWithContainer}>
					{dayComponent}
				</div>
			</MC.Tooltip>);
		}

		return dayComponent;
	};

	const [reservationObj, setReservationObj] = useState({
		first: "",
		prgm_numb: "",
		third: "",
		detl_numb: "",
		rsvt_strt_date: dateInit(true),
		rsvt_end_date: dateInit(false),
		rsvt_strt_time: "09",
		rsvt_end_time: "18",
		use_amt: 0
	}); // Submit State

	// Validation 처리
	const [errors, setErrors] = useState({
		first: false,
		prgm_numb: false,
		third: false,
		rsvt_strt_time: false,
		rsvt_end_time: false
	});

	// 예약 이용 안내
	const [reservationGuide, setReservationGuide] = useState("");

	// 다음 스텝 이동 Handler
	const handleNext = () => {
		//---------------------------- Step 1
		if (activeStep == 0) {
			if (reservationObj.first === "" || reservationObj.prgm_numb === "" || (!facilityAdditionalFlag && reservationObj.third === "")
				|| errors.rsvt_strt_time === true || errors.rsvt_end_time === true) {
				setErrors(prev => {
					return {
						...prev,
						first: reservationObj.first === "",
						prgm_numb: reservationObj.prgm_numb === "",
						third: reservationObj.third === ""
					};
				});
			} else {
				getSeatList(); // 선택된 시설 아이템의 좌석 현황 조회
				setActiveStep((prevActiveStep) => prevActiveStep + 1);
			}
		}
		//---------------------------- Step 2
		else if (activeStep == 1) {
			// 좌석 선택되지 않았을 때
			if (selectedSeat === -1) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"좌석을 선택해주세요.",
					undefined,
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					}
				);
			}
			// 좌석 선택되었을 때 임시 예약 등록
			else {
				setReservationObj({
					...reservationObj,
					detl_numb: selectedSeat.toString()
				});
				//JSON.stringify()
				let params = {
					prgm_numb: facilityAdditionalFlag ? reservationObj.prgm_numb.split("|")[0] : reservationObj.third.split("|")[0],
					detl_numb: selectedSeat.toString(),
					rsvt_clss: "C",
					rsvt_type: "ORD",
					rsvt_amt: reservationObj.use_amt
				};

				if (prtmclss === "10" || prtmclss === "20" || prtmclss === "60") {
					params = {
						...params,
						rsvt_strt_time: reservationObj.rsvt_strt_time + ":00:00", // 예약 시작 시간
						rsvt_end_time: reservationObj.rsvt_end_time + ":00:00" // 예약 종료 시간
					};
				}
				if (prtmclss === "40" || prtmclss === "60") {
					params = {
						...params,
						rsvt_end_date: moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD") // 예약 종료 일자
					};
				}
				if (prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") {
					params = {
						...params,
						rsvt_strt_date: moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD") // 예약 시작 일자
					};
				}

				params = JSON.stringify(params);

				// Step 1, 2에서 입력한 정보로 임시예약등록 진행
				resrvHistRepository
					.addReservationBasket(params, true)
					.then(result => {
						setBasketReservation(result.data_json_array[0]);
						// 예약 이용 안내 조회
						useGuideRepository.getUseGuide(true)
							.then(result => {
								if (result.data_json) {
									setReservationGuide(result.data_json.use_info)
								}
							})
					}).catch(e => {
					handleAlertToggle(
						"isOpen",
						e.msg,
						e.errormsg + "\n",
						"확인",
						() => {
							setAlertOpens(prev => {
								return { ...prev, isOpen: false };
							});
						},
						undefined
					);
				});

				setActiveStep((prevActiveStep) => prevActiveStep + 1);
			}
		}
	};
	// 이전 스텝 이동 Handler
	const handleBack = () => {
		if (activeStep > 0) {
			if (activeStep === 1) {
				setSeatList([]); // 좌석 현황 초기화
			} else if (activeStep === 2) {
				// 좌석 선택 해당사항 없는 경우 3단계에서 이전 클릭시 1단계로 돌아감
				if (!basketReservation.detl_numb) {
					setActiveStep((prevActiveStep) => prevActiveStep - 1);
				}
			}
			setSelectedSeat(-1); // 선택 좌석 초기화
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		} else {
			handleGoBack();
		}
	};

	// 좌석 리스트 조회
	const [seatList, setSeatList] = useState([]);
	const getSeatList = () => {

		let params = {
			prgm_numb: facilityAdditionalFlag ? reservationObj.prgm_numb.split("|")[0] : reservationObj.third.split("|")[0],
			seachtype: "DAY"
		};
		if (prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") {
			params = {
				...params,
				seachdate: moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD"),
				seachtype: "DAY"
			};
		}
		if (prtmclss === "10" || prtmclss === "20") {
			params = {
				...params,
				seachtype: "HOUR",
				seachtime: reservationObj.rsvt_strt_time + ":00:00"
			};
		}

		const paramJson = JSON.stringify(params);

		resrvHistRepository.getSeatList(paramJson)
			.then(result => {

				if (prtmclss === "10" || prtmclss === "20") {
					// 시작시간 기준로 좌석 현황 조회
					setSeatList(result.data_json.timedetail[0].rsvtseatdetail);
				} else {
					// 시작일 기준으로 좌석 현황 조회
					setSeatList(result.data_json.daydetail[0].rsvtseatdetail);
				}

			}).catch(e => {
			// 좌석이 없는 상품일 경우 좌석 선택을 제외하고 임시예약 진행
			handleAlertToggle(
				"isOpen",
				undefined,
				"자리 선택에 해당하지 않는 상품입니다.\n 다음 단계로 넘어갑니다.",
				undefined,
				() => {
					setAlertOpens(prev => {
						let params = {
							prgm_numb: facilityAdditionalFlag ? reservationObj.prgm_numb.split("|")[0] : reservationObj.third.split("|")[0],
							rsvt_clss: "C",
							rsvt_type: "ORD",
							rsvt_amt: reservationObj.use_amt
						};
						if (prtmclss === "10" || prtmclss === "20" || prtmclss === "60") {
							params = {
								...params,
								rsvt_strt_time: reservationObj.rsvt_strt_time + ":00:00", // 예약 시작 시간
								rsvt_end_time: reservationObj.rsvt_end_time + ":00:00" // 예약 종료 시간
							};
						}
						if (prtmclss === "40" || prtmclss === "60") {
							params = {
								...params,
								rsvt_end_date: moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD") // 예약 종료 일자
							};
						}
						if (prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") {
							params = {
								...params,
								rsvt_strt_date: moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD") // 예약 시작 일자
							};
						}

						params = JSON.stringify(params);

						// Step 1, 2에서 입력한 정보로 임시예약등록 진행
						resrvHistRepository
							.addReservationBasket(params, true)
							.then(result => {
								setBasketReservation(result.data_json_array[0]);
								useGuideRepository.getUseGuide(true)
									.then(result => {
										if (result.data_json) {
											setReservationGuide(result.data_json.use_info)
										}
									})
							}).catch(e => {
							handleAlertToggle(
								"isOpen",
								e.msg,
								e.errormsg + "\n",
								"확인",
								() => {
									setAlertOpens(prev => {
										return { ...prev, isOpen: false };
									});
								},
								undefined
							);
						});
						setActiveStep((prevActiveStep) => prevActiveStep + 1);
						return { ...prev, isOpen: false };
					});
				},
				undefined
			);
		});
	};


	const [selectedSeat, setSelectedSeat] = useState(-1); // 좌석 선택 State
	// 좌석 선택 Handler
	const handleSelectSeat = (selectedSeat) => {
		setSelectedSeat(selectedSeat);
	};

	// Input Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setReservationObj({
			...reservationObj,
			[name]: value
		});

		// 시설 선택되었을 경우 중분류 목록 가져오기
		if (name === "first") {
			setPrtmclss(""); // 이용권 유형 초기화
			getFacilityMidList(value);
			setReservationObj({
				...reservationObj,
				[name]: value,
				prgm_numb: "",
				third: ""
			});

			getHolidayList(); // 단지 휴일 정보 조회
		}
		// 중분류 선택되었을 경우 추가상품 목록 가져오기
		if (name === "prgm_numb") {
			getFacilityAdditionalList(value);
		}
		// 추가 선택 선택되었을 경우 유료 가격 가져오기
		if (name === "third") {
			let valueList = value.split("|");
			setPrtmclss(valueList[1]); // 이용권 유형 선택
			setReservationObj({
				...reservationObj,
				[name]: value,
				use_amt: facilityAdditionalList.find(x => x.prgm_numb === valueList[0]).use_amt
			});
		}

		// Validation 체크 - 대분류, 중분류, 추가상품
		if (name === "first" || name === "prgm_numb" || name === "third") {
			setErrors(prev => {
				return {
					...prev,
					first: value === "",
					prgm_numb: value === "",
					third: value === ""
				};
			});
		}
		// Validation 체크 - 시작시간
		else if (name === "rsvt_strt_time") {
			if ((moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD") === moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD"))
				|| prtmclss === "10" || prtmclss === "20") {
				if (reservationObj.rsvt_end_time < value) {
					setErrors(prev => {
						return { ...prev, rsvt_strt_time: true, rsvt_end_time: false };
					});
				} else {
					setErrors(prev => {
						return { ...prev, rsvt_strt_time: false, rsvt_end_time: false };
					});
				}
			}
		}
		// Validation 체크 - 종료시간
		else if (name === "rsvt_end_time") {
			if ((moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD") === moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD"))
				|| prtmclss === "10" || prtmclss === "20") {
				if (reservationObj.rsvt_strt_time > value) {
					setErrors(prev => {
						return { ...prev, rsvt_strt_time: false, rsvt_end_time: true };
					});
				} else {
					setErrors(prev => {
						return { ...prev, rsvt_strt_time: false, rsvt_end_time: false };
					});
				}
			}
		}

	};
	// 최종 예약 Handler
	const handleSubmit = () => {

		let addParam = {};

		let facilityNumb = reservationObj.first.split("/");
		addParam.fclt_code = facilityNumb[0]; // 시설 코드
		addParam.fclt_numb = facilityNumb[1]; // 대분류
		addParam.prgm_numb = facilityAdditionalFlag ? reservationObj.prgm_numb.split("|")[0] : reservationObj.third.split("|")[0]; // 시설 아이템
		//addParam.use_amt = reservationObj.use_amt; // 유료 가격

		if (prtmclss === "10" || prtmclss === "20" || prtmclss === "60") {
			addParam.rsvt_strt_time = reservationObj.rsvt_strt_time + ":00:00"; // 예약 시작 시간
			addParam.rsvt_end_time = reservationObj.rsvt_end_time + ":59:59"; // 예약 종료 시간
		}
		if (prtmclss === "40" || prtmclss === "60") {
			addParam.rsvt_end_date = moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD"); // 예약 종료 날짜
		}
		if (prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") {
			addParam.rsvt_strt_date = moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD"); // 예약 시작 날짜
		}
		if (selectedSeat !== -1) {
			addParam.detl_numb = reservationObj.detl_numb; // 좌석
		}

		const params = JSON.stringify(addParam);

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"선택하신 정보로 예약 신청을 하시겠습니까?",
			"확인",
			async () => {
				await setAlertOpens(prev => {
					return { ...prev, isConfirmOpen: false };
				});
				resrvHistRepository
					.addReservationInsert(basketReservation.bskt_numb, params, true)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							undefined,
							"신청되었습니다.\n관리사무소에서 확인 후 최종 예약이 진행됩니다.",
							undefined,
							() => {
								setAlertOpens(prev => {
									return { ...prev, isOpen: false };
								});
								history.push(`${rootUrl}/myPage/4/0`);
							}
						);
					}).catch(e => {
					handleAlertToggle(
						"isOpen",
						e.msg,
						e.errormsg + "\n",
						"확인",
						() => {
							setAlertOpens(prev => {
								return { ...prev, isOpen: false };
							});
						},
						undefined
					);
				});
			},
			"취소",
			() => {
				setAlertOpens(prev => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	// Step 3 예약확인 테이블 Row - Render
	const renderTableRow = (label, item) => {
		return (
			<MC.Grid item xs={12} lg={12} style={{ height: "auto", borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle} style={{ height: isMobile ? 60 : 50 }}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}
										 style={{ height: "100%" }}>
							<MC.Typography className={classes.body4}>
								{label}
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.Typography className={classes.body4}>
							{item}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
		);
	};

	return (
		<MC.Paper className={classes.root}>
			{/* Step */}
			<MC.Stepper activeStep={activeStep} alternativeLabel>
				{
					steps.map((label, index) => {
						return (
							<MC.Step key={index}>
								<MC.StepLabel>{label}</MC.StepLabel>
							</MC.Step>
						);
					})
				}
			</MC.Stepper>
			{/*--------------------------------------------- Step 1 : 시설 선택 ---------------------------------------------*/}
			{
				activeStep === 0 &&
				<>
					{/* 시설 선택 */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;시설 선택</MC.Typography>
							<MC.Grid item xs={12} md={12}>
								<MC.Select
									labelId="first-label"
									variant={"outlined"}
									name={"first"}
									id={"first"}
									value={reservationObj.first}
									error={errors.first}
									onChange={(event) => handleChange(event)}
									style={{ height: 50, width: "100%" }}>
									{
										facilityBigList.map((facility, index) => (
											<MC.MenuItem key={index}
																	 value={`${facility.fclt_code}/${facility.fclt_numb}`}>{facility.fclm_name}</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.Grid>
						</MC.Grid>
					</MC.FormControl>
					{/* 상품 선택 */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;상품 선택</MC.Typography>
							<MC.Grid item xs={12} md={12}>
								<MC.Select
									labelId="prgm_numb-label"
									variant={"outlined"}
									name={"prgm_numb"}
									id={"prgm_numb"}
									disabled={reservationObj.first === ""}
									error={errors.prgm_numb}
									value={reservationObj.prgm_numb}
									onChange={(event) => handleChange(event)}
									style={{ height: 50, width: "100%" }}>
									{
										facilityMidList.map((facilityMid, index) => (
											<MC.MenuItem key={index}
																	 value={facilityMid.prgm_numb + "|" + facilityMid.prtm_clss}>{facilityMid.prgm_name}</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.Grid>
						</MC.Grid>
						{reservationObj.first === "" && <MC.FormHelperText>시설을 먼저 선택해주세요.</MC.FormHelperText>}
					</MC.FormControl>
					{/* 추가 선택 */}
					{!facilityAdditionalFlag &&
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;추가 선택</MC.Typography>
							<MC.Grid item xs={12} md={12}>
								<MC.Select
									labelId="third-label"
									variant={"outlined"}
									name={"third"}
									id={"third"}
									value={reservationObj.third}
									error={errors.third}
									disabled={reservationObj.prgm_numb === ""}
									onChange={(event) => handleChange(event)}
									style={{ height: 50, width: "100%" }}>
									{
										facilityAdditionalList.map((facilityLsat, index) => (
											<MC.MenuItem key={index}
																	 value={facilityLsat.prgm_numb + "|" + facilityLsat.prtm_clss}>{facilityLsat.prgm_name}</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.Grid>
						</MC.Grid>
						{reservationObj.prgm_numb === "" && <MC.FormHelperText>상품을 먼저 선택해주세요.</MC.FormHelperText>}
					</MC.FormControl>
					}
					{/* 날짜 선택 */}
					{(prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") &&
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"} style={{ marginBottom: 3 }}>
							<MC.Typography>&nbsp;&nbsp;기간 선택</MC.Typography>
						</MC.Grid>

						<MC.Grid container spacing={1} alignItems={"center"} justify={"flex-start"} style={{ marginTop: 10 }}>
							{/* 시작일자 - 이용권 유형 10 or 20 or 40 or 60일때 display*/}
							{(prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									<KeyboardDatePicker
										autoOk
										variant={isMobile ? "standard" : "inline"}
										inputVariant="outlined"
										views={["date"]}
										id="fromDate-picker-dialog"
										format="yyyy.MM.DD"
										label={"시작일자"}
										shouldDisableDate={((date) => disableDate(date))}
										disableToolbar
										disablePast
										maxDate={(prtmclss === "40" || prtmclss === "60") ? reservationObj.rsvt_end_date : dateInit(false)}
										value={reservationObj.rsvt_strt_date || new Date()}
										keyboardIcon={<CalendarTodayOutlinedIcon/>}
										KeyboardButtonProps={{
											className: classes.calendarButton
										}}
										onChange={(date, value) => handleDateChange("rsvt_strt_date", date, value, true)}
										inputProps={{ className: classes.datePicker }}
										className={classes.datePickerContainer}
										renderDay={renderDayInPicker}
									/>
								</MuiPickersUtilsProvider>
							</MC.Grid>
							}
							{/* 시작시간 - 이용권 유형 10 or 20 or 60일때 display*/}
							{(prtmclss === "10" || prtmclss === "20" || prtmclss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										select
										name="rsvt_strt_time"
										id="rsvt_strt_time-basic"
										variant="outlined"
										label="시작시간"
										error={errors.rsvt_strt_time}
										value={reservationObj.rsvt_strt_time || "09"}
										onChange={(event) => handleChange(event)}
										style={{ height: 50 }}
									>
										{
											timeList.map((value, index) => (
												<MC.MenuItem key={index} value={value}>
													{`${value} 시`}
												</MC.MenuItem>
											))
										}
									</MC.TextField>
								</MC.FormControl>
							</MC.Grid>
							}
							{/* 종료일자 - 이용권 유형 40 or 60일때 display*/}
							{(prtmclss === "40" || prtmclss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									<KeyboardDatePicker
										autoOk
										variant={isMobile ? "standard" : "inline"}
										inputVariant="outlined"
										views={["date"]}
										id="ToDate-picker-dialog"
										format="yyyy.MM.DD"
										label={"종료일자"}
										disableToolbar
										shouldDisableDate={((date) => disableDate(date))}
										minDate={reservationObj.rsvt_strt_date || new Date()}
										value={reservationObj.rsvt_end_date || new Date()}
										keyboardIcon={<CalendarTodayOutlinedIcon/>}
										KeyboardButtonProps={{
											className: classes.calendarButton
										}}
										onChange={(date, value) => handleDateChange("rsvt_end_date", date, value, true)}
										inputProps={{ className: classes.datePicker }}
										className={classes.datePickerContainer}
										renderDay={renderDayInPicker}
									/>
								</MuiPickersUtilsProvider>
							</MC.Grid>
							}
							{/* 종료시간 - 이용권 유형 10 or 20 or 60일때 display*/}
							{(prtmclss === "10" || prtmclss === "20" || prtmclss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										select
										name="rsvt_end_time"
										id="rsvt_end_time-basic"
										variant="outlined"
										label="종료시간"
										error={errors.rsvt_end_time}
										value={reservationObj.rsvt_end_time || "18"}
										onChange={(event) => handleChange(event)}
										style={{ height: 50 }}
									>
										{
											timeList.map((value, index) => (
												<MC.MenuItem key={index} value={value}>
													{`${value} 시`}
												</MC.MenuItem>
											))
										}
									</MC.TextField>
								</MC.FormControl>
							</MC.Grid>
							}
						</MC.Grid>
					</MC.FormControl>
					}
				</>
			}

			{/*--------------------------------------------- Step 2 : 자리 선택 ---------------------------------------------*/}
			{
				activeStep === 1 &&
				<>
					<MC.Grid container spacing={1} alignItems={"center"} justify={"flex-end"}>
						<MC.Button
							onClick={() => handleNotiOpen()}
							variant="outlined"
							style={{
								marginRight: 10, width: 150, backgroundColor: "#808080", color: "white"
							}}
						>
							배치도 보기
						</MC.Button>
					</MC.Grid>
					{/* 좌석 선택 */}
					<MC.Paper style={{ marginTop: 50, padding: "30px 20px" }}>
						<MC.Grid container spacing={5} alignItems={"center"}>
							{seatList && seatList.map((item, index) =>
								<MC.Grid item xs={6} lg={3} key={index}>
									<MC.Button
										onClick={() => handleSelectSeat(item.detl_numb)}
										disabled={item.seat_cnt !== 0}
										variant={"contained"}
										color={item.detl_numb === selectedSeat ? "primary" : palette.white.main}
										style={{ width: "100%" }}
									>
										{item.detl_numb}
									</MC.Button>
								</MC.Grid>
							)}
						</MC.Grid>
					</MC.Paper>
					{/*	좌석 색깔별 가이드*/}
					<MC.Grid container spacing={6} alignItems={"center"} justify={"flex-start"}
									 style={{ marginTop: 10, marginLeft: 2 }}>
						<div style={{ border: "1px solid gray", backgroundColor: "#449CE8", width: 20, height: 20 }}></div>
						<MC.Typography>&nbsp;선택 완료</MC.Typography>
						&nbsp;&nbsp;
						<div style={{ border: "1px solid gray", backgroundColor: "#FFFFFF", width: 20, height: 20 }}></div>
						<MC.Typography>&nbsp;예약 가능</MC.Typography>
						&nbsp;&nbsp;
						<div
							style={{ border: "1px solid gray", backgroundColor: "rgba(0, 0, 0, 0.12)", width: 20, height: 20 }}></div>
						<MC.Typography>&nbsp;예약 완료</MC.Typography>
						&nbsp;&nbsp;
					</MC.Grid>
				</>
			}
			{/*--------------------------------------------- Step 3 : 예약확인 ---------------------------------------------*/}
			{
				activeStep === 2 &&
				<>
					<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} className={classes.tableRoot}>
						{renderTableRow("상품명", basketReservation.prgm_name)}
						{renderTableRow("이용일자", (prtmclss === "") ? "해당없음" :
							(prtmclss === "10" || prtmclss === "20") ? basketReservation.rsvt_strt_time && (basketReservation.rsvt_strt_date + ", " + basketReservation.rsvt_strt_time.substring(0, 2) + "시 ~ " + basketReservation.rsvt_end_time.substring(0, 2) + "시") :
								prtmclss === "40" ? basketReservation.rsvt_strt_date + " ~ " + basketReservation.rsvt_end_date :
									prtmclss === "60" ? basketReservation.rsvt_strt_date + " ~ " + basketReservation.rsvt_end_date : "해당없음")}
						{renderTableRow("옵션(좌석)", basketReservation.detl_numb ? (basketReservation.detl_numb + "번") : "해당없음")}
						{renderTableRow("이용요금", basketReservation.rsvt_amt + "원")}
					</MC.Grid>

					<div className={classes.reservInfoField}>
						<MC.Grid container direction={"row"} alignItems={"center"}>
							<ErrorOutlineIcon/>&nbsp;<MC.Typography>유료 예약안내</MC.Typography>
							<br />
							<br />
						</MC.Grid>
						<div
							className="ql-editor"
							dangerouslySetInnerHTML={{
								__html:
									reservationGuide !== ""
										? reservationGuide
										: "등록된 안내사항이 없습니다.",
							}}
							style={{ maxHeight: "none", fontSize: 14 }}
						/>
					</div>
				</>
			}

			{/*------------------------------------------------ 하단 버튼 --------------------------------------------------*/}
			<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
				<MC.Button
					onClick={handleBack}
					variant="outlined"
					style={{
						marginRight: 10, width: 200,
					}}
				>
					{activeStep === 0 ? "취소" : "이전"}
				</MC.Button>
				<MC.Button
					onClick={activeStep !== 2 ? handleNext : handleSubmit}
					variant="contained"
					color="primary"
					style={{
						width: 200,
					}}
				>
					{activeStep !== 2 ? "다음" : "예약신청"}
				</MC.Button>
			</MC.Grid>

			<FacilityReservationSeatDialog
				isOpen={notiOpen.isOpen}
				isMobile={isMobile}
				handleYes={() => notiOpen.yesFn()}
				seatImage={seatImage}
			/>

		</MC.Paper>
	);
};

export default FacilityReservationRegisterForm;

