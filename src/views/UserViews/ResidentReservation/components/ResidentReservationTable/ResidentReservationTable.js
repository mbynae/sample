import React, { useEffect, useState } from "react";
import clsx                           from "clsx";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat }                    from "../../../../../components";
import { residentReservationRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:              {},
	tableHead:         {
		height:          50,
		minHeight:       50,
		maxHeight:       50,
		backgroundColor: "transparent"
	},
	body4:             {
		...theme.typography.body4,
		color:      "#ffffff",
		height:     24,
		lineHeight: "24px"
	},
	tableHeadCell:     {
		height:     "50px !important",
		fontWeight: "bold",
		color:      "#222222"
	},
	tableHeadCellFont: {
		fontSize:                       14,
		width:                          "15%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width:    "30%"
		}
	}
}));

const ResidentReservationTable = props => {
	const classes = useStyles();
	const { residentReservations, getResidentReservations, handleAlertToggle, setAlertOpens, residentReservationMgmt, residentReservationSlots, getRRTargets, setLastSelectDate, isMobile } = props;

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const init = () => {
			if ( residentReservationSlots ) {
				setIsLoading(false);
			} else {
				setIsLoading(true);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [residentReservationSlots]);

	const handleRowClick = (obj, beforeObj) => {

		if ( beforeObj ) {
			let date = moment(obj.residentFromDate).format("YYYY-MM-DD");
			let fromTime = moment(obj.residentFromDate).format("HH:mm");
			let toTime = moment(obj.residentToDate).format("HH:mm");

			let beforeDate = moment(beforeObj.residentFromDate).format("YYYY-MM-DD");
			let beforeFromTime = moment(beforeObj.residentFromDate).format("HH:mm");
			let beforeToTime = moment(beforeObj.residentToDate).format("HH:mm");

			handleAlertToggle(
				"isConfirmOpen",
				undefined,
				`기존 입주예약을 취소하고 변경된\n 입주예약시간으로 변경하시겠습니까?\n
				기존: ${beforeDate} ${beforeFromTime} ~ ${beforeToTime}\n변경: ${date} ${fromTime} ~ ${toTime}`,
				"변경",
				async () => {
					await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });

					residentReservationRepository
						.removeResidentReservation(beforeObj.id, true)
						.then(result => {
							residentReservationRepository
								.saveResidentReservation({
									residentReservationSlotId: obj.id
								}, true)
								.then(result => {
									handleAlertToggle(
										"isOpen",
										undefined,
										`기존 입주예약을 취소하고\n ${date} ${fromTime} ~ ${toTime}\n 입주예약 완료되었습니다.`,
										undefined,
										() => {
											getRRTargets(obj.residentFromDate);
											getResidentReservations(1, 10);
											setAlertOpens(prev => { return { ...prev, isOpen: false }; });
										}
									);
								});
						});
				},
				"취소",
				() => {
					setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				}
			);

		} else {
			let date = moment(obj.residentFromDate).format("YYYY-MM-DD");
			let fromTime = moment(obj.residentFromDate).format("HH:mm");
			let toTime = moment(obj.residentToDate).format("HH:mm");

			handleAlertToggle(
				"isConfirmOpen",
				undefined,
				`${date}\n ${fromTime} ~ ${toTime}\n 에 입주예약을 하시겠습니까?`,
				"확인",
				async () => {
					await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
					residentReservationRepository
						.saveResidentReservation({
							residentReservationSlotId: obj.id
						}, true)
						.then(result => {
							handleAlertToggle(
								"isOpen",
								undefined,
								`${date}\n ${fromTime} ~ ${toTime}\n 에 입주예약 완료되었습니다.`,
								undefined,
								() => {
									getRRTargets(obj.residentFromDate);
									getResidentReservations(1, 10);
									setAlertOpens(prev => { return { ...prev, isOpen: false }; });
								}
							);
						});
				},
				"취소",
				() => {
					setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				}
			);
		}

	};

	const objView = (obj, index) => {

		const isSame = residentReservations.filter(data => data.residentFromDate === obj.residentFromDate);

		return (
			<MC.TableRow key={obj.id}>

				{/*입주예약 시간*/}
				<MC.TableCell align={"left"}>
					<DateFormat date={obj.residentFromDate} format={"YYYY-MM-DD HH:mm"} />
					&nbsp;~&nbsp;
					<DateFormat date={obj.residentToDate} format={isMobile ? "HH:mm" : "YYYY-MM-DD HH:mm"} />
				</MC.TableCell>

				{/*예약*/}
				<MC.TableCell align={"center"}>
					{
						(obj.residentReservations.length >= residentReservationMgmt.reservationTotalCount
						 || isSame.length > 0) ?
							(
								<MC.Typography variant={"subtitle1"} style={{ color: "#bcbcbc" }}>
									예약불가
								</MC.Typography>
							)
							:
							(
								<MC.Link onClick={() => handleRowClick(obj, residentReservations[0])} style={{ cursor: "pointer", color: "#449CE8" }}>
									예약
								</MC.Link>
							)
					}
				</MC.TableCell>

			</MC.TableRow>
		);
	};

	return (
		<div className={classes.root}>

			{
				!isLoading &&
				<MC.Table style={{ marginTop: 16 }}>
					<MC.TableHead className={classes.tableHead}>
						<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
							<MC.TableCell className={clsx(classes.body4, classes.tableHeadCell)} align={"center"}>
								입주예약 시간
							</MC.TableCell>
							<MC.TableCell
								className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
								align={"center"}>
								예약
							</MC.TableCell>
						</MC.TableRow>
					</MC.TableHead>
					<MC.TableBody>
						{
							residentReservationSlots ?
								(
									residentReservationSlots.length === 0 ?
										<MC.TableRow>
											<MC.TableCell colSpan={2} align="center">
												입주가능일자를 선택하여 선택가능 시간을 확인해보세요.
											</MC.TableCell>
										</MC.TableRow>
										:
										residentReservationSlots.map(objView)
								)
								:
								<MC.TableRow>
									<MC.TableCell colSpan={2} align="center">
										<MC.CircularProgress color="secondary" />
									</MC.TableCell>
								</MC.TableRow>
						}
					</MC.TableBody>
				</MC.Table>
			}

		</div>
	);
};

export default ResidentReservationTable;