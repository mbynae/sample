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
	
	const { CallBookStore, categories, getCallBooks, menuKey } = props;
	
	const [value, setValue] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	
	useEffect(() => {
		const init = () => {
			setTotalCount(0);
			
			let callBookSearch = toJS(CallBookStore.callBookSearch);
			if ( callBookSearch.categoryId && categories.length > 0 ) {
				let findIndex = categories.findIndex(c => c.id === callBookSearch.categoryId);
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
		
		let searchInfo = CallBookStore.callBookSearch;
		
		if ( newValue > 0 ) {
			searchInfo = {
				...searchInfo,
				categoryId: categories[newValue - 1].id
			};
			CallBookStore.setCallBookSearch(searchInfo);
		} else {
			searchInfo = {
				...searchInfo,
				categoryId: undefined
			};
			CallBookStore.setCallBookSearch(searchInfo);
		}
		getCallBooks(0, CallBookStore.pageInfo.size);
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
					<MC.Tab label={`전체(${totalCount})`} {...a11yProps(0)} />
					{
						categories && categories.map((category, index) => (
							<MC.Tab key={index} label={`${category.name}(${category.count})`} {...a11yProps(index + 1)} />
						))
					}
				</MC.Tabs>
			</MC.AppBar>
		</div>
	);
};

export default inject("CallBookStore")(withRouter(observer(CategoryTabs)));
