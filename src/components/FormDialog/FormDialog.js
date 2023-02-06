import React, { forwardRef } from "react";

import * as MC from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

const FormDialog = (props) => {
	const handleSubmit = async () => {
		props.onSubmit();
	};
	return (
		<MC.Dialog
			open={props.isOpen}
			onClose={props.handleClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			fullWidth={true}
			maxWidth={"xs"}
			TransitionComponent={Transition}
			keepMounted
		>
			<MC.DialogTitle id="alert-dialog-title">
				<MC.Typography component={"div"} variant="h4">
					{props.title}
				</MC.Typography>
			</MC.DialogTitle>
			<MC.DialogContent>{props.content}</MC.DialogContent>

			<MC.DialogActions style={{ padding: "8px 24px 10px 24px" }}>
				<MC.Button
					variant="contained"
					disableElevation
					onClick={props.handleClose}
					color="secondary"
					style={{ height: 40 }}
				>
					닫기
				</MC.Button>
				<MC.Button
					variant="contained"
					disableElevation
					onClick={handleSubmit}
					color="primary"
					style={{ height: 40 }}
				>
					보내기
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	);
};

export default inject("AptComplexStore")(withRouter(observer(FormDialog)));
