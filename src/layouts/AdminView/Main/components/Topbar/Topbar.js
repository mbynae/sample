import React, { useState }                from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import clsx                               from "clsx";
import PropTypes                          from "prop-types";
import { inject, observer }               from "mobx-react";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import MenuIcon  from "@material-ui/icons/Menu";
import InputIcon from "@material-ui/icons/Input";

import palette                       from "../../../../../theme/adminTheme/palette";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { NotifyPopover }             from "../index";
import { Helmet }                    from "react-helmet";
import { useCookies }                 from "react-cookie";

const StyledBadge = MS.withStyles(theme => ({
	badge: {
		top:             5,
		right:           5,
		border:          `1px solid #222222`,
		backgroundColor: "#222222",
		padding:         "0 4px"
	}
}))(MC.Badge);

const useStyles = MS.makeStyles(theme => ({
	root:          {
		boxShadow: "none"
	},
	heading:       {
		fontFamily: "Noto Sans KR, sans-serif",
		fontWeight: "bold",
		fontSize:   24,
		flexBasis:  "15%",
		flexShrink: 0,
		color:      palette.secondary.contrastText
	},
	flexGrow:      {
		flexGrow: 1
	},
	signOutButton: {
		marginLeft: theme.spacing(1)
	}
}));

const Topbar = props => {
	const { className, onSidebarOpen, mainContent, SignInStore, history, aptComplexId, getNotifications, updateNotification, notifications, homepageType, ...rest } = props;
	const [cookies, setCookie, removeCookie] = useCookies(["rememberId", "autoLogin"]);
	const classes = useStyles();

	const signOut = () => {
		removeCookie("autoLogin");
		//removeCookie("rememberId");
		SignInStore.logout();
		history.push(`/${aptComplexId}/admin/sign-in`);
	};

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const popoverId = open ? "simple-popover" : undefined;

	const goNoti = async (noti) => {
		if ( noti.notificationTypeKind.toLowerCase() === "article" ) {
			handleClose();
			await updateNotification(noti.id);
			await getNotifications();
			history.push(`/${aptComplexId}/admin/articles/${noti.menuKey}/${noti.targetId}`);
		} else if ( noti.notificationTypeKind.toLowerCase() === "contract" ) {
			history.push(`/${aptComplexId}/admin/contract/${noti.targetId}`);
		} else if ( noti.notificationTypeKind.toLowerCase() === "maintenance" ) {
			history.push(`/${aptComplexId}/admin/maintenance/${noti.targetId}`);
		}
	};

	return (
		<>
			<Helmet>
				<title>{`${mainContent.aptComplex && mainContent.aptComplex.aptInformationDataType.aptName+` 관리자`}`}</title>
			</Helmet>
		<MC.AppBar
			{...rest}
			className={clsx(classes.root, className)}
		>
			<MC.Toolbar>
				<RouterLink to={`/${aptComplexId}/admin/${homepageType !== 'CMMTY_TYPE' ? 'dashboard' : 'userMgnt'}`}>
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
				<div className={classes.flexGrow} />
				<MC.Hidden mdDown>
					<MC.IconButton
						aria-describedby={popoverId}
						className={classes.body4}
						style={{ paddingLeft: 0 }}
						onClick={handleClick}
						onMouseEnter={handleClick}
					>
						{
							notifications.length > 0 ?
								(
									<StyledBadge badgeContent={"N"} color={"primary"}>
										<NotificationsNoneOutlinedIcon style={{ color: "#fff" }} />
									</StyledBadge>
								)
								:
								(
									<NotificationsNoneOutlinedIcon style={{ color: "#fff" }} />
								)
						}

					</MC.IconButton>
					<NotifyPopover
						open={open}
						popoverId={popoverId}
						anchorEl={anchorEl}
						notifications={notifications}
						handleClose={handleClose}
						goNoti={goNoti}
					/>
					<MC.IconButton
						className={classes.signOutButton}
						onClick={signOut}
						color="inherit"
					>
						<InputIcon />
					</MC.IconButton>
				</MC.Hidden>
				<MC.Hidden lgUp>
					<MC.IconButton
						color="inherit"
						onClick={onSidebarOpen}
					>
						<MenuIcon />
					</MC.IconButton>
				</MC.Hidden>
			</MC.Toolbar>
		</MC.AppBar>
		</>
	);
};

Topbar.propTypes = {
	className:     PropTypes.string,
	onSidebarOpen: PropTypes.func
};

export default inject("SignInStore")(observer(Topbar));
