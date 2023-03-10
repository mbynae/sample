import React, { useRef } from "react";

import * as MC           from "@material-ui/core";
import * as MS           from "@material-ui/styles";
import SortableTree      from "react-sortable-tree";
import theme             from "../../../../../theme/adminTheme";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Dropzone          from "react-dropzone";
import update            from "immutability-helper";

const useStyles = MS.makeStyles(theme => ({
	cardHeader:      {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:     {},
	rowHeight:       {
		height: 54
	},
	attachLayout:    {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
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

const MainContentEditForm = props => {
	const classes = useStyles();

	const {
		      mainContent:    obj,
		      setMainContent: setObj,
		      treeData,
		      setTreeData,
		      convertToTreeData,
		      logoFile,
		      setLogoFile,
		      bannerFiles,
		      setBannerFiles,
		      setAlertOpens,
		      handleAlertToggle,
		      errors,
					homepageType
	      } = props;

	const logoFileRef = useRef();
	const logoFileInputRef = useRef();
	const bannerFileRef = useRef();
	const bannerFileInputRef = useRef();

	const findLabel = (key) => {
		switch ( key ) {
		case "isLinkVisitingVehicle":
			return "??????????????????";
		case "isLinkSuggestions":
			return "????????????";
		case "isLinkResidenceReservation":
			return "????????????";
		case "isLinkPreCheck":
			return "????????????";
		case "isLinkManagementFee":
			return "?????????";
		case "isLinkFreeBoard":
			return "???????????????";
		case "isLinkFleaMarket":
			return "????????????";
		case "isLinkFacilityReservation":
			return "????????????";
		case "isLinkComplaintsManagement":
			return "??????/??????";
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
						checked={rowInfo.node.isShowMainContentBoard}
						onChange={(event) => toggleCheck(event, rowInfo)}
						inputProps={{ "aria-label": "primary checkbox" }}
					/>
				]
			};
		}
	};

	const fnCanDrop = (props) => {
		return props.nextPath.length > 1;
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
					canDrop={fnCanDrop}
					onChange={changeSequence}
					generateNodeProps={generateNodeProps}
				/>
			</div>
		</MC.Grid>
	);

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let type = event.target.type;
		let checked = event.target.checked;

		if ( type === "checkbox" ) {

			let array = Object.entries(obj.quickMenuDataType);
			let findTrues = array.filter(obj => obj[1]);
			if ( checked && findTrues.length >= 3 ) {
				handleAlertToggle(
					"isOpen",
					"?????? ?????? ????????? ?????? ??????",
					"?????? ?????? ???????????? ?????? 3??? ??????(????????? ??????) ????????? ???????????????.\n????????? ????????? ?????? ?????? ???????????? ?????? ?????? ??? ????????? ?????????.",
					() => {
						setAlertOpens(prev => {
							return {
								...prev,
								isOpen: false
							};
						});
					},
					undefined
				);
			} else {
				setObj(prev => {
					return {
						...prev,
						quickMenuDataType: {
							...prev.quickMenuDataType,
							[name]: checked
						}
					};
				});
			}

		} else {
			setObj(prev => {
				return {
					...prev,
					[name]: value
				};
			});
		}
	};

	const onLogoFile = async (acceptedFiles) => {
		try {
			logoFileInputRef.current.value = "";
			await acceptedFiles.map(async file => {
				setLogoFile(file);
			});
		} catch ( e ) {

		}
	};

	const deleteLogoFile = (isNew) => {
		if ( isNew ) {
			setLogoFile();
		} else {
			setObj(prev => {
				return {
					...prev,
					logoFile: {}
				};
			});
		}
	};

	const onBannerFile = async (acceptedFiles) => {
		try {
			if ( (bannerFiles.length + acceptedFiles.length + obj.mainBannerAttachments.length) > 3 ) {
				handleAlertToggle(
					"isOpen",
					"??????????????? ?????? ??????",
					"?????????????????? ?????? 3????????? ????????? ???????????????.\n????????? ????????? ?????????????????? ?????? ??? ??????????????????.",
					() => {
						setAlertOpens(prev => {
							return {
								...prev,
								isOpen: false
							};
						});
					},
					undefined
				);
			} else {
				bannerFileInputRef.current.value = "";
				await acceptedFiles.map(async file => {
					setBannerFiles(prev => {
						return [
							...prev,
							file
						];
					});
				});
			}

		} catch ( e ) {

		}
	};

	const deleteBannerFile = (index, isNew) => {
		if ( isNew ) {
			setBannerFiles(update(bannerFiles, {
				$splice: [
					[index, 1]
				]
			}));
		} else {
			setObj(prev => {
				prev.mainBannerAttachments = update(obj.mainBannerAttachments, {
					$splice: [
						[index, 1]
					]
				});
				return {
					...prev
				};
			});
		}
	};

	return (
		<MC.Card>
			<MC.CardHeader
				title={"???????????? ???????????? ??????"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<MC.Grid container spacing={1}>

					{/*??????*/}
					<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										??????
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="title-basic"
										name="title"
										placeholder="????????? ??????????????????."
										error={errors.isTitle}
										value={obj.title || ""}
										onChange={handleChange} />
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					{/*??????*/}
					<MC.Grid item xs={12} md={12}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										?????? <br /> (??????????????????: 240*63)
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								<Dropzone
									ref={logoFileRef}
									style={{ width: "100%", height: "40px" }}
									onDrop={onLogoFile}
									accept="image/*"
									maxSize={50000000}
									noKeyboard
									noClick
									multiple={false}
								>
									{({ getRootProps, getInputProps }) => (
										<MC.Grid container {...getRootProps()}>
											<MC.Grid item xs={2} md={2} className={classes.attachLayout} style={{ padding: theme.spacing(2) }}>
												<input id="logoFile-button" {...getInputProps()} ref={logoFileInputRef} />
												<label htmlFor="logoFile-button">
													<MC.Button variant="contained" color="primary" component="span">
														????????????
													</MC.Button>
												</label>
											</MC.Grid>
											<MC.Grid item xs={10} md={10} className={classes.attachLayout}>
												{
													logoFile ?
														(
															<MC.Typography variant="body2">
																{logoFile.name}
																<MC.IconButton
																	size="small"
																	aria-label="delete"
																	className={classes.margin}
																	onClick={() => deleteLogoFile(true)}>
																	<DeleteForeverIcon fontSize="small" />
																</MC.IconButton>
															</MC.Typography>
														)
														:
														(
															obj.logoFile.fileOriginalName ?
																(
																	<MC.Typography variant="body2">
																		{obj.logoFile.fileOriginalName}
																		<MC.IconButton
																			size="small"
																			aria-label="delete"
																			className={classes.margin}
																			onClick={() => deleteLogoFile(false)}>
																			<DeleteForeverIcon fontSize="small" />
																		</MC.IconButton>
																	</MC.Typography>
																)
																:
																(
																	<MC.Typography variant="body2">
																		????????? ??????????????????.(???????????? 50 MB)
																	</MC.Typography>
																)
														)
												}
											</MC.Grid>
										</MC.Grid>
									)}
								</Dropzone>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					{/*????????????*/}
					<MC.Grid item xs={12} md={12}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"} style={{ whiteSpace: "pre-line" }}>
										{`????????????(?????? 3???)\n(??????????????????: 1180*496)`}
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								<Dropzone
									ref={bannerFileRef}
									style={{ width: "100%", height: "40px" }}
									onDrop={onBannerFile}
									accept="image/*"
									maxSize={50000000}
									noKeyboard
									noClick
									multiple={true}
								>
									{({ getRootProps, getInputProps }) => (
										<MC.Grid container {...getRootProps()}>
											<MC.Grid item xs={2} md={2} className={classes.attachLayout} style={{ padding: theme.spacing(2) }}>
												<input id="bannerFile-button" {...getInputProps()} ref={bannerFileInputRef} />
												<label htmlFor="bannerFile-button">
													<MC.Button variant="contained" color="primary" component="span">
														????????????
													</MC.Button>
												</label>
											</MC.Grid>
											<MC.Grid item xs={10} md={10} className={classes.attachLayout}>

												{
													obj.mainBannerAttachments.length === 0 && bannerFiles.length === 0 ?
														(
															<MC.Typography variant="body2">
																????????? ??????????????????.(???????????? 50 MB)
															</MC.Typography>
														)
														:
														(
															<>
																{
																	(obj.mainBannerAttachments && obj.mainBannerAttachments.length > 0) &&
																	obj.mainBannerAttachments.map((file, index) => (
																		<MC.Typography variant="body2" key={index}>
																			{file.fileOriginalName}
																			<MC.IconButton
																				size="small"
																				aria-label="delete"
																				className={classes.margin}
																				onClick={() => deleteBannerFile(index, false)}>
																				<DeleteForeverIcon fontSize="small" />
																			</MC.IconButton>
																		</MC.Typography>
																	))
																}
																{
																	bannerFiles.length > 0 &&
																	(
																		bannerFiles.map((file, index) => (
																			<MC.Typography variant="body2" key={index}>
																				{file.name}
																				<MC.IconButton
																					size="small"
																					aria-label="delete"
																					className={classes.margin}
																					onClick={() => deleteBannerFile(index, true)}>
																					<DeleteForeverIcon fontSize="small" />
																				</MC.IconButton>
																			</MC.Typography>
																		))
																	)
																}
															</>
														)
												}
											</MC.Grid>
										</MC.Grid>
									)}
								</Dropzone>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					{/*?????? ?????? ?????????*/}
					{
						homepageType != "CMMTY_TYPE" &&
						<MC.Grid item xs={12} md={12}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"} style={{ whiteSpace: "pre-line" }}>
											{`?????? ?????? ?????????\n(?????? 3???)`}
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>

									<MC.FormControl component="fieldset" className={classes.formControl}>
										<MC.FormGroup row>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														disabled
														name={"isLinkManagementFee"}
														onChange={handleChange}
														checked={obj.quickMenuDataType.isLinkManagementFee || false} />
												}
												label={findLabel("isLinkManagementFee")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														name={"isLinkComplaintsManagement"}
														onChange={handleChange}
														checked={obj.quickMenuDataType.isLinkComplaintsManagement || false} />
												}
												label={findLabel("isLinkComplaintsManagement")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														name={"isLinkSuggestions"}
														onChange={handleChange}
														checked={obj.quickMenuDataType.isLinkSuggestions || false} />
												}
												label={findLabel("isLinkSuggestions")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														name={"isLinkFreeBoard"}
														onChange={handleChange}
														checked={obj.quickMenuDataType.isLinkFreeBoard || false} />
												}
												label={findLabel("isLinkFreeBoard")}
											/>

											<MC.FormControlLabel
												control={
													<MC.Checkbox
														name={"isLinkFleaMarket"}
														onChange={handleChange}
														checked={obj.quickMenuDataType.isLinkFleaMarket || false} />
												}
												label={findLabel("isLinkFleaMarket")}
											/>

											{/*2??? ??????*/}
											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			name={"isLinkPreCheck"}*/}
											{/*			onChange={handleChange}*/}
											{/*			checked={obj.quickMenuDataType.isLinkPreCheck || false} />*/}
											{/*	}*/}
											{/*	label={findLabel("isLinkPreCheck")}*/}
											{/*/>*/}

											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			name={"isLinkResidenceReservation"}*/}
											{/*			onChange={handleChange}*/}
											{/*			checked={obj.quickMenuDataType.isLinkResidenceReservation || false} />*/}
											{/*	}*/}
											{/*	label={findLabel("isLinkResidenceReservation")}*/}
											{/*/>*/}

											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			name={"isLinkVisitingVehicle"}*/}
											{/*			onChange={handleChange}*/}
											{/*			checked={obj.quickMenuDataType.isLinkVisitingVehicle || false} />*/}
											{/*	}*/}
											{/*	label={findLabel("isLinkVisitingVehicle")}*/}
											{/*/>*/}

											{/*<MC.FormControlLabel*/}
											{/*	control={*/}
											{/*		<MC.Checkbox*/}
											{/*			name={"isLinkFacilityReservation"}*/}
											{/*			onChange={handleChange}*/}
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

					{/*???????????????*/}
					{
						homepageType != "CMMTY_TYPE" &&
						<MC.Grid item xs={12} md={12}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											???????????????
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

export default MainContentEditForm;
