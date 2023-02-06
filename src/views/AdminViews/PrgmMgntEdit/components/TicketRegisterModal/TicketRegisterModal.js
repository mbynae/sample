import React, {useState,useEffect} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";
/**
 * 2021.04.15 | junghoon15 | 이용권 등록 created
 * @constructor
 */

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
	modalRoot: {
		width: 400,
		padding: 10,
		backgroundColor: "white"
	},
	itemRow: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
	},
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const TicketRegisterModal = props => {
	// State -----------------------------------------------------------------------------------------------------------
	const classes = useStyles();
	const {open, hideModal} = props;
	// Function --------------------------------------------------------------------------------------------------------
	const handleSubmit = () => {
		// TODO | 이용권 등록
		hideModal();
	}
	// LifeCycle -------------------------------------------------------------------------------------------------------

	// DOM -------------------------------------------------------------------------------------------------------------
	return (
		<MC.Modal
			open={open}
			onClose={hideModal}
			disablePortal
			disableEnforceFocus
			disableAutoFocus
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<MC.Grid container className={classes.modalRoot}>
				{/* Header 시작 */}
				<MC.Grid item className={classes.itemRow}>
					<MC.Grid container justify={"space-between"} alignItems={"center"}>
						<span>이용권 등록</span>
						<MI.Close onClick={hideModal}/>
					</MC.Grid>
				</MC.Grid>
				{/* Header 끝 */}

				<MC.Grid item style={{width: "100%", marginTop: 10, marginBottom: 10}}>
					<MC.Divider />
				</MC.Grid>

				{/* Body 시작 */}
				<MC.Grid item className={classes.itemRow}>
					<MC.Grid container justify={"space-around"} alignItems={"center"}>
						<MC.Grid item>
							유형
						</MC.Grid>
						<MC.Grid item>
							<MC.TextField
								variant={"outlined"}
								id={"ticket"}
								name={"ticket"}
								style={{width: 300}}
								placeholder={""}
								// value={}
								// onChange={}
							/>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
				{/* Body 끝 */}
				<MC.Grid item style={{width: "100%", marginTop: 20, display: "flex", justifyContent: "center", alignItems:"center"}}>
					<MC.Button
						color={"primary"}
						size={"medium"}
						variant={"contained"}
						disableElevation
						onClick={handleSubmit}
					>
						등록
					</MC.Button>
				</MC.Grid>
			</MC.Grid>
		</MC.Modal>
	)
};

export default TicketRegisterModal;
