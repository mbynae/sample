import React          from "react";
import PropTypes      from "prop-types";
import { makeStyles } from "@material-ui/styles";

import { Topbar } from "./components";

const useStyles = makeStyles(() => ({
	root:    {
		minWidth:  "420px !important",
		maxWidth:  "420px !important",
		minHeight: "800px !important",
		margin:    "auto"
	},
	toolbar: {
		minWidth: "420px !important",
		maxWidth: "420px !important",
		left:     "auto",
		right:    "auto"
	},
	content: {
		marginTop: 56,
		height:    "744px !important"
	}
}));

const NewWindow = props => {
	const { children } = props;
	
	const classes = useStyles();
	
	return (
		<div className={classes.root}>
			<Topbar className={classes.toolbar} />
			<main className={classes.content}>{children}</main>
		</div>
	);
};

NewWindow.propTypes = {
	children:  PropTypes.node,
	className: PropTypes.string
};

export default NewWindow;
