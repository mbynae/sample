import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import { Helmet } from "react-helmet";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		boxShadow: "none",
		border: "1px solid #ebebeb",
		[theme.breakpoints.down("lg")]: {
			height: 50,
			// marginTop: 0
		},
		[theme.breakpoints.up("lg")]: {
			height: 100,
			// marginTop: 40
		},
		backgroundColor: theme.palette.background.white,
	},
	toolbarLayout: {
		height: "100%",
		minHeight: "100%",
		[theme.breakpoints.down("lg")]: {
			height: 50,
			padding: 16,
			marginTop: 0,
		},
		[theme.breakpoints.up("lg")]: {
			padding: 0,
			width: "1180px",
			marginRight: "auto",
			marginLeft: "auto",
		},
	},
	rootMenuLayout: {
		width: 130,
		textAlign: "center",
	},
	rootMenuActive: {
		color: theme.palette.primary.main,
	},
	childMenuLayout: {
		width: "100%",
		height: "auto",
		backgroundColor: theme.palette.background.white,
		// boxShadow:                    `5px 5px ${theme.palette.background.grey}`,
		[theme.breakpoints.up("lg")]: {
			padding: "7px 0px",
			width: "1180px",
			marginRight: "auto",
			marginLeft: "auto",
		},
	},
	logoLayout: {
		height: "100%",
	},
	body6: {
		...theme.typography.body6,
		marginTop: 7,
		marginBottom: 10,
	},
	imageLayout: {
		[theme.breakpoints.down("lg")]: {
			height: 25,
		},
		[theme.breakpoints.up("lg")]: {
			height: 40,
		},
	},
	flexGrow: {
		flexGrow: 1,
	},
}));
const MenuBar = (props) => {
	const {
		className,
		isDesktop,
		onSidebarOpen,
		menus,
		mainContent,
		rootUrl,
		UserSignInStore,
		history,
		aptComplexId,
		aptId,
		...rest
	} = props;

	const classes = useStyles();

	const [expanded, setExpanded] = useState(true);
	const [isRootMenuActiveIndex, setIsRootMenuActiveIndex] = useState(0);
	const [isChildMenuActiveIndex, setIsChildMenuActiveIndex] = useState({
		rootIndex: 0,
		childIndex: 0,
	});

	useEffect(() => {
		const init = () => {
			isDesktop ? setExpanded(false) : setExpanded(false);
		};
		setTimeout(() => {
			init();
		});
	}, [isDesktop]);

	const handleChange = (param) => {
		setExpanded(!expanded);
		let facility = "facilityIntroduction";
		if (param && param.children[0].href.includes(facility)) {
			history.push(param.children[0].href + "/0");
		} else {
			history.push(param.children[0].href);
		}
	};

	const rootMenuOnMouseEnter = (event) => {
		let id = event.target.id;
		setIsRootMenuActiveIndex(id * 1);
		setExpanded(true);
	};

	const childMenuOnMouseEnter = (rootIndex, childIndex) => {
		setIsRootMenuActiveIndex(rootIndex * 1);
		setIsChildMenuActiveIndex((prev) => {
			return {
				rootIndex,
				childIndex,
			};
		});
	};

	const menuOnMouseLeave = (event) => {
		setIsRootMenuActiveIndex(0);
		setIsChildMenuActiveIndex({ rootIndex: 0, childIndex: 0 });
		setExpanded(false);
	};

	const goPage = (childMenu, childIndex) => {
		setExpanded(!expanded);
		// 메뉴에서 방문차량예약 선택시 방문차량예약 예약 기능으로 이동
		history.push(
			childMenu.href === rootUrl + "/visitingCar"
				? rootUrl + "/visitingCar/edit"
				: // 메뉴에서 시설 목록중 하나 선택시 선택된 시설의 Tab으로 이동
				childMenu.href === rootUrl + "/facilityIntroduction"
				? rootUrl + "/facilityIntroduction/" + childIndex
				: childMenu.href
		);
	};

	return (
		<>
			<Helmet>
				<title>{`${
					mainContent.aptComplex &&
					mainContent.aptComplex.aptInformationDataType.aptName + ` 사용자`
				}`}</title>
			</Helmet>
			<MC.AppBar
				{...rest}
				className={clsx(classes.root, className)}
				position={isDesktop ? "relative" : "absolute"}
				color={"transparent"}
				onMouseLeave={menuOnMouseLeave}
			>
				<MC.Toolbar className={classes.toolbarLayout}>
					<MC.Grid container alignItems={"center"}>
						<MC.Grid item xs={10} md={4}>
							<MC.Grid
								container
								direction={"row"}
								justify={"flex-start"}
								style={{ height: "100%" }}
							>
								<RouterLink
									to={`/${aptComplexId}/dashboard`}
									className={classes.logoLayout}
								>
									<MC.Grid
										container
										justify={"center"}
										alignItems={"center"}
										style={{ height: "100%" }}
									>
										<MC.Grid item>
											{mainContent.logoFile && mainContent.logoFile.fileUrl ? (
												<img
													className={classes.imageLayout}
													alt="Logo"
													src={mainContent.logoFile.fileUrl}
												/>
											) : (
												<MC.Typography variant={"h4"}>
													{mainContent.aptComplex &&
														mainContent.aptComplex.aptInformationDataType
															.aptName}
												</MC.Typography>
											)}
										</MC.Grid>
									</MC.Grid>
								</RouterLink>
							</MC.Grid>
						</MC.Grid>
						<MC.Grid item xs={2} md={8}>
							<MC.Grid container direction={"row"} justify={"flex-end"}>
								<MC.Hidden mdDown>
									{menus &&
										menus.length > 0 &&
										menus.map((rootMenu, index) => (
											<MC.Grid item key={index}>
												<MC.Typography
													variant={"h6"}
													className={classes.rootMenuLayout}
												>
													<MC.Link
														id={index + 1}
														onClick={() => handleChange(rootMenu)}
														className={
															isRootMenuActiveIndex === index + 1
																? classes.rootMenuActive
																: ""
														}
														onMouseEnter={rootMenuOnMouseEnter}
														color="inherit"
														underline="none"
														style={{ cursor: "pointer" }}
													>
														{rootMenu.title}
													</MC.Link>
												</MC.Typography>
											</MC.Grid>
										))}
								</MC.Hidden>
								<MC.Hidden lgUp>
									<MC.IconButton color="inherit" onClick={onSidebarOpen}>
										<MenuIcon />
									</MC.IconButton>
								</MC.Hidden>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				</MC.Toolbar>
				{expanded && (
					<MC.Hidden mdDown>
						<MC.Paper
							elevation={0}
							style={{
								position: "absolute",
								top: 99,
								width: "100%",
								zIndex: 2000,
							}}
						>
							<div
								className={classes.childMenuLayout}
								onMouseLeave={menuOnMouseLeave}
							>
								<MC.Grid container direction={"row"}>
									<MC.Grid item xs={6} md={4} />
									<MC.Grid item xs={6} md={8}>
										<MC.Grid container direction={"row"} justify={"flex-end"}>
											{menus &&
												menus.length > 0 &&
												menus.map((rootMenu, rootIndex) => (
													<MC.Grid item key={rootIndex}>
														<MC.Grid container direction={"column"}>
															{rootMenu.children.map(
																(childMenu, childIndex) => (
																	<MC.Typography
																		key={childMenu + " - " + childIndex}
																		className={clsx(
																			classes.rootMenuLayout,
																			classes.body6
																		)}
																	>
																		<MC.Link
																			id={childIndex + 1}
																			onClick={() =>
																				goPage(childMenu, childIndex)
																			}
																			className={
																				isChildMenuActiveIndex.rootIndex ===
																					rootIndex + 1 &&
																				isChildMenuActiveIndex.childIndex ===
																					childIndex + 1
																					? classes.rootMenuActive
																					: ""
																			}
																			onMouseEnter={(event) =>
																				childMenuOnMouseEnter(
																					rootIndex + 1,
																					childIndex + 1
																				)
																			}
																			color="inherit"
																			underline="none"
																			style={{ cursor: "pointer" }}
																		>
																			{childMenu.title}
																		</MC.Link>
																	</MC.Typography>
																)
															)}
															{rootMenu.children.length === 0 && (
																<MC.Typography
																	className={clsx(
																		classes.rootMenuLayout,
																		classes.body6
																	)}
																>
																	<MC.Link
																		color="inherit"
																		underline="none"
																		style={{ cursor: "pointer" }}
																	>
																		{""}
																	</MC.Link>
																</MC.Typography>
															)}
														</MC.Grid>
													</MC.Grid>
												))}
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							</div>
						</MC.Paper>
					</MC.Hidden>
				)}
			</MC.AppBar>
		</>
	);
};

MenuBar.propTypes = {
	className: PropTypes.string,
	onSidebarOpen: PropTypes.func,
};

export default MenuBar;
