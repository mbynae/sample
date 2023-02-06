/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useState } from "react";
import { NavLink as RouterLink }                  from "react-router-dom";
import clsx                                       from "clsx";
import PropTypes                                  from "prop-types";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import ExpandLess           from "@material-ui/icons/ExpandLess";
import ExpandMore           from "@material-ui/icons/ExpandMore";
import { inject, observer } from "mobx-react";

const useStyles = MS.makeStyles(theme => ({
	root:        {
		padding:    16,
		paddingTop: 24
	},
	item:        {
		display:       "flex",
		paddingTop:    0,
		paddingBottom: 0
	},
	button:      {
		...theme.typography.subtitle1,
		padding:        "10px 8px",
		justifyContent: "flex-start",
		textTransform:  "none",
		letterSpacing:  0,
		width:          "100%",
		display:        "flex"
		// fontSize:       14,
		// lineHeight:     1,
		// fontWeight: theme.typography.fontWeightMedium
	},
	childButton: {
		...theme.typography.body5,
		// padding:        "10px 8px",
		width:          "100%",
		textTransform:  "none",
		justifyContent: "flex-start",
		display:        "flex"
	},
	icon:        {
		color:       theme.palette.icon,
		width:       24,
		height:      24,
		display:     "flex",
		alignItems:  "center",
		marginRight: theme.spacing(1)
	},
	active:      {
		color:      theme.palette.primary.main,
		fontWeight: theme.typography.fontWeightMedium,
		"& $icon":  {
			color: theme.palette.primary.main
		}
	},
	divider:     {
		marginBottom: theme.spacing(2)
	},
	nested:      {
		// paddingLeft: theme.spacing(2)
	}
}));

const CustomRouterLink = forwardRef((props, ref) => (
	<div
		ref={ref}
		style={{ flexGrow: 1 }}
	>
		<RouterLink
			{...props}
			isActive={(match, location) => {
				return location.pathname.includes(props.to);
			}} />
	</div>
));

const SidebarNav = props => {
	const { pages, className, history, UserSignInStore, aptComplexId, onClose, aptComplex, rootUrl, ...rest } = props;

	const classes = useStyles();
	const [opens, setOpens] = useState([]);

	useEffect(() => {
		let tOpens = [];
		pages.map(page => {
			tOpens.push(false);
		});
		setOpens(tOpens);
	}, [pages]);

	const handleClick = (index) => {
		setOpens(prev => {
			prev[index] = !opens[index];
			return [...prev];
		});
	};

	const signOut = () => {
		UserSignInStore.logout();
		history.push(`/${aptComplexId}/sign-in`);
		onClose();
	};
	const goPreCheck = () => {
		UserSignInStore.logout();
		history.push(`/${aptComplexId}/pre-inspection`);
		onClose();
	};

	const onClick = (href) => {
		onClose();
	};

	return (
		<MC.List
			{...rest}
			className={clsx(classes.root, className)}
		>
			{pages.map((page, index) => (
				<div key={page.title}>
					<MC.ListItem
						button
						onClick={() => page.children && handleClick(index)}
						className={classes.item}
						disableGutters
					>
						{
							page.children ? (
								<>
									<MC.Button
										className={classes.button}
									>
										{page.title}
									</MC.Button>
									{opens[index] ? <ExpandLess /> : <ExpandMore />}
								</>
							) : (
								<MC.Button
									activeClassName={classes.active}
									className={classes.button}
									component={CustomRouterLink}
									onClick={onClick}
									to={page.href}
								>
									{page.title}
								</MC.Button>
							)
						}
					</MC.ListItem>
					{page.children &&
					 <MC.Collapse in={opens[index]} timeout="auto" unmountOnExit>
						 <MC.Divider className={classes.divider} />
						 <MC.List component="div" disablePadding>
							 {
								 page.children.map((childMenu, childIndex) => (
									 <MC.ListItem
										 className={clsx(classes.item, classes.nested)}
										 disableGutters
										 key={childMenu.title}
									 >
										 <MC.Button
											 activeClassName={classes.active}
											 className={classes.childButton}
											 component={CustomRouterLink}
											 to={childMenu.href === rootUrl + "/visitingCar" ?
												 rootUrl + "/visitingCar/edit" :
												 childMenu.href === rootUrl + "/facilityIntroduction" ?
													 rootUrl + "/facilityIntroduction/" + childIndex :
													 childMenu.href}
											 onClick={onClick}
										 >
											 {childMenu.title}
										 </MC.Button>
									 </MC.ListItem>
								 ))
							 }
						 </MC.List>
					 </MC.Collapse>
					}
				</div>
			))}
			{
				UserSignInStore.currentUser.aptComplex &&
				<>
					<MC.ListItem
						className={classes.item}
						style={{ marginTop: 20 }}
						disableGutters>
						<MC.Button
							activeClassName={classes.active}
							className={classes.childButton}
							component={CustomRouterLink}
							onClick={onClick}
							to={`/${aptComplexId}/myPage/0/0`}>
							마이페이지
						</MC.Button>
					</MC.ListItem>
					<MC.ListItem
						className={classes.item}
						disableGutters>
						<MC.Button
							// activeClassName={classes.active}
							className={classes.childButton}
							onClick={signOut}>
							로그아웃
						</MC.Button>
					</MC.ListItem>
				</>
			}

			{
				aptComplex.contractInformationDataType.isPreCheck &&
				<>
					<MC.ListItem
						className={classes.item}
						style={{ marginTop: 20 }}
						disableGutters>
						<MC.Button
							className={classes.childButton}
							onClick={goPreCheck}>
							사전점검 바로가기
						</MC.Button>
					</MC.ListItem>
				</>
			}

		</MC.List>
	);
};

SidebarNav.propTypes = {
	className: PropTypes.string,
	pages:     PropTypes.array.isRequired
};

export default SidebarNav;
