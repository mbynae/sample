import React, { useCallback, useEffect, useState } from "react";
import moment                                      from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, Calendar } from "../../../../../components";

import ArrowRightAltIcon     from "@material-ui/icons/ArrowRightAlt";
import CancelOutlinedIcon    from "@material-ui/icons/CancelOutlined";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const useStyles = MS.makeStyles(theme => ({
	weekDay:     {
		height:          50,
		backgroundColor: "#f9f9f9",
		border:          "1px solid #ebebeb",
		borderTop:       "2px solid #222222"
	},
	nowMonth:    {
		...theme.typography.h6
	},
	nowDay:      {
		height:                         70,
		border:                         "1px solid #ebebeb",
		position:                       "relative",
		padding:                        12,
		"&:hover":                      {
			border: "1px solid rgb(0,0,0)"
		},
		[theme.breakpoints.down("xs")]: {
			height: 50
		}
	},
	closeLayout: {
		background:                     "rgba(249, 249, 249, 0.8)",
		width:                          "100%",
		height:                         70,
		position:                       "absolute",
		top:                            0,
		left:                           0,
		overflow:                       "hidden",
		[theme.breakpoints.down("xs")]: {
			height: 50
		}
	},
	closeLeft:   {
		width:                          "calc(100% * 1.1)",
		height:                         "2px",
		backgroundColor:                "#d6d6d6",
		position:                       "absolute",
		transform:                      "rotate(22deg)",
		left:                           -5,
		top:                            35,
		[theme.breakpoints.down("xs")]: {
			width:     "calc(100% * 2)",
			transform: "rotate(45deg)",
			left:      -22,
			top:       24
		}
	},
	closeRight:  {
		width:                          "calc(100% * 1.1)",
		height:                         "2px",
		backgroundColor:                "#d6d6d6",
		position:                       "absolute",
		transform:                      "rotate(-22deg)",
		left:                           -5,
		top:                            35,
		[theme.breakpoints.down("xs")]: {
			width:     "calc(100% * 2)",
			transform: "rotate(-45deg)",
			left:      -22,
			top:       24
		}
	},
	circle:      {
		backgroundColor: "#449CE8",
		color:           "#fff",
		fontSize:        "1em",
		width:           "1.5em",
		borderRadius:    "3em",
		padding:         ".1em  .2em",
		paddingTop:      0,
		paddingLeft:     ".1em",
		lineHeight:      "1.25em",
		display:         "inline-block",
		textAlign:       "center"
	}
}));
const ResidentReservationCalendar = props => {
	const classes = useStyles();

	const { residentReservationMgmt, findSlots, lastSelectDate, setLastSelectDate, setResidentReservationSlots, isMobile } = props;
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const init = () => {
			if ( residentReservationMgmt ) {
				setNowMonth(new Date(residentReservationMgmt.reservationFromDate));
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	useEffect(() => {
		const init = () => {
			if ( residentReservationMgmt ) {
				if ( lastSelectDate ) {
					setSelectDate(lastSelectDate);
				}
				setIsLoading(false);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [residentReservationMgmt]);

	const [nowMonth, setNowMonth] = useState();
	const [selectDate, setSelectDate] = useState(new Date());

	const [incrementFn, setIncrementFn] = useState({
		increment: (date, month) => {
			let nowDate = moment(date);
			let monthOfYear = nowDate.month();
			nowDate.month(monthOfYear + month);
			return nowDate.toDate();
		}
	});

	const renderWeekDay = useCallback(({ date }) => {
		let nowDate = moment(date);
		return (
			<MC.Grid container justify={"center"} alignItems={"center"} className={classes.weekDay}>
				<MC.Typography variant={"subtitle1"}>
					{nowDate.format("dd")}
				</MC.Typography>
			</MC.Grid>
		);
	}, []);

	const isThisMonth = (date, month) => {
		let thisMonth = moment(month);
		return thisMonth.isSame(date, "month");
	};
	const isSelectDay = (date) => {
		let selectDay = moment(lastSelectDate ? lastSelectDate : selectDate);
		return selectDay.isSame(date, "day");
	};
	const isBetween = (date) => {
		let nowDate = moment(date);
		let fromDayOfMonth = moment(residentReservationMgmt.reservationFromDate).day();
		let fromDate = moment(residentReservationMgmt.reservationFromDate).day(fromDayOfMonth - 1);
		let toDayOfMonth = moment(residentReservationMgmt.reservationToDate).day();
		let toDate = moment(residentReservationMgmt.reservationToDate).day(toDayOfMonth + 1);
		return nowDate.isBetween(fromDate.format("YYYY-MM-DD"), toDate.format("YYYY-MM-DD"));
	};

	const renderCloseDay = () => {
		return (
			<div className={classes.closeLayout}>
				<div className={classes.closeLeft} />
				<div className={classes.closeRight} />
			</div>
		);
	};

	const handleSelectDay = (date, slots) => {
		if ( isBetween(date) ) {
			setLastSelectDate(undefined);
			setSelectDate(date);
			setResidentReservationSlots(prev => {
				return [
					...slots
				];
			});
		}
	};

	const renderCell = ({ date }) => {
		const nowDate = moment(date);
		const selectDay = isSelectDay(date);
		const thisMonth = isThisMonth(date, nowMonth);
		const between = isBetween(date);

		const slots = findSlots(date);
		let residentReservations = [];
		if ( slots.length > 0 ) {
			slots.sort((a, b) => a.id - b.id).map(obj => {
				residentReservations = residentReservations.concat(obj.residentReservations);
			});
		}

		return (
			<div className={classes.nowDay} style={{ cursor: "pointer" }} onClick={() => handleSelectDay(date, slots)}>
				<MC.Grid container justify={isMobile ? "center" : "flex-start"} alignItems={isMobile ? "center" : "flex-start"}>
					<MC.Typography variant={"subtitle1"} className={selectDay && thisMonth ? classes.circle : ""}
					               style={{ color: between ? "" : "#bcbcbc" }}>
						{
							thisMonth && nowDate.format("D")
						}
					</MC.Typography>
					{
						between && residentReservations.length >= (residentReservationMgmt.reservationTotalCount * slots.length) &&
						renderCloseDay()
					}
				</MC.Grid>
			</div>
		);
	};

	const convertToYearMonth = (value) => {
		return moment(value).date(1).hour(0).minute(0).second(0).milliseconds(0).valueOf();
	};

	return (
		<>
			{
				!isLoading &&
				<>
					<MC.Grid container justify={"space-between"} alignItems={"center"} style={{ marginBottom: isMobile ? 15 : 37 }}>
						<MC.Grid item>
							<MC.Button
								size={"small"}
								disabled={convertToYearMonth(residentReservationMgmt.reservationFromDate) === convertToYearMonth(nowMonth)}
								onClick={() => setNowMonth(incrementFn.increment(nowMonth, -1))}
								startIcon={<ArrowRightAltIcon style={{ transform: "rotate(180deg)" }} />}>
								이전 달
							</MC.Button>
						</MC.Grid>
						<MC.Grid item className={classes.nowMonth}>
							<DateFormat date={nowMonth} format={"YYYY년 MM월"} />
						</MC.Grid>
						<MC.Grid item>
							<MC.Button
								size={"small"}
								disabled={convertToYearMonth(residentReservationMgmt.reservationToDate) === convertToYearMonth(nowMonth)}
								onClick={() => setNowMonth(incrementFn.increment(nowMonth, 1))}
								endIcon={<ArrowRightAltIcon />}>
								다음 달
							</MC.Button>
						</MC.Grid>
					</MC.Grid>

					<Calendar
						date={nowMonth}
						withWeekDays
						renderWeekDay={renderWeekDay}
						breakPoint={300}
						renderCell={renderCell} />

					<MC.Grid container justify={"flex-start"} style={{ marginTop: 5 }}>
						<MC.Typography variant={"subtitle1"} style={{ fontSize: isMobile ? 13 : 14, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
							※ <FiberManualRecordIcon style={{ fontSize: isMobile ? 13 : 14, color: "#bcbcbc" }} /> : 예약불가일자 &nbsp;<FiberManualRecordIcon style={{ fontSize: isMobile ? 13 : 14 }} /> : 예약가능일자 &nbsp;
							<CancelOutlinedIcon
								style={{ fontSize: 14, color: "#d6d6d6" }} /> : 예약종료 일자
						</MC.Typography>

					</MC.Grid>
				</>
			}
		</>
	);
};

export default ResidentReservationCalendar;
