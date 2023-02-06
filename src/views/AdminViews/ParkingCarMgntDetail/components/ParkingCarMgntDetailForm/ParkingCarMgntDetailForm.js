import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat } from "../../../../../components";

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

const ParkingCarMgntDetailForm = props => {

	const classes = useStyles();

	const { parkingCar: obj } = props;

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
				title={"차량 상세정보"}
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

					{/*차량크기*/}
					{renderFormItem("차량크기", `${obj.car_clss_info}`)}

					{/*차량종류*/}
					{renderFormItem("차량종류", `${obj.car_type_info}`)}

					{/*차량상태*/}
					{renderFormItem("차량상태", `${obj.car_stat_info}`)}

					{/*차량등록정보*/}
					{renderFormItem("등록정보", `${obj.park_type_info}`)}

				</MC.Grid>
			</MC.CardContent>

		</MC.Card>
	)
}

export default ParkingCarMgntDetailForm;
