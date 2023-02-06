import React, { useEffect, useState } from "react";
import { Link as RouterLink }         from "react-router-dom";
import clsx                           from "clsx";
import PropTypes                      from "prop-types";
import { toJS }                       from "mobx";

import * as MS    from "@material-ui/styles";
import * as MC    from "@material-ui/core";
import { Helmet } from "react-helmet";

const useStyles = MS.makeStyles(theme => ({
	root:          {
		boxShadow:       "none",
		height:          79,
		backgroundColor: theme.palette.background.paper,
		borderBottom:    "1px solid #ebebeb"
	},
	toolbarLayout: {
		height:                       "100%",
		minHeight:                    "100%",
		[theme.breakpoints.up("lg")]: {
			padding:     0,
			width:       "1180px",
			marginRight: "auto",
			marginLeft:  "auto"
		}
	},
	heading:       {
		fontFamily: "Noto Sans KR, sans-serif",
		fontWeight: "bold",
		fontSize:   24,
		flexBasis:  "15%",
		flexShrink: 0,
		color:      "#222222"
	},
	body4:         {
		...theme.typography.body4,
		color:          "#898989",
		cursor:         "pointer",
		textDecoration: "none"
	}
}));

const Topbar = props => {
	const classes = useStyles();

	const { className, aptComplexId, mainContent, PreCheckSignInStore, history, ...rest } = props;
	const [currentUser, setCurrentUser] = useState({});
	const [authenticated, setAuthenticated] = useState({});

	useEffect(() => {
		const init = () => {
			setCurrentUser(toJS(PreCheckSignInStore.currentUser));
			setAuthenticated(PreCheckSignInStore.authenticated);
		};
		setTimeout(() => {
			init();
		});
	}, [PreCheckSignInStore.currentUser]);

	const goPage = (event) => {
		let name = event.target.name;
		event.preventDefault();
		if ( name === "sign-out" ) {
			PreCheckSignInStore.logout();
			history.push(`/${aptComplexId}/pre-inspection/sign-in`);
		}
	};

	return (
		<>
			<Helmet>
				<title>{`${mainContent.aptComplex && mainContent.aptComplex.aptInformationDataType.aptName+` 사전점검`}`}</title>
			</Helmet>
		<MC.AppBar
			{...rest}
			className={clsx(classes.root, className)}
			position="fixed"
		>
			<MC.Toolbar className={classes.toolbarLayout}>
				<MC.Grid container justify={"space-between"}>
					<MC.Grid item>
						<RouterLink to={`/${aptComplexId}/pre-inspection/sign-in`}>
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
					</MC.Grid>
					<MC.Grid item>
						{
							authenticated && PreCheckSignInStore.currentUser.id &&
							(
								<>
									<MC.Typography className={classes.body4}>
										<MC.Link name="sign-out" onClick={goPage} color="inherit">
											로그아웃
										</MC.Link>
									</MC.Typography>
								</>
							)
						}
					</MC.Grid>
				</MC.Grid>
			</MC.Toolbar>
		</MC.AppBar>
		</>
	);
};

Topbar.propTypes = {
	className: PropTypes.string
};

export default Topbar;
