import React, { useEffect, useState }                   from "react";
import { inject, observer }                             from "mobx-react";
import filesize                                         from "filesize";
import { Marker, NaverMap, RenderAfterNavermapsLoaded } from "react-naver-maps";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb, AlertDialog }      from "../../../components";
import { introductionRepository, mapsRepository } from "../../../repositories";

import { constants } from "../../../commons";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	paper:             {
		padding: theme.spacing(2)
	},
	cardContent:       {},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	attachLayout:      {
		padding:      theme.spacing(2),
		borderTop:    "1px solid rgb(238, 238, 238)",
		borderBottom: "1px solid rgb(238, 238, 238)"
	}
}));

const IntroductionDetail = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { menuKey } = match.params;

	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  "/"
		},
		{
			title: "아파트소개",
			href:  "/introduction"
		},
		{
			title: `아파트소개 상세`,
			href:  `/introduction/${menuKey}`
		}
	]);

	const [loading, setLoading] = useState(true);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});

	const [introduction, setIntroduction] = useState({});
	const [rootUrl, setRootUrl] = useState("");

	const NAVER_API_KEY = constants.NAVER_MAP_API_KEY;
	const [center, setCenter] = useState({
		lat: 37.5666103,
		lng: 126.9783882
	});

	// 단지위치 소개 여부 확인
	const checkComplexLocation = () => menuKey === "complexLocation";

	useEffect(() => {
		const init = async () => {
			await getIntroduction();
		};

		setTimeout(() => {
			init();
		});
	}, [menuKey]);

	const getIntroduction = () => {
		introductionRepository
			.getIntroduction({
				aptId:   AptComplexStore.aptComplex.id,
				menuKey: menuKey
			})
			.then(async result => {
				await allInitialize(result);
				(checkComplexLocation() && result.address !== null) && await getGeocode(result.address);
				setLoading(false);
			});
	};

	const allInitialize = (obj) => {
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

		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		setRootUrl(rootUrl);
		setBreadcrumbs(prev => {
			prev = [
				{
					title: "관리자",
					href:  `${rootUrl}/dashboard`
				},
				{
					title: `아파트소개`,
					href:  `${rootUrl}/introduction`
				},
				{
					title: `${obj.title} 상세`,
					href:  `${rootUrl}/introduction/${menuKey}`
				}
			];
			return [
				...prev
			];
		});
	};

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

	const handleEdit = () => {
		history.push(`${rootUrl}/introduction/${menuKey}/edit/`);
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
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

						<div className={classes.content}>
							<MC.Typography variant="h2" gutterBottom>
								{introduction.title}
							</MC.Typography>
							<MC.Divider className={classes.divider} />

							<MC.Paper elevation={2} className={classes.paper}>
								<MC.Card>
									{/*<MC.CardHeader*/}
									{/*	title={introduction.title}*/}
									{/*/>*/}
									{/*<MC.Divider className={classes.divider} />*/}
									<MC.CardContent className={classes.cardContent}>

										{
											checkComplexLocation() &&
											<MC.Grid container spacing={1}>
												<MC.Grid item xs={12} md={3} />
												<MC.Grid item xs={12} md={6}>
													<RenderAfterNavermapsLoaded
														ncpClientId={NAVER_API_KEY} // 자신의 네이버 계정에서 발급받은 Client ID
														// error={<p>Maps Load Error</p>}
														// loading={<p>Maps Loading...</p>}
													>
														<NaverMap
															mapDivId={"react-naver-map"} // default: react-naver-map
															style={{
																width:  "100%", // 네이버지도 가로 길이
																height: 400 // 네이버지도 세로 길이
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
												<MC.Grid item xs={12} md={3} />
											</MC.Grid>
										}

										<div className="ql-editor" dangerouslySetInnerHTML={{ __html: introduction.content }}
										     style={{ minHeight: 500, maxHeight: "none" }}>
										</div>

										{/*첨부파일*/}
										<MC.Grid container className={classes.attachLayout}>
											<MC.Grid
												item
												xs={2}
												md={2}
												style={{ display: "flex" }}>
												<MC.Typography>
													첨부파일
												</MC.Typography>
											</MC.Grid>
											<MC.Grid
												item
												xs={10}
												md={10}
												style={{ display: "flex" }}>
												{
													introduction.attachmentDataTypes && introduction.attachmentDataTypes.length >= 1 ?
														(
															<MC.Grid container spacing={1}>
																{
																	introduction.attachmentDataTypes.map(
																		(file, index) => (
																			<MC.Grid item xs={12} md={12} key={index}>
																				<MC.Typography variant="body2">
																					<MC.Link href={file.fileUrl} target="_blank" download>
																						{file.fileOriginalName} ({filesize(file.fileSize)})
																					</MC.Link>
																				</MC.Typography>
																			</MC.Grid>
																		)
																	)
																}
															</MC.Grid>
														)
														:
														(
															<MC.Typography variant="body2">
																{"첨부된 파일이 없습니다."}
															</MC.Typography>
														)
												}
											</MC.Grid>
										</MC.Grid>
									</MC.CardContent>
								</MC.Card>

								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>

									<MC.Grid item xs={6} md={6} />

									<MC.Grid item xs={6} md={6}
									         className={classes.buttonLayoutRight}>
										{
											menuKey !== "peripheralInformation" &&
											<MC.ButtonGroup
												aria-label="text primary button group"
												size="large"
												style={{ marginTop: 12 }}
												color="primary">
												<MC.Button
													variant="outlined"
													color="primary"
													onClick={handleEdit}>
													수정
												</MC.Button>
											</MC.ButtonGroup>
										}
									</MC.Grid>

								</MC.Grid>

							</MC.Paper>

						</div>
					</>
				)
			}

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

export default inject("SignInStore", "AptComplexStore")(observer(IntroductionDetail));
