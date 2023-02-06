import React                              from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import clsx                               from "clsx";
import PropTypes                          from "prop-types";
import { inject, observer }               from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import InputIcon from "@material-ui/icons/Input";
import { toJS }  from "mobx";

const useStyles = MS.makeStyles(theme => ({
	root:   {
		display:       "flex",
		flexDirection: "column",
		alignItems:    "center",
		minHeight:     "fit-content"
	},
	avatar: {
		width:  60,
		height: 60
	},
	name:   {
		marginTop: theme.spacing(1),
		paddingBottom: 5,
		wordBreak: "break-word"
	}
}));

const Profile = props => {
	const { className, SignInStore, history, aptComplexId, onClose, ...rest } = props;

	const classes = useStyles();

	const signOut = () => {
		SignInStore.logout();
		history.push(`/${aptComplexId}/admin/sign-in`);
		onClose();
	};

	const goMyPage = () => {
		history.push(`/${aptComplexId}/admin/myPage`);
		onClose();
	};

	return (
		<div
			{...rest}
			className={clsx(classes.root, className)}
		>
			<MC.Grid
				container
				justify={"space-around"}
				alignItems={"center"}
				spacing={1}>
				<MC.Grid
					item
					xs={9}
					style={{ cursor: "pointer" }}
					onClick={() => goMyPage()}>
					<MC.Typography
						className={classes.name}
						variant="h4">
						{SignInStore.currentUser.userId}
					</MC.Typography>
					<MC.Typography variant="body2">
						{
							SignInStore.currentUser.adminType === "ROOT_MANAGER" ? "최고 관리자" :
								SignInStore.currentUser.adminType === "COMMUNITY_MANAGER" ? "커뮤니티 관리자" :
									SignInStore.currentUser.adminType === "NORMAL_MANAGER" && "일반 관리자"
						}
					</MC.Typography>
				</MC.Grid>
				<MC.Grid
					item
					xs={3}>
					<MC.IconButton
						className={classes.signOutButton}
						onClick={signOut}
						color="inherit">
						<InputIcon />
					</MC.IconButton>
				</MC.Grid>
			</MC.Grid>
		</div>
	);
};

Profile.propTypes = {
	className: PropTypes.string
};

export default inject("SignInStore")(observer(Profile));
