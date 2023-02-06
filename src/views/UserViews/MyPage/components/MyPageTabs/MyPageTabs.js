import React from "react";
import { withRouter } from "react-router-dom";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const a11yProps = (index) => {
	return {
		id: `tab-${index}`,
		"aria-controls": `tabpanel-${index}`,
	};
};

const AntTabs = MS.withStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(1),
		width: "100%",
		"box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.04)",
	},
	scrollButtons: {
		color: "#222222",
	},
	indicator: {
		display: "flex",
		justifyContent: "center",
		backgroundColor: "transparent",
		// height:          4,
		"& > span": {
			// maxWidth:        "100%",
			// height:          4,
			width: "100%",
			backgroundColor: "#449CE8",
		},
	},
}))((props) => (
	<MC.Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

const AntTab = MS.withStyles((theme) => ({
	root: {
		textTransform: "none",
		fontSize: 18,
		minWidth: 72,
		color: "#bcbcbc",
		marginRight: theme.spacing(1),
		height: 60,
		"&:hover": {
			color: "#449CE8",
			opacity: 1,
		},
		"&$selected": {
			color: "#222222",
			fontSize: 18,
			fontWeight: theme.typography.fontWeightBold,
		},
		"&:focus": {
			color: "#222222",
		},
	},
	selected: {},
}))((props) => <MC.Tab {...props} />);

const useStyles = MS.makeStyles((theme) => ({
	root: {
		backgroundColor: theme.white,
	},
}));

const MyPageTabs = (props) => {
	const classes = useStyles();

	const { value, setValue, handleChange, homepageType, isMobile } = props;

	return (
		<div className={"lmsTabs"}>
			<MC.AppBar position="static" elevation={0}>
				<AntTabs
					value={value}
					onChange={handleChange}
					aria-label="simple tabs"
					classes={{
						scrollButtons: classes.scrollButtons,
					}}
					variant={isMobile ? "scrollable" : "fullWidth"}
					style={{ backgroundColor: "#fff" }}
					textColor="primary"
				>
					<AntTab label={`내 정보`} {...a11yProps(0)} />
					<AntTab label={`입주자카드`} {...a11yProps(1)} />
					<AntTab
						label={`관리비조회`}
						{...a11yProps(2)}
						// style={{
						// 	display: homepageType !== "CMMTY_TYPE" ? "block" : "none",
						// }}
					/>
					<AntTab
						label={`내가 쓴 글`}
						{...a11yProps(3)}
						style={{
							display: homepageType !== "CMMTY_TYPE" ? "block" : "none",
						}}
					/>
					<AntTab
						label={`예약내역`}
						{...a11yProps(4)}
						style={{
							display: homepageType !== "BASIC_TYPE" ? "block" : "none",
						}}
					/>
					<AntTab
						label={`취소내역`}
						{...a11yProps(5)}
						style={{
							display: homepageType !== "BASIC_TYPE" ? "block" : "none",
						}}
					/>
					<AntTab label={`쪽지함`} {...a11yProps(6)} />
				</AntTabs>
			</MC.AppBar>
		</div>
	);
};

export default withRouter(MyPageTabs);