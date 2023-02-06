import React, { useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, PhoneHyphen } from "../../../../../components";

import { PreCheckDefect, PreCheckDefectEdit } from "../../components";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Link } from "react-router-dom";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		borderTop: "2px solid #449CE8",
	},
	cellTitle: {
		backgroundColor: "#f9f9f9",
		width: 150,
		height: 50,
		paddingLeft: 21,
		[theme.breakpoints.down("xs")]: {
			width: 120,
		},
	},
	cellContent: {
		width: 420,
		paddingLeft: 20,
		paddingRight: 20,
		[theme.breakpoints.down("xs")]: {
			width: 208,
			paddingLeft: 15,
			paddingRight: 15,
		},
	},
	body4: {
		...theme.typography.body4,
	},
	divider: {
		width: "100%",
		height: 2,
		marginTop: 40,
		backgroundColor: "#222222",
	},
	formControl: {
		width: 210,
		height: 40,
	},
	body5: {
		...theme.typography.body5,
		whiteSpace: "pre-line",
	},
	select: {
		paddingLeft: 15,
		paddingTop: 11,
		paddingBottom: 11,
	},
}));
const PreCheckDetailForm = (props) => {
	const classes = useStyles();

	const {
		isMobile,
		aptComplex,
		currentUser,
		preCheckDetail,
		getPreCheckDetail,
		alertOpens,
		setAlertOpens,
		handleAlertToggle,
		rootUrl,
	} = props;

	const [isRegister, setIsRegister] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const toggleRegisterForm = (value = false) => {
		setIsRegister(value);
	};

	const onToggle = () => {
		setIsOpen((prev) => {
			return !prev;
		});
	};

	return (
		<MC.Grid
			container
			direction={"row"}
			justify={"center"}
			alignItems={"center"}
			className={classes.root}
		>
			<PreCheckDefectEdit
				isMobile={isMobile}
				toggleRegisterForm={toggleRegisterForm}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				rootUrl={rootUrl}
			/>
		</MC.Grid>
	);
};

export default PreCheckDetailForm;
