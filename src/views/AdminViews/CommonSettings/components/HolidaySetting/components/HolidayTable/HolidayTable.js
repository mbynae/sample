import * as MC                    from "@material-ui/core";
import PerfectScrollbar           from "react-perfect-scrollbar";
import { TablePaginationActions } from "../../../../../../../components";
import React                      from "react";
import clsx                       from "clsx";
import palette                    from "../../../../../../../theme/adminTheme/palette";
import { holidayRepository }      from "../../../../../../../repositories";
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

const HolidayTable = props => {

	const classes = useStyles();
	const {className, open, setOpen, handleOpen, alertOpens, setAlertOpens, handleAlertToggle, getHolidayList, holidayList, pageInfo, setPageInfo, isLoading, ...rest} = props;

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getHolidayList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getHolidayList(0, event.target.value);
	};

	const handleDelete = (obj) => {
		handleAlertToggle(
			"isConfirmOpen",
			"휴일정보 삭제",
			"선택한 휴일을 삭제하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				holidayRepository.deleteHoliday(obj.holi_numb)
					.then(result => {
						getHolidayList(pageInfo.page, pageInfo.size);
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
			{/*구분*/}
			<MC.TableCell align={"center"}>
				{obj.holi_type_name}
			</MC.TableCell>

			{/*휴일값*/}
			<MC.TableCell align={"center"}>
				{
					obj.holi_type === "DY" ? obj.holi_date
						: obj.holi_type === "WD" ? obj.holi_dayw_name
						: obj.holi_type === "TM" &&
						<p>{obj.holi_strt_time} ~ {obj.holi_end_time}</p>
				}
			</MC.TableCell>

			{/*명칭*/}
			<MC.TableCell align={"center"}>
				{obj.holi_name}
			</MC.TableCell>

			{/*반복여부*/}
			<MC.TableCell align={"center"}>
				{obj.cycl_at}
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
				title={"휴일 설정"}
				titleTypographyProps={{ variant: "h4" }}/>

			<MC.Divider/>

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>구분</MC.TableCell>
									<MC.TableCell align={"center"}>휴일값</MC.TableCell>
									<MC.TableCell align={"center"}>명칭</MC.TableCell>
									<MC.TableCell align={"center"}>반복여부</MC.TableCell>
									<MC.TableCell align={"center"}>관리</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									isLoading ?
										<MC.TableRow hover>
											<MC.TableCell colSpan={5} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
										:
										holidayList.length === 0 ?
											<MC.TableRow hover>
												<MC.TableCell colSpan={5} align="center">
													조회된 휴일 데이터가 한 건도 없네요.
												</MC.TableCell>
											</MC.TableRow>
											:
											holidayList.slice(slice).map(objView)
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
								휴일 등록
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
}

export default HolidayTable
