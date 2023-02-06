import React, { useEffect, useState } from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb } from "../../../components";
import {
	articleRepository,
	boardRepository,
	categoryRepository,
} from "../../../repositories";

import { ArticlesSearchBar, ArticlesTable, CategoryDialog } from "./components";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3),
	},
	content: {
		marginTop: theme.spacing(2),
	},
}));

const Articles = (props) => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, ArticleStore, match } = props;
	const { menuKey } = match.params;

	const [rootUrl, setRootUrl] = useState("");
	const [board, setBoard] = useState({});
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href: `${rootUrl}/dashboard`,
		},
		{
			title: `게시판 관리`,
			href: `${rootUrl}/articles/${menuKey}`,
		},
	]);

	const [articles, setArticles] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page: ArticleStore.pageInfo.page,
		size: ArticleStore.pageInfo.size,
		total: ArticleStore.pageInfo.total,
	});

	const [categories, setCategories] = useState([]);
	const [categoryOpen, setCategoryOpen] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let searchParams = {};
			setAptId(searchParams);
			const board = await boardRepository.getBoardByMenuKey(
				menuKey,
				searchParams
			);
			await setBoard(board);
			let rootUrl = `/${SignInStore.aptId}${
				SignInStore.isAdmin ? "/admin" : ""
			}`;
			await setRootUrl(rootUrl);
			await setBreadcrumbs((prev) => {
				prev = [
					{
						title: "관리자",
						href: `${rootUrl}/dashboard`,
					},
					{
						title: `${board.name} 게시판 관리`,
						href: `${rootUrl}/articles/${menuKey}`,
					},
				];
				return [...prev];
			});
			await getCategories();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [menuKey]);

	const sort = (a, b) => a.sequence - b.sequence;

	const setAptId = (obj) => {
		if (!(menuKey === "ticket")) {
			obj.aptId = AptComplexStore.aptComplex.id;
		}
	};

	const getCategories = async () => {
		let searchParams = {
			menuKey: menuKey,
		};
		setAptId(searchParams);
		const categories = await categoryRepository.getCategories(searchParams);
		setCategories(categories.sort(sort));
	};

	const getArticles = async (page, size) => {
		let searchInfo = toJS(ArticleStore.articleSearch);
		let articleSearch = {};

		setAptId(articleSearch);

		if (searchInfo.searchText) {
			articleSearch.searchText = searchInfo.searchText;
		}

		if (searchInfo.categoryId) {
			articleSearch.categoryId = searchInfo.categoryId;
		}

		let findArticles = await articleRepository.getArticles({
			...articleSearch,
			menuKey: menuKey,
			direction: "DESC",
			page: page ? page : 0,
			size: size ? size : 10,
			sort: "baseDateDataType.createDate",
		});

		setArticles(findArticles.content);
		setPageInfo({
			page: findArticles.pageable.page,
			size: findArticles.pageable.size,
			total: findArticles.total,
		});

		ArticleStore.setPageInfo({
			page: findArticles.pageable.page,
			size: findArticles.pageable.size,
			total: findArticles.total,
		});
	};

	const handleClickOpen = () => {
		setCategoryOpen(true);
	};

	const handleClickClose = () => {
		setCategoryOpen(false);
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<ArticlesSearchBar
				board={board}
				getArticles={getArticles}
				menuKey={menuKey}
			/>
			<div className={classes.content}>
				<ArticlesTable
					board={board}
					menuKey={menuKey}
					rootUrl={rootUrl}
					getArticles={getArticles}
					history={props.history}
					articles={articles}
					categories={categories}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
				/>
			</div>

			{!(
				menuKey === "migoNotice" ||
				menuKey === "ticket" ||
				menuKey === "suggestions"
			) && (
				<MC.Grid container style={{ marginTop: 10 }}>
					<MC.Grid item xs={12} md={12}>
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary"
						>
							<MC.Button onClick={handleClickOpen}>카테고리 관리</MC.Button>
						</MC.ButtonGroup>
					</MC.Grid>
				</MC.Grid>
			)}

			<CategoryDialog
				categories={categories}
				setCategories={setCategories}
				menuKey={menuKey}
				aptId={AptComplexStore.aptComplex.id}
				getCategories={getCategories}
				open={categoryOpen}
				onClose={handleClickClose}
			/>
		</div>
	);
};

export default inject(
	"SignInStore",
	"AptComplexStore",
	"ArticleStore"
)(observer(Articles));
