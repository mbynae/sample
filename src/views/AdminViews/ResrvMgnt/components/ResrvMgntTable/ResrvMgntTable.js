import React                                   from "react";
import PerfectScrollbar                        from "react-perfect-scrollbar";
import clsx                                    from "clsx";
import * as MC                                 from "@material-ui/core";
import * as MS                                 from "@material-ui/styles";
import { PhoneHyphen, TablePaginationActions } from "../../../../../components";
import ExpandMoreIcon                          from "@material-ui/icons/ExpandMore";
import { residentCardRepository }              from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
	inner: {
		minWidth: 1580
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
	},
	buttonColorBlack: {
		color: theme.palette.black
	}
}));

const ResrvMgntTable = props => {
	const classes = useStyles();
	const {
		className,
		history,
		rootUrl,
		tableExpanded,
		setTableExpanded,
		selectedUser,
		setSelectedMembNumb,
		setFcltAdditionalFlag,
		setPrtmClss,
		setSeatListFlag,
		dateInit,
		setSelectedUser,
		userMgnts,
		getUserMgnts,
		pageInfo,
		setPageInfo,
		staticContext,
		setIsOpen,
		setExpanded,
		setErrors,
		setReservationInfo,
		...rest
	} = props;
	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getUserMgnts(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getUserMgnts(0, event.target.value);
	};

	const handleSelect = (obj) => {
		setSelectedUser(obj); // 선택된 유저 정보 저장

		// 선택된 유저의 Memb_numb 가져오기
		residentCardRepository.getMembNumb(obj.id, false)
			.then(result => {
				setSelectedMembNumb(result.memb_numb);
			});

		setIsOpen(true);
		setExpanded(false);
		setTableExpanded(false);

		setPrtmClss("");
		setFcltAdditionalFlag(false);
		setSeatListFlag(false);

		setReservationInfo({
			facility: "",
			ticket: "",
			additional: "",
			rsvt_strt_date: dateInit(true),
			rsvt_strt_time: "09",
			rsvt_end_date: dateInit(false),
			rsvt_end_time: "18"
		}); // 탭 변경시 선택된 값 초기화
		setErrors({
			facility: false,
			ticket: false,
			additional: false,
			detl_numb: false,
			rsvt_strt_time: false,
			rsvt_end_time: false
		}); // 탭 변경시 에러 초기화
	};

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.id}>

			{/*상태*/}
			<MC.TableCell align={"center"}>
				{
					obj.userDataType.residentsType === "AWAITING_RESIDENTS"
						? <MC.Chip label={"승인대기"}/>
						: obj.userDataType.residentsType === "RESIDENTS" && <MC.Chip label={"입주민"}/>
				}
			</MC.TableCell>

			{/*이름*/}
			<MC.TableCell align={"center"}>
				{obj.name}
			</MC.TableCell>

			{/*아이디*/}
			<MC.TableCell align={"center"}>
				{obj.userId}
			</MC.TableCell>

			{/*동*/}
			<MC.TableCell align={"center"}>
				{obj.userDataType.building}
			</MC.TableCell>

			{/*호*/}
			<MC.TableCell align={"center"}>
				{obj.userDataType.unit}
			</MC.TableCell>

			{/*휴대폰번호*/}
			<MC.TableCell align={"center"}>
				{PhoneHyphen(obj.phoneNumber)}
			</MC.TableCell>

			{/*선택버튼*/}
			<MC.TableCell align={"center"}>
				<MC.Button
					color="primary"
					variant="outlined"
					disabled={obj.userDataType.residentsType === "AWAITING_RESIDENTS"}
					onClick={() => handleSelect(obj)}>
					예약
				</MC.Button>
			</MC.TableCell>

		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.Accordion square expanded={tableExpanded} onChange={(event, isOpen) => setTableExpanded(isOpen)}>
				{/* 입주민 목록 타이틀 시작 */}
				<MC.AccordionSummary
					expandIcon={<ExpandMoreIcon className={classes.buttonColorBlack}/>}
					aria-controls={"panel1a-content"}
					id="panel1a-header"
				>
					<MC.CardHeader
						className={classes.content}
						title={"입주민 목록"}
						subheader={
							<> 총 {pageInfo.total} 건 </>
						}
						titleTypographyProps={{ variant: "h4" }}
					/>
				</MC.AccordionSummary>
				{/* 입주민 목록 타이틀 끝 */}
				<MC.Divider/>
				{/* 입주민 목록 테이블 시작 */}
				<MC.AccordionDetails>
					<MC.CardContent className={classes.content}>
						<PerfectScrollbar>
							<div className={classes.inner}>
								<MC.Table size="small">
									<MC.TableHead>
										<MC.TableRow>
											<MC.TableCell align={"center"}>상태</MC.TableCell>
											<MC.TableCell align={"center"}>이름</MC.TableCell>
											<MC.TableCell align={"center"}>아이디</MC.TableCell>
											<MC.TableCell align={"center"}>동</MC.TableCell>
											<MC.TableCell align={"center"}>호</MC.TableCell>
											<MC.TableCell align={"center"}>휴대폰번호</MC.TableCell>
											<MC.TableCell align={"center"}>선택</MC.TableCell>
										</MC.TableRow>
									</MC.TableHead>
									<MC.TableBody>
										{
											userMgnts.length === 0 ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={9} align="center">
														조회된 입주민 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												userMgnts.slice(slice).map(objView)
										}
									</MC.TableBody>
								</MC.Table>
							</div>
						</PerfectScrollbar>
					</MC.CardContent>
				</MC.AccordionDetails>
				{/* 입주민 목록 테이블 끝 */}
				<MC.Divider/>
				{/* 입주민 목록 페이지네이션 시작 */}
				<MC.CardActions className={classes.actions}>
					<MC.Grid
						container
						justify={"space-between"}
						alignItems={"center"}>
						<MC.Grid item>
						</MC.Grid>
						<MC.Grid item>
							<MC.TablePagination
								component="div"
								count={pageInfo.total}
								labelDisplayedRows={({
																			 from,
																			 to,
																			 count
																		 }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
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
				{/* 입주민 목록 페이지네이션 끝 */}
			</MC.Accordion>
		</MC.Card>
	);
};

export default ResrvMgntTable;
