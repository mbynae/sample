import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MS from "@material-ui/styles";

// import { ActiveLastBreadcrumb }  from "../../../components";
import { parkingMgntRepository } from "../../../repositories";

import { ParkingCarMgntSearchBar, ParkingCarMgntTable } from "./components";
import moment                                           from "moment";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: 0
	},
	content: {
		marginTop: 0
	}
}));

const ParkingCarMgnt = props => {
	const classes = useStyles();
	const { SignInStore, ParkingCarMgntStore, history } = props;

	const [menuKey] = useState("parkingCarMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	// const [breadcrumbs, setBreadcrumbs] = useState([
	// 	{
	// 		title: "관리자",
	// 		href:  `${rootUrl}/dashboard`
	// 	},
	// 	{
	// 		title: `주차차량 관리`,
	// 		href:  `${rootUrl}/parkingCarMgnt`
	// 	}
	// ]);

	const [parkingCars, setParkingCars] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  ParkingCarMgntStore.pageInfo.page,
		size:  ParkingCarMgntStore.pageInfo.size,
		total: ParkingCarMgntStore.pageInfo.total
	});

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			// await setBreadcrumbs(prev => {
			// 	prev = [
			// 		{
			// 			title: "관리자",
			// 			href:  `${rootUrl}/dashboard`
			// 		},
			// 		{
			// 			title: `주차차량 관리`,
			// 			href:  `${rootUrl}/parkingCarMgnt`
			// 		}
			// 	];
			// 	return [
			// 		...prev
			// 	];
			// });
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getParkingCars = async (page, size) => {

		let searchInfo = toJS(ParkingCarMgntStore.parkingCarsSearch)

		let searchParams = {};
		searchParams.dong_numb =  searchInfo.dong_numb;
		searchParams.ho_numb = searchInfo.ho_numb;
		searchParams.strt_date = moment(searchInfo.strt_date).format('YYYY-MM-DD HH:mm:ss');
		searchParams.end_date = moment(searchInfo.end_date).format('YYYY-MM-DD HH:mm:ss');
		searchParams.car_numb = searchInfo.car_numb;
		searchParams.park_type = searchInfo.park_type;

		let findVisitingCars = await parkingMgntRepository.getParkingReservationList({
			...searchParams,
			sort: "DESC",
			page: page ? page : 0,
			size: size ? size : 10
		});

		setParkingCars(findVisitingCars.data_json_array);
		setPageInfo({
			page:  findVisitingCars.paginginfo.page,
			size:  findVisitingCars.paginginfo.size,
			total: findVisitingCars.paginginfo.total
		});

		ParkingCarMgntStore.setPageInfo({
			page:  findVisitingCars.paginginfo.page,
			size:  findVisitingCars.paginginfo.size,
			total: findVisitingCars.paginginfo.total
		});

		setIsLoading(false);
	}

	return (
		<div className={classes.root}>
			{/*<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />*/}
			<ParkingCarMgntSearchBar getParkingCars={getParkingCars} />

			<div className={classes.content}>
				<ParkingCarMgntTable
					history={history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					parkingCars={parkingCars}
					getParkingCars={getParkingCars}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);

}

export default inject("SignInStore", "ParkingCarMgntStore")(observer(ParkingCarMgnt));
