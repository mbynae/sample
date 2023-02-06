import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { PhoneMask } from "../../../../../components";
import { toJS }      from "mobx";

const useStyles = MS.makeStyles(theme => ({
	form:             {
		minWidth:                       600,
		maxWidth:                       600,
		minHeight:                      600,
		[theme.breakpoints.down("xs")]: {
			width:    "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin:   0
		}
	},
	textFieldLayout:  {
		width:                          "100%",
		marginTop:                      24,
		paddingLeft:                    40,
		paddingRight:                   40,
		[theme.breakpoints.down("xs")]: {
			paddingLeft:  0,
			paddingRight: 0
		}
	},
	inputLabelLayout: {
		left:                14,
		top:                 -6,
		backgroundColor:     "#f8f8f8",
		zIndex:              10,
		"& fieldset legend": {
			width: 200
		}
	},
	textField:        {
		"& p": {
			color:      "#222222",
			fontWeight: 500,
			marginLeft: 0
		}
	},
	body5:            {
		...theme.typography.body5,
		whiteSpace: "pre-line",
		color:      "#909090",
		textAlign:  "center"
	}
}));
const MyInfo = props => {

	const classes = useStyles();

	const { isMobile, value, formState, hasError, handleChange, handleUpdateUser, currentUser, isDuplicatedNickName, isCheckNickName, duplicatedNickName, goWithdrawal } = props;

	return (
		<form
			className={classes.form}
			hidden={value !== 0}
			onSubmit={handleUpdateUser}>
			<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>

				{/*아이디*/}
				<MC.Grid item className={classes.textFieldLayout} style={{ marginTop: isMobile ? 40 : 61 }}>
					<MC.TextField
						className={classes.textField}
						error={hasError("userId")}
						fullWidth
						required
						disabled
						helperText={
							hasError("userId") ? formState.errors.userId[0] : null
						}
						label="아이디"
						name="userId"
						onChange={handleChange}
						type="text"
						placeholder={"아이디는 영문+숫자 6~13자리로 입력해주세요."}
						value={formState.values.userId || ""}
						inputProps={{
							autoComplete: "username",
							maxLength:    13
						}}
						variant="outlined"
						style={{ backgroundColor: "#f8f8f8" }}
					/>
				</MC.Grid>

				{/*비밀번호*/}
				<MC.Grid item className={classes.textFieldLayout}>
					<MC.TextField
						className={classes.textField}
						error={formState.values.password !== "" && hasError("password")}
						fullWidth
						helperText={
							formState.values.password !== "" && (hasError("password") ? formState.errors.password[0] : formState.touched.password && "사용 가능한 비밀번호입니다.")
						}
						label="비밀번호"
						name="password"
						onChange={handleChange}
						type="password"
						placeholder={"비밀번호는 알파벳,특수문자,숫자 8자리 이상으로 입력해주세요."}
						value={formState.values.password || ""}
						inputProps={{
							autoComplete: "new-password",
							maxLength:    18
						}}
						variant="outlined"
					/>
				</MC.Grid>

				{/*비밀번호 확인*/}
				<MC.Grid item className={classes.textFieldLayout}>
					<MC.TextField
						className={classes.textField}
						error={formState.values.passwordCheck !== "" && hasError("passwordCheck")}
						fullWidth
						helperText={
							formState.values.passwordCheck !== "" && (hasError("passwordCheck") ? formState.errors.passwordCheck[0] : null)
						}
						label="비밀번호 확인"
						name="passwordCheck"
						onChange={handleChange}
						type="password"
						placeholder={"비밀번호를 한번 더 입력해주세요."}
						value={formState.values.passwordCheck || ""}
						inputProps={{
							autoComplete: "new-password",
							maxLength:    18
						}}
						variant="outlined"
					/>
				</MC.Grid>

				{/*이름*/}
				<MC.Grid item className={classes.textFieldLayout}>
					<MC.TextField
						required
						disabled
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
						style={{ backgroundColor: "#f8f8f8" }} />
				</MC.Grid>

				{/*휴대폰번호*/}
				<MC.Grid item className={classes.textFieldLayout}>
					<MC.FormControl fullWidth className={classes.formControl} error={hasError("phoneNumber")}>
						<MC.InputLabel id="phoneNumber-label" className={classes.inputLabelLayout}>휴대폰 번호 *</MC.InputLabel>
						<MC.OutlinedInput
							disabled
							required
							label={"휴대폰 번호 *"}
							labelid="phoneNumber-label"
							id="phoneNumber-label"
							name="phoneNumber"
							placeholder={"숫자만 입력해주세요."}
							value={formState.values.phoneNumber || ""}
							onChange={handleChange}
							inputComponent={PhoneMask}
							style={{ zIndex: 9, backgroundColor: "#f8f8f8" }}
						/>
						{
							hasError("phoneNumber") &&
							<MC.FormHelperText id="phoneNumber-label-text">{formState.errors.phoneNumber[0]}</MC.FormHelperText>
						}
					</MC.FormControl>
				</MC.Grid>

				{/*동/호수*/}
				<MC.Grid item className={classes.textFieldLayout}>
					<MC.Grid container spacing={1} direction={"row"} justify={"center"} alignItems={"center"}>
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl} error={hasError("building")}>
								<MC.InputLabel htmlFor="building-basic" className={classes.inputLabelLayout}>동 *</MC.InputLabel>
								<MC.OutlinedInput
									required
									disabled
									label={"동 *"}
									id="building-basic"
									labelid="building-basic"
									name="building"
									inputProps={{
										maxLength: 10
									}}
									endAdornment={<MC.InputAdornment position="end">동</MC.InputAdornment>}
									value={formState.values.building || ""}
									onChange={handleChange}
									style={{ zIndex: 9, backgroundColor: "#f8f8f8" }} />
								{
									hasError("building") &&
									<MC.FormHelperText id="building-label-text">{formState.errors.building[0]}</MC.FormHelperText>
								}
							</MC.FormControl>
						</MC.Grid>
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl} error={hasError("unit")}>
								<MC.InputLabel htmlFor="unit-basic" className={classes.inputLabelLayout}>호 *</MC.InputLabel>
								<MC.OutlinedInput
									required
									disabled
									label={"호 *"}
									id="unit-basic"
									labelid="unit-basic"
									name="unit"
									inputProps={{
										maxLength: 10
									}}
									endAdornment={<MC.InputAdornment position="end">호</MC.InputAdornment>}
									value={formState.values.unit || ""}
									onChange={handleChange}
									style={{ zIndex: 9, backgroundColor: "#f8f8f8" }} />
								{
									hasError("unit") &&
									<MC.FormHelperText id="unit-label-text">{formState.errors.unit[0]}</MC.FormHelperText>
								}
							</MC.FormControl>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>

				{/*닉네임*/}
				<MC.Grid item className={classes.textFieldLayout}>
					<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"flex-start"} style={{ width: "100%", margin: 0 }}>
						<MC.Grid item style={{ width: isMobile ? "66%" : 410 }}>
							<MC.TextField
								className={classes.textField}
								error={hasError("nickName") || (formState.values.nickName !== currentUser.userDataType.nickName && (isDuplicatedNickName || !isCheckNickName))}
								fullWidth
								helperText={
									formState.values.nickName !== currentUser.userDataType.nickName ?
										(
											hasError("nickName") ? formState.errors.nickName[0] :
												isDuplicatedNickName ? "이미 사용중인 닉네임 입니다." :
													isCheckNickName ? "사용 가능한 닉네임 입니다." :
														formState.values.nickName !== "" ? "닉네임 중복체크를 해주세요." : null
										)
										: null
								}
								label="닉네임"
								name="nickName"
								onChange={handleChange}
								type="text"
								placeholder={"닉네임을 입력해주세요."}
								value={formState.values.nickName || ""}
								inputProps={{
									maxLength: 20
								}}
								variant="outlined"
							/>
							<MC.FormHelperText id="unit-label-text">게시글에 작성자는 동과 닉네임이 같이 표기됩니다. (예. 101동 미고조아)</MC.FormHelperText>
						</MC.Grid>
						<MC.Grid item>
							<MC.Button
								color="primary"
								size="large"
								variant="contained"
								disableElevation
								disabled={formState.values.nickName === currentUser.userDataType.nickName}
								onClick={duplicatedNickName}
								style={{ width: 102, height: 52 }}>
								중복체크
							</MC.Button>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>

				{/*세대주 여부*/}
				<MC.Grid item className={classes.textFieldLayout}>
					<MC.FormControl fullWidth className={classes.formControl}>
						<MC.FormLabel component="legend">세대주여부</MC.FormLabel>
						<MC.RadioGroup
							row
							aria-label="houseHolderType"
							name="houseHolderType"
							value={formState.values.houseHolderType || "HOUSEHOLD_MEMBER"}
							onChange={handleChange}>
							<MC.FormControlLabel value="HOUSEHOLD_OWNER" control={<MC.Radio color={"primary"} />} label="예" style={{ marginRight: 50 }} />
							<MC.FormControlLabel value="HOUSEHOLD_MEMBER" control={<MC.Radio color={"primary"} />} label="아니오" />
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
						disableElevation
						style={{ height: 52 }}>
						저장
					</MC.Button>
				</MC.Grid>

				<MC.Grid item className={classes.textFieldLayout} style={{ marginTop: 18 }}>
					<MC.Typography className={classes.body5}>
						회원탈퇴를 원하시면&nbsp;
						<MC.Link
							name="sign-up"
							onClick={goWithdrawal}
							style={{ cursor: "pointer", color: "#909090", fontWeight: "bold", textDecoration: "underline" }}>
							여기
						</MC.Link>
						를 눌러주세요.
					</MC.Typography>
				</MC.Grid>

			</MC.Grid>
		</form>
	);
};

export default MyInfo;
