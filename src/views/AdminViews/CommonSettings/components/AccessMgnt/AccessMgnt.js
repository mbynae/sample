import React 													from "react";
import clsx                           from "clsx";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	root: {
		borderRadius: 0
	},
	content: {
		padding: 0
	},
	inner: {
		minWidth: 1530,
		minHeight: 630,
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between"
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

const AccessMgnt = props => {

	const classes = useStyles();
	const { className, history, menuKey, rootUrl, ...rest } = props;

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"출입 설정"}
				titleTypographyProps={{ variant: "h4" }}/>
			<MC.Divider/>

			<MC.CardContent className={classes.content} >
				<div className={classes.image} >
					<img src={"/images/dashboard/preparingPage.png"} alt={"preparingPage"} />
				</div>
			</MC.CardContent>

			<MC.Divider/>


		</MC.Card>
	)

}

export default AccessMgnt
