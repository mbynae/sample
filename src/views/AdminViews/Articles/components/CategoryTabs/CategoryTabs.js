import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { toJS }                       from "mobx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const a11yProps = index => {
	return {
		id:              `tab-${index}`,
		"aria-controls": `tabpanel-${index}`
	};
};

const useStyles = MS.makeStyles(theme => ({
	root: {
		backgroundColor: theme.white
	}
}));

const CategoryTabs = props => {
	const classes = useStyles();
	
	const { ArticleStore, categories, getArticles, menuKey } = props;
	
	const [value, setValue] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	
	useEffect(() => {
		const init = () => {
			setTotalCount(0);
			
			let articleSearch = toJS(ArticleStore.articleSearch);
			if ( articleSearch.categoryId && categories.length > 0 ) {
				let findIndex = categories.findIndex(c => c.id === articleSearch.categoryId);
				setValue(findIndex + 1);
			} else {
				setValue(0);
			}
			
			categories.map(category => {
				setTotalCount(prev => {
					return prev + category.count;
				});
			});
		};
		setTimeout(() => {
			init();
		});
	}, [categories, menuKey]);
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
		
		let searchInfo = ArticleStore.articleSearch;
		
		if ( newValue > 0 ) {
			searchInfo = {
				...searchInfo,
				categoryId: categories[newValue - 1].id
			};
			ArticleStore.setArticleSearch(searchInfo);
		} else {
			searchInfo = {
				...searchInfo,
				categoryId: undefined
			};
			ArticleStore.setArticleSearch(searchInfo);
		}
		getArticles(0, ArticleStore.pageInfo.size);
	};
	
	return (
		<div className={"lmsTabs"}>
			<MC.AppBar position="static">
				<MC.Tabs
					key={`tabs-${menuKey}`}
					value={value}
					onChange={handleChange}
					aria-label="simple tabs example"
					style={{ backgroundColor: "#fff" }}
					textColor="primary">
					<MC.Tab label={`전체`} {...a11yProps(0)} />
					{/*<MC.Tab label={`전체(${totalCount})`} {...a11yProps(0)} />*/}
					{
						categories && categories.map((category, index) => (
							<MC.Tab key={index} label={`${category.name}`} {...a11yProps(index + 1)} />
							// <MC.Tab key={index} label={`${category.name}(${category.count})`} {...a11yProps(index + 1)} />
						))
					}
				</MC.Tabs>
			</MC.AppBar>
		</div>
	);
};

export default inject("ArticleStore")(withRouter(observer(CategoryTabs)));
