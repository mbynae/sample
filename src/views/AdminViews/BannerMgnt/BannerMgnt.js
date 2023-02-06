import React, { useEffect, useState }        from "react";
import { inject, observer }                  from "mobx-react";
import * as MS                               from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { BannerMgntTable }                   from "./components";
import {bannerRepository}                    from "../../../repositories"
import * as MC                               from "@material-ui/core";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const BannerMgnt = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore } = props;
	const [isLoading, setIsLoading] = useState(true);
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `배너관리`,
			href:  `${rootUrl}/bannerMgnt`
		}
	]);

	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});
	const [bannerList, setBannerList] = useState([]);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			await getBannerList();
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

	const getBannerList = async (page, size) => {
		await bannerRepository.getBannerList({
			page: page ? page : 0,
			size: size ? size : 10
		}).then(result => {
			setBannerList(result.data_json_array);
			setPageInfo(result.paginginfo);
		})
	}

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

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<div className={classes.content}>
				<BannerMgntTable
					AptComplexStore={AptComplexStore}
					history={props.history}
					rootUrl={rootUrl}
					getBannerList={getBannerList}
					bannerList={bannerList}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
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
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(BannerMgnt));
