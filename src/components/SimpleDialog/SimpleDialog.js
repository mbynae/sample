import React, { forwardRef } from "react";

import * as MC from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

const SimpleDialog = (props) => {
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
				{props.title}
			</MC.DialogTitle>
			<MC.DialogContent>
				{props.content}
			</MC.DialogContent>

			<MC.DialogActions>
				<MC.Button
					fullWidth
					variant="contained"
					disableElevation
					onClick={props.handleClose}
					color="primary"
					style={{ height: 40 }}
				>
					확인
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	);
};

export default inject("AptComplexStore")(withRouter(observer(SimpleDialog)));
