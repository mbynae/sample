import React, { useState, useEffect, useRef } from "react";
import clsx                                   from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";

import Dropzone          from "react-dropzone";
import filesize          from "filesize";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import theme             from "../../../../../theme/adminTheme";

/**
 * 2021.04.15 | junghoon15 | 사용자 신규 생성 created
 * @constructor
 */

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
	modalRoot: {
		width: 400,
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
const SeatModal = props => {
	// State -----------------------------------------------------------------------------------------------------------
	const classes = useStyles();
	const {open, hideModal, seatInfo:obj, setSeatInfo:setObj, imgAttachFile, setImgAttachFile, errors, setErrors} = props;
	const attachRef = useRef();
	const inputRef = useRef();
	// Function --------------------------------------------------------------------------------------------------------
	const handleSubmit = () => {
		// TODO | 좌석등록

		if(errors.user_cnt !== true && errors.add_cnt !== true){
			hideModal();
		} else {
			console.log("no")
		}
	}

	const handleCnt = event => {																																												// 성별 선택
		let name = event.target.name;
		let value = event.target.value;
		setObj(prev => {
			return {
				...prev,
				[name]: parseInt(value)
			}
		});

		if (name === "user_cnt") {
			if (obj.add_cnt < value) { // 최소가 최대보다 크면
				setErrors(prev => {
					return {...prev, add_cnt: true, user_cnt: false}
				});
			}
			else {
				setErrors(prev => {
					return {...prev, add_cnt: false, user_cnt: false}
				});
			}
		}

		if (name === "add_cnt") {
			if (obj.user_cnt > value) { // 최대가 최소보다 작으면
				setErrors(prev => {
					return {...prev, add_cnt: false, user_cnt: true}
				});
			}
			else {
				setErrors(prev => {
					return {...prev, add_cnt: false, user_cnt: false}
				});
			}
		}
	};
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
			if(obj.img) {
				setObj(prev => {
					return {
						...prev,
						img: null
					}
				});
			}

			inputRef.current.value = "";
			await acceptedFiles.map(async file => {
				setImgAttachFile(file);
			});
		} catch ( e ) {

		}
	};

	const deleteAttach = (file, isNew) => {
		if ( isNew ) {
			setImgAttachFile();
		} else {
			setObj(prev => {
				return {
					...prev,
					img: null
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
						<span>좌석 등록</span>
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
						{/* 번호 지정 시작 */}
						<MC.Grid item style={{width: "100%"}} >
							<MC.Grid container justify={"space-evenly"} alignItems={"center"}>
								<MC.Grid item style={{width: 70}}>
									시작번호
								</MC.Grid>
								<MC.Grid item>
									<MC.TextField
										variant={"outlined"}
										id={"user_cnt"}
										name={"user_cnt"}
										style={{width: 95}}
										placeholder={""}
										value={obj.user_cnt || ""}
										error={errors.user_cnt}
										onChange={handleCnt}
									/>
								</MC.Grid>
								<MC.Grid item style={{width: 70}}>
									종료번호
								</MC.Grid>
								<MC.Grid item>
									<MC.TextField
										variant={"outlined"}
										id={"add_cnt"}
										name={"add_cnt"}
										style={{width: 95}}
										placeholder={""}
										value={obj.add_cnt || ""}
										error={errors.add_cnt}
										onChange={handleCnt}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
						{/* 번호 지정 끝 */}

						{/* 좌석명 시작 */}
						<MC.Grid item style={{width: "100%", marginTop: 20}} >
							<MC.Grid container justify={"space-evenly"} alignItems={"center"}>
								<MC.Grid item style={{width: 70}}>
									좌석명
								</MC.Grid>
								<MC.Grid item>
									<MC.TextField
										variant={"outlined"}
										id={"detl_name"}
										name={"detl_name"}
										placeholder={"ex. 락카룸"}
										style={{width: 280}}
										value={obj.detl_name || ""}
										onChange={handleChange}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
						{/* 좌석명 끝 */}

						{/* 배치도 이미지 시작 */}
						<MC.Grid item style={{width: "100%", marginTop: 20}}>
							<Dropzone
								ref={attachRef}
								style={{ width: "100%", height: "40px" }}
								onDrop={onAttach}
								accept={".png,.jpg,.jpeg,.gif,.bmp,.tiff,.svg"}
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
													배치도 이미지 업로드
												</MC.Button>
											</label>
										</MC.Grid>
										<MC.Grid item xs={12} md={12}>
											{
												imgAttachFile ?
													(
														<MC.Typography variant="body2" style={{textAlign: "center"}}>
															{imgAttachFile.name} ({filesize(imgAttachFile ? imgAttachFile.size : 0)})
															<MC.IconButton
																size="small"
																aria-label="delete"
																className={classes.margin}
																onClick={() => deleteAttach(imgAttachFile, true)}>
																<DeleteForeverIcon fontSize="small" />
															</MC.IconButton>
														</MC.Typography>
													)
													:
													(
														(obj.img) ?
															(
																<MC.Typography variant="body2" style={{textAlign: "center"}}>
																	{obj.img.file_orgn} ({filesize(obj.img ? obj.img.file_size : 0)})
																	<MC.IconButton
																		size="small"
																		aria-label="delete"
																		className={classes.margin}
																		onClick={() => deleteAttach(obj.img, false)}>
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
						{/* 배치도 이미지 끝 */}
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

export default SeatModal;
