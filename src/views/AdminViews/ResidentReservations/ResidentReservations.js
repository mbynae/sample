import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { ActiveLastBreadcrumb }          from "../../../components";
import { residentReservationRepository } from "../../../repositories";

import { ResidentReservationsTable, ResidentReservationsSearchBar } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const ResidentReservations = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, ResidentReservationStore } = props;
	
	const [menuKey] = useState("residentReservation");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: "입주예약 관리",
			href:  `${rootUrl}/residentReservation`
		}
	]);
	
	const [residentReservations, setResidentReservations] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  ResidentReservationStore.pageInfo.page,
		size:  ResidentReservationStore.pageInfo.size,
		total: ResidentReservationStore.pageInfo.total
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
						title: "입주예약 관리",
						href:  `${rootUrl}/residentReservation`
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
	
	const getResidentReservations = async (page, size) => {
		let searchInfo = toJS(ResidentReservationStore.residentReservationSearch);
		let residentReservationSearch = {};
		
		residentReservationSearch.aptId = AptComplexStore.aptComplex.id;
		
		if ( searchInfo.building ) {
			residentReservationSearch.building = searchInfo.building;
		}
		
		if ( searchInfo.unit ) {
			residentReservationSearch.unit = searchInfo.unit;
		}
		
		if ( searchInfo.name ) {
			residentReservationSearch.name = searchInfo.name;
		}
		
		if ( searchInfo.phoneNumber ) {
			residentReservationSearch.phoneNumber = searchInfo.phoneNumber;
		}
		
		if ( searchInfo.isUseResidentReservationDate ) {
			residentReservationSearch.residentFromDate = new Date(moment(searchInfo.residentFromDate).format("YYYY-MM-DD HH:mm:ss"));
			residentReservationSearch.residentToDate = new Date(moment(searchInfo.residentToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		if ( searchInfo.isUseTimeType ) {
			residentReservationSearch.fromTimeType = searchInfo.fromTimeType;
			residentReservationSearch.toTimeType = searchInfo.toTimeType;
		}
		
		if ( searchInfo.isUseCreateDate ) {
			residentReservationSearch.isUseCreateDate = searchInfo.isUseCreateDate;
			residentReservationSearch.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
			residentReservationSearch.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		let findPreChecks = await residentReservationRepository.getResidentReservations({
			...residentReservationSearch,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setResidentReservations(findPreChecks.content);
		setPageInfo({
			page:  findPreChecks.pageable.page,
			size:  findPreChecks.pageable.size,
			total: findPreChecks.total
		});
		
		ResidentReservationStore.setPageInfo({
			page:  findPreChecks.pageable.page,
			size:  findPreChecks.pageable.size,
			total: findPreChecks.total
		});
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<ResidentReservationsSearchBar
				getResidentReservations={getResidentReservations} />
			<div className={classes.content}>
				<ResidentReservationsTable
					getResidentReservations={getResidentReservations}
					history={props.history}
					residentReservations={residentReservations}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					rootUrl={rootUrl} />
			</div>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "ResidentReservationStore")(observer(ResidentReservations));
