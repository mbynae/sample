import * as MC                        from "@material-ui/core";
import PerfectScrollbar               from "react-perfect-scrollbar";
import { TablePaginationActions }     from "../../../../../../../components";
import React, { useState }            from "react";
import clsx                           from "clsx";
import palette                        from "../../../../../../../theme/adminTheme/palette";
// import { holidayRepository }      from "../../../../../../../repositories";
import * as MS                        from "@material-ui/styles";
import { ParkinglotInfoDetailDialog } from "../../components";

const useStyles = MS.makeStyles(theme => ({
	root: {
		borderRadius: 0
	},
	inner: {
		minWidth: 1530
	},
	content: {
		padding: 0
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between"
	},
}));

const ParkinglotInfoTable = props => {

	const classes = useStyles();

	const { className, getParkinglotList, parkinglotInfoList, pageInfo, setPageInfo, isLoading, ...rest } = props;

	const [dialogOpen, setDialogOpen] = useState(false); // Detail Dialog State
	const [detailObj, setDetailObj] = useState([]);

	// Close Dialog
	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getParkinglotList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getParkinglotList(0, event.target.value);
	};

	const slice = () => (0, pageInfo.size);

	const handleDetailClick = (obj) => {
		// Detail API 호출

	  // Open Dialog
		setDialogOpen(true);
	}

	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>
			{/* 번호 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 주차장명 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 주차장 면 수 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 운영업체/담당자 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 구분 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 상태 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 관리 */}
			<MC.TableCell align={"center"}>
				<MC.ButtonGroup
					aria-label="text primary button group"
					color="primary">
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={() =>handleDetailClick(obj)}>
						상세보기
					</MC.Button>
				</MC.ButtonGroup>
			</MC.TableCell>

		</MC.TableRow>
	);

	return (
		<div>
			<MC.Card
				{...rest}
				className={clsx(classes.root, className)}>

				<MC.CardHeader
					title={"주차장 정보"}
					titleTypographyProps={{ variant: "h4" }}/>

				<MC.Divider/>

				<MC.CardContent className={classes.content}>
					<PerfectScrollbar>
						<div className={classes.inner}>
							<MC.Table size="small">
								<MC.TableHead>
									<MC.TableRow>
										<MC.TableCell align={"center"}>번호</MC.TableCell>
										<MC.TableCell align={"center"}>주차장명</MC.TableCell>
										<MC.TableCell align={"center"}>주차장 면 수</MC.TableCell>
										<MC.TableCell align={"center"}>운영업체/담당자</MC.TableCell>
										<MC.TableCell align={"center"}>구분</MC.TableCell>
										<MC.TableCell align={"center"}>상태</MC.TableCell>
										<MC.TableCell align={"center"}>관리</MC.TableCell>
									</MC.TableRow>
								</MC.TableHead>
								<MC.TableBody>
									{
										isLoading ?
											<MC.TableRow hover>
												<MC.TableCell colSpan={7} align="center">
													<MC.CircularProgress color="secondary"/>
												</MC.TableCell>
											</MC.TableRow>
											:
											parkinglotInfoList.length === 0 ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={7} align="center">
														조회된 주차장 정보 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												parkinglotInfoList.slice(slice).map(objView)
									}
								</MC.TableBody>
							</MC.Table>
						</div>
					</PerfectScrollbar>
				</MC.CardContent>

				<MC.Divider/>

				<MC.CardActions className={classes.actions}>
					<MC.Grid container justify={"flex-end"} alignItems={"center"}>
						{/* 버튼 Action*/}

						{/* Pagination */}
						<MC.Grid item>
							<MC.TablePagination
								component="div"
								count={pageInfo.total}
								labelDisplayedRows={({from, to, count}) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
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

		{/*	Detail Dialog */}
			<ParkinglotInfoDetailDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				detailObj={detailObj}
			/>

		</div>
	)

}

export default ParkinglotInfoTable;
