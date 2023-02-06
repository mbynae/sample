import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { toJS }                       from "mobx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { articleRepository, boardRepository } from "../../../repositories";
import { AlertDialog, AlertDialogUserView }   from "../../../components";
import { ArticleDetailForm }                  from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background:        {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          162,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:           {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		maxWidth:                       "1180px",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	layout:            {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width:                          "100%",
		paddingTop:                     73,
		paddingBottom:                  80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			padding:       0,
			paddingTop:    0,
			paddingBottom: 80
		}
	},
	buttonLayoutRight: {
		// padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	}
}));

const ArticleDetail = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	
	const { UserSignInStore, UserAptComplexStore, ArticleStore, history, match } = props;
	const { menuKey, id } = match.params;
	
	const [currentUser, setCurrentUser] = useState({});
	const [rootUrl, setRootUrl] = useState("");
	// const [breadcrumbs, setBreadcrumbs] = useState([
	// 	{
	// 		title: "관리자",
	// 		href:  "/"
	// 	},
	// 	{
	// 		title: "게시판 관리",
	// 		href:  "/articles"
	// 	},
	// 	{
	// 		title: `게시판 관리 상세`,
	// 		href:  `/articles/edit/${id}`
	// 	}
	// ]);
	
	const [loading, setLoading] = useState(true);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		noTitle:       "",
		yesTitle:      "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle(),
		isOpenType:    false,
		type:          ""
	});
	const handleAlertToggle = (key, title, content, yesTitle, yesCallback, noTitle, noCallback, type) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					noTitle,
					yesTitle,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback(),
					type
				};
			}
		);
	};
	
	// 게시글 관리 정보
	const [article, setArticle] = useState({});
	const [beforeArticle, setBeforeArticle] = useState({});
	const [afterArticle, setAfterArticle] = useState({});
	const [board, setBoard] = useState({});
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const init = async () => {
			await getArticle(id);
		};
		
		setTimeout(async () => {
			await getBoard();
			if ( id ) {
				await init(id);
			} else {
				setLoading(false);
				allInitialize(undefined);
			}
		}, 100);
	}, [id]);
	
	const getArticle = async (id) => {
		let searchInfo = toJS(ArticleStore.articleSearch);
		let articleSearch = {};
		
		if ( searchInfo.searchText ) {
			articleSearch.searchText = searchInfo.searchText;
		}
		
		if ( searchInfo.categoryId ) {
			articleSearch.categoryId = searchInfo.categoryId;
		}
		setAptId(articleSearch);
		articleRepository
			.getArticle(id,
				{
					...articleSearch,
					menuKey: menuKey
				}, true)
			.then(result => {
				allInitialize(result);
				setLoading(false);
			});
	};
	
	const sort = (a, b) => a.baseDateDataType.createDate - b.baseDateDataType.createDate;
	const setObj = (prev, obj) => {
		return {
			...prev,
			id:                  obj ? obj.id : "",
			isReply:             obj ? obj.isReply : false,
			title:               obj ? obj.title : "",
			content:             obj ? obj.content : "",
			transactionType:     obj ? obj.transactionType : "",
			isSecret:            obj ? obj.isSecret : "",
			author:              obj ? obj.author : {},
			category:            obj ? obj.category : {},
			board:               obj ? obj.board : {},
			replyArticle:        obj ? obj.replyArticle : {},
			comments:            obj ? obj.comments : [],
			attachmentDataTypes: obj ? obj.attachmentDataTypes : [],
			baseDateDataType:    obj ? obj.baseDateDataType : {
				createDate:       new Date(),
				lastModifiedDate: new Date()
			}
		};
	};
	
	const allInitialize = (arrayObj) => {
		arrayObj.sort(sort);
		let nowArticle = arrayObj.find(obj => obj.id === id * 1);
		setArticle(prev => setObj(prev, nowArticle));
		if ( arrayObj.length === 3 ) {
			setBeforeArticle(prev => setObj(prev, arrayObj[0]));
			setAfterArticle(prev => setObj(prev, arrayObj[2]));
		} else if ( arrayObj.length === 2 ) {
			let findIndex = arrayObj.findIndex(obj => obj.id === id * 1);
			if ( findIndex === 0 ) {
				setBeforeArticle(prev => setObj(prev, undefined));
				setAfterArticle(prev => setObj(prev, arrayObj[1]));
			} else {
				setBeforeArticle(prev => setObj(prev, arrayObj[0]));
				setAfterArticle(prev => setObj(prev, undefined));
			}
		}
	};
	
	const getBoard = async () => {
		setCurrentUser(prev => {
			return {
				...toJS(UserSignInStore.currentUser)
			};
		});
		let searchParams = {};
		setAptId(searchParams);
		const board = await boardRepository.getBoardByMenuKey(menuKey, searchParams, true);
		setBoard(board);
		let rootUrl = `/${UserSignInStore.aptId}${UserSignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		// await setBreadcrumbs(prev => {
		// 	prev = [
		// 		{
		// 			title: "관리자",
		// 			href:  `${rootUrl}/dashboard`
		// 		},
		// 		{
		// 			title: `${board.name} 게시판 관리`,
		// 			href:  `${rootUrl}/articles/${menuKey}`
		// 		},
		// 		{
		// 			title: `${board.name} 게시판 관리 상세`,
		// 			href:  `${rootUrl}/articles/${menuKey}/${id}`
		// 		}
		// 	];
		// 	return [
		// 		...prev
		// 	];
		// });
	};
	
	const setAptId = (obj) => {
		if ( !(menuKey === "migoNotice" || menuKey === "ticket") ) {
			obj.aptId = UserAptComplexStore.aptComplex.id;
		}
	};
	
	const handleEdit = () => {
		history.push(`${rootUrl}/articles/${menuKey}/edit/` + id);
	};
	
	const handleGoBack = () => {
		history.push(`${rootUrl}/articles/${menuKey}`);
	};
	
	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"게시글에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 게시글을 삭제하겠습니까?",
			"삭제",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				articleRepository
					.removeArticle(id, true)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							undefined,
							"게시글 정보 삭제 하였습니다.",
							undefined,
							() => {
								history.push(`${rootUrl}/articles/${menuKey}`);
								setAlertOpens({ ...alertOpens, isOpen: false });
							}
						);
					});
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};
	
	return (
		<div className={classes.root}>
			
			
			{
				!isMobile &&
				<div className={classes.background} />
			}
			
			{
				!loading && (
					<>
						{/*<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />*/}
						<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
						         className={classes.content}>
							<div className={classes.layout}>
								<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
									
									{
										!isMobile &&
										<MC.Grid item style={{ width: "100%" }}>
											<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
												<MC.Grid item>
													<MC.Typography variant="h3">
														{board.name}
													</MC.Typography>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
									}
									
									<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 31 : 111, paddingLeft: 16, paddingRight: 16 }}>
										
										<MC.Grid
											container
											justify={"space-between"}
											alignItems={"flex-start"}>
											
											<MC.Grid item xs={12} md={12}>
												<ArticleDetailForm
													rootUrl={rootUrl}
													board={board}
													menuKey={menuKey}
													isMobile={isMobile}
													article={article}
													beforeArticle={beforeArticle}
													afterArticle={afterArticle}
													getArticle={getArticle}
													setArticle={setArticle}
													history={history}
													UserSignInStore={UserSignInStore} />
											</MC.Grid>
											
											<MC.Grid item xs={6} md={6} style={{ width: "100%", marginTop: 40 }}>
												{
													menuKey !== "migoNotice" &&
													<MC.Button
														size="large"
														disableElevation
														style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
														onClick={handleGoBack}>
														목록
													</MC.Button>
												}
											</MC.Grid>
											
											<MC.Grid item xs={6} md={6}
											         className={classes.buttonLayoutRight}
											         style={{ width: "100%", marginTop: 40 }}>
												{
													menuKey !== "migoNotice" &&
													(
													currentUser.id === article.author.id &&
													<>
														<MC.Button
															size="large"
															disableElevation
															style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
															onClick={handleDelete}>
															삭제
														</MC.Button>
														<MC.Button
															size="large"
															disableElevation
															style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
															onClick={handleEdit}>
															수정
														</MC.Button>
													</>
													)
												}
											</MC.Grid>
										</MC.Grid>
									
									</MC.Grid>
								</MC.Grid>
							</div>
						</MC.Grid>
					</>
				)
			}
			
			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
			/>
			
			<AlertDialogUserView
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
				noTitle={alertOpens.noTitle}
				yesTitle={alertOpens.yesTitle}
			/>
		
		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore", "ArticleStore")(observer(ArticleDetail));
