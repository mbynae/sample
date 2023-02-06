import React, { useState } from "react";
import clsx                from "clsx";

import * as MC                    from "@material-ui/core";
import * as MS                    from "@material-ui/styles";
import palette                    from "../../../../../theme/adminTheme/palette";
import PerfectScrollbar           from "react-perfect-scrollbar";
import moment                     from "moment";
import { TablePaginationActions } from "../../../../../components";

import { resrvModifyRepository } from "../../../../../repositories";
import ResrvModifySearchDialog   from "../ResrvModifySearchDialog";

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
const ResrvModifySearchTable = props => {
	// State -----------------------------------------------------------------------------------------------------------
	const classes = useStyles();

	const {
		className, history, menuKey, rootUrl, resrvHists, getResrvHists, pageInfo, setPageInfo, staticContext,
		renewAll, cancelAll, sendSms, cancel, modify, handOver, confirm, ...rest} = props
	const [ResrvModifyDialogOpen, setResrvModifyDialogOpen] = useState(false);
	const [ResrvModifyObject, setResrvModifyObject] = useState({ });                                            // 선택된 목록들 관리 state

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

	const handleModify = (obj) => {
		const param = {
			memb_numb : obj.memb_numb,
			rfnd_numb : obj.rfnd_numb
		}

		const resrvModifySearchAdmins = resrvModifyRepository.getRfndDetailSearch(param,"cancel/detail/"+obj.memb_numb+"/"+obj.rfnd_numb);

		resrvModifySearchAdmins.then((data) => {
			const param = [data.data_json];
			setResrvModifyObject(param);
			setResrvModifyDialogOpen(true);
		});
	}

	const handleModifyClose = () => {
		setResrvModifyDialogOpen(false);
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

			{/* 동 번호 시작 */}
			<MC.TableCell align={"center"} style={{display: "none"}}>
				{obj.dong_numb}
			</MC.TableCell>
			{/* 동 번호 끝 */}

			{/* 호 시작 */}
			<MC.TableCell align={"center"}>
				{obj.ho_name}
			</MC.TableCell>
			{/* 호 끝 */}

			{/* 호 번호 시작 */}
			<MC.TableCell align={"center"} style={{display: "none"}}>
				{obj.ho_numb}
			</MC.TableCell>
			{/* 호 번호 끝 */}

			{/* 예약자명 시작 */}
			<MC.TableCell align={"center"}>
				{obj.memb_name}
			</MC.TableCell>
			{/* 예약자명 끝 */}

			{/* 예약일 시작 */}
			<MC.TableCell align={"center"}>
				{moment(obj.rsvt_dttm).format("YYYY-MM-DD")}
			</MC.TableCell>
			{/* 예약일 끝 */}

			{/* 상품명 시작 */}
			<MC.TableCell align={"center"}>
				{obj.prgm_name}
			</MC.TableCell>
			{/* 상품명 끝 */}

			{/* 상품 번호 시작 */}
			<MC.TableCell align={"center"} style={{display: "none"}}>
				{obj.prgm_numb}
			</MC.TableCell>
			{/* 상품 번호 끝 */}

			{/* 예약 번호 시작 */}
			<MC.TableCell align={"center"} style={{display: "none"}}>
				{obj.rsvt_numb}
			</MC.TableCell>
			{/* 예약 번호 끝 */}

			{/* 예약기간 시작 */}
			<MC.TableCell align={"center"}>
				{obj.rsvt_strt_date}
				{(obj.rsvt_strt_date && obj.rsvt_end_date) && " - "}
				{obj.rsvt_end_date}
			</MC.TableCell>
			{/* 기간 끝 */}

			{/* 상태 시작 */}
			<MC.TableCell align={"center"}>
				{obj.rfnd_clss_name}
			</MC.TableCell>
			{/* 상태 끝 */}

			{/* 관리 시작 */}
			<MC.TableCell align={"center"}>
				<MC.ButtonGroup>
					<MC.Button
						disabled={obj.rsvt_stat == "2090" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050"}
						style={{
							color: obj.rsvt_stat == "2090" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
							borderColor: obj.rsvt_stat == "2090" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={() => handleModify(obj)}>상세보기
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
					title={"취소/변경내역 목록"}
					subheader={
						<>
							총 {pageInfo.total} 건
						</>
					}
					titleTypographyProps={{variant: "h4"}}
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
										<MC.TableCell align={"center"} style={{display: "none"}}>동 번호</MC.TableCell>
										<MC.TableCell align={"center"}>호</MC.TableCell>
										<MC.TableCell align={"center"} style={{display: "none"}}>호 번호</MC.TableCell>
										<MC.TableCell align={"center"}>예약자명</MC.TableCell>
										<MC.TableCell align={"center"}>예약일</MC.TableCell>
										<MC.TableCell align={"center"}>상품명</MC.TableCell>
										<MC.TableCell align={"center"} style={{display: "none"}}>상품 번호</MC.TableCell>
										<MC.TableCell align={"center"} style={{display: "none"}}>예약 번호</MC.TableCell>
										<MC.TableCell align={"center"}>예약기간</MC.TableCell>
										<MC.TableCell align={"center"}>상태</MC.TableCell>
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
													resrvHists.slice(slice).map((item, index) => objView(item, index))
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
			<ResrvModifySearchDialog
				open={ResrvModifyDialogOpen}
				selectedObject={ResrvModifyObject}
				onClose={handleModifyClose}
			/>
		</div>
	)
};

export default ResrvModifySearchTable;
