import React, {useState,useEffect} from "react";
import clsx              					from "clsx";
import * as MC                    from "@material-ui/core";
import * as MS                    from "@material-ui/styles";
import palette                    from "../../../../../theme/adminTheme/palette";
import PerfectScrollbar           from "react-perfect-scrollbar";
import { TablePaginationActions }                                     from "../../../../../components";
import { tutorMgntRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
    root:          {},
    content:       {
        padding: 0
    },
	inner: {
		minWidth: 1530
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between"
	},
}));

const TutorMgntTable = props => {

	const classes = useStyles();
	const {className, handleOpen, handleClose, alertOpens, setAlertOpens, handleAlertToggle, getTutorList, tutorList, pageInfo, setPageInfo, isLoading, ...rest} = props;

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getTutorList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getTutorList(0, event.target.value);
	};

	const handleDelete = (obj) => {
		handleAlertToggle(
			"isConfirmOpen",
			"강사정보 삭제",
			"선택한 강사정보를 삭제하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				tutorMgntRepository.deleteTutorInfo(obj.clss_code, {
					inst_numb: obj.inst_numb
				}).then(result => {
					getTutorList(pageInfo.page, pageInfo.size);
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
		)
	}

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>
			{/*시설*/}
			<MC.TableCell align={"center"}>
				{obj.fclm_name === null ? "전체" : obj.fclm_name}
			</MC.TableCell>

			{/*강사명*/}
			<MC.TableCell align={"center"}>
				{obj.inst_name}
			</MC.TableCell>

			{/*강사연락처*/}
			<MC.TableCell align={"center"}>
				{obj.inst_teln}
			</MC.TableCell>

			{/*관리*/}
			<MC.TableCell align={"center"}>
				<MC.ButtonGroup
					aria-label="text primary button group"
					color="primary">
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={() => handleOpen(obj, true)}>
						수정
					</MC.Button>
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={() => handleDelete(obj)}>
						삭제
					</MC.Button>
				</MC.ButtonGroup>
			</MC.TableCell>

		</MC.TableRow>
	);


	return (
		<MC.Card
				{...rest}
				className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"강사목록"}
				titleTypographyProps={{variant: "h4"}} />

			<MC.Divider />

			<MC.CardContent className={classes.content}>
					<PerfectScrollbar>
							<div className={classes.inner}>
									<MC.Table size={"small"}>
											<MC.TableHead>
													<MC.TableRow>
															<MC.TableCell align={"center"}>시설</MC.TableCell>
															<MC.TableCell align={"center"}>강사명</MC.TableCell>
															<MC.TableCell align={"center"}>강사연락처</MC.TableCell>
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
														tutorList.length === 0 ?
															<MC.TableRow hover>
																<MC.TableCell colSpan={4} align={"center"}>
																	조회된 강사목록이 없습니다.
																</MC.TableCell>
															</MC.TableRow>
															:
															tutorList.slice(slice).map(objView)
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
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button onClick={() => handleOpen(undefined, false)}>
								강사 등록
							</MC.Button>
						</MC.ButtonGroup>
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

export default TutorMgntTable;
