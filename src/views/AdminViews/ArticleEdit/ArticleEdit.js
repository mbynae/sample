import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                                from "../../../theme/adminTheme/palette";
import { articleRepository, boardRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }  from "../../../components";
import { ArticleEditForm }                    from "./components";
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

const ArticleEdit = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, ArticleStore, history, match } = props;
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
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});

	// 게시판 관리 정보
	const [board, setBoard] = useState({});
	const [article, setArticle] = useState({});
	const [attachFiles, setAttachFiles] = useState([]);
	const [errors, setErrors] = useState({
		isTitle:    false,
		isCategory: false
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
			categoryId:          obj && obj.category ? obj.category.id : "",
			board:               obj ? obj.board : {},
			replyArticle:        obj ? obj.replyArticle : {},
			attachmentDataTypes: obj ? obj.attachmentDataTypes : [],
			baseDateDataType:    obj ? obj.baseDateDataType : {
				createDate:       new Date(),
				lastModifiedDate: new Date()
			},
			isSchedule: 					obj ? obj.isSchedule : false,
			startDate:						obj ? obj.startDate : "",
			endDate: 							obj ? obj.endDate : "",
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
		const board = await boardRepository.getBoardByMenuKey(menuKey, searchParams);
		setBoard(board);
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
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

		if (!(article.title === "" || article.categoryId === "")) {
			if ( isEdit ) {
				// 수정
				updateArticle();
			} else {
				// 등록
				saveArticle();
			}
		} else {
			// 게시판 카테고리, 제목에 대한 Validation 적용 (Empty)
			setErrors(prev => {
				return {
					...prev,
					isTitle:    article.title === "",
					isCategory: article.categoryId === ""
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

		articleRepository
			.updateArticle(id, updateParams)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"게시글 수정 완료",
					article.title + " 게시글 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
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
		let saveParams = {
			...tempArticle,
			menuKey: menuKey,
			files:   attachFiles
		};
		setAptId(saveParams);
		articleRepository
			.saveArticle(saveParams)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"게시글 생성 완료",
					article.title + " 게시글 생성이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/articles/${menuKey}/` + result.id);
					},
					undefined
				);
			});
	};

	const setAptId = (obj) => {
		if ( !(menuKey === "migoNotice" || menuKey === "ticket") ) {
			obj.aptId = AptComplexStore.aptComplex.id;
		}
	};

	const handleGoBack = () => {
		history.goBack();
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
			{!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>

							<MC.Typography variant="h2" gutterBottom>
								{board.name} 게시판&nbsp;
								{
									isEdit ? "수정" : "등록"
								}
							</MC.Typography>
							<MC.Divider className={classes.divider} />

							<MC.Paper elevation={2} className={classes.paper}>

								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>

									<MC.Grid item xs={12} md={12}>
										<ArticleEditForm
											isEdit={isEdit}
											menuKey={menuKey}
											aptId={AptComplexStore.aptComplex.id}
											board={board}
											article={article}
											setArticle={setArticle}
											attachFiles={attachFiles}
											setAttachFiles={setAttachFiles}
											errors={errors}
											setErrors={setErrors}
										/>
									</MC.Grid>

									<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
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
												onClick={handleGoBack}>
												취소
											</MC.Button>
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleEdit}>
												{
													isEdit ? "수정" : "등록"
												}
											</MC.Button>
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

export default inject("SignInStore", "AptComplexStore", "ArticleStore")(observer(ArticleEdit));
