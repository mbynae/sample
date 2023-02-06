import React, { useEffect, useState }                   from "react";
import { inject, observer }                             from "mobx-react";
import { withRouter }                                   from "react-router-dom";
import { toJS }                                         from "mobx";
import { Marker, NaverMap, RenderAfterNavermapsLoaded } from "react-naver-maps";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { introductionRepository, mapsRepository } from "../../../repositories";
import { constants }                              from "../../../commons";
import { IntroductionTabs }                       from "./components";
import clsx                                       from "clsx";

const useStyles = MS.makeStyles(theme => ({
	root:       {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background: {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          245,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:    {
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
	layout:     {
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
	body4:      {
		...theme.typography.body4,
		marginTop: 6
	},
	qlEditor:   {
		"& img": {
			[theme.breakpoints.down("xs")]: {
				width: "100%"
			}
		}
	}
}));
const Introductions = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, history, match } = props;
	const { menuKey } = match.params;

	const [isLoading, setIsLoading] = useState(true);
	const [value, setValue] = useState(0);
	const setIntroIndex = (introMenus) => {
		let findMenuIndex = introMenus.findIndex(obj => obj.menuKey === menuKey);
		setValue(findMenuIndex);
	};
	const handleChangeTabs = (event, newValue) => {
		let findMenu = introMenus.sort(sort).find((obj, index) => index === newValue);
		history.push(`/${UserAptComplexStore.aptComplex.aptId}/introduction/${findMenu.menuKey}`);
	};

	const [introMenus, setIntroMenus] = useState([]);
	const [introduction, setIntroduction] = useState();
	const NAVER_API_KEY = constants.NAVER_MAP_API_KEY;
	const [center, setCenter] = useState({
		lat: 37.5666103,
		lng: 126.9783882
	});

	const sort = (a, b) => a.sequence - b.sequence;

	useEffect(() => {
		const init = () => {
			setIsLoading(true);
			let introTopMenu = toJS(UserAptComplexStore.menus).find(obj => obj.menuKey === "intro");
			let introChildMenus = introTopMenu.childMenus.filter(obj => obj.isViewForUser).sort(sort);
			setIntroMenus(introChildMenus);
			setIntroIndex(introChildMenus);
			getIntroduction(menuKey);
		};
		setTimeout(() => {
			init();
		});
	}, [menuKey]);

	const checkComplexLocation = () => menuKey === "complexLocation";

	const getIntroduction = (menuKey) => {
		introductionRepository
			.getIntroduction({
				aptId:   UserAptComplexStore.aptComplex.id,
				menuKey: menuKey
			}, true)
			.then(async result => {
				await dataBinding(result);
				(checkComplexLocation() && result.address !== null) && await getGeocode(result.address);
				setIsLoading(false);
			});
	};

	const dataBinding = (obj) => {
		setIntroduction(prev => {
			return {
				...prev,
				id:                  obj ? obj.id : "",
				aptComplex:          obj ? obj.aptComplex : {},
				menuKey:             obj ? obj.menuKey : "",
				title:               obj ? obj.title : "",
				content:             obj ? obj.content : "",
				address:             obj ? obj.address : "",
				attachmentDataTypes: obj ? obj.attachmentDataTypes : []
			};
		});
	};

	const getGeocode = async (fullAddress) => {
		let result = await mapsRepository.getGeocode({
			query: fullAddress
		});

		setCenter({
			lat: result.addresses[0].y,
			lng: result.addresses[0].x
		});
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
										단지소개
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
						}

						<MC.Grid item style={{ marginTop: isMobile ? 0 : 73 }}>
							<IntroductionTabs
								isMobile={isMobile}
								introMenus={introMenus}
								value={value}
								handleChange={handleChangeTabs} />
						</MC.Grid>

						<MC.Grid item style={{ minHeight: 500,marginTop: isMobile ? 0 : 81, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>

							{
								!isLoading &&
								<>
									{
										checkComplexLocation() &&
										<MC.Grid container spacing={1}>
											<MC.Grid item xs={12} md={12}>
												<RenderAfterNavermapsLoaded
													ncpClientId={NAVER_API_KEY} // 자신의 네이버 계정에서 발급받은 Client ID
													// error={<p>Maps Load Error</p>}
													// loading={<p>Maps Loading...</p>}
												>
													<NaverMap
														mapDivId={"react-naver-map"} // default: react-naver-map
														style={{
															width:  "100%", // 네이버지도 가로 길이
															height: 520 // 네이버지도 세로 길이
														}}
														center={center}
													>
														<Marker
															position={center}
															animation={2}
														/>
													</NaverMap>
												</RenderAfterNavermapsLoaded>
											</MC.Grid>
										</MC.Grid>
									}

									<div className={clsx("ql-editor", classes.qlEditor)} dangerouslySetInnerHTML={{ __html: introduction.content }}
									     style={{ minHeight: 500, maxHeight: "none" }}>
									</div>
								</>
							}

						</MC.Grid>

					</div>
				</MC.Grid>

		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore")(withRouter(observer(Introductions)));
