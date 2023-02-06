import React, { useCallback, useEffect, useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, Calendar, DateFormat }                     from "../../../../../components";
import FiberManualRecordIcon                                     from "@material-ui/icons/FiberManualRecord";
import CancelOutlinedIcon                                        from "@material-ui/icons/CancelOutlined";
import ArrowRightAltIcon                                         from "@material-ui/icons/ArrowRightAlt";
import moment                                                    from "moment";
import { ReservationTypeKind }                                   from "../../../../../enums";
import { facilityMgmtRepository, facilityReservationRepository } from "../../../../../repositories";
import { FacilityReservationTable }                              from "../../components";

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

const FacilityReservationEditDialog = props => {
	const classes = useStyles();

	const { aptId, open, onClose, id } = props;
	const [scroll, setScroll] = useState("paper");
	const [nowMonth, setNowMonth] = useState();
	const [incrementFn, setIncrementFn] = useState({
		increment: (date, month, facilityMgmt) => {
			let nowDate = moment(date);
			let monthOfYear = nowDate.month();
			nowDate.month(monthOfYear + month);
			handleSelectDay(nowDate.toDate(), facilityMgmt);
			return nowDate.toDate();
		}
	});

	const [facilityMgmt, setFacilityMgmt] = useState({});
	const [lastSelectDate, setLastSelectDate] = useState();
	const [facilityReservation, setFacilityReservation] = useState();
	const [facilityReservationSlots, setFacilityReservationSlots] = useState();

	useEffect(() => {
		const init = () => {
			if ( id ) {
				getFacilityReservation(id);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [id]);

	const getFacilityReservation = (id) => {
		facilityReservationRepository
			.getFacilityReservation(id)
			.then(async result => {
				await setFacilityReservation(result);
				await getFacilityMgmt(result.facilityReservationSlot.facilityMgmt.id);
			});
	};

	const getFacilityMgmt = (id) => {
		facilityMgmtRepository
			.getFacilityMgmt(id)
			.then(result => {
				setFacilityMgmt(result);
				handleSelectDay(result.reservationFromDate, result);
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

	const handleClose = () => {
		onClose();
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
	const isBetween = (date, facilityMgmt) => {
		if ( facilityMgmt ) {
			let nowDate = moment(date);
			let fromDayOfMonth = moment(facilityMgmt.reservationFromDate).day();
			let fromDate = moment(facilityMgmt.reservationFromDate).day(fromDayOfMonth - 1);
			let toDayOfMonth = moment(facilityMgmt.reservationToDate).day();
			let toDate = moment(facilityMgmt.reservationToDate).day(toDayOfMonth + 1);
			return nowDate.isBetween(fromDate.format("YYYY-MM-DD"), toDate.format("YYYY-MM-DD"));
		}
	};
	const findSlots = (date, facilityMgmt) => {
		let nowDate = moment(date);
		if ( facilityMgmt.facilityReservationSlots ) {
			return facilityMgmt.facilityReservationSlots.filter(obj => {
				let fromDate = moment(obj.reservationFromDate).format("YYYY-MM-DD");
				if ( facilityMgmt.reservationType === ReservationTypeKind.DAY ) {
					return nowDate.isSame(fromDate, "day");
				} else {
					return nowDate.isSame(fromDate, "month");
				}
			});
		}
	};
	const handleSelectDay = (date, facilityMgmt) => {
		if ( isBetween(date, facilityMgmt) ) {
			setLastSelectDate(date);
			setNowMonth(date);
			setFacilityReservationSlots(prev => {
				const slots = findSlots(date, facilityMgmt);
				return [
					...slots
				];
			});
		}
	};

	const renderCloseDay = () => {
		return (
			<div className={classes.closeLayout}>
				{/*<div className={classes.closeLeft} />*/}
				{/*<div className={classes.closeRight} />*/}
			</div>
		);
	};

	const renderCell = ({ date }) => {
		const nowDate = moment(date);
		const selectDay = isSelectDay(date);
		const thisMonth = isThisMonth(date, nowMonth);

		let between = isBetween(date, facilityMgmt);
		let facilityReservations = [];
		let slots = [];
		if ( between ) {
			slots = findSlots(date, facilityMgmt);
			if ( slots.length > 0 ) {
				slots.sort((a, b) => a.id - b.id).map(obj => {
					facilityReservations = facilityReservations.concat(obj.facilityReservations);
				});
			}
		}

		return (
			<div className={classes.nowDay} style={{ cursor: "pointer" }} onClick={() => handleSelectDay(date, facilityMgmt)}>
				<MC.Grid container justify={"flex-start"} alignItems={"flex-start"}>
					<MC.Typography variant={"subtitle1"} className={selectDay && thisMonth ? classes.circle : ""}
					               style={{ color: between ? "" : "#bcbcbc" }}>
						{
							thisMonth && nowDate.format("D")
						}
					</MC.Typography>
					{
						between && facilityReservations.length >= (facilityMgmt.reservationTotalCount * slots.length) &&
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
			aria-labelledby="form-facilityMgmt-dialog-title">

			<MC.DialogTitle id="form-facilityMgmt-dialog-title">
				시설예약
			</MC.DialogTitle>

			<MC.DialogContent dividers={scroll === "paper"}>

				<MC.Grid container justify={"space-between"} alignItems={"center"} style={{ marginBottom: 37 }}>
					<MC.Grid item>
						<MC.Button
							size={"small"}
							disabled={convertToYearMonth(facilityMgmt.reservationFromDate) === convertToYearMonth(nowMonth)}
							onClick={() => setNowMonth(incrementFn.increment(nowMonth, -1, facilityMgmt))}
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
							disabled={convertToYearMonth(facilityMgmt.reservationToDate) === convertToYearMonth(nowMonth)}
							onClick={() => setNowMonth(incrementFn.increment(nowMonth, 1, facilityMgmt))}
							endIcon={<ArrowRightAltIcon />}>
							다음 달
						</MC.Button>
					</MC.Grid>
				</MC.Grid>

				{
					facilityMgmt.reservationType === ReservationTypeKind.DAY &&
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
								style={{ fontSize: 14 }} /> : 예약가능일자
							</MC.Typography>
						</MC.Grid>
					</>
				}

				<FacilityReservationTable
					facilityReservation={facilityReservation}
					setLastSelectDate={setLastSelectDate}
					handleAlertToggle={handleAlertToggle}
					setAlertOpens={setAlertOpens}
					facilityReservationMgmt={facilityMgmt}
					facilityReservationSlots={facilityReservationSlots}
					onClose={handleClose}
				/>

			</MC.DialogContent>

			<MC.DialogActions>
				<MC.Button onClick={handleClose}>
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

export default FacilityReservationEditDialog;
