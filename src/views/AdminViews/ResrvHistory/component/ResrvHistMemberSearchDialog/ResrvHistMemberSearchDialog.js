import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { resrvHistRepository } from "../../../../../repositories";
import { AlertDialog, TablePaginationActions }    from "../../../../../components";
import palette                                    from "../../../../../theme/adminTheme/palette";
import { autorun, toJS }                          from "mobx";
import PerfectScrollbar                           from "react-perfect-scrollbar";
import { inject, observer }                       from "mobx-react";
import { withRouter }                             from "react-router-dom";
import ResrvHistAssignDialog                      from "../ResrvHistAssignDialog";

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
	contractTypesLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:              {
		margin: theme.spacing(1)
	},
	listItemLayout:      {
		paddingRight: 96
	}


}));

const ResrvHistMemberSearchDialog = props => {

	const classes = useStyles();
	const { open, onClose } = props;
	const [ selectedObjects, setSelectedObjects ] = useState([]);
	const [ pageInfo, setPageInfo ] = useState({});

	const [selectedMember, setSelectedMember] = useState({});

	let [searchInfo, setSearchInfo] = useState("");
	let [resrvHists, setResrvHists] = useState({});
	let [scroll, setScroll] = useState("paper");

	const handleChange = async (event) => {
		setSearchInfo(event.target.value);
	};

	const handleSelectOne = (event, obj) => {

		let newSelectedObjects = [obj];
		setSelectedObjects(newSelectedObjects);

		setSelectedMember({
			id : newSelectedObjects.length == 0 ? "" : newSelectedObjects[0].id,
			name : newSelectedObjects.length == 0 ? "" : newSelectedObjects[0].name,
			memb_numb : newSelectedObjects.length == 0 ? "" : newSelectedObjects[0].memb_numb,
			phonenumber : newSelectedObjects.length == 0 ? "" : newSelectedObjects[0].phonenumber,
		});
	}

	const handleAssignMember = (event) => {
		const resrvHistoryMemberSearchAdmins = resrvHistRepository.getUserMgnts(searchInfo);

		resrvHistoryMemberSearchAdmins.then((data) => {
			setResrvHists(data.data_json_array);
			setPageInfo({
				page:  data.paginginfo.page,
				size:  data.paginginfo.size,
				total: data.paginginfo.total
			});
		});
	}

	const handleClose = () => {
		onClose(selectedMember);
	};

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
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
	};

	const slice = () => (0, pageInfo.size);

	// Component -------------------------------------------------------------------------------------------------------
	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>
			{/* ???????????? ?????? */}
			<MC.TableCell align={"center"} padding={"checkbox"} style={{width:"5%"}}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true}
				/>
			</MC.TableCell>
			{/* ???????????? ??? */}

			{/* ????????? ?????? */}
			<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
				{obj.id}
			</MC.TableCell>
			{/* ????????? ??? */}

			{/* ?????? ?????? */}
			<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
				{obj.name}
			</MC.TableCell>
			{/* ?????? ??? */}

			{/* ??????????????? ?????? */}
			<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
				{obj.phonenumber}
			</MC.TableCell>
			{/* ??????????????? ??? */}
		</MC.TableRow>
	)


	return (
		<div className={classes.root}>
			<MC.Dialog
				open={open}
				onClose={handleClose}
				disableBackdropClick={true}
				scroll={scroll}
				aria-labelledby="form-contractType-dialog-title">
				<MC.DialogTitle id="form-contractType-dialog-title">
					{/*<MC.Typography variant={"h4"}>*/}
					????????? ??????
					{/*</MC.Typography>*/}
				</MC.DialogTitle>
				<MC.DialogContent dividers={scroll === "paper"}>

					<MC.Grid container spacing={1}>
						<MC.Grid item xs={12} md={12}>
							<div className={classes.contractTypesLayout}>

								<MC.TextField
									style={{width : "65%"}}
									id="title-basic"
									name="title"
									label="?????? ?????? ????????? ??????"
									placeholder="????????? ????????? ??????????????????."
									value={searchInfo}
									onChange={handleChange} />
								<MC.Button
									style={{
										width : "30%",
										color: palette.primary.main,
										borderColor: palette.primary.main,
										marginLeft: 10,
										borderTopLeftRadius: 4,
										borderBottomLeftRadius: 4,
										backgroundColor: "#A9BCF5"
									}}
									onClick={() => handleAssignMember()}>????????? ??????</MC.Button>
							</div>
						</MC.Grid>
						<MC.Divider />
						<MC.Grid item xs={12} md={12}>
							<MC.CardContent className={classes.content}>

								<MC.Table size="small">
									{/* ????????? ?????? ?????? */}
									<MC.TableHead>
										<MC.TableRow>
											<MC.TableCell align={"center"}>
											</MC.TableCell>
											<MC.TableCell align={"center"}>?????????</MC.TableCell>
											<MC.TableCell align={"center"}>??????</MC.TableCell>
											<MC.TableCell align={"center"}>?????????</MC.TableCell>
										</MC.TableRow>
									</MC.TableHead>
									{/* ????????? ?????? ??? */}

									{/* ????????? ?????? ?????? */}
									<MC.TableBody>
										{
											resrvHists ?
												(
													resrvHists.length === 0 || resrvHists.length == undefined ?
														<MC.TableRow hover>
															<MC.TableCell colSpan={9} align="center">
																????????? ?????? ???????????? ??? ?????? ?????????.
															</MC.TableCell>
														</MC.TableRow>
														:
														resrvHists.slice(slice).map((item, index) => objView(item, index))
												)
												:
												<MC.TableRow hover>
													<MC.TableCell colSpan={9} align="center">
														<MC.CircularProgress color="secondary"/>
													</MC.TableCell>
												</MC.TableRow>
										}
									</MC.TableBody>
									{/* ????????? ?????? ??? */}
								</MC.Table>

							</MC.CardContent>
						</MC.Grid>
						<MC.Divider/>
						<MC.CardActions className={classes.actions}>
							<MC.Grid container justify={"space-between"} alignItems={"center"}>
								<MC.Grid item>

								</MC.Grid>
								<MC.Grid item>
									<MC.TablePagination
										component="div"
										count={pageInfo.total === undefined? 0 : pageInfo.total}
										labelDisplayedRows={({ from, to, count }) => "??? " + count + " ??? / " + from + " ~ " + (to === -1 ? count : to)}
										labelRowsPerPage={"???????????? ?????? ??? : "}
										onChangePage={handlePageChange}
										onChangeRowsPerPage={handleRowsPerPageChange}
										ActionsComponent={TablePaginationActions}
										page={pageInfo.page === undefined? 1 : pageInfo.page}
										rowsPerPage={pageInfo.size === undefined? 0 : pageInfo.size}
										rowsPerPageOptions={[5]}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.CardActions>
					</MC.Grid>

				</MC.DialogContent>
				<MC.DialogActions>
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={handleClose}>
						??????
					</MC.Button>
					<MC.Button onClick={onClose}>
						??????
					</MC.Button>
				</MC.DialogActions>

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
			</MC.Dialog>
		</div>
	);
};

export default inject("UserMgntStore", "AptComplexStore")(withRouter(observer(ResrvHistMemberSearchDialog)));
