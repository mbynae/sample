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

	const steps = ["?????? ??????", "?????? ??????", "?????? ??????"]; // ??? Steps Label
	const [activeStep, setActiveStep] = useState(0); // ?????? Active Step

	const [basketReservation, setBasketReservation] = useState({}); // ?????? ?????? ?????? ?????? State

	const {
		history, rootUrl, isMobile, alertOpens, setAlertOpens, handleAlertToggle,
		facilityBigList, getFacilityMidList, facilityMidList,
		facilityAdditionalList, getFacilityAdditionalList, facilityAdditionalFlag, prtmclss, setPrtmclss
	} = props; // Props

	const [seatImage, setSeatImage] = useState("");
	// ????????? Dialog
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
	// ????????? ?????? Handler
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

	// ?????? ?????? Handler
	const handleGoBack = () => {
		history.goBack();
	};

	const [holidayList, setHolidayList] = useState([]); // ?????? ?????? ??????
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
	// ?????? ?????? ?????? ????????????
	const disableDate = (date) => {

		const dateInterditesRaw = holidayList.map(mapItem => mapItem.holi_date);

		return dateInterditesRaw.includes(moment(date).format("YYYY-MM-DD"));

	};
	// ?????? ?????? ?????? API ??????
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
	// DatePicker ?????? Tooltip Render
	const renderDayInPicker = (date, selectedDate, dayInCurrentMonth, dayComponent) => {

		let tempHolidayList = holidayList.map(mapItem => mapItem.holi_date)

		// Mindate, Maxdate ?????? ?????? ??????
		if (date < dateInit(true).subtract(1, "days") || date > dateInit(false)) {
			return (<MC.Tooltip title={"?????? ??????"}>
				<div className={classes.dayWithContainer}>
					{dayComponent}
				</div>
			</MC.Tooltip>);
		}
		// ?????? ?????? ?????? ?????? ??????
		else if (tempHolidayList.includes(moment(date).format("YYYY-MM-DD"))) {

			// ?????? ????????? ???????????? Index ==> For ?????? ?????? ??????
			let index = holidayList.findIndex(item => item.holi_date === moment(date).format("YYYY-MM-DD"))

			return (<MC.Tooltip title={holidayList[index] === "" ? "?????? ??????" : holidayList[index].holi_name}>
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

	// Validation ??????
	const [errors, setErrors] = useState({
		first: false,
		prgm_numb: false,
		third: false,
		rsvt_strt_time: false,
		rsvt_end_time: false
	});

	// ?????? ?????? ??????
	const [reservationGuide, setReservationGuide] = useState("");

	// ?????? ?????? ?????? Handler
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
				getSeatList(); // ????????? ?????? ???????????? ?????? ?????? ??????
				setActiveStep((prevActiveStep) => prevActiveStep + 1);
			}
		}
		//---------------------------- Step 2
		else if (activeStep == 1) {
			// ?????? ???????????? ????????? ???
			if (selectedSeat === -1) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"????????? ??????????????????.",
					undefined,
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					}
				);
			}
			// ?????? ??????????????? ??? ?????? ?????? ??????
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
						rsvt_strt_time: reservationObj.rsvt_strt_time + ":00:00", // ?????? ?????? ??????
						rsvt_end_time: reservationObj.rsvt_end_time + ":00:00" // ?????? ?????? ??????
					};
				}
				if (prtmclss === "40" || prtmclss === "60") {
					params = {
						...params,
						rsvt_end_date: moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD") // ?????? ?????? ??????
					};
				}
				if (prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") {
					params = {
						...params,
						rsvt_strt_date: moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD") // ?????? ?????? ??????
					};
				}

				params = JSON.stringify(params);

				// Step 1, 2?????? ????????? ????????? ?????????????????? ??????
				resrvHistRepository
					.addReservationBasket(params, true)
					.then(result => {
						setBasketReservation(result.data_json_array[0]);
						// ?????? ?????? ?????? ??????
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
						"??????",
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
	// ?????? ?????? ?????? Handler
	const handleBack = () => {
		if (activeStep > 0) {
			if (activeStep === 1) {
				setSeatList([]); // ?????? ?????? ?????????
			} else if (activeStep === 2) {
				// ?????? ?????? ???????????? ?????? ?????? 3???????????? ?????? ????????? 1????????? ?????????
				if (!basketReservation.detl_numb) {
					setActiveStep((prevActiveStep) => prevActiveStep - 1);
				}
			}
			setSelectedSeat(-1); // ?????? ?????? ?????????
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		} else {
			handleGoBack();
		}
	};

	// ?????? ????????? ??????
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
					// ???????????? ????????? ?????? ?????? ??????
					setSeatList(result.data_json.timedetail[0].rsvtseatdetail);
				} else {
					// ????????? ???????????? ?????? ?????? ??????
					setSeatList(result.data_json.daydetail[0].rsvtseatdetail);
				}

			}).catch(e => {
			// ????????? ?????? ????????? ?????? ?????? ????????? ???????????? ???????????? ??????
			handleAlertToggle(
				"isOpen",
				undefined,
				"?????? ????????? ???????????? ?????? ???????????????.\n ?????? ????????? ???????????????.",
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
								rsvt_strt_time: reservationObj.rsvt_strt_time + ":00:00", // ?????? ?????? ??????
								rsvt_end_time: reservationObj.rsvt_end_time + ":00:00" // ?????? ?????? ??????
							};
						}
						if (prtmclss === "40" || prtmclss === "60") {
							params = {
								...params,
								rsvt_end_date: moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD") // ?????? ?????? ??????
							};
						}
						if (prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") {
							params = {
								...params,
								rsvt_strt_date: moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD") // ?????? ?????? ??????
							};
						}

						params = JSON.stringify(params);

						// Step 1, 2?????? ????????? ????????? ?????????????????? ??????
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
								"??????",
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


	const [selectedSeat, setSelectedSeat] = useState(-1); // ?????? ?????? State
	// ?????? ?????? Handler
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

		// ?????? ??????????????? ?????? ????????? ?????? ????????????
		if (name === "first") {
			setPrtmclss(""); // ????????? ?????? ?????????
			getFacilityMidList(value);
			setReservationObj({
				...reservationObj,
				[name]: value,
				prgm_numb: "",
				third: ""
			});

			getHolidayList(); // ?????? ?????? ?????? ??????
		}
		// ????????? ??????????????? ?????? ???????????? ?????? ????????????
		if (name === "prgm_numb") {
			getFacilityAdditionalList(value);
		}
		// ?????? ?????? ??????????????? ?????? ?????? ?????? ????????????
		if (name === "third") {
			let valueList = value.split("|");
			setPrtmclss(valueList[1]); // ????????? ?????? ??????
			setReservationObj({
				...reservationObj,
				[name]: value,
				use_amt: facilityAdditionalList.find(x => x.prgm_numb === valueList[0]).use_amt
			});
		}

		// Validation ?????? - ?????????, ?????????, ????????????
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
		// Validation ?????? - ????????????
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
		// Validation ?????? - ????????????
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
	// ?????? ?????? Handler
	const handleSubmit = () => {

		let addParam = {};

		let facilityNumb = reservationObj.first.split("/");
		addParam.fclt_code = facilityNumb[0]; // ?????? ??????
		addParam.fclt_numb = facilityNumb[1]; // ?????????
		addParam.prgm_numb = facilityAdditionalFlag ? reservationObj.prgm_numb.split("|")[0] : reservationObj.third.split("|")[0]; // ?????? ?????????
		//addParam.use_amt = reservationObj.use_amt; // ?????? ??????

		if (prtmclss === "10" || prtmclss === "20" || prtmclss === "60") {
			addParam.rsvt_strt_time = reservationObj.rsvt_strt_time + ":00:00"; // ?????? ?????? ??????
			addParam.rsvt_end_time = reservationObj.rsvt_end_time + ":59:59"; // ?????? ?????? ??????
		}
		if (prtmclss === "40" || prtmclss === "60") {
			addParam.rsvt_end_date = moment(reservationObj.rsvt_end_date).format("YYYY-MM-DD"); // ?????? ?????? ??????
		}
		if (prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") {
			addParam.rsvt_strt_date = moment(reservationObj.rsvt_strt_date).format("YYYY-MM-DD"); // ?????? ?????? ??????
		}
		if (selectedSeat !== -1) {
			addParam.detl_numb = reservationObj.detl_numb; // ??????
		}

		const params = JSON.stringify(addParam);

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"???????????? ????????? ?????? ????????? ???????????????????",
			"??????",
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
							"?????????????????????.\n????????????????????? ?????? ??? ?????? ????????? ???????????????.",
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
						"??????",
						() => {
							setAlertOpens(prev => {
								return { ...prev, isOpen: false };
							});
						},
						undefined
					);
				});
			},
			"??????",
			() => {
				setAlertOpens(prev => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	// Step 3 ???????????? ????????? Row - Render
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
			{/*--------------------------------------------- Step 1 : ?????? ?????? ---------------------------------------------*/}
			{
				activeStep === 0 &&
				<>
					{/* ?????? ?????? */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;?????? ??????</MC.Typography>
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
					{/* ?????? ?????? */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;?????? ??????</MC.Typography>
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
						{reservationObj.first === "" && <MC.FormHelperText>????????? ?????? ??????????????????.</MC.FormHelperText>}
					</MC.FormControl>
					{/* ?????? ?????? */}
					{!facilityAdditionalFlag &&
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;?????? ??????</MC.Typography>
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
						{reservationObj.prgm_numb === "" && <MC.FormHelperText>????????? ?????? ??????????????????.</MC.FormHelperText>}
					</MC.FormControl>
					}
					{/* ?????? ?????? */}
					{(prtmclss === "10" || prtmclss === "20" || prtmclss === "40" || prtmclss === "60") &&
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"} style={{ marginBottom: 3 }}>
							<MC.Typography>&nbsp;&nbsp;?????? ??????</MC.Typography>
						</MC.Grid>

						<MC.Grid container spacing={1} alignItems={"center"} justify={"flex-start"} style={{ marginTop: 10 }}>
							{/* ???????????? - ????????? ?????? 10 or 20 or 40 or 60?????? display*/}
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
										label={"????????????"}
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
							{/* ???????????? - ????????? ?????? 10 or 20 or 60?????? display*/}
							{(prtmclss === "10" || prtmclss === "20" || prtmclss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										select
										name="rsvt_strt_time"
										id="rsvt_strt_time-basic"
										variant="outlined"
										label="????????????"
										error={errors.rsvt_strt_time}
										value={reservationObj.rsvt_strt_time || "09"}
										onChange={(event) => handleChange(event)}
										style={{ height: 50 }}
									>
										{
											timeList.map((value, index) => (
												<MC.MenuItem key={index} value={value}>
													{`${value} ???`}
												</MC.MenuItem>
											))
										}
									</MC.TextField>
								</MC.FormControl>
							</MC.Grid>
							}
							{/* ???????????? - ????????? ?????? 40 or 60?????? display*/}
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
										label={"????????????"}
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
							{/* ???????????? - ????????? ?????? 10 or 20 or 60?????? display*/}
							{(prtmclss === "10" || prtmclss === "20" || prtmclss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										select
										name="rsvt_end_time"
										id="rsvt_end_time-basic"
										variant="outlined"
										label="????????????"
										error={errors.rsvt_end_time}
										value={reservationObj.rsvt_end_time || "18"}
										onChange={(event) => handleChange(event)}
										style={{ height: 50 }}
									>
										{
											timeList.map((value, index) => (
												<MC.MenuItem key={index} value={value}>
													{`${value} ???`}
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

			{/*--------------------------------------------- Step 2 : ?????? ?????? ---------------------------------------------*/}
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
							????????? ??????
						</MC.Button>
					</MC.Grid>
					{/* ?????? ?????? */}
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
					{/*	?????? ????????? ?????????*/}
					<MC.Grid container spacing={6} alignItems={"center"} justify={"flex-start"}
									 style={{ marginTop: 10, marginLeft: 2 }}>
						<div style={{ border: "1px solid gray", backgroundColor: "#449CE8", width: 20, height: 20 }}></div>
						<MC.Typography>&nbsp;?????? ??????</MC.Typography>
						&nbsp;&nbsp;
						<div style={{ border: "1px solid gray", backgroundColor: "#FFFFFF", width: 20, height: 20 }}></div>
						<MC.Typography>&nbsp;?????? ??????</MC.Typography>
						&nbsp;&nbsp;
						<div
							style={{ border: "1px solid gray", backgroundColor: "rgba(0, 0, 0, 0.12)", width: 20, height: 20 }}></div>
						<MC.Typography>&nbsp;?????? ??????</MC.Typography>
						&nbsp;&nbsp;
					</MC.Grid>
				</>
			}
			{/*--------------------------------------------- Step 3 : ???????????? ---------------------------------------------*/}
			{
				activeStep === 2 &&
				<>
					<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} className={classes.tableRoot}>
						{renderTableRow("?????????", basketReservation.prgm_name)}
						{renderTableRow("????????????", (prtmclss === "") ? "????????????" :
							(prtmclss === "10" || prtmclss === "20") ? basketReservation.rsvt_strt_time && (basketReservation.rsvt_strt_date + ", " + basketReservation.rsvt_strt_time.substring(0, 2) + "??? ~ " + basketReservation.rsvt_end_time.substring(0, 2) + "???") :
								prtmclss === "40" ? basketReservation.rsvt_strt_date + " ~ " + basketReservation.rsvt_end_date :
									prtmclss === "60" ? basketReservation.rsvt_strt_date + " ~ " + basketReservation.rsvt_end_date : "????????????")}
						{renderTableRow("??????(??????)", basketReservation.detl_numb ? (basketReservation.detl_numb + "???") : "????????????")}
						{renderTableRow("????????????", basketReservation.rsvt_amt + "???")}
					</MC.Grid>

					<div className={classes.reservInfoField}>
						<MC.Grid container direction={"row"} alignItems={"center"}>
							<ErrorOutlineIcon/>&nbsp;<MC.Typography>?????? ????????????</MC.Typography>
							<br />
							<br />
						</MC.Grid>
						<div
							className="ql-editor"
							dangerouslySetInnerHTML={{
								__html:
									reservationGuide !== ""
										? reservationGuide
										: "????????? ??????????????? ????????????.",
							}}
							style={{ maxHeight: "none", fontSize: 14 }}
						/>
					</div>
				</>
			}

			{/*------------------------------------------------ ?????? ?????? --------------------------------------------------*/}
			<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
				<MC.Button
					onClick={handleBack}
					variant="outlined"
					style={{
						marginRight: 10, width: 200,
					}}
				>
					{activeStep === 0 ? "??????" : "??????"}
				</MC.Button>
				<MC.Button
					onClick={activeStep !== 2 ? handleNext : handleSubmit}
					variant="contained"
					color="primary"
					style={{
						width: 200,
					}}
				>
					{activeStep !== 2 ? "??????" : "????????????"}
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

