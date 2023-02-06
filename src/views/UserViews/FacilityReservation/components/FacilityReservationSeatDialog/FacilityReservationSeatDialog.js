import React, { useEffect, forwardRef } from "react";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

const useStyles = MS.makeStyles(theme => ({
	content: {
		minWidth: 250,
		minHeight: 100,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	body4Origin: {
		...theme.typography.body4
	}
}));

const FacilityReservationSeatDialog = props => {

	const classes = useStyles();

	useEffect(() => {
		const init = () => {
		};
		setTimeout(() => {
			init();
		});
	}, []);


	return (
		<MC.Dialog
			fullScreen={props.isMobile}
			open={props.isOpen}
			onClose={() => props.handleYes()}
			TransitionComponent={Transition}
			scroll={"paper"}
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
		>
			<MC.DialogTitle id="scroll-dialog-title">
				배치도 안내
			</MC.DialogTitle>
			<MC.DialogContent dividers={true} className={classes.content}>
				<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
					{props.seatImage === "" ?
						(<MC.Typography variant={"subtitle1"}>등록된 배치도가 없습니다.</MC.Typography>)
						:
						<img
							style={{ width: "100%", height: "100%" }}
							src={props.seatImage}
							alt={"seat-image"}
						/>
					}
				</MC.Grid>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button fullWidth variant="contained" disableElevation onClick={() => props.handleYes()} color="primary"
									 style={{ height: 40 }}>
					닫기
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	);

};

export default FacilityReservationSeatDialog;
