import React, { useEffect, useState } from "react";
import clsx                           from "clsx";
import PropTypes                      from "prop-types";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { Profile, SidebarNav } from "./components";

const useStyles = MS.makeStyles(theme => ({
	drawer:  {
		width: 312
		// [theme.breakpoints.up("lg")]: {
		// 	marginTop: 64,
		// 	height:    "calc(100% - 64px)"
		// }
	},
	root:    {
		backgroundColor: theme.palette.white,
		display:         "flex",
		flexDirection:   "column",
		height:          "100%"
	},
	divider: {
		margin: theme.spacing(2, 0)
	},
	nav:     {
		marginBottom: theme.spacing(2)
	}
}));

const Sidebar = props => {
	const { open, variant, onClose, className, history, menus, aptComplexId, UserSignInStore, handleNotifySidebarOpen, notifications, aptComplex, ...rest } = props;

	const classes = useStyles();
	const [pages, setPages] = useState([]);
	const [rootUrl, setRootUrl] = useState(`/${aptComplexId}`);
	const sort = (a, b) => a.sequence - b.sequence;

	useEffect(() => {
		const init = () => {
			setPages(menus);
		};
		setTimeout(() => {
			init();
		});
	}, [menus]);

	return (
		<MC.Drawer
			anchor="left"
			classes={{ paper: classes.drawer }}
			onClose={onClose}
			open={open}
			variant={variant}
		>
			<div
				{...rest}
				className={clsx(classes.root, className)}
			>
				<Profile
					history={history}
					onClose={onClose}
					UserSignInStore={UserSignInStore}
					aptComplexId={aptComplexId}
					handleNotifySidebarOpen={handleNotifySidebarOpen}
					notifications={notifications} />
				{/*<MC.Divider className={classes.divider} />*/}
				<SidebarNav
					className={classes.nav}
					history={history}
					onClose={onClose}
					UserSignInStore={UserSignInStore}
					aptComplexId={aptComplexId}
					pages={pages}
					aptComplex={aptComplex}
					rootUrl={rootUrl}
				/>
			</div>
		</MC.Drawer>
	);
};

Sidebar.propTypes = {
	className: PropTypes.string,
	onClose:   PropTypes.func,
	open:      PropTypes.bool.isRequired,
	variant:   PropTypes.string.isRequired
};

export default Sidebar;
