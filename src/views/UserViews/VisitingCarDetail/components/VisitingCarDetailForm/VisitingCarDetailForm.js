import React       from "react";
import moment      from "moment";
import clsx        from "clsx";
import MomentUtils from "@date-io/moment";

import * as MC                                             from "@material-ui/core";
import * as MS                                             from "@material-ui/styles";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import { DateFormat }            from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:                {
		borderTop: "2px solid #449CE8"
	},
	cellTitle:           {
		backgroundColor:                "#f9f9f9",
		width:                          150,
		height:                         50,
		paddingLeft:                    21,
		[theme.breakpoints.down("xs")]: {
			width: 120
		}
	},
	cellContent:         {
		width:                          420,
		paddingLeft:                    20,
		paddingRight:                   20,
		[theme.breakpoints.down("xs")]: {
			width:        208,
			paddingLeft:  15,
			paddingRight: 15
		}
	},
	body4:               {
		...theme.typography.body4
	},
	datePickerContainer: {
		"& fieldset": {
			// borderRadius: 0
		}
	},
	datePicker:          {
		paddingTop:    10,
		paddingBottom: 10,
		margin:        0,
		height:        20
	},
	calendarButton:      {
		padding:    0,
		paddingTop: 2,
		"& svg":    {
			fontSize: 16
		}
	}
}));
const VisitingCarDetailForm = props => {
	const classes = useStyles();

	const { isMobile, visitingCar, setVisitingCar, errors } = props;

	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

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

	return (
		<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}
		         className={classes.root}>

			<MC.Grid item xs={12} md={6} style={{ height: 50, borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
							<MC.Typography className={classes.body4}>
								차량번호
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						{visitingCar.carNumber}
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid item xs={12} md={6} style={{ height: isMobile ? 80 : 50, borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle} style={{ height: isMobile ? 80 : 50 }}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={isMobile ? "flex-start" : "center"} style={{ height: "100%", paddingTop: isMobile ? 15 : 0 }}>
							<MC.Typography className={classes.body4}>
								방문목적
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent} style={{ height: isMobile ? 80 : 50 }}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={isMobile ? "flex-start" : "center"} style={{ height: "100%", paddingTop: isMobile ? 15 : 0 }}>
							{
								visitingCar.purposeVisitType === "HOUSEHOLD_VISIT" ? "세대방문" :
									visitingCar.purposeVisitType === "ETC" && "기타"
							}
							{visitingCar.purposeVisitType === "ETC" && `(${visitingCar.etcPurposeVisit})`}
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid item xs={12} md={12} style={{ height: isMobile ? 80 : 50, borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle} style={{ height: isMobile ? 80 : 50 }}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={isMobile ? "flex-start" : "center"} style={{ height: "100%", paddingTop: isMobile ? 15 : 0 }}>
							<MC.Typography className={classes.body4}>
								방문일시
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent} style={{ width: isMobile ? 208 : 578, paddingLeft: isMobile ? 15 : 20, paddingRight: isMobile ? 15 : 20, height: isMobile ? 80 : 50 }}>
						<MC.Grid container direction={isMobile ? "column" : "row"} justify={"flex-start"} alignItems={isMobile ? "flex-start" : "center"} style={{ height: "100%", paddingTop: isMobile ? 15 : 0 }}>
							<MC.Typography style={{ fontWeight: "normal", fontSize: 16 }}>
								<DateFormat date={visitingCar.visitFromDate} format={"YYYY-MM-DD HH시"} />
								&nbsp; ~ &nbsp;
							</MC.Typography>
							<MC.Typography style={{ fontWeight: "normal", fontSize: 16 }}>
								<DateFormat date={visitingCar.visitToDate} format={"YYYY-MM-DD HH시"} />
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

		</MC.Grid>
	);
};

export default VisitingCarDetailForm;
