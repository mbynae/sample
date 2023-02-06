import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { Footer, MenuBar, NotifySidebar, Sidebar, Topbar } from "./components";
import {
	aptComplexRepository,
	autonomousOrganizationRepository,
	notificationRepository,
} from "../../../repositories";
import DashboardIcon from "@material-ui/icons/Dashboard";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		// paddingTop:                   50,
		// height:                       "100%",
		[theme.breakpoints.up("lg")]: {
			// paddingTop: 140
		},
		// backgroundColor:              theme.palette.background.white
	},
	shiftContent: {
		// paddingLeft: 240
	},
	content: {
		height: "100%",
	},
}));

const Main = (props) => {
	const { children, history, match, UserSignInStore, UserAptComplexStore } =
		props;

	const classes = useStyles();
	const theme = MS.useTheme();
	const isDesktop = MC.useMediaQuery(theme.breakpoints.up("lg"), {
		defaultMatches: true,
	});

	const [openSidebar, setOpenSidebar] = useState(false);
	const [menus, setMenus] = useState([]);
	const [mainContent, setMainContent] = useState({});
	const [notifications, setNotifications] = useState([]);
	const [openNotifySidebar, setOpenNotifySidebar] = useState(false);
	const [homepageType, setHomepageType] = useState(
		toJS(
			UserAptComplexStore.aptComplex.contractInformationDataType.homepageType
		)
	);

	useEffect(() => {
		const init = async () => {
			await getMenus();
			await getNotifications();
			setMainContent(toJS(UserAptComplexStore.mainContent));
		};
		setTimeout(() => {
			init();
		});
	}, [UserSignInStore.currentUser, history.location.pathname]);

	const getMenus = async () => {
		try {
			const menus = toJS(UserAptComplexStore.menus);
			const aptComplex = toJS(UserAptComplexStore.aptComplex);

			let aoList = await getAutonomousOrganizations();
			await aoList.content.map((ao) => {
				let tempTitle = ao.title;
				ao.title = ao.name;
				ao.name = tempTitle;
			});

			let useType =
				homepageType === "BASIC_TYPE"
					? "CMMTY" // 기본형일 경우 BASIC, COMMON 유형 사용
					: homepageType === "CMMTY_TYPE" && "BASIC"; // 커뮤니티형일 경우 CMMTY, COMMON 유형 사용

			menus.map((rootMenu) => {
				rootMenu.childMenus = rootMenu.childMenus.filter(
					(obj) => obj.isViewForUser && obj.useType !== useType
				);
			});

			setMenus((prev) => {
				let tempPages = [];

				// 홈페이지 유형에 따라 메뉴필터 생성
				let rootFilter = "";
				if (homepageType === "CMMTY_TYPE") {
					rootFilter = (obj) => obj.isViewForUser;
				} else {
					rootFilter = (obj) =>
						!(
							obj.menuKey === "serviceCenter" ||
							obj.menuKey === "mgnt" ||
							obj.isViewForUser === false
						);
				}

				const rootSort = (a, b) => a.sequence - b.sequence;
				menus
					.filter(rootFilter)
					.sort(rootSort)
					.map((rootMenu) => {
						let rootUrl = `/${UserAptComplexStore.aptComplex.aptId}`;

						let tempPage = {
							title: rootMenu.title,
							children: [],
						};

						rootMenu.childMenus.sort(rootSort).map((childMenu) => {
							let tempChildMenu = {
								title: childMenu.title,
								href:
									childMenu.menuType === "BOARD_TYPE"
										? `${rootUrl}/articles/` + childMenu.menuKey
										: childMenu.menuType === "INTRODUCTION_TYPE"
										? `${rootUrl}/introduction/${childMenu.menuKey}`
										: `${rootUrl}/${childMenu.menuKey}`,
							};
							// 부가서비스 메뉴 전용
							if (rootMenu.menuKey === "extraService") {
								if (childMenu.menuKey === "preCheck") {
									if (aptComplex.contractInformationDataType.isPreCheck) {
										// tempPage.children.push(tempChildMenu);
									}
								} else if (childMenu.menuKey === "residentReservation") {
									if (
										aptComplex.contractInformationDataType.isResidentReservation
									) {
										tempPage.children.push(tempChildMenu);
									}
								} else {
									tempPage.children.push(tempChildMenu);
								}
							} else {
								tempPage.children.push(tempChildMenu);
							}
						});

						// 자치기구관리 전용
						if (rootMenu.menuKey === "autonomousOrganization") {
							aoList.content.map((ao) => {
								tempPage.children.push({
									title: ao.title,
									href: `${rootUrl}/autonomousOrganization/${ao.id}`,
								});
							});
						}

						if (tempPage.children.length > 0) {
							tempPages.push(tempPage);
						}
					});

				// 커뮤니티 - 등록된 시설 없을 때 Default 시설안내 메뉴 생성
				if (homepageType === "CMMTY_TYPE") {
					if (tempPages.findIndex((item) => item.title == "시설안내") === -1) {
						tempPages.splice(1, 0, {
							title: "시설안내",
							children: [
								{
									title: "시설안내",
									href: `/${UserAptComplexStore.aptComplex.aptId}/facilityIntroduction`,
								},
							],
						});
					}
				}
				return [...tempPages];
			});
		} catch (e) {
			console.error(e);
		}
	};

	const getAutonomousOrganizations = async () => {
		return await autonomousOrganizationRepository.getAutonomousOrganizations(
			{
				aptId: UserAptComplexStore.aptComplex.id,
				direction: "ASC",
				page: 0,
				size: 100000,
				sort: "sequence",
			},
			true
		);
	};

	const handleSidebarOpen = () => {
		setOpenSidebar(true);
	};

	const handleSidebarClose = () => {
		setOpenSidebar(false);
	};

	const shouldOpenSidebar = isDesktop ? true : openSidebar;

	const getNotifications = async () => {
		if (UserSignInStore.currentUser.id) {
			notificationRepository.getNotifications(true).then((result) => {
				setNotifications(result.filter((noti) => noti.menuKey != null));
			});
		}
	};

	const updateNotification = async (id) => {
		notificationRepository.updateNotification(id, true).then((result) => {});
	};

	const handleNotifySidebarOpen = () => {
		setOpenNotifySidebar(true);
	};

	const handleNotifySidebarClose = () => {
		setOpenNotifySidebar(false);
	};

	const shouldOpenNotifySidebar = isDesktop ? true : openNotifySidebar;

	const goNoti = async (noti) => {
		if (noti.notificationTypeKind.toLowerCase() === "article") {
			handleNotifySidebarClose();
			await updateNotification(noti.id);
			await getNotifications();
			history.push(
				`/${UserAptComplexStore.aptComplex.aptId}/articles/${noti.menuKey}/${noti.targetId}`
			);
		} else if (noti.notificationTypeKind.toLowerCase() === "managementfee") {
			history.push({
				pathname: `${UserAptComplexStore.aptComplex.aptId}/myPage`,
				state: { value: 1 },
			});
		}
	};

	return (
		<div
			className={clsx({
				[classes.root]: true,
				[classes.shiftContent]: isDesktop,
			})}
		>
			<MC.Hidden mdDown>
				<Topbar
					UserSignInStore={UserSignInStore}
					aptComplexId={match.params.aptComplexId}
					getNotifications={getNotifications}
					updateNotification={updateNotification}
					notifications={notifications}
					history={history}
					aptComplex={toJS(UserAptComplexStore.aptComplex)}
				/>
			</MC.Hidden>
			<MenuBar
				isDesktop={isDesktop}
				history={history}
				aptComplexId={match.params.aptComplexId}
				aptId={UserAptComplexStore.aptComplex.id}
				onSidebarOpen={handleSidebarOpen}
				menus={menus}
				mainContent={mainContent}
				rootUrl={`/${UserAptComplexStore.aptComplex.aptId}`}
				UserSignInStore={UserSignInStore}
			/>
			<MC.Hidden lgUp>
				<Sidebar
					onClose={handleSidebarClose}
					open={shouldOpenSidebar}
					menus={menus}
					UserSignInStore={UserSignInStore}
					aptComplexId={match.params.aptComplexId}
					aptComplex={toJS(UserAptComplexStore.aptComplex)}
					history={history}
					variant={isDesktop ? "persistent" : "temporary"}
					handleNotifySidebarOpen={handleNotifySidebarOpen}
					notifications={notifications}
				/>
				<NotifySidebar
					onClose={handleNotifySidebarClose}
					open={shouldOpenNotifySidebar}
					getNotifications={getNotifications}
					updateNotification={updateNotification}
					notifications={notifications}
					history={history}
					goNoti={goNoti}
					variant={isDesktop ? "persistent" : "temporary"}
				/>
			</MC.Hidden>
			<main
				className={classes.content}
				style={{ paddingTop: isDesktop ? 0 : 50 }}
			>
				{children}
			</main>

			<Footer aptComplex={toJS(UserAptComplexStore.aptComplex)} />
		</div>
	);
};

Main.propTypes = {
	children: PropTypes.node,
};

export default inject("UserSignInStore", "UserAptComplexStore")(observer(Main));
