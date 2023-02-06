import * as MC              from "@material-ui/core";
import React                from "react";
import * as MS              from "@material-ui/styles";
import { inject, observer } from "mobx-react";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
	image: {
		textAlign: "center",
		display: "",
		justifyContent: "center",
		alignItems: "center",
		margin: "auto",
		width: "100%",
		height: "630px",
		paddingTop: "10%"
	}
}));

const Statistics = props => {

	const classes = useStyles();
	const { className, history, menuKey, rootUrl, ...rest } = props;

	return (
		<MC.CardContent className={classes.content} >
			<div className={classes.image} >
				<img src={"/images/dashboard/preparingPage.png"} alt={"preparingPage"} />
			</div>
		</MC.CardContent>
	)

}

export default inject("SignInStore", "AptComplexStore")(observer(Statistics));
