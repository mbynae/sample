import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, TablePaginationActions } from "../../../../../components";
import palette                                             from "../../../../../theme/adminTheme/palette";
import { maintenanceRepository }                           from "../../../../../repositories";

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
	}
}));

const MaintenancesTable = props => {
	const classes = useStyles();
	const { className, history, aptId, menuKey, rootUrl, maintenances, getMaintenances, maintenanceTypes, getMaintenanceTypes, pageInfo, setPageInfo, staticContext, ...rest } = props;

	const [selectedObjects, setSelectedObjects] = useState([]);

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

	const handleSelectAll = event => {
		let selectedList;
		event.target.checked ? selectedList = maintenances.map(maintenance => maintenance) : selectedList = [];
		setSelectedObjects(selectedList);
	};

	const handleSelectOne = (event, selectedObject) => {
		const selectedIndex = selectedObjects.indexOf(selectedObject);
		let newSelectedObjects = [];

		if ( selectedIndex === -1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects, selectedObject);
		} else if ( selectedIndex === 0 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if ( selectedIndex === selectedObjects.length - 1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
		} else if ( selectedIndex > 0 ) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}

		setSelectedObjects(newSelectedObjects);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getMaintenances(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getMaintenances(0, event.target.value);
	};

	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/maintenance/${obj.id}`);
	};

	const removeObject = async (id) => {
		return maintenanceRepository.removeMaintenance(id, { aptId: aptId });
	};

	const handleDeleteAllClick = async () => {
		// ????????? ???????????? ?????? ??? ??????
		handleAlertToggle(
			"isConfirmOpen",
			"????????? ???????????? ?????? ??????",
			"???????????? ????????? ???????????? ????????? ????????? ?????? ???????????? ????????? ?????????. \n ????????? ????????? ???????????? ????????? ??????????????????????",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				await selectedObjects.map(async (obj) => {
					await removeObject(obj.id);
				});
				handleAlertToggle(
					"isOpen",
					"????????????",
					"????????? ?????? ????????? ?????? ???????????????.",
					() => {
						setSelectedObjects([]);
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
				await getMaintenances(pageInfo.page, pageInfo.size);
			},
			() => {
				// ???????????????
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	const handleOpenRegisterPage = event => {
		if ( maintenanceTypes.length === 0 ) {
			handleAlertToggle(
				"isOpen",
				"?????????????????? ?????? ??????",
				"????????????????????? ?????? ????????? ???????????????. ????????????????????? ?????? ?????? ????????????.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			history.push(`${rootUrl}/maintenance/edit`);
		}
	};

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.id}>

			{/*????????????*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>

			{/*??????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.maintenanceTypeName}
			</MC.TableCell>

			{/*?????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.maintenanceTitle}
			</MC.TableCell>

			{/*????????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.inspectionStartDate}
				            format={"YYYY.MM.DD"} />
				&nbsp; ~ &nbsp;
				<DateFormat date={obj.inspectionEndDate}
				            format={"YYYY.MM.DD"} />
			</MC.TableCell>

			{/*???????????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.contractCompanyName}
			</MC.TableCell>

			{/*?????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{
					!!(obj.maintenanceStartDate) ?
						(
							<>
								<DateFormat date={obj.maintenanceStartDate}
								            format={"YYYY.MM.DD"} />
								&nbsp; ~ &nbsp;
								<DateFormat date={obj.maintenanceEndDate}
								            format={"YYYY.MM.DD"} />
							</>
						)
						:
						("-")
				}
			</MC.TableCell>

			{/*?????????*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.createDate} format={"YYYY-MM-DD"} />
			</MC.TableCell>

		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"????????? ???????????? ??????"}
				subheader={
					<>
						??? {pageInfo.total} ???
					</>
				}
				titleTypographyProps={{ variant: "h4" }}
				action={
					<MC.ButtonGroup
						aria-label="text primary button group"
						style={{ marginTop: 12 }}
						color="primary">
						<MC.Button
							disabled={selectedObjects.length === 0}
							style={{
								color:                  selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.error.main,
								borderColor:            selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.12)" : palette.error.main,
								marginLeft:             10,
								borderTopLeftRadius:    4,
								borderBottomLeftRadius: 4
							}}
							onClick={handleDeleteAllClick}>
							??????
						</MC.Button>
					</MC.ButtonGroup>
				} />

			<MC.Divider />

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"} padding={"checkbox"}>
										<MC.Checkbox
											checked={
												maintenances ?
													(maintenances.length === 0 ? false : selectedObjects.length === maintenances.length) : false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0
												&& selectedObjects.length < (maintenances ? maintenances.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>??????</MC.TableCell>
									<MC.TableCell align={"center"}>?????????</MC.TableCell>
									<MC.TableCell align={"center"}>????????????</MC.TableCell>
									<MC.TableCell align={"center"}>???????????????</MC.TableCell>
									<MC.TableCell align={"center"}>?????????</MC.TableCell>
									<MC.TableCell align={"center"}>?????????</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									maintenances ?
										(
											maintenances.length === 0 ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={7} align="center">
														????????? ????????? ???????????? ???????????? ??? ?????? ?????????.
													</MC.TableCell>
												</MC.TableRow>
												:
												maintenances.slice(slice).map(objView)
										)
										:
										<MC.TableRow hover>
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
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button
								onClick={handleOpenRegisterPage}>
								??????
							</MC.Button>
						</MC.ButtonGroup>
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

export default MaintenancesTable;
