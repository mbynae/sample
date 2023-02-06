import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { mainContentRepository, menuRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }     from "../../../components";
import { MainContentDetailForm }                 from "./components";
import update                                    from "immutability-helper";
import { Link }                                  from "react-router-dom";
import { toJS }                                  from "mobx";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	paper:             {
		padding: theme.spacing(2)
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	errorButton:       {
		color:                  theme.palette.error.main,
		borderColor:            theme.palette.error.main,
		marginLeft:             10,
		borderTopLeftRadius:    4,
		borderBottomLeftRadius: 4
	}
}));

const MainContentDetail = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("mainContent");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `홈페이지 메인설정`,
			href:  `${rootUrl}/${menuKey}`
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

	// 홈페이지 메인설정 관리 정보
	const [mainContent, setMainContent] = useState({});
	const [treeData, setTreeData] = useState([]);
	const [homepageType, setHomepageType] = useState();

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			let rootUrl = generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `홈페이지 메인설정`,
						href:  `${rootUrl}/${menuKey}`
					}
				];
				return [
					...prev
				];
			});
			await getMainContent();
			await getMenus();
			await getHomepageType();
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

	const getMainContent = async () => {
		mainContentRepository
			.getMainContent({
				aptId: AptComplexStore.aptComplex.id
			})
			.then(result => {
				dataBinding(result);
				setLoading(false);
			});
	};

	const getMenus = async () => {
		menuRepository
			.getMenus({
				aptId:    AptComplexStore.aptComplex.aptId,
				menuType: "TOP_MENU_TYPE"
			})
			.then((result) => {
				const filter = data => data.menuKey === "office" || data.menuKey === "residents";
				result.filter(filter).map(rootMenu => {
					let fIndexes = [];
					rootMenu.childMenus.map((childMenu, index) => {
						if ( childMenu.menuType !== "BOARD_TYPE" ) {
							fIndexes.push(index);
						}
					});
					if ( fIndexes.length > 0 ) {
						fIndexes
							.sort((a, b) => b - a)
							.map(fIndex => {
								rootMenu.childMenus = update(rootMenu.childMenus, {
									$splice: [
										[fIndex, 1]
									]
								});
							});
					}
				});

				let tempTreeData = [
					...result.filter(filter).map(tempTreeData => convertToTreeData(tempTreeData))
				];
				if ( tempTreeData.length > 0 ) {
					setTreeData([...tempTreeData]);
				} else {
					setTreeData([]);
				}
			});
	};
	const sort = (a, b) => a.sequenceShowMainContentBoard - b.sequenceShowMainContentBoard;
	const convertToTreeData = (menu) => {
		const map = childMenu => convertToTreeData(childMenu);
		if ( menu.childMenus && menu.childMenus.length > 0 ) {
			menu = {
				...menu,
				children: [
					...menu.childMenus.sort(sort).map(map)
				],
				title:    menu.title,
				expanded: true
			};
		} else {
			menu = {
				...menu,
				title: menu.title
			};
		}
		return menu;
	};

	const getHomepageType = async () => {
		setHomepageType(toJS(AptComplexStore.aptComplex.contractInformationDataType.homepageType))
	}

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const dataBinding = (obj) => {
		setMainContent(prev => {
			return {
				...prev,
				aptId: AptComplexStore.aptComplex.id,

				id:                    obj ? obj.id : "",
				title:                 obj ? obj.title : "",
				mainBannerAttachments: obj ? obj.mainBannerAttachments : [],
				logoFile:              obj ? obj.logoFile : {},
				quickMenuDataType:     obj ? obj.quickMenuDataType : "",
				aptComplex:            obj ? obj.aptComplex : {}
			};
		});
	};

	const handleEdit = () => {
		history.push(`${rootUrl}/${menuKey}/edit`);
	};

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>

							<MC.Typography variant="h2" gutterBottom>
								홈페이지 메인설정
							</MC.Typography>
							<MC.Divider className={classes.divider} />

							<MC.Paper elevation={2} className={classes.paper}>

								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>

									<MC.Grid item xs={12} md={12}>
										<MainContentDetailForm
											mainContent={mainContent}
											setMainContent={setMainContent}
											treeData={treeData}
											setTreeData={setTreeData}
											convertToTreeData={convertToTreeData}
											homepageType={homepageType} />
									</MC.Grid>

									<MC.Grid item xs={6} md={6}>
										{
											homepageType != "CMMTY_TYPE" &&

											<MC.ButtonGroup
												aria-label="text primary button group"
												size="large"
												style={{ marginTop: 12 }}
												color="primary">
												<MC.Button
													variant="outlined"
													color="primary">
													<Link to={`${rootUrl}/dashboard`} target={"_blank"}>
														미리보기
													</Link>
												</MC.Button>
											</MC.ButtonGroup>
										}

									</MC.Grid>

									<MC.Grid item xs={6} md={6}
									         className={classes.buttonLayoutRight}>
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

export default inject("SignInStore", "AptComplexStore")(observer(MainContentDetail));
