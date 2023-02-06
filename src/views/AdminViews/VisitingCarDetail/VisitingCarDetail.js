import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";


import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import { visitingCarMgntRepository }                from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { VisitingCarDetailForm }                from "./components";

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
		marginLeft:             0,
		borderTopLeftRadius:    4,
		borderBottomLeftRadius: 4
	}
}));

const VisitingCarDetail = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("visitingCar");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `방문차량예약 관리`,
			href:  `${rootUrl}/visitingCar`
		},
		{
			title: `방문차량예약 관리 상세`,
			href:  `${rootUrl}/visitingCar${id ? "/" + id : ""}`
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

	// 방문차량예약 관리 정보
	const [visitingCar, setVisitingCar] = useState({});

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
						title: `방문차량예약 관리`,
						href:  `${rootUrl}/visitingCar`
					},
					{
						title: `방문차량예약 관리 상세`,
						href:  `${rootUrl}/visitingCar${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getVisitingCar(id);
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

	const getVisitingCar = async (id) => {
		visitingCarMgntRepository
			.detailParkingReservation({
				park_use_numb: id
			})
			.then(result => {
				dataBinding(result.data_json);
				setLoading(false);
			});
	};

	const dataBinding = (obj) => {
		setVisitingCar(prev => {
			return {
				...prev,
				dong_numb:         obj ? obj.dong_numb : "", // 동
				ho_numb:             obj ? obj.ho_numb : "", // 호
				vist_code_info:  obj ? obj.vist_code_info : "", // 방문 목적
				vist_code: obj ? obj.vist_code : "", // 방문 목적 코드
				vist_purp: obj ? obj.vist_purp : "", // 방문 목적 기타 사유
 				park_strt_dttm:    obj ? obj.park_strt_dttm : dateInit(true), // 방문 시작일
				park_end_dttm:      obj ? obj.park_end_dttm : dateInit(false), //방문 종료일
				car_numb:        obj ? obj.car_numb : "", // 차 번호
				car_name:        obj ? obj.car_name : "", // 차 이름
				park_use_clss_info:  obj ? obj.park_use_clss_info : "", // 주차이용구분
				park_use_clss: obj ? obj.park_use_clss : "", // 주차이용구분 코드
				park_use_stat_info:  obj ? obj.park_use_stat_info : "", // 주차이용상태
				park_use_stat: obj ? obj.park_use_stat : "", // 주차이용상태 코드
				park_cycl_code_info:  obj ? obj.park_cycl_code_info : "", // 주차이용단위
				park_cycl_code: obj ? obj.park_cycl_code : "", // 주차이용단위 코드
				use_at:							 obj ? obj.use_at: "" // 삭제 여부

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

	const handleDelete = (clicked) => {

		let deleteParam = {item: []}

		handleAlertToggle(
			"isConfirmOpen",
			clicked === "restore" ? "방문차량예약 복원" : "방문차량예약 삭제",
			clicked === "restore" ? "삭제되었던 방문차량예약 정보가 복구됩니다. \n 정말로 정보를 복구하시겠습니까?"
				:
				"선택하신 방문차량예약 정보가 삭제됩니다. \n 정말로 정보를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });

				// 복구 버튼 선택 시 복구, 삭제 버튼 클릭 시 삭제
				deleteParam.item.push({park_use_numb : id, use_at : clicked === "restore" ? "Y" : "N"})

				const param = JSON.stringify(deleteParam)

				visitingCarMgntRepository
					.deleteParkingReservation(param)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							clicked === "restore" ? "복구완료" : "삭제완료",
							clicked === "restore" ? "선택하신 방문차량예약 정보를 복구 하였습니다." : "선택하신 방문차량예약 정보를 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/visitingCar`);
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
		history.push(`${rootUrl}/visitingCar/edit/${id}`);
	};

	const handleGoBack = () => {
		history.push(`${rootUrl}/visitingCar`);
	};

	return (
		<div className={classes.root}>

			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs}/>
			<div className={classes.content}>

				<MC.Typography variant="h2" gutterBottom>
					방문차량예약 상세
				</MC.Typography>
				<MC.Divider className={classes.divider}/>

				{
					!loading && (
						<MC.Paper elevation={2} className={classes.paper}>

							<MC.Grid
								container
								spacing={2}
								justify={"space-between"}
								alignItems={"flex-start"}>

								<MC.Grid item xs={12} md={12}>
									<VisitingCarDetailForm
										visitingCar={visitingCar}
										setVisitingCar={setVisitingCar}/>
								</MC.Grid>

								<MC.Grid item xs={6} md={6}>
									<MC.ButtonGroup
										aria-label="text primary button group"
										size="large"
										style={{ marginTop: 12 }}
										color="primary">
										<MC.Button
											className={classes.errorButton}
											disabled={visitingCar.use_at === "N"}
											onClick={(e) => handleDelete("delete")}>
											삭제
										</MC.Button>
										<MC.Button
											variant="outlined"
											color="primary"
											disabled={visitingCar.use_at === "Y"}
											onClick={(e) => handleDelete("restore")}>
											복원
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
					)
				}
				{
					loading && (
						<MC.Grid container justify={"center"}>
							<MC.CircularProgress color={"secondary"}/>
						</MC.Grid>
					)
				}
			</div>

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
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(VisitingCarDetail));
