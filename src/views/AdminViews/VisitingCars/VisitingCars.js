import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }  from "../../../components";
import { visitingCarMgntRepository } from "../../../repositories";

import { VisitingCarsSearchBar, VisitingCarsTable } from "./components";
import moment                                       from "moment";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const VisitingCars = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, VisitingCarStore } = props;

	const [menuKey] = useState("visitingCar");
	const [rootUrl, setRootUrl] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `방문차량예약 관리`,
			href:  `${rootUrl}/visitingCar`
		}
	]);

	const [visitingCars, setVisitingCars] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  VisitingCarStore.pageInfo.page,
		size:  VisitingCarStore.pageInfo.size,
		total: VisitingCarStore.pageInfo.total
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
						title: `방문차량예약 관리`,
						href:  `${rootUrl}/visitingCar`
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

	const getVisitingCars = async (page, size) => {
		let searchInfo = toJS(VisitingCarStore.visitingCarSearch);

		let searchParams = {};

		searchParams.dong_numb = searchInfo.building;
		searchParams.ho_numb = searchInfo.unit;
		searchParams.park_strt_dttm = moment(searchInfo.visitFromDate).format('YYYY-MM-DD HH:mm:ss');
		searchParams.park_end_dttm = moment(searchInfo.visitToDate).format('YYYY-MM-DD HH:mm:ss');
		searchParams.use_at = searchInfo.stateCheckbox;

		let findVisitingCars = await visitingCarMgntRepository.getParkingReservationList({
			...searchParams,
			sort: 		 "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10
		});

		setVisitingCars(findVisitingCars.data_json_array);
		setPageInfo({
			page:  findVisitingCars.paginginfo.page,
			size:  findVisitingCars.paginginfo.size,
			total: findVisitingCars.paginginfo.total
		});

		VisitingCarStore.setPageInfo({
			page:  findVisitingCars.paginginfo.page,
			size:  findVisitingCars.paginginfo.size,
			total: findVisitingCars.paginginfo.total
		});

		await setIsLoading(false);
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<VisitingCarsSearchBar getVisitingCars={getVisitingCars} />
			<div className={classes.content}>
				<VisitingCarsTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					visitingCars={visitingCars}
					getVisitingCars={getVisitingCars}
					pageInfo={pageInfo}
					isLoading={isLoading}
					setPageInfo={setPageInfo}
				/>
			</div>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "VisitingCarStore")(observer(VisitingCars));
