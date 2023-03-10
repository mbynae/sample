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
			presence: { allowEmpty: false, message: "^????????? ??????????????????." },
			length: {
				maximum: 20,
			},
		},
		phoneNumber: {
			presence: { allowEmpty: false, message: "^?????????????????? ??????????????????." },
			length: {
				maximum: 20,
			},
		},
		certificationNumber: {
			presence: true,
			length: {
				minimum: 6,
				maximum: 6,
				message: "^??????????????? ??????????????????.",
			},
		},
		building: {
			presence: { allowEmpty: false, message: "^?????? ??????????????????." },
			length: {
				maximum: 10,
			},
		},
		unit: {
			presence: { allowEmpty: false, message: "^?????? ??????????????????." },
			length: {
				maximum: 10,
			},
		},
	};
	const checkUserShema = {
		name: {
			presence: { allowEmpty: false, message: "^????????? ??????????????????." },
			length: {
				maximum: 20,
			},
		},
		phoneNumber: {
			presence: { allowEmpty: false, message: "^?????????????????? ??????????????????." },
			length: {
				maximum: 20,
			},
		},
		building: {
			presence: { allowEmpty: false, message: "^?????? ??????????????????." },
			length: {
				maximum: 10,
			},
		},
		unit: {
			presence: { allowEmpty: false, message: "^?????? ??????????????????." },
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
					"????????? ??????",
					"???????????? ????????? ?????? ??????????????????.",
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			}
		} else {
			handleAlertToggle(
				"isOpen",
				"????????? ??????",
				"???????????? ????????? ?????? ??????????????????.",
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

	// ???????????? ??????
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

	// ???????????? ??????
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
					"?????????????????????.",
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
						certificationNumber: ["??????????????? ????????????."],
					},
				}));
				handleAlertToggle(
					"isOpen",
					undefined,
					"??????????????? ????????????.",
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
					"????????? ??????",
					"???????????? ????????? ?????? ??????????????????.",
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
				"????????? ??????",
				"???????????? ????????? ?????? ??????????????????.",
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
										}??? ?????? ?????? ???????????????.`}
									</MC.Typography>
								</MC.Grid>

								<MC.Grid item>
									<MC.Typography className={classes.body4}>
										???????????? ???????????? ?????????????????? ?????? ????????? ???????????????.
									</MC.Typography>
									<MC.Typography className={classes.body4}>
										???????????? ??? ??????????????????.
									</MC.Typography>
								</MC.Grid>

								{/*???/???*/}
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
													???
												</MC.InputLabel>
												<MC.OutlinedInput
													className={classes.textField}
													label={"???"}
													id="building-basic"
													labelid="building-basic"
													name="building"
													inputProps={{
														maxLength: 10,
													}}
													endAdornment={
														<MC.InputAdornment position="end">
															???
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
													???
												</MC.InputLabel>
												<MC.OutlinedInput
													className={classes.textField}
													label={"???"}
													id="unit-basic"
													labelid="unit-basic"
													name="unit"
													inputProps={{
														maxLength: 10,
													}}
													endAdornment={
														<MC.InputAdornment position="end">
															???
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
											maxLength: 13,
										}}
										variant="outlined"
									/>
								</MC.Grid>

								{/*???????????????*/}
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
													????????? ??????
												</MC.InputLabel>
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
												{hasError("phoneNumber") ? (
													<MC.FormHelperText id="phoneNumber-label-text">
														{formState.errors.phoneNumber[0]}
													</MC.FormHelperText>
												) : formState.values.phoneNumber !== "" &&
												  !isCertify ? (
													<MC.FormHelperText id="phoneNumber-label-text">
														????????? ?????? ????????? ????????? ?????????.
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
													???????????? ??????
												</MC.Button>
											</MC.Grid>
										)}
									</MC.Grid>
								</MC.Grid>

								{/*????????????*/}
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
														????????????
													</MC.InputLabel>
													<MC.OutlinedInput
														className={classes.textField}
														disabled={isCertify}
														label={"????????????"}
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
															??????????????? ???????????????. ???????????? ????????????.
														</MC.FormHelperText>
													) : (
														isCertify && (
															<MC.FormHelperText id="certificationNumber-label-text">
																????????????
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
														border: "1px solid #ebebeb",
													}}
												>
													?????????
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
										?????????
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
									???????????? ?????????????????????.
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
