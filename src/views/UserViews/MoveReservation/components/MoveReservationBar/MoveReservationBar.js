import React, { useEffect, useState } from "react";

import * as MC                           from "@material-ui/core";
import * as MS                           from "@material-ui/styles";
import { DateFormat }                    from "../../../../../components";
import { moveReservationRepository } from "../../../../../repositories";
import moment                            from "moment";

const useStyles = MS.makeStyles((theme) => ({
	root:  {
		width: "100%",
		paddingTop: 90,
		[theme.breakpoints.down("xs")]: {
			padding: 0
		}
	},
	paper: {
		width:                          "100%",
		margin:                         0,
		height: 												"auto"
	},
	title: {
		width:                          149,
		padding:                        0,
		backgroundColor:                "#449CE8",
		borderRadius:                   0,
		[theme.breakpoints.down("xs")]: {
			width: 89
		}
	},
	button: {
		padding: 3,
		marginLeft: 50,
		borderRadius: 0,
		width: 100,
		height: 35,
		border: "1px solid rgb(51, 51, 51, 0.2)",
		[theme.breakpoints.down("xs")]: {
			padding: "0px 16px",
			marginLeft: 16,
			marginBottom: 10
		}
	}
}));

const MoveReservationBar = props => {
	const classes = useStyles();

	const { isMobile, handleAlertToggle, alertOpens, setAlertOpens, myMoveReservations, getMyMoveReservation } = props;

	useEffect(() => {
		const init = async () => {

		};
		setTimeout(async () => {
			await init();
		});
	}, []);

	const handleCancelReservation = (id) => {

		let param = {
			mvio_numb : id,
		}

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			`해당 예약 내역을 취소하시겠습니까?`,
			"확인",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });

				moveReservationRepository
					.cancelMoveReservation(param, true)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							undefined,
							`해당 예약 내역이 취소 되었습니다.`,
							undefined,
							() => {
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
								getMyMoveReservation();
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
				<MC.Grid container direction={"row"} justify={"center"} alignItems={"stretch"} style={{ width: "100%", height: "100%" }}>

					<MC.Grid item className={classes.title}>
						<MC.Grid container direction={isMobile ? "column" : "row"} justify={"center"} alignItems={"center"}
										 style={{ width: "100%", height: "100%" }}>
							{
								isMobile ?
									(
										<>
											<MC.Typography variant={"subtitle1"} style={{ color: "#fff" }}>
												나의
											</MC.Typography>
											<MC.Typography variant={"subtitle1"} style={{ color: "#fff" }}>
												예약내역
											</MC.Typography>
										</>
									)
									:
									(
										<MC.Typography variant={"subtitle1"} style={{ color: "#fff" }}>
											나의 예약내역
										</MC.Typography>
									)
							}
						</MC.Grid>
					</MC.Grid>

					<MC.Grid item style={{ flex: 1 }}>
						{ myMoveReservations.length > 0 && myMoveReservations.map((item, index) =>
							<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} key={item.mvio_numb} style={{borderBottom: "1px solid #ebebeb"}}>

								<MC.Grid item xs={12} md={10}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{
										paddingLeft: isMobile ? 16 : 15,
										paddingRight: isMobile ? 16 : 30,
										height: isMobile ? 70 : 50
									}}>
										<MC.Chip
											key={item.mvio_numb}
											label={item.rsvt_stat === "2020" ? "예약중" : item.rsvt_stat === "2030" ? "예약완료" : item.rsvt_stat === "2090" && "예약취소"}
											style={{ marginRight: 20, backgroundColor: "#449CE8", color: "white", minWidth: 72 }}
										>
										</MC.Chip>
										<MC.Typography variant={"h6"} style={{ color: "#449CE8", fontWeight: "normal" }}>
											{item.mvio_strt_date} &nbsp;
											{item.mvio_strt_time.substring(0, 2) + "시"} &nbsp;
											({item.mvio_code === "JI" ? "전입" : "전출"})
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={12} md={2}>
									<MC.Button
										size="large"
										className={classes.button}
										onClick={() => handleCancelReservation(item.mvio_numb, item.memb_numb)}
									>
										예약취소
									</MC.Button>
								</MC.Grid>
							</MC.Grid>
						)}
						{ myMoveReservations.length == 0 &&
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} style={{borderBottom: "1px solid #ebebeb"}}>

							<MC.Grid item xs={12} md={12}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{
									paddingLeft: isMobile ? 16 : 30,
									paddingRight: isMobile ? 16 : 30,
									height: isMobile ? 70 : 50
								}}>
									<MC.Typography variant={"h6"} style={{ color: "#449CE8", fontWeight: "normal" }}>
										조회된 나의 이사 예약 데이터가 한 건도 없네요.
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
						}
					</MC.Grid>
				</MC.Grid>
			</MC.Paper>
		</div>
	);

};

export default MoveReservationBar;
