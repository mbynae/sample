import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb }                                 from "../../../components";
import { resrvModifyRepository } from "../../../repositories";

import { ResrvModifySearchTable, ResrvHistSearchBar }   from "./component";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const ResrvHist = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, ResrvHistStore } = props;

	const [menuKey] = useState("modifyHist");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `취소/변경내역`,
			href:  `${rootUrl}/modifyHist`
		}
	]);

	const [resrvHists, setResrvHists] = useState([]);
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
						title: `취소/변경내역`,
						href:  `${rootUrl}/modifyHist`
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

	const getResrvHists = async (page, size) => {

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

		let findResrvModify = await resrvModifyRepository.getRfndSearch({
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort: 		 "DESC",
			...searchParams
		},"cancel/list/");

		setResrvHists(findResrvModify.data_json_array);
		setPageInfo({
			page:  findResrvModify.paginginfo.page,
			size:  findResrvModify.paginginfo.size,
			total: findResrvModify.paginginfo.total
		});

		ResrvHistStore.setPageInfo({
			page:  findResrvModify.paginginfo.page,
			size:  findResrvModify.paginginfo.size,
			total: findResrvModify.paginginfo.total
		});

	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<ResrvHistSearchBar
				getResrvHists={getResrvHists}
				facilityAdditionalFlag={facilityAdditionalFlag}
				setFacilityAdditionalFlag={setFacilityAdditionalFlag}
			/>

			<div className={classes.content}>
				<ResrvModifySearchTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					resrvHists={resrvHists}
					getResrvHists={getResrvHists}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "ResrvHistStore")(observer(ResrvHist));
