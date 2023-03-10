import React, { useEffect, useState } from "react";

import * as MC                                     from "@material-ui/core";
import * as MS                                     from "@material-ui/styles";
import { DateFormat }                              from "../../../../../components";
import { CourseReservationInfoDialog }             from "../../components";
import { resrvHistRepository, useGuideRepository } from "../../../../../repositories";
import clsx                                        from "clsx";
import palette                                     from "../../../../../theme/userTheme/palette";
import moment                                      from "moment";
import ErrorOutlineIcon                            from "@material-ui/icons/ErrorOutline";
import { MoveNotiDialog }                          from "../../../MoveReservation/components";

const useStyles = MS.makeStyles(theme => ({
	root: {
		padding: "10px 20px"
	},
	buttonLayoutRight: {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
		marginTop: 60
	},
	cellTitle: {
		backgroundColor: "#f9f9f9",
		width: 150,
		height: "auto",
		paddingLeft: 21,
		[theme.breakpoints.down("xs")]: {
			width: 120
		}
	},
	cellContent: {
		width: "auto",
		paddingLeft: 20,
		paddingRight: 20,
		[theme.breakpoints.down("xs")]: {
			width: 200,
			paddingLeft: 15,
			paddingRight: 15
		}
	},
	body4: {
		...theme.typography.body4,
		color: "#ffffff",
		height: 24,
		lineHeight: "24px"
	},
	body4Origin: {
		...theme.typography.body4
	},
	tableRoot: {
		marginTop: 30,
		borderTop: "2px solid #449CE8"
	},
	tableHeadCell: {
		height: "50px !important",
		fontWeight: "bold",
		color: "#222222"
	},
	tableHeadCellFont: {
		fontSize: 14,
		width: "15%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width: "50%"
		}
	},
	reservInfoField: {
		marginTop: 40,
		padding: "10px 15px",
		backgroundColor: "#fafafa",
		minHeight: 200
	}
}));

const CourseReservationRegisterForm = props => {

	const classes = useStyles();
	const theme = MS.useTheme();

	const steps = ["?????? ??????", "?????? ??????"]; // ??? Steps Label
	const [activeStep, setActiveStep] = useState(0); // ?????? Active Step

	const {
		history, rootUrl, isMobile, alertOpens, setAlertOpens, handleAlertToggle,
		facilityBigList, getFacilityMidList, facilityMidList, getFacilityAdditionalList, setFacilityAdditionalList,
		facilityAdditionalList: obj
	} = props; // Props

	const [reservationObj, setReservationObj] = useState({
		first: "",
		prgm_numb: ""
	}); // ???????????? Input State

	const [selectedCourseObj, setSelectedCourseObj] = useState({}); // ????????? ?????? ????????? ?????? (Submit)

	// Validation ??????
	const [errors, setErrors] = useState({
		first: false,
		prgm_numb: false
	});

	const [selectedCourse, setSelectedCourse] = useState(-1); // ????????? ?????? ?????????
	const [basketReservation, setBasketReservation] = useState({}); // ?????? ?????? ?????? ?????? State
	const [courseReservationInfo, setCourseReservationInfo] = useState([]); // ?????? ????????? State
	// ?????? ?????? ??????
	const [reservationGuide, setReservationGuide] = useState("");

	// ???????????? Alert
	const [notiOpen, setNotiOpen] = useState({
		isOpen: false,
		yesFn: () => handleTermsToggle()
	});
	const handleTermsToggle = (key, yesCallback) => {
		setNotiOpen(prev => {
			return {
				...prev,
				isOpen: true,
				yesFn: () => yesCallback()
			};
		});
	};
	// ???????????? ?????? Handler
	const handleNotiOpen = () => {
		if (reservationObj.prgm_numb === "") {
			handleAlertToggle(
				"isOpen",
				undefined,
				"????????? ?????? ??????????????????.",
				undefined,
				() => {
					setAlertOpens(prev => {
						return { ...prev, isOpen: false };
					});
				}
			);
		} else {
			handleTermsToggle(
				"isOpen",
				() => {
					setNotiOpen(prev => {
						return {
							...prev,
							isOpen: false
						};
					});
				}
			);
		}
	};

	// ????????? ?????? ?????? ??????
	const getCourseReservationInfo = (value) => {
		resrvHistRepository.getCourseReservationInfo(value)
			.then(result => {
				setCourseReservationInfo(result.data_json_array);
			});
	};

	// ?????? ?????? Handler
	const handleSelectCourse = (selectedCourse) => {
		setSelectedCourse(selectedCourse);
		setSelectedCourseObj(obj[selectedCourse]);
	};

	// ?????? ?????? ?????? Handler
	const handleNext = () => {
		if (activeStep === 0) {
			if (selectedCourse === -1) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"????????? ??????????????????.",
					undefined,
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					}
				);
			} else {
				// Step 1?????? ????????? ????????? ?????????????????? ??????
				const params = JSON.stringify({
					prgm_numb: selectedCourseObj.prgm_numb,
					rsvt_clss: "C",
					rsvt_type: "ORD",
					rsvt_amt: selectedCourseObj.use_amt,
					rsvt_strt_date: selectedCourseObj.prgm_strt_date,
					rsvt_end_date: selectedCourseObj.prgm_end_date,
					rsvt_strt_time: selectedCourseObj.prgm_strt_time,
					rsvt_end_time: selectedCourseObj.prgm_end_time
				});

				resrvHistRepository
					.addReservationBasket(params, true)
					.then(result => {
						setBasketReservation(result.data_json_array[0]);
						// ?????? ?????? ?????? ??????
						useGuideRepository.getUseGuide(true)
							.then(result => {
								if (result.data_json) {
									setReservationGuide(result.data_json.use_info)
								}
							})
					}).catch(e => {
					handleAlertToggle(
						"isOpen",
						e.msg,
						e.errormsg + "\n",
						"??????",
						() => {
							setAlertOpens(prev => {
								return { ...prev, isOpen: false };
							});
						},
						undefined
					);
				});
				setActiveStep((prevActiveStep) => prevActiveStep + 1);
			}
		}
	};
	// ?????? ?????? ?????? Handler
	const handleBack = () => {
		if (activeStep > 0) {
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		} else {
			handleGoBack();
		}
	};
	// ?????? ?????? Handler
	const handleGoBack = () => {
		history.goBack();
	};

	// Input Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		// ?????? ??????????????? ?????? ????????? ?????? ????????????
		if (name === "first") {
			getFacilityMidList(value);
			setReservationObj({
				...reservationObj,
				[name]: value,
				prgm_numb: "",
				third: ""
			});
			setFacilityAdditionalList([]); // ?????? ????????? ?????? ?????????
			setSelectedCourse(-1); // ?????? ????????? ?????????
			setCourseReservationInfo([]) // ?????? ?????? ?????????
		}
		// ?????? ??????????????? ?????? ???????????? ?????? ???????????? / ????????? ????????????
		else if (name === "prgm_numb") {
			getFacilityAdditionalList(value);
			getCourseReservationInfo(value);
			setReservationObj({
				...reservationObj,
				[name]: value
			});
		}
		else {
			setReservationObj({
				...reservationObj,
				[name]: value
			});
		}
	};

	// ?????? ?????? Handler
	const handleSubmit = () => {

		let addParam = {};

		let facilityNumb = reservationObj.first.split("/");
		addParam.fclt_code = facilityNumb[0]; // ?????? ??????
		addParam.fclt_numb = facilityNumb[1]; // ?????????
		addParam.prgm_numb = selectedCourseObj.prgm_numb; // ?????? ?????????
		addParam.rsvt_strt_date = selectedCourseObj.prgm_strt_date; // ?????? ?????? ??????
		addParam.rsvt_end_date = selectedCourseObj.prgm_end_date; // ?????? ?????? ??????
		addParam.rsvt_strt_time = selectedCourseObj.prgm_strt_time; // ?????? ?????? ??????
		addParam.rsvt_end_time = selectedCourseObj.prgm_end_time; // ?????? ?????? ??????

		const params = JSON.stringify(addParam);

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"???????????? ????????? ?????? ????????? ???????????????????",
			"??????",
			async () => {
				await setAlertOpens(prev => {
					return { ...prev, isConfirmOpen: false };
				});
				resrvHistRepository
					.addReservationInsert(basketReservation.bskt_numb, params, true)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							undefined,
							"?????????????????????.\n????????????????????? ?????? ??? ?????? ????????? ???????????????.",
							undefined,
							() => {
								setAlertOpens(prev => {
									return { ...prev, isOpen: false };
								});
								history.push(`${rootUrl}/myPage/4/1`);
							}
						);
					}).catch(e => {
					handleAlertToggle(
						"isOpen",
						e.msg,
						e.errormsg + "\n",
						"??????",
						() => {
							setAlertOpens(prev => {
								return { ...prev, isOpen: false };
							});
						},
						undefined
					);
				});
			},
			"??????",
			() => {
				setAlertOpens(prev => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	// Step1 - ?????? ?????? ????????? Row Render
	const objView = (item, index) => (
		<MC.TableRow
			hover
			style={{ borderBottom: index === (item.length - 1) && "2px solid #222222" }}
			key={index}
		>
			{
				isMobile ?
					(
						<>
							<MC.TableCell align={"left"}>
								<MC.Grid container direction="column" justify={"center"} alignItems={"flex-start"}>
									<MC.Grid item style={{ fontSize: 14 }}>
										{item.prgm_strt_time.substring(0, 5)}
										~
										{item.prgm_end_time.substring(0, 5)}
									</MC.Grid>
									<MC.Grid item>
										<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}>
											<MC.Grid item style={{ fontSize: 12 }}>
												???????????? &nbsp; <span style={{ fontWeight: "normal" }}>{`${item.dayw_clss_name}`}</span>
											</MC.Grid>
											<MC.Grid item style={{ color: "#dedede" }}>&nbsp;|&nbsp;</MC.Grid>
											<MC.Grid item style={{ fontSize: 12 }}>
												????????????&nbsp;
												<span style={{ fontWeight: "normal" }}>
											{`${item.use_cnt}/${item.totl_cnt}`}
												</span>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							</MC.TableCell>
							<MC.TableCell align={"center"}>
								<MC.Button
									variant="contained"
									color={index === selectedCourse ? "secondary" : palette.white.main}
									onClick={() => handleSelectCourse(index)}
									disabled={item.rsvt_chck || item.use_cnt === item.totl_cnt}
								>
									??????
								</MC.Button>
							</MC.TableCell>
						</>
					)
					:
					(
						<>
							{/*??????*/}
							<MC.TableCell align={"center"}>
								{index + 1}
							</MC.TableCell>

							{/*?????????*/}
							<MC.TableCell align={"center"}>
								{item.prgm_name}
							</MC.TableCell>

							{/*????????????*/}
							<MC.TableCell align={"center"}>
								{`${item.dayw_clss_name}`}
							</MC.TableCell>

							{/*????????????*/}
							<MC.TableCell align={"center"}>
								{item.prgm_strt_time.substring(0, 5)}
								~
								{item.prgm_end_time.substring(0, 5)}
							</MC.TableCell>

							{/*????????????*/}
							<MC.TableCell align={"center"}>
								{`${item.use_cnt}/${item.totl_cnt}`}
							</MC.TableCell>

							{/*?????? ??????*/}
							<MC.TableCell align={"center"}>
								<MC.Button
									variant="contained"
									color={index === selectedCourse ? "secondary" : palette.white.main}
									onClick={() => handleSelectCourse(index)}
									disabled={!item.rsvt_chck || item.use_cnt === item.totl_cnt}
								>
									??????
								</MC.Button>
							</MC.TableCell>
						</>
					)
			}

		</MC.TableRow>
	);

	// Step 2 ???????????? ????????? Row - Render
	const renderTableRow = (label, item) => {
		return (
			<MC.Grid item xs={12} lg={12} style={{ height: "auto", borderBottom: "1px solid #ebebeb" }}>
				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
					<MC.Grid item className={classes.cellTitle} style={{ height: isMobile ? 60 : 50 }}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}
										 style={{ height: "100%" }}>
							<MC.Typography className={classes.body4Origin}>
								{label}
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.Typography className={classes.body4Origin}>
							{item}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
		);
	};

	return (
		<MC.Paper className={classes.root}>
			{/* Step */}
			<MC.Stepper activeStep={activeStep} alternativeLabel>
				{
					steps.map((label, index) => {
						return (
							<MC.Step key={index}>
								<MC.StepLabel>{label}</MC.StepLabel>
							</MC.Step>
						);
					})
				}
			</MC.Stepper>
			{/*--------------------------------------------- Step 1 : ?????? ?????? ---------------------------------------------*/}
			{
				activeStep === 0 &&
				<>
					{/* ?????? ?????? */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;?????? ??????</MC.Typography>
							<MC.Grid item xs={12} md={12}>
								<MC.Select
									labelId="first-label"
									variant={"outlined"}
									name={"first"}
									id={"first"}
									value={reservationObj.first}
									error={errors.first}
									onChange={(event) => handleChange(event)}
									style={{ height: 50, width: "100%" }}>
									{
										facilityBigList.map((facility, index) => (
											<MC.MenuItem key={index}
																	 value={`${facility.fclt_code}/${facility.fclt_numb}`}>{facility.fclm_name}</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.Grid>
						</MC.Grid>
					</MC.FormControl>
					{/* ?????? ?????? */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Typography style={{ marginBottom: 3 }}>&nbsp;?????? ??????</MC.Typography>
						<MC.Grid container spacing={2} alignItems={"center"}>
							<MC.Grid item xs={10} md={10}>
								<MC.Select
									labelId="prgm_numb-label"
									variant={"outlined"}
									name={"prgm_numb"}
									id={"prgm_numb"}
									disabled={reservationObj.first === ""}
									error={errors.prgm_numb}
									value={reservationObj.prgm_numb}
									onChange={(event) => handleChange(event)}
									style={{ height: 50, width: "100%" }}>
									{
										facilityMidList.map((facilityMid, index) => (
											<MC.MenuItem key={index} value={facilityMid.prgm_numb}>{facilityMid.prgm_name}</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.Grid>
							<MC.Grid item xs={2} md={2}>
								<MC.Button
									variant="contained"
									color="primary"
									style={{
										width: "100%",
										height: 50
									}}
									onClick={() => handleNotiOpen()}
								>
									?????? ??????
								</MC.Button>
							</MC.Grid>
						</MC.Grid>
						{reservationObj.first === "" && <MC.FormHelperText>????????? ?????? ??????????????????.</MC.FormHelperText>}
					</MC.FormControl>

					{/* ?????? ?????? ????????? */}
					<MC.Table style={{ marginTop: 50 }}>
						<MC.TableHead className={classes.tableHead}>
							{
								isMobile ?
									(
										<MC.TableRow className={classes.tableRow} style={{ borderTop: "2px solid #222222" }}>
											<MC.TableCell align={"center"} className={clsx(classes.body4, classes.tableHeadCell)}>
												??????
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell)}
												align={"center"}
											>
												??????
											</MC.TableCell>
										</MC.TableRow>
									)
									:
									(
										<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												??????
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												?????????
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												????????????
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												????????????
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												????????????
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												??????
											</MC.TableCell>
										</MC.TableRow>
									)
							}

						</MC.TableHead>
						<MC.TableBody>
							{
								obj ?
									(
										obj.length === 0 ?
											<MC.TableRow>
												<MC.TableCell colSpan={isMobile ? 2 : 6} align="center">
													????????? ????????? ??? ?????? ?????????.
												</MC.TableCell>
											</MC.TableRow>
											:
											obj.map(objView)
									)
									:
									<MC.TableRow>
										<MC.TableCell colSpan={isMobile ? 2 : 6} align="center">
											<MC.CircularProgress color="secondary"/>
										</MC.TableCell>
									</MC.TableRow>
							}
						</MC.TableBody>
					</MC.Table>
				</>
			}
			{/*--------------------------------------------- Step 2 : ?????? ?????? ---------------------------------------------*/}
			{
				activeStep === 1 &&
				<>
					<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} className={classes.tableRoot}>
						{renderTableRow("?????????", basketReservation.prgm_name)}
						{renderTableRow("????????????", basketReservation.rsvt_strt_date ? (basketReservation.rsvt_strt_date + " ~ " + basketReservation.rsvt_end_date) : "?????????")}
						{renderTableRow("????????????", basketReservation.rsvt_strt_time && (basketReservation.rsvt_strt_time.substring(0, 5) + " ~ " + basketReservation.rsvt_end_time.substring(0, 5)))}
						{renderTableRow("????????????", basketReservation.rsvt_amt)}
						{renderTableRow("??????", (basketReservation.inst_name ? basketReservation.inst_name : "?????????") + " | " + basketReservation.inst_teln)}
					</MC.Grid>

					<div className={classes.reservInfoField}>
						<MC.Grid container direction={"row"} alignItems={"center"}>
							<ErrorOutlineIcon/>&nbsp;<MC.Typography>?????? ????????????</MC.Typography>
							<br />
							<br />
						</MC.Grid>
						<div
							className="ql-editor"
							dangerouslySetInnerHTML={{
								__html:
									reservationGuide !== ""
										? reservationGuide
										: "????????? ??????????????? ????????????.",
							}}
							style={{ maxHeight: "none", fontSize: 14 }}
						/>
					</div>
				</>
			}

			{/*------------------------------------------------ ?????? ?????? --------------------------------------------------*/}
			<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
				<MC.Button
					onClick={handleBack}
					variant="outlined"
					style={{
						marginRight: 10, width: 200,
					}}
				>
					{activeStep === 0 ? "??????" : "??????"}
				</MC.Button>
				<MC.Button
					onClick={activeStep !== 1 ? handleNext : handleSubmit}
					variant="contained"
					color="primary"
					style={{
						width: 200,
					}}
				>
					{activeStep !== 1 ? "??????" : "????????????"}
				</MC.Button>
			</MC.Grid>

			<CourseReservationInfoDialog
				isOpen={notiOpen.isOpen}
				isMobile={isMobile}
				handleYes={() => notiOpen.yesFn()}
				courseReservationInfo={courseReservationInfo}
			/>

		</MC.Paper>
	);
};

export default CourseReservationRegisterForm;

