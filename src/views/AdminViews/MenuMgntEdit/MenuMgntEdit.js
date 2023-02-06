import React, { useCallback, useEffect, useRef, useState } from "react";
import { inject, observer }                                from "mobx-react";
import update                                              from "immutability-helper";

import SortableTree                              from "react-sortable-tree";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import "react-sortable-tree/style.css";

import EditIcon      from "@material-ui/icons/Edit";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";

import { menuRepository }                    from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { MenuUpdateDialog }                  from "./components";
import palette                               from "../../../theme/adminTheme/palette";
import { toJS }                              from "mobx";

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
	lmsSortableTree:   {
		fontSize:                    14,
		fontFamily:                  "Roboto, Helvetica, Arial, sans-serif",
		letterSpacing:               "-0.05px",
		"& .rst__node:nth-child(1)": {
			"& .rst__moveHandle":  {
				display: "none"
			},
			"& .rst__rowContents": {
				borderLeft: "1px solid rgb(187, 187, 187)"
			}
		},
		"& .rst__moveHandle":        {
			width:      "30px !important",
			maxWidth:   "30px !important",
			minWidth:   "30px !important",
			background: "#d9d9d9 url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTYgMTcuMDFWMTBoLTJ2Ny4wMWgtM0wxNSAyMWw0LTMuOTloLTN6TTkgM0w1IDYuOTloM1YxNGgyVjYuOTloM0w5IDN6Ii8+PC9zdmc+') no-repeat center"
		},
		"& .rst__rowContents":       {
			width:              "160px !important",
			maxWidth:           "160px !important",
			minWidth:           "160px !important",
			paddingRight:       0,
			"& .rst__rowLabel": {
				maxWidth:           64,
				minWidth:           64,
				width:              64,
				paddingRight:       0,
				"& .rst__rowTitle": {
					maxWidth:   64,
					minWidth:   64,
					width:      64,
					wordBreak:  "break-all",
					whiteSpace: "pre-line",
					lineHeight: "5px"
				}
			}
		},
		"& .rst__node":              {
			"& .rst__lineBlock.rst__lineHalfHorizontalRight:nth-child(1)": {
				display: "none"
			},
			"& button.rst__collapseButton":                                {
				display: "none"
			}
		}
	}
}));
const MenuMgntEdit = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, history, match } = props;

	const [menuKey] = useState("menuMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `홈페이지 메뉴설정`,
			href:  `${rootUrl}/${menuKey}`
		},
		{
			title: `홈페이지 메뉴설정 정보 수정`,
			href:  `${rootUrl}/${menuKey}/edit`
		}
	]);

	const [loading, setLoading] = useState(true);
	const [menus, setMenus] = useState([]);
	const [treeData, setTreeData] = useState([]);

	const menuRef = useRef();
	const [offsetWidth, setOffsetWidth] = useState();
	const [selectedMenu, setSelectedMenu] = useState();
	const [updateMenuDialogOpen, setUpdateMenuDialogOpen] = useState(false);

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
						title: `홈페이지 메뉴설정`,
						href:  `${rootUrl}/${menuKey}`
					},
					{
						title: `홈페이지 메뉴설정 정보 수정`,
						href:  `${rootUrl}/${menuKey}/edit`
					}
				];
				return [
					...prev
				];
			});
			await getMenus();
			setLoading(false);
			setOffset();
			window.addEventListener("resize", setOffset);
		};

		setTimeout(async () => {
			await init();
		});

		const setOffset = () => {
			setOffsetWidth(menuRef.current.offsetWidth);
		};
		return () => window.removeEventListener("resize", setOffset);
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getMenus = async () => {
		menuRepository
			.getMenus_V1({
				aptId:    AptComplexStore.aptComplex.aptId,
				menuType: "TOP_MENU_TYPE"
			})
			.then((result) => {
				result = result.filter(rootMenu => !(rootMenu.menuKey === "serviceCenter" || rootMenu.menuKey === "mgnt" || rootMenu.menuKey === "cmmtyUseGuide" || rootMenu.menuKey === "cmmtyRev"));
				const aptComplex = toJS(AptComplexStore.aptComplex);
				result.map(rootMenu => {
					// 부가서비스 메뉴 전용
					if ( rootMenu.menuKey === "extraService" ) {
						if ( !aptComplex.contractInformationDataType.isPreCheck ) {
							let preCheckIndex = rootMenu.childMenus.findIndex(childMenu => childMenu.menuKey === "preCheck");
							delete rootMenu.childMenus[preCheckIndex];
						}

					/*	if ( !aptComplex.contractInformationDataType.isResidentReservation ) {
							let preCheckIndex = rootMenu.childMenus.findIndex(childMenu => childMenu.menuKey === "residentReservation");
							delete rootMenu.childMenus[preCheckIndex];
						}*/
					}
				});
				let tempTreeData = [
					...result.map(tempTreeData => convertToTreeData(tempTreeData))
				];
				if ( tempTreeData.length > 0 ) {
					setTreeData([...tempTreeData]);
				} else {
					setTreeData([]);
				}
			});
	};

	const sort = (a, b) => a.sequence - b.sequence;
	const viewFilter = (obj) => obj.isViewForOffice;
	const convertToTreeData = (menu) => {
		const map = childMenu => convertToTreeData(childMenu);
		if ( menu.childMenus && menu.childMenus.length > 0 ) {
			menu = {
				...menu,
				children: [
					...menu.childMenus.filter(viewFilter).sort(sort).map(map)
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

	const updateMenuDialog = (menu) => {
		setSelectedMenu(menu);
		handleClickOpen();
	};

	const handleClickOpen = () => {
		setUpdateMenuDialogOpen(true);
	};

	const findAndChangeTitle = (obj) => {
		if ( obj.id === selectedMenu.id ) {
			obj.title = selectedMenu.title;
		}
	};

	const handleEdit = () => {
		menuRepository
			.updateMenus_V1({
				aptId:    AptComplexStore.aptComplex.id,
				menuList: treeData
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"메뉴 수정 완료",
					"메뉴 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						window.location.href = `${rootUrl}/${menuKey}`;
						// history.push(`${rootUrl}/${menuKey}`);
					},
					undefined
				);
			});
	};

	const handleGoBack = () => {
		history.goBack();
	};

	const handleClickClose = (isUpdate) => {
		//menuType: "TOP_MENU_TYPE"
		if ( isUpdate ) {
			setTreeData(prev => {
				let selected = {};
				if ( selectedMenu.menuType === "TOP_MENU_TYPE" ) {
					prev.map(findAndChangeTitle);
					return [
						...prev
					];
				} else {
					prev.map(obj => {
						if ( obj.children && obj.childMenus.length > 0 ) {
							obj.childMenus.map(findAndChangeTitle);
							obj.children.map(findAndChangeTitle);
						}
					});
					return [
						...prev
					];
				}
			});
		}
		setUpdateMenuDialogOpen(false);
	};

	const fnCanDrop = (props) => {
		return props.nextPath.length > 1;
	};

	const changeSequence = (menuData) => {
		setTreeData(prev => {
			menuData[0].children.map((child, index) => {
				child.sequence = ++index;
			});
			menuData[0].childMenus = [...menuData[0].children];

			const idx = prev.findIndex(item => item.id === menuData[0].id);
			prev[idx].children = [...menuData[0].children];
			prev[idx].childMenus = [...menuData[0].children];
			return [
				...prev
			];
		});
	};

	const toggleCheck = (event, rowInfo) => {
		let checked = event.target.checked;
		let newRootMenu = treeData.find(x => x.id === rowInfo.parentNode.id);
		let nowChildMenu = newRootMenu.childMenus.find(x => x.id === rowInfo.node.id);
		// nowChildMenu.isViewForOffice = checked;
		nowChildMenu.isViewForUser = checked;
		newRootMenu = [
			...treeData.map(tempTreeData => convertToTreeData(tempTreeData))
		];
		setTreeData([...newRootMenu]);
	};

	const moveTreeData = useCallback((dragIndex, hoverIndex) => {
		let dragTreeData = treeData[dragIndex];
		setTreeData(prev => {
			let result = update(treeData, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragTreeData]
				]
			});
			result.map((rootMenu, index) => {
				rootMenu.sequence = ++index;
			});
			prev = result;
			return [
				...prev
			];
		});
	}, [treeData]);

	const onDragEnd = (result) => {
		if ( !result.destination ) {
			return;
		}

		moveTreeData(
			(result.source.index),
			(result.destination.index)
		);
	};

	const generateNodeProps = (rowInfo) => {
		if ( rowInfo.treeIndex > 0 ) {
			return {
				buttons: [
					<MC.IconButton
						aria-label="edit"
						style={{ padding: 11 }}
						onClick={() => updateMenuDialog(rowInfo.node)}>
						<EditIcon
							fontSize="small"
						/>
					</MC.IconButton>,
					<MC.Checkbox
						name="isViewForOffice"
						checked={rowInfo.node.isViewForUser}
						onChange={(event) => toggleCheck(event, rowInfo)}
						inputProps={{ "aria-label": "primary checkbox" }}
					/>
				]
			};
		}
	};

	const treeView = (menuData, index) => (
		<Draggable key={menuData.id} draggableId={menuData.id + ""} index={index}>
			{
				(provided, snapshot) => (
					<MC.Grid
						ref={provided.innerRef}
						{...provided.draggableProps}
						item>
						<div style={{
							width:    offsetWidth ? (offsetWidth - ((treeData.length) * 8)) / (treeData.length) : 1200 / 5,
							height:   "100%",
							position: "relative"
						}}>
							<div
								style={{ position: "absolute", top: 14, left: 130, zIndex: 50 }}>
								<MC.IconButton
									aria-label="edit"
									style={{ padding: 11 }}
									onClick={() => updateMenuDialog(menuData)}>
									<EditIcon
										fontSize="small"
									/>
								</MC.IconButton>
							</div>
							<div
								style={{ position: "absolute", top: 24, left: 170, zIndex: 50 }}
								{...provided.dragHandleProps}>
								<SwapHorizIcon />
							</div>
							<SortableTree
								treeData={[menuData]}
								maxDepth={2}
								rowHeight={70}
								className={classes.lmsSortableTree}
								canDrop={fnCanDrop}
								onChange={changeSequence}
								generateNodeProps={generateNodeProps}
							/>
						</div>
					</MC.Grid>
				)
			}
		</Draggable>
	);

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

						<MC.Typography variant="h2" gutterBottom style={{ marginTop: 10 }}>
							홈페이지 메뉴설정 정보 수정
						</MC.Typography>
						<MC.Divider className={classes.divider} />

						<MC.Paper elevation={2} className={classes.paper}>
							<MC.Grid
								container
								spacing={2}
								justify={"space-between"}
								alignItems={"flex-start"}>

								<MC.Grid item xs={12} md={12}>

									<div ref={menuRef}>

										<DragDropContext onDragEnd={onDragEnd}>
											<Droppable droppableId="lmsDrop" direction="horizontal">
												{
													(provided, snapshot) => (

														<MC.Grid
															ref={provided.innerRef}
															{...provided.droppableProps}
															container
															spacing={1}
															style={{ height: 500 }}>
															{
																treeData && treeData
																	.sort(sort)
																	.map(treeView)
															}
														</MC.Grid>
													)
												}
											</Droppable>
										</DragDropContext>
									</div>

								</MC.Grid>

								<MC.Grid item xs={6} md={6} />
								<MC.Grid item xs={6} md={6}
								         className={classes.buttonLayoutRight}>
									<MC.ButtonGroup
										aria-label="text primary button group"
										size="large"
										style={{ marginTop: 12 }}
										color="primary">
										<MC.Button
											style={{
												color:                  palette.error.main,
												borderColor:            palette.error.main,
												marginLeft:             10,
												borderTopLeftRadius:    4,
												borderBottomLeftRadius: 4
											}}
											onClick={handleGoBack}>
											취소
										</MC.Button>
										<MC.Button
											variant="outlined"
											color="primary"
											onClick={handleEdit}>
											저장
										</MC.Button>
									</MC.ButtonGroup>
								</MC.Grid>
							</MC.Grid>
						</MC.Paper>
					</>
				)
			}

			<MenuUpdateDialog
				selectedMenu={selectedMenu}
				setSelectedMenu={setSelectedMenu}
				open={updateMenuDialogOpen}
				onClose={handleClickClose}
			/>

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

export default inject("SignInStore", "AptComplexStore")(observer(MenuMgntEdit));
