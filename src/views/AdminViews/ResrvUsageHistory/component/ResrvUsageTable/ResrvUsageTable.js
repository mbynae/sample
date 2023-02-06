import React, {useState} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS          from "@material-ui/styles";
import palette          from "../../../../../theme/adminTheme/palette";
import PerfectScrollbar from "react-perfect-scrollbar";

import { AlertDialog, DateFormat, PhoneHyphen, TablePaginationActions } from "../../../../../components";
import ResrvHistAssignDialog
																																				from "../../../ResrvHistory/component/ResrvHistAssignDialog";
import ResrvUsageDetailSearchDialog
																																				from "../../../ResrvHistory/component/ResrvUsageDetailSearchDialog";
import { resrvUsageRepository }                                         from "../../../../../repositories";

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
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

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvHistSearchTable = props => {
	// State -----------------------------------------------------------------------------------------------------------
	const classes = useStyles();

	const {
		className, history, menuKey, rootUrl, resrvHists, getResrvHists, pageInfo, setPageInfo, staticContext,
		renewAll, cancelAll, sendSms, cancel, modify, handOver, confirm,
		showRenewAllModal, hideRenewAllModal, showCancelAllModal, hideCancelAllModal,
		showSendSmsModal, hideSendSmsModal, showCancelModal, hideCancelModal,
		showModifyModal, hideModifyModal,showHandOverModal, hideHandOverModal,
		showConfirmModal, hideConfirmModal,
		...rest} = props
	const [ResrvUsageDetailDialogOpen, setResrvUsageDetailDialogOpen] = useState(false);
	const [ResrvUsageDetailObject, setResrvUsageDetailObject] = useState({ });// 선택된 목록들 관리 state
	// Function --------------------------------------------------------------------------------------------------------

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getResrvHists(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getResrvHists(0, event.target.value);
	};

	const handleDetailClick = (obj) => {
		let param = {
			memb_numb: obj.memb_numb,
			prgm_numb: obj.prgm_numb,
		};

		const resrvHistorySearchAdmins = resrvUsageRepository.getRsvtUsageDetailSearch(param);

		resrvHistorySearchAdmins.then((data) => {
			setResrvUsageDetailObject(data.data_json_array);
		});
		setResrvUsageDetailDialogOpen(true);
	}

	const handleUsageDetailClose = () => {
		setResrvUsageDetailDialogOpen(false);
	};

	const slice = () => (0, pageInfo.size);

	// Component -------------------------------------------------------------------------------------------------------
	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>

			{/* 동 시작 */}
			<MC.TableCell align={"center"}>
				{obj.dong_name}
			</MC.TableCell>
			{/* 동 끝 */}

			{/* 호 시작 */}
			<MC.TableCell align={"center"}>
				{obj.ho_name}
			</MC.TableCell>
			{/* 호 끝 */}

			{/* 예약자명 시작 */}
			<MC.TableCell align={"center"}>
				{obj.memb_name}
			</MC.TableCell>
			{/* 예약자명 끝 */}

			{/* 예약일 시작 */}
			<MC.TableCell align={"center"}>
				{obj.use_dttm && (obj.use_dttm.substring(0, 13) + "시")}
			</MC.TableCell>
			{/* 예약일 끝 */}

			{/* 상품명 시작 */}
			<MC.TableCell align={"center"}>
				{obj.prgm_name}
			</MC.TableCell>
			{/* 상품명 끝 */}

			{/* 기간 시작 */}
			<MC.TableCell align={"center"}>
				{obj.use_strt_date}
				{(obj.use_strt_date && obj.use_end_date) && " - "}
				{obj.use_end_date}
			</MC.TableCell>
			{/* 기간 끝 */}

			{/* 관리 시작 */}
			<MC.TableCell align={"center"}>
				<MC.ButtonGroup>
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
					onClick={() =>handleDetailClick(obj)}>상세보기
					</MC.Button>
				</MC.ButtonGroup>
			</MC.TableCell>
			{/* 관리 끝 */}

		</MC.TableRow>
	)
	// DOM -------------------------------------------------------------------------------------------------------------
	return (
		<div className={classes.root}>
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}
		>
			<MC.CardHeader
				title={"이용내역 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
			/>

			<MC.Divider />

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							{/* 테이블 헤더 시작 */}
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>동</MC.TableCell>
									<MC.TableCell align={"center"}>호</MC.TableCell>
									<MC.TableCell align={"center"}>예약자명</MC.TableCell>
									<MC.TableCell align={"center"}>예약일</MC.TableCell>
									<MC.TableCell align={"center"}>상품명</MC.TableCell>
									<MC.TableCell align={"center"}>기간</MC.TableCell>
									<MC.TableCell align={"center"}>관리</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							{/* 테이블 헤더 끝 */}

							{/* 테이블 바디 시작 */}
							<MC.TableBody>
								{
									resrvHists ?
										(
											resrvHists.length === 0 ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={9} align="center">
														조회된 예약 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												resrvHists.slice(slice).map(objView)
										)
										:
										<MC.TableRow hover>
											<MC.TableCell colSpan={9} align="center">
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

			<MC.Divider />
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
							rowsPerPageOptions={[10,15,30,50,100]}
						/>
					</MC.Grid>
				</MC.Grid>
			</MC.CardActions>
		</MC.Card>
		<ResrvUsageDetailSearchDialog
		open={ResrvUsageDetailDialogOpen}
		selectedObject={ResrvUsageDetailObject}
		onClose={handleUsageDetailClose}
		/>
		</div>
	)
};

export default ResrvHistSearchTable;
