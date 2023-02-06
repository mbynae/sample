import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb, AlertDialogUserView }                                                                                                from "../../../components";
import { residentReservationMgmtRepository, residentReservationRepository, residentReservationSlotRepository, residentReservationTargetRepository } from "../../../repositories";

import { MyResidentReservationBar, ResidentReservationCalendar, ResidentReservationTable } from "./components";
import moment                                                                              from "moment";

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

const ResidentReservation = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, ResidentReservationStore, history } = props;

	const [isLoading, setIsLoading] = useState(true);
	const [residentReservationMgmt, setResidentReservationMgmt] = useState();
	const [residentReservationSlots, setResidentReservationSlots] = useState([]);
	const [lastSelectDate, setLastSelectDate] = useState();

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

	const [residentReservations, setResidentReservations] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  ResidentReservationStore.pageInfo.page,
		size:  ResidentReservationStore.pageInfo.size,
		total: ResidentReservationStore.pageInfo.total
	});

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			getRRTargets();
		};
		setTimeout(async () => {
			await init();
		}, 100);
	}, []);

	const getResidentReservations = async (page = 1, size = 10) => {
		let searchParams = {
			aptId:    UserAptComplexStore.aptComplex.id,
			bookerId: UserSignInStore.currentUser.id
		};

		let findResidentReservations = await residentReservationRepository.getResidentReservations({
			...searchParams,
			direction: "DESC",
			page:      page - 1,
			size:      100000,
			sort:      "id"
		}, true);

		setResidentReservations(findResidentReservations.content);
		setPageInfo({
			page:  findResidentReservations.pageable.page + 1,
			size:  100000,
			total: findResidentReservations.total
		});

		ResidentReservationStore.setPageInfo({
			page:  findResidentReservations.pageable.page + 1,
			size:  100000,
			total: findResidentReservations.total
		});
	};

	const getRRTargets = async (lastSelectDate) => {
		setIsLoading(true);
		residentReservationTargetRepository
			.getResidentReservationTargets({
				aptId: UserAptComplexStore.aptComplex.id
			})
			.then(result => {
				let userDataType = toJS(UserSignInStore.currentUser).userDataType;
				let find = result.filter(obj => obj.building === userDataType.building && obj.unit === userDataType.unit);
				getRRMgmts(find[0].groups, lastSelectDate);
			});
	};

	const getRRMgmts = async (groups, lastSelectDate) => {
		residentReservationMgmtRepository
			.getResidentReservationMgmts({
				aptId: UserAptComplexStore.aptComplex.id
			}, true)
			.then(result => {
				let find = result.filter(obj => {
					return obj.targetGroups.includes(groups);
				});
				setResidentReservationMgmt(prev => {
					return find[0];
				});
				if ( lastSelectDate ) {
					setLastSelectDate(lastSelectDate);
					setResidentReservationSlots(findSlots(lastSelectDate, find[0]));
				}
				setIsLoading(false);
			});
	};

	const findSlots = (date, newResidentReservationMgmt) => {
		let nowDate = moment(date);
		if ( newResidentReservationMgmt ) {
			return newResidentReservationMgmt.residentReservationSlots.filter(obj => {
				let fromDate = moment(obj.residentFromDate).format("YYYY-MM-DD");
				return nowDate.isSame(fromDate, "day");
			});
		} else {
			return residentReservationMgmt.residentReservationSlots.filter(obj => {
				let fromDate = moment(obj.residentFromDate).format("YYYY-MM-DD");
				return nowDate.isSame(fromDate, "day");
			});
		}

	};

	return (
		<div className={classes.root}>

			{
				!isMobile &&
				<div className={classes.background} />
			}
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
											입주예약
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
						}

						<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 0 : 84 }}>
							<MyResidentReservationBar
								history={history}
								getResidentReservations={getResidentReservations}
								residentReservations={residentReservations}
								handleAlertToggle={handleAlertToggle}
								setAlertOpens={setAlertOpens}
								isMobile={isMobile} />
						</MC.Grid>

						<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 30 : 61, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
							<ResidentReservationCalendar
								residentReservationMgmt={residentReservationMgmt}
								findSlots={findSlots}
								lastSelectDate={lastSelectDate}
								setLastSelectDate={setLastSelectDate}
								setResidentReservationSlots={setResidentReservationSlots}
								isMobile={isMobile} />
						</MC.Grid>

						<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 30 : 61, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
							<ResidentReservationTable
								residentReservations={residentReservations}
								getRRTargets={getRRTargets}
								setLastSelectDate={setLastSelectDate}
								getResidentReservations={getResidentReservations}
								handleAlertToggle={handleAlertToggle}
								setAlertOpens={setAlertOpens}
								residentReservationMgmt={residentReservationMgmt}
								residentReservationSlots={residentReservationSlots}
								isMobile={isMobile} />
						</MC.Grid>
					</MC.Grid>

				</div>
			</MC.Grid>

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

export default inject("UserSignInStore", "UserAptComplexStore", "ResidentReservationStore")(observer(ResidentReservation));
