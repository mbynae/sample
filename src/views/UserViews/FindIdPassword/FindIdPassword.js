import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import validate                       from "validate.js";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { FindTabs }                       from "./components";
import { AlertDialogUserView, PhoneMask } from "../../../components";
import { accountRepository }              from "../../../repositories";
import { AccountTypeKind }                from "../../../enums";

const useStyles = MS.makeStyles(theme => ({
	root:             {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background:       {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          245,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:          {
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
	layout:           {
		minWidth:                       600,
		maxWidth:                       600,
		minHeight:                      600,
		paddingTop:                     63,
		paddingBottom:                  80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			padding:       10,
			paddingTop:    61,
			paddingBottom: 80
		}
	},
	body4:            {
		...theme.typography.body4,
		marginTop:  6,
		whiteSpace: "pre-line",
		textAlign:  "center"
	},
	textFieldLayout:  {
		width:     "100%",
		marginTop: 52,
		// paddingLeft:                    40,
		// paddingRight:                   40,
		[theme.breakpoints.down("xs")]: {
			paddingLeft:  0,
			paddingRight: 0
		}
	},
	textField:        {
		"& p": {
			color:      "#222222",
			fontWeight: 500,
			marginLeft: 0
		}
	},
	inputLabelLayout: {
		left:                15,
		top:                 -7,
		"& fieldset legend": {
			width: 200
		}
	}
}));
const FindIdPassword = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, history } = props;

	const [loading, setLoading] = useState(true);
	const [value, setValue] = useState(0);
	const schema = {
		userId:      {
			presence: true,
			length:   {
				maximum: 13
			},
			format:   {
				pattern: "(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,13}",
				message: "^아이디를 입력해주세요."
			}
		},
		name:        {
			presence: { allowEmpty: false, message: "^이름을 입력해주세요." },
			length:   {
				maximum: 20
			}
		},
		phoneNumber: {
			presence: { allowEmpty: false, message: "^휴대폰번호를 입력해주세요." },
			length:   {
				maximum: 20
			}
		}
	};
	const [formState, setFormState] = useState({
		isValid: false,
		values:  {
			userId:      "",
			name:        "",
			phoneNumber: ""
		},
		touched: {
			userId:      false,
			name:        false,
			phoneNumber: false
		},
		errors:  {}
	});

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

	useEffect(() => {
		const init = () => {
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
				isValid: !tempErrors,
				errors:  tempErrors || {}
			}));
		};
		setTimeout(() => {
			init();
		});
	}, [formState.values]);

	const handleChangeTabs = (event, newValue) => {
		setValue(newValue);
	};

	const handleChange = event => {
		event.persist();

		setFormState(formState => ({
			...formState,
			values:  {
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
	};

	const hasError = field => !!(formState.touched[field] && formState.errors[field]);

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

	const handleFindId = async (event) => {
		event.preventDefault();
		changeAllTouched();

		const errors = validate(formState.values, schema);
		if ( errors.userId ) {
			delete errors.userId;
		}
		setFormState(formState => ({
			...formState,
			isValid: !errors,
			errors:  errors || {}
		}));

		if ( !(errors.name || errors.phoneNumber) ) {
			try {
				const result = await accountRepository.findId({
					aptId:           UserAptComplexStore.aptComplex.id,
					accountTypeKind: AccountTypeKind.USER,
					name:            formState.values.name,
					phoneNumber:     formState.values.phoneNumber
				}, true);
				handleAlertToggle(
					"isOpen",
					undefined,
					"고객님의 휴대폰번호로 \n 아이디를 발송했습니다.",
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`/${UserAptComplexStore.aptComplex.aptId}/sign-in`);
					}
				);
			} catch ( err ) {
				console.error(err);
				handleAlertToggle(
					"isOpen",
					undefined,
					"입력하신 이름, 휴대폰번호로 등록된 정보가 없습니다.",
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			}
		}
	};

	const handleFindPassword = async (event) => {
		event.preventDefault();
		changeAllTouched();

		const errors = validate(formState.values, schema);
		if ( errors.name ) {
			delete errors.name;
		}
		setFormState(formState => ({
			...formState,
			isValid: !errors,
			errors:  errors || {}
		}));

		if ( !(errors.userId || errors.phoneNumber) ) {
			try {
				const result = await accountRepository.findPassword({
					aptId:           UserAptComplexStore.aptComplex.id,
					accountTypeKind: AccountTypeKind.USER,
					userId:          formState.values.userId,
					phoneNumber:     formState.values.phoneNumber
				}, true);
				handleAlertToggle(
					"isOpenType",
					undefined,
					undefined,
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`/${UserAptComplexStore.aptComplex.aptId}/sign-in`);
					},
					undefined,
					undefined,
					"FIND_PASSWORD_DONE"
				);
			} catch ( err ) {
				console.error(err);
				handleAlertToggle(
					"isOpen",
					undefined,
					"입력하신 아이디, 휴대폰번호로 등록된 정보가 없습니다.",
					undefined,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			}
		}

	};

	return (
		<div className={classes.root}>
			<div className={classes.background} />
			{
				!loading &&
				<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
				         className={classes.content}>

					<div className={classes.layout}>

						<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
							<MC.Grid item>
								<MC.Typography variant="h3">
									아이디/비밀번호 찾기
								</MC.Typography>
							</MC.Grid>
						</MC.Grid>

						<MC.Grid
							item
							style={{ width: "100%", height: 539, marginTop: isMobile ? 40 : 60 }}>
							<MC.Paper
								elevation={1}
								style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", paddingTop: 30, paddingBottom: 47, paddingLeft: isMobile ? 10 : 40, paddingRight: isMobile ? 10 : 40 }}>

								<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"} style={{ margin: 0 }}>

									<MC.Grid item style={{ width: "100%" }}>
										<FindTabs
											value={value}
											setValue={setValue}
											handleChange={handleChangeTabs} />
									</MC.Grid>

									<MC.Grid item style={{ width: "100%", marginTop: 18 }}>

										<form hidden={value !== 0} onSubmit={handleFindId}>

											<MC.Grid
												container
												direction={"column"}
												justify={"center"}
												alignItems={"center"}>

												<MC.Grid item style={{ width: isMobile ? 326 : 520, height: 76, backgroundColor: "#fafafa" }}>
													<MC.Grid container justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
														<MC.Typography className={classes.body4}>
															{`회원가입하신 이름과 휴대폰번호를 입력해주세요.\n가입하신 휴대폰번호로 아이디를 발송해드립니다.`}
														</MC.Typography>
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
															maxLength: 20
														}}
														variant="outlined"
													/>
												</MC.Grid>

												{/*휴대폰번호*/}
												<MC.Grid item className={classes.textFieldLayout}>
													<MC.FormControl fullWidth className={classes.formControl} error={hasError("phoneNumber")}>
														<MC.InputLabel id="phoneNumber-label" className={classes.inputLabelLayout}>휴대폰 번호</MC.InputLabel>
														<MC.OutlinedInput
															label={"휴대폰 번호"}
															labelid="phoneNumber-label"
															id="phoneNumber-label"
															name="phoneNumber"
															placeholder={"숫자만 입력해주세요."}
															value={formState.values.phoneNumber || ""}
															onChange={handleChange}
															inputComponent={PhoneMask}
														/>
														{
															hasError("phoneNumber") &&
															<MC.FormHelperText id="phoneNumber-label-text">{formState.errors.phoneNumber[0]}</MC.FormHelperText>
														}
													</MC.FormControl>
												</MC.Grid>

												<MC.Grid item className={classes.textFieldLayout} style={{ marginTop: 60 }}>
													<MC.Button
														fullWidth
														color="primary"
														size="large"
														type="submit"
														variant="contained"
														disableElevation
														style={{ height: 53 }}>
														아이디 찾기
													</MC.Button>
												</MC.Grid>

											</MC.Grid>

										</form>

										<form hidden={value !== 1} onSubmit={handleFindPassword}>

											<MC.Grid
												container
												direction={"column"}
												justify={"center"}
												alignItems={"center"}>

												<MC.Grid item style={{ width: isMobile ? 326 : 520, height: 76, backgroundColor: "#fafafa" }}>
													<MC.Grid container justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
														<MC.Typography className={classes.body4}>
															{`회원가입하신 아이디와 휴대폰번호를 입력해주세요.\n가입하신 휴대폰번호로 임시비밀번호를 발송해드립니다.`}
														</MC.Typography>
													</MC.Grid>
												</MC.Grid>

												{/*아이디*/}
												<MC.Grid item className={classes.textFieldLayout}>
													<MC.TextField
														className={classes.textField}
														error={hasError("userId")}
														fullWidth
														helperText={
															hasError("userId") ? formState.errors.userId[0] : null
														}
														label="아이디"
														name="userId"
														onChange={handleChange}
														type="text"
														placeholder={"영문+숫자 6~13자리로 입력해주세요."}
														value={formState.values.userId || ""}
														inputProps={{
															maxLength: 20
														}}
														variant="outlined"
													/>
												</MC.Grid>

												{/*휴대폰번호*/}
												<MC.Grid item className={classes.textFieldLayout}>
													<MC.FormControl fullWidth className={classes.formControl} error={hasError("phoneNumber")}>
														<MC.InputLabel id="phoneNumber-label" className={classes.inputLabelLayout}>휴대폰 번호</MC.InputLabel>
														<MC.OutlinedInput
															required
															label={"휴대폰 번호"}
															labelid="phoneNumber-label"
															id="phoneNumber-label"
															name="phoneNumber"
															placeholder={"숫자만 입력해주세요."}
															value={formState.values.phoneNumber || ""}
															onChange={handleChange}
															inputComponent={PhoneMask}
														/>
														{
															hasError("phoneNumber") &&
															<MC.FormHelperText id="phoneNumber-label-text">{formState.errors.phoneNumber[0]}</MC.FormHelperText>
														}
													</MC.FormControl>
												</MC.Grid>

												<MC.Grid item className={classes.textFieldLayout} style={{ marginTop: 60 }}>
													<MC.Button
														fullWidth
														color="primary"
														size="large"
														type="submit"
														variant="contained"
														disableElevation
														style={{ height: 53 }}>
														비밀번호 찾기
													</MC.Button>
												</MC.Grid>

											</MC.Grid>

										</form>

									</MC.Grid>

								</MC.Grid>

							</MC.Paper>
						</MC.Grid>

					</div>

				</MC.Grid>
			}

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

		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore")(withRouter(observer(FindIdPassword)));
