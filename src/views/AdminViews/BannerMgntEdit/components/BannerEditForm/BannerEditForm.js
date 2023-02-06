import React, { useEffect, useState, useRef } from "react";
import * as MC                                from "@material-ui/core";
import * as MS                                from "@material-ui/styles";
import Dropzone                               from "react-dropzone";
import filesize                               from "filesize";
import DeleteForeverIcon                      from "@material-ui/icons/DeleteForever";
import theme                                  from "../../../../../theme/adminTheme";
import MomentUtils                                     from "@date-io/moment";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
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
		width: "15%"
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
	keyboardDatePicker:    {
		width: "100%"
	},
}));

const BannerEditForm = props => {
	const classes = useStyles();

	const { isEdit, AptComplexStore, bannerMgnt:obj, setBannerMgnt:setObj, bannerAttachFile, setBannerAttachFile, errors, setErrors} = props;

	const attachRef = useRef();
	const inputRef = useRef();

	useEffect(() => {
		const init = async () => {

		};
		setTimeout(() => {
			init();
		});
	}, []);

	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		// 입력 값 있을 경우 에러 초기화
		if (name === "evnt_name") {
			setErrors(prev => {
				return {...prev, evnt_name: value === ""}
			});
		}

		setObj(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	const handleDateChange = (key, date) => {
		if ( key === "evnt_strt_dttm" ) {
			date.set("hour", 0);
			date.set("minute", 0);
			date.set("second", 0);
			date.set("millisecond", 0);
		} else {
			date.set("hour", 23);
			date.set("minute", 59);
			date.set("second", 59);
			date.set("millisecond", 59);
		}

		setObj(prev => {
			return {
				...prev,
				[key]: date.format('YYYY-MM-DD HH:mm:ss')
			};
		});
	};

	const onAttach = async (acceptedFiles) => {
		try {
			if(obj.attachedFile) {
				setObj(prev => {
					return {
						...prev,
						attachedFile: null
					}
				});
			}

			inputRef.current.value = "";
			await acceptedFiles.map(async file => {
				setBannerAttachFile(file);
			});
		} catch ( e ) {

		}
	};

	const deleteAttach = (file, isNew) => {
		if ( isNew ) {
			setBannerAttachFile();
		} else {
			setObj(prev => {
				return {
					...prev,
					attachedFile: null
				}
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
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">배너명</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												error={errors.evnt_name}
												id="aptId-basic"
												name="evnt_name"
												variant="outlined"
												value={obj.evnt_name || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>
								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">게시기간</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
											<MC.Grid container spacing={1} >
												<MC.Grid item xs={12} md={5}>
													<MC.FormControl fullWidth className={classes.formControl}>
														<KeyboardDatePicker
															autoOk
															variant="inline"
															margin="normal"
															id="contractStartDate-picker-dialog"
															label="시작일자"
															format="yyyy/MM/DD"
															disableToolbar
															maxDate={obj.evnt_strt_dttm ? obj.evnt_end_dttm : new Date()}
															value={obj.evnt_strt_dttm ? obj.evnt_strt_dttm : new Date()}
															onChange={(date) => handleDateChange("evnt_strt_dttm", date)}
															KeyboardButtonProps={{
																"aria-label": "change date"
															}}
															className={classes.keyboardDatePicker} />
													</MC.FormControl>
												</MC.Grid>
												<MC.Grid item xs={2} md={2}
																 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
													&nbsp; ~ &nbsp;
												</MC.Grid>
												<MC.Grid item xs={12} md={5}>
													<MC.FormControl fullWidth className={classes.formControl}>
														<KeyboardDatePicker
															autoOk
															variant="inline"
															margin="normal"
															id="contractStartDate-picker-dialog"
															label="종료일자"
															format="yyyy/MM/DD"
															disableToolbar
															minDate={obj.evnt_end_dttm ? obj.evnt_strt_dttm : new Date()}
															value={obj.evnt_end_dttm ? obj.evnt_end_dttm : new Date()}
															onChange={(date) => handleDateChange("evnt_end_dttm", date)}
															KeyboardButtonProps={{
																"aria-label": "change date"
															}}
															className={classes.keyboardDatePicker} />
													</MC.FormControl>
												</MC.Grid>
										</MC.Grid>
										</MuiPickersUtilsProvider>

									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이미지</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<Dropzone
											ref={attachRef}
											style={{ width: "100%", height: "40px" }}
											onDrop={onAttach}
											accept={"image/*"}
											maxSize={50000000}
											noKeyboard
											noClick
											multiple={false}
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
															bannerAttachFile ?
																(
																	<MC.Typography variant="body2">
																		{bannerAttachFile.name} ({filesize(bannerAttachFile ? bannerAttachFile.size : 0)})
																		<MC.IconButton
																			size="small"
																			aria-label="delete"
																			className={classes.margin}
																			onClick={() => deleteAttach(bannerAttachFile, true)}>
																			<DeleteForeverIcon fontSize="small" />
																		</MC.IconButton>
																	</MC.Typography>
																)
																:
																(
																	(isEdit && obj.attachedFile) ?
																		(
																			<MC.Typography variant="body2">
																				{obj.attachedFile.file_orgn} ({filesize(obj.attachedFile? obj.attachedFile.file_size : 0)})
																				<MC.IconButton
																					size="small"
																					aria-label="delete"
																					className={classes.margin}
																					onClick={() => deleteAttach(obj.attachedFile, false)}>
																					<DeleteForeverIcon fontSize="small" />
																				</MC.IconButton>
																			</MC.Typography>
																		)
																		:
																		(
																			<MC.Typography variant="body2">
																				파일을 선택해주세요.(최대용량 50 MB)
																			</MC.Typography>
																		)
																)
														}
													</MC.Grid>
												</MC.Grid>
											)}
										</Dropzone>
									</MC.TableCell>
								</MC.TableRow>

								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">배너링크</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="aptId-basic"
												name="link"
												variant="outlined"
												placeholder={"https 또는 http를 꼭 적어주세요 ex) https://www.naver.com"}
												value={obj.link || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>
								<MC.TableRow>
									<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">게시여부</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth className={classes.formControl} style={{ marginBottom: 0 }}>
											<MC.RadioGroup
												row
												aria-label="disp_at"
												name="disp_at"
												value={obj.disp_at ? (obj.disp_at === "Y" ? "Y" : "N") : "Y" }
												onChange={handleChange}>
												<MC.FormControlLabel value="Y" control={<MC.Radio />} label="사용" />
												<MC.FormControlLabel value="N" control={<MC.Radio />} label="비사용" />
											</MC.RadioGroup>
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

export default BannerEditForm;
