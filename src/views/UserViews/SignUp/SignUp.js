import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { toJS }                       from "mobx";
import validate                       from "validate.js";
import useCountDown                   from "react-countdown-hook";
import { BatchUploadDialog }          from "./components";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import CheckIcon from "@material-ui/icons/Check";

import { AlertDialogUserView, PhoneMask, TermsDialog }       from "../../../components";
import { accountRepository, userMgntRepository }             from "../../../repositories";
import { AccountTypeKind, OwnerTypeKind, ResidentsTypeKind } from "../../../enums";

const initialTime = 3 * 60 * 1000;
const interval = 1000;

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
	form: {
		minWidth: 600,
		maxWidth: 600,
		minHeight: 600,
		paddingTop: 63,
		paddingBottom: 80,
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
			padding: 16,
			paddingTop: 61,
			paddingBottom: 80
		}
	},
	body4: {
		...theme.typography.body4,
		marginTop: 6
	},
	textFieldLayout: {
		width: "100%",
		marginTop: 24,
		paddingLeft: 40,
		paddingRight: 40,
		[theme.breakpoints.down("xs")]: {
			paddingLeft: 0,
			paddingRight: 0
		}
	},
	inputLabelLayout: {
		left: 15,
		top: -7,
		"& fieldset legend": {
			width: 200
		}
	},
	textField: {
		"& input": {
			fontWeight: "normal"
		},
		"& p": {
			color: "#222222",
			fontWeight: "normal",
			marginLeft: 0
		}
	}
}));

const SignUp = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserAptComplexStore, history } = props;

	const [loading, setLoading] = useState(true);
	const schema = {
		userId: {
			presence: true,
			length: {
				maximum: 13
			},
			format: {
				pattern: "(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,13}",
				message: "^???????????? ??????+?????? 6 ~ 13 ????????? ??????????????????."
			}
		},
		password: {
			presence: true,
			length: {
				maximum: 18
			},
			format: {
				pattern: "^(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,18}",
				allowEmpty: false,
				message: "^??????????????? ?????????,????????????,?????? 8?????? ???????????? ??????????????????."
			}
		},
		passwordCheck: {
			presence: true,
			equality: {
				attribute: "password",
				message: "^??????????????? ?????? ????????????."
			},
			length: {
				maximum: 18
			},
			format: {
				pattern: "^(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,18}",
				allowEmpty: false,
				message: "^???????????? ????????? ??????????????????."
			}
		},
		name: {
			presence: { allowEmpty: false, message: "^????????? ??????????????????." },
			length: {
				maximum: 20
			}
		},
		phoneNumber: {
			presence: { allowEmpty: false, message: "^?????????????????? ??????????????????." },
			length: {
				maximum: 20
			}
		},
		certificationNumber: {
			presence: true,
			length: {
				minimum: 6,
				maximum: 6,
				message: "^??????????????? ??????????????????."
			}
		},
		building: {
			presence: { allowEmpty: false, message: "^?????? ??????????????????." },
			length: {
				maximum: 10
			}
		},
		unit: {
			presence: { allowEmpty: false, message: "^?????? ??????????????????." },
			length: {
				maximum: 10
			}
		},
		nickName: {
			presence: { allowEmpty: false, message: "^???????????? ??????????????????." },
			length: {
				maximum: 128
			}
		},
		isAgreeTermsService: {
			inclusion: {
				within: [true],
				message: "^????????? ??????????????? ?????? ????????????."
			}
		},
		isAgreePrivacyPolicy: {
			inclusion: {
				within: [true],
				message: "^??????????????????????????? ?????? ????????????."
			}
		}
	};
	const [formState, setFormState] = useState({
		isValid: false,
		values: {
			allAgree: false,
			isAgreeTermsService: false,
			isAgreePrivacyPolicy: false,
			userId: "",
			password: "",
			passwordCheck: "",
			name: "",
			phoneNumber: "",
			certificationNumber: "",
			building: "",
			unit: "",
			nickName: "",
			houseHolderType: "HOUSEHOLD_MEMBER"
		},
		touched: {
			allAgree: false,
			isAgreeTermsService: false,
			isAgreePrivacyPolicy: false,
			userId: false,
			password: false,
			passwordCheck: false,
			name: false,
			phoneNumber: false,
			certificationNumber: false,
			building: false,
			unit: false,
			nickName: false,
			houseHolderType: false
		},
		errors: {}
	});
	const [aptComplex, setAptComplex] = useState();
	const [isDuplicatedUserId, setIsDuplicatedUserId] = useState(false);
	const [isCheckUserId, setIsCheckUserId] = useState(false);
	const [isDuplicatedNickName, setIsDuplicatedNickName] = useState(false);
	const [isCheckNickName, setIsCheckNickName] = useState(false);
	const [isSendSMS, setIsSendSMS] = useState(false);
	const [isTimeOver, setIsTimeOver] = useState(false);
	const [certifyNumber, setCertifyNumber] = useState();
	const [isCertify, setIsCertify] = useState(false);
	const [batchCheckList, setBatchCheckList] = useState([]); // ?????? ????????? ?????? ?????? ?????????

	// batch upload Alert -- ?????? ??????
	const [batchUploadOpen, setBatchUploadOpen] = useState({
		isOpen: false,
		yesFn: () => handleBatchToggle()
	});
	const handleBatchToggle = (key, yesCallback) => {
		setBatchUploadOpen(prev => {
			return {
				...prev,
				isOpen: true,
				yesFn: () => yesCallback()
			};
		});
	};
	// ?????? ?????? Alert Handler
	const handleBatchUploadOpen = () => {
		handleBatchToggle(
			"isOpen",
			() => {
				setBatchUploadOpen(prev => {
					return {
						...prev,
						isOpen: false
					};
				});
			}
		);
	};
	// ?????? ?????? Alert
	const [termsOpen, setTermsOpen] = useState({
		isOpen: false,
		isPrivacy: false,
		yesFn: () => handleTermsToggle()
	});

	const handleTermsToggle = (key, isPrivacy, yesCallback) => {
		setTermsOpen(prev => {
			return {
				...prev,
				[key]: !termsOpen[key],
				isPrivacy,
				yesFn: () => yesCallback()
			};
		});
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

	const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);

	useEffect(() => {
		const init = () => {
			setAptComplex(toJS(UserAptComplexStore.aptComplex));
			setLoading(false);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	useEffect(() => {
		const init = () => {
			const tempErrors = validate(formState.values, schema);

			setFormState(prevFormState => ({
				...prevFormState,
				isValid: tempErrors ? false : true,
				errors: tempErrors || {}
			}));
		};
		setTimeout(() => {
			init();
		});
	}, [formState.values]);

	useEffect(() => {
		const init = () => {
			if (timeLeft === 0) {
				setIsTimeOver(true);
			} else {
				setIsTimeOver(false);
			}
		};
		setTimeout(() => {
			init();
		});
	}, [timeLeft]);

	// ????????? ????????????
	const duplicatedUserId = () => {
		setIsDuplicatedUserId(false);
		setFormState(prev => {
			prev.touched["userId"] = true;
			return {
				...prev
			};
		});

		if (!hasError("userId")) {
			accountRepository.checkUserId({
				aptId: aptComplex.aptId,
				userId: formState.values.userId
			}, true).then(result => {
				if (result.success) {
					handleAlertToggle(
						"isOpen",
						undefined,
						"?????? ???????????? ????????? ?????????.",
						undefined,
						() => {
							setIsDuplicatedUserId(true);
							setAlertOpens({ ...alertOpens, isOpen: false });
						}
					);
				} else {
					setIsDuplicatedUserId(false);
					setIsCheckUserId(true);
				}
			});
		}
	};

	// ????????? ????????????
	const duplicatedNickName = () => {
		setIsDuplicatedNickName(false);
		setFormState(prev => {
			prev.touched["nickName"] = true;
			return {
				...prev
			};
		});

		if (!hasError("nickName")) {
			accountRepository.checkNickname({
				aptId: aptComplex.aptId,
				nickName: formState.values.nickName
			}, true).then(result => {
				if (result.success) {
					handleAlertToggle(
						"isOpen",
						undefined,
						"?????? ???????????? ????????? ?????????.",
						undefined,
						() => {
							setIsDuplicatedNickName(true);
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

	// ???????????? ??????
	const getCertificationNumber = () => {
		accountRepository.getCertificationNumber({
			aptId: aptComplex.id,
			phoneNumber: formState.values.phoneNumber
		}).then(result => {
			setIsSendSMS(true);
			setIsTimeOver(false);
			start();
			setCertifyNumber(result);
		});
	};

	// ???????????? ??????
	const checkCertificationNumber = () => {
		const errors = validate({ certificationNumber: formState.values.certificationNumber }, { certificationNumber: { ...schema.certificationNumber } });
		setFormState(formState => ({
			...formState,
			isValid: !errors,
			errors: { ...formState.errors, ...errors } || {}
		}));

		if (!errors) {
			if (formState.values.certificationNumber === certifyNumber) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"?????????????????????.",
					undefined,
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
						setIsCertify(true);
					},
					undefined
				);
				pause();
			} else {
				setFormState(formState => ({
					...formState,
					isValid: !errors,
					errors: { ...formState.errors, certificationNumber: ["??????????????? ????????????."] }
				}));
				handleAlertToggle(
					"isOpen",
					undefined,
					"??????????????? ????????????.",
					undefined,
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					},
					undefined
				);
			}
		}
	};

	const changeAllTouched = () => {
		Object
			.entries(formState.touched)
			.map(async obj => {
				let [key] = obj;
				setFormState(prev => {
					prev.touched[key] = true;
					return {
						...prev
					};
				});
			});
	};

	const getUserMgntsByBuildingAndUnit = async (building, unit) => {
		return userMgntRepository
			.getUserMgntsByBuildingAndUnit({
				aptId: UserAptComplexStore.aptComplex.id,
				building: building,
				unit: unit
			}, true);
	};

	const handleSignUp = async (event) => {
		event.preventDefault();

		changeAllTouched();

		const errors = validate(formState.values, schema);
		setFormState(formState => ({
			...formState,
			isValid: !errors,
			errors: errors || {}
		}));

		if (!errors && isCheckUserId && !isDuplicatedUserId && isCheckNickName && !isDuplicatedNickName) {
			try {
				if (formState.values.houseHolderType === "HOUSEHOLD_OWNER") {
					const result = await getUserMgntsByBuildingAndUnit(formState.values.building, formState.values.unit);
					if (result.id) {
						handleAlertToggle(
							"isOpen",
							undefined,
							"?????? ???/????????? ?????? ???????????? ????????????. \n?????? ??????????????? ??????????????? ????????????.",
							undefined,
							() => {
								setAlertOpens(prev => {
									return { ...prev, isOpen: false };
								});
							},
							undefined
						);
						return;
					}
				}

				// ?????? ????????? ?????? ??????
				const batchCheck = await accountRepository.checkUserBatchUpload({
					cmpx_numb: UserAptComplexStore.cmpxNumb,
					mbil_teln: formState.values.phoneNumber.replaceAll("-", ""),
					dong_numb: formState.values.building,
					ho_numb: formState.values.unit,
					memb_name: formState.values.name.trim()
				});

				// ?????? ????????? ??????
				if (batchCheck.data_json_array && batchCheck.data_json_array.length > 0) {
					setBatchCheckList(batchCheck.data_json_array)
					handleBatchUploadOpen();
				}
				// ?????? ????????? ?????????
				else {
					const signUp = await accountRepository.signUp({
						aptId: aptComplex.id,
						userId: formState.values.userId.trim(),
						password: formState.values.password.trim(),
						name: formState.values.name.trim(),
						phoneNumber: formState.values.phoneNumber.replaceAll("-", ""),
						accountTypeKind: AccountTypeKind.USER,
						userDataType: {
							nickName: formState.values.nickName.trim(),
							building: formState.values.building,
							unit: formState.values.unit,
							houseHolderType: formState.values.houseHolderType,
							residentsType: ResidentsTypeKind.AWAITING_RESIDENTS,
							ownerType: OwnerTypeKind.TO_BE_CONFIRMED,
							isPhoneCertification: true
						},
						isAgreeTermsService: formState.values.isAgreeTermsService,
						isAgreePrivacyPolicy: formState.values.isAgreePrivacyPolicy
					}, true);
					if (signUp.success) {
						handleAlertToggle(
							"isOpenType",
							undefined,
							undefined,
							undefined,
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
								history.push(`/${aptComplex.aptId}/dashboard`);
							},
							undefined,
							undefined,
							"SIGN_UP_DONE"
						);
					}
				}
			} catch (err) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"???????????? ????????? ?????? ??????????????????.",
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			}
		}
	};

	const hasError = field => !!(formState.touched[field] && formState.errors[field]);

	const handleChange = (event, value) => {

		if (event.target) {
			event.persist();

			if (event.target.name === "userId") {
				setIsCheckUserId(false);
				setIsDuplicatedUserId(false);
			}

			if (event.target.name === "nickName") {
				setIsCheckNickName(false);
				setIsDuplicatedNickName(false);
			}

			if (event.target.name === "certificationNumber") {
				let regex = /^[0-9]{0,6}$/g;
				if (!regex.test(event.target.value)) {
					return;
				}
			}

			if (event.target.name === "isAgreeTermsService" || event.target.name === "isAgreePrivacyPolicy") {
				if (!event.target.checked) {
					setFormState(formState => ({
						...formState,
						values: {
							...formState.values,
							[event.target.name]: event.target.type === "checkbox"
								? event.target.checked
								: event.target.value,
							allAgree: false
						},
						touched: {
							...formState.touched,
							[event.target.name]: true,
							allAgree: true
						}
					}));
				} else {
					setFormState(formState => ({
						...formState,
						values: {
							...formState.values,
							[event.target.name]: event.target.type === "checkbox"
								? event.target.checked
								: event.target.value,
							allAgree: event.target.name === "isAgreeTermsService" ? formState.values.isAgreePrivacyPolicy : formState.values.isAgreeTermsService
						},
						touched: {
							...formState.touched,
							[event.target.name]: true,
							allAgree: true
						}
					}));
				}
			}

			setFormState(formState => ({
				...formState,
				values: {
					...formState.values,
					[event.target.name]:
						event.target.type === "checkbox"
							? event.target.checked
							: event.target.value
				},
				touched: {
					...formState.touched,
					[event.target.name]: true
				}
			}));
		} else {
			if (event === "allAgree") {
				setFormState(formState => ({
					...formState,
					values: {
						...formState.values,
						[event]: value,
						isAgreeTermsService: value,
						isAgreePrivacyPolicy: value
					},
					touched: {
						...formState.touched,
						[event]: true,
						isAgreeTermsService: true,
						isAgreePrivacyPolicy: true
					}
				}));
			}
		}

	};

	const viewTerms = (isPrivacy) => {
		handleTermsToggle(
			"isOpen",
			isPrivacy,
			() => {
				setTermsOpen(prev => {
					return {
						...prev,
						isOpen: false
					};
				});
			}
		);
	};

	const convertToMinute = (time) => {
		let hours = Math.floor(time / 3600);
		let minutes = Math.floor((time - (hours * 3600)) / 60);
		let seconds = time - (hours * 3600) - (minutes * 60);

		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return `${minutes}:${seconds}`;
	};

	return (
		<div className={classes.root}>
			<div className={classes.background}/>

			{
				!loading &&
				<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
								 className={classes.content}>
					<form
						className={classes.form}
						onSubmit={handleSignUp}>
						<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>

							<MC.Grid item>
								<MC.Typography variant="h3">
									????????????
								</MC.Typography>
							</MC.Grid>
							<MC.Grid item>
								<MC.Typography className={classes.body4}>
									?????? ?????? ?????? ??? ?????? ??? ???????????? ??? ????????? ????????? ??????????????????.
								</MC.Typography>
							</MC.Grid>

							{/*????????????*/}
							<MC.Grid
								item
								style={{ width: "100%", height: 244, marginTop: isMobile ? 40 : 60 }}>
								<MC.Paper
									elevation={1}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: "#ffffff",
										padding: 40,
										paddingLeft: isMobile ? 16 : 40,
										paddingRight: isMobile ? 16 : 40
									}}>

									<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
													 style={{ margin: 0 }}>

										<MC.Grid item style={{ width: "100%" }}>
											<MC.Button
												fullWidth
												size="large"
												variant="contained"
												disableElevation
												onClick={() => handleChange("allAgree", !formState.values.allAgree)}
												style={{ height: 60, border: `1px solid ${formState.values.allAgree ? "#449CE8" : "#ebebeb"}` }}
												startIcon={<CheckIcon
													style={{ color: formState.values.allAgree ? "#449CE8" : "rgba(0, 0, 0, 0.87)" }}/>}>
												?????? ?????? ??????
											</MC.Button>
										</MC.Grid>

										{/*????????????*/}
										<MC.Grid item style={{ width: "100%", marginTop: 18 }}>
											<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
												<MC.Grid item>
													<MC.FormControl fullWidth className={classes.formControl}
																					error={hasError("isAgreeTermsService")}>
														<MC.FormControlLabel
															style={{ margin: 0 }}
															control={<MC.Checkbox checked={!!formState.values.isAgreeTermsService}
																										onChange={handleChange} color="primary"
																										name="isAgreeTermsService"/>}
															label="????????? ????????????"
														/>
														{
															hasError("isAgreeTermsService") &&
															<MC.FormHelperText
																id="isAgreeTermsService-label-text">{formState.errors.isAgreeTermsService[0]}</MC.FormHelperText>
														}
													</MC.FormControl>
												</MC.Grid>
												<MC.Grid item>
													<MC.Typography className={classes.body4}
																				 style={{ color: "#bcbcbc", marginTop: 0, cursor: "pointer" }}>
														<MC.Link name="sign-up" onClick={() => viewTerms(false)} color="inherit">
															????????????
														</MC.Link>
													</MC.Typography>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>

										{/*???????????? ??????*/}
										<MC.Grid item style={{ width: "100%", marginTop: 0 }}>
											<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
												<MC.Grid item>
													<MC.FormControl fullWidth className={classes.formControl}
																					error={hasError("isAgreePrivacyPolicy")}>
														<MC.FormControlLabel
															style={{ margin: 0 }}
															control={<MC.Checkbox checked={!!formState.values.isAgreePrivacyPolicy}
																										onChange={handleChange} color="primary"
																										name="isAgreePrivacyPolicy"/>}
															label="????????????????????????"
														/>
														{
															hasError("isAgreePrivacyPolicy") &&
															<MC.FormHelperText
																id="isAgreePrivacyPolicy-label-text">{formState.errors.isAgreePrivacyPolicy[0]}</MC.FormHelperText>
														}
													</MC.FormControl>
												</MC.Grid>
												<MC.Grid item>
													<MC.Typography className={classes.body4}
																				 style={{ color: "#bcbcbc", marginTop: 0, cursor: "pointer" }}>
														<MC.Link name="sign-up" onClick={() => viewTerms(true)} color="inherit">
															????????????
														</MC.Link>
													</MC.Typography>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>

									</MC.Grid>

								</MC.Paper>
							</MC.Grid>

							{/*?????????*/}
							<MC.Grid item className={classes.textFieldLayout} style={{ marginTop: isMobile ? 40 : 60 }}>
								<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"flex-start"}
												 style={{ width: "100%", margin: 0 }}>
									<MC.Grid item style={{ width: isMobile ? "66%" : 410 }}>
										<MC.TextField
											className={classes.textField}
											error={hasError("userId") || (formState.values.userId !== "" && (isDuplicatedUserId || !isCheckUserId))}
											fullWidth
											helperText={
												hasError("userId") ? formState.errors.userId[0] :
													isDuplicatedUserId ? "?????? ???????????? ????????? ?????????." :
														isCheckUserId ? "?????? ????????? ??????????????????." :
															formState.values.userId !== "" ? "????????? ??????????????? ????????????." : null
											}
											label="?????????"
											name="userId"
											onChange={handleChange}
											type="text"
											placeholder={"???????????? ??????+?????? 6 ~ 13 ????????? ??????????????????."}
											value={formState.values.userId || ""}
											inputProps={{
												autoComplete: "username",
												maxLength: 13
											}}
											variant="outlined"
										/>
									</MC.Grid>
									<MC.Grid item>
										<MC.Button
											color="primary"
											size="large"
											variant="contained"
											disableElevation
											onClick={duplicatedUserId}
											style={{ width: 102, height: 52 }}>
											????????????
										</MC.Button>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							{/*????????????*/}
							<MC.Grid item className={classes.textFieldLayout}>
								<MC.TextField
									className={classes.textField}
									error={hasError("password")}
									fullWidth
									helperText={
										hasError("password") ? formState.errors.password[0] : formState.touched.password && "?????? ????????? ?????????????????????."
									}
									label="????????????"
									name="password"
									onChange={handleChange}
									type="password"
									placeholder={"??????????????? ?????????,????????????,?????? 8?????? ???????????? ??????????????????."}
									value={formState.values.password || ""}
									inputProps={{
										autoComplete: "new-password",
										maxLength: 18
									}}
									variant="outlined"
								/>
							</MC.Grid>

							{/*???????????? ??????*/}
							<MC.Grid item className={classes.textFieldLayout}>
								<MC.TextField
									className={classes.textField}
									error={hasError("passwordCheck")}
									fullWidth
									helperText={
										hasError("passwordCheck") ? formState.errors.passwordCheck[0] : null
									}
									label="???????????? ??????"
									name="passwordCheck"
									onChange={handleChange}
									type="password"
									placeholder={"??????????????? ?????? ??? ??????????????????."}
									value={formState.values.passwordCheck || ""}
									inputProps={{
										autoComplete: "new-password",
										maxLength: 18
									}}
									variant="outlined"
								/>
							</MC.Grid>

							{/*??????*/}
							<MC.Grid item className={classes.textFieldLayout}>
								<MC.TextField
									className={classes.textField}
									error={hasError("name")}
									fullWidth
									helperText={
										hasError("name") ? formState.errors.name[0] : null
									}
									label="??????"
									name="name"
									onChange={handleChange}
									type="text"
									placeholder={"????????? ??????????????????."}
									value={formState.values.name || ""}
									inputProps={{
										maxLength: 20
									}}
									variant="outlined"
								/>
							</MC.Grid>

							{/*???????????????*/}
							<MC.Grid item className={classes.textFieldLayout}>
								<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"flex-start"}
												 style={{ width: "100%", margin: 0 }}>
									<MC.Grid item style={{ width: isMobile ? "66%" : 410 }}>
										<MC.FormControl fullWidth className={classes.formControl}
																		error={hasError("phoneNumber") || formState.values.phoneNumber !== "" && !isCertify}>
											<MC.InputLabel id="phoneNumber-label" className={classes.inputLabelLayout}>????????? ??????</MC.InputLabel>
											<MC.OutlinedInput
												className={classes.textField}
												disabled={isCertify}
												label={"????????? ??????"}
												labelid="phoneNumber-label"
												id="phoneNumber-label"
												name="phoneNumber"
												placeholder={"????????? ??????????????????."}
												value={formState.values.phoneNumber || ""}
												onChange={handleChange}
												inputComponent={PhoneMask}
											/>
											{
												hasError("phoneNumber")
													? <MC.FormHelperText
														id="phoneNumber-label-text">{formState.errors.phoneNumber[0]}</MC.FormHelperText> :
													(formState.values.phoneNumber !== "" && !isCertify)
														? <MC.FormHelperText id="phoneNumber-label-text">????????? ?????? ????????? ?????????
															?????????.</MC.FormHelperText> : null
											}
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item>
										<MC.Button
											color="primary"
											size="large"
											variant="contained"
											disableElevation
											disabled={isSendSMS}
											onClick={getCertificationNumber}
											style={{ width: 102, height: 52, paddingLeft: 8, paddingRight: 8, fontSize: 14 }}>
											???????????? ??????
										</MC.Button>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							{/*????????????*/}
							{
								isSendSMS &&
								<MC.Grid item className={classes.textFieldLayout}>
									<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"flex-start"}
													 style={{ width: "100%", margin: 0 }}>
										<MC.Grid item style={{ width: isMobile ? "45%" : 300 }}>
											<MC.FormControl fullWidth className={classes.formControl}
																			error={hasError("certificationNumber") || isTimeOver}>
												<MC.InputLabel htmlFor="certificationNumber-basic"
																			 className={classes.inputLabelLayout}>????????????</MC.InputLabel>
												<MC.OutlinedInput
													className={classes.textField}
													disabled={isCertify}
													label={"????????????"}
													id="certificationNumber-basic"
													labelid="certificationNumber-basic"
													name="certificationNumber"
													inputProps={{
														maxLength: 6
													}}
													endAdornment={<MC.InputAdornment
														position="end">{convertToMinute(timeLeft / 1000)}</MC.InputAdornment>}
													value={formState.values.certificationNumber || ""}
													onChange={handleChange}/>
												{
													hasError("certificationNumber") ?
														<MC.FormHelperText
															id="certificationNumber-label-text">{formState.errors.certificationNumber[0]}</MC.FormHelperText>
														:
														isTimeOver ?
															<MC.FormHelperText id="certificationNumber-label-text">??????????????? ???????????????. ????????????
																????????????.</MC.FormHelperText>
															:
															isCertify &&
															<MC.FormHelperText id="certificationNumber-label-text">????????????</MC.FormHelperText>
												}
											</MC.FormControl>
										</MC.Grid>
										<MC.Grid item>
											<MC.Button
												size="large"
												variant="contained"
												disableElevation
												disabled={isTimeOver || isCertify}
												onClick={checkCertificationNumber}
												style={{
													width: isMobile ? 80 : 102,
													height: 52,
													paddingLeft: 8,
													paddingRight: 8,
													fontSize: 14,
													backgroundColor: "#f9f9f9",
													border: "1px solid #ebebeb"
												}}>
												??????
											</MC.Button>
										</MC.Grid>
										<MC.Grid item>
											<MC.Button
												size="large"
												variant="contained"
												disableElevation
												disabled={isCertify}
												onClick={getCertificationNumber}
												style={{
													width: isMobile ? 80 : 102,
													height: 52,
													paddingLeft: 8,
													paddingRight: 8,
													fontSize: 14,
													backgroundColor: "#f9f9f9",
													border: "1px solid #ebebeb"
												}}>
												?????????
											</MC.Button>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							}

							{/*???/??????*/}
							<MC.Grid item className={classes.textFieldLayout}>
								<MC.Grid container spacing={1} direction={"row"} justify={"center"} alignItems={"center"}>
									<MC.Grid item xs={12} md={6}>
										<MC.FormControl fullWidth className={classes.formControl} error={hasError("building")}>
											<MC.InputLabel htmlFor="building-basic" className={classes.inputLabelLayout}>???</MC.InputLabel>
											<MC.OutlinedInput
												className={classes.textField}
												label={"???"}
												id="building-basic"
												labelid="building-basic"
												name="building"
												inputProps={{
													maxLength: 10
												}}
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={formState.values.building || ""}
												onChange={handleChange}/>
											{
												hasError("building") &&
												<MC.FormHelperText id="building-label-text">{formState.errors.building[0]}</MC.FormHelperText>
											}
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={6}>
										<MC.FormControl fullWidth className={classes.formControl} error={hasError("unit")}>
											<MC.InputLabel htmlFor="unit-basic" className={classes.inputLabelLayout}>???</MC.InputLabel>
											<MC.OutlinedInput
												className={classes.textField}
												label={"???"}
												id="unit-basic"
												labelid="unit-basic"
												name="unit"
												inputProps={{
													maxLength: 10
												}}
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={formState.values.unit || ""}
												onChange={handleChange}/>
											{
												hasError("unit") &&
												<MC.FormHelperText id="unit-label-text">{formState.errors.unit[0]}</MC.FormHelperText>
											}
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							{/*?????????*/}
							<MC.Grid item className={classes.textFieldLayout}>
								<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"flex-start"}
												 style={{ width: "100%", margin: 0 }}>
									<MC.Grid item style={{ width: isMobile ? "66%" : 410 }}>
										<MC.TextField
											className={classes.textField}
											error={hasError("nickName") || (formState.values.nickName !== "" && (isDuplicatedNickName || !isCheckNickName))}
											fullWidth
											helperText={
												hasError("nickName") ? formState.errors.nickName[0] :
													isDuplicatedNickName ? "?????? ???????????? ????????? ?????????." :
														isCheckNickName ? "?????? ????????? ????????? ?????????." :
															formState.values.nickName !== "" ? "????????? ??????????????? ????????????." : null
											}
											label="?????????"
											name="nickName"
											onChange={handleChange}
											type="text"
											placeholder={"???????????? ??????????????????."}
											value={formState.values.nickName || ""}
											inputProps={{
												maxLength: 20
											}}
											variant="outlined"
										/>
										<MC.FormHelperText id="unit-label-text">???????????? ???????????? ?????? ???????????? ?????? ???????????????. (???. 101???
											????????????)</MC.FormHelperText>
									</MC.Grid>
									<MC.Grid item>
										<MC.Button
											color="primary"
											size="large"
											variant="contained"
											disableElevation
											onClick={duplicatedNickName}
											style={{ width: 102, height: 52 }}>
											????????????
										</MC.Button>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							{/*????????? ??????*/}
							<MC.Grid item className={classes.textFieldLayout}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.FormLabel component="legend">???????????????</MC.FormLabel>
									<MC.RadioGroup
										row
										aria-label="houseHolderType"
										name="houseHolderType"
										value={formState.values.houseHolderType || "HOUSEHOLD_MEMBER"}
										onChange={handleChange}>
										<MC.FormControlLabel value="HOUSEHOLD_OWNER" control={<MC.Radio color={"primary"}/>} label="???"
																				 style={{ marginRight: 50 }}/>
										<MC.FormControlLabel value="HOUSEHOLD_MEMBER" control={<MC.Radio color={"primary"}/>} label="?????????"/>
									</MC.RadioGroup>
								</MC.FormControl>
							</MC.Grid>

							<MC.Grid item className={classes.textFieldLayout}>
								<MC.Button
									fullWidth
									color="primary"
									size="large"
									type="submit"
									variant="contained"
									disableElevation>
									??????
								</MC.Button>
							</MC.Grid>

						</MC.Grid>
					</form>
				</MC.Grid>
			}

			<TermsDialog
				isOpen={termsOpen.isOpen}
				isMobile={isMobile}
				isPrivacy={termsOpen.isPrivacy}
				handleYes={() => termsOpen.yesFn()}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isOpenType}
				type={alertOpens.type}
				handleYes={() => alertOpens.yesFn()}
			/>

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

			<BatchUploadDialog
				isOpen={batchUploadOpen.isOpen}
				isMobile={isMobile}
				handleYes={() => batchUploadOpen.yesFn()}
				batchCheckList={batchCheckList}
				formState={formState}
				UserAptComplexStore={UserAptComplexStore}
				aptComplex={aptComplex}
				handleAlertToggle={handleAlertToggle}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				history={history}
			/>

		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore")(withRouter(observer(SignUp)));
