import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, TablePaginationActions } from "../../../../../components";
import { bannerRepository }                   from "../../../../../repositories";

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

const BannerMgntTable = props => {
	const classes = useStyles();
	const { AptComplexStore, className, history, rootUrl, getBannerList, bannerList, alertOpens, setAlertOpens, handleAlertToggle, pageInfo, setPageInfo, isLoading, ...rest} = props;

	const handleDelete = (banner) => {
		handleAlertToggle(
			"isConfirmOpen",
			"배너삭제",
			"선택한 배너를 삭제하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				bannerRepository.deleteBanner(banner.evnt_numb)
					.then(result => {
						getBannerList(pageInfo.page, pageInfo.size);
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

	const handleCreate = () => {
		history.push(`${rootUrl}/bannerMgnt/edit`);
	}

	const handleEdit = (banner) => {
		history.push(`${rootUrl}/bannerMgnt/edit/` + banner.evnt_numb);
	}

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getBannerList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getBannerList(0, event.target.value);
	};

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"배너 목록"}
				titleTypographyProps={{ variant: "h4" }}
			 />

			<MC.Divider />

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									{/*<MC.TableCell align={"center"}>NO</MC.TableCell>*/}
									<MC.TableCell align={"center"}>배너명</MC.TableCell>
									<MC.TableCell align={"center"}>게시기간</MC.TableCell>
									<MC.TableCell align={"center"}>게시여부</MC.TableCell>
									<MC.TableCell align={"center"}>등록일</MC.TableCell>
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
										bannerList.length === 0 ?
											<MC.TableRow hover>
												<MC.TableCell colSpan={6} align="center">
													조회된 배너가 없습니다.
												</MC.TableCell>
											</MC.TableRow>
											:
											bannerList.map((banner, index) => (
												<MC.TableRow key={index} hover>
													{/*<MC.TableCell align={"center"}>{index + ((pageInfo.page * pageInfo.size)+1)}</MC.TableCell>*/}
													<MC.TableCell align={"center"}>{banner.evnt_name}</MC.TableCell>
													<MC.TableCell align={"center"}>
														<DateFormat date={banner.evnt_strt_dttm} format={"YYYY-MM-DD"} />
														&nbsp; ~ &nbsp;
														<DateFormat date={banner.evnt_end_dttm} format={"YYYY-MM-DD"} />
													</MC.TableCell>
													<MC.TableCell align={"center"}>{banner.disp_at === "Y" ? "사용" : "비사용"}</MC.TableCell>
													<MC.TableCell align={"center"}>
														<DateFormat date={banner.reg_dttm} format={"YYYY-MM-DD"} />
													</MC.TableCell>
													<MC.TableCell align={"center"}>
														<MC.Button variant={"outlined"} color={"primary"} style={{marginRight:10}} onClick={()=>handleEdit(banner)}>수정</MC.Button>
														<MC.Button variant={"outlined"} color={"primary"} onClick={()=>handleDelete(banner)}>삭제</MC.Button>
													</MC.TableCell>
												</MC.TableRow>
											))

								}
							</MC.TableBody>
						</MC.Table>
					</div>
				</PerfectScrollbar>
			</MC.CardContent>

			<MC.Divider />
			<MC.CardActions className={classes.actions}>
				<MC.Grid
					container
					justify={"space-between"}
					alignItems={"center"}>

					<MC.Grid item>
						<MC.Button variant={"outlined"} color="primary" onClick={handleCreate}>등록</MC.Button>
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
							rowsPerPageOptions={[10, 15, 30, 50, 100]} />
					</MC.Grid>
				</MC.Grid>
			</MC.CardActions>
		</MC.Card>
	);

};

export default BannerMgntTable;
