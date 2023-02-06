import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }                                                   from "../../../components";
import { facilityReservationRepository, boardRepository, facilityMgmtRepository } from "../../../repositories";

import { FacilityReservationsSearchBar, FacilityReservationsTable, FacilityMgmtsDialog, FacilityMgmtEditDialog, FacilityMgmtDetailDialog, FacilityReservationEditDialog } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const FacilityReservations = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, FacilityReservationStore, match } = props;
	
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `커뮤니티 시설예약 관리`,
			href:  `${rootUrl}/facilityReservation`
		}
	]);
	
	const [facilityReservations, setFacilityReservations] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  FacilityReservationStore.pageInfo.page,
		size:  FacilityReservationStore.pageInfo.size,
		total: FacilityReservationStore.pageInfo.total
	});
	
	const [facilityMgmts, setFacilityMgmts] = useState([]);
	const [facilityMgmtsOpen, setFacilityMgmtsOpen] = useState(false);
	const [facilityMgmtEditOpen, setFacilityMgmtEditOpen] = useState(false);
	const [facilityReservationEditOpen, setFacilityReservationEditOpen] = useState(false);
	const [selectedFacilityMgmtId, setSelectedFacilityMgmtId] = useState("");
	const [selectedFacilityReservationId, setSelectedFacilityReservationId] = useState();
	
	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
			await setRootUrl(rootUrl);
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `커뮤니티 시설예약 관리`,
						href:  `${rootUrl}/facilityReservation`
					}
				];
				return [
					...prev
				];
			});
			await getFacilityMgmts();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const setAptId = (obj) => {
		obj.aptId = AptComplexStore.aptComplex.id;
	};
	
	const getFacilityMgmts = async () => {
		let searchParams = {};
		setAptId(searchParams);
		const facilityMgmts = await facilityMgmtRepository.getFacilityMgmts(searchParams);
		setFacilityMgmts(facilityMgmts);
	};
	
	const getFacilityReservations = async (page = 0, size = 10) => {
		let searchInfo = toJS(FacilityReservationStore.facilityReservationSearch);
		let facilityReservationSearch = {};
		
		setAptId(facilityReservationSearch);
		
		if ( searchInfo.facilityMgmtId ) {
			facilityReservationSearch.facilityMgmtId = searchInfo.facilityMgmtId;
		}
		
		if ( searchInfo.building ) {
			facilityReservationSearch.building = searchInfo.building;
		}
		
		if ( searchInfo.unit ) {
			facilityReservationSearch.unit = searchInfo.unit;
		}
		
		if ( searchInfo.name ) {
			facilityReservationSearch.name = searchInfo.name;
		}
		
		if ( searchInfo.phoneNumber ) {
			facilityReservationSearch.phoneNumber = searchInfo.phoneNumber;
		}
		
		if ( searchInfo.isUseReservationDate ) {
			facilityReservationSearch.reservationFromDate = new Date(moment(searchInfo.reservationFromDate).format("YYYY-MM-DD HH:mm:ss"));
			facilityReservationSearch.reservationToDate = new Date(moment(searchInfo.reservationToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		if ( searchInfo.isUseCreateDate ) {
			facilityReservationSearch.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
			facilityReservationSearch.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		let findFacilityReservations = await facilityReservationRepository.getFacilityReservations({
			...facilityReservationSearch,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setFacilityReservations(findFacilityReservations.content);
		setPageInfo({
			page:  findFacilityReservations.pageable.page,
			size:  findFacilityReservations.pageable.size,
			total: findFacilityReservations.total
		});
		
		FacilityReservationStore.setPageInfo({
			page:  findFacilityReservations.pageable.page,
			size:  findFacilityReservations.pageable.size,
			total: findFacilityReservations.total
		});
	};
	
	const handleClickOpenFacilityMgmts = () => {
		setFacilityMgmtsOpen(true);
	};
	
	const handleClickCloseFacilityMgmts = () => {
		setFacilityMgmtsOpen(false);
	};
	
	const handleClickOpenFacilityReservationEdit = (obj) => {
		setSelectedFacilityReservationId(obj.id);
		setFacilityReservationEditOpen(true);
	};
	
	const handleClickCloseFacilityReservationEdit = () => {
		getFacilityReservations();
		setFacilityReservationEditOpen(false);
	};
	
	const handleClickOpenFacilityMgmtEdit = (id) => {
		if ( id ) {
			setSelectedFacilityMgmtId(id);
		} else {
			setSelectedFacilityMgmtId(undefined);
		}
		setFacilityMgmtEditOpen(true);
	};
	
	const handleClickCloseFacilityMgmtEdit = () => {
		getFacilityMgmts();
		setFacilityMgmtEditOpen(false);
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<FacilityReservationsSearchBar
				getFacilityReservations={getFacilityReservations} />
			<div className={classes.content}>
				<FacilityReservationsTable
					rootUrl={rootUrl}
					getFacilityReservations={getFacilityReservations}
					history={props.history}
					facilityReservations={facilityReservations}
					facilityMgmts={facilityMgmts}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					handleClickOpenFacilityReservationEdit={handleClickOpenFacilityReservationEdit} />
			</div>
			
			<MC.Grid container style={{ marginTop: 10 }}>
				<MC.Grid item xs={12} md={12}>
					<MC.ButtonGroup
						aria-label="text primary button group"
						color="primary">
						<MC.Button onClick={handleClickOpenFacilityMgmts}>
							시설 관리
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
			
			<FacilityMgmtsDialog
				facilityMgmts={facilityMgmts}
				setFacilityMgmts={setFacilityMgmts}
				aptId={AptComplexStore.aptComplex.id}
				getFacilityMgmts={getFacilityMgmts}
				open={facilityMgmtsOpen}
				onClose={handleClickCloseFacilityMgmts}
				editOpen={handleClickOpenFacilityMgmtEdit}
				setSelectedFacilityMgmtId={setSelectedFacilityMgmtId}
			/>
			
			<FacilityMgmtEditDialog
				open={facilityMgmtEditOpen}
				aptId={AptComplexStore.aptComplex.id}
				id={selectedFacilityMgmtId || undefined}
				onClose={handleClickCloseFacilityMgmtEdit}
			/>
			
			<FacilityReservationEditDialog
				open={facilityReservationEditOpen}
				id={selectedFacilityReservationId || undefined}
				onClose={handleClickCloseFacilityReservationEdit} />
		
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "FacilityReservationStore")(observer(FacilityReservations));
