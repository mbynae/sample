import React, {useState} from "react";
import clsx              from "clsx";

import * as MC                    from "@material-ui/core";
import * as MS                    from "@material-ui/styles";
import PerfectScrollbar           from "react-perfect-scrollbar";
import palette                    from "../../../../../theme/adminTheme/palette";
import {prgmMgntRepository}       from "../../../../../repositories";
import NumberFormat               from 'react-number-format';
import { TablePaginationActions } from "../../../../../components";

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

const PrgmMgntTable = props => {

	const classes = useStyles();
	const {open, handleOpen, handleClose, rootUrl, history, getPrgmList, prgmList, setPrgmList, pageInfo, setPageInfo,
		alertOpens, setAlertOpens, handleAlertToggle, isLoading,...rest} = props;

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getPrgmList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getPrgmList(0, event.target.value);
	};

	const handleEdit = (obj) => {
		if(obj) {
			history.push(`${rootUrl}/prgmMgnt/edit/` + (obj.prgm_son_numb ? obj.prgm_son_numb : obj.prgm_num) );
		} else {
			history.push(`${rootUrl}/prgmMgnt/edit`);
		}

	}

	const handleDelete = (obj) => {
		handleAlertToggle(
			"isConfirmOpen",
			"상품삭제",
			"선택한 상품을 삭제하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				prgmMgntRepository.prgmmstrDelete(
					obj.prgm_son_numb
				).then(result => {
					getPrgmList(pageInfo.page, pageInfo.size);
				}).catch(e => {
					handleAlertToggle(
						"isOpen",
						e.msg,
						e.errormsg + "\n" + "errorcode: " + e.errorcode,
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
						},
						undefined
					);
				})
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	}

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>
			{/*순서*/}
			<MC.TableCell align={"center"}>
				{obj.no}
			</MC.TableCell>

			{/*대분류*/}
			<MC.TableCell align={"center"}>
				{obj.fclm_name}
			</MC.TableCell>

			{/*중분류*/}
			<MC.TableCell align={"center"}>
				{obj.prgm_name}
			</MC.TableCell>

			{/*프로그램명*/}
			<MC.TableCell	align={"center"}>
				{obj.prgm_son_name}
			</MC.TableCell>

			{/*이용권*/}
			<MC.TableCell align={"center"}>
				{obj.prtm_clss_name}
			</MC.TableCell>

			{/*수량/정원*/}
			<MC.TableCell align={"center"}>
				{obj.totl_cnt}
			</MC.TableCell>

			{/*가격*/}
			<MC.TableCell align={"center"}>
				<NumberFormat value={obj.use_amt} displayType={'text'} thousandSeparator={true} />
			</MC.TableCell>

			{/*관리*/}
			<MC.TableCell align={"center"}>
				<MC.Button variant={"outlined"} color={"primary"} style={{marginRight:10}} onClick={()=>handleEdit(obj)}>수정</MC.Button>
				<MC.Button variant={"outlined"} color={"primary"} disabled={obj.prts_prgm_numb==''?true:false} onClick={()=>handleDelete(obj)}>삭제</MC.Button>
			</MC.TableCell>

		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root)}>

			<MC.CardHeader
					title={"상품설정"}
					titleTypographyProps={{variant: "h4"}}
					/>

				<MC.Divider />

				<MC.CardContent className={classes.content}>
						<PerfectScrollbar>
								<div className={classes.inner}>
										<MC.Table size={"small"}>
											<MC.TableHead>
												<MC.TableRow>
													<MC.TableCell align={"center"}>순서</MC.TableCell>
													<MC.TableCell align={"center"}>대분류</MC.TableCell>
													<MC.TableCell align={"center"}>중분류</MC.TableCell>
													<MC.TableCell align={"center"}>프로그램명</MC.TableCell>
													<MC.TableCell align={"center"}>이용권</MC.TableCell>
													<MC.TableCell align={"center"}>수량/정원</MC.TableCell>
													<MC.TableCell align={"center"}>가격</MC.TableCell>
													<MC.TableCell align={"center"}>관리</MC.TableCell>
												</MC.TableRow>
											</MC.TableHead>
											<MC.TableBody>
												{
													isLoading ?
														<MC.TableRow hover>
															<MC.TableCell colSpan={8} align="center">
																<MC.CircularProgress color="secondary" />
															</MC.TableCell>
														</MC.TableRow>
														:
														prgmList.length === 0 ?
															<MC.TableRow hover>
																<MC.TableCell colSpan={8} align="center">
																	조회된 상품 데이터가 한 건도 없네요.
																</MC.TableCell>
															</MC.TableRow>
															:
															prgmList.slice(slice).map(objView)
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
							<MC.Button variant={"outlined"} color="primary" onClick={() => handleEdit(undefined)}>등록</MC.Button>
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
    )
};

export default PrgmMgntTable;
