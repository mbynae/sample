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

const CallBooksSearchBar = props => {
	const classes = useStyles();

	const { CallBookStore, getCallBooks } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/callBook") ? allInitialize(CallBookStore.callBookSearch) : allInitialize(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const allInitialize = async (callBooksSearch) => {
		let tempSearchInfo = {
			title: callBooksSearch ? callBooksSearch.title : ""   // 명칭
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !callBooksSearch ) {
			CallBookStore.setCallBookSearch(tempSearchInfo);
			getCallBooks(1, 10);
		} else {
			getCallBooks(CallBookStore.pageInfo.page, CallBookStore.pageInfo.size);
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
		CallBookStore.setCallBookSearch(searchInfo);
		getCallBooks(1, CallBookStore.pageInfo.size);
	};

	return (
		<div className={classes.root}>
			<form onSubmit={handleSearchList} style={{ width: "100%" }}>
				<MC.Paper component="div" elevation={2} className={classes.paper}>
					<MC.InputBase
						className={classes.input}
						placeholder={`명칭을 검색해주세요.`}
						inputProps={{ "aria-label": `명칭을 검색해주세요.` }}
						name="title"
						value={searchInfo.title || ""}
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

export default inject("CallBookStore")(withRouter(observer(CallBooksSearchBar)));
