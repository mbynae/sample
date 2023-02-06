import React, { useEffect, useState } from "react";
import { Slide }                      from "react-slideshow-image";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import DomainIcon from "@material-ui/icons/Domain";

import "react-slideshow-image/dist/styles.css";

import { accountRepository, managementFeeRepository } from "../../../../../repositories";
import { NumberComma }                                from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	indicator:        {
		cursor:      "pointer",
		padding:     "10px",
		textAlign:   "center",
		border:      "1px #666 solid",
		"& .active": {
			color:      "#fff",
			background: "#666"
		}
	},
	slide:            {
		position:                                "relative",
		[theme.breakpoints.between("xs", "sm")]: {
			marginBottom: 231
		},
		[theme.breakpoints.between("sm", "md")]: {
			marginBottom: 180
		},
		[theme.breakpoints.up("md")]:            {
			marginBottom: 20
		},
		"& .indicators":                         {
			width:                          "100%",
			position:                       "absolute",
			margin:                         "0 !important",
			[theme.breakpoints.up("sm")]:   {
				bottom: 30
			},
			[theme.breakpoints.down("sm")]: {
				bottom: 60
			},
			display:                        "flex",
			flexDirection:                  "row",
			justify:                        "center"
		},
		"& .active":                             {
			opacity:         1,
			backgroundColor: theme.palette.white
		}
	},
	smallDivider:     {
		width:           16,
		height:          1,
		marginBottom:    10,
		backgroundColor: "#222222"
	},
	indicatorDivider: {
		cursor:                         "pointer",
		[theme.breakpoints.up("sm")]:   {
			width: 120
		},
		[theme.breakpoints.down("sm")]: {
			width: 80
		},
		height:                         3,
		margin:                         theme.spacing(0, 1),
		backgroundColor:                theme.palette.white,
		opacity:                        0.3
	},

	profileLayout: {
		width:                          "100%",
		position:                       "absolute",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.up("sm")]:   {
			height:         "100%",
			justifyContent: "center",
			alignItems:     "flex-end",
			top:            0
		},
		[theme.breakpoints.down("sm")]: {
			height:         231,
			justifyContent: "flex-start",
			alignItems:     "center",
			top:            281
		}
	},
	profileBox:    {
		backgroundColor:                "rgb(255, 255, 255, 0.9)",
		[theme.breakpoints.up("sm")]:   {
			width:       382,
			height:      360,
			padding:     40,
			paddingTop:  36,
			"& div":     {
				padding: 8
			},
			marginRight: 50
		},
		[theme.breakpoints.down("sm")]: {
			width:        328,
			height:       231,
			padding:      16,
			"& div":      {
				padding: 4
			},
			marginRight:  0,
			"box-shadow": "0 10px 20px 0 rgba(0,0,0,0.08)"
		}
	},
	body5: {
		...theme.typography.body5,
		whiteSpace: "pre-line"
	},
	body2: {
		...theme.typography.body2
	},
	h5:    {
		...theme.typography.h5
	}
}));

const MainBanners = props => {
	const classes = useStyles();
	const { UserAptComplexStore, isDesktop, mainContent, goPage, goMenu, currentUser } = props;

	const defaultImages = [
		"/images/dashboard/slide-01-default.png"
	];
	const defaultImages1 = [
		"/images/dashboard/de-img.png"
	];

	const zoomOutProperties = {
		// indicators: true,
		// scale:      0.4,
		infinite:     !!(mainContent && mainContent.mainBannerAttachments.length >= 2),
		autoplay:     !!(mainContent && mainContent.mainBannerAttachments.length >= 2),
		arrows:       false,
		pauseOnHover: false,
		indicators:   i => (<MC.Divider className={classes.indicatorDivider} />)
	};

	const [nowYearMonth, setNowYearMonth] = useState();
	const [totalFee, setTotalFee] = useState(0);
	const [noFee, setNoFee] = useState(true);

	useEffect(() => {
		const init = async () => {

			if ( currentUser.id ) {
				let result = await getManagementFees();
				if ( result.content && result.content.length > 0 ) {

					setNowYearMonth(prev => {
						return moment(result.content[0].billingYearMonth).format("YYYY년 MM월");
					});

					try {
						let feeInfoResults = await findMyManagementFeeInfos(result.content[0].billingYearMonth);
						if ( feeInfoResults && feeInfoResults.length > 0 ) {
							setTotalFee(prev => {
								let totalFee = 0;
								feeInfoResults.map(obj => {
									totalFee += obj.price;
								});
								return totalFee;
							});
							setNoFee(false);
						}
					} catch ( e ) {
						setNoFee(true);
					}
				} else {
					setNoFee(true);
				}
			}

		};
		setTimeout(() => {
			init();
		});
	}, []);

	const getManagementFees = () => {
		return managementFeeRepository.getManagementFees({
			aptId:     UserAptComplexStore.aptComplex.id,
			direction: "DESC",
			page:      0,
			size:      100000,
			sort:      "baseDateDataType.createDate"
		}, true);
	};

	const findMyManagementFeeInfos = async (billingYearMonth) => {
		let feeDate = moment(billingYearMonth);
		return await accountRepository.findMyManagementFee({ managementFeeDate: feeDate.format("YYYYMM") }, true);
	};

	const RenderProfileCard = props => {
		return (
			<div className={classes.profileLayout}>
				<MC.Grid
					container
					direction={"column"}
					justify={"center"}
					alignItems={"stretch"}
					className={classes.profileBox}>
					{
						currentUser.aptComplex ?
							(
								<>
									<MC.Grid item>
										<MC.Typography
											className={classes.body2}
											variant="body2">
											{currentUser.aptComplex.aptInformationDataType.aptName} | {currentUser.userDataType.building} 동 {currentUser.userDataType.unit} 호
										</MC.Typography>
									</MC.Grid>
									<MC.Grid item>
										<MC.Typography className={classes.h5}>
											{currentUser.name} 님
										</MC.Typography>
									</MC.Grid>
									<MC.Grid item style={{ backgroundColor: "#ebebeb", marginTop: 13 }}>


										<MC.Grid container direction={"column"} alignItems={"center"}>
											{
												noFee ?
													(
														<>
															<MC.Grid item>
																<MC.Typography
																	className={classes.body2}
																	variant="body2">
																	등록된 관리비가 없습니다.
																</MC.Typography>
															</MC.Grid>
														</>
													)
													:
													(
														<>
															<MC.Grid item>
																<MC.Typography
																	className={classes.body2}
																	style={{ cursor: "pointer" }}
																	variant="body2">
																	<MC.Link name="myPage" onClick={() => goMenu("myPage/2/0")} color="inherit">
																		{nowYearMonth} 관리비
																	</MC.Link>
																</MC.Typography>
															</MC.Grid>
															<MC.Grid item style={{ padding: 0 }}>
																<MC.Divider className={classes.smallDivider} />
															</MC.Grid>
															<MC.Grid item>
																<MC.Typography
																	className={classes.h5}>
																	{NumberComma(totalFee)} 원
																</MC.Typography>
															</MC.Grid>
														</>
													)
											}
										</MC.Grid>
									</MC.Grid>
									{
										isDesktop &&
										<MC.Grid item>
											<MC.Grid container direction={"row"} spacing={0} justify={"space-around"} style={{ color: "#449CE8" }}>
												<MC.Grid item xs={6} md={6}>
													<MC.Button
														size="large"
														disableElevation
														style={{ padding: 0, borderRadius: 0, width: "100%", height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
														onClick={() => goPage("sign-out")}>
														로그아웃
													</MC.Button>
												</MC.Grid>
												<MC.Grid item xs={6} md={6}>
													<MC.Button
														variant="contained"
														size="large"
														color="primary"
														disableElevation
														style={{ padding: 0, borderRadius: 0, width: "100%", height: 40 }}
														onClick={() => goPage("myPage/0/0")}>
														마이페이지
													</MC.Button>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
									}
								</>
							)
							:
							(
								<>
									<MC.Grid item style={{ color: "#449CE8" }}>
										<DomainIcon fontSize={"small"} />
									</MC.Grid>
									<MC.Grid item>
										<MC.Typography className={classes.body5}>
											{`로그인 하시면 더욱 더 많은 서비스를 \n이용하실 수 있습니다.`}
										</MC.Typography>
									</MC.Grid>
									<MC.Grid item>
										<MC.Button
											variant="contained"
											size="large"
											color="primary"
											disableElevation
											style={{ borderRadius: 0, width: "100%", height: 60 }}
											onClick={() => goPage("sign-in")}>
											로그인
										</MC.Button>
									</MC.Grid>
									<MC.Grid item style={{ textAlign: "center" }}>
										<MC.Typography className={classes.body5}>
											회원가입을 원하시면&nbsp;
											<MC.Link
												name="sign-up"
												onClick={goPage}
												style={{ cursor: "pointer", color: "#449CE8", textDecoration: "underline" }}>
												여기
											</MC.Link>
											를 눌러주세요.
										</MC.Typography>
									</MC.Grid>
								</>
							)
					}
				</MC.Grid>
			</div>
		);
	};

	return (
		<>
			{
				mainContent && mainContent.mainBannerAttachments.length > 0 ?
					(
						<MC.Grid item xs={12} md={12}
						         className={classes.slide}>
							<Slide {...zoomOutProperties}>
								{
									mainContent.mainBannerAttachments.map((attach, index) => (
										<div key={index} style={{ height: isDesktop ? 496 : 320, minHeight: isDesktop ? 496 : 320 }}>
											<img style={{ height: "100%" }} src={attach.fileUrl} alt={attach.fileOriginalName} />
										</div>
									))
								}
							</Slide>

							<RenderProfileCard />

						</MC.Grid>
					)
					:
					(
						<MC.Grid item xs={12} md={12}
						         className={classes.slide}>
							<Slide {...zoomOutProperties} defaultIndex={0}>
								{
									isDesktop ?
										(
											defaultImages.map((each, index) => (
												<div key={index} style={{ height: 496, minHeight: 496 }}>
													<img style={{ width: "100%" }} src={each} alt={"slide-01-default.png"} />
												</div>
											))
										)
										:
										(
											defaultImages1.map((each, index) => (
												<div key={index} style={{ height: 320, minHeight: 320 }}>
													<img style={{ width: "100%" }} src={each} alt={"de-img.png"} />
												</div>
											))
										)
								}
							</Slide>

							<RenderProfileCard />

						</MC.Grid>
					)
			}
		</>
	);
};

export default MainBanners;
