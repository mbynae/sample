import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, PhoneHyphen, TablePaginationActions } from "../../../../../components";
import { FacilityMgmtTabs }                                             from "../../components";
import palette                                                          from "../../../../../theme/adminTheme/palette";
import { facilityReservationRepository, residentReservationRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:          {},
	content:       {
		padding: 0
	},
	inner:         {
		minWidth: 1530
	},
	nameContainer: {
		display:    "flex",
		alignItems: "center"
	},
	actions:       {
		padding:        theme.spacing(1),
		paddingLeft:    theme.spacing(2),
		paddingRight:   theme.spacing(2),
		justifyContent: "space-between"
	},
	errorButton:   {
		color:                  theme.palette.error.main,
		borderColor:            theme.palette.error.main,
		marginLeft:             10,
		borderTopLeftRadius:    4,
		borderBottomLeftRadius: 4
	}
}));

const FacilityReservationsTable = props => {
	const classes = useStyles();
	const { rootUrl, getFacilityReservations, facilityReservations, facilityMgmts, pageInfo, setPageInfo, handleClickOpenFacilityReservationEdit } = props;
	
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};
	
	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getFacilityReservations(page, pageInfo.size);
	};
	
	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getFacilityReservations(0, event.target.value);
	};
	
	const handleRowClick = (obj) => {
		// history.push(`${rootUrl}/facilityReservations/` + obj.id);
	};
	
	const removeFR = (obj) => {
		handleAlertToggle(
			"isConfirmOpen",
			"???????????? ?????? ??????",
			"???????????? ????????? ????????? ?????? ???????????? ????????? ?????????. \n ????????? ???????????? ????????? ??????????????????????",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				facilityReservationRepository
					.removeFacilityReservation(obj.id)
					.then(result => {
						console.log(result);
						handleAlertToggle(
							"isOpen",
							"????????????",
							"???????????? ????????? ?????? ???????????????.",
							() => {
								getFacilityReservations(0, pageInfo.size);
								setAlertOpens({ ...alertOpens, isOpen: false });
							}
						);
					});
			},
			() => {
				// ???????????????
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};
	
	const slice = () => (0, pageInfo.size);
	
	const objView = (obj, index) => (
		<MC.TableRow
			className={classes.tableRow}
			hover
			key={obj.id}>
			
			{/*????????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.reservationFromDate} format={"YYYY.MM.DD HH:mm"} />
				~
				<DateFormat date={obj.reservationToDate} format={"HH:mm"} />
			</MC.TableCell>
			
			{/*???/???*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{`${obj.building}??? ${obj.unit}???`}
			</MC.TableCell>
			
			{/*??????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.name}
			</MC.TableCell>
			
			{/*???????????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{PhoneHyphen(obj.phoneNumber)}
			</MC.TableCell>
			
			{/*????????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.createDate} />
			</MC.TableCell>
			
			{/*????????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<MC.Button
					variant="outlined"
					color="primary"
					onClick={() => handleClickOpenFacilityReservationEdit(obj)}>
					??????
				</MC.Button>
			</MC.TableCell>
			
			{/*??????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<MC.Button
					variant="outlined"
					className={classes.errorButton}
					onClick={() => removeFR(obj)}>
					??????
				</MC.Button>
			</MC.TableCell>
		
		</MC.TableRow>
	);
	
	return (
		<MC.Card className={classes.root}>
			
			<MC.CardHeader
				title={"???????????? ???????????? ??????"}
				subheader={
					<>
						??? {pageInfo.total} ???
					</>
				}
				titleTypographyProps={{ variant: "h4" }}
			/>
			
			<FacilityMgmtTabs
				facilityMgmts={facilityMgmts}
				getFacilityReservations={getFacilityReservations}
			/>
			
			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>????????????</MC.TableCell>
									<MC.TableCell align={"center"}>???/???</MC.TableCell>
									<MC.TableCell align={"center"}>??????</MC.TableCell>
									<MC.TableCell align={"center"}>???????????????</MC.TableCell>
									<MC.TableCell align={"center"}>????????????</MC.TableCell>
									<MC.TableCell align={"center"} style={{ width: "10%" }}>????????????</MC.TableCell>
									<MC.TableCell align={"center"} style={{ width: "10%" }}>??????</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									facilityReservations ?
										(
											facilityReservations.length === 0 ?
												<MC.TableRow
													className={classes.tableRow}
													hover>
													<MC.TableCell colSpan={7} align="center">
														????????? ???????????? ???????????? ???????????? ??? ?????? ?????????.
													</MC.TableCell>
												</MC.TableRow>
												:
												facilityReservations.slice(slice).map(objView)
										)
										:
										<MC.TableRow
											className={classes.tableRow}
											hover>
											<MC.TableCell colSpan={7} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
								}
							</MC.TableBody>
						
						</MC.Table>
					</div>
				</PerfectScrollbar>
			</MC.CardContent>
			
			<MC.Divider />
			<MC.CardActions className={classes.actions}>
				<MC.Grid
					container
					justify={"space-between"}
					alignItems={"center"}>
					<MC.Grid item>
					</MC.Grid>
					<MC.Grid item>
						<MC.TablePagination
							component="div"
							count={pageInfo.total}
							labelDisplayedRows={({ from, to, count }) => "??? " + count + " ??? / " + from + " ~ " + (to === -1 ? count : to)}
							labelRowsPerPage={"???????????? ?????? ??? : "}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
							ActionsComponent={TablePaginationActions}
							page={pageInfo.page}
							rowsPerPage={pageInfo.size}
							rowsPerPageOptions={[10, 15, 30, 50, 100]} />
					</MC.Grid>
				</MC.Grid>
			</MC.CardActions>
			
			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>
			
			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>
		
		</MC.Card>
	);
	
};

export default FacilityReservationsTable;
