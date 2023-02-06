import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, TablePaginationActions } from "../../../../../components";
import { CategoryTabs }                                    from "../../components";

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

const ArticlesTable = props => {
	const classes = useStyles();
	const { className, history, board, menuKey, rootUrl, getArticles, articles, categories, pageInfo, setPageInfo, staticContext, ...rest } = props;

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});

	const [isRowClick, setIsRowClick] = useState(false);

	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getArticles(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getArticles(0, event.target.value);
	};

	const handleOpenRegisterPage = event => {
		if ( categories.length === 0 ) {
			handleAlertToggle(
				"isOpen",
				"카테고리 등록 필요",
				"카테고리를 먼저 등록이 필요합니다. 카테고리를 먼저 등록 해주세요.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			history.push(`${rootUrl}/articles/${menuKey}/edit`);
		}
	};

	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/articles/${menuKey}/` + obj.id);
	};

	const slice = () => (0, pageInfo.size);

	const checkFleMarket = () => menuKey === "fleaMarket";

	const generateTitle = (obj) => {
		let title = "";

		if ( menuKey !== "suggestions" ) {
			title += `[ ${obj.categoryName} ] `;
		}
		if ( menuKey === "fleaMarket" && obj.transactionType ) {
			title += ` ${obj.transactionType === "RESERVATION" ? "(예약중)" :
				obj.transactionType === "TRADING" ? "(거래중)" :
					obj.transactionType === "TRANSACTION_COMPLETE" ? "(거래완료)" :
						obj.transactionType === "TRANSACTION_STATUS" && ""
			} `;
		}
		title += obj.title;
		if ( menuKey === "complaints" || menuKey === "fleaMarket" || menuKey === "freeBoard" || menuKey === "suggestions" ) {
			if ( obj.commentsCount > 0 ) {
				title += ` [${obj.commentsCount}]`;
			}
		}
		return title;
	};

	const objView = (obj, index) => (
		<MC.TableRow
			className={classes.tableRow}
			hover
			key={obj.id}>

			{/*제목*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"left"}
			              style={{ textDecoration: checkFleMarket() && obj.transactionType === "TRANSACTION_COMPLETE" ? "line-through" : "none" }}>
				{generateTitle(obj)}
			</MC.TableCell>

			{/*작성자*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{
					obj.aptComplex ?
						(obj.accountType === "MANAGEMENT_OFFICE_MANAGER" ? "관리자" : `${obj.building}동 ${obj.nickName}`)
						:
						(obj.author)
				}
			</MC.TableCell>

			{/*등록일자*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.createDate ?
					<DateFormat date={obj.createDate} />
					:
					"-"
				}

			</MC.TableCell>

			{
				menuKey === "ticket" &&
				<>
					{/*답변상태*/}
					<MC.TableCell onClick={() => handleRowClick(obj)}
					              align={"center"}>
						{obj.isReply ? "답변완료" : "미답변"}
					</MC.TableCell>

					{/*답변일*/}
					<MC.TableCell onClick={() => handleRowClick(obj)}
					              align={"center"}>
						{
							obj.replyDate ?
								<DateFormat date={obj.replyDate} />
								:
								"-"
						}
					</MC.TableCell>
				</>
			}
		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={(board.name ? board.name : "") + " 게시판 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
				titleTypographyProps={{ variant: "h4" }}
			/>

			{
				menuKey !== "suggestions" &&
				<CategoryTabs
					categories={categories}
					getArticles={getArticles}
					menuKey={menuKey}
				/>
			}

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>제목</MC.TableCell>
									<MC.TableCell align={"center"} style={{ width: "15%" }}>작성자</MC.TableCell>
									<MC.TableCell align={"center"} style={{ width: "15%" }}>작성일</MC.TableCell>
									{
										menuKey === "ticket" &&
										<>
											<MC.TableCell align={"center"} style={{ width: "15%" }}>답변상태</MC.TableCell>
											<MC.TableCell align={"center"} style={{ width: "15%" }}>답변일</MC.TableCell>
										</>
									}
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									articles ?
										(
											articles.length === 0 ?
												<MC.TableRow
													className={classes.tableRow}
													hover>
													<MC.TableCell colSpan={menuKey === "ticket" ? 5 : 3} align="center">
														조회된 게시판 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												articles.slice(slice).map(objView)
										)
										:
										<MC.TableRow
											className={classes.tableRow}
											hover>
											<MC.TableCell colSpan={menuKey === "ticket" ? 5 : 3} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
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
						{
							!(menuKey === "migoNotice" || menuKey === "complaints" || menuKey === "suggestions") &&
							<MC.ButtonGroup
								aria-label="text primary button group"
								color="primary">
								<MC.Button onClick={handleOpenRegisterPage}>
									등록
								</MC.Button>
							</MC.ButtonGroup>
						}
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

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>

		</MC.Card>
	);

};

export default ArticlesTable;
