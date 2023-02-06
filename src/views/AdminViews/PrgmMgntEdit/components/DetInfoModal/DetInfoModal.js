import React, { useState, useEffect, useRef } from "react";
import clsx                                   from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";

import Dropzone          from "react-dropzone";
import filesize          from "filesize";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import theme             from "../../../../../theme/adminTheme";

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
	modalRoot: {
		width: 530,
		padding: 10,
		backgroundColor: "white"
	},
	itemRow: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
	},
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const DetInfoModal = props => {
	// State -----------------------------------------------------------------------------------------------------------
	const classes = useStyles();
	const {open, hideModal, lectureInfo:obj, setLectureInfo:setObj, fileAttachFile, setFileAttachFile, errors, setErrors} = props;
	const attachRef = useRef();
	const inputRef = useRef();
	// Function --------------------------------------------------------------------------------------------------------
	const handleSubmit = () => {
		// TODO | 안내등록
		hideModal();
	}

	const handleChange = event => {																																												// 성별 선택
		let name = event.target.name;
		let value = event.target.value;
		setObj(prev => {
			return {
				...prev,
				[name]: value
			}
		});
	};

	const onAttach = async (acceptedFiles) => {
		try {
			if(obj.file) {
				setObj(prev => {
					return {
						...prev,
						file: null
					}
				});
			}

			inputRef.current.value = "";
			await acceptedFiles.map(async file => {
				setFileAttachFile(file);
			});
		} catch ( e ) {

		}
	};

	const deleteAttach = (file, isNew) => {
		if ( isNew ) {
			setFileAttachFile();
		} else {
			setObj(prev => {
				return {
					...prev,
					file: null
				}
			});
		}
	};
	// LifeCycle -------------------------------------------------------------------------------------------------------

	// DOM -------------------------------------------------------------------------------------------------------------
	return (
		<MC.Modal
			open={open}
			onClose={hideModal}
			disablePortal
			disableEnforceFocus
			disableAutoFocus
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<MC.Grid container className={classes.modalRoot}>
				{/* Header 시작 */}
				<MC.Grid item className={classes.itemRow}>
					<MC.Grid container justify={"space-between"} alignItems={"center"}>
						<span>안내 등록</span>
						<MI.Close onClick={hideModal}/>
					</MC.Grid>
				</MC.Grid>
				{/* Header 끝 */}

				<MC.Grid item style={{width: "100%", marginTop: 10, marginBottom: 10}}>
					<MC.Divider />
				</MC.Grid>

				{/* Body 시작 */}
				<MC.Grid item className={classes.itemRow}>
					<MC.Grid container>
						{/* 안내 시작 */}
						<MC.Grid item style={{width: "100%"}} >
							<MC.Grid container justify={"space-evenly"} alignItems={"center"}>
								<MC.Grid item style={{width: 70}}>
									강의 안내
								</MC.Grid>
								<MC.Grid item>
									<MC.TextField
										variant={"outlined"}
										id={"cnts_info"}
										name={"cnts_info"}
										multiline
										rows={5}
										// placeholder={"ex. 락카룸"}
										style={{width: 400}}
										value={obj.cnts_info || ""}
										onChange={handleChange}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
						{/* 안내 끝 */}
						{/* 준비물 시작 */}
						<MC.Grid item style={{width: "100%", marginTop: 20}} >
							<MC.Grid container justify={"space-evenly"} alignItems={"center"}>
								<MC.Grid item style={{width: 70}}>
									준비물
								</MC.Grid>
								<MC.Grid item>
									<MC.TextField
										variant={"outlined"}
										id={"cnts_memo"}
										name={"cnts_memo"}
										style={{width: 400}}
										// placeholder={""}
										value={obj.cnts_memo || ""}
										onChange={handleChange}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
						{/* 준비물 끝 */}


						{/* 강의계획서 시작 */}
						<MC.Grid item style={{width: "100%", marginTop: 20, display: "flex", justifyContent: "center", alignItems:"center"}}>

							<Dropzone
								ref={attachRef}
								style={{ width: "100%", height: "40px" }}
								onDrop={onAttach}
								accept={".doc,.hwp,.hwpx,.docm,.docx,.dot,.dotm,.dotx,.odt,.pdf,.rtf,.txt,.csv,.xla,.xlam,.xls,.xlsb,.xlsx,.ppt,.ppsx,.pptx,.pptm"}
								maxSize={50000000}
								noKeyboard
								noClick
								multiple={false}
							>
								{({ getRootProps, getInputProps }) => (
									<MC.Grid container {...getRootProps()}>
										<MC.Grid item xs={12} md={12} style={{ paddingBottom: theme.spacing(2) }}>
											<input id="contained-button-file" {...getInputProps()} ref={inputRef} />
											<label htmlFor="contained-button-file">
												<MC.Button style={{height: "40px", width: "100%"}} size="small" disableElevation variant="outlined" color="primary" component="span" >
													강의계획서 업로드
												</MC.Button>
											</label>
										</MC.Grid>
										<MC.Grid item xs={12} md={12}>
											{
												fileAttachFile ?
													(
														<MC.Typography variant="body2" style={{textAlign: "center"}}>
															{fileAttachFile.name} ({filesize(fileAttachFile ? fileAttachFile.size : 0)})
															<MC.IconButton
																size="small"
																aria-label="delete"
																onClick={() => deleteAttach(fileAttachFile, true)}>
																<DeleteForeverIcon fontSize="small" />
															</MC.IconButton>
														</MC.Typography>
													)
													:
													(
														(obj.file) ?
															(
																<MC.Typography variant="body2" style={{textAlign: "center"}}>
																	{obj.file.file_orgn} ({filesize(obj.file? obj.file.file_size : 0)})
																	<MC.IconButton
																		size="small"
																		aria-label="delete"
																		onClick={() => deleteAttach(obj.file, false)}>
																		<DeleteForeverIcon fontSize="small" />
																	</MC.IconButton>
																</MC.Typography>
															)
															:
															(
																<MC.Typography variant="body2" style={{textAlign: "center"}}>
																	파일을 선택해주세요.(최대용량 50 MB)
																</MC.Typography>
															)
													)
											}
										</MC.Grid>
									</MC.Grid>
								)}
							</Dropzone>
						</MC.Grid>
						{/* 강의계획서 끝 */}


					</MC.Grid>
				</MC.Grid>
				{/* Body 끝 */}
				<MC.Grid item style={{width: "100%", marginTop: 20, display: "flex", justifyContent: "center", alignItems:"center"}}>
					<MC.Button
						color={"primary"}
						size={"medium"}
						variant={"contained"}
						disableElevation
						onClick={handleSubmit}
					>
						등록
					</MC.Button>
				</MC.Grid>
			</MC.Grid>
		</MC.Modal>
	)
};

export default DetInfoModal;
