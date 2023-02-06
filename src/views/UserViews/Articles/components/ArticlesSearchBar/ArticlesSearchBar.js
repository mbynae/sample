import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import SearchIcon from "@material-ui/icons/Search";

import { PreviousLocationCheck } from "../../../../../components";

const useStyles = MS.makeStyles((theme) => ({
	root:       {
		width: "100%"
	},
	paper:      {
		paddingTop:    4,
		paddingBottom: 4,
		display:       "flex",
		alignItems:    "center",
		width:         "100%",
		height:        60,
		margin:        0
	},
	input:      {
		marginLeft: 24,
		flex:       1,
		fontSize:   16
	},
	iconButton: {
		width:           60,
		height:          60,
		padding:         0,
		backgroundColor: "#449CE8",
		borderRadius:    0,
		"&:hover":       {
			backgroundColor: "rgba(242,128,62 ,0.5)"
		}
	}
}));

const ArticlesSearchBar = props => {
	const classes = useStyles();

	const { board, ArticleStore, getArticles, menuKey } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, `/articles/${menuKey}`) ? allInitialize(ArticleStore.articleSearch) : allInitialize(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, [menuKey]);

	const allInitialize = async (articlesSearch) => {
		let tempSearchInfo = {
			searchText: articlesSearch ? articlesSearch.searchText : ""   // 검색 텍스트
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !articlesSearch ) {
			ArticleStore.setArticleSearch(tempSearchInfo);
			getArticles(1, 10);
		} else {
			getArticles(ArticleStore.pageInfo.page === 0 ? 1 : ArticleStore.pageInfo.page, ArticleStore.pageInfo.size);
		}
	};

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setSearchInfo({
			...searchInfo,
			[name]: value
		});
	};

	const handleSearchList = event => {
		event.preventDefault();
		ArticleStore.setArticleSearch(searchInfo);
		getArticles(1, ArticleStore.pageInfo.size);
	};

	return (
		<div className={classes.root}>
			<form onSubmit={handleSearchList} style={{ width: "100%" }}>
				<MC.Paper component="div" elevation={2} className={classes.paper}>
					<MC.InputBase
						className={classes.input}
						placeholder={`${board.name}을(를) 검색해주세요.`}
						inputProps={{ "aria-label": `${board.name}을(를) 검색해주세요.` }}
						name="searchText"
						value={searchInfo.searchText || ""}
						onChange={handleChange}
					/>
					<MC.IconButton type="submit" className={classes.iconButton} aria-label="search">
						<SearchIcon style={{ color: "#ffffff" }} fontSize={"large"} />
					</MC.IconButton>
				</MC.Paper>
			</form>
		</div>
	);

};

export default inject("ArticleStore")(withRouter(observer(ArticlesSearchBar)));
