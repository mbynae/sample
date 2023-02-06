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

const ResrvModifySearchDialog = props => {

	const classes = useStyles();
	const { open, onClose, selectedObject } = props;
	const [ pageInfo, setPageInfo ] = useState({});

	let [objects, setObjects] = useState({});
	let [searchInfo, setSearchInfo] = useState("");
	let [resrvHists, setResrvHists] = useState({});
	let [scroll, setScroll] = useState("paper");



	const handleClose = () => {
		onClose(objects);
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

	const slice = () => (0, pageInfo.size);

	// Component -------------------------------------------------------------------------------------------------------
	const objView = (obj) => (
		<MC.Table>
			<MC.TableHead></MC.TableHead>
			<MC.TableBody>
				<MC.TableRow>
					<MC.TableCell>상품 : {obj.prgm_name}{console.log(obj)}</MC.TableCell>
				</MC.TableRow>
				<MC.TableRow>
					<MC.TableCell>기간 : {obj.prgm_strt_date} - {obj.prgm_end_date}</MC.TableCell>
				</MC.TableRow>
				<MC.TableRow>
					<MC.TableCell>환불 정보 : {obj.rfnd_info}</MC.TableCell>
				</MC.TableRow>
				<MC.TableRow>
					<MC.TableCell>환불 결과 : {obj.rfnd_stat_name}</MC.TableCell>
				</MC.TableRow>
				<MC.TableRow>
					<MC.TableCell>취소/변경일자 : {obj.rfnd_dttm}</MC.TableCell>
				</MC.TableRow>
				<MC.TableRow>
					<MC.TableCell>환불금액  : {obj.rfnd_amt}</MC.TableCell>
				</MC.TableRow>
			</MC.TableBody>
		</MC.Table>
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
					취소/변경내역 상세
					{/*</MC.Typography>*/}
				</MC.DialogTitle>
				<MC.DialogContent dividers={scroll === "paper"}>

					<MC.Grid container spacing={1}>
						<MC.Divider />
						<MC.Grid item xs={12} md={12}>
							<MC.CardContent className={classes.content}>
								<PerfectScrollbar>
									<div className={classes.inner}>
										<MC.TableContainer>
										{
											selectedObject ? (
												selectedObject.length === 0 || selectedObject.length == undefined?
														<MC.Table>
															<MC.TableHead></MC.TableHead>
															<MC.TableBody>
																<MC.TableRow>
																	<MC.TableCell>상품 : </MC.TableCell>
																	<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
																	</MC.TableCell>
																</MC.TableRow>
																<MC.TableRow>
																	<MC.TableCell>기간 : </MC.TableCell>
																	<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
																</MC.TableCell>
																</MC.TableRow>
																<MC.TableRow>
																	<MC.TableCell>금액 : </MC.TableCell>
																	<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
																	</MC.TableCell>
																</MC.TableRow>
																<MC.TableRow>
																	<MC.TableCell>구분 : </MC.TableCell>
																	<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
																	</MC.TableCell>
																</MC.TableRow>
																<MC.TableRow>
																	<MC.TableCell>취소/변경일자 : </MC.TableCell>
																	<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
																	</MC.TableCell>
																</MC.TableRow>
																<MC.TableRow>
																	<MC.TableCell>환불금액  : </MC.TableCell>
																	<MC.TableCell align={"center"} padding={"none"} style={{width:"10%"}}>
																	</MC.TableCell>
																</MC.TableRow>
															</MC.TableBody>
														</MC.Table>
														:
														 selectedObject.slice(slice).map(objView)
											) : ""
										}
										</MC.TableContainer>
									</div>
								</PerfectScrollbar>
							</MC.CardContent>
						</MC.Grid>
						<MC.Divider />
					</MC.Grid>

				</MC.DialogContent>
				<MC.DialogActions>
					<MC.Button onClick={onClose}>
						닫기
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

export default inject("UserMgntStore", "AptComplexStore")(withRouter(observer(ResrvModifySearchDialog)));
