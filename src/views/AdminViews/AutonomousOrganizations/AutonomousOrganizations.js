import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }                   from "../../../components";
import { autonomousOrganizationRepository } from "../../../repositories";

import { AutonomousOrganizationsSearchBar, AutonomousOrganizationsTable } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const AutonomousOrganizations = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, AutonomousOrganizationStore } = props;
	
	const [menuKey] = useState("autonomousOrganization");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `자치기구 관리`,
			href:  `${rootUrl}/autonomousOrganization`
		}
	]);
	
	const [autonomousOrganizations, setAutonomousOrganizations] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  AutonomousOrganizationStore.pageInfo.page,
		size:  AutonomousOrganizationStore.pageInfo.size,
		total: AutonomousOrganizationStore.pageInfo.total
	});
	
	
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
						title: `자치기구 관리`,
						href:  `${rootUrl}/autonomousOrganization`
					}
				];
				return [
					...prev
				];
			});
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const getAutonomousOrganizations = async (page, size) => {
		let searchInfo = toJS(AutonomousOrganizationStore.autonomousOrganizationSearch);
		let autonomousOrganizationSearch = {
			aptId: AptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.name ) {
			autonomousOrganizationSearch.name = searchInfo.name;
		}
		
		let findAutonomousOrganizations = await autonomousOrganizationRepository.getAutonomousOrganizations({
			...autonomousOrganizationSearch,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "sequence"
		});
		
		setAutonomousOrganizations(findAutonomousOrganizations.content);
		setPageInfo({
			page:  findAutonomousOrganizations.pageable.page,
			size:  findAutonomousOrganizations.pageable.size,
			total: findAutonomousOrganizations.total
		});
		
		AutonomousOrganizationStore.setPageInfo({
			page:  findAutonomousOrganizations.pageable.page,
			size:  findAutonomousOrganizations.pageable.size,
			total: findAutonomousOrganizations.total
		});
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<AutonomousOrganizationsSearchBar getAutonomousOrganizations={getAutonomousOrganizations} />
			<div className={classes.content}>
				<AutonomousOrganizationsTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					autonomousOrganizations={autonomousOrganizations}
					getAutonomousOrganizations={getAutonomousOrganizations}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "AutonomousOrganizationStore")(observer(AutonomousOrganizations));
