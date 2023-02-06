import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";

import * as MC                           from "@material-ui/core";
import * as MS                           from "@material-ui/styles";
import { DateFormat }                    from "../../../../../components";
import { residentReservationRepository } from "../../../../../repositories";
import moment                            from "moment";

const useStyles = MS.makeStyles((theme) => ({
	root:  {
		width: "100%"
	},
	paper: {
		width:                          "100%",
		margin:                         0,
		[theme.breakpoints.down("xs")]: {}
	},
	title: {
		width:                          149,
		padding:                        0,
		backgroundColor:                "#449CE8",
		borderRadius:                   0,
		[theme.breakpoints.down("xs")]: {
			width: 89
		}
	}
}));

const MyResidentReservationBar = props => {
	const classes = useStyles();

	const { ResidentReservationStore, getResidentReservations, residentReservations, handleAlertToggle, setAlertOpens, isMobile } = props;

	useEffect(() => {
		const init = () => {
			getResidentReservations(1, 10);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const handleCancelReservation = (obj) => {
		let date = moment(obj.residentFromDate).format("YYYY-MM-DD");
		let fromTime = moment(obj.residentFromDate).format("HH:mm");
		let toTime = moment(obj.residentToDate).format("HH:mm");

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			`${date}\n ${fromTime} ~ ${toTime}\n 입주예약을 취소 하시겠습니까?`,
			"확인",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				residentReservationRepository
					.removeResidentReservation(obj.id, true)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							undefined,
							`${date}\n ${fromTime} ~ ${toTime}\n 입주예약 취소 되었습니다.`,
							undefined,
							() => {
								getResidentReservations(1, 10);
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
							}
						);
					});
			},
			"취소",
			() => {
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);
	};

	return (
		<div className={classes.root}>
			<MC.Paper component="div" elevation={2} className={classes.paper}>
				<MC.Grid container direction={"row"} justify={"center"} alignItems={"stretch"} style={{ width: "100%" }}>

					<MC.Grid item className={classes.title}>
						<MC.Grid container direction={isMobile ? "column" : "row"} justify={"center"} alignItems={"center"} style={{ width: "100%", height: "100%" }}>
							{
								isMobile ?
									(
										<>
											<MC.Typography variant={"subtitle1"} style={{ color: "#fff" }}>
												나의
											</MC.Typography>
											<MC.Typography variant={"subtitle1"} style={{ color: "#fff" }}>
												입주예약
											</MC.Typography>
										</>
									)
									:
									(
										<MC.Typography variant={"subtitle1"} style={{ color: "#fff" }}>
											나의 입주예약
										</MC.Typography>
									)
							}
						</MC.Grid>
					</MC.Grid>

					<MC.Grid item style={{ flex: 1 }}>
						<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}
						         style={{ height: "100%" }}>

							{
								residentReservations && residentReservations.length > 0 ?
									(
										<MC.Grid item xs={12} md={12} style={{ paddingLeft: isMobile ? 16 : 30, paddingRight: 20, paddingTop: 4, paddingBottom: 4 }}>

											{
												residentReservations.map((obj, index) => (
													<MC.Grid key={index} container direction={isMobile ? "column" : "row"} justify={"space-between"} alignItems={isMobile ? "flex-start" : "center"}
													         style={{ marginTop: 3, marginBottom: 3 }}>
														<MC.Grid item>
															<MC.Typography variant={"subtitle1"} style={{ fontWeight: "normal", display: "inline-block" }}>
																{obj.aptComplexName} {obj.building}동 {obj.unit}호 {isMobile ? "" : `| `}
															</MC.Typography>
															<MC.Typography variant={"subtitle1"} style={{ color: "#449CE8", fontWeight: "normal", display: isMobile ? "block" : "inline-block" }}>
																&nbsp;<DateFormat date={obj.residentFromDate} format={"YYYY.MM.DD HH:mm"} />
																&nbsp;~&nbsp;
																<DateFormat date={obj.residentToDate} format={"HH:mm"} />
															</MC.Typography>
														</MC.Grid>
														<MC.Grid item style={{ marginTop: isMobile ? 5 : 0 }}>
															<MC.Button
																size="large"
																disableElevation
																style={{ padding: 0, borderRadius: 0, width: 96, height: 34, border: "1px solid #dedede" }}
																onClick={() => handleCancelReservation(obj)}>
																예약취소
															</MC.Button>
														</MC.Grid>
													</MC.Grid>
												))
											}

										</MC.Grid>
									)
									:
									(
										<MC.Grid item>
											<MC.Grid container justify={"center"} alignItems={"center"} style={{ height: isMobile ? 83 : 48, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
												<MC.Typography variant={"subtitle1"} style={{ color: "#bcbcbc", fontWeight: "normal" }}>
													아래 입주날짜 및 시간을 선택하여 예약을 해주세요.
												</MC.Typography>
											</MC.Grid>
										</MC.Grid>
									)
							}

						</MC.Grid>
					</MC.Grid>

				</MC.Grid>
			</MC.Paper>
		</div>
	);

};

export default inject("ResidentReservationStore")(withRouter(observer(MyResidentReservationBar)));
