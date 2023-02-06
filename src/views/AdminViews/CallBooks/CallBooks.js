import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }                   from "../../../components";
import { callBookRepository, categoryRepository } from "../../../repositories";

import { CallBooksSearchBar, CallBooksTable, CategoryDialog } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const CallBooks = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, CallBookStore } = props;
	
	const [menuKey] = useState("callBook");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `전화번호부 관리`,
			href:  `${rootUrl}/callBook`
		}
	]);
	
	const [callBooks, setCallBooks] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  CallBookStore.pageInfo.page,
		size:  CallBookStore.pageInfo.size,
		total: CallBookStore.pageInfo.total
	});
	
	const [categories, setCategories] = useState([]);
	const [categoryOpen, setCategoryOpen] = useState(false);
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let rootUrl = await generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `전화번호부 관리`,
						href:  `${rootUrl}/callBook`
					}
				];
				return [
					...prev
				];
			});
			await getCategories();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const sort = (a, b) => a.sequence - b.sequence;
	
	const getCategories = async () => {
		let searchParams = {
			aptId:   AptComplexStore.aptComplex.id,
			menuKey: menuKey
		};
		const categories = await categoryRepository.getCategories(searchParams);
		setCategories(categories.sort(sort));
	};
	
	const getCallBooks = async (page, size) => {
		let searchInfo = toJS(CallBookStore.callBookSearch);
		let callBookSearch = {
			aptId: AptComplexStore.aptComplex.id
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
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "id"
		});
		
		setCallBooks(findCallBooks.content);
		setPageInfo({
			page:  findCallBooks.pageable.page,
			size:  findCallBooks.pageable.size,
			total: findCallBooks.total
		});
		
		CallBookStore.setPageInfo({
			page:  findCallBooks.pageable.page,
			size:  findCallBooks.pageable.size,
			total: findCallBooks.total
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
			<CallBooksSearchBar getCallBooks={getCallBooks} />
			<div className={classes.content}>
				<CallBooksTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					callBooks={callBooks}
					getCallBooks={getCallBooks}
					categories={categories}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
			<MC.Grid container style={{ marginTop: 10 }}>
				<MC.Grid item xs={12} md={12}>
					<MC.ButtonGroup
						aria-label="text primary button group"
						color="primary">
						<MC.Button onClick={handleClickOpen}>
							카테고리 관리
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
			
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

export default inject("SignInStore", "AptComplexStore", "CallBookStore")(observer(CallBooks));
