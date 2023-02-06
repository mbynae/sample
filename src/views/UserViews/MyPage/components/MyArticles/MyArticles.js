import React, { useEffect, useState } from "react";
import PerfectScrollbar               from "react-perfect-scrollbar";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as ML from "@material-ui/lab";

import { DateFormat, NumberComma, TablePaginationActions } from "../../../../../components";
import { articleRepository, contractRepository }           from "../../../../../repositories";
import clsx                                                from "clsx";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		width:                          "100%",
		[theme.breakpoints.down("xs")]: {
			width:    "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin:   0
		}
	},
	tableHead:         {
		height:          50,
		minHeight:       50,
		maxHeight:       50,
		backgroundColor: "transparent"
	},
	tableRow:          {
		height:    50,
		minHeight: 50,
		maxHeight: 50
	},
	body4:             {
		...theme.typography.body4,
		color:      "#ffffff",
		height:     24,
		lineHeight: "24px"
	},
	tableHeadCell:     {
		height:     "50px !important",
		fontWeight: "bold",
		color:      "#222222"
	},
	tableHeadCellFont: {
		fontSize:                       14,
		width:                          "15%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width:    "25%"
		}
	}
}));
const MyArticles = props => {

	const classes = useStyles();

	const { rootUrl, value, isMobile, history, UserAptComplexStore, setAlertOpens, handleAlertToggle } = props;

	const [myArticles, setMyArticles] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  1,
		size:  10,
		total: 0
	});
	const [selectedObjects, setSelectedObjects] = useState([]);
	const [isSelectAll, setIsSelectAll] = useState(false);

	useEffect(() => {
		const init = async () => {
			await getMyArticles();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const getMyArticles = async (page = 1, size = 10) => {
		let result = await articleRepository.findMyArticles({
			direction: "DESC",
			page:      page - 1,
			size:      size,
			sort:      "baseDateDataType.createDate"
		}, true);
		setMyArticles(result.content);
		setPageInfo(prev => {
			return {
				...prev,
				page:  result.pageable.page + 1,
				total: result.total
			};
		});
	};

	const handleSelectAll = event => {
		let selectedList;
		if ( event.target ) {
			event.target.checked ? selectedList = myArticles.map(contract => contract) : selectedList = [];
			setIsSelectAll(event.target.checked);
		} else {
			event ? selectedList = myArticles.map(contract => contract) : selectedList = [];
			setIsSelectAll(event);
		}
		setSelectedObjects(selectedList);
	};

	const handleSelectOne = (event, selectedObject) => {
		const selectedIndex = selectedObjects.indexOf(selectedObject);
		let newSelectedObjects = [];

		if ( selectedIndex === -1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects, selectedObject);
		} else if ( selectedIndex === 0 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if ( selectedIndex === selectedObjects.length - 1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
		} else if ( selectedIndex > 0 ) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}

		setSelectedObjects(newSelectedObjects);
	};

	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/articles/${obj.menuKey}/${obj.id}`);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getMyArticles(page, pageInfo.size);
	};

	const getTotalPage = () => {
		let totalPage = Math.floor(pageInfo.total / pageInfo.size);
		if ( pageInfo.total % pageInfo.size > 0 ) {
			totalPage++;
		}
		return totalPage;
	};

	const removeObject = async (id) => {
		return articleRepository.removeArticle(id, true);
	};

	const handleDeleteAllClick = async () => {
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"선택하신 게시글들의 모든 데이터가 삭제가 됩니다. \n 정말로 게시글을 삭제하겠습니까?",
			"삭제",
			async () => {
				setAlertOpens(prev => {return { ...prev, isConfirmOpen: false };});
				await selectedObjects.map(async (obj) => {
					await removeObject(obj.id);
				});
				handleAlertToggle(
					"isOpen",
					undefined,
					"선택된 게시글 정보 모두를 삭제 하였습니다.",
					undefined,
					() => {
						setSelectedObjects([]);
						getMyArticles(selectedObjects.length === (pageInfo.total % pageInfo.size === 0 ? 10 : pageInfo.total % pageInfo.size) ? pageInfo.page - 1 : pageInfo.page, pageInfo.size);
						setAlertOpens(prev => {return { ...prev, isOpen: false };});
					}
				);
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens(prev => {return { ...prev, isConfirmOpen: false };});
			}
		);
	};

	const objView = (obj, index) => (
		<MC.TableRow
			className={classes.tableRow}
			hover
			style={{ borderBottom: index === (myArticles.length - 1) && "2px solid #222222" }}
			key={obj.id}>

			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>

			{/*제목*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} className={classes.body4} style={{ color: "#222222", fontWeight: 500 }} align={"left"}>
				{
					isMobile ?
						(
							<MC.Grid container direction="column" justify={"center"} alignItems={"flex-start"}>
								<MC.Grid item style={{ textDecoration: obj.menuKey === "fleaMarket" && obj.transactionType === "TRANSACTION_COMPLETE" ? "line-through" : "none" }}>
									{
										(obj.menuKey !== "suggestions" && `[ ${obj.categoryName} ] `)
										+ (obj.menuKey === "fleaMarket" && obj.transactionType ? (
											` ${
												obj.transactionType === "RESERVATION" ? "(예약중)" :
													obj.transactionType === "TRADING" ? "(거래중)" :
														obj.transactionType === "TRANSACTION_COMPLETE" ? "(거래완료)" :
															obj.transactionType === "TRANSACTION_STATUS" && ""
											} `
										) : ``)
										+ `${obj.title}`
									}
									{
										(obj.menuKey === "complaints" || obj.menuKey === "fleaMarket" || obj.menuKey === "freeBoard" || obj.menuKey === "suggestions") &&
										(obj.commentsCount > 0 && (` [${obj.commentsCount}]`))
									}
								</MC.Grid>
								<MC.Grid item>
									<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}>
										<MC.Grid item style={{ fontSize: 12 }}>
											{`작성자 ${obj.building}동 ${obj.nickName}`}
										</MC.Grid>
										<MC.Grid item style={{ color: "#dedede" }}>&nbsp;|&nbsp;</MC.Grid>
										<MC.Grid item style={{ fontSize: 12 }}>
											작성일&nbsp;<DateFormat date={obj.createDate} format={"YYYY.MM.DD"} />
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
						)
						:
						(
							<div style={{ textDecoration: obj.menuKey === "fleaMarket" && obj.transactionType === "TRANSACTION_COMPLETE" ? "line-through" : "none" }}>
								{
									(obj.menuKey !== "suggestions" && `[ ${obj.categoryName} ] `)
									+ (obj.menuKey === "fleaMarket" && obj.transactionType ? (
										` ${
											obj.transactionType === "RESERVATION" ? "(예약중)" :
												obj.transactionType === "TRADING" ? "(거래중)" :
													obj.transactionType === "TRANSACTION_COMPLETE" ? "(거래완료)" :
														obj.transactionType === "TRANSACTION_STATUS" && ""
										} `
									) : ``)
									+ `${obj.title}`
								}
								{
									(obj.menuKey === "complaints" || obj.menuKey === "fleaMarket" || obj.menuKey === "freeBoard" || obj.menuKey === "suggestions") &&
									(obj.commentsCount > 0 && (` [${obj.commentsCount}]`))
								}
							</div>
						)
				}
			</MC.TableCell>
			{
				!isMobile &&
				<>
					{/*작성자*/}
					<MC.TableCell onClick={() => handleRowClick(obj)} className={classes.body4} style={{ color: "#222222", fontWeight: 500 }} align={"center"}>
						{`${obj.building}동 ${obj.nickName}`}
					</MC.TableCell>

					{/*작성일*/}
					<MC.TableCell onClick={() => handleRowClick(obj)} className={classes.body4} style={{ color: "#222222", fontWeight: 500 }} align={"center"}>
						<DateFormat date={obj.createDate} format={"YYYY.MM.DD"} />
					</MC.TableCell>
				</>
			}
		</MC.TableRow>
	);

	return (
		<div hidden={value !== 3} className={classes.root}>

			<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>

				<MC.Grid item style={{ width: "100%", marginTop: 45 }}>

					<PerfectScrollbar>
						<div className={classes.inner}>
							<MC.Table>
								<MC.TableHead className={classes.tableHead}>
									{
										isMobile ?
											(
												<MC.TableRow className={classes.tableRow} style={{ borderTop: "2px solid #222222" }}>
													<MC.TableCell align={"center"} padding={"checkbox"}>
														<MC.Checkbox
															checked={
																myArticles ?
																	(myArticles.length === 0 ? false : selectedObjects.length === myArticles.length) : false
															}
															color={"primary"}
															indeterminate={
																selectedObjects.length > 0
																&& selectedObjects.length < (myArticles ? myArticles.length : 10)
															}
															onChange={handleSelectAll}
														/>
													</MC.TableCell>
													<MC.TableCell
														className={clsx(classes.body4, classes.tableHeadCell)}
														align={"left"}
														onClick={() => handleSelectAll(!isSelectAll)}>
														전체선택
													</MC.TableCell>
												</MC.TableRow>
											)
											:
											(
												<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
													<MC.TableCell align={"center"} padding={"checkbox"}>
														<MC.Checkbox
															checked={
																myArticles ?
																	(myArticles.length === 0 ? false : selectedObjects.length === myArticles.length) : false
															}
															color={"primary"}
															indeterminate={
																selectedObjects.length > 0
																&& selectedObjects.length < (myArticles ? myArticles.length : 10)
															}
															onChange={handleSelectAll}
														/>
													</MC.TableCell>
													<MC.TableCell className={clsx(classes.body4, classes.tableHeadCell)} align={"center"}>제목</MC.TableCell>
													<MC.TableCell
														className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
														align={"center"}>
														작성자
													</MC.TableCell>
													<MC.TableCell
														className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
														align={"center"}>
														작성일
													</MC.TableCell>
												</MC.TableRow>
											)
									}
								</MC.TableHead>
								<MC.TableBody>
									{
										myArticles ?
											(
												myArticles.length === 0 ?
													<MC.TableRow
														className={classes.tableRow}
														style={{ borderBottom: "2px solid #222222" }}
														hover>
														<MC.TableCell colSpan={4} align="center">
															조회된 게시판 데이터가 한 건도 없네요.
														</MC.TableCell>
													</MC.TableRow>
													:
													myArticles.map(objView)
											)
											:
											<MC.TableRow
												className={classes.tableRow}
												style={{ borderBottom: "2px solid #222222" }}
												hover>
												<MC.TableCell colSpan={4} align="center">
													<MC.CircularProgress color="secondary" />
												</MC.TableCell>
											</MC.TableRow>
									}
								</MC.TableBody>

							</MC.Table>
						</div>
					</PerfectScrollbar>

				</MC.Grid>

				<MC.Grid item style={{ width: "100%", marginTop: 40 }}>
					<MC.Grid container direction={"row"} justify={isMobile ? "center" : "flex-end"} alignItems={"center"}>
						<MC.Button
							size="large"
							disableElevation
							style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
							onClick={() => handleDeleteAllClick()}>
							삭제
						</MC.Button>
					</MC.Grid>
				</MC.Grid>

				<MC.Grid item style={{ width: "100%", marginTop: 49 }}>
					<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
						<ML.Pagination
							count={getTotalPage()}
							page={pageInfo.page}
							onChange={handlePageChange}
							showFirstButton
							showLastButton />
					</MC.Grid>
				</MC.Grid>

			</MC.Grid>

		</div>
	);
};

export default MyArticles;
