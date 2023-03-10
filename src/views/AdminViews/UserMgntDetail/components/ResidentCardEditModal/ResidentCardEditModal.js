import React, { useState, useEffect }          				 from "react";
import PerfectScrollbar    														 from "react-perfect-scrollbar";
import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import MomentUtils                                     from "@date-io/moment";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as MI                                         from "@material-ui/icons";
import { residentCardRepository } 										 from "../../../../../repositories";
import moment                             						 from "moment";
import { PhoneMask } 																	 from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		maxWidth:                       "1180px",
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
		backgroundColor: "#f2f2f2"
	},
	tableCellTitle2:           {
		width: "15%",
		backgroundColor: "#ffffff"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%"
	},
	formControl:                {
		margin:       theme.spacing(1)
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "center",
		alignContent:   "center"
	},
	buttonControl:{
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "center",
		alignContent:   "center"
	},
	serviceAlert: {
		textAlign: "center",
		color: "#ED6C02",
		width: "100%",
		whiteSpace: "pre-line",
		margin: 0,
	}
}));

const ResidentCardEditModal = props => {
	const classes = useStyles();
	const { open, setOpen, handleClose, getMembNumb, delCarList, delMemList, setMemberList, memberList, setCarList, carList, cardInfoAdmin:obj, alertOpens, setAlertOpens, handleAlertToggle, isEdit, relationship } = props;
	const [selectedDate, setSelectedDate] = useState(obj.residentInfo_data !== null && obj.residentInfo_data.entr_date ? obj.residentInfo_data.entr_date : moment().format('YYYY-MM-DD'));																																											// ????????? ?????? state
	const [rsdcclss, setRsdcclss] = useState(obj.residentInfo_data !== null && obj.residentInfo_data.rsdc_clss ? obj.residentInfo_data.rsdc_clss : "10");                                                                																															// ???????????? ?????? state
	const [serviceAgree, setServiceAgree] = useState(obj.residentInfo_data !== null && obj.residentInfo_data.prvc_polc_at ? obj.residentInfo_data.prvc_polc_at : 'N');                                                    																															// ????????? ?????? ?????? state
	const [serviceAgreeDate, setServiceAgreeDate] = useState(obj.residentInfo_data !== null && obj.residentInfo_data.prvc_polc_date? obj.residentInfo_data.prvc_polc_date : '');                                                    																										// ????????? ?????? ?????? state
	const [serviceAlert, setServiceAlert] = useState("");
	const [membNumb, setMembNumb] = useState(obj.residentUserInfo_json_array_data[0].memb_numb);

	// ??????????????? ?????? Handler
	const handleCreate = () => {
		if(!(serviceAgree == 'N')){
			setOpen(false);
			residentCardRepository.createResidentCard({
				memb_numb: membNumb,
				residentinfo: {
					entr_date: selectedDate,
					rsdc_clss: rsdcclss,
					prvc_polc_at: serviceAgree,
					prvc_polc_date: serviceAgreeDate,
					carlist: carList
				},
				memberlist: memberList,
				prvc_polc_at: serviceAgree
			}, false).then(result => {
				handleAlertToggle(
					"isOpen",
					"??????????????? ????????? ?????????????????????.",
					"??????",
					async() => {
						setAlertOpens({...alertOpens, isOpen: false});
						getMembNumb();
					}
				);
			}).catch(e => {
				handleAlertToggle(
					"isOpen",
					e.msg,
					e.errormsg + "\n" + "errorcode: " + e.errorcode,
					async() => {
						setAlertOpens({...alertOpens, isOpen: false});
					}
				);
			})
		} else {
			setServiceAlert("????????? ?????? ????????? ??????????????????.");
		}
	}

	// ??????????????? ??????
	const handleEdit = () => {
		let totalmemb=memberList.concat(delMemList);
		let totalcar=carList.concat(delCarList);
		setOpen(false);
		residentCardRepository.updateResidentCard({
			memb_numb: membNumb,
			residentinfo:{
				entr_date: selectedDate,
				rsdc_clss: rsdcclss,
				carlist: totalcar
			},
			memberlist: totalmemb,
		}, false).then(result => {
			handleAlertToggle(
				"isOpen",
				"??????????????? ????????? ?????????????????????.",
				"??????",
				async () => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					getMembNumb();
				}
			);
		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n" + "errorcode: " + e.errorcode,
				async () => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		})
	}

	// ?????? ?????? ?????? ?????????
	const handleDateChange = (key, date) => {
		setSelectedDate(moment(date).format('YYYY-MM-DD'));
	};

	// ???????????? ??????
	const handleRsdcclss = event => {
		setRsdcclss(event.target.value);
	};

	// ??????????????? ?????? ??????
	const handleInputChange = (idx) => (event) => {
		// const {name, value} = event.currentTarget
		let name = event.target.name;
		let value = event.target.value;
		const editStd = JSON.parse(JSON.stringify(memberList))
		editStd[idx][name] = value
		setMemberList(editStd)
	}

	// ?????? ??????
	const handleCar = (idx) => (event) => {
		const {name, value} = event.currentTarget
		const editStd = JSON.parse(JSON.stringify(carList))
		editStd[idx][name] = value
		setCarList(editStd)
	}

	// ????????? ?????? ??????
	const handleServiceAgree = event => {
		if (event.target.checked) {
			setServiceAgree('Y');
			setServiceAgreeDate(moment().format('YYYY-MM-DD'));
		} else {
			setServiceAgree('N');
			setServiceAgreeDate('');
		}
	};

	// ??????????????? ?????? ??????
	const addMemberInfo = () => {
		if(memberList.length <= 10) {
			setMemberList(memberList.concat({
				memb_name: "",
				memb_type: "I",
				rltn_type: "",
				mbil_teln: "",
				work_type: "IN",
			}))
		}
	}

	// ??????????????? ?????? ??????
	const removeMemberInfo = (idx) => {
		let datax = memberList.filter((data, eIdx) => eIdx === idx);
		if(datax!=null && datax.length>0 && datax[0].memb_numb!=null){
			datax[0].work_type='DELETE';
			delMemList.push(datax[0]);
			setMemberList(memberList.filter((data) => data.memb_numb!==datax[0].memb_numb));
		}else{
			setMemberList(memberList.filter((data,index) => index!=idx));
		}
	}
	// console.log(delMemList);
	// console.log(memberList);

	// ?????? ?????? ?????? cardInfo.residentInfo_data.carlist
	const addCarInfo = () => {
		if(carList.length <= 10) {
			setCarList(carList.concat({car_numb: "", work_type: "IN"}))
		}
	}

	// ?????? ?????? ??????
	const removeCarInfo = (idx) => {
		let datax = carList.filter((data, eIdx) => eIdx === idx);
		if(datax!=null && datax.length>0 && datax[0].park_car_numb!=null){
			datax[0].work_type='DELETE';
			delCarList.push(datax[0]);
			setCarList(carList.filter((data) => data.park_car_numb!=datax[0].park_car_numb));
		}else{
			setCarList(carList.filter((data, index) => index !== idx));
		}
	}
	// console.log(delCarList);
	// console.log(carList);

	// ????????? ?????? ????????? ??????
	useEffect(() => {
		if (carList && carList.length == 0) {
			setCarList([{car_numb: "", work_type: "IN"}])
		};
		if (memberList && memberList.length == 0) {
			setMemberList([{memb_name: "", memb_type: "I", rltn_type: "",	mbil_teln: "", work_type: "IN"}])
		}
	}, [carList, memberList]);

	// console.log(memberList);

	return (
		<MC.Dialog maxWidth={"md"} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<MC.Card style={{maxHeight: '100%', overflow: 'auto'}}>
				<MC.CardContent className={classes.content}>
					<PerfectScrollbar>
						<form>
							<MC.TableContainer component={MC.Paper}>
								<MC.Table size={"small"}>
									<MC.TableBody>
									{/* ??????(??????)??? ?????? */}
										<MC.TableRow>
											<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>??????(??????)???</MC.TableCell>
											<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
												<MC.FormControl fullWidth>
													<MC.Grid container spacing={4} alignItems={"center"} >
														<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"} style={{ display: "flex", alignItems: "center"}}>
															<MC.Grid item xs={12} md={4}>
																<KeyboardDatePicker
																	autoOk
																	variant="inline"
																	margin="normal"
																	id="sendEntrDate-picker-dialog"
																	format="yyyy-MM-DD"
																	value={selectedDate}
																	// value={searchInfo.entrDate || new Date()}
																	onChange={(date, value) => handleDateChange("selectedDate", date, value)}
																	KeyboardButtonProps={{
																		"aria-label": "change date"
																	}}
																	className={classes.keyboardDatePicker} />
															</MC.Grid>
														</MuiPickersUtilsProvider>
													</MC.Grid>
												</MC.FormControl>
											</MC.TableCell>
										</MC.TableRow>
									{/* ??????(??????)??? ??? */}

									{/* ???????????? ?????? */}
										<MC.TableRow>
											<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>????????????</MC.TableCell>
											<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
												<MC.FormControl fullWidth>
													<MC.RadioGroup
														row
														aria-label={"rsdcclss"}
														name="rsdcclss"
														onChange={handleRsdcclss}
														value={rsdcclss}>
														<MC.FormControlLabel label={"??????"} control={<MC.Radio color={"primary"} value={"10"}/>}/>
														<MC.FormControlLabel label={"???, ??????"} control={<MC.Radio color={"primary"} value={"30"}/>}/>
													</MC.RadioGroup>
												</MC.FormControl>
											</MC.TableCell>
										</MC.TableRow>
									{/* ???????????? ??? */}

									{/* ??????????????? ?????? ?????? */}
										<MC.TableRow>
											<MC.TableCell rowSpan={2} variant={"head"} align="center" className={classes.tableCellTitle}>??????????????? ??????</MC.TableCell>
											<MC.TableCell>
												<span style={{marginLeft: "11%", marginRight: "8%"}}>??????</span>
												<span style={{marginLeft: "14%", marginRight: "7%"}}>??????</span>
												<span style={{marginLeft: "13%"}}>???????????????</span>
											</MC.TableCell>
										</MC.TableRow>
										<MC.TableRow>
											<MC.TableCell>
												{memberList && memberList.map((mem, idx) => {
													return (
														<MC.FormControl fullWidth className={classes.formControl} key={idx}>
															<MC.Grid container spacing={2} alignItems={"center"}>

																{/*	?????? */}
																<MC.Grid item xs={3} md={3}>
																	<MC.TextField
																		id={`memb${idx}`}
																		name="memb_name"
																		variant={"outlined"}
																		type={"text"}
																		onChange={handleInputChange(idx)}
																		value={mem.memb_name || ""}
																		style={{ width: "100%" }}/>
																</MC.Grid>

																{/* ?????? ????????? */}
																<MC.Grid item xs={3} md={3}>
																	<MC.TextField
																		select
																		name="rltn_type"
																		variant={"outlined"}
																		id={`relationship${idx}`}
																		style={{ width:"100%"}}
																		value={mem.rltn_type || ""}
																		onChange={handleInputChange(idx)}
																		>
																		{
																			relationship && relationship.map((item, idx) => (
																				<MC.MenuItem value={item.commcode} key={idx}>{item.commdesc}</MC.MenuItem>
																			))
																		}
																	</MC.TextField>
																</MC.Grid>

																{/* ??????????????? */}
																<MC.Grid item xs={3} md={3}>
																	<MC.OutlinedInput
																		id={`mbil${idx}`}
																		name="mbil_teln"
																		onChange={handleInputChange(idx)}
																		value={mem.mbil_teln || ""}
																		placeholder={" "}
																		inputComponent={PhoneMask}
																	/>
																</MC.Grid>

																{/* ?????? ?????? ?????? */}
																<MC.FormControl className={classes.buttonControl}>
																	<MC.Button
																		variant={"outlined"}
																		onClick={() => addMemberInfo(idx)}
																		style={{maxWidth: '50px', maxHeight: '30px', minWidth: '50px', minHeight: '30px', marginRight: '10px'}}
																	>
																		<MI.Add/>
																	</MC.Button>
																	<MC.Button
																		variant={"outlined"}
																		onClick={() => removeMemberInfo(idx)}
																		style={{maxWidth: '50px', maxHeight: '30px', minWidth: '50px', minHeight: '30px'}}
																	>
																		<MI.Remove/>
																	</MC.Button>
																</MC.FormControl>
															</MC.Grid>
														</MC.FormControl>
													)
												})}
											</MC.TableCell>
										</MC.TableRow>
									{/* ??????????????? ?????? ??? */}

									{/* ?????? ?????? ?????? */}
										<MC.TableRow>
											<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>?????? ??????</MC.TableCell>
											<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
												{carList && carList.map((car, idx) => {
													return (
														<MC.FormControl fullWidth className={classes.formControl} key={idx}>
															<MC.Grid container spacing={2} alignItems={"center"}>
																<MC.Grid item xs={12} md={3}>
																	<MC.TextField
																		id={`car${idx}`}
																		name="car_numb"
																		variant={"outlined"}
																		type={"text"}
																		onChange={handleCar(idx)}
																		value={car.car_numb || ""}
																		placeholder={"???) 12???1234"}
																		style={{ width: "100%", marginRight:"35px" }}/>
																</MC.Grid>
																<MC.FormControl className={classes.buttonControl}>
																	<MC.Button
																		variant={"outlined"}
																		onClick={() => addCarInfo(idx)}
																		style={{maxWidth: '50px', maxHeight: '30px', minWidth: '50px', minHeight: '30px', marginRight: '10px'}}
																	>
																		<MI.Add/>
																	</MC.Button>
																	<MC.Button
																		variant={"outlined"}
																		onClick={() => removeCarInfo(idx)}
																		style={{maxWidth: '50px', maxHeight: '30px', minWidth: '50px', minHeight: '30px'}}
																	>
																		<MI.Remove/>
																	</MC.Button>
																</MC.FormControl>
															</MC.Grid>
														</MC.FormControl>
													)
												})
												}
											</MC.TableCell>
										</MC.TableRow>
									{/* ?????? ?????? ??? */}

									{/* ????????? ?????? ?????? ?????? */}
										<MC.TableRow>
											<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>????????? ?????? ??????</MC.TableCell>
											<MC.TableCell>?????????????????? ????????? ????????? ?????????????????? ???????????? ??? ???????????? ?????? ?????? ????????? ??? ??????????????????????????? ??? ??????????????? ????????? ???????????? ????????? ???????????????.<br /> ?????? ?????? ??? ???????????? ??????????????? ?????? ????????? ???????????? ?????? ???????????????.
												<MC.Checkbox checked={serviceAgree !== null && serviceAgree == 'Y' || obj?.residentInfo_data?.prvc_polc_at == 'Y' ? true : false} onChange={handleServiceAgree} />
												<br />
												{serviceAgree == 'N' &&
												<MC.DialogContentText className={classes.serviceAlert} id="alert-dialog-slide-description">
													{serviceAlert}
												</MC.DialogContentText>
												}
											</MC.TableCell>
										</MC.TableRow>
									</MC.TableBody>
									{/* ????????? ?????? ?????? ??? */}

								</MC.Table>
							</MC.TableContainer>
							<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
								<MC.Button
									variant="text"
									style={{
										color:                  "primary",
										borderColor:            "primary",
										marginRight:						10,
									}}
									onClick={() => window.open('https://www.gov.kr/', '_blank')}
								>
									????????? ????????????
								</MC.Button>
								<MC.Button
									onClick={handleClose}
									variant="outlined"
									style={{
										marginRight:10, width:150,
									}}
								>
									??????
								</MC.Button>
								<MC.Button
									onClick={isEdit ? handleEdit : handleCreate}
									variant="contained"
									color="primary"
									style={{
										marginRight:10, width:150,
									}}
								>
									{
										isEdit ? "??????" : "??????"
									}
								</MC.Button>
							</MC.Grid>
						</form>
					</PerfectScrollbar>
				</MC.CardContent>
			</MC.Card>
		</MC.Dialog>
	);
};

export default ResidentCardEditModal;
