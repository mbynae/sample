import React, { useEffect, forwardRef } from "react";

import * as MS        from "@material-ui/styles";
import * as MC        from "@material-ui/core";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

const useStyles = MS.makeStyles(theme => ({
	content: {
		// minWidth:  432,
		// maxWidth:  432,
		maxHeight:      147,
		minHeight:      147,
		display:        "flex",
		justifyContent: "center",
		alignItems:     "center"
	},
	h6:      {
		...theme.typography.h6
	},
	tableRoot: {
		borderTop: "2px solid #449CE8"
	},
	cellTitle:           {
		backgroundColor:                "#f9f9f9",
		width:                          150,
		height:                         "auto",
		paddingLeft:                    21,
		[theme.breakpoints.down("xs")]: {
			width: 120
		}
	},
	cellContent:         {
		width:                          200,
		paddingLeft:                    20,
		paddingRight:                   20,
		[theme.breakpoints.down("xs")]: {
			width:        200,
			paddingLeft:  15,
			paddingRight: 15
		}
	},
	body4Origin:               {
		...theme.typography.body4
	}
}));

const CourseReservationInfoDialog = props => {

	const classes = useStyles();

	useEffect(() => {
		const init = () => {
		};
		setTimeout(() => {
			init();
		});
	}, []);



	const renderTableRow = (label, item) => {
		return (
			<MC.Grid item xs={12} lg={12} style={{ height: "auto", borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle} style={{ height: props.isMobile ? 60 : 50 }}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}
										 style={{ height: "100%" }}>
							<MC.Typography className={classes.body4Origin}>
								{label}
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.Typography className={classes.body4Origin}>
							{item}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
		)
	}

	return (
		<MC.Dialog
			fullScreen={props.isMobile}
			open={props.isOpen}
			onClose={() => props.handleYes()}
			TransitionComponent={Transition}
			// onClose={handleClose}
			scroll={"paper"}
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
		>
			<MC.DialogTitle id="scroll-dialog-title">
				강좌 안내
			</MC.DialogTitle>
			<MC.DialogContent dividers={true}>
				<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} className={classes.tableRoot}>
					{renderTableRow("강좌명", typeof props.courseReservationInfo[0] !== "undefined" ? props.courseReservationInfo[0].prgm_name : "미등록")}
					{renderTableRow("강사명", typeof props.courseReservationInfo[0] !== "undefined" ? props.courseReservationInfo[0].inst_name : "미등록")}
					{renderTableRow("강좌안내", typeof props.courseReservationInfo[0] !== "undefined" ? props.courseReservationInfo[0].cnts_info : "미등록")}
				</MC.Grid>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button fullWidth variant="contained" disableElevation onClick={() => props.handleYes()} color="primary" style={{ height: 40 }}>
					닫기
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	);
}

export default CourseReservationInfoDialog;
