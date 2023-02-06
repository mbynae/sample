import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { visitingCarRepository } from "../../../repositories";
import { AlertDialogUserView } from "../../../components";
import { VisitingCarEditForm, VisitingCarReservationBar } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.white,
		position: "relative"
	},
	background: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: 245,
		backgroundColor: "#fafafa",
		zIndex: 1
	},
	content: {
		zIndex: 2,
		position: "relative",
		height: "100%",
		marginLeft: "auto",
		marginRight: "auto",
		maxWidth: "1180px",
		display: "flex",
		flexDirection: "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	layout: {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width: "100%",
		paddingTop: 73,
		paddingBottom: 80,
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
			padding: 0,
			paddingTop: 0,
			paddingBottom: 80
		}
	}
}));

const VisitingCarEdit = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	const isTablet = MC.useMediaQuery(theme.breakpoints.down("md"));

	const { UserSignInStore, UserAptComplexStore, VisitingCarStore, history, match } = props;
	const { menuKey, id } = match.params;
	const [rootUrl, setRootUrl] = useState("");

	const generateRootUrl = async () => {
		let rootUrl = `/${UserSignInStore.aptId}${UserSignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		noTitle: "",
		yesTitle: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
		isOpenType: false,
		type: ""
	});
	const handleAlertToggle = (key, title, content, yesTitle, yesCallback, noTitle, noCallback, type) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					noTitle,
					yesTitle,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn: () => noCallback(),
					type
				};
			}
		);
	};

	// 방문차량예약 관리 정보
	const [visitingCar, setVisitingCar] = useState({});
	const [errors, setErrors] = useState({
		isCarNumber: false
	});

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			await generateRootUrl();
			if (id) {
				setIsEdit(true);
				await getVisitingCar(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};

		setTimeout(async () => {
			await init();
		}, 100);
	}, [id]);

	const dataBinding = (obj) => {
		setVisitingCar(prev => {
			return {
				...prev,
				aptId: UserAptComplexStore.aptComplex.id,

				building: obj ? obj.building : "",
				unit: obj ? obj.unit : "",
				etcPurposeVisit: obj ? obj.etcPurposeVisit : "",
				purposeVisitType: obj ? obj.purposeVisitType : "VT",
				visitFromDate: obj ? obj.visitFromDate : dateInit(true),
				visitToDate: obj ? obj.visitToDate : dateInit(false),
				carNumber: obj ? obj.carNumber : "",

				baseDateDataType: obj ? obj.baseDateDataType : {
					createDate: new Date(),
					lastModifiedDate: new Date()
				},
				aptComplex: obj ? obj.aptComplex : {}
			};
		});
	};

	const getVisitingCar = async (id) => {
		visitingCarRepository
			.getVisitingCar(id, {
				aptId: UserAptComplexStore.aptComplex.id
			}, true)
			.then(result => {
				dataBinding(result);
				setLoading(false);
			});
	};

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 9 : 18).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if (!isFrom) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}

		return date;
	};

	const updateVisitingCar = () => {
		visitingCarRepository
			.updateVisitingCar(
				id,
				{
					...visitingCar
				}, true)
			.then(() => {
				handleAlertToggle(
					"isOpen",
					undefined,
					"방문차량예약 수정이 완료 되었습니다.",
					undefined,
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
						history.push(`${rootUrl}/visitingCar/${id}`);
					}
				);
			});
	};

	const saveVisitingCar = () => {

		let saveParam = {};

		saveParam.car_numb = visitingCar.carNumber;
		saveParam.park_strt_dttm = moment(visitingCar.visitFromDate).format("YYYY-MM-DD HH:mm:ss");
		saveParam.park_end_dttm = moment(visitingCar.visitToDate).format("YYYY-MM-DD HH:mm:ss");
		saveParam.vist_code = visitingCar.purposeVisitType;
		saveParam.vist_purp = visitingCar.etcPurposeVisit;

		visitingCarRepository.addParkingReservation({
			...saveParam
		}, true).then(result => {
			handleAlertToggle(
				"isOpen",
				undefined,
				"방문차량예약 등록이 완료 되었습니다.",
				undefined,
				() => {
					setAlertOpens(prev => {
						return { ...prev, isOpen: false };
					});
					//history.push(`${rootUrl}/visitingCar/${result.id}`);
					history.push(`${rootUrl}/visitingCar/`);
				}
			);
		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n",
				"확인",
				() => {
					setAlertOpens(prev => {
						return { ...prev, isOpen: false };
					});
				},
				undefined
			);
		});
		//----------------NOT USE------------------//
		// visitingCarRepository.saveVisitingCar({
		// 	...visitingCar
		// }, true).then(result => {
		// 	handleAlertToggle(
		// 		"isOpen",
		// 		undefined,
		// 		"방문차량예약 등록이 완료 되었습니다.",
		// 		undefined,
		// 		() => {
		// 			setAlertOpens(prev => { return { ...prev, isOpen: false }; });
		// 			history.push(`${rootUrl}/visitingCar/${result.id}`);
		// 		}
		// 	);
		// });
	};

	const handleEdit = () => {

		if (!(visitingCar.carNumber === "")) {
			if (isEdit) {
				// 수정
				updateVisitingCar();
			} else {
				// 등록
				saveVisitingCar();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isCarNumber: visitingCar.carNumber === ""
				};
			});
		}
	};

	const handleGoBack = () => {
		history.goBack();
	};
	const handleGoReservationListPage = () => {
		history.push(`${rootUrl}/visitingCar`);
	};

	return (
		<div className={classes.root}>

			{
				!isMobile &&
				<div className={classes.background}/>
			}

			{
				!loading &&
				<>
					<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
									 className={classes.content}>
						<div className={classes.layout}>
							<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>

								{
									!isMobile &&
									<MC.Grid item style={{ width: "100%" }}>
										<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
											<MC.Grid item>
												<MC.Typography variant="h3">
													방문차량예약
												</MC.Typography>
											</MC.Grid>
										</MC.Grid>
										<VisitingCarReservationBar
											isMobile={isMobile}
											handleAlertToggle={handleAlertToggle}
											alertOpens={alertOpens}
											setAlertOpens={setAlertOpens}
										/>
									</MC.Grid>
								}

								{
									isMobile &&
									<VisitingCarReservationBar
										isMobile={isMobile}
										handleAlertToggle={handleAlertToggle}
										alertOpens={alertOpens}
										setAlertOpens={setAlertOpens}
									/>
								}
								<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 50 : 111 }}>

									<MC.Grid
										container
										justify={"space-between"}
										alignItems={"flex-start"}>

										<MC.Grid item xs={12} md={12} style={{ padding: isMobile ? "0px 20px" : 0 }}>
											<VisitingCarEditForm
												isEdit={isEdit}
												isMobile={isMobile}
												isTablet={isTablet}
												menuKey={menuKey}
												aptId={UserAptComplexStore.aptComplex.id}
												rootUrl={rootUrl}
												visitingCar={visitingCar}
												setVisitingCar={setVisitingCar}
												errors={errors}
												setErrors={setErrors}
											/>
										</MC.Grid>

										<MC.Grid item xs={5} md={3}
														 style={{ width: "100%", marginTop: 40, paddingLeft: isMobile ? 20 : 0 }}>
											<MC.Grid container justify={"flex-start"} alignItems={"center"}>
												<MC.Button
													size="large"
													disableElevation
													style={{
														padding: 0,
														borderRadius: 0,
														width: isMobile ? "100%" : 140,
														height: 40,
														border: "1px solid rgb(51, 51, 51, 0.2)"
													}}
													onClick={handleGoReservationListPage}
												>
													예약목록
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
										<MC.Grid item xs={7} md={9}
														 style={{ width: "100%", marginTop: 40, paddingRight: isMobile ? 20 : 0 }}>
											<MC.Grid container justify={"flex-end"} alignItems={"center"}>
												<MC.Button
													size="large"
													disableElevation
													style={{
														padding: 0,
														borderRadius: 0,
														width: isMobile ? "44%" : 140,
														height: 40,
														border: "1px solid rgb(51, 51, 51, 0.2)"
													}}
													onClick={handleGoBack}>
													취소
												</MC.Button>
												<MC.Button
													variant="contained"
													size="large"
													color="primary"
													disableElevation
													style={{
														padding: 0,
														borderRadius: 0,
														width: isMobile ? "44%" : 140,
														height: 40,
														border: "1px solid rgb(51, 51, 51, 0.2)",
														marginLeft: 10
													}}
													onClick={handleEdit}>
													등록
												</MC.Button>
											</MC.Grid>
										</MC.Grid>

									</MC.Grid>

								</MC.Grid>

							</MC.Grid>
						</div>
					</MC.Grid>
				</>
			}

			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
				noTitle={alertOpens.noTitle}
				yesTitle={alertOpens.yesTitle}
			/>

		</div>
	);
};
export default inject("UserSignInStore", "UserAptComplexStore", "VisitingCarStore")(observer(VisitingCarEdit));
