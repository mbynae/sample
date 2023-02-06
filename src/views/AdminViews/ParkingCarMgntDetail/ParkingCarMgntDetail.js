import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { parkingMgntRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }            from "../../../components";
import { ParkingCarMgntDetailForm }                     from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	paper:             {
		padding: theme.spacing(2)
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	errorButton:       {
		color:                  theme.palette.error.main,
		borderColor:            theme.palette.error.main,
		marginLeft:             10,
		borderTopLeftRadius:    4,
		borderBottomLeftRadius: 4
	}
}));

const ParkingCarMgntDetail = props => {

	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("parkingCarMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `차량 정보`,
			href:  `${rootUrl}/parkingCarMgnt`
		},
		{
			title: `차량 정보 상세`,
			href:  `${rootUrl}/parkingCarMgnt${id ? "/" + id : ""}`
		}
	]);

	const [loading, setLoading] = useState(true);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};

	// 차량 정보 관리
	const [parkingCar, setParkingCar] = useState({});

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			let rootUrl = generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `차량정보 관리`,
						href:  `${rootUrl}/parkingCarMgnt`
					},
					{
						title: `차량정보 상세`,
						href:  `${rootUrl}/parkingCarMgnt${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getParkingCar(id);
			}
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getParkingCar = async (id) => {
		parkingMgntRepository
			.detailParkingReservation({
				park_car_numb: id
			})
			.then(result => {
				dataBinding(result.data_json);
				setLoading(false);
			});
	};

	const dataBinding = (obj) => {
		setParkingCar(prev => {
			return {
				...prev,
				park_car_numb:	     obj ? obj.park_car_numb : "", // 차량 고유 ID
				dong_numb:           obj ? obj.dong_numb : "", // 동
				ho_numb:             obj ? obj.ho_numb : "", // 호
				park_type_info: 		 obj ? obj.park_type_info : "", // 등록 차량 정보
				park_strt_dttm:    	 obj ? obj.park_strt_dttm : dateInit(true), // 등록 시작일
				park_end_dttm:       obj ? obj.park_end_dttm : dateInit(false), // 등록 종료일
				car_numb:            obj ? obj.car_numb : "", // 차량 번호
				car_type_info:       obj ? obj.car_type_info : "", // 차량 종류
				car_clss_info:       obj ? obj.car_clss_info : "", // 차량 크기
				car_name:            obj ? obj.car_name : "", // 차량 이름
				car_stat_info:			 obj ? obj.car_stat_info: "" // 차량 상태
			};
		});
	};

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 9 : 18).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}

		return date;
	};

	const handleDelete = () => {

		let deleteParam = {item: []}

		handleAlertToggle(
			"isConfirmOpen",
			"차량정보 삭제",
			"차량정보에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 차량정보를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				deleteParam.item.push({park_car_numb: parkingCar.park_car_numb})

				const param = JSON.stringify(deleteParam)

				parkingMgntRepository
					.deleteParkingReservation(param)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"차량정보를 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/preferencesMgnt`);
								setAlertOpens({ ...alertOpens, isOpen: false });
							}
						);
					});
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	const handleEdit = () => {
		history.push(`${rootUrl}/parkingCarMgnt/edit/${parkingCar.park_car_numb}`);
	};

	const handleGoBack = () => {
		history.push(`${rootUrl}/preferencesMgnt`);
	};

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs}/>
						<div className={classes.content}>
							<MC.Typography variant="h2" gutterBottom>
								차량정보 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />

							<MC.Paper elevation={2} className={classes.paper}>
								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>

									<MC.Grid item xs={12} md={12}>
										<ParkingCarMgntDetailForm
											parkingCar={parkingCar}
											setParkingCar={setParkingCar}
										/>
									</MC.Grid>

									<MC.Grid item xs={6} md={6}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											<MC.Button
												className={classes.errorButton}
												onClick={handleDelete}
											>
												삭제
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>
									<MC.Grid item xs={6} md={6}
													 className={classes.buttonLayoutRight}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleGoBack}>
												목록보기
											</MC.Button>
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleEdit}>
												수정
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>
								</MC.Grid>
							</MC.Paper>

						</div>
					</>
				)
			}

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>
			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>

		</div>
	)
}

export default inject("SignInStore", "AptComplexStore")(observer(ParkingCarMgntDetail));
