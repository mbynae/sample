import React, {useState,useEffect} 						from "react";
import clsx              											from "clsx";
import * as MC                								from "@material-ui/core";
import * as MS                								from "@material-ui/styles";
import {inject, observer}     								from "mobx-react";
import { ActiveLastBreadcrumb, AlertDialog } 	from "../../../components";
import { prgmMgntRepository }                	from "../../../repositories";
import {PrgmMgntTable, PrgmMgntSearchBar}    	from "./component";

const useStyles = MS.makeStyles(theme => ({
	root:{
			padding: theme.spacing(3)
	},
	content: {
			marginTop: theme.spacing(2)
	}
}));

const PrgmMgnts = props => {

	const classes = useStyles();
	const {SignInStore} = props;
	const [rootUrl, setRootUrl] = useState("");
	const [open, setOpen] = useState(false);
	const [prgmList, setPrgmList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [expanded, setExpanded] = useState(false);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});
	const [breadcrumbs, setBreadcrumbs] = useState([
			{
					title: "시설/강좌관리",
					href: `${rootUrl}/dashboard`
			},
			{
					title: "상품설정",
					href: `${rootUrl}/prgmMgnt`
			}
	]);

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});

	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};

	useEffect(() => {
		window.scrollTo(0,0);
		const init = async () => {
			await generateRootUrl();
			await getPrgmList();
			await setIsLoading(false);
		};
		setTimeout(() => {
				init();
		}, 100);
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getPrgmList = async (page, size) => {
		await prgmMgntRepository.getPrgmMstrList({
			page: page? page : 0,
			size: size ? size : 10
		}).then(result => {
			setPrgmList(result.data_json_array);
			setPageInfo(result.paginginfo)
		})
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<PrgmMgntSearchBar
				history={props.history}
				rootUrl={rootUrl}
				setPageInfo={setPageInfo}
				expanded={expanded}
				setExpanded={setExpanded}
				setPrgmList={setPrgmList}
			/>

			<div className={classes.content}>
				<PrgmMgntTable
						open={open}
						handleOpen={handleOpen}
						handleClose={handleClose}
						rootUrl={rootUrl}
						history={props.history}
						getPrgmList={getPrgmList}
						prgmList={prgmList}
						setPrgmList={setPrgmList}
						pageInfo={pageInfo}
						setPageInfo={setPageInfo}
						alertOpens={alertOpens}
						setAlertOpens={setAlertOpens}
						handleAlertToggle={handleAlertToggle}
						isLoading={isLoading}
						/>
			</div>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>
		</div>
	)
};
export default inject("SignInStore")(observer(PrgmMgnts));
