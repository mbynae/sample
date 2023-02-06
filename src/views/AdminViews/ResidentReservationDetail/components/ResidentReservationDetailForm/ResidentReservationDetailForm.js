import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, PhoneHyphen } from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	cardHeader:        {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:       {},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	attachLayout:      {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	},
	rowHeight:         {
		height: 54
	}
}));

const ResidentReservationDetailForm = props => {
	const classes = useStyles();
	
	const { residentReservation: obj } = props;
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"입주예약 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<MC.Grid container spacing={1}>
					
					{/*동/호*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										동/호
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{`${obj.building} 동 ${obj.unit} 호`}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*이름*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										이름
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.name}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*휴대폰번호*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										휴대폰번호
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{PhoneHyphen(obj.phoneNumber)}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*입주예약일자*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										입주예약일자
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								<DateFormat date={obj.residentFromDate} format={"YYYY.MM.DD"} />
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*예약시간*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										예약시간
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								<DateFormat date={obj.residentFromDate} format={"HH:mm"} />
								&nbsp; ~ &nbsp;
								<DateFormat date={obj.residentToDate} format={"HH:mm"} />
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*등록일*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										등록일
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								<DateFormat date={obj.baseDateDataType.createDate} format={"YYYY.MM.DD"} />
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				
				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	);
};

export default ResidentReservationDetailForm;
