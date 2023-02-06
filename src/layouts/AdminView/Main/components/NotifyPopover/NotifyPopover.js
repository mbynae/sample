import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import NotificationsIcon from "@material-ui/icons/Notifications";

const useStyles = MS.makeStyles((theme) => ({
	typography:     {
		fontSize: 14,
		color:    "#222222",
		padding:  theme.spacing(2)
	},
	circle:         {
		backgroundColor: "#3f51b5",
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
		top:      "60px !important"
	},
	triLayout:      {
		position:        "absolute",
		width:           "100%",
		backgroundColor: "rgba(255,255,255,0.5)",
		top:             -10
	},
	tri:            {
		position:     "absolute",
		right:        14,
		width:        "0px",
		height:       "0px",
		borderTop:    "10px solid none",
		borderBottom: "10px solid #fff",
		borderRight:  "10px solid transparent",
		borderLeft:   "10px solid transparent",
		boxShadow:    "inherit"
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

const NotifyPopover = props => {
	const classes = useStyles();
	const { open, popoverId, anchorEl, notifications, handleClose, goNoti } = props;
	
	return (
		<MC.Popover
			id={popoverId}
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical:   "bottom",
				horizontal: "right"
			}}
			transformOrigin={{
				vertical:   "top",
				horizontal: "right"
			}}
			classes={{
				paper: classes.paper
			}}
			elevation={10}
			style={{ overflow: "visible", backgroundColor: "rgba(255,255,255,0)" }}>
			<div className={classes.triLayout}>
				<div className={classes.tri} />
			</div>
			
			<MC.Grid container direction={"column"} justify={"flex-start"} alignItems={"center"} style={{ width: "100%", maxHeight: 253 }}>
				
				<MC.Grid item style={{ width: "100%", height: 53, textAlign: "center" }}>
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
								<MC.ListItem button key={index} onClick={() => goNoti(noti)}>
									<MC.ListItemIcon className={classes.listIconLayout} style={{ backgroundColor: noti.isRead ? "#909090" : "#3f51b5" }}>
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
		</MC.Popover>
	);
};

export default NotifyPopover;
