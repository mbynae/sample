import React, { useEffect, useState } from "react";
import moment                         from "moment";
import clsx                           from "clsx";
import MomentUtils                    from "@date-io/moment";

import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import { TimeTypeKind }          from "../../../../../enums";

const useStyles = MS.makeStyles(theme => ({
	root: {
		borderTop: "2px solid #449CE8"
	},
	cellTitle: {
		backgroundColor: "#f9f9f9",
		width: 150,
		height: "auto",
		[theme.breakpoints.down("xs")]: {
			width: 120
		}
	},
	cellTitle_date: {
		backgroundColor: "#f9f9f9",
		width: 150,
		[theme.breakpoints.up("lg")]: {
			height: 50
		},
		[theme.breakpoints.down("lg")]: {
			height: 50
		},
		[theme.breakpoints.down("md")]: {
			height: 100
		},
		[theme.breakpoints.down("sm")]: {
			height: 100
		},
		[theme.breakpoints.down("xs")]: {
			width: 120,
			height: 212
		}

	},
	cellContent: {
		width: 420,
		paddingLeft: 20,
		paddingRight: 20,
		[theme.breakpoints.down("xs")]: {
			width: 250,
			paddingLeft: 15,
			paddingRight: 15
		}
	},
	body4: {
		...theme.typography.body4,
	},
	datePickerContainer: {
		"& fieldset": {
			// borderRadius: 0
		}
	},
	datePicker: {
		paddingTop: 10,
		paddingBottom: 10,
		margin: 0,
		height: 20
	},
	calendarButton: {
		padding: 0,
		paddingTop: 2,
		"& svg": {
			fontSize: 16
		}
	}
}));
const VisitingCarEditForm = props => {
	const classes = useStyles();

	const { isEdit, isMobile, isTablet, menuKey, aptId, visitingCar, setVisitingCar, errors, setErrors } = props;

	const [toTimeTypeKind, setToTimeTypeKind] = useState([]);
	const [toTimeTypeIndex, setToTimeTypeIndex] = useState(24);

	useEffect(() => {
		const init = () => {

			let visitFromDate = moment(visitingCar.visitFromDate);
			let visitToDate = moment(visitingCar.visitToDate);
			if (visitFromDate && visitFromDate.isSame(visitToDate, "day")) {
				let index = Object.entries(TimeTypeKind).findIndex(
					data => data[0].replaceAll("HOUR_", "") === (visitingCar ? moment(visitingCar.visitFromDate).format("HH") : TimeTypeKind.HOUR_09.replaceAll("HOUR_", "")));
				let total = Object.entries(TimeTypeKind).length;
				setToTimeTypeKind(prev => {
					prev = Object.entries(TimeTypeKind).splice(index + 1, total);

					let tempIndex = Object.entries(TimeTypeKind).findIndex(
						data => data[0].replaceAll("HOUR_", "") === (visitingCar ? moment(visitingCar.visitToDate).format("HH") : TimeTypeKind.HOUR_09.replaceAll("HOUR_", "")));
					setToTimeTypeIndex(tempIndex);
					return [...prev];
				});
			} else {
				setToTimeTypeKind(prev => {
					prev = Object.entries(TimeTypeKind);
					setToTimeTypeIndex(prev.length);
					return [...prev];
				});
			}

		};
		setTimeout(() => {
			init();
		}, 100);
	}, [visitingCar]);

	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setErrors(prev => {
			if (name === "carNumber") {
				return { ...prev, isCarNumber: value === "" };
			} else {
				return { ...prev };
			}
		});

		setVisitingCar(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	const getDate = (date, isFrom) => moment(date).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);

	const handleDateChange = (key, date, value, isFrom) => {
		setVisitingCar(prev => {
			return {
				...prev,
				[key]: getDate(date, isFrom)
			};
		});
	};

	const handleTimeChange = (key, time, isFrom) => {
		setVisitingCar(prev => {
			let temp = moment(prev[key]);
			temp.hour(time);
			return {
				...prev,
				[key]: getDate(temp, isFrom)
			};
		});
	};

	return (
		<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}
						 className={classes.root}>

			<MC.Grid item xs={12} lg={6} style={{ height: "auto", borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle} style={{ height: isMobile ? 60 : 50 }}>
						<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
							<MC.Typography>
								차량번호
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.FormControl fullWidth>
							<MC.TextField
								id="carNumber-basic"
								name="carNumber"
								variant="outlined"
								placeholder={`차량번호를 입력해주세요.${isMobile ? "" : " (예시: 12가1234)"}`}
								error={errors.isCarNumber}
								className={clsx(classes.formControl, classes.body5)}
								style={{ height: 42 }}
								inputProps={{
									style: {
										height: 42,
										padding: "0 14px"
									}
								}}
								value={visitingCar.carNumber || ""}
								onChange={handleChange}/>
						</MC.FormControl>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid item xs={12} lg={6} style={{ height: "auto", borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle} style={{ height: isMobile ? 98 : 50 }}>
						<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
							<MC.Typography>
								방문목적
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.FormControl className={classes.formControl}>
							<MC.RadioGroup
								row
								aria-label="purposeVisitType"
								name="purposeVisitType"
								value={visitingCar.purposeVisitType || "VT"}
								onChange={handleChange}>
								<MC.FormControlLabel value="VT" control={<MC.Radio color={"primary"}/>} label="세대방문"/>
								<MC.FormControlLabel value="GT" control={<MC.Radio color={"primary"}/>} label="기타"/>
							</MC.RadioGroup>
						</MC.FormControl>

						<MC.FormControl>
							<MC.TextField
								id="etcPurposeVisit-basic"
								name="etcPurposeVisit"
								variant="outlined"
								disabled={visitingCar.purposeVisitType !== "GT"}
								placeholder="방문 목적을 입력해주세요."
								className={clsx(classes.formControl, classes.body5)}
								style={{ height: 42 }}
								inputProps={{
									style: {
										width: isMobile ? 192 : 185,
										height: 42,
										padding: "0 14px"
									}
								}}
								value={visitingCar.etcPurposeVisit || ""}
								onChange={handleChange}/>
						</MC.FormControl>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid item xs={12} md={12} style={{ height: "auto", borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle_date}>
						<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
							<MC.Typography>
								방문일시
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent} style={{
						width: isMobile ? 250 : isTablet ? 600 : 800,
						paddingLeft: isMobile ? 15 : 20,
						paddingRight: isMobile ? 15 : 20
					}}>
						<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
							<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
								<MC.Grid item xs={12} sm={3} md={3} lg={3}>
									<KeyboardDatePicker
										autoOk
										variant={isMobile ? "standard" : "inline"}
										inputVariant="outlined"
										views={["date"]}
										id="visitFromDate-picker-dialog"
										format="yyyy.MM.DD"
										disableToolbar
										disablePast
										maxDate={visitingCar.visitToDate || new Date()}
										value={visitingCar.visitFromDate || new Date()}
										keyboardIcon={<CalendarTodayOutlinedIcon/>}
										KeyboardButtonProps={{
											className: classes.calendarButton
										}}
										onChange={(date, value) => handleDateChange("visitFromDate", date, value, true)}
										inputProps={{ className: classes.datePicker }}
										className={classes.datePickerContainer}
									/>
								</MC.Grid>
								<MC.Grid item xs={12} sm={2} md={2} lg={2}
												 style={{ marginTop: isMobile ? 5 : 0, marginLeft: isMobile ? 0 : 10 }}>
									<MC.FormControl fullWidth className={classes.formControl}>
										<MC.Select
											labelId="visitFromDate-label"
											name="visitFromDate"
											id="visitFromDate-basic"
											variant="outlined"
											value={moment(visitingCar.visitFromDate).format("HH") || "09"}
											onChange={(event) => handleTimeChange("visitFromDate", event.target.value, true)}
											style={{ height: 40 }}
										>
											{
												Object.entries(TimeTypeKind).slice(0, toTimeTypeIndex).map((value, index) => (
													<MC.MenuItem key={index} value={value[0].replaceAll("HOUR_", "")}>
														{`${("" + index).length === 1 ? `0${index}` : index} 시`}
													</MC.MenuItem>
												))
											}
										</MC.Select>
									</MC.FormControl>
								</MC.Grid>
								<MC.Grid item>
									&nbsp; ~ &nbsp;
								</MC.Grid>
								<MC.Grid item xs={12} sm={3} md={3} lg={3}>
									<KeyboardDatePicker
										autoOk
										variant={isMobile ? "standard" : "inline"}
										inputVariant="outlined"
										views={["date"]}
										id="visitToDate-picker-dialog"
										format="yyyy.MM.DD"
										disableToolbar
										minDate={visitingCar.visitFromDate || new Date()}
										value={visitingCar.visitToDate || new Date()}
										keyboardIcon={<CalendarTodayOutlinedIcon/>}
										KeyboardButtonProps={{
											className: classes.calendarButton
										}}
										onChange={(date, value) => handleDateChange("visitToDate", date, value, false)}
										inputProps={{ className: classes.datePicker }}
										className={classes.datePickerContainer}
									/>
								</MC.Grid>
								<MC.Grid item xs={12} sm={2} md={2} lg={2}
												 style={{ marginTop: isMobile ? 5 : 0, marginLeft: isMobile ? 0 : 10 }}>
									{
										toTimeTypeKind.length > 0 &&
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.Select
												labelId="visitToDate-label"
												name="visitToDate"
												id="visitToDate-basic"
												variant="outlined"
												value={moment(visitingCar.visitToDate).format("HH") || "18"}
												onChange={(event) => handleTimeChange("visitToDate", event.target.value, false)}
												style={{ height: 40 }}
											>
												{
													toTimeTypeKind.map((value, index) => (
														<MC.MenuItem key={index} value={value[0].replaceAll("HOUR_", "")}>
															{`${("" + value[0].replaceAll("HOUR_", "")).length === 1 ? `0${value[0].replaceAll("HOUR_", "")}` : value[0].replaceAll("HOUR_", "")} 시`}
														</MC.MenuItem>
													))
												}
											</MC.Select>
										</MC.FormControl>
									}
								</MC.Grid>
							</MC.Grid>
						</MuiPickersUtilsProvider>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

		</MC.Grid>
	);
};

export default VisitingCarEditForm;
