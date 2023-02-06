import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb, AlertDialogUserView }                            from "../../../components";
import { moveReservationRepository } 																						from "../../../repositories";
import { MoveReservationBar, MoveReservationEdit }                              from "./components";
import moment                                                                   from "moment";


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

const MoveReservation = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, history } = props;

	const [isLoading, setIsLoading] = useState(false);
	const [lastSelectDate, setLastSelectDate] = useState();

	const [myMoveReservations, setMyMoveReservations] = useState([]);

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

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			getMyMoveReservation();
		};
		setTimeout(async () => {
			await init();
		}, 100);
	}, []);

	const getMyMoveReservation = async () => {

		let findMoveReservations = await moveReservationRepository.getMoveReservationList({},true);

		// 예약 상태 2020 : 예약 진행중, 예약 상태 2030: 예약 완료, 예약 상태 2090 : 예약 취소
		setMyMoveReservations(findMoveReservations.data_json_array.filter(item => item.rsvt_stat == "2020" || item.rsvt_stat == "2030" || item.rsvt_stat == "2090"));
	};

	return (
		<div className={classes.root}>
			{
				!isMobile &&
				<div className={classes.background} />
			}
			{
				!isLoading &&
				<>
					<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
									 className={classes.content}>
						<div className={classes.layout}>
							<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
								{
									!isMobile &&
									<MC.Grid item style={{ width: "100%" }}>
										<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
											<MC.Grid item>
												<MC.Typography variant="h3">
													이사예약
												</MC.Typography>
											</MC.Grid>
										</MC.Grid>
										<MoveReservationBar
											myMoveReservations={myMoveReservations}
											getMyMoveReservation={getMyMoveReservation}
											handleAlertToggle={handleAlertToggle}
											alertOpens={alertOpens}
											setAlertOpens={setAlertOpens}
											isMobile={isMobile}
										/>
									</MC.Grid>
								}
								{
									isMobile &&
									<MoveReservationBar
										handleAlertToggle={handleAlertToggle}
										alertOpens={alertOpens}
										setAlertOpens={setAlertOpens}
										isMobile={isMobile}
										myMoveReservations={myMoveReservations}
										getMyMoveReservation={getMyMoveReservation}
									/>
								}

								<MC.Grid item style={{
									width: "100%",
									marginTop: isMobile ? 30 : 0,
									paddingLeft: isMobile ? 16 : 0,
									paddingRight: isMobile ? 16 : 0
								}}>
									<MoveReservationEdit
										myMoveReservations={myMoveReservations}
										setLastSelectDate={setLastSelectDate}
										getMyMoveReservation={getMyMoveReservation}
										handleAlertToggle={handleAlertToggle}
										setAlertOpens={setAlertOpens}
										history={history}
										isMobile={isMobile}/>
								</MC.Grid>

							</MC.Grid>

						</div>
					</MC.Grid>
				</>
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

export default inject("UserSignInStore", "UserAptComplexStore", "ResidentReservationStore")(observer(MoveReservation));
