import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }     from "../../../components";
import { preCheckDetailRepository } from "../../../repositories";

import { PreCheckDetailsTable, PreCheckDetailsSearchBar, PreCheckInfoDialog } from "./components";
import * as MC                                                                from "@material-ui/core";
import { ReceivingInformationDialog }                                         from "../ManagementFees/components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const PreCheckDetails = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, PreCheckDetailStore } = props;
	
	const [menuKey] = useState("preCheck");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: "사전점검 관리",
			href:  `${rootUrl}/preCheck`
		}
	]);
	
	const [preCheckDetails, setPreCheckDetails] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  PreCheckDetailStore.pageInfo.page,
		size:  PreCheckDetailStore.pageInfo.size,
		total: PreCheckDetailStore.pageInfo.total
	});
	const [preCheckInfoDialogOpen, setPreCheckInfoDialogOpen] = useState(false);
	
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
						title: "사전점검 관리",
						href:  `${rootUrl}/preCheck`
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
	
	const getPreCheckDetails = async (page, size) => {
		let searchInfo = toJS(PreCheckDetailStore.preCheckDetailSearch);
		let preCheckDetailSearch = {};
		
		preCheckDetailSearch.aptId = AptComplexStore.aptComplex.id;
		
		if ( searchInfo.building ) {
			preCheckDetailSearch.building = searchInfo.building;
		}
		
		if ( searchInfo.unit ) {
			preCheckDetailSearch.unit = searchInfo.unit;
		}
		
		if ( searchInfo.name ) {
			preCheckDetailSearch.name = searchInfo.name;
		}
		
		if ( searchInfo.phoneNumber ) {
			preCheckDetailSearch.phoneNumber = searchInfo.phoneNumber;
		}
		
		if ( searchInfo.isCheck !== "total" ) {
			preCheckDetailSearch.isCheck = searchInfo.isCheck;
		}
		
		if ( searchInfo.isPreCheckDate ) {
			preCheckDetailSearch.isPreCheckDate = searchInfo.isPreCheckDate;
			preCheckDetailSearch.preCheckFromDate = new Date(moment(searchInfo.preCheckFromDate).format("YYYY-MM-DD HH:mm:ss"));
			preCheckDetailSearch.preCheckToDate = new Date(moment(searchInfo.preCheckToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		if ( searchInfo.isUseCreateDate ) {
			preCheckDetailSearch.isUseCreateDate = searchInfo.isUseCreateDate;
			preCheckDetailSearch.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
			preCheckDetailSearch.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		let findPreChecks = await preCheckDetailRepository.getPreCheckDetails({
			...preCheckDetailSearch,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setPreCheckDetails(findPreChecks.content);
		setPageInfo({
			page:  findPreChecks.pageable.page,
			size:  findPreChecks.pageable.size,
			total: findPreChecks.total
		});
		
		PreCheckDetailStore.setPageInfo({
			page:  findPreChecks.pageable.page,
			size:  findPreChecks.pageable.size,
			total: findPreChecks.total
		});
	};
	
	const handleClickOpen = () => {
		setPreCheckInfoDialogOpen(true);
	};
	
	const handleClickClose = () => {
		setPreCheckInfoDialogOpen(false);
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<PreCheckDetailsSearchBar getPreCheckDetails={getPreCheckDetails} />
			<div className={classes.content}>
				<PreCheckDetailsTable
					getPreCheckDetails={getPreCheckDetails}
					history={props.history}
					preCheckDetails={preCheckDetails}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					rootUrl={rootUrl} />
			</div>
			
			<MC.Grid container style={{ marginTop: 10 }}>
				<MC.Grid item xs={12} md={12}>
					<MC.ButtonGroup
						aria-label="text primary button group"
						color="primary">
						<MC.Button onClick={handleClickOpen}>
							사전점검 안내
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
			
			<PreCheckInfoDialog
				aptId={AptComplexStore.aptComplex.id}
				open={preCheckInfoDialogOpen}
				onClose={handleClickClose}
			/>
		
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "PreCheckDetailStore")(observer(PreCheckDetails));
