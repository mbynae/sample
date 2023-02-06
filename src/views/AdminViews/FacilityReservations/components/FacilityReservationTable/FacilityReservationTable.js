import React, { useEffect, useState } from "react";
import clsx                           from "clsx";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat }                    from "../../../../../components";
import { facilityReservationRepository } from "../../../../../repositories";

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
		width:                          "20%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width:    "30%"
		}
	}
}));

const FacilityReservationTable = props => {
	const classes = useStyles();
	const { facilityReservation, handleAlertToggle, setAlertOpens, facilityReservationMgmt, facilityReservationSlots, onClose } = props;

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const init = () => {
			if ( facilityReservationSlots ) {
				setIsLoading(false);
			} else {
				setIsLoading(true);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [facilityReservationSlots]);

	const handleRowClick = (obj, beforeObj) => {

		// if ( beforeObj ) {
		let date = moment(obj.reservationFromDate).format("YYYY-MM-DD");
		let fromTime = moment(obj.reservationFromDate).format("HH:mm");
		let toTime = moment(obj.reservationToDate).format("HH:mm");

		let beforeDate = moment(beforeObj.facilityReservationSlot.reservationFromDate).format("YYYY-MM-DD");
		let beforeFromTime = moment(beforeObj.facilityReservationSlot.reservationFromDate).format("HH:mm");
		let beforeToTime = moment(beforeObj.facilityReservationSlot.reservationToDate).format("HH:mm");

		handleAlertToggle(
			"isConfirmOpen",
			"예약 변경",
			`기존 시설예약을 취소하고 변경된\n 시설예약시간으로 변경하시겠습니까?\n
				기존: ${beforeDate} ${beforeFromTime} ~ ${beforeToTime}\n변경: ${date} ${fromTime} ~ ${toTime}`,
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });

				facilityReservationRepository
					.removeFacilityReservation(beforeObj.id)
					.then(result => {
						facilityReservationRepository
							.adminSaveFacilityReservation({
								facilityReservationSlotId: obj.id,
								bookerId:                  beforeObj.booker.id
							})
							.then(result => {
								handleAlertToggle(
									"isOpen",
									"변경 완료",
									`기존 시설예약을 취소하고\n ${date} ${fromTime} ~ ${toTime}\n 시설예약 완료되었습니다.`,
									() => {
										onClose();
										setAlertOpens(prev => { return { ...prev, isOpen: false }; });
									}
								);
							});
					});
			},
			() => {
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);
	};

	const objView = (obj, index) => {

		const isSame = facilityReservation.facilityReservationSlot.id === obj.id;

		return (
			<MC.TableRow key={obj.id}>

				{/*시설예약 시간*/}
				<MC.TableCell align={"left"}>
					<DateFormat date={obj.reservationFromDate} format={"YYYY-MM-DD HH:mm"} />
					&nbsp;~&nbsp;
					<DateFormat date={obj.reservationToDate} format={"YYYY-MM-DD HH:mm"} />
				</MC.TableCell>

				{/*예약*/}
				<MC.TableCell align={"center"}>
					{`${obj.facilityReservations.length}/${facilityReservationMgmt.reservationTotalCount}`}
				</MC.TableCell>

				{/*예약*/}
				<MC.TableCell align={"center"}>
					{
						(obj.facilityReservations.length >= facilityReservationMgmt.reservationTotalCount
						 || isSame) ?
							(
								<MC.Typography variant={"subtitle1"} style={{ color: "#bcbcbc" }}>
									예약불가
								</MC.Typography>
							)
							:
							(
								<MC.Link onClick={() => handleRowClick(obj, facilityReservation)} style={{ cursor: "pointer", color: "#449CE8" }}>
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
								시설예약 시간
							</MC.TableCell>
							<MC.TableCell
								className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
								align={"center"}>
								예약현황
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
							facilityReservationSlots ?
								(
									facilityReservationSlots.length === 0 ?
										<MC.TableRow>
											<MC.TableCell colSpan={3} align="center">
												예약가능일자를 선택하여 선택가능 시간을 확인해보세요.
											</MC.TableCell>
										</MC.TableRow>
										:
										facilityReservationSlots.map(objView)
								)
								:
								<MC.TableRow>
									<MC.TableCell colSpan={3} align="center">
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

export default FacilityReservationTable;
