import React   from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, PhoneHyphen } from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
		marginTop: theme.spacing(2)
	},
	cardHeader:               {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:              {},
	buttonLayoutRight:        {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	rowHeight:                {
		height: 54
	}
}));

const UserMgntDetailForm = props => {
	const classes = useStyles();
	
	const { userMgnt: obj } = props;
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"입주민 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				
				<MC.Grid container spacing={1}>
					
					{/*상태*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										상태
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{
									obj.userDataType.residentsType === "AWAITING_RESIDENTS" ? <MC.Chip label={"승인대기"} /> :
										obj.userDataType.residentsType === "RESIDENTS" && <MC.Chip label={"입주민"} />
								}
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
							<MC.Grid item xs={10} md={10}>
								<DateFormat date={obj.baseDateDataType.createDate} format={"YYYY-MM-DD"} />
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					
					{/*아이디*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										아이디
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.userId}
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
					
					{/*소유주 여부*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										소유주 여부
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{
									obj.userDataType.ownerType === "TO_BE_CONFIRMED" ? <MC.Chip label={"확인예정"} /> :
										obj.userDataType.ownerType === "NON_OWNER" ? <MC.Chip label={"비소유주"} /> :
											obj.userDataType.ownerType === "OWNER" && <MC.Chip label={"소유주"} />
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*세대주 여부*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										세대주 여부
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{
									obj.userDataType.houseHolderType === "HOUSEHOLD_OWNER" ? <MC.Chip label={"세대주"} /> :
										obj.userDataType.houseHolderType === "HOUSEHOLD_MEMBER" && <MC.Chip label={"세대원"} />
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*동/호수*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										동/호수
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.userDataType.building + " 동 "} {obj.userDataType.unit + " 호"}
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
					
					{/*소속/직책*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										소속/직책
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{
									obj.autonomousOrganization !== null ?
										`${obj.autonomousOrganization.name} | ${obj.aoPosition.name}`
										:
										"소속 & 직책 없음"
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
				</MC.Grid>
				
			</MC.CardContent>
		</MC.Card>
	);
};

export default UserMgntDetailForm;
