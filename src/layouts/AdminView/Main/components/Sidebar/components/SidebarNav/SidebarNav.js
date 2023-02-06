/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useState } from "react";
import { NavLink as RouterLink }                  from "react-router-dom";
import clsx                                       from "clsx";
import PropTypes                                  from "prop-types";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = MS.makeStyles(theme => ({
	root:   {},
	item:   {
		display:       "flex",
		paddingTop:    0,
		paddingBottom: 0
	},
	button: {
		color:          MC.colors.blueGrey[800],
		padding:        "10px 8px",
		justifyContent: "flex-start",
		textTransform:  "none",
		letterSpacing:  0,
		width:          "100%",
		display:        "flex",
		fontSize:       14,
		lineHeight:     1,
		fontWeight:     theme.typography.fontWeightMedium
	},
	icon:   {
		color:       theme.palette.icon,
		width:       24,
		height:      24,
		display:     "flex",
		alignItems:  "center",
		marginRight: theme.spacing(1)
	},
	active: {
		color:      theme.palette.primary.main,
		fontWeight: theme.typography.fontWeightMedium,
		"& $icon":  {
			color: theme.palette.primary.main
		}
	},
	nested: {
		paddingLeft: theme.spacing(2)
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
	const { pages, onClose, className, ...rest } = props;

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
										<div className={classes.icon}>
											{page.icon}
										</div>
										{page.title}
									</MC.Button>
									{opens[index] ? <ExpandLess /> : <ExpandMore />}
								</>
							) : (
								<MC.Button
									activeClassName={classes.active}
									className={classes.button}
									component={CustomRouterLink}
									to={page.href}
									onClick={onClick}
								>
									<div className={classes.icon}>
										{page.icon}
									</div>
									{page.title}
								</MC.Button>
							)
						}
					</MC.ListItem>
					{page.children &&
					<MC.Collapse in={opens[index]} timeout="auto" unmountOnExit>
						<MC.List component="div" disablePadding>
							{
								page.children.map(child => (
									<MC.ListItem
										className={clsx(classes.item, classes.nested)}
										disableGutters
										key={child.title}
									>
										<MC.Button
											activeClassName={classes.active}
											className={classes.button}
											component={CustomRouterLink}
											to={child.href}
											onClick={onClick}
										>
											{/*<div className={classes.icon}>*/}
											{/* {child.icon}*/}
											{/*</div>*/}
											{child.title}
										</MC.Button>
									</MC.ListItem>
								))
							}
						</MC.List>
					</MC.Collapse>
					}
				</div>
			))}
		</MC.List>
	);
};

SidebarNav.propTypes = {
	className: PropTypes.string,
	pages:     PropTypes.array.isRequired
};

export default SidebarNav;
