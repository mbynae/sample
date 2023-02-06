import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	divider: {
		width:  "100%",
		height: 2,
		margin: theme.spacing(0, 0)
	}
}));
const CDivider = props => {
	const classes = useStyles();
	
	return (
		<MC.Divider className={classes.divider} style={props.style} />
	);
};

export default CDivider;
