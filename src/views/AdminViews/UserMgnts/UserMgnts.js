import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb }                                 from "../../../components";
import { autonomousOrganizationRepository, userMgntRepository } from "../../../repositories";

import { UserMgntsSearchBar, UserMgntsTable } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const UserMgnts = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, UserMgntStore } = props;

	const [menuKey] = useState("userMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `입주민 관리`,
			href:  `${rootUrl}/userMgnt`
		}
	]);

	const [userMgnts, setUserMgnts] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  UserMgntStore.pageInfo.page,
		size:  UserMgntStore.pageInfo.size,
		total: UserMgntStore.pageInfo.total
	});
	const [aoList, setAOList] = useState([]);

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
						title: `입주민 관리`,
						href:  `${rootUrl}/userMgnt`
					}
				];
				return [
					...prev
				];
			});
			await getAOList();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getUserMgnts = async (page, size) => {
		let searchInfo = toJS(UserMgntStore.userMgntSearch);

		let searchParams = {
			aptId: AptComplexStore.aptComplex.id
		};

		if ( searchInfo.aoId && searchInfo.aoId !== "total" ) {
			searchParams.aoId = searchInfo.aoId;
		}
		if ( searchInfo.name ) {
			searchParams.name = searchInfo.name;
		}
		if ( searchInfo.phoneNumber ) {
			searchParams.phoneNumber = searchInfo.phoneNumber;
		}
		if ( searchInfo.userId ) {
			searchParams.userId = searchInfo.userId;
		}
		if ( searchInfo.userDataType.building ) {
			searchParams.building = searchInfo.userDataType.building;
		}
		if ( searchInfo.userDataType.unit ) {
			searchParams.unit = searchInfo.userDataType.unit;
		}
		if ( searchInfo.userDataType.houseHolderType && searchInfo.userDataType.houseHolderType !== "total" ) {
			searchParams.houseHolderType = searchInfo.userDataType.houseHolderType;
		}
		if ( searchInfo.userDataType.ownerType && searchInfo.userDataType.ownerType !== "total" ) {
			searchParams.ownerType = searchInfo.userDataType.ownerType;
		}
		if ( searchInfo.userDataType.residentsType && searchInfo.userDataType.residentsType !== "total" ) {
			searchParams.residentsType = searchInfo.userDataType.residentsType;
		}

		if ( searchInfo.isUseCreateDate ) {
			searchParams.isUseCreateDate = searchInfo.isUseCreateDate;
			searchParams.createFromDate = new Date(moment(searchInfo.createFromDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.createToDate = new Date(moment(searchInfo.createToDate).format("YYYY-MM-DD HH:mm:ss"));
		}

		let findUserMgnts = await userMgntRepository.getUserMgnts({
			...searchParams,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "id"
		});

		setUserMgnts(findUserMgnts.content);
		setPageInfo({
			page:  findUserMgnts.pageable.page,
			size:  findUserMgnts.pageable.size,
			total: findUserMgnts.total
		});

		UserMgntStore.setPageInfo({
			page:  findUserMgnts.pageable.page,
			size:  findUserMgnts.pageable.size,
			total: findUserMgnts.total
		});
	};

	const getAOList = async () => {
		let findAOList = await autonomousOrganizationRepository.getAutonomousOrganizations({
			aptId:     AptComplexStore.aptComplex.id,
			direction: "ASC",
			page:      0,
			size:      100000,
			sort:      "sequence"
		});

		setAOList(findAOList.content);
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<UserMgntsSearchBar
				getUserMgnts={getUserMgnts}
				aoList={aoList} />

			<div className={classes.content}>
				<UserMgntsTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					userMgnts={userMgnts}
					getUserMgnts={getUserMgnts}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "UserMgntStore")(observer(UserMgnts));
