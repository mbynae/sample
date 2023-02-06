import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

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

const VisitingCarDetailForm = props => {
	const classes = useStyles();

	const { visitingCar: obj } = props;

	// Form 내부 각 아이템 Render 함수
	const renderFormItem = (label, content) => {
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
						{!content.includes("null") && content}
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
		)
	}

	return (
		<MC.Card>
			<MC.CardHeader
				title={"방문차량예약 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<MC.Grid container spacing={1}>

					{/*동/호*/}
					{renderFormItem("동/호", `${obj.dong_numb} 동 ${obj.ho_numb} 호`)}

					{/*차량번호*/}
					{renderFormItem("차량번호", `${obj.car_numb}`)}

					{/*차량이름*/}
					{renderFormItem("차량이름", `${obj.car_name}`)}

					{/*방문목적*/}
					{renderFormItem("방문목적", `${obj.vist_code_info}`)}

					{/*주차이용단위*/}
					{renderFormItem("주차이용단위", `${obj.park_cycl_code_info}`)}

					{/*방문목적기타사유*/}
					{renderFormItem("방문목적 비고", `${obj.vist_purp}`)}

					{/*주차이용구분*/}
					{renderFormItem("주차이용구분", `${obj.park_use_clss_info}`)}

					{/*방문일 (시작)*/}
					{renderFormItem("방문일 (시작)", `${obj.park_strt_dttm && obj.park_strt_dttm.substr(0, 13)}시`)}

					{/*주차이용상태*/}
					{renderFormItem("주차이용상태", `${obj.park_use_stat_info}`)}

					{/*방문일 (종료)*/}
					{renderFormItem("방문일 (종료)", `${obj.park_end_dttm && obj.park_end_dttm.substr(0, 13)}시`)}

				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	);
};

export default VisitingCarDetailForm;
