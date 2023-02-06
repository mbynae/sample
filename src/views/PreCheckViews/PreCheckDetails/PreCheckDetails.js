import React, { useCallback, useEffect, useState } from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb, AlertDialogUserView } from "../../../components";
import {
	preCheckDetailRepository,
	categoryRepository,
} from "../../../repositories";

import {
	PreCheckDetailsSearchBar,
	PreCheckDetailsTable,
	PreCheckTitle,
	PreCheckButtonGroup,
} from "./components";
import moment from "moment";

import { apiObject } from "../../../repositories/api";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.white,
		position: "relative",
	},
	background: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: 260,
		backgroundColor: "#fafafa",
		zIndex: 1,
	},
	content: {
		zIndex: 2,
		position: "relative",
		height: "100%",
		marginLeft: "auto",
		marginRight: "auto",
		maxWidth: "1180px",
		display: "flex",
		flexDirection: "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%",
		},
	},
	layout: {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width: "100%",
		paddingTop: 73,
		paddingBottom: 80,
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
			padding: 0,
			paddingTop: 0,
			paddingBottom: 80,
		},
	},
}));

const PreCheckDetails = (props) => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const {
		PreCheckSignInStore,
		UserAptComplexStore,
		PreCheckDetailStore,
		PreCheckReportStore,
	} = props;

	const [isLoading, setIsLoading] = useState(true);
	const [menuKey] = useState("preCheck");
	const [rootUrl, setRootUrl] = useState("");

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		noTitle: "",
		yesTitle: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
		isOpenType: false,
		type: "",
	});

	const [precheckInfo, setPrecheckInfo] = useState({
		id: undefined,
		isBetween: false,
		isBetweenDate: false,
		precheckCautions: "",
	});
	const [preCheckDetails, setPreCheckDetails] = useState();
	const [isReserved, setIsReserved] = useState(false);
	const [pageInfo, setPageInfo] = useState({
		page: PreCheckDetailStore.pageInfo.page,
		size: PreCheckDetailStore.pageInfo.size,
		total: PreCheckDetailStore.pageInfo.total,
	});
	const handleAlertToggle = (
		key,
		title,
		content,
		yesTitle,
		yesCallback,
		noTitle,
		noCallback,
		type
	) => {
		setAlertOpens((prev) => {
			return {
				...prev,
				title,
				content,
				noTitle,
				yesTitle,
				[key]: !alertOpens[key],
				yesFn: () => yesCallback(),
				noFn: () => noCallback(),
				type,
			};
		});
	};

	const generateRootUrl = async () => {
		let rootUrl = `/${PreCheckSignInStore.aptId}/pre-inspection`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getPrecheckInfo = async (aptId) => {
		try {
			const responseGetPreCheckInfo = await apiObject.getPreCheckInfo(aptId);
			const data = responseGetPreCheckInfo;

			const start = moment(responseGetPreCheckInfo.preApplyFromDate);
			const end = moment(responseGetPreCheckInfo.preApplyToDate);
			const isBetween = moment(new Date()).isBetween(start, end);

			const startDate = moment(1638856800000)
				.set("hour", 0)
				.set("minute", 0)
				.set("second", 0)
				.set("millisecond", 0);
			const endDate = moment(responseGetPreCheckInfo.preApplyToDate)
				.set("hour", 23)
				.set("minute", 59)
				.set("second", 59)
				.set("millisecond", 999);
			const isBetweenDate = moment(new Date()).isBetween(startDate, endDate);

			setPrecheckInfo((prev) => ({
				...prev,
				isBetween: isBetween,
				isBetweenDate: isBetweenDate,
				precheckCautions: data?.preCheckInfo ?? "",
			}));
		} catch (error) {
			console.log({ error });
		}
	};

	const getPreCheckByUserId = async (preCheckuserId) => {
		try {
			const response = await apiObject.getPreCheckByUserId(preCheckuserId);
			const preCheckStTime = response.body.preCheckStTime ?? "00:00";
			setPreCheckDetails({
				id: response.body.id,
				preCheckDate:
					moment(response.body.preCheckDate)
						.set("hour", preCheckStTime.split(":")[0])
						.unix() * 1000,
				slot: response.body.slot,
			});
			PreCheckReportStore.setPreCheckReport(response.body.preCheckDefects);
			setIsReserved(Boolean(response.body.preCheckDate));
		} catch (error) {
			console.log({ error });
		}
	};

	const goToCreateReport = (preCheckUserId) => {
		props.history.push(`${rootUrl}/${menuKey}/detail/${preCheckUserId}`);
	};

	const goToCreatePrecheck = () => {
		props.history.push(`${rootUrl}/${menuKey}/edit`);
	};

	useEffect(() => {
		getPrecheckInfo(toJS(UserAptComplexStore)?.aptComplex.id);
		getPreCheckByUserId(toJS(PreCheckSignInStore).currentUser.id);
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let rootUrl = await generateRootUrl();
			setIsLoading(false);
		};
		setTimeout(async () => {
			await init();
		}, 100);
	}, []);

	return (
		<div className={classes.root}>
			{!isMobile && <div className={classes.background} />}
			{!isLoading && (
				<MC.Grid
					container
					direction={"column"}
					justify={"center"}
					alignItems={"center"}
					className={classes.content}
				>
					<div className={classes.layout}>
						<MC.Grid
							container
							direction={"column"}
							justify={"center"}
							alignItems={"center"}
						>
							{/*<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />*/}

							{!isMobile && (
								<MC.Grid item style={{ width: "100%" }}>
									<MC.Grid
										container
										direction={"column"}
										justify={"center"}
										alignItems={"center"}
									>
										<MC.Grid item>
											<MC.Typography variant="h3">사전점검</MC.Typography>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							)}

							<PreCheckTitle
								preCheckDetails={preCheckDetails}
								isReserved={isReserved}
								setIsReserved={setIsReserved}
								handleAlertToggle={handleAlertToggle}
								setAlertOpens={setAlertOpens}
							/>

							<PreCheckButtonGroup
								isReserved={isReserved}
								handleAlertToggle={handleAlertToggle}
								setAlertOpens={setAlertOpens}
								preCheckInfo={`[사전점검 유의사항]

								${precheckInfo.precheckCautions}
								`}
								goToCreatePrecheck={goToCreatePrecheck}
								precheckInfo={precheckInfo}
							/>

							<MC.Grid
								item
								style={{
									width: "100%",
									marginTop: isMobile ? 30 : 61,
									paddingLeft: isMobile ? 16 : 0,
									paddingRight: isMobile ? 16 : 0,
								}}
							>
								<PreCheckDetailsTable
									isMobile={isMobile}
									PreCheckDetailStore={PreCheckDetailStore}
									history={props.history}
									menuKey={menuKey}
									rootUrl={rootUrl}
									precheckReport={toJS(PreCheckReportStore).preCheckReport}
									getPreCheckReport={getPreCheckByUserId}
									precheckId={toJS(PreCheckSignInStore).currentUser.id}
									pageInfo={pageInfo}
									setPageInfo={setPageInfo}
									handleAlertToggle={handleAlertToggle}
									setAlertOpens={setAlertOpens}
								/>
							</MC.Grid>
							<MC.Grid
								container
								justify="center"
								style={{ marginTop: theme.spacing(2) }}
							>
								<MC.Button
									size="large"
									disabled={!precheckInfo.isBetweenDate}
									disableElevation
									color="primary"
									variant="contained"
									onClick={() => {
										goToCreateReport(toJS(PreCheckSignInStore).currentUser.id);
									}}
								>
									점검내용 등록
								</MC.Button>
							</MC.Grid>
						</MC.Grid>
					</div>
				</MC.Grid>
			)}

			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
				type={alertOpens.type}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
				noTitle={alertOpens.noTitle}
				yesTitle={alertOpens.yesTitle}
			/>
		</div>
	);
};

export default inject(
	"PreCheckSignInStore",
	"UserAptComplexStore",
	"PreCheckDetailStore",
	"PreCheckReportStore"
)(observer(PreCheckDetails));
