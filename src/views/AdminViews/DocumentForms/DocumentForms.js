import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";

import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb }   from "../../../components";
import { documentFormRepository } from "../../../repositories";

import { DocumentFormsSearchBar, DocumentFormsTable } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const DocumentForms = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, DocumentFormStore } = props;
	
	const [menuKey] = useState("documentForm");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `문서양식 관리`,
			href:  `${rootUrl}/documentForm`
		}
	]);
	
	const [documentForms, setDocumentForms] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  DocumentFormStore.pageInfo.page,
		size:  DocumentFormStore.pageInfo.size,
		total: DocumentFormStore.pageInfo.total
	});
	
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
						title: `문서양식 관리`,
						href:  `${rootUrl}/documentForm`
					}
				];
				return [
					...prev
				];
			});
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);
	
	const getDocumentForms = async (page, size) => {
		let searchInfo = toJS(DocumentFormStore.documentFormSearch);
		let documentFormSearch = {
			aptId: AptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.title ) {
			documentFormSearch.title = searchInfo.title;
		}
		
		let findDocumentForms = await documentFormRepository.getDocumentForms({
			...documentFormSearch,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setDocumentForms(findDocumentForms.content);
		setPageInfo({
			page:  findDocumentForms.pageable.page,
			size:  findDocumentForms.pageable.size,
			total: findDocumentForms.total
		});
		
		DocumentFormStore.setPageInfo({
			page:  findDocumentForms.pageable.page,
			size:  findDocumentForms.pageable.size,
			total: findDocumentForms.total
		});
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<DocumentFormsSearchBar getDocumentForms={getDocumentForms} />
			<div className={classes.content}>
				<DocumentFormsTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					documentForms={documentForms}
					getDocumentForms={getDocumentForms}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "DocumentFormStore")(observer(DocumentForms));
