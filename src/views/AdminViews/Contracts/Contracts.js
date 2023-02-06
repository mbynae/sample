import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb }                                           from "../../../components";
import { contractRepository, contractTypeRepository, maturityRepository } from "../../../repositories";

import { ContractsSearchBar, ContractsTable, ContractTypeDialog, MaturityDialog } from "./components";
import * as MC                                                                    from "@material-ui/core";
import { MaturityTypeKind }                                                       from "../../../enums";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const Contracts = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, ContractStore } = props;
	
	const [menuKey] = useState("contract");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `계약서 관리`,
			href:  `${rootUrl}/contract`
		}
	]);
	
	const [contracts, setContracts] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  ContractStore.pageInfo.page,
		size:  ContractStore.pageInfo.size,
		total: ContractStore.pageInfo.total
	});
	const [contractTypes, setContractTypes] = useState([]);
	const [contractTypeOpen, setContractTypeOpen] = useState(false);
	
	// 만기알림
	const [maturityOpen, setMaturityOpen] = useState(false);
	const [maturity, setMaturity] = useState({
		aptId:              AptComplexStore.aptComplex.id,
		endNotificationDay: 0,
		maturityTypeKind:   MaturityTypeKind.CONTRACT
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
						title: `계약서 관리`,
						href:  `${rootUrl}/contract`
					}
				];
				return [
					...prev
				];
			});
			await getContractTypes();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const getContracts = async (page, size) => {
		let searchInfo = toJS(ContractStore.contractSearch);
		
		let searchParams = {
			aptId: AptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.contractTypeKind && searchInfo.contractTypeKind !== "total" ) {
			searchParams.contractTypeKind = searchInfo.contractTypeKind;
		}
		
		if ( searchInfo.contractTypeId && searchInfo.contractTypeId !== "total" ) {
			searchParams.contractTypeId = searchInfo.contractTypeId;
		}
		
		if ( searchInfo.companyName ) {
			searchParams.companyName = searchInfo.companyName;
		}
		
		if ( searchInfo.isUseContractDate ) {
			searchParams.isUseContractDate = searchInfo.isUseContractDate;
			searchParams.contractStartDate = new Date(moment(searchInfo.contractStartDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.contractEndDate = new Date(moment(searchInfo.contractEndDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		if ( searchInfo.isUseCreateDate ) {
			searchParams.isUseCreateDate = searchInfo.isUseCreateDate;
			searchParams.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		let findContracts = await contractRepository.getContracts({
			...searchParams,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setContracts(findContracts.content);
		setPageInfo({
			page:  findContracts.pageable.page,
			size:  findContracts.pageable.size,
			total: findContracts.total
		});
		
		ContractStore.setPageInfo({
			page:  findContracts.pageable.page,
			size:  findContracts.pageable.size,
			total: findContracts.total
		});
		
		getMaturity(AptComplexStore.aptComplex.id);
	};
	
	const getMaturity = (id) => {
		maturityRepository.getMaturity({
			aptId:            id,
			maturityTypeKind: MaturityTypeKind.CONTRACT
		}).then(result => {
			setMaturity({
				aptId:              result.aptComplex.id,
				endNotificationDay: result.endNotificationDay,
				maturityTypeKind:   result.maturityTypeKind
			});
		});
	};
	
	const getContractTypes = async () => {
		let findContractTypes = await contractTypeRepository
			.getContractTypes({
				aptId: AptComplexStore.aptComplex.id
			});
		
		setContractTypes(findContractTypes);
	};
	
	const handleClickOpen = () => {
		setContractTypeOpen(true);
	};
	
	const handleClickClose = () => {
		setContractTypeOpen(false);
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
			
			<ContractsSearchBar
				getContracts={getContracts}
				contractTypes={contractTypes} />
			
			<div className={classes.content}>
				<ContractsTable
					history={props.history}
					menuKey={menuKey}
					aptId={AptComplexStore.aptComplex.id}
					rootUrl={rootUrl}
					contracts={contracts}
					getContracts={getContracts}
					contractTypes={contractTypes}
					getContractTypes={getContractTypes}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
			
			<MC.Grid container style={{ marginTop: 10 }}>
				<MC.Grid item xs={12} md={12}>
					<MC.ButtonGroup
						aria-label="text primary button group"
						color="primary">
						<MC.Button onClick={handleClickOpen}>
							계약종류 관리
						</MC.Button>
						<MC.Button onClick={handleClickOpenMaturity}>
							만기알림설정
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
			
			<ContractTypeDialog
				contractTypes={contractTypes}
				setContractTypes={setContractTypes}
				menuKey={menuKey}
				aptId={AptComplexStore.aptComplex.id}
				getContractTypes={getContractTypes}
				open={contractTypeOpen}
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

export default inject("SignInStore", "AptComplexStore", "ContractStore")(observer(Contracts));
