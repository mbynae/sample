import React, { useEffect, useState }        from "react";
import { inject, observer }                  from "mobx-react";
import * as MS                               from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { FacilityMgntsTable }                from "./components";
import { facilityIntroductionRepository}     from "../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const FacilityMgnt = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore } = props;
	const [rootUrl, setRootUrl] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "시설/강좌관리",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `시설안내`,
			href:  `${rootUrl}/facilityMgnt`
		}
	]);

	const [facilityList, setFacilityList] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			await getFacilityList();
			await setIsLoading(false);
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getFacilityList = async (page, size) => {
		await facilityIntroductionRepository.getFacilityList({
			page: page ? page : 0,
			size: size ? size : 10
		})
		.then(result => {
			setFacilityList(result.fcltCntList);
			setPageInfo(result.paginginfo);
		});
	};

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
				<FacilityMgntsTable
					AptComplexStore={AptComplexStore}
					SignInStore={SignInStore}
					history={props.history}
					rootUrl={rootUrl}
					facilityList={facilityList}
					getFacilityList={getFacilityList}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					isLoading={isLoading} />
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

export default inject("SignInStore", "AptComplexStore")(observer(FacilityMgnt));
