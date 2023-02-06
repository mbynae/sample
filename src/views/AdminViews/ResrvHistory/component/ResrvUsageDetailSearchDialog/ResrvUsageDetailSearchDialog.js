import React, { useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, TablePaginationActions } from "../../../../../components";
import PerfectScrollbar                        from "react-perfect-scrollbar";
import { inject, observer }                    from "mobx-react";
import { withRouter }                          from "react-router-dom";

const useStyles = MS.makeStyles(theme => ({
	root:          {},
	content:       {
		padding: 0
	},
	inner:         {
		minWidth: 500
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

const ResrvUsageDetailSearchDialog = props => {

	const classes = useStyles();
	const { open, onClose, selectedObject } = props;
	const [ pageInfo, setPageInfo ] = useState({});

	let [scroll, setScroll] = useState("paper");

	const handleClose = () => {
		onClose();
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
	const objView = (obj) => (
		<MC.TableRow hover>

			{/* 이용시간 시작 */}
			<MC.TableCell align={"center"} padding={"none"} style={{width:"20%"}}>
				{obj.entr_dttm}
			</MC.TableCell>
			{/* 이용시간 끝 */}

			{/* 비고 */}
			<MC.TableCell align={"center"} padding={"none"} style={{width:"20%"}}>
				{obj.entr_type}
			</MC.TableCell>
			{/* 비고 끝 */}
			<MC.TableCell align={"center"} padding={"none"}>
			</MC.TableCell>

		</MC.TableRow>
	)

	return (
		<div className={classes.root}>
			<MC.Dialog
				maxWidth={"lg"}
				open={open}
				onClose={handleClose}
				disableBackdropClick={true}
				scroll={scroll}
				aria-labelledby="form-contractType-dialog-title">
				<MC.DialogTitle id="form-contractType-dialog-title">
					이용내역 상세보기
				</MC.DialogTitle>
				<MC.DialogContent dividers={scroll === "paper"}>

					<MC.Grid container spacing={1}>
						<MC.Divider />
						<MC.Grid item xs={12} md={12}>
							<MC.CardContent className={classes.content}>
								<PerfectScrollbar>
									<div className={classes.inner}>
										<MC.Table size="small">
											{/* 테이블 헤더 시작 */}
											<MC.TableHead>
												<MC.TableRow>
													<MC.TableCell align={"center"} style={{width:"20%"}}>이용일자</MC.TableCell>
													<MC.TableCell align={"center"} style={{width:"20%"}}>구분</MC.TableCell>
												</MC.TableRow>
											</MC.TableHead>
											{/* 테이블 헤더 끝 */}

											{/* 테이블 바디 시작 */}
											<MC.TableBody>
												{
													selectedObject ?
														(
															selectedObject.length === 0 || selectedObject.length == undefined?
																<MC.TableRow hover>
																	<MC.TableCell colSpan={2} align="center">
																		조회된 예약 데이터가 한 건도 없네요.
																	</MC.TableCell>
																</MC.TableRow>
																:
																selectedObject.slice(slice).map(objView)
														)
														:
														<MC.TableRow hover>
															<MC.TableCell colSpan={2} align="center">
																<MC.CircularProgress color="secondary" />
															</MC.TableCell>
														</MC.TableRow>
												}
											</MC.TableBody>
											{/* 테이블 바디 끝 */}
										</MC.Table>
									</div>
								</PerfectScrollbar>
							</MC.CardContent>
						</MC.Grid>
						<MC.Divider />
						{/*<MC.CardActions className={classes.actions}>
							<MC.Grid container justify={"space-between"} alignItems={"center"}>
								<MC.Grid item>
									<MC.TablePagination
										component="div"
										count={pageInfo.total === undefined? 0 : pageInfo.total}
										labelDisplayedRows={({ from, to, count }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
										labelRowsPerPage={"페이지당 목록 수 : "}
										onChangePage={handlePageChange}
										onChangeRowsPerPage={handleRowsPerPageChange}
										ActionsComponent={TablePaginationActions}
										page={pageInfo.page === undefined? 1 : pageInfo.page}
										rowsPerPage={pageInfo.size === undefined? 0 : pageInfo.size}
										rowsPerPageOptions={[5,10,15,20]}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.CardActions>*/}
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

export default inject("UserMgntStore", "AptComplexStore")(withRouter(observer(ResrvUsageDetailSearchDialog)));
