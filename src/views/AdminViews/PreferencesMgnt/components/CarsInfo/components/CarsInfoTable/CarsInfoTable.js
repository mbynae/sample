import * as MC                    from "@material-ui/core";
import PerfectScrollbar           from "react-perfect-scrollbar";
import { TablePaginationActions } from "../../../../../../../components";
import React                      from "react";
import clsx                       from "clsx";
import palette                    from "../../../../../../../theme/adminTheme/palette";
// import { holidayRepository }      from "../../../../../../../repositories";
import * as MS                    from "@material-ui/styles";

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

const CarsInfoTable = props => {

	const classes = useStyles();

	const { className, getCarsInfoList, carsInfoList, pageInfo, setPageInfo, isLoading, ...rest } = props;

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getCarsInfoList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getCarsInfoList(0, event.target.value);
	};

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>
			{/* 동 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 호 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 차량번호 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 기간 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 구분 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>
			{/* 상태 */}
			<MC.TableCell align={"center"}>

			</MC.TableCell>

		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"차량 정보"}
				titleTypographyProps={{ variant: "h4" }}/>

			<MC.Divider/>

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>동</MC.TableCell>
									<MC.TableCell align={"center"}>호</MC.TableCell>
									<MC.TableCell align={"center"}>차량번호</MC.TableCell>
									<MC.TableCell align={"center"}>기간</MC.TableCell>
									<MC.TableCell align={"center"}>구분</MC.TableCell>
									<MC.TableCell align={"center"}>상태</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									isLoading ?
										<MC.TableRow hover>
											<MC.TableCell colSpan={6} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
										:
										carsInfoList.length === 0 ?
											<MC.TableRow hover>
												<MC.TableCell colSpan={6} align="center">
													조회된 차량 정보 데이터가 한 건도 없네요.
												</MC.TableCell>
											</MC.TableRow>
											:
											carsInfoList.slice(slice).map(objView)
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
}

export default CarsInfoTable;
