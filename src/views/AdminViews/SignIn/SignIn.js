import React, { useEffect, useState } from "react";
import { withRouter }                 from "react-router-dom";
import PropTypes                      from "prop-types";
import validate                       from "validate.js";
import { inject, observer }           from "mobx-react";
import { useCookies }                 from "react-cookie";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { constants } from "../../../commons";

import { AlertDialog }     from "components";
import { AccountTypeKind } from "../../../enums";
import { toJS }            from "mobx";

const schema = {
	userId:   {
		presence: { allowEmpty: false, message: "^아이디를 입력해주세요." },
		length:   {
			maximum: 64
		}
	},
	password: {
		presence: { allowEmpty: false, message: "^비밀번호를 입력해주세요." },
		length:   {
			maximum: 128
		}
	}
};

const useStyles = MS.makeStyles(theme => ({
	root:             {
		backgroundColor: theme.palette.background.default,
		height:          "100%"
	},
	grid:             {
		height: "100%"
	},
	quoteContainer:   {
		[theme.breakpoints.down("md")]: {
			display: "none"
		}
	},
	quote:            {
		backgroundColor:    theme.palette.neutral,
		height:             "100%",
		display:            "flex",
		justifyContent:     "center",
		alignItems:         "center",
		backgroundImage:    "url(/images/auth.jpg)",
		backgroundSize:     "cover",
		backgroundRepeat:   "no-repeat",
		backgroundPosition: "center"
	},
	quoteInner:       {
		textAlign: "center",
		flexBasis: "600px"
	},
	quoteText:        {
		color:      theme.palette.white,
		fontWeight: 500
	},
	name:             {
		marginTop: theme.spacing(3),
		color:     theme.palette.white
	},
	bio:              {
		color: theme.palette.white
	},
	contentContainer: {},
	content:          {
		height:        "100%",
		display:       "flex",
		flexDirection: "column"
	},
	contentHeader:    {
		display:       "flex",
		alignItems:    "center",
		paddingTop:    theme.spacing(5),
		paddingBottom: theme.spacing(2),
		paddingLeft:   theme.spacing(2),
		paddingRight:  theme.spacing(2)
	},
	logoImage:        {
		marginLeft: theme.spacing(4)
	},
	contentBody:      {
		flexGrow:                       1,
		display:                        "flex",
		alignItems:                     "center",
		justifyContent:                 "center",
		[theme.breakpoints.down("md")]: {
			justifyContent: "center"
		}
	},
	form:             {
		paddingLeft:                    100,
		paddingRight:                   100,
		paddingBottom:                  125,
		flexBasis:                      700,
		[theme.breakpoints.down("sm")]: {
			paddingLeft:  theme.spacing(2),
			paddingRight: theme.spacing(2)
		}
	},
	title:            {
		marginTop: theme.spacing(3)
	},
	socialButtons:    {
		marginTop: theme.spacing(3)
	},
	socialIcon:       {
		marginRight: theme.spacing(1)
	},
	sugestion:        {
		marginTop: theme.spacing(2)
	},
	textField:        {
		marginTop: theme.spacing(2)
	},
	signInButton:     {
		margin: theme.spacing(2, 0)
	}
}));

const SignIn = props => {
	const { history, match, rootMatch, SignInStore, isAdmin, AptComplexStore } = props;

	const classes = useStyles();

	const [loading, setLoading] = useState(true);
	const [formState, setFormState] = useState({
		isValid: false,
		values:  {
			userId:   "",
			password: ""
		},
		touched: {},
		errors:  {}
	});

	const [alertOpens, setAlertOpens] = useState({
		wrongLoginAlert: false
	});
	const [isRememberId, setIsRememberId] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(["rememberId", "autoLogin"]);
	const [isAutoLogin, setIsAutoLogin] = useState(false);

	useEffect(() => {
		const init = async () => {
			await SignInStore.setInitialStore(false, {}, isAdmin, rootMatch.params.aptComplexId);

			if ( cookies.rememberId !== undefined ) {
				setFormState(formState => ({
					...formState,
					values:  {
						...formState.values,
						userId: cookies.rememberId
					},
					touched: {
						...formState.touched,
						userId: true
					}
				}));
				setIsRememberId(true);
			}

			if ( cookies.autoLogin !== undefined ) {
				setIsAutoLogin(true);
				const json = await localStorage.getItem(constants.ACCESS_TOKEN);
				const userInfo = await SignInStore.updateUserInfo();
				if ( json !== null ) {
					if(toJS(AptComplexStore.aptComplex.contractInformationDataType.homepageType) !== 'CMMTY_TYPE') {
						history.push(`/${rootMatch.params.aptComplexId}/admin/dashboard`);
					} else {
						history.push(`/${rootMatch.params.aptComplexId}/admin/userMgnt`);
					}
				} else {
					toggleAutoLogin(false);
				}
			}

			setLoading(false);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	useEffect(() => {
		const errors = validate(formState.values, schema);

		setFormState(formState => ({
			...formState,
			isValid: errors ? false : true,
			errors:  errors || {}
		}));

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
			setCookie("autoLogin", checked, { maxAge: 2000 });
		} else {
			removeCookie("autoLogin");
		}
	};

	const toggleRememberId = (checked) => {
		setIsRememberId(checked);
		if ( checked ) {
			setCookie("rememberId", formState.values.userId, { maxAge: 2000 });
		} else {
			removeCookie("rememberId");
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

	const handleSignIn = async (event) => {
		event.preventDefault();

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
				const loginInfo = await SignInStore.login({
					userId:          formState.values.userId.trim(),
					password:        formState.values.password,
					accountTypeKind: AccountTypeKind.MANAGEMENT_OFFICE_MANAGER,
					aptId:           rootMatch.params.aptComplexId
				});
				const userInfo = await SignInStore.updateUserInfo();
				if(toJS(AptComplexStore.aptComplex.contractInformationDataType.homepageType) !== 'CMMTY_TYPE') {
					history.push(`/${rootMatch.params.aptComplexId}/admin/dashboard`);
				} else {
					history.push(`/${rootMatch.params.aptComplexId}/admin/userMgnt`);
				}

			} catch ( err ) {
				// console.log("err > ", err);
				handleAlertOpen("wrongLoginAlert");
			}
		} else {
			handleAlertOpen("wrongLoginAlert");
		}
	};

	const handleAlertOpen = (key) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					[key]: true
				};
			}
		);
	};

	const handleAlertClose = (key) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					[key]: false
				};
			}
		);
	};

	const hasError = field => !!(formState.touched[field] && formState.errors[field]);

	return (
		<div className={classes.root}>

			{
				!loading &&
				<MC.Grid
					container
					className={classes.grid}>
					{/*<MC.Grid*/}
					{/*	className={classes.quoteContainer}*/}
					{/*	item*/}
					{/*	lg={5}*/}
					{/*>*/}
					{/*	<div className={classes.quote}>*/}
					{/*		<div className={classes.quoteInner}>*/}
					{/*			<MC.Typography*/}
					{/*				className={classes.quoteText}*/}
					{/*				variant="h1"*/}
					{/*			>*/}
					{/*				아파트단지 솔루션 관리자*/}
					{/*			</MC.Typography>*/}
					{/*			<div className={classes.person}>*/}
					{/*				<MC.Typography*/}
					{/*					className={classes.name}*/}
					{/*					variant="body1"*/}
					{/*				>*/}
					{/*					우리 미고는 고객여러분과 함께합니다.*/}
					{/*				</MC.Typography>*/}
					{/*				<MC.Typography*/}
					{/*					className={classes.bio}*/}
					{/*					variant="body2"*/}
					{/*				>*/}
					{/*					미고 아파트단지 관리*/}
					{/*				</MC.Typography>*/}
					{/*			</div>*/}
					{/*		</div>*/}
					{/*	</div>*/}
					{/*</MC.Grid>*/}
					<MC.Grid
						className={classes.content}
						item
						lg={12}
						xs={12}
					>
						<div className={classes.content}>
							<div className={classes.contentBody}>
								<form
									className={classes.form}
									onSubmit={handleSignIn}
								>
									<MC.Typography
										className={classes.title}
										variant="h2"
									>
										관리자 로그인
									</MC.Typography>
									<MC.Typography
										color="textSecondary"
										gutterBottom
									>
										아파트단지 솔루션 관리자 사이트
									</MC.Typography>
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
										value={formState.values.userId || ""}
										inputProps={{
											autoComplete: "username"
										}}
										variant="outlined"
									/>
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
										value={formState.values.password || ""}
										inputProps={{
											autoComplete: "current-password"
										}}
										variant="outlined"
									/>

									<MC.FormGroup row>
										<MC.FormControlLabel
											control={<MC.Checkbox checked={!!isRememberId} onChange={handleOnChange} name="isRememberId" />}
											label="ID 저장"
										/>
										<MC.FormControlLabel
											control={<MC.Checkbox checked={!!isAutoLogin} onChange={handleOnChange} name="isAutoLogin" />}
											label="자동 로그인"
										/>
									</MC.FormGroup>

									<MC.Button
										className={classes.signInButton}
										color="primary"
										// disabled={!formState.isValid}
										fullWidth
										size="large"
										type="submit"
										variant="contained"
									>
										로그인
									</MC.Button>
								</form>
							</div>
						</div>
					</MC.Grid>
				</MC.Grid>
			}

			<AlertDialog
				isOpen={alertOpens.wrongLoginAlert}
				title={"로그인 실패"}
				content={"아이디와 비밀번호를 다시 확인해주세요."}
				handleYes={() => {
					formState.values.userId = "";
					formState.values.password = "";
					handleAlertClose("wrongLoginAlert");
				}}
			/>

		</div>
	);
};

SignIn.propTypes = {
	history: PropTypes.object
};

export default inject("SignInStore", "AptComplexStore")(withRouter(observer(SignIn)));

