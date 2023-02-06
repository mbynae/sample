import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { NotifyPopover }             from "../index";
import { useCookies }                from "react-cookie";

const StyledBadge = MS.withStyles(theme => ({
	badge: {
		top:     5,
		right:   5,
		border:  `2px solid ${theme.palette.background.paper}`,
		padding: "0 4px"
	}
}))(MC.Badge);

const useStyles = MS.makeStyles(theme => ({
	root:          {
		boxShadow:       "none",
		height:          40,
		backgroundColor: theme.palette.background.paper
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
	body4:         {
		...theme.typography.body4,
		color:          "#898989",
		cursor:         "pointer",
		textDecoration: "none"
	},
	middleDot:     {
		width:           "4px",
		height:          "4px",
		margin:          "8px 12px",
		backgroundColor: "#898989"
	}
}));
const Topbar = props => {
	const classes = useStyles();

	const { UserSignInStore, aptComplexId, getNotifications, updateNotification, notifications, history, aptComplex } = props;
	const [cookies, setCookie, removeCookie] = useCookies(["rememberId", "autoLogin"]);
	const [currentUser, setCurrentUser] = useState({});
	const [authenticated, setAuthenticated] = useState({});

	useEffect(() => {
		const init = () => {
			setCurrentUser(toJS(UserSignInStore.currentUser));
			setAuthenticated(UserSignInStore.authenticated);
		};
		setTimeout(() => {
			init();
		});
	}, [UserSignInStore.authenticated]);

	const goPage = (event) => {
		let name = event.target.name;
		event.preventDefault();
		if ( name === "sign-out" ) {
			removeCookie("autoLogin");
			//removeCookie("rememberId");
			UserSignInStore.logout();
			history.push(`/${aptComplexId}/dashboard`);
		} else {
			history.push(`/${aptComplexId}/${name}`);
		}
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
			history.push(`/${aptComplexId}/articles/${noti.menuKey}/${noti.targetId}`);
		} else if ( noti.notificationTypeKind.toLowerCase() === "managementfee" ) {
			history.push({
				pathname: `${aptComplexId}/myPage/0/0`,
				state:    { value: 1 }
			});
		}
	};

	return (
		<MC.AppBar className={classes.root} position={"relative"} color={"transparent"}>
			<MC.Toolbar className={classes.toolbarLayout}>
				<MC.Grid container direction={"row"} justify={"flex-end"} alignItems={"center"}>
					{
						aptComplex.contractInformationDataType.isPreCheck &&
						<>
							<MC.Typography className={classes.body4}>
								<MC.Link name="pre-inspection" onClick={goPage} color="inherit">
									사전점검 바로가기
								</MC.Link>
							</MC.Typography>
							<div className={classes.middleDot} />
						</>
					}
					{
						!authenticated ?
							(
								<>
									<MC.Typography className={classes.body4}>
										<MC.Link name="sign-in" onClick={goPage} color="inherit">
											로그인
										</MC.Link>
									</MC.Typography>
									<div className={classes.middleDot} />
									<MC.Typography className={classes.body4}>
										<MC.Link name="sign-up" onClick={goPage} color="inherit">
											회원가입
										</MC.Link>
									</MC.Typography>
								</>
							)
							:
							(
								<>
									<MC.Typography className={classes.body4}>
										<MC.Link name="sign-out" onClick={goPage} color="inherit">
											로그아웃
										</MC.Link>
									</MC.Typography>
									<div className={classes.middleDot} />
									<MC.Typography className={classes.body4}>
										<MC.Link name="myPage/0/0" onClick={goPage} color="inherit">
											마이페이지
										</MC.Link>
									</MC.Typography>

									<div className={classes.middleDot} />
									<MC.IconButton
										aria-describedby={popoverId}
										className={classes.body4}
										style={{ paddingLeft: 0 }}
										onClick={handleClick}
										onMouseEnter={handleClick}>
										{
											notifications.length > 0 ?
												(
													<StyledBadge badgeContent={"N"} color={"primary"}>
														<NotificationsNoneOutlinedIcon />
													</StyledBadge>
												)
												:
												(
													<NotificationsNoneOutlinedIcon />
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
								</>
							)
					}
				</MC.Grid>
			</MC.Toolbar>
		</MC.AppBar>
	);
};

export default Topbar;
