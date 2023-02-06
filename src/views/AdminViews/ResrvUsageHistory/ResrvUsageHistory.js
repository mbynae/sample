import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb }                                 from "../../../components";

import { ResrvUsageTable, ResrvHistSearchBar }       from "./component";
import { resrvUsageRepository } from "../../../repositories";

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const ResrvUsageHistory = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, ResrvHistStore } = props;

	const [menuKey] = useState("usageHist");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `이용내역`,
			href:  `${rootUrl}/usageHist`
		}
	]);

	const [resrvUsages, setResrvUsages] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  ResrvHistStore.pageInfo.page,
		size:  ResrvHistStore.pageInfo.size,
		total: ResrvHistStore.pageInfo.total
	});

	const [facilityAdditionalFlag, setFacilityAdditionalFlag] = useState(false); // 추가상품 시설 리스트 여부

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
						title: `이용내역`,
						href:  `${rootUrl}/usageHist`
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

	const getResrvUsages = async (page, size) => {

		let searchInfo = toJS(ResrvHistStore.resrvHistSearch);

		let searchParams = {
			aptId: AptComplexStore.aptComplex.id
		};

		if ( searchInfo.dong_numb ) {
			searchParams.dong_numb = searchInfo.dong_numb;
		}

		if ( searchInfo.ho_numb ) {
			searchParams.ho_numb = searchInfo.ho_numb;
		}

		if ( searchInfo.memb_name ) {
			searchParams.memb_name = searchInfo.memb_name;
		}

		if ( searchInfo.rsvt_strt_date ) {
			searchParams.rsvt_strt_date = moment(searchInfo.rsvt_strt_date).format("yyyy-MM-DD");
		}

		if ( searchInfo.rsvt_end_date ) {
			searchParams.rsvt_end_date = moment(searchInfo.rsvt_end_date).format("yyyy-MM-DD");
		}

		if ( searchInfo.fclt_name ) {
			searchParams.fclt_numb = searchInfo.fclt_name;
		}

		if ( searchInfo.prgm_numb || searchInfo.additionalPrgm_numb ) {
			searchParams.prgm_numb = facilityAdditionalFlag ? searchInfo.prgm_numb : searchInfo.additionalPrgm_numb;
		}

		let findResrvUsages = await resrvUsageRepository.getRsvtUsageSearch({
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort: 		 "DESC",
			...searchParams
		});

		setResrvUsages(findResrvUsages.data_json_array);

		setPageInfo({
			page:  findResrvUsages.paginginfo.page,
			size:  findResrvUsages.paginginfo.size,
			total: findResrvUsages.paginginfo.total
		});

		ResrvHistStore.setPageInfo({
			page:  findResrvUsages.paginginfo.page,
			size:  findResrvUsages.paginginfo.size,
			total: findResrvUsages.paginginfo.total
		});
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<ResrvHistSearchBar
				getResrvHists={getResrvUsages}
				facilityAdditionalFlag={facilityAdditionalFlag}
				setFacilityAdditionalFlag={setFacilityAdditionalFlag}
			/>

			<div className={classes.content}>
				<ResrvUsageTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					resrvHists={resrvUsages}
					getResrvHists={getResrvUsages}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "ResrvHistStore")(observer(ResrvUsageHistory));

