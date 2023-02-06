import React from "react";

import * as MC      from "@material-ui/core";
import * as MS      from "@material-ui/styles";
import SortableTree from "react-sortable-tree";

const useStyles = MS.makeStyles(theme => ({
	cardHeader:      {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:     {},
	rowHeight:       {
		height: 54
	},
	lmsSortableTree: {
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

const MainContentDetailForm = props => {
	const classes = useStyles();

	const { mainContent: obj, treeData, setTreeData, convertToTreeData, homepageType } = props;

	const findLabel = (key) => {
		switch ( key ) {
		case "isLinkVisitingVehicle":
			return "방문차량예약";
		case "isLinkSuggestions":
			return "건의사항";
		case "isLinkResidenceReservation":
			return "입주예약";
		case "isLinkPreCheck":
			return "사전점검";
		case "isLinkManagementFee":
			return "관리비";
		case "isLinkFreeBoard":
			return "자유게시판";
		case "isLinkFleaMarket":
			return "벼룩시장";
		case "isLinkFacilityReservation":
			return "시설예약";
		case "isLinkComplaintsManagement":
			return "민원/하자";
		}
	};

	const changeSequence = (menuData) => {
		setTreeData(prev => {
			menuData[0].children.map((child, index) => {
				child.sequenceShowMainContentBoard = ++index;
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
		nowChildMenu.isShowMainContentBoard = checked;
		newRootMenu = [
			...treeData.map(tempTreeData => convertToTreeData(tempTreeData))
		];
		setTreeData([...newRootMenu]);
	};

	const generateNodeProps = (rowInfo) => {
		if ( rowInfo.treeIndex > 0 ) {
			return {
				buttons: [
					<MC.Checkbox
						name="isViewForOffice"
						disabled
						checked={rowInfo.node.isShowMainContentBoard}
						onChange={(event) => toggleCheck(event, rowInfo)}
						inputProps={{ "aria-label": "primary checkbox" }}
					/>
				]
			};
		}
	};

	const treeView = (menuData, index) => (
		<MC.Grid
			item
			key={index}
		>
			<div style={{
				width:    400,
				height:   "100%",
				position: "relative"
			}}>
				<SortableTree
					treeData={[menuData]}
					maxDepth={2}
					rowHeight={70}
					className={classes.lmsSortableTree}
					canDrag={() => false}
					canDrop={() => false}
					onChange={changeSequence}
					generateNodeProps={generateNodeProps}
				/>
			</div>
		</MC.Grid>
	);

	return (
		<MC.Card>
			<MC.CardHeader
				title={"홈페이지 메인설정 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<MC.Grid container spacing={1}>

					{/*명칭*/}
					<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										명칭
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.title}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					{/*로고*/}
					<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										로고
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{
									obj.logoFile.fileOriginalName ?
										(
											<MC.Typography variant="body2">
												<MC.Link href={obj.logoFile.fileUrl} target="_blank" download>
													{obj.logoFile.fileOriginalName}
												</MC.Link>
											</MC.Typography>
										)
										:
										(
											<MC.Typography variant="body2">
												{"로고 파일이 없습니다."}
											</MC.Typography>
										)
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					{/*메인배너*/}
					<MC.Grid item xs={12} md={12}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										메인배너(최대 3개)
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								{
									obj.mainBannerAttachments && obj.mainBannerAttachments.length >= 1 ?
										(
											<MC.Grid container spacing={1}>
												{
													obj.mainBannerAttachments.map(
														(file, index) => (
															<MC.Grid item xs={12} md={12} key={index}>
																<MC.Typography variant="body2">
																	메인배너 {index + 1} - &nbsp;
																	<MC.Link href={file.fileUrl} target="_blank" download>
																		{file.fileOriginalName}
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
												{"메인베너 파일이 없습니다."}
											</MC.Typography>
										)
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					{/*자주 찾는 서비스*/}
					{
						homepageType != "CMMTY_TYPE" &&
						<MC.Grid item xs={12} md={12}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											자주 찾는 서비스
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>

									<MC.FormControl component="fieldset" className={classes.formControl}>
										<MC.FormGroup row>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														disabled={true}
														checked={obj.quickMenuDataType.isLinkManagementFee || false} />
												}
												label={findLabel("isLinkManagementFee")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														disabled={true}
														checked={obj.quickMenuDataType.isLinkComplaintsManagement || false} />
												}
												label={findLabel("isLinkComplaintsManagement")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														disabled={true}
														checked={obj.quickMenuDataType.isLinkSuggestions || false} />
												}
												label={findLabel("isLinkSuggestions")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														disabled={true}
														checked={obj.quickMenuDataType.isLinkFreeBoard || false} />
												}
												label={findLabel("isLinkFreeBoard")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														disabled={true}
														checked={obj.quickMenuDataType.isLinkFleaMarket || false} />
												}
												label={findLabel("isLinkFleaMarket")}
											/>

											{/*2차 개발*/}
											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			disabled={true}*/}
											{/*			checked={obj.quickMenuDataType.isLinkPreCheck || false} />*/}
											{/*	}*/}
											{/*	label={findLabel("isLinkPreCheck")}*/}
											{/*/>*/}

											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			disabled={true}*/}
											{/*			checked={obj.quickMenuDataType.isLinkResidenceReservation || false} />*/}
											{/*	}*/}
											{/*	label={findLabel("isLinkResidenceReservation")}*/}
											{/*/>*/}

											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			disabled={true}*/}
											{/*			checked={obj.quickMenuDataType.isLinkVisitingVehicle || false} />*/}
											{/*	}*/}
											{/*	label={findLabel("isLinkVisitingVehicle")}*/}
											{/*/>*/}

											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			disabled={true}*/}
											{/*			checked={obj.quickMenuDataType.isLinkFacilityReservation || false} />*/}
											{/*	}*/}
											{/*	label={findLabel("isLinkFacilityReservation")}*/}
											{/*/>*/}
										</MC.FormGroup>
									</MC.FormControl>

								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					}

					{/*노출게시판*/}
					{
						homepageType != "CMMTY_TYPE" &&
						<MC.Grid item xs={12} md={12}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											노출게시판
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>
									<MC.Grid
										container
										spacing={1}
										style={{ height: 500 }}>
										{
											treeData && treeData
												.sort((a, b) => a.menuKey === "office" ? -1 : 0)
												.map(treeView)
										}
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					}

				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	);
};

export default MainContentDetailForm;
