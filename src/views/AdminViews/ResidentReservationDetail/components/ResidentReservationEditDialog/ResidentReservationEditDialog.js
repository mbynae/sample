import React, { useCallback, useEffect, useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, Calendar, DateFormat }                                from "../../../../../components";
import FiberManualRecordIcon                                                from "@material-ui/icons/FiberManualRecord";
import CancelOutlinedIcon                                                   from "@material-ui/icons/CancelOutlined";
import ArrowRightAltIcon                                                    from "@material-ui/icons/ArrowRightAlt";
import moment                                                               from "moment";
import { residentReservationMgmtRepository, residentReservationRepository } from "../../../../../repositories";
import { ResidentReservationTable }                                         from "../../components";

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

const ResidentReservationEditDialog = props => {
	const classes = useStyles();

	const { aptId, open, onClose, id } = props;
	const [scroll, setScroll] = useState("paper");
	const [nowMonth, setNowMonth] = useState();
	const [incrementFn, setIncrementFn] = useState({
		increment: (date, month, residentReservationMgmt) => {
			let nowDate = moment(date);
			let monthOfYear = nowDate.month();
			nowDate.month(monthOfYear + month);
			handleSelectDay(nowDate.toDate(), residentReservationMgmt);
			return nowDate.toDate();
		}
	});

	const [residentReservationMgmt, setResidentMgmt] = useState({});
	const [lastSelectDate, setLastSelectDate] = useState();
	const [residentReservation, setResidentReservation] = useState();
	const [residentReservationSlots, setResidentReservationSlots] = useState();

	useEffect(() => {
		const init = () => {
			if ( id ) {
				getResidentReservation(id);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [id]);

	const getResidentReservation = (id) => {
		residentReservationRepository
			.getResidentReservation(id)
			.then(async result => {
				await setResidentReservation(result);
				await getResidentMgmt(result.residentReservationSlot.residentReservationMgmt.id);
			});
	};

	const getResidentMgmt = (id) => {
		residentReservationMgmtRepository
			.getResidentReservationMgmt(id)
			.then(result => {
				setResidentMgmt(result);
				console.log(result);
				handleSelectDay(result.residentFromDate, result);
			});
	};

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
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
					noFn:  () => noCallback()
				};
			}
		);
	};

	const handleClose = (id) => {
		onClose(id);
	};

	const convertToYearMonth = (value) => {
		return moment(value).date(1).hour(0).minute(0).second(0).milliseconds(0).valueOf();
	};

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
		let selectDay = moment(lastSelectDate);
		return selectDay.isSame(date, "day");
	};
	const isBetween = (date, residentReservationMgmt) => {
		if ( residentReservationMgmt ) {
			let nowDate = moment(date);
			let fromDayOfMonth = moment(residentReservationMgmt.reservationFromDate).day();
			let fromDate = moment(residentReservationMgmt.reservationFromDate).day(fromDayOfMonth - 1);
			let toDayOfMonth = moment(residentReservationMgmt.reservationToDate).day();
			let toDate = moment(residentReservationMgmt.reservationToDate).day(toDayOfMonth + 1);
			return nowDate.isBetween(fromDate.format("YYYY-MM-DD"), toDate.format("YYYY-MM-DD"));
		}
	};
	const findSlots = (date, residentReservationMgmt) => {
		let nowDate = moment(date);
		if ( residentReservationMgmt.residentReservationSlots ) {
			return residentReservationMgmt.residentReservationSlots.filter(obj => {
				let fromDate = moment(obj.residentFromDate).format("YYYY-MM-DD");
				return nowDate.isSame(fromDate, "day");
			});
		}
	};
	const handleSelectDay = (date, residentReservationMgmt) => {
		if ( isBetween(date, residentReservationMgmt) ) {
			setLastSelectDate(date);
			setNowMonth(date);
			setResidentReservationSlots(prev => {
				const slots = findSlots(date, residentReservationMgmt);
				return [
					...slots
				];
			});
		}
	};

	const renderCloseDay = () => {
		return (
			<div className={classes.closeLayout}>
				<div className={classes.closeLeft} />
				<div className={classes.closeRight} />
			</div>
		);
	};

	const renderCell = ({ date }) => {
		const nowDate = moment(date);
		const selectDay = isSelectDay(date);
		const thisMonth = isThisMonth(date, nowMonth);

		let between = isBetween(date, residentReservationMgmt);
		let residentReservations = [];
		let slots = [];
		if ( between ) {
			slots = findSlots(date, residentReservationMgmt);
			if ( slots.length > 0 ) {
				slots.sort((a, b) => a.id - b.id).map(obj => {
					residentReservations = residentReservations.concat(obj.residentReservations);
				});
			}
		}

		return (
			<div className={classes.nowDay} style={{ cursor: "pointer" }} onClick={() => handleSelectDay(date, residentReservationMgmt)}>
				<MC.Grid container justify={"flex-start"} alignItems={"flex-start"}>
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

	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			fullWidth={true}
			scroll={scroll}
			aria-labelledby="form-residentReservationMgmt-dialog-title">

			<MC.DialogTitle id="form-residentReservationMgmt-dialog-title">
				입주예약
			</MC.DialogTitle>

			<MC.DialogContent dividers={scroll === "paper"}>

				<MC.Grid container justify={"space-between"} alignItems={"center"} style={{ marginBottom: 37 }}>
					<MC.Grid item>
						<MC.Button
							size={"small"}
							disabled={convertToYearMonth(residentReservationMgmt.reservationFromDate) === convertToYearMonth(nowMonth)}
							onClick={() => setNowMonth(incrementFn.increment(nowMonth, -1, residentReservationMgmt))}
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
							onClick={() => setNowMonth(incrementFn.increment(nowMonth, 1, residentReservationMgmt))}
							endIcon={<ArrowRightAltIcon />}>
							다음 달
						</MC.Button>
					</MC.Grid>
				</MC.Grid>

				<>
					<Calendar
						date={nowMonth}
						withWeekDays
						renderWeekDay={renderWeekDay}
						breakPoint={300}
						renderCell={renderCell} />

					<MC.Grid container justify={"flex-start"} style={{ marginTop: 5 }}>
						<MC.Typography variant={"subtitle1"} style={{ fontSize: 14, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
							※ <FiberManualRecordIcon style={{ fontSize: 14, color: "#bcbcbc" }} /> : 예약불가일자 &nbsp;<FiberManualRecordIcon
							style={{ fontSize: 14 }} /> : 예약가능일자 &nbsp;
							<CancelOutlinedIcon
								style={{ fontSize: 14, color: "#d6d6d6" }} /> : 예약종료 일자
						</MC.Typography>
					</MC.Grid>
				</>

				<ResidentReservationTable
					residentReservation={residentReservation}
					setLastSelectDate={setLastSelectDate}
					handleAlertToggle={handleAlertToggle}
					setAlertOpens={setAlertOpens}
					residentReservationMgmt={residentReservationMgmt}
					residentReservationSlots={residentReservationSlots}
					onClose={handleClose}
				/>

			</MC.DialogContent>

			<MC.DialogActions>
				<MC.Button onClick={() => handleClose()}>
					취소
				</MC.Button>
			</MC.DialogActions>

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

		</MC.Dialog>
	);
};

export default ResidentReservationEditDialog;
