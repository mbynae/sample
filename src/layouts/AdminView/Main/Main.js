import React, { useEffect, useState } from "react";
import PropTypes                      from "prop-types";
import clsx                           from "clsx";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { Sidebar, Topbar }            from "./components";
import {
	aptComplexRepository,
	menuRepository,
	mainContentRepository,
	notificationRepository,
} from "../../../repositories";
import { toJS }                       from "mobx";
import { AlertDialog }                from "../../../components";
import moment                         from "moment";

const useStyles = MS.makeStyles(theme => ({
	root:         {
		paddingTop:                   56,
		height:                       "100%",
		[theme.breakpoints.up("sm")]: {
			paddingTop: 64
		}
	},
	shiftContent: {
		paddingLeft: 240
	},
	content:      {
		height: "100%"
	}
}));

const Main = props => {
	const { children, history, match, AptComplexStore, SignInStore } = props;

	const classes = useStyles();
	const theme = MS.useTheme();
	const isDesktop = MC.useMediaQuery(theme.breakpoints.up("lg"), {
		defaultMatches: true
	});

	const [openSidebar, setOpenSidebar] = useState(false);
	const [menus, setMenus] = useState([]);
	const [mainContent, setMainContent] = useState({});
	const [notifications, setNotifications] = useState([]);
	const [homepageType, setHomepageType] = useState('');

	useEffect(() => {
		const init = () => {
			getAptComplex();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	useEffect(() => {
		const init = () => {
			getNotifications();
			checkAccessTokenExpiration();
		};
		setTimeout(() => {
			init();
		});
	}, [history.location.pathname]);


	const getAptComplex = async () => {
		try {
			const aptComplex = await aptComplexRepository.getAptComplex(match.params.aptComplexId);
			await AptComplexStore.setAptComplex(aptComplex);
			await getHomepageType();
			await getMenus();
			await getMainContent();
			await getNotifications();
		} catch ( e ) {
			AptComplexStore.setAptComplex({});
			history.push(`${match.url}/not-found`);
		}
	};

	const checkAccessTokenExpiration = () => {
		const current_time = moment().format('YYYY-MM-DD HH:mm:ss');
		const accessTokenExpiration = localStorage.getItem('accessTokenExpiration');

		if(current_time > accessTokenExpiration) {
			handleAlertToggle(
				"isOpen",
				"로그인 토큰시간 만료",
				"로그인 토큰시간이 만료되어 자동 로그아웃 됩니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					SignInStore.logout();
					history.push(`${match.url}/sign-in`);
				}
			);
		}
	}

	const getMenus = async () => {
		const menus = await menuRepository.getMenus({ aptId: AptComplexStore.aptComplex.aptId, menuType: "TOP_MENU_TYPE" });
		setMenus(menus);
	};

	const getMainContent = async () => {
		const mainContent = await mainContentRepository.getMainContent({ aptId: AptComplexStore.aptComplex.id });
		setMainContent(mainContent);
	};

	const getHomepageType = async () => {
		await setHomepageType(toJS(AptComplexStore.aptComplex.contractInformationDataType.homepageType));
		if(toJS(AptComplexStore.aptComplex.contractInformationDataType.homepageType) !== "BASIC_TYPE") {
			await getCmpxNumb();
		}
	}

	const getCmpxNumb = async () => {
		const cmpxNumbInfo = await aptComplexRepository.getAdminCmpxNumb();
		await AptComplexStore.setCmpxNumb(cmpxNumbInfo.cmpx_numb);
	}

	const handleSidebarOpen = () => {
		setOpenSidebar(true);
	};

	const handleSidebarClose = () => {
		setOpenSidebar(false);
	};

	const shouldOpenSidebar = isDesktop ? true : openSidebar;

	const getNotifications = async () => {
		notificationRepository
			.getNotifications()
			.then(result => {
				setNotifications(result);
			});
	};

	const updateNotification = async (id) => {
		notificationRepository
			.updateNotification(id)
			.then(result => {
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
		<div
			className={clsx({
				[classes.root]:         true,
				[classes.shiftContent]: isDesktop
			})}
		>
			<Topbar
				history={history}
				aptComplexId={match.params.aptComplexId}
				onSidebarOpen={handleSidebarOpen}
				mainContent={mainContent}
				getNotifications={getNotifications}
				updateNotification={updateNotification}
				homepageType={homepageType}
				notifications={notifications} />
			<Sidebar
				onClose={handleSidebarClose}
				open={shouldOpenSidebar}
				menus={menus}
				aptComplex={toJS(AptComplexStore.aptComplex)}
				aptComplexId={match.params.aptComplexId}
				history={history}
				homepageType={homepageType}
				variant={isDesktop ? "persistent" : "temporary"}
			/>
			<main className={classes.content}>
				{children}
			</main>

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

Main.propTypes = {
	children: PropTypes.node
};

export default inject("AptComplexStore", "SignInStore")(observer(Main));
