import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Dropzone from "react-dropzone";
import filesize from "filesize";
import update from "immutability-helper";

import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";
import { DefectTypeKind } from "../../../../../enums";
import {
	preCheckDetailRepository,
	preCheckDefectRepository,
} from "../../../../../repositories";
import { DateFormat } from "../../../../../components";

import { useHistory, useParams, useLocation } from "react-router-dom";
import { apiObject } from "repositories/api";

import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import preCheckDetailStore from "stores/preCheckDetail.store";

const useStyles = MS.makeStyles((theme) => ({
	body4: {
		...theme.typography.body4,
	},
	formControl: {
		width: 210,
		height: 40,
		[theme.breakpoints.down("xs")]: {
			width: 178,
		},
	},
	body5: {
		...theme.typography.body5,
		whiteSpace: "pre-line",
	},
	select: {
		paddingLeft: 15,
		paddingTop: 11,
		paddingBottom: 11,
	},
}));

const tempPreCheckDefectInit = {
	id: "",
	defectType: "",
	content: "",
	preCheckDefectAttachments: [],
	preCheckDetail: "",
	baseDateDataType: {
		createDate: new Date(),
		lastModifiedDate: new Date(),
	},
	preCheckDetailId: "",
};

const PreCheckDefectEdit = (props) => {
	const classes = useStyles();

	const {
		isMobile,
		preCheckDetailId,
		preCheckDefect,
		getPreCheckDetail,
		toggleRegisterForm,
		preCheckDefectCount,
		alertOpens,
		setAlertOpens,
		handleAlertToggle,
		PreCheckSignInStore,
	} = props;

	const [tempPreCheckDefect, setTempPreCheckDefect] = useState(
		tempPreCheckDefectInit
	);
	const [isEdit, setIsEdit] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState({
		isDefectType: false,
		isContent: false,
	});
	const history = useHistory();
	const location = useLocation();

	// useEffect(() => {
	// 	const init = () => {
	// 		if (preCheckDefect) {
	// 			setIsEdit(true);
	// 			dataBinding(preCheckDefect);
	// 		} else {
	// 			dataBinding(undefined);
	// 		}
	// 	};

	// 	setTimeout(() => {
	// 		init();
	// 	}, 100);
	// }, []);

	// const dataBinding = (obj) => {
	// 	setTempPreCheckDefect((prev) => {
	// 		return {
	// 			...prev,
	// 			id: obj ? obj.id : "",
	// 			defectType: obj ? obj.defectType : "",
	// 			content: obj ? obj.content : "",
	// 			preCheckDefectAttachments: obj ? obj.preCheckDefectAttachments : [],
	// 			preCheckDetail: obj ? obj.preCheckDetail : "",
	// 			baseDateDataType: obj
	// 				? obj.baseDateDataType
	// 				: {
	// 						createDate: new Date(),
	// 						lastModifiedDate: new Date(),
	// 				  },
	// 			preCheckDetailId: preCheckDetailId,
	// 		};
	// 	});
	// 	setIsLoading(false);
	// };

	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setTempPreCheckDefect((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const getPreCheckByUserId = async (preCheckUserId) => {
		try {
			const response = await apiObject.getPreCheckByUserId(preCheckUserId);
			setTempPreCheckDefect((prev) => ({
				...prev,
				preCheckDetailId: response.body.id,
				preCheckUserId: preCheckUserId,
			}));
			setIsLoading(false);
		} catch (error) {
			console.log({ error });
		}
	};

	const attachRef = useRef();
	const inputRef = useRef();
	const [attachFiles, setAttachFiles] = useState([]);

	const onAttach = async (acceptedFiles) => {
		inputRef.current.value = "";
		try {
			await acceptedFiles.map(async (file) => {
				setAttachFiles((prev) => {
					return [...prev, file];
				});
			});
		} catch (e) {}
	};

	const deleteAttach = (file, index, isNew) => {
		if (isNew) {
			setAttachFiles(
				update(attachFiles, {
					$splice: [[index, 1]],
				})
			);
		} else {
			setTempPreCheckDefect((prev) => {
				prev.preCheckDefectAttachments = update(
					tempPreCheckDefect.preCheckDefectAttachments,
					{
						$splice: [[index, 1]],
					}
				);
				return {
					...prev,
				};
			});
		}
	};

	const handleEdit = () => {
		if (
			!(
				tempPreCheckDefect.defectType === "" ||
				tempPreCheckDefect.defectType === 0 ||
				tempPreCheckDefect.content === ""
			)
		) {
			if (false) {
				handleUpdate();
			} else {
				handleSave();
			}
		} else {
			setErrors((prev) => {
				return {
					...prev,
					isDefectType:
						tempPreCheckDefect.defectType === "" ||
						tempPreCheckDefect.defectType === 0,
					isContent: tempPreCheckDefect.content === "",
				};
			});
		}
	};

	const handleSave = () => {
		preCheckDefectRepository
			.savePreCheckDefect(
				{
					...tempPreCheckDefect,
					files: attachFiles,
				},
				false,
				true
			)
			.then(async (result) => {
				if (preCheckDefectCount < 1) {
					await preCheckDetailRepository.updatePreCheckDetail(
						preCheckDetailId,
						{ isCheck: true }
					);
				}
				handleAlertToggle(
					"isOpen",
					undefined,
					"하자내용을 등록 하였습니다.",
					undefined,
					() => {
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
						const url = location.pathname.split("/");
						history.push(`/${url[1]}/${url[2]}/${url[3]}`);
					}
				);
			});
	};

	const handleUpdate = () => {
		preCheckDefectRepository
			.updatePreCheckDefect(
				tempPreCheckDefect.id,
				{
					...tempPreCheckDefect,
					files: attachFiles,
				},
				false,
				true
			)
			.then((result) => {
				handleAlertToggle(
					"isOpen",
					undefined,
					"하자내용을 수정 하였습니다.",
					undefined,
					() => {
						getPreCheckDetail(preCheckDetailId);
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
						toggleRegisterForm(false);
					}
				);
			});
	};

	useEffect(() => {
		getPreCheckByUserId(toJS(PreCheckSignInStore).currentUser.id);
	}, []);

	return (
		<>
			{!isLoading && (
				<MC.Grid
					container
					justify={"center"}
					alignItems={"center"}
					style={{ marginTop: 30 }}
				>
					{isMobile && (
						<MC.Grid
							item
							xs={12}
							md={12}
							style={{ textAlign: "right", marginBottom: 8 }}
						>
							<span className={classes.body4} style={{ color: "#222222" }}>
								등록일{" "}
								<DateFormat
									date={tempPreCheckDefect.baseDateDataType.lastModifiedDate}
									format={"YYYY.MM.DD"}
								/>
							</span>
						</MC.Grid>
					)}
					<MC.Grid item xs={12} md={12}>
						<MC.Grid container justify={"space-between"} alignItems={"center"}>
							<MC.Grid item xs={6} md={6}>
								<MC.FormControl
									variant="outlined"
									className={classes.formControl}
									error={errors.isDefectType}
								>
									<MC.Select
										name="defectType"
										id="defectType-basic"
										defaultValue={""}
										value={tempPreCheckDefect.defectType || 0}
										className={clsx(classes.formControl, classes.body5)}
										classes={{
											select: classes.select,
										}}
										onChange={handleChange}
									>
										<MC.MenuItem value={0}>
											<em>구분</em>
										</MC.MenuItem>
										{Object.entries(DefectTypeKind).map((value, index) => (
											<MC.MenuItem value={value[0]} key={index}>
												{value[0] === "LIVING_ROOM"
													? "거실"
													: value[0] === "ROOM"
													? "방"
													: value[0] === "KITCHEN"
													? "주방"
													: value[0] === "MAIN_DOOR"
													? "현관문"
													: value[0] === "VERANDA"
													? "베란다"
													: value[0] === "BATHROOM"
													? "욕실"
													: value[0] === "ETC" && "기타"}
											</MC.MenuItem>
										))}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
							<MC.Grid item xs={6} md={6} style={{ textAlign: "right" }}>
								{isEdit && !isMobile && (
									<span
										className={classes.body4}
										style={{ color: "#222222", marginRight: 20 }}
									>
										등록일{" "}
										<DateFormat
											date={
												tempPreCheckDefect.baseDateDataType.lastModifiedDate
											}
											format={"YYYY.MM.DD"}
										/>
									</span>
								)}
								<MC.Button
									size="large"
									disableElevation
									style={{
										padding: 0,
										borderRadius: 0,
										width: isMobile ? 65 : 120,
										height: 40,
										border: "1px solid rgb(51, 51, 51, 0.2)",
									}}
									onClick={handleEdit}
								>
									{isEdit ? "저장" : "등록"}
								</MC.Button>
								<MC.Button
									size="large"
									disableElevation
									style={{
										padding: 0,
										borderRadius: 0,
										width: isMobile ? 65 : 120,
										height: 40,
										marginLeft: 10,
										border: "1px solid rgb(51, 51, 51, 0.2)",
									}}
									onClick={() => {
										const url = location.pathname.split("/");
										history.push(`/${url[1]}/${url[2]}/${url[3]}`);
									}}
								>
									취소
								</MC.Button>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>

					<MC.Grid item xs={12} md={12} style={{ marginTop: 12 }}>
						<MC.FormControl fullWidth variant="outlined">
							<MC.TextField
								id="content"
								name="content"
								multiline
								rows={6}
								value={tempPreCheckDefect.content || ""}
								error={errors.isContent}
								placeholder="내용을 입력해주세요."
								variant="outlined"
								onChange={handleChange}
							/>
						</MC.FormControl>
					</MC.Grid>

					<MC.Grid item xs={12} md={12} style={{ marginTop: 12 }}>
						<MC.Grid
							container
							direction={"row"}
							justify={"space-between"}
							alignItems={"center"}
						>
							<MC.Grid item xs={12} md={12}>
								<Dropzone
									ref={attachRef}
									style={{ width: "100%", height: "40px" }}
									onDrop={onAttach}
									maxSize={50000000}
									noKeyboard
									noClick
								>
									{({ getRootProps, getInputProps }) => (
										<MC.Grid
											container
											justify={"space-between"}
											alignItems={"flex-start"}
											{...getRootProps()}
											style={{ margin: 0 }}
										>
											<MC.Grid
												item
												xs={8}
												md={11}
												style={{
													height: 40,
													border: "1px solid rgba(0,0,0,0.23)",
													paddingLeft: 15,
													paddingTop: 11,
													paddingBottom: 11,
												}}
											>
												<MC.Typography
													variant="body2"
													style={{ color: "#bcbcbc" }}
												>
													파일을 선택해주세요.
												</MC.Typography>
											</MC.Grid>

											<MC.Grid
												item
												style={{ width: 90, paddingTop: 0, paddingBottom: 0 }}
											>
												<input
													id="contained-button-file"
													{...getInputProps()}
													ref={inputRef}
												/>
												<label htmlFor="contained-button-file">
													<MC.Button
														component={"span"}
														variant="contained"
														size="large"
														disableElevation
														style={{
															color: "#ffffff",
															padding: 0,
															borderRadius: 0,
															width: "100%",
															height: 40,
															border: "1px solid rgb(51, 51, 51, 0.2)",
															backgroundColor: "#4a4745",
														}}
													>
														파일선택
													</MC.Button>
												</label>
											</MC.Grid>
										</MC.Grid>
									)}
								</Dropzone>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					{!(
						tempPreCheckDefect.preCheckDefectAttachments.length === 0 &&
						attachFiles.length === 0
					) && (
						<MC.Grid
							item
							xs={12}
							md={12}
							style={{
								backgroundColor: "#fafafa",
								marginTop: 12,
								paddingTop: 20,
								paddingBottom: 20,
								paddingRight: 16,
								paddingLeft: 16,
							}}
						>
							{tempPreCheckDefect.preCheckDefectAttachments &&
								tempPreCheckDefect.preCheckDefectAttachments.length > 0 &&
								tempPreCheckDefect.preCheckDefectAttachments.map(
									(file, index) => (
										<MC.Typography variant="body2" key={index}>
											<MC.IconButton size="small" style={{ cursor: "default" }}>
												<GetAppIcon fontSize={"small"} />
											</MC.IconButton>
											{file.fileOriginalName} ({filesize(file.fileSize)})
											<MC.IconButton
												size="small"
												aria-label="delete"
												onClick={() => deleteAttach(file, index, false)}
											>
												<DeleteForeverIcon fontSize="small" />
											</MC.IconButton>
										</MC.Typography>
									)
								)}
							{attachFiles.length > 0 &&
								attachFiles.map((file, index) => (
									<MC.Typography variant="body2" key={index}>
										<MC.IconButton size="small" style={{ cursor: "default" }}>
											<GetAppIcon fontSize={"small"} />
										</MC.IconButton>
										{file.name} ({filesize(file.size)})
										<MC.IconButton
											size="small"
											aria-label="delete"
											onClick={() => deleteAttach(file, index, true)}
										>
											<DeleteForeverIcon fontSize="small" />
										</MC.IconButton>
									</MC.Typography>
								))}
						</MC.Grid>
					)}
				</MC.Grid>
			)}
		</>
	);
};

export default inject("PreCheckSignInStore")(observer(PreCheckDefectEdit));
