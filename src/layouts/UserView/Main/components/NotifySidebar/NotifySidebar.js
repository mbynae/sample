import React from "react";

import * as MS           from "@material-ui/styles";
import * as MC           from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import palette           from "../../../../../theme/adminTheme/palette";

const useStyles = MS.makeStyles(theme => ({
	drawer:         {
		width: 312
		// [theme.breakpoints.up("lg")]: {
		// 	marginTop: 64,
		// 	height:    "calc(100% - 64px)"
		// }
	},
	typography:     {
		fontSize: 18,
		color:    "#222222",
		padding:  theme.spacing(2)
	},
	circle:         {
		backgroundColor: "#449CE8",
		color:           "#fff",
		marginLeft:      5,
		fontSize:        "1em",
		width:           "1.5em",
		borderRadius:    "3em",
		padding:         ".1em  .2em",
		lineHeight:      "1.25em",
		display:         "inline-block",
		textAlign:       "center"
	},
	paper:          {
		width:    240,
		overflow: "visible",
		top:      "54px !important"
		// backgroundColor: "rgba(255,255,255,0)"
	},
	layout:         {
		width:  240,
		height: 253
	},
	listView:       {
		width:    "100%",
		height:   200,
		overflow: "scroll"
	},
	listIconLayout: {
		width:        20,
		maxWidth:     20,
		minWidth:     20,
		height:       20,
		marginRight:  6,
		borderRadius: 10,
		paddingTop:   3,
		paddingLeft:  3
	},
	listIcon:       {
		fontSize: 13,
		color:    "#fff"
	}
}));

const NotifySidebar = props => {

	const { open, variant, onClose, className, history, getNotifications, updateNotification, notifications, goNoti, ...rest } = props;

	const classes = useStyles();

	return (
		<MC.Drawer
			anchor="right"
			classes={{ paper: classes.drawer }}
			onClose={onClose}
			open={open}
			variant={variant}
		>
			<MC.Grid container direction={"column"} justify={"flex-start"} alignItems={"center"} style={{ width: "100%" }}>

				<MC.Grid item style={{ width: "100%", height: 53, borderBottom: `1px solid ${palette.divider}` }}>
					<MC.Typography className={classes.typography}>
						알림
						<span className={classes.circle}>
							{notifications.length}
						</span>
					</MC.Typography>
				</MC.Grid>


				<MC.Grid item className={classes.listView}>

					<MC.List dense={true}>

						{
							notifications.sort((a, b) => b.id - a.id).map((noti, index) => (
								<MC.ListItem button key={index} onClick={() => goNoti(noti)} style={{ borderBottom: `1px solid ${palette.divider}` }}>
									<MC.ListItemIcon className={classes.listIconLayout} style={{ backgroundColor: noti.isRead ? "#909090" : "#449CE8" }}>
										<NotificationsIcon className={classes.listIcon} />
									</MC.ListItemIcon>
									<MC.ListItemText>
										<MC.Typography style={{ color: noti.isRead ? "#909090" : "#222222" }}>{noti.title}</MC.Typography>
									</MC.ListItemText>
								</MC.ListItem>
							))
						}
					</MC.List>

				</MC.Grid>

			</MC.Grid>
		</MC.Drawer>
	);
};

export default NotifySidebar;
