import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { withRouter, useLocation } from "react-router-dom";
import validate from "validate.js";
import { toJS } from "mobx";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import {
	MyArticles,
	MyInfo,
	MyManagementFee,
	MyPageTabs,
	ResidentCard,
	MyReservationCancelHistory,
	MyReservationHistory,
	NoteList,
} from "./components";
import { accountRepository, userMgntRepository } from "../../../repositories";
import { AlertDialogUserView } from "../../../components";
import SimpleDialog from "components/SimpleDialog";
import PayFeeInfo from "./components/PayFeeInfo";

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
		height: 245,
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
		paddingTop: 85,
		paddingBottom: 80,
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
			padding: 10,
			paddingTop: 0,
			paddingBottom: 80,
		},
	},
	body4: {
		...theme.typography.body4,
		marginTop: 6,
	},
}));

const MyPage = (props) => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	const location = useLocation();

	const { UserSignInStore, UserAptComplexStore, history, match } = props;

	const { id, reserveMenu } = match.params; // 시설 선택 메뉴 Index

	const [rootUrl, setRootUrl] = useState("");
	const generateRootUrl = async () => {
		let rootUrl = `/${UserSignInStore.aptId}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const [isLoading, setIsLoading] = useState(true);
	const [value, setValue] = useState(parseInt(id));
	const [isDuplicatedNickName, setIsDuplicatedNickName] = useState(false);
	const [isCheckNickName, setIsCheckNickName] = useState(false);
	const [homepageType, setHomepageType] = useState(
		toJS(
			UserAptComplexStore.aptComplex.contractInformationDataType.homepageType
		)
	);

	const handleChangeTabs = (event, newValue) => {
		setValue(newValue);

		history.push(rootUrl + "/myPage/" + newValue + "/0");
	};

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

	const [payInfoOpen, setPayInfoOpen] = useState(false);

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

	useEffect(() => {
		const init = () => {
			setIsLoading(false);
			setIsDuplicatedNickName(false);
			setIsCheckNickName(false);
			generateRootUrl();
			if (location.state) {
				setValue(location.state.value);
			}
			setFormState((prev) => {
				let cu = toJS(UserSignInStore.currentUser);
				return {
					...prev,
					values: {
						...prev.values,
						id: cu.id,
						userId: cu.userId,
						password: "",
						passwordCheck: "",
						name: cu.name,
						phoneNumber: cu.phoneNumber,
						accountTypeKind: cu.accountType,
						building: cu.userDataType.building,
						unit: cu.userDataType.unit,
						nickName: cu.userDataType.nickName,
						houseHolderType: cu.userDataType.houseHolderType,
						residentsType: cu.userDataType.residentsType,
					},
				};
			});
		};
		setTimeout(() => {
			init();
		});
	}, [UserSignInStore.currentUser]);

	const schema = {
		password: {
			presence: {
				allowEmpty: true,
			},
			length: {
				maximum: 18,
				message:
					"^비밀번호는 알파벳,특수문자,숫자 8자리 이상으로 입력해주세요.",
			},
			format: {
				allowEmpty: true,
				pattern:
					"^(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,18}",
				message: "^비밀번호 형식이 맞지 않습니다.",
			},
		},
		passwordCheck: {
			presence: {
				allowEmpty: true,
			},
			equality: {
				attribute: "password",
				message: "^비밀번호가 맞지 않습니다.",
			},
			length: {
				maximum: 18,
				message: "^비밀번호는 8~18자리 입니다.",
			},
			format: {
				allowEmpty: true,
				pattern:
					"^(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,18}",
				message: "^비밀번호 확인을 입력해주세요.",
			},
		},
		nickName: {
			presence: { allowEmpty: false, message: "^닉네임을 입력해주세요." },
			length: {
				maximum: 128,
			},
		},
	};
	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {
			userId: false,
			password: false,
			passwordCheck: false,
			name: false,
			phoneNumber: false,
			building: false,
			unit: false,
			nickName: false,
			houseHolderType: false,
		},
		errors: {},
	});
	const hasError = (field) =>
		!!(formState.touched[field] && formState.errors[field]);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			setValue(parseInt(id));
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [id]);

	useEffect(() => {
		const init = () => {
			const tempErrors = validate(formState.values, schema);

			setFormState((prevFormState) => ({
				...prevFormState,
				isValid: tempErrors ? false : true,
				errors: tempErrors || {},
			}));
		};
		setTimeout(() => {
			init();
		});
	}, [formState.values]);

	const handleChange = (event) => {
		event.persist();

		if (event.target.name === "nickName") {
			if (
				event.target.value ===
				toJS(UserSignInStore.currentUser).userDataType.nickName
			) {
				setIsDuplicatedNickName(false);
				setIsCheckNickName(true);
			} else {
				setIsDuplicatedNickName(false);
				setIsCheckNickName(false);
			}
		}

		setFormState((formState) => ({
			...formState,
			values: {
				...formState.values,
				[event.target.name]:
					event.target.type === "checkbox"
						? event.target.checked
						: event.target.value,
			},
			touched: {
				...formState.touched,
				[event.target.name]: true,
			},
		}));
	};

	const changeAllTouched = () => {
		Object.entries(formState.touched).map(async (obj) => {
			let [key] = obj;
			setFormState((prev) => {
				prev.touched[key] = true;
				return {
					...prev,
				};
			});
		});
	};

	const handleUpdateUser = async (event) => {
		event.preventDefault();
		changeAllTouched();

		const errors = validate(formState.values, schema);

		if (
			!(
				formState.values.password !== "" ||
				formState.values.passwordCheck !== ""
			)
		) {
			delete errors.password;
			delete errors.passwordCheck;
		}

		setFormState((formState) => ({
			...formState,
			isValid: !errors,
			errors: errors || {},
		}));

		if (
			!errors ||
			(Object.entries(errors).length === 0 &&
				isCheckNickName &&
				!isDuplicatedNickName.isDuplicated)
		) {
			try {
				if (formState.values.houseHolderType === "HOUSEHOLD_OWNER") {
					const result = await getUserMgntsByBuildingAndUnit(
						formState.values.building,
						formState.values.unit
					);
					if (result.id) {
						if (result.id !== formState.values.id) {
							handleAlertToggle(
								"isOpen",
								undefined,
								"해당 동/호수에 이미 세대주가 있습니다. \n다시 확인하시고 수정을 해주세요.",
								undefined,
								() => {
									setAlertOpens((prev) => {
										return { ...prev, isOpen: false };
									});
								},
								undefined
							);
							return;
						}
					}
				}
				const updateUser = await accountRepository.updateUser(
					formState.values.id,
					{
						aptId: UserAptComplexStore.aptComplex.id,
						userId: formState.values.userId.trim(),
						password: formState.values.password.trim(),
						name: formState.values.name.trim(),
						phoneNumber: formState.values.phoneNumber,
						accountTypeKind: formState.values.accountTypeKind,
						userDataType: {
							building: formState.values.building,
							unit: formState.values.unit,
							nickName: formState.values.nickName.trim(),
							houseHolderType: formState.values.houseHolderType,
							residentsType: formState.values.residentsType,
						},
					},
					true
				);
				if (updateUser.success) {
					handleAlertToggle(
						"isOpen",
						undefined,
						"회원정보 수정을 완료했습니다.",
						undefined,
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							UserSignInStore.updateUserInfo();
						}
					);
				}
			} catch (err) {
				console.error(err);
				handleAlertToggle(
					"isOpen",
					undefined,
					"입력하신 정보를 다시 확인해주세요.",
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			}
		} else {
			handleAlertToggle(
				"isOpen",
				undefined,
				"입력하신 정보를 다시 확인해주세요.",
				undefined,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		}
	};

	const getUserMgntsByBuildingAndUnit = async (building, unit) => {
		return userMgntRepository.getUserMgntsByBuildingAndUnit(
			{
				aptId: UserAptComplexStore.aptComplex.id,
				building: building,
				unit: unit,
			},
			true
		);
	};

	// 닉네임 중복검사
	const duplicatedNickName = () => {
		setIsDuplicatedNickName(false);
		setFormState((prev) => {
			prev.touched["nickName"] = true;
			return {
				...prev,
			};
		});

		if (!hasError("nickName")) {
			accountRepository
				.checkNickname(
					{
						aptId: UserAptComplexStore.aptComplex.aptId,
						nickName: formState.values.nickName,
					},
					true
				)
				.then((result) => {
					if (result.success) {
						handleAlertToggle(
							"isOpen",
							undefined,
							"이미 사용중인 닉네임 입니다.",
							undefined,
							() => {
								setIsDuplicatedNickName(true);
								setIsCheckNickName(false);
								setAlertOpens({ ...alertOpens, isOpen: false });
							}
						);
					} else {
						setIsDuplicatedNickName(false);
						setIsCheckNickName(true);
					}
				});
		}
	};

	const goWithdrawal = (event) => {
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"탈퇴 시 등록된 정보가 모두 삭제됩니다. \n 회원탈퇴를 하시겠습니까?",
			"탈퇴",
			async () => {
				setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
				userMgntRepository
					.removeUserMgnt(UserSignInStore.currentUser.id)
					.then((result) => {
						if (result.success) {
							handleAlertToggle(
								"isOpen",
								undefined,
								"회원탈퇴 완료하였습니다.",
								undefined,
								() => {
									setAlertOpens((prev) => {
										return { ...prev, isOpen: false };
									});
									UserSignInStore.logout();
									history.push(
										`/${UserAptComplexStore.aptComplex.aptId}/dashboard`
									);
								}
							);
						}
					});
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};
	useEffect(() => {
		// console.log(toJS(UserAptComplexStore.aptComplex.receivingInformation));
		// console.log(toJS(UserAptComplexStore.aptComplex.aptInformationDataType));
	}, [UserAptComplexStore]);

	return (
		<div className={classes.root}>
			{!isMobile && <div className={classes.background} />}

			{!isLoading && (
				<MC.Grid
					container
					direction={"column"}
					justify={"center"}
					alignItems={"center"}
					className={classes.content}
				>
					<div className={classes.layout}>
						{!isMobile && (
							<MC.Grid
								container
								direction={"column"}
								justify={"center"}
								alignItems={"center"}
							>
								<MC.Grid item>
									<MC.Typography variant="h3">마이페이지</MC.Typography>
								</MC.Grid>
								<MC.Grid item>
									<MC.Typography className={classes.body4}>
										{value === 0
											? "비밀번호와 닉네임을 변경하실 수 있습니다."
											: value === 1
											? "입주자카드를 작성할 수 있습니다."
											: value === 2
											? "매월 관리비를 조회할 수 있습니다."
											: value === 3
											? "내가 작성한 게시글을 조회할 수 있습니다."
											: value === 4
											? "예약한 시설 또는 강좌를 조회할 수 있습니다."
											: value === 5
											? "취소한 시설 또는 강좌를 조회할 수 있습니다."
											: value === 6 && "내게 온 쪽지를 조회할 수 있습니다."}
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
						)}

						<MC.Grid item style={{ marginTop: isMobile ? 0 : 48 }}>
							<MyPageTabs
								value={value}
								setValue={setValue}
								handleChange={handleChangeTabs}
								homepageType={homepageType}
								isMobile={isMobile}
							/>
						</MC.Grid>

						<MC.Grid item style={{ width: "100%" }}>
							<MC.Grid
								container
								direction={"column"}
								justify={"center"}
								alignItems={"center"}
							>
								<MyInfo
									value={value}
									isMobile={isMobile}
									formState={formState}
									hasError={hasError}
									handleChange={handleChange}
									handleUpdateUser={handleUpdateUser}
									currentUser={toJS(UserSignInStore.currentUser)}
									isDuplicatedNickName={isDuplicatedNickName}
									isCheckNickName={isCheckNickName}
									duplicatedNickName={duplicatedNickName}
									goWithdrawal={goWithdrawal}
								/>

								<ResidentCard
									cmpxNumb={UserAptComplexStore.cmpxNumb}
									userInfo={toJS(UserSignInStore.currentUser)}
									value={value}
									isMobile={isMobile}
									alertOpens={alertOpens}
									setAlertOpens={setAlertOpens}
									handleAlertToggle={handleAlertToggle}
								/>

								{/* {homepageType !== "CMMTY_TYPE" && ( */}
								<MyManagementFee
									value={value}
									isMobile={isMobile}
									UserAptComplexStore={UserAptComplexStore}
									handleAlertToggle={handleAlertToggle}
									setAlertOpens={setAlertOpens}
									setPayInfoOpen={setPayInfoOpen}
								/>
								{/* )} */}

								{homepageType !== "CMMTY_TYPE" && (
									<MyArticles
										rootUrl={rootUrl}
										value={value}
										isMobile={isMobile}
										history={history}
										UserAptComplexStore={UserAptComplexStore}
										handleAlertToggle={handleAlertToggle}
										setAlertOpens={setAlertOpens}
									/>
								)}
								{homepageType !== "BASIC_TYPE" && (
									<MyReservationHistory
										history={history}
										cmpxNumb={UserAptComplexStore.cmpxNumb}
										userInfo={toJS(UserSignInStore.currentUser)}
										value={value}
										isMobile={isMobile}
										handleAlertToggle={handleAlertToggle}
										setAlertOpens={setAlertOpens}
										id={id}
										reserveMenu={reserveMenu}
										rootUrl={rootUrl}
									/>
								)}
								{homepageType !== "BASIC_TYPE" && (
									<MyReservationCancelHistory
										history={history}
										cmpxNumb={UserAptComplexStore.cmpxNumb}
										userInfo={toJS(UserSignInStore.currentUser)}
										value={value}
										isMobile={isMobile}
										handleAlertToggle={handleAlertToggle}
										setAlertOpens={setAlertOpens}
									/>
								)}

								<NoteList
									rootUrl={rootUrl}
									value={value}
									isMobile={isMobile}
									history={history}
									UserAptComplexStore={UserAptComplexStore}
									handleAlertToggle={handleAlertToggle}
									setAlertOpens={setAlertOpens}
								/>
								{/* <NoteDetail
									rootUrl={rootUrl}
									value={value}
									isMobile={isMobile}
									history={history}
									UserAptComplexStore={UserAptComplexStore}
									handleAlertToggle={handleAlertToggle}
									setAlertOpens={setAlertOpens}
								/> */}
							</MC.Grid>
						</MC.Grid>
					</div>
				</MC.Grid>
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

			<SimpleDialog
				isOpen={payInfoOpen}
				handleClose={() => {
					setPayInfoOpen(false);
				}}
				title={"관리비 납부안내"}
				content={<PayFeeInfo info={UserAptComplexStore} />}
			/>
		</div>
	);
};

export default inject(
	"UserSignInStore",
	"UserAptComplexStore"
)(withRouter(observer(MyPage)));
