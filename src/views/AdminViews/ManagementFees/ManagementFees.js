import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { ActiveLastBreadcrumb }    from "../../../components";
import { managementFeeRepository } from "../../../repositories";

import { ManagementFeesSearchBar, ManagementFeesTable, ReceivingInformationDialog } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const ManagementFees = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, ManagementFeeStore } = props;
	
	const [menuKey] = useState("managementFee");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `관리비 관리`,
			href:  `${rootUrl}/${menuKey}`
		}
	]);
	
	const [managementFees, setManagementFees] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  ManagementFeeStore.pageInfo.page,
		size:  ManagementFeeStore.pageInfo.size,
		total: ManagementFeeStore.pageInfo.total
	});
	const [riDialogOpen, setRIDialogOpen] = useState(false);
	
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
						title: `관리비 관리`,
						href:  `${rootUrl}/${menuKey}`
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
	
	const getManagementFees = async (page, size) => {
		let searchInfo = toJS(ManagementFeeStore.managementFeeSearch);
		let managementFeeSearch = {
			aptId: AptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.title ) {
			managementFeeSearch.title = searchInfo.title;
		}
		
		let findManagementFees = await managementFeeRepository.getManagementFees({
			...managementFeeSearch,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setManagementFees(findManagementFees.content);
		setPageInfo({
			page:  findManagementFees.pageable.page,
			size:  findManagementFees.pageable.size,
			total: findManagementFees.total
		});
		
		ManagementFeeStore.setPageInfo({
			page:  findManagementFees.pageable.page,
			size:  findManagementFees.pageable.size,
			total: findManagementFees.total
		});
	};
	
	const handleClickOpen = () => {
		setRIDialogOpen(true);
	};
	
	const handleClickClose = () => {
		setRIDialogOpen(false);
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<ManagementFeesSearchBar getManagementFees={getManagementFees} />
			<div className={classes.content}>
				<ManagementFeesTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					managementFees={managementFees}
					getManagementFees={getManagementFees}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
			
			<MC.Grid container style={{ marginTop: 10 }}>
				<MC.Grid item xs={12} md={12}>
					<MC.ButtonGroup
						aria-label="text primary button group"
						color="primary">
						<MC.Button onClick={handleClickOpen}>
							수납정보 관리
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
			
			<ReceivingInformationDialog
				contractTypes={null}
				setContractTypes={null}
				menuKey={menuKey}
				aptId={AptComplexStore.aptComplex.aptId}
				getContractTypes={null}
				open={riDialogOpen}
				onClose={handleClickClose}
			/>
		
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "ManagementFeeStore")(observer(ManagementFees));
