import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { toJS }                       from "mobx";

import * as MC                                from "@material-ui/core";
import * as MS                                from "@material-ui/styles";
import { articleRepository, boardRepository } from "../../../repositories";
import { AlertDialogUserView }                from "../../../components";
import { ArticleEditForm }                    from "./components";

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
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
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

const ArticleEdit = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	
	const { UserSignInStore, UserAptComplexStore, ArticleStore, history, match } = props;
	const { menuKey, id } = match.params;
	
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  "/"
		},
		{
			title: "게시판 관리",
			href:  "/articles"
		},
		{
			title: `게시판 관리 ${id ? "수정" : "등록"}`,
			href:  `/articles/edit${id ? "/" + id : ""}`
		}
	]);
	
	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
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
	
	// 게시판 관리 정보
	const [board, setBoard] = useState({});
	const [article, setArticle] = useState({});
	const [attachFiles, setAttachFiles] = useState([]);
	const [errors, setErrors] = useState({
		isTitle:    false,
		isCategory: false,
		isSecret:   false
	});
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const init = async () => {
			await getArticle(id);
		};
		
		setTimeout(async () => {
			await getBoard();
			if ( id ) {
				setIsEdit(true);
				await init();
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
			isSecret:            obj ? obj.isSecret : "none",
			author:              obj ? obj.author : {},
			category:            obj ? obj.category : {},
			categoryId:          obj && obj.category ? obj.category.id : 0,
			board:               obj ? obj.board : {},
			replyArticle:        obj ? obj.replyArticle : {},
			attachmentDataTypes: obj ? obj.attachmentDataTypes : [],
			baseDateDataType:    obj ? obj.baseDateDataType : {
				createDate:       new Date(),
				lastModifiedDate: new Date()
			}
		};
	};
	
	const allInitialize = (arrayObj) => {
		if ( arrayObj ) {
			arrayObj.sort(sort);
			let nowArticle = arrayObj.find(obj => obj.id === id * 1);
			setArticle(prev => setObj(prev, nowArticle));
		} else {
			setArticle(prev => setObj(prev, arrayObj));
		}
	};
	
	const getBoard = async () => {
		let searchParams = {};
		setAptId(searchParams);
		const board = await boardRepository.getBoardByMenuKey(menuKey, searchParams, true);
		setBoard(board);
		let rootUrl = `/${UserSignInStore.aptId}${UserSignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		setBreadcrumbs(prev => {
			prev = [
				{
					title: "관리자",
					href:  `${rootUrl}/dashboard`
				},
				{
					title: `${board.name} 게시판 관리`,
					href:  `${rootUrl}/articles/${menuKey}`
				},
				{
					title: `${board.name} 게시판 관리 ${id ? "수정" : "등록"}`,
					href:  `${rootUrl}/articles/${menuKey}/edit${id ? "/" + id : ""}`
				}
			];
			return [
				...prev
			];
		});
	};
	
	const handleEdit = () => {
		
		setErrors(prev => {
			return {
				...prev,
				isTitle:    false,
				isCategory: false,
				isSecret:   false
			};
		});
		
		if (
			!(
				article.title === "" ||
				(menuKey !== "suggestions" && article.categoryId === 0) ||
				((menuKey === "suggestions" || menuKey === "complaints") && article.isSecret === "none")
			)
		) {
			if ( isEdit ) {
				// 수정
				updateArticle();
			} else {
				// 등록
				saveArticle();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isTitle:    article.title === "",
					isCategory: (menuKey !== "suggestions" && article.categoryId === 0),
					isSecret:   ((menuKey === "suggestions" || menuKey === "complaints") && article.isSecret === "none")
				};
			});
		}
	};
	
	const updateArticle = () => {
		let updateParams = {
			...article,
			files: attachFiles
		};
		setAptId(updateParams);
		if ( updateParams.isSecret === "none" ) {
			updateParams.isSecret = false;
		}
		
		if ( updateParams.categoryId === 0 ) {
			delete updateParams.categoryId;
		}
		
		articleRepository
			.updateArticle(id, updateParams, true)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					undefined,
					"수정완료했습니다.",
					undefined,
					() => {
						setAlertOpens(prev => { return { ...prev, isOpen: false }; });
						history.push(`${rootUrl}/articles/${menuKey}/` + id);
					},
					undefined
				);
			});
	};
	
	const saveArticle = () => {
		let tempArticle = article;
		if ( menuKey === "fleaMarket" ) {
			tempArticle.transactionType = "TRANSACTION_STATUS";
		}
		
		if ( tempArticle.isSecret === "none" ) {
			tempArticle.isSecret = false;
		}
		
		if ( tempArticle.categoryId === 0 ) {
			delete tempArticle.categoryId;
		}
		
		let saveParams = {
			...tempArticle,
			menuKey: menuKey,
			files:   attachFiles
		};
		setAptId(saveParams);
		articleRepository
			.saveArticle(saveParams, true)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					undefined,
					"등록완료했습니다.",
					undefined,
					() => {
						setAlertOpens(prev => { return { ...prev, isOpen: false }; });
						history.push(`${rootUrl}/articles/${menuKey}/` + result.id);
					},
					undefined
				);
			});
	};
	
	const setAptId = (obj) => {
		if ( !(menuKey === "migoNotice" || menuKey === "ticket") ) {
			obj.aptId = UserAptComplexStore.aptComplex.id;
		}
	};
	
	const handleGoBack = () => {
		history.goBack();
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
												<ArticleEditForm
													isEdit={isEdit}
													isMobile={isMobile}
													menuKey={menuKey}
													aptId={UserAptComplexStore.aptComplex.id}
													board={board}
													article={article}
													setArticle={setArticle}
													attachFiles={attachFiles}
													setAttachFiles={setAttachFiles}
													errors={errors} />
											</MC.Grid>
											
											<MC.Grid item xs={12} md={12} style={{ width: "100%", marginTop: 40 }}>
												<MC.Grid container justify={"center"} alignItems={"center"}>
													<MC.Button
														size="large"
														disableElevation
														style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
														onClick={handleGoBack}>
														취소
													</MC.Button>
													<MC.Button
														variant="contained"
														size="large"
														color="primary"
														disableElevation
														style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)", marginLeft: 10 }}
														onClick={handleEdit}>
														저장
													</MC.Button>
												</MC.Grid>
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

export default inject("UserSignInStore", "UserAptComplexStore", "ArticleStore")(observer(ArticleEdit));
