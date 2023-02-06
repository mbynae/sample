import React, { useEffect, useState } from "react";
import * as MS                        from "@material-ui/styles";
import clsx                           from "clsx";
import * as MC                        from "@material-ui/core";
import { VisitingCarDetailForm }      from "../../../VisitingCarDetail/components";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
	cardRoot: {
		borderRadius: 0
	},
	cardContent: {
		//padding: 0
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between"
	},
	paper:             {
		padding: theme.spacing(2)
	},
	cardHeader:        {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	rowHeight:         {
		height: 54
	}
}));

const ParkingControlInfo = props => {

	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(true);

	useEffect( () => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getParkingControlInfo();
			await setIsLoading(false)
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getParkingControlInfo = (page, size) => {

	}

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<MC.Card className={clsx(classes.cardRoot)}>

					<MC.CardHeader
						title={"주차관제 설정"}
						titleTypographyProps={{ variant: "h4" }}
					/>
					<MC.Divider/>

					<MC.CardContent className={classes.cardContent}>
						{
							!isLoading && (
								<MC.Card>
									<MC.CardHeader
										title={"주차 차량번호 인식 시스템"}
										classes={{
											root:  classes.cardHeader,
											title: classes.cardHeader
										}}
									/>
									<MC.Divider />
									<MC.CardContent className={classes.innerCardContent}>
										<MC.Grid container spacing={1}>
											{/* 주차관리 서버 IP*/}
											<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
												<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
													<MC.Grid item xs={2} md={2}>
														<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
															<MC.Typography variant={"subtitle2"}>
																주차관리 서버 IP
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
													<MC.Grid item xs={10} md={10}>

													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
											{/* 차량번호 인식 Key */}
											<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
												<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
													<MC.Grid item xs={2} md={2}>
														<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
															<MC.Typography variant={"subtitle2"}>
																차량번호 인식 Key
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
													<MC.Grid item xs={10} md={10}>

													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
											{/* 차단기 인식 Key */}
											<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
												<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
													<MC.Grid item xs={2} md={2}>
														<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
															<MC.Typography variant={"subtitle2"}>
																차단기 인식 Key
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
													<MC.Grid item xs={10} md={10}>

													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
											{/* 루프코일 인식 Key */}
											<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
												<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
													<MC.Grid item xs={2} md={2}>
														<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
															<MC.Typography variant={"subtitle2"}>
																루프코일 인식 Key
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
													<MC.Grid item xs={10} md={10}>

													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
											{/* 전광판 Key */}
											<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
												<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
													<MC.Grid item xs={2} md={2}>
														<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
															<MC.Typography variant={"subtitle2"}>
																전광판 Key
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
													<MC.Grid item xs={10} md={10}>

													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
											{/* 감시카메라/ ?? 인식카메라 */}
											<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
												<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
													<MC.Grid item xs={2} md={2}>
														<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
															<MC.Typography variant={"subtitle2"}>
																감시카메라/ ?? 인식카메라
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
													<MC.Grid item xs={10} md={10}>

													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
									</MC.CardContent>
								</MC.Card>
							)
						}
						{
							isLoading && (
								<MC.Grid container justify={"center"}>
									<MC.CircularProgress color={"secondary"}/>
								</MC.Grid>
							)
						}
					</MC.CardContent>

					<MC.Divider/>

					<MC.CardActions className={classes.actions}>
						<MC.Grid container justify={"flex-end"} alignItems={"center"}>
							{/* 버튼 Action */}

						</MC.Grid>
					</MC.CardActions>
				</MC.Card>
			</div>
		</div>
	);
}

export default ParkingControlInfo;
