import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }                   from "../../../components";
import { callBookRepository, categoryRepository } from "../../../repositories";

import { CallBooksSearchBar, CallBooksTable, CategoryDialog } from "./components";
import { ArticlesTable }                                      from "../Articles/components";

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

const CallBooks = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	
	const { UserSignInStore, UserAptComplexStore, CallBookStore } = props;
	
	const [isLoading, setIsLoading] = useState(true);
	const [menuKey] = useState("callBook");
	const [rootUrl, setRootUrl] = useState("");
	
	// const [breadcrumbs, setBreadcrumbs] = useState([
	// 	{
	// 		title: "관리자",
	// 		href:  `${rootUrl}/dashboard`
	// 	},
	// 	{
	// 		title: `전화번호부 관리`,
	// 		href:  `${rootUrl}/callBook`
	// 	}
	// ]);
	
	const [callBooks, setCallBooks] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  CallBookStore.pageInfo.page,
		size:  CallBookStore.pageInfo.size,
		total: CallBookStore.pageInfo.total
	});
	
	const [categories, setCategories] = useState([]);
	
	const generateRootUrl = async () => {
		let rootUrl = `/${UserSignInStore.aptId}${UserSignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let rootUrl = await generateRootUrl();
			// await setBreadcrumbs(prev => {
			// 	prev = [
			// 		{
			// 			title: "관리자",
			// 			href:  `${rootUrl}/dashboard`
			// 		},
			// 		{
			// 			title: `전화번호부 관리`,
			// 			href:  `${rootUrl}/callBook`
			// 		}
			// 	];
			// 	return [
			// 		...prev
			// 	];
			// });
			await getCategories();
			setIsLoading(false);
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const sort = (a, b) => a.sequence - b.sequence;
	
	const getCategories = async () => {
		let searchParams = {
			aptId:   UserAptComplexStore.aptComplex.id,
			menuKey: menuKey
		};
		const categories = await categoryRepository.getCategories(searchParams, true);
		setCategories(categories.sort(sort));
	};
	
	const getCallBooks = async (page = 1, size = 10) => {
		let searchInfo = toJS(CallBookStore.callBookSearch);
		let callBookSearch = {
			aptId: UserAptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.title ) {
			callBookSearch.title = searchInfo.title;
		}
		
		if ( searchInfo.categoryId ) {
			callBookSearch.categoryId = searchInfo.categoryId;
		}
		
		let findCallBooks = await callBookRepository.getCallBooks({
			...callBookSearch,
			direction: "DESC",
			page:      page - 1,
			size:      size,
			sort:      "id"
		}, true);
		
		setCallBooks(findCallBooks.content);
		setPageInfo({
			page:  findCallBooks.pageable.page + 1,
			size:  findCallBooks.pageable.size,
			total: findCallBooks.total
		});
		
		CallBookStore.setPageInfo({
			page:  findCallBooks.pageable.page + 1,
			size:  findCallBooks.pageable.size,
			total: findCallBooks.total
		});
	};
	
	return (
		<div className={classes.root}>
			
			{
				!isMobile &&
				<div className={classes.background} />
			}
			{
				!isLoading &&
				<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
				         className={classes.content}>
					<div className={classes.layout}>
						
						<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
							
							{/*<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />*/}
							
							{
								!isMobile &&
								<MC.Grid item style={{ width: "100%" }}>
									<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
										<MC.Grid item>
											<MC.Typography variant="h3">
												전화번호부
											</MC.Typography>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							}
							
							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 0 : 84 }}>
								<CallBooksSearchBar
									getCallBooks={getCallBooks} />
							</MC.Grid>
							
							<MC.Grid item style={{ width: "100%", marginTop: isMobile ? 30 : 61, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
								<CallBooksTable
									isMobile={isMobile}
									CallBookStore={CallBookStore}
									history={props.history}
									menuKey={menuKey}
									rootUrl={rootUrl}
									callBooks={callBooks}
									getCallBooks={getCallBooks}
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

export default inject("UserSignInStore", "UserAptComplexStore", "CallBookStore")(observer(CallBooks));
