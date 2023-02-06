import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }  from "../../../components";
import { moveReservationRepository } from "../../../repositories";

import { MoveReservationsSearchBar, MoveReservationsTable } from "./components";
import moment                                       from "moment";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const MoveReservations = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, MoveReservationStore } = props;

	const [menuKey] = useState("moveReservation");
	const [rootUrl, setRootUrl] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `이사예약 관리`,
			href:  `${rootUrl}/moveReservation`
		}
	]);

	const [moveReservations, setMoveReservations] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  MoveReservationStore.pageInfo.page,
		size:  MoveReservationStore.pageInfo.size,
		total: MoveReservationStore.pageInfo.total
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
						title: `이사예약 관리`,
						href:  `${rootUrl}/moveReservation`
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

	const sort = (a, b) => a.sequence - b.sequence;

	const getMoveReservations = async (page, size) => {
		let searchInfo = toJS(MoveReservationStore.moveReservationSearch);

		let searchParams = {};

		searchParams.dong_numb = searchInfo.dong_numb;
		searchParams.ho_numb = searchInfo.ho_numb;

		let findMoveReservations = await moveReservationRepository.getMoveReservationList({
			...searchParams,
			sort: 		 "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10
		});

		setMoveReservations(findMoveReservations.data_json_array);
		setPageInfo({
			page:  findMoveReservations.paginginfo.page,
			size:  findMoveReservations.paginginfo.size,
			total: findMoveReservations.paginginfo.total
		});

		MoveReservationStore.setPageInfo({
			page:  findMoveReservations.paginginfo.page,
			size:  findMoveReservations.paginginfo.size,
			total: findMoveReservations.paginginfo.total
		});

		await setIsLoading(false);
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<MoveReservationsSearchBar getMoveReservations={getMoveReservations} />
			<div className={classes.content}>
				<MoveReservationsTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					moveReservations={moveReservations}
					getMoveReservations={getMoveReservations}
					AptComplexStore={AptComplexStore}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "MoveReservationStore")(observer(MoveReservations));
