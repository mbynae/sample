import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { FixedSizeList }              from "react-window";
import clsx                           from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { articleRepository, menuRepository } from "../../../repositories";
import palette                               from "../../../theme/adminTheme/palette";
import { DateFormat }                        from "../../../components";
import { BoardTabs }                         from "./components";

import AddIcon from "@material-ui/icons/Add";

import CreditCardTwoToneIcon           from "@material-ui/icons/CreditCardTwoTone";
import SupervisedUserCircleTwoToneIcon from "@material-ui/icons/SupervisedUserCircleTwoTone";
import MessageTwoToneIcon              from "@material-ui/icons/MessageTwoTone";
import BorderColorTwoToneIcon          from "@material-ui/icons/BorderColorTwoTone";
import EmailTwoToneIcon                from "@material-ui/icons/EmailTwoTone";
import LiveHelpTwoToneIcon             from "@material-ui/icons/LiveHelpTwoTone";
import { toJS }                        from "mobx";

const useStyles = MS.makeStyles(theme => ({
	root:             {
		padding: theme.spacing(3)
	},
	divider:          {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	content:          {
		marginTop: theme.spacing(2)
	},
	cardHeader:       {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:      {},
	paperLayout:      {
		width:  120,
		height: 120
	},
	iconButtonLayout: {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center",
		cursor:         "pointer"
	}
}));
const Dashboard = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history } = props;

	const [rootUrl, setRootUrl] = useState("");

	const [officeMenu, setOfficeMenu] = useState();
	const [officeArticles, setOfficeArticles] = useState();
	const [selectOfficeMenuKey, setSelectOfficeMenuKey] = useState();

	const [residentsMenu, setResidentsMenu] = useState();
	const [residentsArticles, setResidentsArticles] = useState();
	const [selectResidentsMenuKey, setSelectResidentsMenuKey] = useState();

	const [hpType, setHpType] = useState();

	useEffect(() => {
		const init = async () => {
			await generateRootUrl();
			await getMenus();
		};

		setTimeout(() => {
			init();
		});
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getMenus = async () => {
		let homepageType = toJS(AptComplexStore.aptComplex.contractInformationDataType.homepageType);
		setHpType(homepageType)
		let useType =
			homepageType === "BASIC_TYPE" ? "CMMTY"	// 기본형일 경우 BASIC, COMMON 유형 사용
				: homepageType === "CMMTY_TYPE" && "BASIC"	// 커뮤니티형일 경우 CMMTY, COMMON 유형 사용
		const childFilter = childMenu => childMenu.menuType === "BOARD_TYPE" && childMenu.useType !== useType;
		const childNotice = childMenu => childMenu.menuKey === "notice"
		const childFreeboard = childMenu => childMenu.menuKey === "freeBoard"
		const childSort = (a, b) => a.sequenceShowMainContentBoard - b.sequenceShowMainContentBoard;
		const findMenus = await menuRepository.getMenus({ aptId: AptComplexStore.aptComplex.aptId, menuType: "TOP_MENU_TYPE" });
		const menus = await menuRepository.getMenus({ aptId: AptComplexStore.aptComplex.aptId, menuType: "TOP_MENU_TYPE" });
		if(homepageType === "CMMTY_TYPE" || homepageType === "CMMTY"){
			setOfficeMenu(prev => {
				prev = findMenus.find(rootMenu => rootMenu.menuKey === "custCenter");
				if(prev){
					prev.childMenus = prev.childMenus.filter(childNotice);
					if(prev.childMenus[0]){
						setSelectOfficeMenuKey(prev.childMenus[0].menuKey);
						getArticles(prev.childMenus[0].menuKey, true);
						return {
							...prev
						};
					}
				}
			});
			setResidentsMenu(prev => {
				prev = menus.find(rootMenu => rootMenu.menuKey === "custCenter");
				if(prev){
					prev.childMenus = prev.childMenus.filter(childFreeboard);
					if(prev.childMenus[0]) {
						setSelectResidentsMenuKey(prev.childMenus[0].menuKey);
						getArticles(prev.childMenus[0].menuKey, false);
						return {
							...prev
						};
					}
				}
			});
		} else{
			setOfficeMenu(prev => {
				prev = findMenus.find(rootMenu => rootMenu.menuKey === "office");
				if(prev){
					prev.childMenus = prev.childMenus.filter(childFilter).sort(childSort);
					setSelectOfficeMenuKey(prev.childMenus[0].menuKey);
					getArticles(prev.childMenus[0].menuKey, true);
					return {
						...prev
					};
				}
			});
			setResidentsMenu(prev => {
				prev = findMenus.find(rootMenu => rootMenu.menuKey === "residents");
				if(prev){
					prev.childMenus = prev.childMenus.filter(childFilter).sort(childSort);
					setSelectResidentsMenuKey(prev.childMenus[0].menuKey);
					getArticles(prev.childMenus[0].menuKey, false);
					return {
						...prev
					};
				}
			});
		}
	};

	const getArticles = async (menuKey, isOffice) => {
		let findArticles = await articleRepository.getArticles({
			aptId:     AptComplexStore.aptComplex.id,
			menuKey:   menuKey,
			direction: "DESC",
			page:      0,
			size:      10,
			sort:      "baseDateDataType.createDate"
		});

		if ( isOffice ) {
			setOfficeArticles(findArticles);
		} else {
			setResidentsArticles(findArticles);
		}
	};

	const goBoard = (menuKey) => {
		history.push(`${rootUrl}/articles/${menuKey}`);
	};

	const goArticleDetail = (menuKey, id) => {
		history.push(`${rootUrl}/articles/${menuKey}/${id}`);
	};

	const goMenu = (menuKey) => {
		history.push(`${rootUrl}/${menuKey}`);
	};

	const renderRow = (props) => {
		const { index, style, data } = props;
		const article = data.articles[index];
		const menuKey = data.menuKey;

		const onClick = () => {
			if ( data.articles.length !== 0 ) {
				goArticleDetail(menuKey, article.id);
			}
		};

		return (
			<MC.ListItem
				button={data.articles.length !== 0}
				onClick={onClick}
				style={{ ...style, borderBottom: `1px solid ${palette.divider}` }}
				key={index}>
				{
					data.articles.length === 0 ?
						(
							<MC.ListItemText primary={"조회된 게시글이 없습니다."} />
						)
						:
						(
							<MC.Grid container justify={"space-between"} alignItems={"center"}>
								<MC.Grid item xs={6} md={6}>
									<MC.ListItemText primary={article?.title} />
								</MC.Grid>
								<MC.Grid item xs={6} md={6}>
									<MC.ListItemText style={{ textAlign: "right" }}>
										<DateFormat date={article?.createDate} format={"YYYY-MM-DD"} />
									</MC.ListItemText>
								</MC.Grid>
							</MC.Grid>
						)
				}
			</MC.ListItem>
		);
	};

	return (
		<div className={classes.root}>
			<MC.Grid container spacing={2}>
				<MC.Grid item xs={12} md={6}>
					<MC.Card>
						<MC.CardHeader
							title={"공지사항"}
							classes={{
								root:  classes.cardHeader,
								title: classes.cardHeader
							}}
							action={
								<MC.IconButton style={{ marginTop: 8 }} onClick={() => goBoard(selectOfficeMenuKey)}>
									<AddIcon />
								</MC.IconButton>
							}
						/>
						<MC.Divider />
						<BoardTabs
							menu={officeMenu}
							getArticles={getArticles}
							setSelectMenuKey={setSelectOfficeMenuKey}
						/>
						<MC.CardContent className={classes.cardContent}>
							<FixedSizeList
								height={400}
								itemSize={50}
								menuKey={"1234"}
								itemData={{ articles: (officeArticles ? officeArticles.content : []), menuKey: selectOfficeMenuKey }}
								itemCount={officeArticles ? (officeArticles.total> 10 ? 10 : officeArticles.total) : 0}
							>
								{renderRow}
							</FixedSizeList>
						</MC.CardContent>
					</MC.Card>
				</MC.Grid>

				<MC.Grid item xs={12} md={6}>
					<MC.Card>
						<MC.CardHeader
							title={"자유게시판"}
							classes={{
								root:  classes.cardHeader,
								title: classes.cardHeader
							}}
							action={
								<MC.IconButton style={{ marginTop: 8 }} onClick={() => goBoard(selectResidentsMenuKey)}>
									<AddIcon />
								</MC.IconButton>
							}
						/>
						<MC.Divider />
						<BoardTabs
							menu={residentsMenu}
							getArticles={getArticles}
							setSelectMenuKey={setSelectResidentsMenuKey}
						/>
						<MC.CardContent className={classes.cardContent}>
							<FixedSizeList
								height={400}
								itemSize={50}
								itemData={{ articles: residentsArticles ? residentsArticles.content : [], menuKey: selectResidentsMenuKey }}
								itemCount={residentsArticles ? (residentsArticles.total> 10 ? 10 : residentsArticles.total) : 0}
							>
								{renderRow}
							</FixedSizeList>
						</MC.CardContent>
					</MC.Card>
				</MC.Grid>

				<MC.Grid item xs={12} md={12}>
					<MC.Card>
						<MC.CardHeader
							title={"자주 찾는 서비스"}
							classes={{
								root:  classes.cardHeader,
								title: classes.cardHeader
							}}
						/>
						<MC.Divider />
						<MC.CardContent className={classes.cardContent} style={{ paddingLeft: 50, paddingRight: 50 }}>
							<MC.Grid container spacing={3} direction="row" justify={"space-between"} alignItems={"center"}>

								<MC.Grid item>
									<MC.Paper elevation={3} className={clsx(classes.paperLayout, classes.iconButtonLayout)}
														onClick={() => goMenu("managementFee")}>
										<div style={{ textAlign: "center" }}>
											<CreditCardTwoToneIcon fontSize="large" />
										</div>
										<MC.Typography variant={"h5"} style={{ textAlign: "center" }}>
											관리비
										</MC.Typography>
									</MC.Paper>
								</MC.Grid>

								<MC.Grid item>
									<MC.Paper elevation={3} className={clsx(classes.paperLayout, classes.iconButtonLayout)}
														onClick={() => goMenu("userMgnt")}>
										<div style={{ textAlign: "center" }}>
											<SupervisedUserCircleTwoToneIcon fontSize="large" />
										</div>
										<MC.Typography variant={"h5"} style={{ textAlign: "center" }}>
											입주민 관리
										</MC.Typography>
									</MC.Paper>
								</MC.Grid>

								{hpType !== "CMMTY_TYPE" && hpType !== "CMMTY" ?
									<MC.Grid item>
										<MC.Paper elevation={3} className={clsx(classes.paperLayout, classes.iconButtonLayout)}
															onClick={() => goMenu("articles/complaints")}>
											<div style={{ textAlign: "center" }}>
												<MessageTwoToneIcon fontSize="large" />
											</div>
											<MC.Typography variant={"h5"} style={{ textAlign: "center" }}>
												민원/하자
											</MC.Typography>
										</MC.Paper>
									</MC.Grid>
									: null}

								<MC.Grid item>
									<MC.Paper elevation={3} className={clsx(classes.paperLayout, classes.iconButtonLayout)}
														onClick={() => goMenu("contract")}>
										<div style={{ textAlign: "center" }}>
											<BorderColorTwoToneIcon fontSize="large" />
										</div>
										<MC.Typography variant={"h5"} style={{ textAlign: "center" }}>
											계약
										</MC.Typography>
									</MC.Paper>
								</MC.Grid>

								<MC.Grid item>
									<MC.Paper elevation={3} className={clsx(classes.paperLayout, classes.iconButtonLayout)}
														onClick={() => goMenu("sendSMS")}>
										<div style={{ textAlign: "center" }}>
											<EmailTwoToneIcon fontSize="large" />
										</div>
										<MC.Typography variant={"h5"} style={{ textAlign: "center" }}>
											문자발송
										</MC.Typography>
									</MC.Paper>
								</MC.Grid>

								<MC.Grid item>
									<MC.Paper elevation={3} className={clsx(classes.paperLayout, classes.iconButtonLayout)}
														onClick={() => goMenu("articles/ticket")}>
										<div style={{ textAlign: "center" }}>
											<LiveHelpTwoToneIcon fontSize="large" />
										</div>
										<MC.Typography variant={"h5"} style={{ textAlign: "center" }}>
											1:1문의
										</MC.Typography>
									</MC.Paper>
								</MC.Grid>

							</MC.Grid>
						</MC.CardContent>
					</MC.Card>
				</MC.Grid>
			</MC.Grid>

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(Dashboard));
