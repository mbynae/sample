import React, { useEffect, useState } from "react";
import clsx                           from "clsx";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, TermsDialog }       from "../../../../../components";
import { moveReservationRepository } from "../../../../../repositories";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";
import * as MI                                         from "@material-ui/icons";
import { TimeTypeKind }                                from "../../../../../enums";

import { MoveNotiDialog } 														 from "../../components"

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		paddingTop: 70
	},
	tableHead:         {
		height:          50,
		minHeight:       50,
		maxHeight:       50,
		backgroundColor: "transparent"
	},
	body4:             {
		...theme.typography.body4,
		color:      "#ffffff",
		height:     24,
		lineHeight: "24px"
	},
	tableHeadCell:     {
		height:     "50px !important",
		fontWeight: "bold",
		color:      "#222222"
	},
	tableHeadCellFont: {
		fontSize:                       14,
		width:                          "15%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width:    "30%"
		}
	},
	inner: {
		//minWidth: 1148
	},
	content:                  {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		//maxWidth:                       "1180px",
		width:													"100%",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	cardContent:              {
		width:"90%", marginLeft:"5%", marginTop:"1%"
	},
	tableCellTitle:           {
		width: "15%",
		backgroundColor: "#f2f2f2",
		[theme.breakpoints.down("xs")]: {
			width: 120
		}
	},
	tableCellTitle2:           {
		width: "15%",
		backgroundColor: "#ffffff"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%",
		[theme.breakpoints.down("xs")]: {
			width:        250,
			paddingLeft:  15,
			paddingRight: 15
		}
	},
	formControl:                {
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "center",
		alignContent:   "center",
		marginTop:			20
	},
	buttonControl:{
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "center",
		alignContent:   "center"
	},
	infoButton: {
		marginBottom: 20,
		borderRadius: 0,
		width: "auto",
		height: 40,
		border: "1px solid rgb(51, 51, 51, 0.2)",
	}
}));

const MoveReservationEdit = props => {
	const classes = useStyles();
	const { handleAlertToggle, setAlertOpens,	history, isMobile, getMyMoveReservation } = props;

	const [isLoading, setIsLoading] = useState(true);
	const [toTimeTypeKind, setToTimeTypeKind] = useState([]);
	const [toTimeTypeIndex, setToTimeTypeIndex] = useState(24);

	const [carList, setCarList] = useState([{car_numb: "", worktype: "IN"}]); // ???????????? ?????? state
	const [transfer, setTransfer] = useState("JI"); // ???????????? ?????? state
	const [startDate, setStartDate] = useState(new Date().setDate(new Date().getDate() + 1));
	const [startDatetime, setStartDatetime] = useState("09"); // ?????? ?????? state

	// ???????????? Alert
	const [notiOpen, setNotiOpen] = useState({
		isOpen:    false,
		yesFn:     () => handleTermsToggle()
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

	useEffect(() => {
		const init = () => {
			setIsLoading(false)
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	// ?????? Handler
	const handleSubmit = () => {

		let addParam = {}

		addParam.mvio_code = transfer;
		addParam.mvio_strt_date = moment(startDate).format('YYYY-MM-DD');
		addParam.mvio_end_date = moment(startDate).format('YYYY-MM-DD');
		addParam.mvio_strt_time = startDatetime + ":00:00";
		addParam.mvio_end_time = startDatetime + ":00:00";
		addParam.carlist = carList.filter((item, index) => item.car_numb !== "");

		const param = JSON.stringify(addParam)

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"?????? ????????? ?????????????????????????",
			"??????",
			async () => {
				await setAlertOpens(prev => {
					return { ...prev, isConfirmOpen: false };
				});
				moveReservationRepository
					.addMoveReservation(param, true)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							undefined,
							`?????? ????????? ?????????????????????.`,
							undefined,
							() => {
								setAlertOpens(prev => {
									return { ...prev, isOpen: false };
								});
								getMyMoveReservation();

								// ?????? ?????? ??? ?????? ?????????
								setStartDate(new Date().setDate(new Date().getDate() + 1));
								setCarList([{car_numb: "", worktype: "IN"}]);
								setStartDatetime("")
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

	// ???????????? ?????? Handler
	const handleNotiOpen = () => {
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

	// ?????? ?????? Handler
	const handleGoBack = () => {
		history.goBack();
	};

	const getDate = (date, isFrom) => moment(date).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);

	// ?????? ??????
	const handleDateChange = (key, date, value, isFrom) => {
		setStartDate(getDate(date, isFrom))
	};

	// ?????? ??????
	const handleTimeChange = (key, time) => {
		setStartDatetime(time)
	};

	// ???????????? ??????
	const handleTransfer = event => {
		setTransfer(event.target.value);
	};

	// ?????? ??????
	const handleCar = (idx) => (event) => {
		const {name, value} = event.currentTarget
		const editStd = JSON.parse(JSON.stringify(carList))
		editStd[idx][name] = value
		setCarList(editStd)
	}

	// ?????? ?????? ??????
	const addCarInfo = () => {
		if(carList.length <= 10) {
			setCarList(carList.concat({car_numb: "", worktype: "IN"}))
		}
	}

	// ?????? ?????? ??????
	const removeCarInfo = (idx) => {
		setCarList(carList.filter((date, eIdx) => eIdx !== idx));
	}

	return (
		<div className={classes.root}>
			{
				!isLoading &&
				<div className={classes.inner}>
					<MC.Card>
						<MC.CardContent className={classes.content}>

								<MC.Button
									disableElevation
									className={classes.infoButton}
									onClick={() => handleNotiOpen()}
								>
									???????????? ???????????? ??????
								</MC.Button>

							<form>
								<MC.TableContainer component={MC.Paper} style = {{overflowY: "hidden"}}>
									<MC.Table size={"small"}>
										<MC.TableBody>
											{/* ?????? ?????? */}
											<MC.TableRow>
												<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>??????</MC.TableCell>
												<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
													<MC.FormControl fullWidth>
														<MC.RadioGroup
															row
															aria-label={"payment-method"}
															name={"paymentMethod"}
															onChange={handleTransfer}
															value={transfer}
														>
															<MC.FormControlLabel label={"??????"} control={<MC.Radio color={"primary"} value={"JI"}/>}/>
															<MC.FormControlLabel label={"??????"} control={<MC.Radio color={"primary"} value={"JC"}/>}/>
														</MC.RadioGroup>
													</MC.FormControl>
												</MC.TableCell>
											</MC.TableRow>
											{/* ?????? ??? */}
											{/* ?????? ?????? */}
											<MC.TableRow>
												<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>??????</MC.TableCell>
												<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
													<MC.FormControl fullWidth>
														<MC.Grid container spacing={4} alignItems={"center"} >
															<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"} style={{ display: "flex", alignItems: "center"}}>
																<MC.Grid item xs={8} md={4}>
																	<KeyboardDatePicker
																		autoOk
																		variant="inline"
																		margin="normal"
																		id="sendStartDate-picker-dialog"
																		format="yyyy/MM/DD"
																		disableToolbar
																		minDate={new Date().setDate(new Date().getDate() + 1)}
																		value={startDate || new Date().setDate(new Date().getDate() + 1)}
																		onChange={(date, value) => handleDateChange("startDate", date, value, false)}
																		KeyboardButtonProps={{
																			"aria-label": "change date"
																		}}
																		style={{width: "100%"}}
																		className={classes.keyboardDatePicker} />
																</MC.Grid>
															</MuiPickersUtilsProvider>
														</MC.Grid>
													</MC.FormControl>
												</MC.TableCell>
											</MC.TableRow>
											{/* ?????? ??? */}
											{/* ???????????? ?????? */}
											<MC.TableRow>
												<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>????????????</MC.TableCell>
												<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
													<MC.FormControl fullWidth style = {{ margin: "3px 0px" }}>
														<MC.Grid container spacing={4} alignItems={"center"} >
																<MC.Grid item xs={7} md={3}>
																	<MC.Select
																		labelId="startTime-label"
																		variant={"outlined"}
																		name={"startTime"}
																		id={"startTime"}
																		value={startDatetime || "09"}
																		onChange={(event) => handleTimeChange("startDatetime", event.target.value)}
																		style={{height: 50, width: "100%"}}>
																		{
																			Object.entries(TimeTypeKind).slice(0, toTimeTypeIndex).map((value, index) => (
																				<MC.MenuItem key={index} value={value[0].replaceAll("HOUR_", "")}>
																					{`${("" + index).length === 1 ? `0${index}` : index} ???`}
																				</MC.MenuItem>
																			))
																		}
																	</MC.Select>
																</MC.Grid>

														</MC.Grid>
													</MC.FormControl>
												</MC.TableCell>
											</MC.TableRow>
											{/* ???????????? ??? */}
											{/* ?????? ?????? ?????? */}
											<MC.TableRow>
												<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>????????????????????????<br/>(??????)</MC.TableCell>
												<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
													{carList && carList.map((car, idx) => {
														return (
															<MC.FormControl fullWidth key={idx} style = {{ margin: "3px 0px" }}>
																<MC.Grid container spacing={4} alignItems={"center"}>
																	<MC.Grid item xs={7} md={3}>
																		<MC.TextField
																			id={`car${idx}`}
																			name="car_numb"
																			variant={"outlined"}
																			type={"text"}
																			onChange={handleCar(idx)}
																			value={car.car_numb || ""}
																			placeholder={"???) 12???1234"}
																			style={{ width: "100%" }}/>
																	</MC.Grid>
																	<MC.FormControl className={classes.buttonControl}>
																		<MC.Button
																			variant={"outlined"}
																			onClick={() => addCarInfo(idx)}
																			style={{
																				maxWidth: isMobile ? '20px' : '50px', maxHeight: '30px',
																				minWidth: isMobile ? '20px' : '50px', minHeight: '30px',
																				marginRight: isMobile ? '2px' : '10px'
																			}}
																		>
																			<MI.Add/>
																		</MC.Button>
																		{
																			idx !== 0 &&
																			<MC.Button
																				variant={"outlined"}
																				onClick={() => removeCarInfo(idx)}
																				style={{
																					maxWidth: isMobile ? '20px' : '50px', maxHeight: '30px',
																					minWidth: isMobile ? '20px' : '50px', minHeight: '30px'
																				}}
																			>
																				<MI.Remove/>
																			</MC.Button>
																		}
																	</MC.FormControl>
																</MC.Grid>
															</MC.FormControl>
														)
													})
													}
												</MC.TableCell>
											</MC.TableRow>
											{/* ?????? ?????? ??? */}
										</MC.TableBody>
									</MC.Table>
								</MC.TableContainer>
								<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
									<MC.Button
										onClick={handleGoBack}
										variant="outlined"
										style={{
											marginRight:10, width:150,
										}}
									>
										??????
									</MC.Button>
									<MC.Button
										onClick={handleSubmit}
										variant="contained"
										color="primary"
										style={{
											marginRight:10, width:150,
										}}
									>
										??????
									</MC.Button>
								</MC.Grid>
							</form>
						</MC.CardContent>
					</MC.Card>
				</div>
			}

			<MoveNotiDialog
				isOpen={notiOpen.isOpen}
				isMobile={isMobile}
				handleYes={() => notiOpen.yesFn()}
			/>

		</div>
	);
};

export default MoveReservationEdit;
