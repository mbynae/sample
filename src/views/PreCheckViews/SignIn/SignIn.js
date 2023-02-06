import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { inject, observer } from "mobx-react";
import { useCookies } from "react-cookie";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { constants } from "../../../commons";

import { AlertDialogUserView, PhoneMask } from "components";
import { AccountTypeKind } from "../../../enums";
import { toJS } from "mobx";
import {
	accountRepository,
	preCheckRepository,
	preCheckUserRepository,
} from "../../../repositories";
import useCountDown from "react-countdown-hook";
import { apiObject } from "repositories/api";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		height: "100%",
		backgroundColor: theme.palette.background.default,
		[theme.breakpoints.down("xs")]: {
			height: 700,
		},
	},
	content: {
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
	contentHeader: {
		display: "flex",
		alignItems: "center",
		paddingTop: theme.spacing(5),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	logoImage: {
		marginLeft: theme.spacing(4),
	},
	form: {
		minWidth: 600,
		maxWidth: 600,
		minHeight: 600,
		paddingTop: 63,
		backgroundColor: "#fff",
		"box-shadow": "0 2px 4px 0 rgba(0, 0, 0, 0.02)",
		marginTop: 61,
		marginBottom: 80,
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
			padding: 16,
			paddingTop: 61,
			paddingBottom: 80,
		},
	},
	title: {
		whiteSpace: "pre-line",
	},
	body4: {
		...theme.typography.body4,
		marginTop: 6,
	},
	socialButtons: {
		marginTop: theme.spacing(3),
	},
	socialIcon: {
		marginRight: theme.spacing(1),
	},
	sugestion: {
		marginTop: theme.spacing(2),
	},
	signInButton: {
		height: 52,
	},
	middleDot: {
		width: "1px",
		height: "10px",
		margin: "6px 10px 4px",
		border: "1px solid #bcbcbc",
	},
	inputLabelLayout: {
		left: 15,
		top: -7,
		"& fieldset legend": {
			width: 200,
		},
	},
	textFieldLayout: {
		width: "100%",
		marginTop: 24,
		paddingLeft: 40,
		paddingRight: 40,
		[theme.breakpoints.down("xs")]: {
			paddingLeft: 0,
			paddingRight: 0,
		},
	},
	textField: {
		"& input": {
			fontWeight: "normal",
		},
		"& p": {
			color: "#222222",
			fontWeight: "normal",
			marginLeft: 0,
		},
	},
}));

const initialTime = 3 * 60 * 1000;
const interval = 1000;

const SignIn = (props) => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const {
		history,
		match,
		rootMatch,
		PreCheckSignInStore,
		UserAptComplexStore,
		isAdmin,
	} = props;

	const [loading, setLoading] = useState(true);
	const [formState, setFormState] = useState({
		isValid: false,
		values: {
			name: "",
			phoneNumber: "",
			certificationNumber: "",
			building: "",
			unit: "",
		},
		touched: {
			name: false,
			phoneNumber: false,
			certificationNumber: false,
			building: false,
			unit: false,
		},
		errors: {},
	});
	const schema = {
		name: {
			presence: { allowEmpty: false, message: "^이름을 입력해주세요." },
			length: {
				maximum: 20,
			},
		},
		phoneNumber: {
			presence: { allowEmpty: false, message: "^휴대폰번호를 입력해주세요." },
			length: {
				maximum: 20,
			},
		},
		certificationNumber: {
			presence: true,
			length: {
				minimum: 6,
				maximum: 6,
				message: "^인증번호를 입력해주세요.",
			},
		},
		building: {
			presence: { allowEmpty: false, message: "^동을 입력해주세요." },
			length: {
				maximum: 10,
			},
		},
		unit: {
			presence: { allowEmpty: false, message: "^호를 입력해주세요." },
			length: {
				maximum: 10,
			},
		},
	};
	const checkUserShema = {
		name: {
			presence: { allowEmpty: false, message: "^이름을 입력해주세요." },
			length: {
				maximum: 20,
			},
		},
		phoneNumber: {
			presence: { allowEmpty: false, message: "^휴대폰번호를 입력해주세요." },
			length: {
				maximum: 20,
			},
		},
		building: {
			presence: { allowEmpty: false, message: "^동을 입력해주세요." },
			length: {
				maximum: 10,
			},
		},
		unit: {
			presence: { allowEmpty: false, message: "^호를 입력해주세요." },
			length: {
				maximum: 10,
			},
		},
	};

	const [aptComplex, setAptComplex] = useState();
	const [preCheck, setPreCheck] = useState();

	const [isCertify, setIsCertify] = useState(false);
	const [isSendSMS, setIsSendSMS] = useState(false);
	const [isTimeOver, setIsTimeOver] = useState(false);
	const [certifyNumber, setCertifyNumber] = useState();
	const [isFirst, setIsFirst] = useState(false);

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		noTitle: "",
		yesTitle: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
	});
	const handleAlertToggle = (
		key,
		title,
		content,
		yesTitle,
		yesCallback,
		noTitle,
		noCallback
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
			};
		});
	};

	useEffect(() => {
		const init = async () => {
			await PreCheckSignInStore.setInitialStore(
				false,
				{},
				isAdmin,
				rootMatch.params.aptComplexId
			);
			setAptComplex(toJS(UserAptComplexStore.aptComplex));
			await getPreCheck(UserAptComplexStore.aptComplex);
			setLoading(false);
		};

		const getPreCheck = (aptComplex) => {
			if (aptComplex) {
				preCheckRepository
					.getPreCheck({
						aptId: aptComplex.id,
					})
					.then((result) => {
						setPreCheck(result);
					});
			}
		};
		setTimeout(() => {
			init();
		});
	}, []);

	useEffect(() => {
		const init = () => {
			const tempErrors = validate(formState.values, schema);

			setFormState((formState) => ({
				...formState,
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

	const handleSignIn = async (event) => {
		event.preventDefault();

		changeAllTouched();

		const errors = validate(formState.values, schema);
		setFormState((formState) => ({
			...formState,
			isValid: !errors,
			errors: errors || {},
		}));

		if (!errors) {
			try {
				const loginInfo = await PreCheckSignInStore.login({
					preCheckId: preCheck.id,
					...formState.values,
					phoneNumber: formState.values.phoneNumber.replaceAll("-", ""),
				});
				const userInfo = await PreCheckSignInStore.updateUserInfo();
				history.push(
					`/${rootMatch.params.aptComplexId}/pre-inspection/preCheck`
				);
			} catch (err) {
				console.log(err);
				handleAlertToggle(
					"isOpen",
					"로그인 실패",
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
				"로그인 실패",
				"입력하신 정보를 다시 확인해주세요.",
				undefined,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		}
	};

	const hasError = (field) =>
		!!(formState.touched[field] && formState.errors[field]);

	const [timeLeft, { start, pause, resume, reset }] = useCountDown(
		initialTime,
		interval
	);

	// 인즌번호 받기
	const getCertificationNumber = () => {
		accountRepository
			.getCertificationNumber({
				aptId: aptComplex.id,
				phoneNumber: formState.values.phoneNumber,
			})
			.then((result) => {
				setIsSendSMS(true);
				setIsTimeOver(false);
				start();
				setCertifyNumber(result);
			});
	};

	const convertToMinute = (time) => {
		let hours = Math.floor(time / 3600);
		let minutes = Math.floor((time - hours * 3600) / 60);
		let seconds = time - hours * 3600 - minutes * 60;

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

	// 인증번호 확인
	const checkCertificationNumber = () => {
		const errors = validate(
			{ certificationNumber: formState.values.certificationNumber },
			{ certificationNumber: { ...schema.certificationNumber } }
		);
		setFormState((formState) => ({
			...formState,
			isValid: !errors,
			errors: { ...formState.errors, ...errors } || {},
		}));

		if (!errors) {
			if (formState.values.certificationNumber === certifyNumber) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"인증되었습니다.",
					undefined,
					() => {
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
						setIsCertify(true);
					},
					undefined
				);
				pause();
			} else {
				setFormState((formState) => ({
					...formState,
					isValid: !errors,
					errors: {
						...formState.errors,
						certificationNumber: ["인증번호가 다릅니다."],
					},
				}));
				handleAlertToggle(
					"isOpen",
					undefined,
					"인증번호가 다릅니다.",
					undefined,
					() => {
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
					},
					undefined
				);
			}
		}
	};

	const handleCheckUser = async (event) => {
		event.preventDefault();

		changeAllTouched();

		const errors = validate(formState.values, checkUserShema);
		setFormState((formState) => ({
			...formState,
			isValid: !errors,
			errors: errors || {},
		}));

		if (!errors) {
			try {
				if (!isFirst) {
					const responseGetPhoneCheckAccessToken =
						await apiObject.getPhoneCheckAccessToken({
							...formState.values,
							phoneNumber: formState.values.phoneNumber.replaceAll("-", ""),
							preCheckId: preCheck.id,
						});
					console.log({ responseGetPhoneCheckAccessToken });
					if (responseGetPhoneCheckAccessToken.accessToken) {
						localStorage.setItem(
							constants.PRE_CHECK_ACCESS_TOKEN,
							responseGetPhoneCheckAccessToken.accessToken
						);
						const userInfo = await PreCheckSignInStore.updateUserInfo();
						history.push(
							`/${rootMatch.params.aptComplexId}/pre-inspection/preCheck`
						);
					} else {
						setIsFirst(true);
					}
				} else {
					const responseCreatePreCheckUser = await apiObject.createPreCheckUser(
						{
							...formState.values,
							phoneNumber: formState.values.phoneNumber.replaceAll("-", ""),
							preCheckId: preCheck.id,
						}
					);
					console.log({ responseCreatePreCheckUser });
					if (responseCreatePreCheckUser.accessToken) {
						localStorage.setItem(
							constants.PRE_CHECK_ACCESS_TOKEN,
							responseCreatePreCheckUser.accessToken
						);
					}
					const userInfo = await PreCheckSignInStore.updateUserInfo();
					history.push(
						`/${rootMatch.params.aptComplexId}/pre-inspection/preCheck`
					);
				}
			} catch (err) {
				console.log(err);
				handleAlertToggle(
					"isOpen",
					"로그인 실패",
					"입력하신 정보를 다시 확인해주세요.",
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						setIsFirst(true);
					}
				);
			}
		} else {
			handleAlertToggle(
				"isOpen",
				"로그인 실패",
				"입력하신 정보를 다시 확인해주세요.",
				undefined,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		}
	};

	useEffect(() => {
		console.log(isFirst);
	}, [isFirst]);

	return (
		<div className={classes.root}>
			{!loading && (
				<MC.Grid
					container
					direction={"row"}
					justify={"center"}
					alignItems={"center"}
					className={classes.content}
				>
					{aptComplex.contractInformationDataType.isPreCheck ? (
						<form className={classes.form} onSubmit={handleCheckUser}>
							<MC.Grid
								container
								direction={"row"}
								justify={"center"}
								alignItems={"center"}
							>
								<MC.Grid item>
									<MC.Typography className={classes.title} variant="h3">
										{`${
											aptComplex && aptComplex.aptInformationDataType.aptName
										}에 오신 것을 환영합니다.`}
									</MC.Typography>
								</MC.Grid>

								<MC.Grid item>
									<MC.Typography className={classes.body4}>
										사전점검 서비스는 분양계약자에 한해 이용이 가능합니다.
									</MC.Typography>
									<MC.Typography className={classes.body4}>
										본인확인 후 이용해주세요.
									</MC.Typography>
								</MC.Grid>

								{/*동/호*/}
								<MC.Grid item className={classes.textFieldLayout}>
									<MC.Grid
										container
										spacing={1}
										direction={"row"}
										justify={"center"}
										alignItems={"center"}
									>
										<MC.Grid item xs={12} md={6}>
											<MC.FormControl
												fullWidth
												className={classes.formControl}
												error={hasError("building")}
											>
												<MC.InputLabel
													htmlFor="building-basic"
													className={classes.inputLabelLayout}
												>
													동
												</MC.InputLabel>
												<MC.OutlinedInput
													className={classes.textField}
													label={"동"}
													id="building-basic"
													labelid="building-basic"
													name="building"
													inputProps={{
														maxLength: 10,
													}}
													endAdornment={
														<MC.InputAdornment position="end">
															동
														</MC.InputAdornment>
													}
													value={formState.values.building || ""}
													onChange={handleChange}
												/>
												{hasError("building") && (
													<MC.FormHelperText id="building-label-text">
														{formState.errors.building[0]}
													</MC.FormHelperText>
												)}
											</MC.FormControl>
										</MC.Grid>
										<MC.Grid item xs={12} md={6}>
											<MC.FormControl
												fullWidth
												className={classes.formControl}
												error={hasError("unit")}
											>
												<MC.InputLabel
													htmlFor="unit-basic"
													className={classes.inputLabelLayout}
												>
													호
												</MC.InputLabel>
												<MC.OutlinedInput
													className={classes.textField}
													label={"호"}
													id="unit-basic"
													labelid="unit-basic"
													name="unit"
													inputProps={{
														maxLength: 10,
													}}
													endAdornment={
														<MC.InputAdornment position="end">
															호
														</MC.InputAdornment>
													}
													value={formState.values.unit || ""}
													onChange={handleChange}
												/>
												{hasError("unit") && (
													<MC.FormHelperText id="unit-label-text">
														{formState.errors.unit[0]}
													</MC.FormHelperText>
												)}
											</MC.FormControl>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>

								{/*이름*/}
								<MC.Grid item className={classes.textFieldLayout}>
									<MC.TextField
										className={classes.textField}
										error={hasError("name")}
										fullWidth
										helperText={
											hasError("name") ? formState.errors.name[0] : null
										}
										label="이름"
										name="name"
										onChange={handleChange}
										type="text"
										placeholder={"이름을 입력해주세요."}
										value={formState.values.name || ""}
										inputProps={{
											maxLength: 13,
										}}
										variant="outlined"
									/>
								</MC.Grid>

								{/*휴대폰번호*/}
								<MC.Grid item className={classes.textFieldLayout}>
									<MC.Grid
										container
										direction={"row"}
										justify="space-between"
										alignItems={"flex-start"}
										spacing={1}
										// style={{ width: "100%", margin: 0 }}
									>
										<MC.Grid
											item
											style={{
												// width: isMobile ? "66%" : 410
												flex: "1 1 auto",
											}}
										>
											<MC.FormControl
												fullWidth
												className={classes.formControl}
												error={
													hasError("phoneNumber") ||
													(formState.values.phoneNumber !== "" && !isCertify)
												}
											>
												<MC.InputLabel
													id="phoneNumber-label"
													className={classes.inputLabelLayout}
												>
													휴대폰 번호
												</MC.InputLabel>
												<MC.OutlinedInput
													className={classes.textField}
													disabled={isCertify}
													label={"휴대폰 번호"}
													labelid="phoneNumber-label"
													id="phoneNumber-label"
													name="phoneNumber"
													placeholder={"숫자만 입력해주세요."}
													value={formState.values.phoneNumber || ""}
													onChange={handleChange}
													inputComponent={PhoneMask}
												/>
												{hasError("phoneNumber") ? (
													<MC.FormHelperText id="phoneNumber-label-text">
														{formState.errors.phoneNumber[0]}
													</MC.FormHelperText>
												) : formState.values.phoneNumber !== "" &&
												  !isCertify ? (
													<MC.FormHelperText id="phoneNumber-label-text">
														휴대폰 번호 인증을 진행해 주세요.
													</MC.FormHelperText>
												) : null}
											</MC.FormControl>
										</MC.Grid>
										{isFirst && (
											<MC.Grid item>
												<MC.Button
													color="primary"
													size="large"
													variant="contained"
													disableElevation
													disabled={isSendSMS}
													onClick={getCertificationNumber}
													style={{
														width: 102,
														height: 52,
														paddingLeft: 8,
														paddingRight: 8,
														fontSize: 14,
													}}
												>
													인증번호 받기
												</MC.Button>
											</MC.Grid>
										)}
									</MC.Grid>
								</MC.Grid>

								{/*인증번호*/}
								{isSendSMS && (
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.Grid
											container
											direction={"row"}
											justify={"space-between"}
											alignItems={"flex-start"}
											style={{ width: "100%", margin: 0 }}
										>
											<MC.Grid item style={{ width: isMobile ? "45%" : 300 }}>
												<MC.FormControl
													fullWidth
													className={classes.formControl}
													error={hasError("certificationNumber") || isTimeOver}
												>
													<MC.InputLabel
														htmlFor="certificationNumber-basic"
														className={classes.inputLabelLayout}
													>
														인증번호
													</MC.InputLabel>
													<MC.OutlinedInput
														className={classes.textField}
														disabled={isCertify}
														label={"인증번호"}
														id="certificationNumber-basic"
														labelid="certificationNumber-basic"
														name="certificationNumber"
														inputProps={{
															maxLength: 6,
														}}
														endAdornment={
															<MC.InputAdornment position="end">
																{convertToMinute(timeLeft / 1000)}
															</MC.InputAdornment>
														}
														value={formState.values.certificationNumber || ""}
														onChange={handleChange}
													/>
													{hasError("certificationNumber") ? (
														<MC.FormHelperText id="certificationNumber-label-text">
															{formState.errors.certificationNumber[0]}
														</MC.FormHelperText>
													) : isTimeOver ? (
														<MC.FormHelperText id="certificationNumber-label-text">
															인증시간이 지났습니다. 재발송을 해주세요.
														</MC.FormHelperText>
													) : (
														isCertify && (
															<MC.FormHelperText id="certificationNumber-label-text">
																인증완료
															</MC.FormHelperText>
														)
													)}
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
														border: "1px solid #ebebeb",
													}}
												>
													확인
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
														border: "1px solid #ebebeb",
													}}
												>
													재발송
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
								)}

								<MC.Grid item className={classes.textFieldLayout}>
									<MC.Button
										fullWidth
										color="primary"
										size="large"
										type="submit"
										variant="contained"
										disableElevation
										disabled={isFirst && !isCertify}
										className={classes.signInButton}
									>
										로그인
									</MC.Button>
								</MC.Grid>
							</MC.Grid>
						</form>
					) : (
						<MC.Grid
							container
							direction={"row"}
							justify={"center"}
							alignItems={"center"}
							style={{ height: 400 }}
						>
							<MC.Grid item>
								<MC.Typography className={classes.title} variant="h3">
									서비스가 종료되었습니다.
								</MC.Typography>
							</MC.Grid>
						</MC.Grid>
					)}
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
		</div>
	);
};

SignIn.propTypes = {
	history: PropTypes.object,
};

export default inject(
	"PreCheckSignInStore",
	"UserAptComplexStore"
)(observer(SignIn));
