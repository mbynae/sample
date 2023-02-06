import * as MS                        from "@material-ui/styles";
import * as MC                        from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import PropTypes                      from "prop-types";
import { ActiveLastBreadcrumb }       from "../../../components";
import {
	CarsInfo,
	ParkinglotInfo,
	ParkingControlInfo
}                                     from "./components";
import ParkingCarMgnt                 from "../ParkingCarMgnt";

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

const PreferencesMgnt = props => {

	const classes = useStyles();
	const { SignInStore, history } = props;

	const [rootUrl, setRootUrl] = useState("");
	const [value, setValue] = useState(0); // 탭 Value
	const breadcrumbs = [
		{
			title: "관리자",
			href: `${rootUrl}/dashboard`
		},
		{
			title: `환경설정`,
			href: `${rootUrl}/commonSettings`
		}
	];

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
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

	// 탭 Props
	const a11yProps = index => {
		return {
			id:              `tab-${index}`,
			"aria-controls": `tabpanel-${index}`
		};
	};

	// 탭 Change Handler
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// 탭 Render
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
						<MC.Tab label="차량 정보" {...a11yProps(0)} />
						<MC.Tab label="주차장 정보" {...a11yProps(1)} />
						<MC.Tab label="주차관제 설정" {...a11yProps(2)} />

					</MC.Tabs>
				</MC.AppBar>

				{/* 차량 정보 */}
				<TabPanel value={value} index={0}>
					{/*<CarsInfo />*/}
					<ParkingCarMgnt
						history={history}
					/>
				</TabPanel>

				{/* 주차장 정보 */}
				<TabPanel value={value} index={1}>
					<ParkinglotInfo />
				</TabPanel>

				{/* 주차관제 설정 */}
				<TabPanel value={value} index={2}>
					<ParkingControlInfo />
				</TabPanel>
			</div>

		</div>
	)

}

export default inject("SignInStore")(observer(PreferencesMgnt));
