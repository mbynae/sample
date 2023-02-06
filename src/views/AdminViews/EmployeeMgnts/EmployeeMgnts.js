import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb, AlertDialog }                                        from "../../../components";
import { departmentRepository, employeeMgntRepository, officialPositionRepository } from "../../../repositories";

import { EmployeeMgntsSearchBar, EmployeeMgntsTable, DepartmentDialog, OfficialPositionDialog } from "./components";
import * as MC                                                                                  from "@material-ui/core";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const EmployeeMgnts = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, EmployeeMgntStore } = props;
	
	const [menuKey] = useState("employeeMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `직원 관리`,
			href:  `${rootUrl}/employeeMgnt`
		}
	]);
	
	const [employeeMgnts, setEmployeeMgnts] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  EmployeeMgntStore.pageInfo.page,
		size:  EmployeeMgntStore.pageInfo.size,
		total: EmployeeMgntStore.pageInfo.total
	});
	const [departments, setDepartments] = useState([]);
	const [officialPositions, setOfficialPositions] = useState([]);
	const [departmentOpen, setDepartmentOpen] = useState(false);
	const [officialPositionOpen, setOfficialPositionOpen] = useState(false);
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
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
						title: `직원 관리`,
						href:  `${rootUrl}/employeeMgnt`
					}
				];
				return [
					...prev
				];
			});
			await getDepartments();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const getEmployeeMgnts = async (page, size) => {
		let searchInfo = toJS(EmployeeMgntStore.employeeMgntSearch);
		
		let searchParams = {
			aptId: AptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.departmentId && searchInfo.departmentId !== "total" ) {
			searchParams.departmentId = searchInfo.departmentId;
		}
		
		if ( searchInfo.officialPositionId && searchInfo.officialPositionId !== "total" ) {
			searchParams.officialPositionId = searchInfo.officialPositionId;
		}
		
		if ( searchInfo.name ) {
			searchParams.name = searchInfo.name;
		}
		
		if ( searchInfo.phoneNumber ) {
			searchParams.phoneNumber = searchInfo.phoneNumber;
		}
		
		if ( searchInfo.callNumber ) {
			searchParams.callNumber = searchInfo.callNumber;
		}
		
		if ( searchInfo.isUseCreateDate ) {
			searchParams.isUseCreateDate = searchInfo.isUseCreateDate;
			searchParams.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		let findEmployeeMgnts = await employeeMgntRepository.getEmployeeMgnts({
			...searchParams,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setEmployeeMgnts(findEmployeeMgnts.content);
		setPageInfo({
			page:  findEmployeeMgnts.pageable.page,
			size:  findEmployeeMgnts.pageable.size,
			total: findEmployeeMgnts.total
		});
		
		EmployeeMgntStore.setPageInfo({
			page:  findEmployeeMgnts.pageable.page,
			size:  findEmployeeMgnts.pageable.size,
			total: findEmployeeMgnts.total
		});
	};
	
	const getDepartments = async () => {
		let findDepartments = await departmentRepository
			.getDepartments({
				aptId: AptComplexStore.aptComplex.id
			});
		
		setDepartments(findDepartments);
	};
	
	const getOfficialPositions = async (departmentId) => {
		let findOfficialPositions = await officialPositionRepository
			.getOfficialPositions({
				departmentId: departmentId
			});
		
		setOfficialPositions(findOfficialPositions);
	};
	
	const handleClickDepartmentOpen = () => {
		setDepartmentOpen(true);
	};
	
	const handleClickDepartmentClose = () => {
		setDepartmentOpen(false);
	};
	
	const handleClickOfficialPositionOpen = () => {
		if ( departments && departments.length > 0 ) {
			setOfficialPositionOpen(true);
		} else {
			handleAlertToggle(
				"isOpen",
				"부서 등록 필요",
				"부서를 먼저 등록 하셔야 합니다. 부서를 먼저 등록 해주세요.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		}
	};
	
	const handleClickOfficialPositionClose = () => {
		setOfficialPositionOpen(false);
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			
			<EmployeeMgntsSearchBar
				getEmployeeMgnts={getEmployeeMgnts}
				departments={departments}
				officialPositions={officialPositions}
				setOfficialPositions={setOfficialPositions}
				getOfficialPositions={getOfficialPositions} />
			
			<div className={classes.content}>
				<EmployeeMgntsTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					aptId={AptComplexStore.aptComplex.id}
					employeeMgnts={employeeMgnts}
					getEmployeeMgnts={getEmployeeMgnts}
					departments={departments}
					getDepartments={getDepartments}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
			
			<MC.Grid container style={{ marginTop: 10 }}>
				<MC.Grid item xs={12} md={12}>
					<MC.ButtonGroup
						aria-label="text primary button group"
						color="primary">
						<MC.Button onClick={handleClickDepartmentOpen}>
							부서 관리
						</MC.Button>
						<MC.Button onClick={handleClickOfficialPositionOpen}>
							직책 관리
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
			
			<DepartmentDialog
				departments={departments}
				setDepartments={setDepartments}
				menuKey={menuKey}
				aptId={AptComplexStore.aptComplex.id}
				getDepartments={getDepartments}
				open={departmentOpen}
				onClose={handleClickDepartmentClose}
			/>
			
			<OfficialPositionDialog
				officialPositions={officialPositions}
				setOfficialPositions={setOfficialPositions}
				menuKey={menuKey}
				aptId={AptComplexStore.aptComplex.id}
				departments={departments}
				getOfficialPositions={getOfficialPositions}
				open={officialPositionOpen}
				onClose={handleClickOfficialPositionClose}
			/>
			
			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>
			
			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>
		
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "EmployeeMgntStore")(observer(EmployeeMgnts));
