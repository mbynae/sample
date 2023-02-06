import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { visitingCarRepository } from "../../../repositories";
import { AlertDialogUserView }                      from "../../../components";
import { VisitingCarDetailForm }                    from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background:        {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          162,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:           {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		maxWidth:                       "1180px",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	layout:            {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width:                          "100%",
		paddingTop:                     73,
		paddingBottom:                  80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			padding:       0,
			paddingTop:    0,
			paddingBottom: 80
		}
	},
	buttonLayoutRight: {
		// padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	}
}));

const VisitingCarDetail = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, VisitingCarStore, history, match } = props;
	const { id } = match.params;
	const [menuKey] = useState("visitingCar");
	const [rootUrl, setRootUrl] = useState("");

	const generateRootUrl = async () => {
		let rootUrl = `/${UserSignInStore.aptId}${UserSignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const [loading, setLoading] = useState(true);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		noTitle:       "",
		yesTitle:      "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle(),
		isOpenType:    false,
		type:          ""
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
					noFn:  () => noCallback(),
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
			if ( id ) {
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

				building:         obj ? obj.building : "",
				unit:             obj ? obj.unit : "",
				etcPurposeVisit:  obj ? obj.etcPurposeVisit : "",
				purposeVisitType: obj ? obj.purposeVisitType : "VT",
				visitFromDate:    obj ? obj.visitFromDate : dateInit(true),
				visitToDate:      obj ? obj.visitToDate : dateInit(false),
				carNumber:        obj ? obj.carNumber : "",

				baseDateDataType: obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				aptComplex:       obj ? obj.aptComplex : {}
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
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}

		return date;
	};

	const handleEdit = () => {
		history.push(`${rootUrl}/${menuKey}/edit/` + id);
	};

	const handleGoBack = () => {
		history.push(`${rootUrl}/${menuKey}`);
	};

	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"방문차량예약에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 방문차량예약을 삭제하겠습니까?",
			"삭제",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				visitingCarRepository
					.removeVisitingCar(id, true)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							undefined,
							"방문차량예약을 삭제 하였습니다.",
							undefined,
							() => {
								history.push(`${rootUrl}/${menuKey}`);
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
							}
						);
					});
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);
	};

	return (
		<div className={classes.root}>

			{
				!isMobile &&
				<div className={classes.background} />
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
									</MC.Grid>
								}

								<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 31 : 111, paddingLeft: 16, paddingRight: 16 }}>

									<MC.Grid
										container
										justify={"space-between"}
										alignItems={"flex-start"}>

										<MC.Grid item xs={12} md={12}>
											<VisitingCarDetailForm
												isMobile={isMobile}
												menuKey={menuKey}
												aptId={UserAptComplexStore.aptComplex.id}
												visitingCar={visitingCar}
												setVisitingCar={setVisitingCar}
												errors={errors}
											/>
										</MC.Grid>

										<MC.Grid item xs={6} md={6} style={{ width: "100%", marginTop: 40 }}>
											<MC.Button
												size="large"
												disableElevation
												style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
												onClick={handleGoBack}>
												목록
											</MC.Button>
										</MC.Grid>

										<MC.Grid item xs={6} md={6}
										         className={classes.buttonLayoutRight}
										         style={{ width: "100%", marginTop: 40 }}>
											<MC.Button
												size="large"
												disableElevation
												style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
												onClick={handleDelete}>
												삭제
											</MC.Button>
											<MC.Button
												size="large"
												disableElevation
												style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
												onClick={handleEdit}>
												수정
											</MC.Button>
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

export default inject("UserSignInStore", "UserAptComplexStore", "VisitingCarStore")(observer(VisitingCarDetail));
