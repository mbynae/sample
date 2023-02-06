import React, { useEffect, useRef, useState } from "react";
import { inject, observer } from "mobx-react";
import { FixedSizeList } from "react-window";
import { toJS } from "mobx";
import moment from "moment";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import {
	articleRepository,
	bannerRepository,
	scheduleMgntRepository,
} from "../../../repositories";
import palette from "../../../theme/adminTheme/palette";
import { DateFormat, PhoneHyphen } from "../../../components";
import {
	BoardTabs,
	MainBanners,
	QuickMenu,
	ScheduleBanner,
} from "./components";

import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

import CreditCardOutlinedIcon from "@material-ui/icons/CreditCardOutlined";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import BorderColorOutlinedIcon from "@material-ui/icons/BorderColorOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import StorefrontOutlinedIcon from "@material-ui/icons/StorefrontOutlined";
import { Slide } from "react-slideshow-image";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		// padding: theme.spacing(1)
	},
	divider: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)",
	},
	content: {
		marginTop: 0,
		marginBottom: 0,
		marginLeft: "auto",
		marginRight: "auto",
		maxWidth: "1180px",
		height: "100%",
		maxHeight: "100%",
		minHeight: "100%",
	},
	card: {
		border: 0,
		borderRadius: 0,
	},
	cardHeader: {
		color: theme.palette.icon,
		backgroundColor: "transparent",
		height: 62,
	},
	cardTitle_noti: {
		color: "#000000",
		fontSize: 20,
		fontWeight: "bold",
		[theme.breakpoints.up("md")]: {
			marginLeft: -8,
		},
	},
	cardTitle_news: {
		color: "#000000",
		fontSize: 20,
		fontWeight: "bold",
	},
	cardButton: {
		margin: 0,
		fontSize: 14,
		fontWeight: 500,
		color: "#000000",
	},
	cardContent_noti: {
		marginLeft: -8,
	},
	cardContent_news: {},
	paperLayout: {
		width: 120,
		height: 120,
	},
	iconButtonLayout: {
		padding: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		cursor: "pointer",
	},
	infoLayout: {
		// height:          498,
		minHeight: 498,
		backgroundColor: "#fafafa",
	},
	infoList_left: {
		maxWidth: 486,
		height: 88,
		backgroundColor: "white",
		marginBottom: 10,
		"box-shadow": "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
	},
	infoList_right: {
		maxWidth: 486,
		height: 88,
		backgroundColor: "white",
		marginBottom: 10,
		"box-shadow": "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
		"&:hover": {
			"box-shadow": "0 2px 4px 0 rgba(0, 0, 0, 0.2)",
			cursor: "pointer",
		},
	},
	infoList_right_text: {
		padding: "0px 20px",
		fontSize: 15,
	},
	infoIconSize: {
		width: 60,
		height: 60,
	},
	body4: {
		...theme.typography.body4,
		color: "#000000",
	},
	rhombusBig: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 48,
		height: 48,
		opacity: 0.3,
		margin: "26 0 0 173",
		background: "linear-gradient(to top left, #edd6c8 50%, #fff 50%)",
	},
	rhombusSmall: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 20,
		height: 20,
		opacity: 0.3,
		margin: "26 0 0 173",
		background: "linear-gradient(to top left, #edd6c8 50%, #fff 50%)",
	},
	quickServicePaper: {
		width: "100%",
		height: "auto",
		padding: theme.spacing(1),

		[theme.breakpoints.up("sm")]: {
			height: 285,
			padding: 0,
		},
		[theme.breakpoints.up("md")]: {
			maxWidth: 174,
			height: 285,
		},
		"&:hover": {
			"box-shadow": "2px 3px 4px 2px rgba(0, 0, 0, 0.1)",
			cursor: "pointer",
		},
	},
	lastBannerLayout: {
		backgroundColor: "#ffffff",
		[theme.breakpoints.between("xs", "sm")]: {
			minHeight: 216,
		},
		[theme.breakpoints.between("sm", "md")]: {
			minHeight: 216,
		},
		[theme.breakpoints.up("md")]: {
			minHeight: 296,
		},
	},
	body7: {
		...theme.typography.body7,
		color: "#000000",
		[theme.breakpoints.between("xs", "sm")]: {
			marginTop: theme.spacing(1),
		},
		[theme.breakpoints.between("sm", "md")]: {
			marginTop: 16,
		},
		[theme.breakpoints.up("md")]: {
			marginTop: 24,
		},
	},
	body6: {
		...theme.typography.body6,
		whiteSpace: "pre-line",
	},
	quickServicePaperAvatar: {
		width: 80,
		height: 80,
		backgroundColor: "#fafafa",
		color: "#222222",
		margin: 0,
		[theme.breakpoints.up("sm")]: {
			width: 120,
			height: 120,
		},
	},
}));

const Dashboard = (props) => {
	const classes = useStyles();

	const { UserSignInStore, UserAptComplexStore, history } = props;

	const [rootUrl, setRootUrl] = useState("");

	const [mainContent, setMainContent] = useState();

	const [officeMenu, setOfficeMenu] = useState();
	const [officeArticles, setOfficeArticles] = useState();
	const [selectOfficeMenuKey, setSelectOfficeMenuKey] = useState();

	const [residentsMenu, setResidentsMenu] = useState();
	const [residentsArticles, setResidentsArticles] = useState();
	const [selectResidentsMenuKey, setSelectResidentsMenuKey] = useState();
	const [homepageType, setHomepageType] = useState(
		toJS(
			UserAptComplexStore.aptComplex.contractInformationDataType.homepageType
		)
	);
	const [bannerImageList, setBannerImageList] = useState([]);
	const [scheduleList, setScheduleList] = useState([]);

	const theme = MS.useTheme();
	const isDesktop = MC.useMediaQuery(theme.breakpoints.up("md"), {
		defaultMatches: true,
	});

	const [aptComplex, setAptComplex] = useState();

	const defaultImages = ["/images/dashboard/prepare.png"];

	const evntBannerZoomOutProperties = {
		// indicators: true,
		// scale:      0.4,
		infinite: !!(bannerImageList && bannerImageList.length >= 2),
		autoplay: !!(bannerImageList && bannerImageList.length >= 2),
		arrows: false,
		pauseOnHover: false,
		canSwipe: false,
	};

	useEffect(() => {
		const init = async () => {
			await generateRootUrl();
			setAptComplex(toJS(UserAptComplexStore.aptComplex));
			getMenus();
			setMainContent(toJS(UserAptComplexStore.mainContent));
			getBannerImageList();
			getScheduleDetailList();
		};

		setTimeout(() => {
			init();
		});
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${UserAptComplexStore.aptComplex.aptId}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getMenus = () => {
		const findMenus = toJS(UserAptComplexStore.menus);
		const childFilter = (childMenu) =>
			childMenu.menuType === "BOARD_TYPE" && childMenu.isShowMainContentBoard;
		const childSort = (a, b) =>
			a.sequenceShowMainContentBoard - b.sequenceShowMainContentBoard;

		if (homepageType !== "CMMTY_TYPE") {
			setOfficeMenu((prev) => {
				prev = findMenus.find((rootMenu) => rootMenu.menuKey === "office");
				prev.childMenus = prev.childMenus.filter(childFilter).sort(childSort);
				if (prev.childMenus.length > 0) {
					setSelectOfficeMenuKey(prev.childMenus[0].menuKey);
					getArticles(prev.childMenus[0].menuKey, true);
				}
				return {
					...prev,
				};
			});
			setResidentsMenu((prev) => {
				prev = findMenus.find((rootMenu) => rootMenu.menuKey === "residents");
				prev.childMenus = prev.childMenus.filter(childFilter).sort(childSort);
				if (prev.childMenus.length > 0) {
					setSelectResidentsMenuKey(prev.childMenus[0].menuKey);
					getArticles(prev.childMenus[0].menuKey, false);
				}
				return {
					...prev,
				};
			});
		} else {
			getArticles("notice", true);
		}
	};

	const getArticles = async (menuKey, isOffice) => {
		let findArticles = await articleRepository.getArticles(
			{
				aptId: UserAptComplexStore.aptComplex.id,
				menuKey: menuKey,
				direction: "DESC",
				page: 0,
				size: 10,
				sort: "baseDateDataType.createDate",
			},
			true
		);

		if (isOffice) {
			setOfficeArticles(findArticles);
		} else {
			setResidentsArticles(findArticles);
		}
	};

	const getBannerImageList = () => {
		bannerRepository
			.getBannerImageList(UserAptComplexStore.aptComplex.aptId)
			.then((result) => {
				setBannerImageList(result.data_json_array);
			});
	};

	const goBoard = (menuKey) => {
		history.push(`${rootUrl}/articles/${menuKey}`);
	};

	const goArticleDetail = (menuKey, id) => {
		history.push(`${rootUrl}/articles/${menuKey}/${id}`);
	};

	const goMenu = (menuKey) => {
		if (menuKey === "myPage") {
			history.push({
				pathname: `${rootUrl}/${menuKey}`,
				state: { value: 2 },
			});
		} else {
			history.push(`${rootUrl}/${menuKey}`);
		}
	};

	const renderRow = (props) => {
		const { index, style, data } = props;
		const article = data.articles[index];
		const menuKey = data.menuKey;

		const onClick = () => {
			if (data.articles.length !== 0 && !isSecretView(article)) {
				goArticleDetail(menuKey, article?.id);
			}
		};

		const isSecretView = (obj) => {
			return (
				obj?.isSecret && obj?.authorId !== toJS(UserSignInStore.currentUser).id
			);
		};

		return (
			<MC.ListItem
				button={data.articles.length !== 0}
				onClick={onClick}
				style={{ ...style, borderBottom: `1px solid ${palette.divider}` }}
				key={index}
			>
				{data.articles.length === 0 ? (
					<MC.ListItemText>
						<MC.Typography className={classes.body6}>
							{"조회된 게시글이 없습니다."}
						</MC.Typography>
					</MC.ListItemText>
				) : (
					<MC.Grid container justify={"space-between"} alignItems={"center"}>
						<MC.Grid item xs={6} md={6}>
							<MC.ListItemText>
								<MC.Typography
									className={classes.body6}
									style={{
										color: isSecretView(article) ? "#909090" : "#222222",
									}}
								>
									{isSecretView(article) ? "비공개" : article?.title}
								</MC.Typography>
							</MC.ListItemText>
						</MC.Grid>
						<MC.Grid item xs={6} md={6}>
							<MC.ListItemText style={{ textAlign: "right" }}>
								<MC.Typography
									className={classes.body6}
									style={{
										color: isSecretView(article) ? "#909090" : "#222222",
									}}
								>
									<DateFormat
										date={article?.createDate}
										format={"YYYY-MM-DD"}
									/>
								</MC.Typography>
							</MC.ListItemText>
						</MC.Grid>
					</MC.Grid>
				)}
			</MC.ListItem>
		);
	};

	const goPage = (event) => {
		let name = "";
		if (event.target) {
			name = event.target.name;
			event.preventDefault();
		} else {
			name = event;
		}
		if (name === "sign-out") {
			UserSignInStore.logout();
			history.push(`/${UserAptComplexStore.aptComplex.aptId}/dashboard`);
		} else {
			history.push(`/${UserAptComplexStore.aptComplex.aptId}/${name}`);
		}
	};

	const getScheduleDetailList = () => {
		// 오늘날짜 일정목록 조회
		let today = moment(new Date()).format("YYYY-MM-DD");
		scheduleMgntRepository
			.getScheduleDetailList({
				sch_date: today,
				cmpx_numb: UserAptComplexStore.cmpxNumb,
			})
			.then((result) => {
				setScheduleList(result.data_json_array);
			});
	};

	return (
		<div className={classes.root} style={{ backgroundColor: "#ffffff" }}>
			{homepageType !== "CMMTY_TYPE" && (
				<QuickMenu
					rootUrl={rootUrl}
					history={history}
					aptComplex={aptComplex}
					UserAptComplexStore={UserAptComplexStore}
				/>
			)}
			<MC.Grid container spacing={0} className={classes.content}>
				<MainBanners
					UserAptComplexStore={UserAptComplexStore}
					mainContent={mainContent}
					isDesktop={isDesktop}
					currentUser={toJS(UserSignInStore.currentUser)}
					goPage={goPage}
					goMenu={goMenu}
				/>

				<MC.Grid item xs={12} md={6}>
					<MC.Card className={classes.card} elevation={0}>
						<MC.CardHeader
							title={homepageType !== "CMMTY_TYPE" ? "관리사무소" : "공지사항"}
							classes={{
								root: classes.cardHeader,
								title: classes.cardTitle_noti,
								action: classes.cardButton,
							}}
							action={
								<MC.Button
									className={classes.cardButton}
									size={"small"}
									onClick={() =>
										goBoard(
											homepageType !== "CMMTY_TYPE"
												? selectOfficeMenuKey
												: "notice"
										)
									}
									endIcon={<ArrowRightAltIcon />}
								>
									더보기
								</MC.Button>
							}
						/>
						{homepageType !== "CMMTY_TYPE" && (
							<BoardTabs
								menu={officeMenu}
								getArticles={getArticles}
								isDesktop={isDesktop}
								setSelectMenuKey={setSelectOfficeMenuKey}
							/>
						)}
						<MC.CardContent className={classes.cardContent_noti}>
							<FixedSizeList
								height={250}
								itemSize={50}
								itemData={{
									articles: officeArticles ? officeArticles.content : [],
									menuKey:
										homepageType === "CMMTY_TYPE"
											? "notice"
											: selectOfficeMenuKey,
								}}
								itemCount={
									officeArticles
										? officeArticles.total > 10
											? 10
											: officeArticles.total
										: 0
								}
								style={{
									border: "1px solid #ebebeb",
									marginLeft: isDesktop ? 0 : 8,
								}}
							>
								{renderRow}
							</FixedSizeList>
						</MC.CardContent>
					</MC.Card>
				</MC.Grid>

				<MC.Grid item xs={12} md={6}>
					<MC.Card className={classes.card} elevation={0}>
						<MC.CardHeader
							title={homepageType !== "CMMTY_TYPE" ? "입주민 공간" : "소식"}
							classes={{
								root: classes.cardHeader,
								title: classes.cardTitle_news,
								action: classes.cardButton,
							}}
							action={
								homepageType !== "CMMTY_TYPE" && (
									<MC.Button
										className={classes.cardButton}
										size={"small"}
										onClick={() => goBoard(selectResidentsMenuKey)}
										endIcon={<ArrowRightAltIcon />}
									>
										더보기
									</MC.Button>
								)
							}
						/>
						{homepageType !== "CMMTY_TYPE" && (
							<BoardTabs
								menu={residentsMenu}
								getArticles={getArticles}
								isDesktop={isDesktop}
								setSelectMenuKey={setSelectResidentsMenuKey}
							/>
						)}
						<MC.CardContent className={classes.cardContent_news}>
							{homepageType !== "CMMTY_TYPE" ? (
								<FixedSizeList
									height={250}
									itemSize={50}
									itemData={{
										articles: residentsArticles
											? residentsArticles.content
											: [],
										menuKey: selectResidentsMenuKey,
									}}
									itemCount={
										residentsArticles
											? residentsArticles.total > 10
												? 10
												: residentsArticles.total
											: 0
									}
									style={{ border: "1px solid #ebebeb" }}
								>
									{renderRow}
								</FixedSizeList>
							) : bannerImageList && bannerImageList.length > 0 ? (
								<Slide {...evntBannerZoomOutProperties}>
									{bannerImageList.map((attach, index) => (
										<div key={index} style={{ width: "100%", height: 250 }}>
											{/*링크 있을 경우에만 링크 이동 적용*/}
											{attach.link ? (
												<a href={attach.link} target="_blank">
													<img
														style={{ width: "100%", height: "100%" }}
														src={attach.img_url}
														alt={attach.file_orgn}
													/>
												</a>
											) : (
												<img
													style={{ width: "100%", height: "100%" }}
													src={attach.img_url}
													alt={attach.file_orgn}
												/>
											)}
										</div>
									))}
								</Slide>
							) : (
								<Slide {...evntBannerZoomOutProperties} defaultIndex={0}>
									{isDesktop
										? defaultImages.map((each, index) => (
												<div
													key={index}
													style={{
														width: "100%",
														height: 250,
														border: "1px solid #ebebeb",
													}}
												>
													<img
														style={{ width: "100%", height: "100%" }}
														src={each}
														alt={"prepare.png"}
													/>
												</div>
										  ))
										: defaultImages.map((each, index) => (
												<div
													key={index}
													style={{
														height: 320,
														minHeight: 320,
														border: "1px solid #ebebeb",
													}}
												>
													<img
														style={{ width: "100%" }}
														src={each}
														alt={"prepare.png"}
													/>
												</div>
										  ))}
								</Slide>
							)}
						</MC.CardContent>
					</MC.Card>
				</MC.Grid>
			</MC.Grid>

			<div className={classes.infoLayout}>
				<MC.Grid container className={classes.content}>
					{/*<MC.Grid item xs={12} md={12}>*/}

					<MC.Grid
						container
						spacing={isDesktop ? 2 : 0}
						justify={"center"}
						alignItems={"center"}
						style={{ height: isDesktop ? 498 : "100%", maxHeight: "100%" }}
					>
						<MC.Grid
							item
							xs={12}
							md={6}
							style={{ marginTop: isDesktop ? 0 : 40 }}
						>
							<MC.Typography
								variant={"h5"}
								style={{
									color: "#000000",
									marginBottom: 30,
									padding: 8,
									marginLeft: isDesktop ? 0 : 8,
								}}
							>
								{homepageType !== "CMMTY_TYPE"
									? "관리사무소 정보"
									: "시설 연락처"}
							</MC.Typography>

							{/* 연락처 리스트*/}
							<MC.List
								className={classes.root}
								style={{ padding: 8, marginLeft: isDesktop ? 0 : 8 }}
							>
								{/* 전화번호 */}
								<MC.ListItem className={classes.infoList_left}>
									<MC.ListItemAvatar>
										<MC.Avatar
											className={classes.infoIconSize}
											src={"/images/dashboard/telephone-number-icon.png"}
										/>
									</MC.ListItemAvatar>
									<MC.ListItemText
										style={{
											marginLeft: 13,
											width: 87,
											minWidth: 87,
											maxWidth: 87,
										}}
									>
										<MC.Typography
											className={classes.body4}
											style={{ opacity: 0.5 }}
										>
											전화번호
										</MC.Typography>
									</MC.ListItemText>
									<MC.ListItemText>
										<MC.Typography className={classes.body4}>
											{aptComplex && aptComplex.aptInformationDataType.officeCallNumber ?
											PhoneHyphen(
												aptComplex.aptInformationDataType.officeCallNumber
											) :
											"미등록"
											}
										</MC.Typography>
									</MC.ListItemText>
									<div className={classes.rhombusBig}/>
									<div className={classes.rhombusSmall}/>
								</MC.ListItem>
								{/* 팩스 번호 */}
								<MC.ListItem className={classes.infoList_left}>
									<MC.ListItemAvatar>
										<MC.Avatar
											className={classes.infoIconSize}
											src={"/images/dashboard/fax-number-icon.png"}
										/>
									</MC.ListItemAvatar>
									<MC.ListItemText
										style={{
											marginLeft: 13,
											width: 87,
											minWidth: 87,
											maxWidth: 87,
										}}
									>
										<MC.Typography
											className={classes.body4}
											style={{ opacity: 0.5 }}
										>
											팩스번호
										</MC.Typography>
									</MC.ListItemText>
									<MC.ListItemText>
										<MC.Typography className={classes.body4}>
											{aptComplex && aptComplex.aptInformationDataType.officeFaxNumber ?
											PhoneHyphen(
												aptComplex.aptInformationDataType.officeFaxNumber
											) :
												"미등록"
											}
										</MC.Typography>
									</MC.ListItemText>
									<div className={classes.rhombusBig}/>
									<div className={classes.rhombusSmall}/>
								</MC.ListItem>
								{/* 업무시간 (community 타입 제외)*/}
								{homepageType !== "CMMTY_TYPE" && (
									<MC.ListItem className={classes.infoList_left}>
										<MC.ListItemAvatar>
											<MC.Avatar
												className={classes.infoIconSize}
												src={"/images/dashboard/cs-icon.png"}
											/>
										</MC.ListItemAvatar>
										<MC.ListItemText
											style={{
												marginLeft: 13,
												width: 87,
												minWidth: 87,
												maxWidth: 87,
											}}
										>
											<MC.Typography
												className={classes.body4}
												style={{ opacity: 0.5 }}
											>
												업무시간
											</MC.Typography>
										</MC.ListItemText>
										<MC.ListItemText>
											<MC.Typography className={classes.body4}>
												09:00~18:00 (주말/공휴일 휴무)
											</MC.Typography>
										</MC.ListItemText>
										<div className={classes.rhombusBig}/>
										<div className={classes.rhombusSmall}/>
									</MC.ListItem>
								)}
							</MC.List>
						</MC.Grid>
						<MC.Grid
							item
							xs={12}
							md={6}
							style={{ marginTop: isDesktop ? 0 : 40 }}
						>
							<MC.Typography
								variant={"h5"}
								style={{
									color: "#000000",
									marginBottom: 30,
									padding: 8,
									marginLeft: isDesktop ? 2 : 10,
								}}
							>
								{homepageType !== "CMMTY_TYPE"
									? "자주 찾는 서비스"
									: "시설 정보"}
							</MC.Typography>
							{homepageType !== "CMMTY_TYPE" ? (
								//Basic, Mixed Type 아파트 - 자주 찾는 서비스
								<MC.Grid
									container
									spacing={1}
									direction="row"
									justify={"space-evenly"}
									alignItems={"center"}
									style={{
										padding: isDesktop ? 8 : "8px 24px 8px 8px",
										marginLeft: isDesktop ? 0 : 8,
									}}
								>
									<MC.Grid item xs={4}>
										<MC.Paper
											elevation={1}
											className={classes.quickServicePaper}
											onClick={() => goMenu("myPage/2/0")}
										>
											<MC.Grid
												container
												direction={"column"}
												justify={"center"}
												alignItems={"center"}
												style={{ width: "100%", height: "100%" }}
											>
												<MC.Grid item>
													<MC.Avatar
														className={classes.quickServicePaperAvatar}
													>
														<CreditCardOutlinedIcon style={{ fontSize: 60 }} />
													</MC.Avatar>
												</MC.Grid>
												<MC.Grid item>
													<MC.Typography className={classes.body7}>
														관리비조회
													</MC.Typography>
												</MC.Grid>
											</MC.Grid>
										</MC.Paper>
									</MC.Grid>

									{mainContent &&
										mainContent.quickMenuDataType
											.isLinkComplaintsManagement && (
											<MC.Grid item xs={4}>
												<MC.Paper
													elevation={1}
													className={classes.quickServicePaper}
													onClick={() => goMenu("articles/complaints")}
												>
													<MC.Grid
														container
														direction={"column"}
														justify={"center"}
														alignItems={"center"}
														style={{ width: "100%", height: "100%" }}
													>
														<MC.Grid item>
															<MC.Avatar
																className={classes.quickServicePaperAvatar}
															>
																<SupervisedUserCircleOutlinedIcon
																	style={{ fontSize: 60 }}
																/>
															</MC.Avatar>
														</MC.Grid>
														<MC.Grid item>
															<MC.Typography className={classes.body7}>
																민원/하자
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
												</MC.Paper>
											</MC.Grid>
										)}

									{mainContent &&
										mainContent.quickMenuDataType.isLinkSuggestions && (
											<MC.Grid item xs={4}>
												<MC.Paper
													elevation={1}
													className={classes.quickServicePaper}
													onClick={() => goMenu("articles/suggestions")}
												>
													<MC.Grid
														container
														direction={"column"}
														justify={"center"}
														alignItems={"center"}
														style={{ width: "100%", height: "100%" }}
													>
														<MC.Grid item>
															<MC.Avatar
																className={classes.quickServicePaperAvatar}
															>
																<BorderColorOutlinedIcon
																	style={{ fontSize: 60 }}
																/>
															</MC.Avatar>
														</MC.Grid>
														<MC.Grid item>
															<MC.Typography className={classes.body7}>
																건의사항
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
												</MC.Paper>
											</MC.Grid>
										)}

									{mainContent &&
										mainContent.quickMenuDataType.isLinkFreeBoard && (
											<MC.Grid item xs={4}>
												<MC.Paper
													elevation={1}
													className={classes.quickServicePaper}
													onClick={() => goMenu("articles/freeBoard")}
												>
													<MC.Grid
														container
														direction={"column"}
														justify={"center"}
														alignItems={"center"}
														style={{ width: "100%", height: "100%" }}
													>
														<MC.Grid item>
															<MC.Avatar
																className={classes.quickServicePaperAvatar}
															>
																<AssignmentOutlinedIcon
																	style={{ fontSize: 60 }}
																/>
															</MC.Avatar>
														</MC.Grid>
														<MC.Grid item>
															<MC.Typography className={classes.body7}>
																자유게시판
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
												</MC.Paper>
											</MC.Grid>
										)}

									{mainContent &&
										mainContent.quickMenuDataType.isLinkFleaMarket && (
											<MC.Grid item xs={4}>
												<MC.Paper
													elevation={1}
													className={classes.quickServicePaper}
													onClick={() => goMenu("articles/fleaMarket")}
												>
													<MC.Grid
														container
														direction={"column"}
														justify={"center"}
														alignItems={"center"}
														style={{ width: "100%", height: "100%" }}
													>
														<MC.Grid item>
															<MC.Avatar
																className={classes.quickServicePaperAvatar}
															>
																<StorefrontOutlinedIcon
																	style={{ fontSize: 60 }}
																/>
															</MC.Avatar>
														</MC.Grid>
														<MC.Grid item>
															<MC.Typography className={classes.body7}>
																벼룩시장
															</MC.Typography>
														</MC.Grid>
													</MC.Grid>
												</MC.Paper>
											</MC.Grid>
										)}

									{!isDesktop && (
										<MC.Grid item className={classes.quickServicePaper} />
									)}
								</MC.Grid>
							) : (
								//Community 타입 아파트 - 시설 안내/예약 링크
								<MC.List
									className={classes.root}
									style={{ padding: 8, marginLeft: isDesktop ? 0 : 8 }}
								>
									<MC.ListItem
										className={classes.infoList_right}
										onClick={() => goMenu("facilityIntroduction/0")}
									>
										<MC.ListItemAvatar>
											<MC.Avatar
												className={classes.infoIconSize}
												src={"/images/dashboard/cs-icon.png"}
											/>
										</MC.ListItemAvatar>
										<MC.ListItemText>
											<MC.Typography className={classes.infoList_right_text}>
												이용안내
											</MC.Typography>
										</MC.ListItemText>
									</MC.ListItem>
									<MC.ListItem
										className={classes.infoList_right}
										onClick={() => goMenu("reservation")}
									>
										<MC.ListItemAvatar>
											<MC.Avatar
												className={classes.infoIconSize}
												src={"/images/dashboard/cs-icon.png"}
											/>
										</MC.ListItemAvatar>
										<MC.ListItemText>
											<MC.Typography className={classes.infoList_right_text}>
												예약하기
											</MC.Typography>
										</MC.ListItemText>
									</MC.ListItem>
								</MC.List>
							)}
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
			</div>

			{homepageType !== "CMMTY_TYPE" && (
				<div className={classes.lastBannerLayout}>
					<MC.Grid
						container
						justify={"center"}
						alignItems={"center"}
						spacing={2}
						className={classes.content}
						style={{ height: isDesktop ? 296 : 216 }}
					>

						<MC.Grid item xs={12} md={12}>
							{bannerImageList && bannerImageList.length > 0 ? (
								<Slide {...evntBannerZoomOutProperties}>
									{bannerImageList.map((attach, index) => (
										<div key={index} style={{ width: "100%", height: 135 }}>
											{/*링크 있을 경우에만 링크 이동 적용*/}
											{attach.link ? (
												<a href={attach.link} target="_blank">
													<img
														style={{ width: "100%", height: "100%" }}
														src={attach.img_url}
														alt={attach.file_orgn}
													/>
												</a>
											) : (
												<img
													style={{ width: "100%", height: "100%" }}
													src={attach.img_url}
													alt={attach.file_orgn}
												/>
											)}
										</div>
									))}
								</Slide>
							) : (
								<img
									src={"/images/dashboard/last-banner-img.png"}
									style={{ width: "100%", height: "100%" }}
								/>
							)}
						</MC.Grid>
					</MC.Grid>
				</div>
			)}

			{scheduleList.length > 0 && (
				<ScheduleBanner
					scheduleList={scheduleList}
					goArticleDetail={goArticleDetail}
				/>
			)}
		</div>
	);
};

export default inject(
	"UserSignInStore",
	"UserAptComplexStore"
)(observer(Dashboard));
