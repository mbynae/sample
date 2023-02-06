import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { toJS }                       from "mobx";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { aoPositionRepository, autonomousOrganizationRepository } from "../../../repositories";
import { AutonomousOrganizationsTabs }                            from "./components";
import clsx                                                       from "clsx";

const useStyles = MS.makeStyles(theme => ({
	root:         {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background:   {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          245,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:      {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		maxWidth:                       "1180px",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	layout:       {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width:                          "100%",
		paddingTop:                     85,
		paddingBottom:                  80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			padding:       0,
			paddingTop:    0,
			paddingBottom: 80
		}
	},
	body4:        {
		...theme.typography.body4,
		marginTop: 6
	},
	rhombusBig:   {
		position:   "absolute",
		bottom:     0,
		right:      0,
		width:      20,
		height:     20,
		opacity:    0.3,
		margin:     "26 0 0 173",
		background: "linear-gradient(to top left, #edd6c8 50%, #fff 50%)"
	},
	rhombusSmall: {
		position:   "absolute",
		bottom:     0,
		right:      0,
		width:      10,
		height:     10,
		opacity:    0.3,
		margin:     "26 0 0 173",
		background: "linear-gradient(to top left, #edd6c8 50%, #fff 50%)"
	},
	dot:          {
		width:           "4px",
		height:          "4px",
		margin:          "10px 6px 10px 0",
		backgroundColor: "#449CE8"
	},
	qlEditor:     {
		"& img": {
			[theme.breakpoints.down("xs")]: {
				width: "100%"
			}
		}
	}
}));
const AutonomousOrganizations = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, history, match } = props;
	const { id } = match.params;

	const [isLoading, setIsLoading] = useState(true);
	const [value, setValue] = useState(0);
	const setAOIndex = (aoMenus) => {
		let findMenuIndex = aoMenus.findIndex(obj => obj.id * 1 === id * 1);
		setValue(findMenuIndex);
	};
	const handleChangeTabs = (event, newValue) => {
		let findMenu = aoMenus.sort(sort).find((obj, index) => index === newValue);
		history.push(`/${UserAptComplexStore.aptComplex.aptId}/autonomousOrganization/${findMenu.id}`);
	};

	const [aoMenus, setAOMenus] = useState([]);
	const [autonomousOrganization, setAutonomousOrganization] = useState();
	const [aoPositions, setAOPositions] = useState([]);

	const sort = (a, b) => a.sequence - b.sequence;
	useEffect(() => {
		const init = async () => {
			setIsLoading(true);
			let introTopMenu = toJS(UserAptComplexStore.menus).find(obj => obj.menuKey === "autonomousOrganization");
			let aoList = await getAutonomousOrganizations();
			aoList.content.map(ao => {
				introTopMenu.childMenus.push({
					...ao
				});
			});
			let introChildMenus = introTopMenu.childMenus.sort(sort);
			setAOMenus(introChildMenus);
			setAOIndex(introChildMenus);
			getAutonomousOrganization(id);
		};
		setTimeout(() => {
			init();
		});
	}, [id]);

	const getAutonomousOrganizations = async () => {
		return await autonomousOrganizationRepository
			.getAutonomousOrganizations({
				aptId:     UserAptComplexStore.aptComplex.id,
				direction: "ASC",
				page:      0,
				size:      100000,
				sort:      "sequence"
			}, true);
	};

	const getAutonomousOrganization = (id) => {
		autonomousOrganizationRepository
			.getAutonomousOrganization(id, {
				aptId: UserAptComplexStore.aptComplex.id
			}, true)
			.then(async result => {
				await dataBinding(result);
				await getAOPositions();
				setIsLoading(false);
			});
	};

	const dataBinding = (obj) => {
		setAutonomousOrganization(prev => {
			return {
				...prev,
				aptId:               UserAptComplexStore.aptComplex.id,
				id:                  obj ? obj.id : "",
				sequence:            obj ? obj.sequence : "",
				name:                obj ? obj.name : "",
				title:               obj ? obj.title : "",
				content:             obj ? obj.content : "",
				attachmentDataTypes: obj ? obj.attachmentDataTypes : [],
				aptComplex:          obj ? obj.aptComplex : {},
				aoPositions:         obj ? obj.aoPositions : "",
				baseDateDataType:    obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				}
			};
		});
	};

	const aoPositionSort = (a, b) => a.aoPosition.sequence - b.aoPosition.sequence;

	const getAOPositions = async () => {
		let searchParams = {
			autonomousOrganizationId: id
		};
		const aoPositions = await aoPositionRepository.getAOPositions(searchParams, true);
		setAOPositions(aoPositions.sort(aoPositionSort));
	};

	return (
		<div className={classes.root}>

			{
				!isMobile &&
				<div className={classes.background} />
			}

			<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
			         className={classes.content}>
				<div className={classes.layout}>

					{
						!isMobile &&
						<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
							<MC.Grid item>
								<MC.Typography variant="h3">
									자치기구
								</MC.Typography>
							</MC.Grid>
						</MC.Grid>
					}

					<MC.Grid item style={{ marginTop: isMobile ? 0 : 73 }}>
						<AutonomousOrganizationsTabs
							isMobile={isMobile}
							aoMenus={aoMenus}
							value={value}
							handleChange={handleChangeTabs} />
					</MC.Grid>

					{
						!isLoading &&
						<>
							<MC.Grid item style={{ marginTop: isMobile ? 0 : 81, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>

								<div className={clsx("ql-editor", classes.qlEditor)} dangerouslySetInnerHTML={{ __html: autonomousOrganization.content }}
								     style={{ minHeight: 500, maxHeight: "none" }}>
								</div>

							</MC.Grid>

							{
								(aoPositions && aoPositions.length > 0) &&
								<MC.Grid item style={{ paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
									<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}
									         style={{ backgroundColor: "#fafafa", padding: 60, paddingTop: 40, paddingLeft: isMobile ? 16 : 60, paddingRight: isMobile ? 16 : 60 }}>

										<MC.Grid item style={{ width: "100%" }}>
											<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
												<MC.Grid item>
													<MC.Typography variant="h3">
														구성원
													</MC.Typography>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>

										{/*{*/}
										{/*	(aoPositions && aoPositions.length > 0) ?*/}
										{/*		(*/}
										<MC.Grid item style={{ width: "100%", marginTop: 30 }}>

											<MC.Grid container spacing={2} direction={"row"} justify={"flex-start"} alignItems={"center"}>

												{
													aoPositions.map((groups, groupIndex) => (
														<MC.Grid item xs={12} md={4} key={groupIndex}>
															<div style={{
																backgroundColor: "#ffffff",
																border:          "1px solid #ebebeb",
																position:        "relative"
															}}>
																<div className={classes.rhombusBig} />
																<div className={classes.rhombusSmall} />

																<MC.Grid container direction={"row"} justify={"flex-start"}
																         style={{ padding: 20 }}>

																	<MC.Grid item>
																		<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
																			<MC.Grid item>
																				<div className={classes.dot} />
																			</MC.Grid>
																			<MC.Grid item>
																				<MC.Typography variant="subtitle1">
																					{groups.aoPosition.name} &nbsp;
																				</MC.Typography>
																			</MC.Grid>
																		</MC.Grid>
																	</MC.Grid>

																	<MC.Grid item>
																		<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
																			<MC.Grid item>
																				{
																					groups.userList.length > 0 ?
																						(
																							groups.userList.map((user, index) => (
																									<MC.Typography variant="subtitle1" style={{ fontWeight: "normal" }} key={index}>
																										{user.name} {(groups.userList.length - 1) > index && ", "}
																									</MC.Typography>
																								)
																							)
																						)
																						:
																						(
																							<MC.Typography variant="subtitle1" style={{ fontWeight: "normal" }}>
																								-
																							</MC.Typography>
																						)
																				}
																			</MC.Grid>
																		</MC.Grid>
																	</MC.Grid>
																</MC.Grid>
															</div>
														</MC.Grid>
													))
												}

											</MC.Grid>
										</MC.Grid>
										{/*		)*/}
										{/*		:*/}
										{/*		(*/}
										{/*			<MC.Grid item style={{ marginTop: 30 }}>*/}
										{/*				<MC.Typography variant={"h6"}>*/}
										{/*					관리되고 있는 직책이 없습니다.*/}
										{/*				</MC.Typography>*/}
										{/*			</MC.Grid>*/}
										{/*		)*/}
										{/*}*/}
									</MC.Grid>
								</MC.Grid>

							}

						</>
					}
				</div>
			</MC.Grid>
		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore")(withRouter(observer(AutonomousOrganizations)));
