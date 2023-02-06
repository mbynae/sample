import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { ActiveLastBreadcrumb }                                                 from "../../../components";
import { contractRepository, maintenanceRepository, maintenanceTypeRepository } from "../../../repositories";
import { MaturityTypeKind }                                                     from "../../../enums";

import { MaintenancesSearchBar, MaintenancesTable, MaintenanceTypeDialog, MaturityDialog } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const Maintenances = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, MaintenanceStore } = props;
	
	const [menuKey] = useState("maintenance");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `시설물 안전관리`,
			href:  `${rootUrl}/maintenance`
		}
	]);
	
	const [contracts, setContracts] = useState([]);
	const [maintenances, setMaintenances] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  MaintenanceStore.pageInfo.page,
		size:  MaintenanceStore.pageInfo.size,
		total: MaintenanceStore.pageInfo.total
	});
	const [maintenanceTypes, setMaintenanceTypes] = useState([]);
	const [maintenanceTypeOpen, setMaintenanceTypeOpen] = useState(false);
	
	// 만기알림
	const [maturityOpen, setMaturityOpen] = useState(false);
	const [maturity, setMaturity] = useState({
		aptId:              AptComplexStore.aptComplex.id,
		endNotificationDay: 0,
		maturityTypeKind:   MaturityTypeKind.MAINTENANCE
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
						title: `시설물 안전관리`,
						href:  `${rootUrl}/maintenance`
					}
				];
				return [
					...prev
				];
			});
			await getMaintenanceTypes();
			await getContracts();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const getMaintenances = async (page, size) => {
		let searchInfo = toJS(MaintenanceStore.maintenanceSearch);
		
		let searchParams = {
			aptId: AptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.maintenanceTypeId && searchInfo.maintenanceTypeId !== "total" ) {
			searchParams.maintenanceTypeId = searchInfo.maintenanceTypeId;
		}
		
		if ( searchInfo.maintenanceTitle ) {
			searchParams.maintenanceTitle = searchInfo.maintenanceTitle;
		}
		
		if ( searchInfo.contractCompanyId && searchInfo.contractCompanyId !== "total" ) {
			searchParams.contractCompanyId = searchInfo.contractCompanyId;
		}
		
		if ( searchInfo.isUseInspectionDate ) {
			searchParams.isUseInspectionDate = searchInfo.isUseInspectionDate;
			searchParams.inspectionStartDate = new Date(moment(searchInfo.inspectionStartDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.inspectionEndDate = new Date(moment(searchInfo.inspectionEndDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		if ( searchInfo.isUseMaintenanceDate ) {
			searchParams.isUseMaintenanceDate = searchInfo.isUseMaintenanceDate;
			searchParams.maintenanceStartDate = new Date(moment(searchInfo.maintenanceStartDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.maintenanceEndDate = new Date(moment(searchInfo.maintenanceEndDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		if ( searchInfo.isUseCreateDate ) {
			searchParams.isUseCreateDate = searchInfo.isUseCreateDate;
			searchParams.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		let findMaintenances = await maintenanceRepository.getMaintenances({
			...searchParams,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setMaintenances(findMaintenances.content);
		setPageInfo({
			page:  findMaintenances.pageable.page,
			size:  findMaintenances.pageable.size,
			total: findMaintenances.total
		});
		
		MaintenanceStore.setPageInfo({
			page:  findMaintenances.pageable.page,
			size:  findMaintenances.pageable.size,
			total: findMaintenances.total
		});
	};
	
	const getMaintenanceTypes = async () => {
		let findMaintenanceTypes = await maintenanceTypeRepository
			.getMaintenanceTypes({
				aptId: AptComplexStore.aptComplex.id
			});
		
		setMaintenanceTypes(findMaintenanceTypes);
	};
	
	const getContracts = async () => {
		let findContracts = await contractRepository.getContracts({
			aptId:     AptComplexStore.aptComplex.id,
			direction: "DESC",
			page:      0,
			size:      100000,
			sort:      "baseDateDataType.createDate"
		});
		
		setContracts(findContracts.content);
	};
	
	const handleClickOpen = () => {
		setMaintenanceTypeOpen(true);
	};
	
	const handleClickClose = () => {
		setMaintenanceTypeOpen(false);
	};
	
	const handleClickOpenMaturity = () => {
		setMaturityOpen(true);
	};
	
	const handleClickCloseMaturity = () => {
		setMaturityOpen(false);
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			
			<MaintenancesSearchBar
				getMaintenances={getMaintenances}
				maintenanceTypes={maintenanceTypes}
				contracts={contracts} />
			
			<div className={classes.content}>
				<MaintenancesTable
					history={props.history}
					aptId={AptComplexStore.aptComplex.id}
					menuKey={menuKey}
					rootUrl={rootUrl}
					maintenances={maintenances}
					getMaintenances={getMaintenances}
					maintenanceTypes={maintenanceTypes}
					getMaintenanceTypes={getMaintenanceTypes}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
			
			<MC.Grid container style={{ marginTop: 10 }}>
				<MC.Grid item xs={12} md={12}>
					<MC.ButtonGroup
						aria-label="text primary button group"
						color="primary">
						<MC.Button onClick={handleClickOpen}>
							시설물 안전 종류 관리
						</MC.Button>
						<MC.Button onClick={handleClickOpenMaturity}>
							만기알림설정
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
			
			<MaintenanceTypeDialog
				maintenanceTypes={maintenanceTypes}
				setMaintenanceTypes={setMaintenanceTypes}
				menuKey={menuKey}
				aptId={AptComplexStore.aptComplex.id}
				getMaintenanceTypes={getMaintenanceTypes}
				open={maintenanceTypeOpen}
				onClose={handleClickClose}
			/>
			
			<MaturityDialog
				aptId={AptComplexStore.aptComplex.id}
				maturity={maturity}
				setMaturity={setMaturity}
				open={maturityOpen}
				onClose={handleClickCloseMaturity}
			/>
		
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "MaintenanceStore")(observer(Maintenances));
