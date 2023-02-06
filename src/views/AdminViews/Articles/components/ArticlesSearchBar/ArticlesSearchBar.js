import React, { useEffect, useState } from "react";
import moment                         from "moment";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC        from "@material-ui/core";
import * as MS        from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "moment/locale/ko";

import { PreviousLocationCheck } from "../../../../../components";

moment.locale("ko");

const useStyles = MS.makeStyles((theme) => ({
	root:                  {
		width:     "100%",
		marginTop: 16
	},
	heading:               {
		fontSize:   theme.typography.pxToRem(15),
		flexBasis:  "15%",
		flexShrink: 0,
		color:      theme.palette.secondary.contrastText
	},
	secondaryHeading:      {
		fontSize: theme.typography.pxToRem(13),
		color:    theme.palette.secondary.contrastText
	},
	formControl:           {
		margin:       theme.spacing(0),
		marginBottom: 10
	},
	buttonGroupLayout:     {
		display:        "flex",
		justifyContent: "center"
	},
	expansionPanelSummary: {
		backgroundColor: theme.palette.info.light
	},
	cardHeader:            {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	keyboardDatePicker:    {
		width: "100%"
	},
	primaryButton:         {
		color:       theme.palette.primary.main,
		borderColor: theme.palette.primary.main
	},
	secondaryButton:       {
		color:       theme.palette.secondary.main,
		borderColor: theme.palette.secondary.main
	},
	colorWhite:            {
		color: theme.palette.white
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
			getArticles(0, 10);
		} else {
			getArticles(ArticleStore.pageInfo.page, ArticleStore.pageInfo.size);
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
		getArticles(0, ArticleStore.pageInfo.size);
	};
	
	return (
		<div className={classes.root}>
			<MC.Accordion square>
				{/*expanded={true}>*/}
				
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon className={classes.colorWhite} />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<MC.Typography className={classes.heading}>
						{board.name} 게시판 검색필터
					</MC.Typography>
					<MC.Typography className={classes.secondaryHeading}>
						검색 하려면 여기를 클릭해주세요.
					</MC.Typography>
				</MC.AccordionSummary>
				
				<MC.AccordionDetails>
					<form onSubmit={handleSearchList} style={{ width: "100%" }}>
						<MC.Grid
							container
							spacing={3}
							justify={"space-between"}
							alignItems={"flex-start"}>
							
							<MC.Grid item xs={12} md={12}>
								<MC.Grid container spacing={3}>
									<MC.Grid item xs={12} md={12}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="searchText-basic"
												name="searchText"
												label="제목+내용"
												value={searchInfo.searchText || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
							
							{/*하단 검색 버튼 그룹*/}
							<MC.Grid item xs={12} md={12}>
								<div className={classes.buttonGroupLayout}>
									<MC.ButtonGroup
										aria-label="text primary button group"
										color="primary">
										<MC.Button
											className={classes.primaryButton}
											onClick={() => allInitialize(undefined)}>
											초기화
										</MC.Button>
										<MC.Button
											className={classes.secondaryButton}
											type={"submit"}>
											검색
										</MC.Button>
									</MC.ButtonGroup>
								</div>
							</MC.Grid>
						
						</MC.Grid>
					</form>
				</MC.AccordionDetails>
			
			</MC.Accordion>
		</div>
	);
	
};

export default inject("ArticleStore")(withRouter(observer(ArticlesSearchBar)));
