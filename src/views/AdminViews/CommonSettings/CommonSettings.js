import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import PropTypes from 'prop-types';
import * as MC												from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb }                                                       from "../../../components";
import { RefundPolicyMgnt, HolidaySetting, RegSchdSetting, UseGuideMgnt, AccessMgnt } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2),
		border: "1px solid #eeeeee"
	},
	tabBar:  {
		backgroundColor: "#fff",
		borderBottom: "1px solid #eeeeee"
	},
	contentHeader: {
		boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 10%), 0px 4px 5px 0px rgb(0 0 0 / 7%), 0px 1px 10px 0px rgb(0 0 0 / 7%)"
	}
}));

const CommonSettings = props => {
	const classes = useStyles();
	const { SignInStore } = props;
	const [value, setValue] = useState(0);
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `설정/관리`,
			href:  `${rootUrl}/commonSettings`
		}
	]);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const a11yProps = index => {
		return {
			id:              `tab-${index}`,
			"aria-controls": `tabpanel-${index}`
		};
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	function TabPanel(props) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<MC.Box
						p={0}
					>
						<div>{children}</div>
					</MC.Box>
				)}
			</div>
		);
	}

	TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.any.isRequired,
		value: PropTypes.any.isRequired,
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<div className={classes.content}>
				<MC.AppBar
					position="static"
					className={classes.contentHeader}
				>
					<MC.Tabs
						value={value}
						onChange={handleChange}
						aria-label="simple tabs example"
						className={classes.tabBar}
						textColor="primary">
						<MC.Tab label="출입설정" {...a11yProps(0)} />
						<MC.Tab label="휴일설정" {...a11yProps(1)} />
						<MC.Tab label="신청기간관리" {...a11yProps(2)} />
						<MC.Tab label="취소/환불규정" {...a11yProps(3)} />
						<MC.Tab label="예약이용안내관리" {...a11yProps(4)} />
					</MC.Tabs>
				</MC.AppBar>

				<TabPanel value={value} index={0}>
					<AccessMgnt
						history={props.history}
						menuKey={"accessSetting"}
						rootUrl={rootUrl}/>
				</TabPanel>

				<TabPanel value={value} index={1}>
					<HolidaySetting
						history={props.history}
						menuKey={"holidaySetting"}
						rootUrl={rootUrl}/>
				</TabPanel>

				<TabPanel value={value} index={2}>
					<RegSchdSetting
						history={props.history}
						menuKey={"regSchdSetting"}
						rootUrl={rootUrl}/>
				</TabPanel>

				<TabPanel value={value} index={3}>
					<RefundPolicyMgnt
						history={props.history}
						menuKey={"refundPolicyMgnt"}
						rootUrl={rootUrl}/>
				</TabPanel>

				<TabPanel value={value} index={4}>
					<UseGuideMgnt
						history={props.history}
						menuKey={"UseGuideMgnt"}
						rootUrl={rootUrl}/>
				</TabPanel>
			</div>

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(CommonSettings));
