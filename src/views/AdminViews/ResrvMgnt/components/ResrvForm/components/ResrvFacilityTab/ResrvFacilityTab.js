import React, { useState, useEffect }                  from "react";
import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";
import ResrvSeatModal                                  from "../../../ResrvSeatModal";
import { resrvHistRepository }                         from "../../../../../../../repositories";
import moment                                          from "moment";
import CalendarTodayOutlinedIcon                       from "@material-ui/icons/CalendarTodayOutlined";

const useStyles = MS.makeStyles(theme => ({
	keyboardDatePicker: {
		width: "100%"
	},
	textField: {
		"& input": {
			fontWeight: "normal"
		},
		"& p": {
			color: "#222222",
			fontWeight: "normal",
			marginLeft: 0
		}
	},
	cardContent: {
		width: "90%", marginLeft: "5%", marginTop: "1%"
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
	dayWithContainer: {
		position: 'relative'
	}
}));

const ResrvFacilityTab = props => {

	const {
		dateInit,
		getDate,
		handleSeatModal,
		handleDateChange,
		seatModalOpen,
		reservationInfo,
		setReservationInfo,
		fcltAdditionalFlag,
		setFcltAdditionalFlag,
		getSeatList,
		seatList,
		selectedSeat,
		setSelectedSeat,
		prtmClss,
		setPrtmClss,
		errors,
		setErrors,
		seatListFlag,
		selectedMembNumb
	} = props;
	const classes = useStyles();
	const [fcltist, setFcltList] = useState([]); // 대분류 Dropdown List
	const [fcltPrgmList, setFcltPrgmList] = useState([]); // 중분류 Dropdown List
	const [fcltAdditionalList, setFcltAdditionalList] = useState([]); // 추가상품 Dropdown List

	const timeList = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
		"12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

	useEffect(() => {
		const init = async () => {
			await getResrvFacility();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const [holidayList, setHolidayList] = useState([]); // 단지 휴일 일자
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
				tempHolidayList = [...tempHolidayList, ...result.data_json_array]
				resrvHistRepository.getHolidayList(moment(oneMonth).format("YYYY-MM-DD"))
					.then(result => {
						tempHolidayList = [...tempHolidayList, ...result.data_json_array]
						resrvHistRepository.getHolidayList(moment(twoMonth).format("YYYY-MM-DD"))
							.then(result => {
								tempHolidayList = [...tempHolidayList, ...result.data_json_array]
								setHolidayList(tempHolidayList.filter((filterItem, index) => filterItem.rsvt_psbl_at === "N"))
							})
					})
			})
	}
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

	const handleFormChange = (event) => {

		const e = event.target;

		// Validation 체크
		setErrors(prev => {
			if (event.target.name === "facility") {
				return { ...prev, facility: e.value === "" };
			} else if (event.target.name === "ticket") {
				return { ...prev, ticket: e.value === "" };
			} else if (event.target.name === "additional") {
				return { ...prev, additional: e.value === "" };
			} else {
				return { ...prev };
			}
		});

		// Validation 체크 - 시작시간
		if (event.target.name === "rsvt_strt_time") {
			if ((moment(reservationInfo.rsvt_strt_date).format("YYYY-MM-DD") === moment(reservationInfo.rsvt_end_date).format("YYYY-MM-DD"))
				|| prtmClss === "10" || prtmClss === "20") {
				if (reservationInfo.rsvt_end_time < e.value) {
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
		else if (event.target.name === "rsvt_end_time") {
			if ((moment(reservationInfo.rsvt_strt_date).format("YYYY-MM-DD") === moment(reservationInfo.rsvt_end_date).format("YYYY-MM-DD"))
				|| prtmClss === "10" || prtmClss === "20") {
				if (reservationInfo.rsvt_strt_time > e.value) {
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

		// 대분류 선택되었을 때 중분류 가져옴
		if (event.target.name === "facility") {
			setPrtmClss(""); // 이용권 유형 초기화
			getResrvFacilityPrgm(event.target.value); // 중분류 목록 가져옴
			setReservationInfo({
				...reservationInfo,
				facility: e.value,
				ticket: "",
				additional: "",
				rsvt_strt_date: dateInit(true),
				rsvt_strt_time: "09",
				rsvt_end_date: dateInit(false),
				rsvt_end_time: "18"
			}); // 기존 선택된 Input 초기화
			setSelectedSeat(-1); // 좌석 초기화

			getHolidayList() // 단지 휴일 정보 가져옴
		}
		// 중분류 선택되었을 때 추가상품 가져옴
		else if (event.target.name === "ticket") {
			getAdditionalPrgm(event.target.value);
			setReservationInfo({ ...reservationInfo, ticket: e.value, additional: "" }); // 기존 선택된 추가상품 초기화
		}
		// 추가분류 선택되었을 때
		else if (event.target.name === "additional") {
			let valueList = e.value.split("|");
			setPrtmClss(valueList[1]); // 이용권 유형 선택
			getSeatList(valueList[0], valueList[1], false); // 선택된 추가상품에 따른 좌석 호출
			setReservationInfo({ ...reservationInfo, [e.name]: e.value });
		} else {
			setReservationInfo({ ...reservationInfo, [e.name]: e.value });
		}
	};

	// 시설 대분류 Dropdown
	const getResrvFacility = () => {
		resrvHistRepository.getFcltSearch({}, "rsvtbigload/0000")
			.then(result => {
				// setFcltDataSize(data.data_json_array_size);
				// let resultList = result.data_json_array.map(a=>{a.fclm_name});
				setFcltList(result.data_json_array);
			});
	};

	// 시설 중분류 Dropdown
	const getResrvFacilityPrgm = (fcltNumb) => {
		resrvHistRepository.getPrgmSearch({}, `0000/${fcltNumb}`)
			.then(result => {
				setFcltPrgmList(result.data_json_array);
			});
	};

	// 시설 추가상품 Dropdown
	const getAdditionalPrgm = (fcltNumb) => {

		let valueList = fcltNumb.split("|");

		resrvHistRepository.getFcltSearch({ memb_numb: selectedMembNumb }, "rsvtprgmlistload/" + valueList[0])
			.then(result => {
				setFcltAdditionalList(result.data_json_array);
				if (result.data_json_array.length === 0) {
					setFcltAdditionalFlag(true);
					setPrtmClss(valueList[1]);
					getSeatList(valueList[0], valueList[1], false); // 선택한 중분류에 따른 좌석 호출
				} else {
					setFcltAdditionalFlag(false);
				}
			});
	};

	return (
		<MC.Card style={{ overflow: "visible" }}>
			<MC.CardContent>
				<MC.Grid container spacing={2} justify="center" alignItems="center" style={{ marginTop: "1%" }}>

					{/* 대분류 */}
					<MC.Grid item xs={12} md={8}>
						<MC.TextField
							select
							variant={"outlined"}
							label={"시설 선택"}
							name="facility"
							id="facility"
							error={errors.facility}
							value={reservationInfo.facility || ""}
							onChange={handleFormChange}
							style={{ width: "100%" }}
						>
							{
								fcltist.map((item) => (
									<MC.MenuItem key={item.fclt_numb} value={item.fclt_numb}>
										{item.fclm_name}
									</MC.MenuItem>
								))
							}
						</MC.TextField>
					</MC.Grid>

					{/* 중분류 */}
					<MC.Grid item xs={12} md={8}>
						<MC.TextField
							select
							variant={"outlined"}
							label={"이용권 선택"}
							name="ticket"
							id="ticket"
							placeholder={"이용권"}
							error={errors.ticket}
							disabled={reservationInfo.facility === ""}
							value={reservationInfo.ticket || ""}
							onChange={handleFormChange}
							style={{ width: "100%" }}
						>
							{
								fcltPrgmList.map((item) => (
									<MC.MenuItem key={item.prgm_numb} value={item.prgm_numb + "|" + item.prtm_clss}>
										{item.prgm_name}
									</MC.MenuItem>
								))
							}
						</MC.TextField>
						{reservationInfo.facility === "" && <MC.FormHelperText>시설을 먼저 선택해주세요.</MC.FormHelperText>}
					</MC.Grid>

					{/* 추가 상품*/}
					{!fcltAdditionalFlag &&
					<MC.Grid item xs={12} md={8}>
						<MC.TextField
							select
							variant={"outlined"}
							label={"추가상품 선택"}
							name="additional"
							id="additional"
							placeholder={"추가상품"}
							error={errors.additional}
							disabled={reservationInfo.ticket === ""}
							value={reservationInfo.additional || ""}
							onChange={handleFormChange}
							style={{ width: "100%" }}
						>
							{
								fcltAdditionalList.map((item) => (
									<MC.MenuItem key={item.prgm_numb} value={item.prgm_numb + "|" + item.prtm_clss}>
										{item.prgm_name}
									</MC.MenuItem>
								))
							}
						</MC.TextField>
						{reservationInfo.ticket === "" && <MC.FormHelperText>이용권을 먼저 선택해주세요.</MC.FormHelperText>}
					</MC.Grid>
					}

					{/* 날짜 선택 */}
					{(prtmClss === "10" || prtmClss === "20" || prtmClss === "40" || prtmClss === "60") &&
					<MC.Grid item xs={12} lg={8} style={{ marginTop: 10 }}>
						<MC.Grid container spacing={4} alignItems={"center"}>
							{/* 시작일자 - 이용권 유형 10 or 20 or 40 or 60일때 display*/}
							{(prtmClss === "10" || prtmClss === "20" || prtmClss === "40" || prtmClss === "60") &&
							<MC.Grid item xs={8} lg={3}>
								<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									<KeyboardDatePicker
										autoOk
										variant={"inline"}
										inputVariant="outlined"
										views={["date"]}
										id="rsvt_strt_date-picker-dialog"
										format="yyyy.MM.DD"
										label="시작일"
										disableToolbar
										disablePast
										shouldDisableDate={((date) => disableDate(date))}
										maxDate={(prtmClss === "40" || prtmClss === "60") ? reservationInfo.rsvt_end_date : dateInit(false)}
										value={reservationInfo.rsvt_strt_date || dateInit(true)}
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
							{(prtmClss === "10" || prtmClss === "20" || prtmClss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										select
										name="rsvt_strt_time"
										id="rsvt_strt_time-basic"
										variant="outlined"
										label="시작시간"
										error={errors.rsvt_strt_time}
										value={reservationInfo.rsvt_strt_time || "09"}
										onChange={(event) => handleFormChange(event)}
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
							{(prtmClss === "40" || prtmClss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									<KeyboardDatePicker
										autoOk
										variant={"inline"}
										inputVariant="outlined"
										views={["date"]}
										id="rsvt_end_date-picker-dialog"
										format="yyyy.MM.DD"
										label="종료일"
										disableToolbar
										shouldDisableDate={((date) => disableDate(date))}
										minDate={reservationInfo.rsvt_strt_date || new Date()}
										value={reservationInfo.rsvt_end_date || dateInit(false)}
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
							{(prtmClss === "10" || prtmClss === "20" || prtmClss === "60") &&
							<MC.Grid item xs={12} lg={3}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										select
										name="rsvt_end_time"
										id="rsvt_end_time-basic"
										variant="outlined"
										label="종료시간"
										error={errors.rsvt_end_time}
										value={reservationInfo.rsvt_end_time || "18"}
										onChange={(event) => handleFormChange(event)}
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
					</MC.Grid>
					}
					{/* 좌석 있을 경우에만 - 좌석 필드*/}
					{seatListFlag &&
					<MC.Grid item xs={12} md={8}>
						<MC.Grid container spacing={2} alignItems={"center"}>
							<MC.Grid item xs={12} md={9}>
								<MC.InputBase
									className={classes.textField}
									fullWidth
									name="seat"
									variant="outlined"
									type="text"
									inputProps={{
										fontSize: 30,
									}}
									value={selectedSeat === -1 ? "좌석을 선택해주세요." : selectedSeat}
									error={errors.detl_numb}
									disabled
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 5,
										border: "1px solid #c4c4c4",
										padding: 10
									}}
									placeholder={"좌석 번호"}
								/>
							</MC.Grid>
							<MC.Grid item xs={12} md={3}>
								<MC.Button
									color="primary"
									size="large"
									variant="contained"
									disableElevation
									onClick={() => handleSeatModal(true)}
								>
									좌석 선택
								</MC.Button>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					}
				</MC.Grid>
				<ResrvSeatModal
					seatModalOpen={seatModalOpen}
					handleSeatModal={handleSeatModal}
					selectedSeat={selectedSeat}
					setSelectedSeat={setSelectedSeat}
					seatList={seatList}
					setErrors={setErrors}
				/>
			</MC.CardContent>
		</MC.Card>
	);
};

export default ResrvFacilityTab;
