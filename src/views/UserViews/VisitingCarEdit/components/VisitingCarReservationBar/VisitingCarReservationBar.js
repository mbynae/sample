import React, { useState, useEffect } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { visitingCarRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		width: "100%",
		paddingTop: 90,
		[theme.breakpoints.down("xs")]: {
			padding: 0
		}
	},
	paper: {
		width: "100%",
		margin: 0,
		height: "auto"
	},
	title: {
		width: 149,
		padding: 0,
		backgroundColor: "#449CE8",
		borderRadius: 0,
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

const VisitingCarReservationBar = props => {
	const classes = useStyles();

	const { isMobile, handleAlertToggle, alertOpens, setAlertOpens } = props;
	const [myParkingList, setMyParkingList] = useState([]);

	useEffect(() => {
		const init = async () => {
			await getMyParkingReservation();
		};
		setTimeout(async () => {
			await init();
		});
	}, []);

	const getMyParkingReservation = async () => {
		const myParkingList = await visitingCarRepository.getMyParkingReservation(true);
		setMyParkingList(myParkingList.data_json_array);
	};

	const handleDeleteReservation = async (park_use_numb) => {

		let deleteParam = {item : []}

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"선택하신 방문차량예약 데이터가 삭제됩니다. \n 정말로 데이터를 삭제하겠습니까?",
			"확인",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				deleteParam.item.push({park_use_numb : park_use_numb})

				const param = JSON.stringify(deleteParam)

				await visitingCarRepository.deleteParkingReservation(param, true)

				handleAlertToggle(
					"isOpen",
					undefined,
					"선택된 방문차량예약 정보를 삭제 하였습니다.",
					undefined,
					() => {
						setAlertOpens(prev => { return { ...prev, isOpen: false }; });
					}
				);
				await getMyParkingReservation();
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);

	}

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
						{ myParkingList.length > 0 && myParkingList.map((item, index) =>
							<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} key={item.park_use_numb} style={{borderBottom: "1px solid #ebebeb"}}>

								<MC.Grid item xs={12} md={10}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{
										paddingLeft: isMobile ? 16 : 30,
										paddingRight: isMobile ? 16 : 30,
										height: isMobile ? 70 : 50
									}}>
										<MC.Typography variant={"h6"} style={{ color: "#449CE8", fontWeight: "normal" }}>
											{item.park_strt_dttm.substring(0, 13) + "시"}~{item.park_end_dttm.substring(0, 13) + "시"}
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={12} md={2}>
									<MC.Button
										size="large"
										className={classes.button}
										onClick={() => handleDeleteReservation(item.park_use_numb)}
									>
										예약취소
									</MC.Button>
								</MC.Grid>
							</MC.Grid>
						)}
						{ myParkingList.length == 0 &&
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} style={{borderBottom: "1px solid #ebebeb"}}>

							<MC.Grid item xs={12} md={12}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{
									paddingLeft: isMobile ? 16 : 30,
									paddingRight: isMobile ? 16 : 30,
									height: isMobile ? 70 : 50
								}}>
									<MC.Typography variant={"h6"} style={{ color: "#449CE8", fontWeight: "normal" }}>
										조회된 나의 방문차량예약 데이터가 한 건도 없네요.
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

export default VisitingCarReservationBar;
