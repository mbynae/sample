import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb }             from "../../../components";
import { autonomousOrganizationRepository } from "../../../repositories";

import { SalesMgntsSearchBar, SalesMgntsTable } from "./components";
import * as MC                                  from "@material-ui/core";

const useStyles = MS.makeStyles(theme => ({
	// ------- 현재 사용 안함 ------- //
	// root:    {
	// 	padding: theme.spacing(3)
	// },
	// content: {
	// 	marginTop: theme.spacing(2)
	// }
	root: {},
	content: {
		padding: 0
	},
	image: {
		textAlign: "center",
		display: "",
		justifyContent: "center",
		alignItems: "center",
		margin: "auto",
		width: "100%",
		height: "630px",
		paddingTop: "10%"
	}
}));

const SalesMgnt = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore } = props;

	const [menuKey] = useState("salesMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `매출 관리`,
			href:  `${rootUrl}/salesMgnt`
		}
	]);

	const [salesMgnts, setSalesMgnts] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		// page:  SalesMgntStore.pageInfo.page,
		// size:  SalesMgntStore.pageInfo.size,
		// total: SalesMgntStore.pageInfo.total
	});
	const [aoList, setAOList] = useState([]);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let rootUrl = await generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `매출 관리`,
						href:  `${rootUrl}/salesMgnt`
					}
				];
				return [
					...prev
				];
			});
			await getAOList();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getSalesMgnts = async (page, size) => {

	};

	const getAOList = async () => {
		let findAOList = await autonomousOrganizationRepository.getAutonomousOrganizations({
			aptId:     AptComplexStore.aptComplex.id,
			direction: "ASC",
			page:      0,
			size:      100000,
			sort:      "sequence"
		});

		setAOList(findAOList.content);
	};

	return (
		// ------- 현재 사용 안함 ------- //
		// <div className={classes.root}>
		// 	<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
		//
		// 	<SalesMgntsSearchBar
		// 		getSalesMgnts={getSalesMgnts}
		// 		aoList={aoList} />
		//
		// 	<div className={classes.content}>
		// 		<SalesMgntsTable
		// 			history={props.history}
		// 			menuKey={menuKey}
		// 			rootUrl={rootUrl}
		// 			salesMgnts={salesMgnts}
		// 			getSalesMgnts={getSalesMgnts}
		// 			pageInfo={pageInfo}
		// 			setPageInfo={setPageInfo} />
		// 	</div>
		//
		// </div>

		<MC.CardContent className={classes.content} >
			<div className={classes.image} >
				<img src={"/images/dashboard/preparingPage.png"} alt={"preparingPage"} />
			</div>
		</MC.CardContent>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(SalesMgnt));
