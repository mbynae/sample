import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { articleRepository, boardRepository, categoryRepository } from "../../../repositories";

import { ArticlesSearchBar, ArticlesTable } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:       {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background: {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          245,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:    {
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
	layout:     {
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
	}
}));

const Articles = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, ArticleStore, match } = props;
	const { menuKey } = match.params;

	const [isLoading, setIsLoading] = useState(true);
	const [rootUrl, setRootUrl] = useState("");
	const [board, setBoard] = useState({});
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `게시판 관리`,
			href:  `${rootUrl}/articles/${menuKey}`
		}
	]);

	const [articles, setArticles] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  ArticleStore.pageInfo.page,
		size:  ArticleStore.pageInfo.size,
		total: ArticleStore.pageInfo.total
	});

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let searchParams = {};
			setAptId(searchParams);
			const board = await boardRepository.getBoardByMenuKey(menuKey, searchParams, true);
			await setBoard(board);
			let rootUrl = `/${UserAptComplexStore.aptComplex.aptId}`;
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
					}
				];
				return [
					...prev
				];
			});
			await getCategories();
			setIsLoading(false);
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [menuKey]);

	const sort = (a, b) => a.sequence - b.sequence;

	const setAptId = (obj) => {
		if ( !(menuKey === "migoNotice" || menuKey === "ticket") ) {
			obj.aptId = UserAptComplexStore.aptComplex.id;
		}
	};

	const getCategories = async () => {
		let searchParams = {
			menuKey: menuKey
		};
		setAptId(searchParams);
		const categories = await categoryRepository.getCategories(searchParams, true);
		setCategories(categories.sort(sort));
	};

	const getArticles = async (page = 1, size = 10) => {
		let searchInfo = toJS(ArticleStore.articleSearch);
		let articleSearch = {};

		setAptId(articleSearch);

		if ( searchInfo.searchText ) {
			articleSearch.searchText = searchInfo.searchText;
		}

		if ( searchInfo.categoryId ) {
			articleSearch.categoryId = searchInfo.categoryId;
		}

		let findArticles = await articleRepository.getArticles({
			...articleSearch,
			menuKey:   menuKey,
			direction: "DESC",
			page:      page - 1,
			size:      size,
			sort:      "baseDateDataType.createDate"
		}, true);

		setArticles(findArticles.content);
		setPageInfo({
			page:  findArticles.pageable.page + 1,
			size:  findArticles.pageable.size,
			total: findArticles.total
		});

		ArticleStore.setPageInfo({
			page:  findArticles.pageable.page + 1,
			size:  findArticles.pageable.size,
			total: findArticles.total
		});
	};

	return (
		<div className={classes.root}>

			{
				!isMobile &&
				<div className={classes.background} />
			}

			{/*<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />*/}
			{
				!isLoading &&
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
							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 0 : 84 }}>
								<ArticlesSearchBar
									board={board}
									getArticles={getArticles}
									menuKey={menuKey} />
							</MC.Grid>

							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 30 : 61, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
								<ArticlesTable
									isMobile={isMobile}
									ArticleStore={ArticleStore}
									board={board}
									currentUser={toJS(UserSignInStore.currentUser)}
									menuKey={menuKey}
									rootUrl={rootUrl}
									getArticles={getArticles}
									history={props.history}
									articles={articles}
									categories={categories}
									pageInfo={pageInfo}
									setPageInfo={setPageInfo} />
							</MC.Grid>

						</MC.Grid>
					</div>

				</MC.Grid>
			}

		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore", "ArticleStore")(observer(Articles));
