import React, { useEffect, useState } from "react";
import { withRouter }                 from "react-router-dom";
import PropTypes                      from "prop-types";
import validate                       from "validate.js";
import { inject, observer }           from "mobx-react";
import { useCookies }                 from "react-cookie";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { constants } from "../../../commons";

import { AlertDialogUserView } from "components";
import { AccountTypeKind }     from "../../../enums";
import { toJS }                from "mobx";

const useStyles = MS.makeStyles(theme => ({
	root:          {
		backgroundColor: theme.palette.background.default
	},
	content:       {
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
	contentHeader: {
		display:       "flex",
		alignItems:    "center",
		paddingTop:    theme.spacing(5),
		paddingBottom: theme.spacing(2),
		paddingLeft:   theme.spacing(2),
		paddingRight:  theme.spacing(2)
	},
	logoImage:     {
		marginLeft: theme.spacing(4)
	},
	form:          {
		minWidth:                       600,
		maxWidth:                       600,
		minHeight:                      600,
		padding:                        60,
		paddingBottom:                  30,
		backgroundColor:                "#fff",
		"box-shadow":                   "0 2px 4px 0 rgba(0, 0, 0, 0.02)",
		marginTop:                      61,
		marginBottom:                   80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			padding:       18,
			paddingTop:    61,
			paddingBottom: 102
		}
	},
	title:         {
		whiteSpace: "pre-line"
	},
	body4:         {
		...theme.typography.body4,
		marginTop: 6
	},
	socialButtons: {
		marginTop: theme.spacing(3)
	},
	socialIcon:    {
		marginRight: theme.spacing(1)
	},
	sugestion:     {
		marginTop: theme.spacing(2)
	},
	textField:     {},
	signInButton:  {
		height: 52
	},
	middleDot:     {
		width:  "1px",
		height: "10px",
		margin: "6px 10px 4px",
		border: "1px solid #bcbcbc"
	}
}));

const SignIn = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { history, match, rootMatch, UserSignInStore, UserAptComplexStore, isAdmin } = props;

	const [loading, setLoading] = useState(true);
	const [formState, setFormState] = useState({
		isValid: false,
		values:  {
			userId:   "",
			password: ""
		},
		touched: {
			userId:   false,
			password: false
		},
		errors:  {}
	});
	const schema = {
		userId:   {
			presence: true,
			length:   {
				maximum: 13
			},
			format:   {
				pattern: "(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,13}",
				message: "^아이디를 입력해주세요."
			}
		},
		password: {
			presence: true,
			length:   {
				maximum: 18
			},
			format:   {
				pattern:  ".{6,18}",
				allowEmpty: false,
				message:    "^비밀번호를 입력해주세요."
			}
		}
	};

	const [isRememberId, setIsRememberId] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(["userRememberId", "userAutoLogin"]);
	const [isAutoLogin, setIsAutoLogin] = useState(false);
	const [aptComplex, setAptComplex] = useState();

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		noTitle:       "",
		yesTitle:      "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	const handleAlertToggle = (key, title, content, yesTitle, yesCallback, noTitle, noCallback) => {
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
					noFn:  () => noCallback()
				};
			}
		);
	};

	useEffect(() => {
		const init = async () => {
			await UserSignInStore.setInitialStore(false, {}, isAdmin, rootMatch.params.aptComplexId);

			if ( cookies.userRememberId !== undefined ) {
				setFormState(formState => ({
					...formState,
					values:  {
						...formState.values,
						userId: cookies.userRememberId
					},
					touched: {
						...formState.touched,
						userId: true
					}
				}));
				setIsRememberId(true);
			}

			if ( cookies.userAutoLogin !== undefined ) {
				setIsAutoLogin(true);
				const json = await localStorage.getItem(constants.USER_ACCESS_TOKEN);
				if ( json !== null ) {
					const userInfo = await UserSignInStore.updateUserInfo();
					history.push(`/${rootMatch.params.aptComplexId}/dashboard`);
				} else {
					toggleAutoLogin(false);
				}
			}

			setLoading(false);
			setAptComplex(toJS(UserAptComplexStore.aptComplex));
		};
		setTimeout(() => {
			init();
		});
	}, []);

	useEffect(() => {
		const init = () => {
			const tempErrors = validate(formState.values, schema);

			setFormState(formState => ({
				...formState,
				isValid: tempErrors ? false : true,
				errors:  tempErrors || {}
			}));
		};
		setTimeout(() => {
			init();
		});
	}, [formState.values]);

	const handleOnChange = (e) => {
		let name = e.target.name;
		let checked = e.target.checked;

		if ( name === "isRememberId" ) {
			toggleRememberId(checked);
		} else if ( name === "isAutoLogin" ) {
			toggleAutoLogin(checked);
		}
	};

	const toggleAutoLogin = (checked) => {
		setIsAutoLogin(checked);
		if ( checked ) {
			setCookie("userAutoLogin", checked, { maxAge: 2000 });
		} else {
			removeCookie("userAutoLogin");
		}
	};

	const toggleRememberId = (checked) => {
		setIsRememberId(checked);
		if ( checked ) {
			setCookie("userRememberId", formState.values.userId, { maxAge: 2000 });
		} else {
			removeCookie("userRememberId");
		}
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

	const handleSignIn = async (event) => {
		event.preventDefault();

		changeAllTouched();

		const errors = validate(formState.values, schema);
		setFormState(formState => ({
			...formState,
			isValid: !errors,
			errors:  errors || {}
		}));

		if ( !errors ) {
			try {
				toggleAutoLogin(isAutoLogin);
				toggleRememberId(isRememberId);
				const loginInfo = await UserSignInStore.login({
					userId:          formState.values.userId.trim(),
					password:        formState.values.password,
					accountTypeKind: AccountTypeKind.USER,
					aptId:           rootMatch.params.aptComplexId
				});
				const userInfo = await UserSignInStore.updateUserInfo();
				history.push(`/${rootMatch.params.aptComplexId}/dashboard`);
			} catch ( err ) {
				console.log(err);
				handleAlertToggle(
					"isOpen",
					"로그인 실패",
					err.errormsg,
					undefined,
					() => {
						formState.values.userId = "";
						formState.values.password = "";
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			}
		} else {
			handleAlertToggle(
				"isOpen",
				"로그인 실패",
				"아이디와 비밀번호를 다시 확인해주세요.",
				undefined,
				() => {
					formState.values.userId = "";
					formState.values.password = "";
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		}
	};

	const hasError = field => !!(formState.touched[field] && formState.errors[field]);

	const goPage = (event) => {
		let name = "";
		if ( event.target ) {
			name = event.target.name;
			event.preventDefault();
		} else {
			name = event;
		}
		if ( name === "sign-out" ) {
			UserSignInStore.logout();
			history.push(`/${aptComplex.aptId}/sign-in`);
		} else {
			history.push(`/${aptComplex.aptId}/${name}`);
		}
	};

	return (
		<div className={classes.root}>

			{
				!loading &&
				<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}
				         className={classes.content}>
					<form
						className={classes.form}
						onSubmit={handleSignIn}>

						<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
							<MC.Grid item>
								<MC.Typography
									className={classes.title}
									variant="h3">
									{`${aptComplex && aptComplex.aptInformationDataType.aptName}에 오신 것을 환영합니다.`}
								</MC.Typography>
							</MC.Grid>
							<MC.Grid item>
								<MC.Typography className={classes.body4}>
									로그인을 하시면 더욱 더 많은 서비스를 이용하실 수 있습니다.
								</MC.Typography>
							</MC.Grid>
							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 40 : 60 }}>
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
									placeholder={"아이디를 입력해주세요."}
									value={formState.values.userId || ""}
									inputProps={{
										autoComplete: "username",
										maxLength:    13
									}}
									variant="outlined"
								/>
							</MC.Grid>

							<MC.Grid item style={{ width: "100%", marginTop: 24 }}>
								<MC.TextField
									className={classes.textField}
									error={hasError("password")}
									fullWidth
									helperText={
										hasError("password") ? formState.errors.password[0] : null
									}
									label="비밀번호"
									name="password"
									onChange={handleChange}
									type="password"
									placeholder={"비밀번호를 입력해주세요."}
									value={formState.values.password || ""}
									inputProps={{
										autoComplete: "current-password",
										maxLength:    18
									}}
									variant="outlined"
								/>
							</MC.Grid>
							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 40 : 60 }}>
								<MC.Button
									fullWidth
									color="primary"
									size="large"
									type="submit"
									variant="contained"
									disableElevation
									className={classes.signInButton}>
									로그인
								</MC.Button>
							</MC.Grid>
							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 20 : 24 }}>
								<MC.FormGroup row style={{ justifyContent: "space-between" }}>
									<MC.FormControlLabel
										style={{ marginRight: 0 }}
										control={<MC.Checkbox checked={!!isRememberId} onChange={handleOnChange} color="primary" name="isRememberId" />}
										label="아이디 저장"
									/>
									<MC.FormControlLabel
										style={{ marginRight: 0 }}
										control={<MC.Checkbox checked={!!isAutoLogin} onChange={handleOnChange} color="primary" name="isAutoLogin" />}
										label="자동 로그인"
									/>
								</MC.FormGroup>
							</MC.Grid>
							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 40 : 68 }}>
								<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
									<MC.Typography className={classes.body4} style={{ color: "#909090", marginTop: 0, cursor: "pointer" }}>
										<MC.Link name="sign-up" onClick={goPage} color="inherit">
											회원가입
										</MC.Link>
									</MC.Typography>
									<div className={classes.middleDot} />
									<MC.Typography className={classes.body4} style={{ color: "#909090", marginTop: 0, cursor: "pointer" }}>
										<MC.Link name="findIdPassword" onClick={goPage} color="inherit">
											아이디/비밀번호 찾기
										</MC.Link>
									</MC.Typography>
									{/*<div className={classes.middleDot} />*/}
									{/*<MC.Typography className={classes.body4} style={{ color: "#909090", marginTop: 0, cursor: "pointer" }}>*/}
									{/*	<MC.Link name="findIdPassword" onClick={goPage} color="inherit">*/}
									{/*		비밀번호 찾기*/}
									{/*	</MC.Link>*/}
									{/*</MC.Typography>*/}
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					</form>
				</MC.Grid>
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

SignIn.propTypes = {
	history: PropTypes.object
};

export default inject("UserSignInStore", "UserAptComplexStore")(observer(SignIn));

