import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import {
	preCheckRepository,
	preCheckDetailRepository,
} from "../../../repositories";
import { AlertDialogUserView } from "../../../components";
import { PreCheckDetailEditForm } from "./components";
import { toJS } from "mobx";
import { useParams } from "react-router";
import { apiObject } from "repositories/api";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.white,
		position: "relative",
	},
	background: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: 162,
		backgroundColor: "#fafafa",
		zIndex: 1,
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
			maxWidth: "100%",
		},
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
			paddingBottom: 80,
		},
	},
}));

const PreCheckDetailEdit = (props) => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const {
		PreCheckSignInStore,
		UserAptComplexStore,
		PreCheckDetailStore,
		history,
		match,
	} = props;
	const { menuKey, id } = match.params;
	const [rootUrl, setRootUrl] = useState("");

	const generateRootUrl = async () => {
		let rootUrl = `/${PreCheckSignInStore.aptId}/pre-inspection`;
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
		type: "",
	});
	const handleAlertToggle = (
		key,
		title,
		content,
		yesTitle,
		yesCallback,
		noTitle,
		noCallback,
		type
	) => {
		setAlertOpens((prev) => {
			return {
				...prev,
				title,
				content,
				noTitle,
				yesTitle,
				[key]: !alertOpens[key],
				yesFn: () => yesCallback(),
				noFn: () => noCallback(),
				type,
			};
		});
	};

	// 사전점검 관리 정보
	const [preCheck, setPreCheck] = useState({});
	const [preCheckDetail, setPreCheckDetail] = useState({});
	const [errors, setErrors] = useState({});

	const [editState, setEditState] = useState({
		preApplyFromDate: 0,
		preApplyToDate: 0,
		aptComplex: {},
		preCheckDate: null,
		preCheckTime: false,
		openTimeTable: [],
	});

	const dataBinding = (obj) => {
		let aptComplex = toJS(UserAptComplexStore.aptComplex);
		let currentUser = toJS(PreCheckSignInStore.currentUser);
		let nowDate = moment(new Date()).format("YYYYMMDD");
		let preCheckTitle = `${aptComplex.aptInformationDataType.aptName}_${currentUser.building}동_${currentUser.unit}호_${nowDate}`;
		setPreCheckDetail((prev) => {
			return {
				...prev,
				aptId: UserAptComplexStore.aptComplex.id,
				aptComplex: obj ? obj.aptComplex : {},

				preCheckTitle: obj ? obj.preCheckTitle : preCheckTitle,
				isCheck: obj ? obj.isCheck : "",
				preCheckDate: obj ? obj.preCheckDate : dateInit(false),
				preCheckDefects: obj ? obj.preCheckDefects : [],

				baseDateDataType: obj
					? obj.baseDateDataType
					: {
							createDate: new Date(),
							lastModifiedDate: new Date(),
					  },
			};
		});
	};

	const getPreCheck = async (id) => {
		preCheckRepository
			.getPreCheck({
				aptId: UserAptComplexStore.aptComplex.id,
			})
			.then((result) => {
				setPreCheck(result);
			});
	};

	const getPreCheckDetail = async (id) => {
		try {
			const responseGetPreCheckDetail =
				await preCheckDetailRepository.getPreCheckMain(id);
			dataBinding(result);
			setLoading(false);
		} catch (error) {
			console.log({ error });
		}
	};

	const getDate = (date, isFrom) =>
		moment(date)
			.hour(isFrom ? 0 : 23)
			.minute(isFrom ? 0 : 59)
			.second(isFrom ? 0 : 59)
			.milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if (!isFrom) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}

		return date;
	};

	const updatePreCheckDetail = () => {
		preCheckDetailRepository
			.updatePreCheckDetail(id, {
				...preCheckDetail,
			})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					undefined,
					"사전점검 수정이 완료 되었습니다.",
					undefined,
					() => {
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
						history.push(`${rootUrl}/preCheck/detail/${id}`);
					}
				);
			});
	};

	const savePreCheckDetail = () => {
		preCheckDetailRepository
			.savePreCheckDetail(
				// {
				// 	...preCheckDetail,
				// },
				{
					preCheckTitle: "테스트",
					preCheckTime: "13:00",
					aptId: "88",
					preCheckUserId: 180,
					preCheckDate: "1638258399753",
				},
				false,
				true
			)
			.then((result) => {
				handleAlertToggle(
					"isOpen",
					undefined,
					"사전점검 등록이 완료 되었습니다.",
					undefined,
					() => {
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
						history.push(`${rootUrl}/preCheck/detail/${result.id}`);
					}
				);
			});
	};

	const createPreCheck = async (params) => {
		try {
			await apiObject.createPreCheck(params);
			handleAlertToggle(
				"isOpen",
				undefined,
				"사전점검이 예약되었습니다.",
				undefined,
				() => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
					history.push(`${rootUrl}/preCheck`);
				}
			);
		} catch (error) {
			console.log({ error });
			handleAlertToggle(
				"isOpen",
				undefined,
				"사전점검이 예약되지 않았습니다.\n다시 시도해주세요",
				undefined,
				() => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				}
			);
		}
	};

	const handleEdit = () => {
		createPreCheck({
			aptId: editState.aptComplex.id,
			preCheckDate: moment(editState.preCheckDate).format("yyyy-MM-DD"),
			preCheckStTime: editState.preCheckTime,
		});
	};

	const handleGoBack = () => {
		history.goBack();
	};

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			await generateRootUrl();
			getPreCheck();
			if (id) {
				setIsEdit(true);
				await getPreCheckDetail(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};

		setTimeout(async () => {
			await init();
		}, 100);
	}, [id]);

	return (
		<div className={classes.root}>
			{!isMobile && <div className={classes.background} />}

			{!loading && (
				<>
					<MC.Grid
						container
						direction={"column"}
						justify={"center"}
						alignItems={"center"}
						className={classes.content}
					>
						<div className={classes.layout}>
							<MC.Grid
								container
								direction={"column"}
								justify={"center"}
								alignItems={"center"}
							>
								{!isMobile && (
									<MC.Grid item style={{ width: "100%" }}>
										<MC.Grid
											container
											direction={"column"}
											justify={"center"}
											alignItems={"center"}
										>
											<MC.Grid item>
												<MC.Typography variant="h3">사전점검</MC.Typography>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
								)}

								<MC.Grid
									item
									style={{
										width: "100%",
										marginTop: isMobile ? 31 : 111,
										paddingLeft: 16,
										paddingRight: 16,
									}}
								>
									<MC.Grid
										container
										justify={"space-between"}
										alignItems={"flex-start"}
									>
										<MC.Grid item xs={12} md={12}>
											<PreCheckDetailEditForm
												isEdit={isEdit}
												isMobile={isMobile}
												menuKey={menuKey}
												aptComplex={toJS(UserAptComplexStore.aptComplex)}
												currentUser={toJS(PreCheckSignInStore.currentUser)}
												aptId={UserAptComplexStore.aptComplex.id}
												rootUrl={rootUrl}
												preCheckDetail={preCheckDetail}
												setPreCheckDetail={setPreCheckDetail}
												errors={errors}
												preCheck={preCheck}
												editState={editState}
												setEditState={setEditState}
											/>
										</MC.Grid>

										<MC.Grid
											item
											xs={12}
											md={12}
											style={{ width: "100%", marginTop: 40 }}
										>
											<MC.Grid
												container
												justify={"center"}
												alignItems={"center"}
											>
												<MC.Button
													size="large"
													disableElevation
													style={{
														padding: 0,
														borderRadius: 0,
														width: 140,
														height: 40,
														border: "1px solid rgb(51, 51, 51, 0.2)",
													}}
													onClick={handleGoBack}
												>
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
														width: 140,
														height: 40,
														border: "1px solid rgb(51, 51, 51, 0.2)",
														marginLeft: 10,
													}}
													onClick={handleEdit}
												>
													저장
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
						</div>
					</MC.Grid>
				</>
			)}

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

export default inject(
	"PreCheckSignInStore",
	"UserAptComplexStore",
	"PreCheckDetailStore"
)(observer(PreCheckDetailEdit));
