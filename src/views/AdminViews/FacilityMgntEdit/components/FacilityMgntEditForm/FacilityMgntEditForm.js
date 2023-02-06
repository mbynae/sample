import React, { useCallback, useRef, useState } from "react";
import * as MC                                  from "@material-ui/core";
import * as MS from "@material-ui/styles";
import Dropzone                                                       from "react-dropzone";
import theme                                                          from "../../../../../theme/adminTheme";
import filesize                                                       from "filesize";
import DeleteForeverIcon                                              from "@material-ui/icons/DeleteForever";
import update                                              						from "immutability-helper";

const useStyles = MS.makeStyles(theme => ({
	root: {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	},
	cardHeader:               {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:              {
		width:"90%", marginLeft:"5%", marginTop:"1%"
	},
	tableCellTitle:           {
		width: "15%",
		backgroundColor: "#f2f2f2"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%"
	},
	formControl:                {
		margin:       theme.spacing(1)
	},
	attachLayout:               {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	},
	margin:                   {
		margin: theme.spacing(0),
		width:  24
	},
}));

const FacilityMgntEditForm = props => {
	const classes = useStyles();

	const {fcltMgnt:obj, setFcltMgnt:setObj, fcltAttachFiles, setFcltAttachFiles, alertOpens, setAlertOpens, handleAlertToggle, errors, setErrors } = props;

	const attachRef = useRef();
	const inputRef = useRef();

	// Input Field의 Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		// 입력 값 있을 경우 에러 초기화
		setErrors(prev => {
			if (name === "cnts_info") return {...prev, cnts_info: value === ""}
			else if (name === "cnts_schd") return {...prev, cnts_schd: value === ""}
			else if (name === "cnts_amt") return {...prev, cnts_amt: value === ""}
			else if (name === "cnts_rfnd") return {...prev, cnts_rfnd: value === ""}
			else return {...prev}
		});

		setObj(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	}

	const onAttach = useCallback(async (acceptedFiles) => {
		if(acceptedFiles.length > 3) {	// 파일 업로드 개수 제한
			return (
				handleAlertToggle(
					"isOpen",
					"파일 업로드 개수 제한",
					"이미지 파일은 최대 3개까지 업로드가 가능합니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					},
					undefined
				)
			)
		}

		inputRef.current.value = "";
		try {
			await acceptedFiles.map(async file => {
				setFcltAttachFiles(prev => {
					return [
						...prev,
						file
					];
				});
			});
		} catch ( e ) {

		}
	}, []);

	const deleteAttach = (file, index, isNew) => {
		if ( isNew ) {
			setFcltAttachFiles(update(fcltAttachFiles, {
				$splice: [
					[index,1]
				]
			}));
		} else {
			setObj(prev => {
				prev.attachedFiles = update(obj.attachedFiles, {
					$splice: [
						[index, 1]
					]
				});
				prev.ima
				return {
					...prev
				};
			});
		}
	};

	return (
		<MC.Card style={{ overflow: "visible"}}>
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.TableContainer component={MC.Paper}>
						<MC.Table size={"small"}>
							<MC.TableBody>
								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">시설번호</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>{obj.fclt_numb}</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">시설명</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>{obj.fclm_name}</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이용안내</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												multiline
												rows={4}
												className={classes.textField}
												fullWidth
												label="시설안내"
												name="cnts_info"
												variant="outlined"
												placeholder="시설안내 입력"
												type="text"
												error={errors.cnts_info}
												value={obj.cnts_info || ""}
												onChange={handleChange}
											/>
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이미지</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<Dropzone
											ref={attachRef}
											style={{ width: "100%", height: "40px" }}
											onDrop={onAttach}
											maxSize={50000000}
											noKeyboard
											noClick
											accept="image/*"
										>
											{({ getRootProps, getInputProps }) => (
												<MC.Grid container {...getRootProps()}>
													<MC.Grid item xs={2} md={2} className={classes.attachLayout} style={{ padding: theme.spacing(2) }}>
														<input id="contained-button-file" {...getInputProps()} ref={inputRef} />
														<label htmlFor="contained-button-file">
															<MC.Button variant="contained" color="primary" component="span" >
																파일첨부
															</MC.Button>
														</label>
													</MC.Grid>
													<MC.Grid item xs={10} md={10} className={classes.attachLayout}>
														{
															(obj.attachedFiles && obj.attachedFiles.length >0) &&
															obj.attachedFiles.map((file,index) => (
																<MC.Typography variant="body2" key={index}>
																	{file.file_orgn} ({filesize(file.file_size)})
																	<MC.IconButton
																		size="small"
																		aria-label="delete"
																		className={classes.margin}
																		onClick={() => deleteAttach(file, index, false)}>
																		<DeleteForeverIcon fontSize="small" />
																	</MC.IconButton>
																</MC.Typography>
															))
														}

														{
															fcltAttachFiles.length > 0 ?
																(
																	fcltAttachFiles.map((file,index) => (
																		<MC.Typography variant="body2" key={index}>
																			{file.name} ({filesize(file.size)})
																			<MC.IconButton
																				size="small"
																				aria-label="delete"
																				className={classes.margin}
																				onClick={() => deleteAttach(file, index, true)}>
																				<DeleteForeverIcon fontSize="small" />
																			</MC.IconButton>
																		</MC.Typography>
																	))
																)
																:
																(
																	!(obj.attachedFiles && obj.attachedFiles.length > 0) &&
																	<MC.Typography variant="body2">
																		파일을 선택해주세요.(최대용량 50 MB) <br/> 최대 3개까지 업로드 가능합니다.
																	</MC.Typography>
																)
														}
													</MC.Grid>
												</MC.Grid>
											)}
										</Dropzone>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이용시간</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												multiline
												rows={4}
												className={classes.textField}
												fullWidth
												label="이용시간"
												name="cnts_schd"
												variant="outlined"
												placeholder="이용시간 입력"
												type="text"
												error={errors.cnts_schd}
												value={obj.cnts_schd || ""}
												onChange={handleChange}
											/>
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이용요금</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												multiline
												rows={4}
												className={classes.textField}
												fullWidth
												label="이용요금"
												name="cnts_amt"
												variant="outlined"
												placeholder="이용요금 입력"
												type="text"
												error={errors.cnts_amt}
												value={obj.cnts_amt || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">취소/환불정책</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												multiline
												rows={4}
												className={classes.textField}
												fullWidth
												label="취소/환불정책"
												name="cnts_rfnd"
												variant="outlined"
												placeholder="취소/환불정책 입력"
												type="text"
												error={errors.cnts_rfnd}
												value={obj.cnts_rfnd || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">메모</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												multiline
												rows={4}
												className={classes.textField}
												fullWidth
												label="메모"
												name="cnts_memo"
												variant="outlined"
												placeholder="메모 입력"
												type="text"
												value={obj.cnts_memo || ""}
												onChange={handleChange}
											/>
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>

							</MC.TableBody>
						</MC.Table>
					</MC.TableContainer>
				</form>
			</MC.CardContent>
		</MC.Card>
	);

};

export default FacilityMgntEditForm;
