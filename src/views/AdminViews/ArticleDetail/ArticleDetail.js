import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                                from "../../../theme/adminTheme/palette";
import { articleRepository, boardRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }  from "../../../components";
import { ArticleDetailForm }                  from "./components";
import { toJS }                               from "mobx";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	paper:             {
		padding: theme.spacing(2)
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	}
}));

const ArticleDetail = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, ArticleStore, history, match } = props;
	const { menuKey, id } = match.params;

	const [currentUser, setCurrentUser] = useState({});
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
			title: `게시판 관리 상세`,
			href:  `/articles/edit/${id}`
		}
	]);

	const [loading, setLoading] = useState(true);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});

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
				})
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
				...toJS(SignInStore.currentUser)
			};
		});
		let searchParams = {};
		setAptId(searchParams);
		const board = await boardRepository.getBoardByMenuKey(menuKey, searchParams);
		setBoard(board);
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		await setBreadcrumbs(prev => {
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
					title: `${board.name} 게시판 관리 상세`,
					href:  `${rootUrl}/articles/${menuKey}/${id}`
				}
			];
			return [
				...prev
			];
		});
	};

	const setAptId = (obj) => {
		if ( !(menuKey === "migoNotice" || menuKey === "ticket") ) {
			obj.aptId = AptComplexStore.aptComplex.id;
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
			"게시글 삭제",
			"게시글에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 게시글을 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				articleRepository
					.removeArticle(id)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"게시글 정보 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/articles/${menuKey}`);
								setAlertOpens({ ...alertOpens, isOpen: false });
							}
						);
					});
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

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

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>

							<MC.Typography variant="h2" gutterBottom>
								{board.name} 게시글 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />

							<MC.Paper elevation={2} className={classes.paper}>

								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>

									<MC.Grid item xs={12} md={12}>
										<ArticleDetailForm
											rootUrl={rootUrl}
											board={board}
											menuKey={menuKey}
											article={article}
											beforeArticle={beforeArticle}
											afterArticle={afterArticle}
											getArticle={getArticle}
											setArticle={setArticle}
											history={history}
											SignInStore={SignInStore} />
									</MC.Grid>

									<MC.Grid item xs={6} md={6}>
										{
											menuKey !== "migoNotice" &&
											<MC.ButtonGroup
												aria-label="text primary button group"
												size="large"
												style={{ marginTop: 12 }}
												color="primary">
												<MC.Button
													style={{
														color:                  palette.error.main,
														borderColor:            palette.error.main,
														marginLeft:             10,
														borderTopLeftRadius:    4,
														borderBottomLeftRadius: 4
													}}
													onClick={handleDelete}>
													삭제
												</MC.Button>
											</MC.ButtonGroup>
										}
									</MC.Grid>

									<MC.Grid item xs={6} md={6}
									         className={classes.buttonLayoutRight}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleGoBack}>
												목록보기
											</MC.Button>
											{
												menuKey !== "migoNotice" &&
												(
												currentUser.id === article.author.id &&
												<MC.Button
													variant="outlined"
													color="primary"
													onClick={handleEdit}>
													수정
												</MC.Button>
												)
											}
										</MC.ButtonGroup>
									</MC.Grid>

								</MC.Grid>
							</MC.Paper>
						</div>
					</>
				)
			}

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

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "ArticleStore")(observer(ArticleDetail));
