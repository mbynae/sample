import React, { useEffect, useState } from "react";
import clsx                           from "clsx";
import PropTypes                      from "prop-types";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import DashboardIcon            from "@material-ui/icons/Dashboard";
import SettingsIcon             from "@material-ui/icons/Settings";
import ApartmentIcon            from "@material-ui/icons/Apartment";
import BusinessIcon             from "@material-ui/icons/Business";
import LocationCityIcon         from "@material-ui/icons/LocationCity";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import LiveHelpIcon             from "@material-ui/icons/LiveHelp";
import AssignmentIcon           from "@material-ui/icons/Assignment";
import EventIcon          			from "@material-ui/icons/Event";
import LocalConvenienceStoreIcon from '@material-ui/icons/LocalConvenienceStore';
import BusinessCenterIcon 			from '@material-ui/icons/BusinessCenter';
import PeopleIcon 							from '@material-ui/icons/People';

import { Profile, SidebarNav } from "./components";
import { toJS }                from "mobx";

const useStyles = MS.makeStyles(theme => ({
	drawer:  {
		width:                        245,
		[theme.breakpoints.up("lg")]: {
			marginTop: 64,
			height:    "calc(100% - 64px)"
		}
	},
	root:    {
		backgroundColor: theme.palette.white,
		display:         "flex",
		flexDirection:   "column",
		height:          "100%",
		padding:         "12px",
		overflowX:			 "hidden"
	},
	divider: {
		margin: theme.spacing(2, 0)
	},
	nav:     {
		marginBottom: theme.spacing(2)
	}
}));

const Sidebar = props => {

	const { open, variant, onClose, className, history, menus, aptComplex, aptComplexId, homepageType, ...rest } = props;

	const classes = useStyles();
	const [pages, setPages] = useState([]);
	const [rootUrl, setRootUrl] = useState(`/${aptComplexId}/admin`);
	const sort = (a, b) => a.sequence - b.sequence;
	let menuFilter = obj => obj.isViewForOffice;

	useEffect(() => {
		const init = () => {

			let tempPages = [];
			tempPages.push({title: "메인", href: `${rootUrl}/dashboard`, icon: <DashboardIcon />});

			menus.filter(menuFilter).sort(sort).map((menu) => {
				let icon = "";
				if ( menu.menuKey === "mgnt" ) {
					icon = <SettingsIcon />;
				} else if ( menu.menuKey === "intro" ) {
					icon = <ApartmentIcon />;
				} else if ( menu.menuKey === "office" || menu.menuKey === "custCenter" ) {
					icon = <BusinessIcon />;
				} else if ( menu.menuKey === "autonomousOrganization" ) {
					icon = <LocationCityIcon />;
				} else if ( menu.menuKey === "residents" ) {
					icon = <SupervisedUserCircleIcon />;
				} else if ( menu.menuKey === "serviceCenter" ) {
					icon = <LiveHelpIcon />;
				} else if ( menu.menuKey === "extraService" ) {
					icon = <AssignmentIcon />;
				} else if ( menu.menuKey === "reservationMgnt" ) {
					icon = <EventIcon />;
				} else if ( menu.menuKey === "fcltLessonMgnt" ) {
					icon = <LocalConvenienceStoreIcon />;
				} else if ( menu.menuKey === "serviceMgnt" ) {
					icon = <BusinessCenterIcon />;
				} else if ( menu.menuKey === "resrvMgnt") {
					icon = <AssignmentIcon />
				}

				let tempPage = {
					title:    menu.title,
					icon:     icon,
					children: []
				};

				// 홈페이지 유형에 따라 각 탑메뉴의 자식메뉴 필터링
				if(homepageType === 'BASIC_TYPE') {
					menu.childMenus = menu.childMenus.filter(child => child.isViewForOffice === true && child.useType !== 'CMMTY');
				} else if(homepageType == 'CMMTY_TYPE') {
					menu.childMenus = menu.childMenus.filter(child => child.isViewForOffice === true && child.useType !== 'BASIC');
				} else if(homepageType === 'MIXED_TYPE') {
					menu.childMenus = menu.childMenus.filter(child => child.isViewForOffice === true);
				}

				menu.childMenus.sort(sort).map((childMenu) => {
					let tempChildMenu = {
						title: childMenu.title,
						href:  childMenu.menuType === "BOARD_TYPE" ? (`${rootUrl}/articles/` + childMenu.menuKey) :
							childMenu.menuType === "INTRODUCTION_TYPE" ? `${rootUrl}/introduction/${childMenu.menuKey}` : `${rootUrl}/${childMenu.menuKey}`
					};

					// 부가서비스 메뉴 전용
					if ( menu.menuKey === "extraService" ) {
						if(childMenu.menuKey === "preCheck"){
							if(aptComplex.contractInformationDataType.isPreCheck){
								tempPage.children.push(tempChildMenu);
							}
						} else if(childMenu.menuKey === "residentReservation") {
							if(aptComplex.contractInformationDataType.isResidentReservation){
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
				if ( menu.menuKey === "autonomousOrganization" ) {
					tempPage.children.push({
						title: "자치기구 관리",
						href:  `${rootUrl}/autonomousOrganizations`
					});
				}

				tempPages.push(tempPage);
				tempPages.sort(sort);
			});

			setPages(tempPages);
		};
		setTimeout(() => {
			init();
		});
	}, [menus]);

	return (
		<MC.Drawer
			anchor="left"
			classes={{ paper: classes.drawer }}
			onClose={onClose}
			open={open}
			variant={variant}
		>
			<div
				{...rest}
				className={clsx(classes.root, className)}
			>
				<Profile
					history={history}
					onClose={onClose}
					aptComplexId={aptComplexId} />
				<MC.Divider className={classes.divider} />
				<SidebarNav
					className={classes.nav}
					history={history}
					pages={pages}
					onClose={onClose}
				/>
			</div>
		</MC.Drawer>
	);
};

Sidebar.propTypes = {
	className: PropTypes.string,
	onClose:   PropTypes.func,
	open:      PropTypes.bool.isRequired,
	variant:   PropTypes.string.isRequired
};

export default Sidebar;
