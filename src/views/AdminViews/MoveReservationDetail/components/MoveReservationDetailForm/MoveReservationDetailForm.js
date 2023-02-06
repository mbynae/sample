import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { PhoneHyphen } from "../../../../../components";

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

const MoveReservationDetailForm = props => {
	const classes = useStyles();

	const { moveReservation: obj, setMoveReservation: setObj } = props;

	const renderDetailItem = (label, value) => {
		return (
			<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
			<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
				<MC.Grid item xs={2} md={2}>
					<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
						<MC.Typography variant={"subtitle2"}>
							{label}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
				<MC.Grid item xs={10} md={10}>
					{value}
				</MC.Grid>
			</MC.Grid>
		</MC.Grid>
		)
	}

	return (
		<MC.Card>
			<MC.CardHeader
				title={"이사 예약 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<MC.Grid container spacing={1}>

					{/*동/호*/}
					{renderDetailItem("동/호", `${obj.dong_numb} 동 ${obj.ho_numb} 호`)}

					{/*차량번호*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										차량번호
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.carlist.map((item, index) => {
									return (
										<MC.Chip
											key={index}
											label={item.car_numb}
											style={{marginRight: 5}}
										>
										</MC.Chip>
									)
								})}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					{/*예약자명*/}
					{renderDetailItem("예약자명", obj.mvio_name && obj.mvio_name)}

					{/*예약자 전화번호*/}
					{renderDetailItem("연락처", obj.mvio_tel && PhoneHyphen(obj.mvio_tel))}

					{/*전입전출여부*/}
					{renderDetailItem("전입/전출 여부", obj.mvio_code_name)}

					{/* 시작 날짜 */}
					{renderDetailItem("이사 날짜", `${obj.mvio_strt_date}, ${obj.mvio_strt_time.substring(0,2)}시`)}

					{/* 승인 여부 */}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										승인 여부
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{
									obj.rsvt_stat === "2030" ? <MC.Chip label={"예약완료"} /> :
										obj.rsvt_stat === "2020" ? <MC.Chip label={"예약중"} /> :
											obj.rsvt_stat === "2090" && <MC.Chip label={"예약취소"} />
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	);
};

export default MoveReservationDetailForm;
