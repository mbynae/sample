import React                from "react";
import clsx                 from "clsx";
import PropTypes            from "prop-types";
import { inject, observer } from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import HomeOutlinedIcon              from "@material-ui/icons/HomeOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import CloseOutlinedIcon             from "@material-ui/icons/CloseOutlined";
import { toJS }                      from "mobx";

const StyledBadge = MS.withStyles(theme => ({
	badge: {
		top:     5,
		right:   5,
		border:  `2px solid ${theme.palette.primary.main}`,
		padding: "0 4px"
	}
}))(MC.Badge);

const useStyles = MS.makeStyles(theme => ({
	root:                {
		display:         "flex",
		flexDirection:   "column",
		alignItems:      "center",
		minHeight:       150,
		height:          150,
		backgroundColor: theme.palette.primary.main,
		color:           theme.palette.white,
		padding:         theme.spacing(2),
		paddingBottom:   24
	},
	profileInnerLayout:  {
		width: "100%"
	},
	profileButtonLayout: {
		width: "100%"
	},
	badgeIcon:           {
		color: theme.palette.white
	},
	iconButton:          {
		padding: 0
	},
	body2:               {
		...theme.typography.body2,
		color:     theme.palette.white,
		marginTop: 32
	},
	h5:                  {
		...theme.typography.h5,
		color:     theme.palette.white,
		marginTop: 5
	}
}));

const Profile = props => {
	const { className, UserSignInStore, history, onClose, aptComplexId, handleNotifySidebarOpen, notifications, ...rest } = props;

	const classes = useStyles();

	const goPage = (event) => {
		let name = "";
		if ( event.target ) {
			name = event.target.name;
			event.preventDefault();
		} else {
			name = event;
		}
		if ( name === "sign-out" ) {
			UserSignInStore.logout();
			history.push(`/${aptComplexId}/sign-in`);
		} else {
			history.push(`/${aptComplexId}/${name}`);
		}
		onClose();
	};

	return (
		<div
			{...rest}
			className={clsx(classes.root, className)}
		>
			<MC.Grid
				container
				direction={"column"}
				justify={"center"}
				alignItems={"center"}
				spacing={1}>
				<MC.Grid item className={classes.profileInnerLayout}>
					<MC.Grid container direction={"row"} justify={"space-between"} className={classes.profileButtonLayout}>
						<MC.Grid item>
							<MC.IconButton
								onClick={(event) => goPage("dashboard")}
								color="inherit"
								className={classes.iconButton}>
								<HomeOutlinedIcon style={{ fontSize: 27 }} />
							</MC.IconButton>
						</MC.Grid>
						<MC.Grid item>
							{
								UserSignInStore.currentUser.aptComplex &&
								<MC.IconButton
									className={classes.iconButton}
									style={{ marginRight: 18 }}
									color="inherit"
									onClick={() => {
										onClose();
										handleNotifySidebarOpen();
									}}>
									{
										notifications.length > 0 ?
											(
												<StyledBadge badgeContent={"N"} color={"secondary"}>
													<NotificationsNoneOutlinedIcon style={{ fontSize: 27 }} />
												</StyledBadge>
											)
											:
											(
												<NotificationsNoneOutlinedIcon style={{ fontSize: 27 }} />
											)
									}
								</MC.IconButton>
							}
							<MC.IconButton
								onClick={() => onClose()}
								color="inherit"
								className={classes.iconButton}>
								<CloseOutlinedIcon style={{ fontSize: 27 }} />
							</MC.IconButton>
						</MC.Grid>
					</MC.Grid>

				</MC.Grid>

				<MC.Grid item className={classes.profileInnerLayout}>
					{
						UserSignInStore.currentUser.aptComplex ?
							(
								<>
									<MC.Typography
										className={classes.body2}
										variant="body2">
										{UserSignInStore.currentUser.aptComplex.aptInformationDataType.aptName} | {UserSignInStore.currentUser.userDataType.building} 동 {UserSignInStore.currentUser.userDataType.unit} 호
									</MC.Typography>
									<MC.Typography className={classes.h5}>
										<MC.Link name="myPage/0/0" onClick={goPage} color="inherit">
											{UserSignInStore.currentUser.name} 님 >
										</MC.Link>
									</MC.Typography>
								</>
							)
							:
							(
								<>
									<MC.Typography
										className={classes.body2}
										style={{ marginTop: 14 }}
										variant="body2">
										로그인 한번에 <br /> 아파트 관리를 쉽고 간편하게
									</MC.Typography>
									<MC.Typography className={classes.h5} style={{ cursor: "pointer" }}>
										<MC.Link name="sign-in" onClick={goPage} color="inherit" style={{ textDecoration: "none" }}>
											로그인 >
										</MC.Link>
									</MC.Typography>
								</>
							)
					}
				</MC.Grid>
			</MC.Grid>
		</div>
	);
};

Profile.propTypes = {
	className: PropTypes.string
};

export default Profile;
