import React, { forwardRef } from "react";

import * as MC from "@material-ui/core";
import palette from "../../theme/adminTheme/palette";
import { makeStyles } from "@material-ui/styles";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

const useStyle = makeStyles((theme) => ({
	title: {
		"& > * ": { textAlign: "center" },
	},
}));

const AlertDialog = (props) => {
	const classes = useStyle();
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
			<MC.DialogTitle id="alert-dialog-slide-title" className={classes.title}>
				{props.title}
			</MC.DialogTitle>
			<MC.DialogContent>
				<MC.DialogContentText
					id="alert-dialog-slide-description"
					style={{ whiteSpace: "pre-line" }}
				>
					{props.content}
				</MC.DialogContentText>
			</MC.DialogContent>
			<MC.DialogActions style={{ borderTop: `1px solid ${palette.divider}` }}>
				<MC.Button
					variant={props.handleNo ? "outlined" : "contained"}
					fullWidth={!props.handleNo}
					onClick={() => props.handleYes()}
					color="primary"
				>
					{props.handleNo ? "예" : "확인"}
				</MC.Button>
				{props.handleNo && (
					<MC.Button onClick={() => props.handleNo()} color="primary">
						아니오
					</MC.Button>
				)}
			</MC.DialogActions>
		</MC.Dialog>
	);
};

export default AlertDialog;
