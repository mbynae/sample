import React, { useEffect, useState } from "react";
import { withRouter }                 from "react-router-dom";

import * as MC  from "@material-ui/core";
import * as MS  from "@material-ui/styles";
import { toJS } from "mobx";

const a11yProps = index => {
	return {
		id:              `tab-${index}`,
		"aria-controls": `tabpanel-${index}`
	};
};

const AntTabs = MS.withStyles((theme) => ({
	root:          {
		// paddingLeft: theme.spacing(1)
	},
	scrollButtons: {
		color: "#222222"
	},
	indicator:     {
		backgroundColor: "#449CE8"
	}
}))(MC.Tabs);

const AntTab = MS.withStyles((theme) => ({
	root:     {
		textTransform: "none",
		minWidth:      72,
		color:         "#bcbcbc",
		fontWeight:    theme.typography.fontWeightRegular,
		marginRight:   theme.spacing(1),
		fontFamily:    [
			               "-apple-system",
			               "BlinkMacSystemFont",
			               "\"Segoe UI\"",
			               "Roboto",
			               "\"Helvetica Neue\"",
			               "Arial",
			               "sans-serif",
			               "\"Apple Color Emoji\"",
			               "\"Segoe UI Emoji\"",
			               "\"Segoe UI Symbol\""
		               ].join(","),
		"&:hover":     {
			color:   "#449CE8",
			opacity: 1
		},
		"&$selected":  {
			color:      "#222222",
			fontSize:   14,
			fontWeight: theme.typography.fontWeightBold
		},
		"&:focus":     {
			color: "#222222"
		}
	},
	selected: {}
}))((props) => <MC.Tab disableRipple {...props} />);

const useStyles = MS.makeStyles(theme => ({
	root: {
		backgroundColor: theme.white
	}
}));
const CategoryTabs = props => {
	const classes = useStyles();

	const { CallBookStore, isMobile, categories, getCallBooks, menuKey } = props;

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
		getCallBooks(1, CallBookStore.pageInfo.size);
	};

	const map = (category, index) => (
		<AntTab key={index} label={`${category.name}(${category.count})`} {...a11yProps(index + 1)} />
	);
	return (
		<div className={"lmsTabs"}>
			<MC.AppBar position="static" elevation={0}>
				<AntTabs
					value={value}
					onChange={handleChange}
					aria-label="simple tabs"
					variant="scrollable"
					classes={{
						scrollButtons: classes.scrollButtons
					}}
					// scrollButtons={isMobile ? "on" : "auto"}
					style={{ backgroundColor: "#fff" }}
					textColor="primary">
					<AntTab label={`전체(${totalCount})`} {...a11yProps(0)} />
					{
						categories && categories.map(map)
					}
				</AntTabs>
			</MC.AppBar>
		</div>
	);
};

export default CategoryTabs;
