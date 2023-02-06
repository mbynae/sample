import React, { useEffect, useState } from "react";
import { toJS }                       from "mobx";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";
import * as MS                        from "@material-ui/styles";

import { ActiveLastBreadcrumb }                                from "../../../components";
import { autonomousOrganizationRepository, sendSMSRepository } from "../../../repositories";

import { SendSMSsSearchBar, SendSMSsTable } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const SendSMSs = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, SendSMSStore } = props;
	
	const [menuKey] = useState("sendSMS");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `문자발송 관리`,
			href:  `${rootUrl}/${menuKey}`
		}
	]);
	
	const [sendSMSs, setSendSMSs] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  SendSMSStore.pageInfo.page,
		size:  SendSMSStore.pageInfo.size,
		total: SendSMSStore.pageInfo.total
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
						title: `문자발송 관리`,
						href:  `${rootUrl}/${menuKey}`
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
	
	const getSendSMSs = async (page, size) => {
		let searchInfo = toJS(SendSMSStore.sendSMSSearch);
		
		let searchParams = {
			aptId: AptComplexStore.aptComplex.id
		};
		
		if ( searchInfo.sendNumber ) {
			searchParams.sendNumber = searchInfo.sendNumber;
		}
		if ( searchInfo.smsType && searchInfo.smsType !== "total" ) {
			searchParams.smsType = searchInfo.smsType;
		}
		if ( searchInfo.sendType && searchInfo.sendType !== "total" ) {
			searchParams.sendType = searchInfo.sendType;
		}
		if ( searchInfo.sendTargetType && searchInfo.sendTargetType !== "total" ) {
			searchParams.sendTargetType = searchInfo.sendTargetType;
		}
		
		if ( searchInfo.isUseReservationDate ) {
			searchParams.isUseReservationDate = searchInfo.isUseReservationDate;
			searchParams.reservationStartDate = new Date(moment(searchInfo.reservationStartDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.reservationEndDate = new Date(moment(searchInfo.reservationEndDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		if ( searchInfo.isUseSendDate ) {
			searchParams.isUseSendDate = searchInfo.isUseSendDate;
			searchParams.sendStartDate = new Date(moment(searchInfo.sendStartDate).format("YYYY-MM-DD HH:mm:ss"));
			searchParams.sendEndDate = new Date(moment(searchInfo.sendEndDate).format("YYYY-MM-DD HH:mm:ss"));
		}
		
		let findSendSMSs = await sendSMSRepository.getSendSMSs({
			...searchParams,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 10,
			sort:      "baseDateDataType.createDate"
		});
		
		setSendSMSs(findSendSMSs.content);
		setPageInfo({
			page:  findSendSMSs.pageable.page,
			size:  findSendSMSs.pageable.size,
			total: findSendSMSs.total
		});
		
		SendSMSStore.setPageInfo({
			page:  findSendSMSs.pageable.page,
			size:  findSendSMSs.pageable.size,
			total: findSendSMSs.total
		});
	};
	
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			
			<SendSMSsSearchBar
				aptId={AptComplexStore.aptComplex.id}
				getSendSMSs={getSendSMSs} />
			
			<div className={classes.content}>
				<SendSMSsTable
					history={props.history}
					menuKey={menuKey}
					aptId={AptComplexStore.aptComplex.id}
					rootUrl={rootUrl}
					sendSMSs={sendSMSs}
					getSendSMSs={getSendSMSs}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo} />
			</div>
		
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "SendSMSStore")(observer(SendSMSs));
