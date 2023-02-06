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

const AntTabs = MS.withStyles((theme) => ({
	root:      {
		paddingLeft: theme.spacing(1)
	},
	indicator: {
		backgroundColor: "#1890ff"
	}
}))(MC.Tabs);

const AntTab = MS.withStyles((theme) => ({
	root:     {
		textTransform: "none",
		minWidth:      72,
		fontWeight:    theme.typography.fontWeightRegular,
		marginRight:   theme.spacing(4),
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
			color:   "#40a9ff",
			opacity: 1
		},
		"&$selected":  {
			color:      "#1890ff",
			fontWeight: theme.typography.fontWeightMedium
		},
		"&:focus":     {
			color: "#40a9ff"
		}
	},
	selected: {}
}))((props) => <MC.Tab disableRipple {...props} />);

const useStyles = MS.makeStyles(theme => ({
	root: {
		backgroundColor: theme.white
	}
}));
const BoardTabs = props => {
	const classes = useStyles();
	
	const { menu, getArticles, setSelectMenuKey } = props;
	
	const [value, setValue] = useState(0);
	
	useEffect(() => {
		const init = () => {
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
		setSelectMenuKey(menu.childMenus[newValue].menuKey);
		getArticles(menu.childMenus[newValue].menuKey, menu.menuKey === "office");
	};
	
	const map = (childMenu, index) => (
		<AntTab key={index} label={`${childMenu.title}`} {...a11yProps(index)} />
	);
	return (
		<div className={"lmsTabs"}>
			<MC.AppBar position="static">
				<AntTabs
					value={value}
					onChange={handleChange}
					aria-label="simple tabs"
					style={{ backgroundColor: "#fff" }}
					textColor="primary">
					{
						menu && menu.childMenus && menu.childMenus.map(map)
					}
				</AntTabs>
			</MC.AppBar>
		</div>
	);
};

export default withRouter(BoardTabs);
