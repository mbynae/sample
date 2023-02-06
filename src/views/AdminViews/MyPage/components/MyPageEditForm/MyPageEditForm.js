import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	cardHeader:        {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:       {},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	}, attachLayout:   {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	},
	rowHeight:         {
		height: 70
	}
}));
const MyPageEditForm = props => {
	const classes = useStyles();

	const { officeAdmin: obj, setOfficeAdmin: setObj, errors, setErrors,
		passwordErrMsg, setPasswordErrMsg, confirmPasswordErrMsg, setConfirmPasswordErrMsg, passwordRule} = props;

	// 비밀번호 에러 변경 함수
	const setPasswordErrorFunction = flag => {
		setErrors(prev => {
			return {
				...prev,
				isPassword: flag
			};
		});
	}
	// 비밀번호 확인 에러 변경 함수
	const setPasswordCheckErrorFunction = flag => {
		setErrors(prev => {
			return {
				...prev,
				isPasswordCheck: flag
			};
		});
	}

	const handleChange = event => {
		let name = event.target.name;
		let value = event.target.value;

		// 비밀번호 값에 따른 에러 세팅
		if (name == "password") {
			// 비밀번호 확인 - 비밀번호화 값 다를 경우
			if (obj.passwordCheck !== value) {
				setPasswordCheckErrorFunction(true);
				setConfirmPasswordErrMsg("*비밀번호가 맞지 않습니다.");
			} else {
				setPasswordCheckErrorFunction(false);
				setConfirmPasswordErrMsg("")
			}
			// 비밀번호 - 값 비어 있는 경우
			if (value.length == 0) {
				setPasswordErrorFunction(true);
				setPasswordErrMsg("*비밀번호를 입력해주세요.");
			}
			// 비밀번호 - 정규식 조건 틀릴 경우
			else if (value.length > 0 && !passwordRule.test(value)) {
				setPasswordErrorFunction(true);
				setPasswordErrMsg("*비밀번호는 알파벳, 특수문자, 숫자 8자리 이상으로 입력해주세요.")
			}
			else {
				setPasswordErrorFunction(false);
				setPasswordErrMsg("")
			}
		}
		// 비밀번호 확인 값에 따른 에러 세팅
		else if (name == "passwordCheck") {
			// 비밀번호 확인 - 값 비어 있는 경우
			if (value.length == 0) {
				setPasswordCheckErrorFunction(true);
				setConfirmPasswordErrMsg("*비밀번호 확인을 입력해주세요.")
			}
			// 비밀번호 확인 - 비밀번호화 값 다를 경우
			else if (obj.password !== value) {
				setPasswordCheckErrorFunction(true);
				setConfirmPasswordErrMsg("*비밀번호가 맞지 않습니다.")
			}
			else {
				setPasswordCheckErrorFunction(false);
				setConfirmPasswordErrMsg("")
			}
		}

		setObj(prev => {
			return {
				...prev,
				[name]: value
			};
		});

	};

	return (
		<MC.Card>
			<MC.CardHeader
				title={"내 정보"}
				subheader={"비밀번호를 변경하실 수 있습니다."}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>

						{/*아이디*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											아이디
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>
									{obj.userId}
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>

						{/*권한*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											권한
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>
									{
										obj.adminTypeKind === "ROOT_MANAGER" ? <MC.Chip label={"최고 관리자"} /> :
											obj.adminTypeKind === "COMMUNITY_MANAGER" ? <MC.Chip label={"커뮤니티 관리자"} /> :
												obj.adminTypeKind === "NORMAL_MANAGER" && <MC.Chip label={"일반 관리자"} />
									}
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>

						{/*비밀번호*/}
						<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="password-basic"
									name="password"
									label="비밀번호"
									type={"password"}
									placeholder={"q1w2e3r4"}
									error={errors.isPassword}
									value={obj.password || ""}
									inputProps={{
										maxLength:    18,
										autoComplete: "new-password"
									}}
									helperText={passwordErrMsg}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>

						{/*비밀번호 확인*/}
						<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="passwordCheck-basic"
									name="passwordCheck"
									label="비밀번호 확인"
									type={"password"}
									placeholder={"q1w2e3r4"}
									error={errors.isPasswordCheck}
									value={obj.passwordCheck || ""}
									inputProps={{
										maxLength:    18,
										autoComplete: "new-password"
									}}
									helperText={confirmPasswordErrMsg}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>

					</MC.Grid>
				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default MyPageEditForm;
