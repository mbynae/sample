import React                  from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx                   from "clsx";
import PropTypes              from "prop-types";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import palette    from "../../../../../theme/adminTheme/palette";
import { Helmet } from "react-helmet";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		boxShadow: "none"
	},
	heading: {
		fontFamily: "Noto Sans KR, sans-serif",
		fontWeight: "bold",
		fontSize:   24,
		flexBasis:  "15%",
		flexShrink: 0,
		color:      palette.secondary.contrastText
	}
}));

const Topbar = props => {
	const { className, mainContent, ...rest } = props;

	const classes = useStyles();
	return (
		<>
		<Helmet>
			<title>{`${mainContent.aptComplex && mainContent.aptComplex.aptInformationDataType.aptName+` 관리자`}`}</title>
		</Helmet>
		<MC.AppBar
			{...rest}
			className={clsx(classes.root, className)}
			position="fixed"
		>
			<MC.Toolbar>
				<RouterLink to="/">
					{
						mainContent.logoFile && mainContent.logoFile.fileUrl ?
							(
								<img
									style={{ marginTop: "10px", width: 200, height: 36 }}
									alt="Logo"
									src={mainContent.logoFile.fileUrl}
								/>
							)
							:
							(
								<MC.Typography className={classes.heading}>
									{mainContent.aptComplex && mainContent.aptComplex.aptInformationDataType.aptName}
								</MC.Typography>
							)
					}
				</RouterLink>
			</MC.Toolbar>
		</MC.AppBar>
	</>
	);
};

Topbar.propTypes = {
	className: PropTypes.string
};

export default Topbar;
