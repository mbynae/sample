import React, { useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import PerfectScrollbar                        from "react-perfect-scrollbar";
import { TablePaginationActions } from "../../../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:          {

	},
	content:       {
		padding: 0
	},
	inner:         {

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

const ParkinglotInfoDetailDialog = props => {

	const classes = useStyles();
	const { open, onClose, detailObj } = props;

	const [ pageInfo, setPageInfo ] = useState({
		page:  0,
		size:  5,
		total: 0
	});

	let [scroll, setScroll] = useState("paper");

	const handleClose = () => {
		onClose();
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

	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>
			{/* 번호 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 주차장명 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 주차 면 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 구분 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 기간 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 상태 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>

		</MC.TableRow>
	)

	return (
		<div>
			<MC.Dialog
				maxWidth={"lg"}
				className={classes.root}
				open={open}
				onClose={handleClose}
				disableBackdropClick={true}
				scroll={scroll}
				aria-labelledby="form-contractType-dialog-title"
			>
				<MC.DialogTitle id="form-contractType-dialog-title">
					주차장정보 상세보기
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
													<MC.TableCell align={"center"}>번호</MC.TableCell>
													<MC.TableCell align={"center"}>주차장명</MC.TableCell>
													<MC.TableCell align={"center"}>주차 면</MC.TableCell>
													<MC.TableCell align={"center"}>구분</MC.TableCell>
													<MC.TableCell align={"center"}>기간</MC.TableCell>
													<MC.TableCell align={"center"}>상태</MC.TableCell>
												</MC.TableRow>
											</MC.TableHead>
											{/* 테이블 헤더 끝 */}

											{/* 테이블 바디 시작 */}
											<MC.TableBody>
												{
													detailObj ?
														(
															detailObj.length === 0 || detailObj.length == undefined?
																<MC.TableRow hover>
																	<MC.TableCell colSpan={6} align="center">
																		조회된 주차장정보 상세 데이터가 한 건도 없네요.
																	</MC.TableCell>
																</MC.TableRow>
																:
																detailObj.slice(slice).map((item, index) => objView(item, index))
														)
														:
														<MC.TableRow hover>
															<MC.TableCell colSpan={6} align="center">
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

						<MC.CardActions className={classes.actions}>
							<MC.Grid container justify={"space-between"} alignItems={"center"}>
								{/* Pagination */}
								<MC.Grid item>
									<MC.TablePagination
										component="div"
										count={pageInfo.total}
										labelDisplayedRows={({ from, to, count }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
										labelRowsPerPage={"페이지당 목록 수 : "}
										onChangePage={handlePageChange}
										onChangeRowsPerPage={handleRowsPerPageChange}
										ActionsComponent={TablePaginationActions}
										page={pageInfo.page}
										rowsPerPage={pageInfo.size}
										rowsPerPageOptions={[5,10,15,20]}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.CardActions>
					</MC.Grid>

				</MC.DialogContent>
				<MC.DialogActions>
					<MC.Button onClick={onClose}>
						닫기
					</MC.Button>
				</MC.DialogActions>

			</MC.Dialog>
		</div>
	);

}

export default ParkinglotInfoDetailDialog;
