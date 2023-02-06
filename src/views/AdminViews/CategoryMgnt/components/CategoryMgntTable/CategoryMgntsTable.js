import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, TablePaginationActions } from "../../../../../components";
import palette                                 from "../../../../../theme/adminTheme/palette";

const useStyles = MS.makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
    inner: {
        minWidth: 1530
    },
    nameContainer: {
        display: "flex",
        alignItems: "center"
    },
    actions: {
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        justifyContent: "space-between"
    }
}));

const CategoryMgntsTable = props => {

	const classes = useStyles();
	const {className, history, menuKey, rootUrl, pageInfo, setPageInfo, alertOpens, setAlertOpens, handleAlertToggle, categoryList, getCategoryList, handleOpen, isLoading, ...rest} = props;

	const handlePageChange = (event, page) => {
			setPageInfo(prev => {
					return {
							...prev,
							page: page
					};
			});
			getCategoryList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
			setPageInfo(prev => {
					return {
							...prev,
							page: 0,
							size: event.target.value
					};
			});
			getCategoryList(0, event.target.value);
	};

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow style={{height:"49px"}} hover key={index}>

			{/*구분*/}
			<MC.TableCell align={"center"}>
					{obj.fclt_name}
			</MC.TableCell>

			{/*대분류*/}
			<MC.TableCell align={"center"}>
					{obj.fclt_info}
			</MC.TableCell>

			{/*중분류*/}
			<MC.TableCell align={"center"}>
					{obj.prgm_name}
			</MC.TableCell>

				{/*관리*/}
			<MC.TableCell align={"center"}>
				{
					obj.exist === 0 ?
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button onClick={() => handleOpen(obj, false)}>
								등록
							</MC.Button>
						</MC.ButtonGroup>
						: obj.exist === 1 ?
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button onClick={() => handleOpen(obj, true)}>
								수정
							</MC.Button>
						</MC.ButtonGroup>
						: obj.exist === 2 &&
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button onClick={() => handleOpen(obj, false)}>
								등록
							</MC.Button>
							<MC.Button onClick={() => handleOpen(obj, true)}>
								수정
							</MC.Button>
						</MC.ButtonGroup>
				}
			</MC.TableCell>
		</MC.TableRow>
	);

	return (
			<MC.Card
					{...rest}
					className={clsx(classes.root, className)}>

					<MC.CardHeader
							title={"카테고리 목록"}
							titleTypographyProps={{variant: "h4"}}/>

					<MC.Divider/>

				<MC.CardContent className={classes.content}>
						<PerfectScrollbar>
								<div className={classes.inner}>
										<MC.Table size="small">
												<MC.TableHead>
														<MC.TableRow>
																<MC.TableCell align={"center"}>구분</MC.TableCell>
																<MC.TableCell align={"center"}>대분류</MC.TableCell>
																<MC.TableCell align={"center"}>중분류</MC.TableCell>
																<MC.TableCell align={"center"}>관리</MC.TableCell>
														</MC.TableRow>
												</MC.TableHead>
												<MC.TableBody>
														{
															isLoading ?
																<MC.TableRow hover>
																	<MC.TableCell colSpan={4} align="center">
																		<MC.CircularProgress color="secondary" />
																	</MC.TableCell>
																</MC.TableRow>
																:
																categoryList.length === 0 ?
																	<MC.TableRow hover>
																		<MC.TableCell colSpan={4} align="center">
																			조회된 카테고리 데이터가 한 건도 없네요.
																		</MC.TableCell>
																	</MC.TableRow>
																	:
																	categoryList.slice(slice).map(objView)
														}
												</MC.TableBody>

										</MC.Table>
								</div>
						</PerfectScrollbar>
				</MC.CardContent>

				<MC.Divider/>

				<MC.CardActions className={classes.actions}>
					<MC.Grid container justify={"space-between"} alignItems={"center"}>
						<MC.Grid item>

						</MC.Grid>
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
								rowsPerPageOptions={[10, 15, 30, 50, 100]}/>
						</MC.Grid>
					</MC.Grid>
				</MC.CardActions>
			</MC.Card>
	);
};

export default CategoryMgntsTable;
