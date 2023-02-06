import React, { forwardRef } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { PhoneHyphen } from "../index";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

const useStyles = MS.makeStyles((theme) => ({
	content: {
		// minWidth:  432,
		// maxWidth:  432,
		maxHeight: 147,
		minHeight: 147,
		flexDirection: "column",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("xs")]: {
			maxHeight: 200,
			minHeight: 200,
		},
	},
	contentType: {
		// minWidth:  432,
		// maxWidth:  432,
		maxHeight: 240,
		minHeight: 240,
		flexDirection: "column",
		display: "flex",
		// justifyContent: "center",
		alignItems: "center",
	},
	h6: {
		...theme.typography.h6,
		textAlign: "center",
	},
	body4: {
		...theme.typography.body4,
		textAlign: "center",
	},
	h6AlignLeft: {
		...theme.typography.h6,
	},
}));
const AlertDialog = (props) => {
	const classes = useStyles();

	const { AptComplexStore } = props;

	return (
		<MC.Dialog
			fullWidth={true}
			maxWidth={"xs"}
			open={props.isOpen}
			TransitionComponent={Transition}
			keepMounted
			onClose={() => (props.handleNo ? props.handleNo() : props.handleYes())}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
		>
			{props.type === "SIGN_UP_DONE" ? (
				<MC.DialogContent className={classes.contentType}>
					<MC.DialogContentText
						className={classes.h6}
						id="alert-dialog-slide-description"
						style={{
							width: "100%",
							whiteSpace: "pre-line",
							textAlign: "center",
						}}
					>
						{`회원가입 신청이 완료됐습니다.\n관리사무소에서 승인 후 이용가능합니다.`}
					</MC.DialogContentText>
					<MC.DialogContentText
						className={classes.body4}
						id="alert-dialog-slide-description"
						style={{
							width: "100%",
							whiteSpace: "pre-line",
							textAlign: "center",
							marginTop: 24,
						}}
					>
						{`승인현황 및 문의사항은 \n 해당 아파트 관리사무소로 연락부탁드립니다.`}
					</MC.DialogContentText>
					{AptComplexStore.aptComplex.aptInformationDataType && (
						<MC.Grid
							container
							justify={"center"}
							alignItems={"center"}
							style={{ height: 44, backgroundColor: "#fafafa" }}
						>
							<MC.DialogContentText
								className={classes.body4}
								id="alert-dialog-slide-description"
								style={{
									width: "100%",
									whiteSpace: "pre-line",
									textAlign: "center",
									marginTop: 10,
								}}
							>
								{PhoneHyphen(
									AptComplexStore.aptComplex.aptInformationDataType
										.officeCallNumber
								)}
							</MC.DialogContentText>
						</MC.Grid>
					)}
				</MC.DialogContent>
			) : props.type === "FIND_PASSWORD_DONE" ? (
				<MC.DialogContent className={classes.contentType}>
					<MC.DialogContentText
						className={classes.h6}
						id="alert-dialog-slide-description"
						style={{
							width: "100%",
							whiteSpace: "pre-line",
							textAlign: "center",
						}}
					>
						{`고객님의 휴대폰번호로 \n임시비밀번호를 발송하였습니다.`}
					</MC.DialogContentText>
					<MC.DialogContentText
						className={classes.body4}
						id="alert-dialog-slide-description"
						style={{
							width: "100%",
							whiteSpace: "pre-line",
							textAlign: "center",
							marginTop: 24,
						}}
					>
						{`로그인 후 마이페이지에서 비밀번호를 변경해주세요.`}
					</MC.DialogContentText>
				</MC.DialogContent>
			) : props.type === "FLEX_START" ? (
				<MC.DialogContent className={classes.contentType}>
					<MC.DialogContentText
						className={classes.h6AlignLeft}
						id="alert-dialog-slide-description"
						style={{ whiteSpace: "pre-line" }}
					>
						{props.content}
					</MC.DialogContentText>
				</MC.DialogContent>
			) : (
				<MC.DialogContent className={classes.content}>
					<MC.DialogContentText
						className={classes.h6}
						id="alert-dialog-slide-description"
						style={{ whiteSpace: "pre-line" }}
					>
						{props.content}
					</MC.DialogContentText>
				</MC.DialogContent>
			)}
			<MC.DialogActions>
				{props.handleNo && (
					<MC.Button
						fullWidth
						variant="contained"
						disableElevation
						onClick={() => props.handleNo()}
						style={{ height: 40, border: "1px solid #c8c8c8" }}
					>
						{props.noTitle ? props.noTitle : "아니오"}
					</MC.Button>
				)}
				<MC.Button
					fullWidth
					variant="contained"
					disableElevation
					onClick={() => props.handleYes()}
					color="primary"
					style={{ height: 40 }}
				>
					{props.handleNo
						? props.yesTitle
							? props.yesTitle
							: "예"
						: props.yesTitle
						? props.yesTitle
						: "확인"}
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	);
};

export default inject("AptComplexStore")(withRouter(observer(AlertDialog)));
