import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb, AlertDialogUserView } from "../../../components";
import { visitingCarRepository, categoryRepository } from "../../../repositories";

import { VisitingCarsSearchBar, VisitingCarsTable } from "./components";
import moment                                       from "moment";

const useStyles = MS.makeStyles(theme => ({
	root:       {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background: {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          245,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:    {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		maxWidth:                       "1180px",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	layout:     {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width:                          "100%",
		paddingTop:                     73,
		paddingBottom:                  80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			padding:       0,
			paddingTop:    0,
			paddingBottom: 80
		}
	}
}));

const VisitingCars = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, VisitingCarStore } = props;

	const [isLoading, setIsLoading] = useState(true);
	const [menuKey] = useState("visitingCar");
	const [rootUrl, setRootUrl] = useState("");

	// const [breadcrumbs, setBreadcrumbs] = useState([
	// 	{
	// 		title: "관리자",
	// 		href:  `${rootUrl}/dashboard`
	// 	},
	// 	{
	// 		title: `방문차량예약 관리`,
	// 		href:  `${rootUrl}/visitingCar`
	// 	}
	// ]);

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		noTitle:       "",
		yesTitle:      "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle(),
		isOpenType:    false,
		type:          ""
	});
	const handleAlertToggle = (key, title, content, yesTitle, yesCallback, noTitle, noCallback, type) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					noTitle,
					yesTitle,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback(),
					type
				};
			}
		);
	};

	const [visitingCars, setVisitingCars] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  VisitingCarStore.pageInfo.page,
		size:  VisitingCarStore.pageInfo.size,
		total: VisitingCarStore.pageInfo.total
	});

	const [categories, setCategories] = useState([]);

	const generateRootUrl = async () => {
		let rootUrl = `/${UserSignInStore.aptId}${UserSignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let rootUrl = await generateRootUrl();
			await getCategories();
			setIsLoading(false);
		};
		setTimeout(async () => {
			await init();
		}, 100);
	}, []);

	const sort = (a, b) => a.sequence - b.sequence;

	const getCategories = async () => {
		let searchParams = {
			aptId:   UserAptComplexStore.aptComplex.id,
			menuKey: menuKey
		};
		const categories = await categoryRepository.getCategories(searchParams, true);
		setCategories(categories.sort(sort));
	};

	const getVisitingCars = async (page = 1, size = 10) => {
		let searchInfo = toJS(VisitingCarStore.visitingCarSearch);
		let searchParams = {
			//aptId: UserAptComplexStore.aptComplex.id ---- PAST
		};

		searchParams.car_numb = searchInfo.carNumber;
		searchParams.park_strt_dttm = moment(searchInfo.visitFromDate).format('YYYY-MM-DD HH:mm:ss');
		searchParams.park_end_dttm = moment(searchInfo.visitToDate).format('YYYY-MM-DD HH:mm:ss');

		//--------------------NOT USE---------------------//
		// if ( searchInfo.carNumber ) {
		// 	searchParams.carNumber = searchInfo.carNumber;
		// }

		// searchParams.visitFromDate = new Date(moment(searchInfo.visitFromDate).format("YYYY-MM-DD HH:mm:ss"));
		// searchParams.visitToDate = new Date(moment(searchInfo.visitToDate).format("YYYY-MM-DD HH:mm:ss"));
		//
		// searchParams.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
		// searchParams.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));

		// let findVisitingCars = await visitingCarRepository.getVisitingCars({
		// 	...searchParams,
		// 	direction: "DESC",
		// 	page:      page - 1,
		// 	size:      size,
		// 	sort:      "id"
		// }, true);

		let findVisitingCars = await visitingCarRepository.getParkingReservationList({
			...searchParams,
				direction: "DESC",
				page:      page - 1,
				size:      size
		}, true);

		setVisitingCars(findVisitingCars.data_json_array);
		setPageInfo({
			page:  findVisitingCars.paginginfo.page + 1,
			size:  findVisitingCars.paginginfo.size,
			total: findVisitingCars.paginginfo.total
		});

		VisitingCarStore.setPageInfo({
			page:  findVisitingCars.paginginfo.page + 1,
			size:  findVisitingCars.paginginfo.size,
			total: findVisitingCars.paginginfo.total
		});
	};

	return (
		<div className={classes.root}>

			{
				!isMobile &&
				<div className={classes.background} />
			}
			{
				!isLoading &&
				<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
				         className={classes.content}>
					<div className={classes.layout}>

						<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>

							{/*<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />*/}

							{
								!isMobile &&
								<MC.Grid item style={{ width: "100%" }}>
									<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
										<MC.Grid item>
											<MC.Typography variant="h3">
												방문차량예약
											</MC.Typography>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							}

							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 0 : 84 }}>
								<VisitingCarsSearchBar
									getVisitingCars={getVisitingCars}
									isMobile={isMobile} />
							</MC.Grid>

							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 30 : 61, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
								<VisitingCarsTable
									isMobile={isMobile}
									VisitingCarStore={VisitingCarStore}
									history={props.history}
									menuKey={menuKey}
									rootUrl={rootUrl}
									visitingCars={visitingCars}
									getVisitingCars={getVisitingCars}
									categories={categories}
									pageInfo={pageInfo}
									setPageInfo={setPageInfo}
									handleAlertToggle={handleAlertToggle}
									setAlertOpens={setAlertOpens} />
							</MC.Grid>

						</MC.Grid>

					</div>
				</MC.Grid>
			}

			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
				noTitle={alertOpens.noTitle}
				yesTitle={alertOpens.yesTitle}
			/>

		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore", "VisitingCarStore")(observer(VisitingCars));
