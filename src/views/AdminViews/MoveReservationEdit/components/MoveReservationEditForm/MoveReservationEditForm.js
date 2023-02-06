import React, { useEffect, useState }                                          from "react";
import { KeyboardDatePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                                             from "@date-io/moment";
import moment                                              from "moment";

import * as MC          from "@material-ui/core";
import * as MS          from "@material-ui/styles";
import * as MI          from "@material-ui/icons";
import { TimeTypeKind } from "../../../../../enums";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	cardHeader:        {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:       {
		width:"90%", marginLeft:"5%", marginTop:"1%"
	},
	buttonLayoutRight: {
		padding:        theme.spacing(3),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "center",
		alignContent:   "center"
	}, attachLayout:   {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
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
		padding: "10px 20px 10px 20px"
	},
	buttonControl:{
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "center",
		alignContent:   "center"
	}
}));

const MoveReservationEditForm = props => {
	const classes = useStyles();

	const { isEdit, moveReservation: obj, setMoveReservation: setObj, errors, setErrors,
		dongList, hoList, getHoNumList} = props;
	const [toTimeTypeIndex, setToTimeTypeIndex] = useState(24);

	const [originCarNumbList, setOriginCarNumbList] = useState([]); // 초기 차량 번호 리스트 (수정 시)

	useEffect(() => {

		// 수정할 항목에 차량 등록이 안되있는 경우 입력 필드 추가
		if (obj.carlist && obj.carlist.length == 0) {
			setObj(prev => {
				return {
					...prev,
					carlist: obj.carlist.concat({car_numb: "", worktype: "IN"})
				};
			});
		}

		let tempCarNumbList = []

		obj.carlist && obj.carlist.map((item, index) => tempCarNumbList.push(item.car_numb))
		setOriginCarNumbList(tempCarNumbList)

	}, []);

	// 입력 필드 Change Handler
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setErrors(prev => {
			if (name === "dong_numb") return {...prev, dong_numb: value === ""};
			else if (name === "ho_numb") return {...prev, ho_numb: value === ""};
			else if (name === "mvio_name") return {...prev, mvio_name: value === ""};
			else if (name === "mvio_tel") return {...prev, mvio_tel: value === ""};
			else return {...prev}
		});

		// 동 값이 입력 되었을 때 호 Dropdown List 출력 함수 호출
		if (name === "dong_numb") {
			getHoNumList(value);
		}

		setObj(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	const getDate = (date, isFrom) => moment(date).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	// 날짜 선택 Handler
	const handleDateChange = (key, date, value, isFrom) => {
		setObj(prev => {
			return {
				...prev,
				[key]: getDate(date, isFrom)
			};
		});
	};

	// 차량 정보
	const handleCar = (idx) => (event) => {
		const {name, value} = event.currentTarget
		const editStd = JSON.parse(JSON.stringify(obj.carlist))
		editStd[idx][name] = value
		setObj(prev => {
			return {
				...prev,
				carlist: editStd
			};
		});
	}

	// 차량 정보 추가
	const addCarInfo = () => {
		if(obj.carlist.length <= 10) {
			setObj(prev => {
				return {
					...prev,
					carlist: obj.carlist.concat({car_numb: "", worktype: "IN"})
				};
			});
		}
	}

	// 차량 정보 제거
	const removeCarInfo = (idx) => {

		// 삭제된 차량 정보 State에 저장
		let removedItems = obj.deleted_carlist;

		// 기존에 있었던 차량 삭제 시에만 삭제된 차량 정보 리스트에 저장
		if (originCarNumbList.includes(obj.carlist[idx].car_numb)) {
				removedItems.push({ ...obj.carlist[idx], worktype: "DELETE" });
		}

		// 등록된 아이템이 하나일 경우
		if (obj.carlist.length == 1) {
			setObj(prev => {
				return {
					...prev,
					carlist: [{car_numb: "", worktype: "IN"}],
					deleted_carlist: removedItems
				};
			});
		} else {
			setObj(prev => {
				return {
					...prev,
					carlist: obj.carlist.filter((date, eIdx) => eIdx !== idx),
					deleted_carlist: removedItems
				};
			});
		}
	}

	return (
		<MC.Card>
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.TableContainer component={MC.Paper}>
						<MC.Table size={"small"} style={{overflow: "hidden"}}>
							<MC.TableBody>

								{/* 동/호 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>동/호</MC.TableCell>
									<MC.TableCell className={classes.tableCellDescriptionFull}>
										<MC.Grid container spacing={2} alignItems={"center"}>
											<MC.Grid item xs={6} md={4}>
												<MC.FormControl fullWidth error={errors.dong_numb}>
													<MC.InputLabel id="dong_numb_label">동</MC.InputLabel>
													<MC.Select
														labelId="dong_numb_label"
														name="dong_numb"
														id="dong_numb"
														defaultValue={""}
														disabled={isEdit}
														value={obj.dong_numb || ""}
														onChange={handleChange}>
														{dongList.map((item, index) =>
															<MC.MenuItem key={index} value={item.dong_numb}>{item.dong_numb}</MC.MenuItem>
														)}
													</MC.Select>
													{obj.dong_numb === "" && <MC.FormHelperText> </MC.FormHelperText>}
												</MC.FormControl>
											</MC.Grid>

											<MC.Grid item xs={6} md={4}>
												<MC.FormControl fullWidth error={errors.ho_numb}>
													<MC.InputLabel id="ho_numb_label">호</MC.InputLabel>
													<MC.Select
														labelId="ho_numb_label"
														name="ho_numb"
														id="ho_numb"
														defaultValue={""}
														disabled={isEdit || obj.dong_numb === ""}
														value={obj.ho_numb || ""}
														onChange={handleChange}>
														{hoList.map((item, index) =>
															<MC.MenuItem key={index} value={item.ho_numb}>{item.ho_numb}</MC.MenuItem>
														)}
													</MC.Select>
													{obj.dong_numb === "" && <MC.FormHelperText>동을 먼저 선택해주세요.</MC.FormHelperText>}
												</MC.FormControl>
											</MC.Grid>
										</MC.Grid>
									</MC.TableCell>
								</MC.TableRow>

								{/* 동/호 끝 */}

								{/* 구분 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>구분</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth>
											<MC.RadioGroup
												row
												aria-label={"mvio_code"}
												name={"mvio_code"}
												onChange={handleChange}
												value={obj.mvio_code || "JI"}>
												<MC.FormControlLabel label={"전입"} control={<MC.Radio color={"primary"} value={"JI"}/>}/>
												<MC.FormControlLabel label={"전출"} control={<MC.Radio color={"primary"} value={"JC"}/>}/>
											</MC.RadioGroup>
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>
								{/* 구분 끝 */}

								{/* 날짜 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>날짜</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.FormControl fullWidth>
											<MC.Grid container spacing={4} alignItems={"center"}>
												<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}
																								 style={{ display: "flex", alignItems: "center" }}>
													<MC.Grid item xs={12} md={4}>
														<KeyboardDatePicker
															autoOk
															variant="inline"
															margin="normal"
															id="sendStartDate-picker-dialog"
															format="yyyy/MM/DD"
															// disabled={!searchInfo.isUseSendDate}
															disableToolbar
															value={obj.mvio_strt_date || new Date()}
															onChange={(date, value) => handleDateChange("mvio_strt_date", date, value, true)}
															KeyboardButtonProps={{
																"aria-label": "change date"
															}}
															style={{ width: "100%" }}
															className={classes.keyboardDatePicker}/>
													</MC.Grid>
												</MuiPickersUtilsProvider>
											</MC.Grid>
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>
								{/* 날짜 끝 */}

								{/* 시간 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>시간</MC.TableCell>
									<MC.TableCell className={classes.tableCellDescriptionFull}>
										<MC.Grid container spacing={4} alignItems={"center"}>
											<MC.Grid item xs={7} md={3}>
												<MC.Select
													labelId="startTime-label"
													variant="outlined"
													name="mvio_strt_time"
													id="mvio_strt_time"
													value={obj.mvio_strt_time || "09"}
													onChange={handleChange}
													style={{ width: "100%" }}>
													{
														Object.entries(TimeTypeKind).slice(0, toTimeTypeIndex).map((value, index) => (
															<MC.MenuItem key={index} value={value[0].replaceAll("HOUR_", "")}>
																{`${("" + index).length === 1 ? `0${index}` : index} 시`}
															</MC.MenuItem>
														))
													}
												</MC.Select>
											</MC.Grid>
										</MC.Grid>
									</MC.TableCell>
								</MC.TableRow>
								{/* 시간 끝 */}

								{/* 예약추가정보 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>예약 추가 정보</MC.TableCell>
									<MC.TableCell className={classes.tableCellDescriptionFull}>
										<MC.Grid container spacing={2} alignItems={"center"}>
											<MC.Grid item xs={6} md={4}>
												<MC.TextField
													label="예약자명"
													labelId="mvio_name-label"
													variant="outlined"
													name="mvio_name"
													id="mvio_name"
													error={errors.mvio_name}
													value={obj.mvio_name || ""}
													onChange={handleChange}
													style={{ width: "100%" }}>
												</MC.TextField>
											</MC.Grid>
											<MC.Grid item xs={6} md={4}>
												<MC.TextField
													label="연락처"
													labelId="mvio_tel-label"
													variant="outlined"
													name="mvio_tel"
													id="mvio_tel"
													error={errors.mvio_tel}
													value={obj.mvio_tel || ""}
													onChange={handleChange}
													style={{ width: "100%" }}>
												</MC.TextField>
											</MC.Grid>
										</MC.Grid>
									</MC.TableCell>
								</MC.TableRow>
								{/* 예약추가정보 끝 */}

								{/* 차량 번호 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>이사업체
										차량번호<br/>(선택)</MC.TableCell>
									<MC.TableCell style={{ width: "100%" }} className={classes.tableCellDescriptionFull}>
										{obj.carlist && obj.carlist.map((car, idx) => {
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
																disabled={(isEdit && originCarNumbList.includes(car.car_numb))}
																value={car.car_numb || ""}
																placeholder={"예) 12가1234"}
																style={{ width: "100%" }}/>
														</MC.Grid>
														<MC.FormControl className={classes.buttonControl}>
															<MC.Button
																variant={"outlined"}
																onClick={() => addCarInfo(idx)}
																style={{
																	maxWidth: '50px', maxHeight: '30px',
																	minWidth: '50px', minHeight: '30px',
																	marginRight: '10px'
																}}
															>
																<MI.Add/>
															</MC.Button>
															{
																(isEdit || (!isEdit && idx !== 0)) &&
																<MC.Button
																	variant={"outlined"}
																	onClick={() => removeCarInfo(idx)}
																	style={{
																		maxWidth: '50px', maxHeight: '30px',
																		minWidth: '50px', minHeight: '30px'
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
								{/* 예약자 연락처 끝 */}
								{/* 비고 시작 */}
								{/*<MC.TableRow>*/}
								{/*	<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>비고</MC.TableCell>*/}
								{/*	<MC.TableCell align="center" className={classes.tableCellDescriptionFull}><MC.TextField*/}
								{/*		id={"reserve_note"}*/}
								{/*		name={"reserve_note"}*/}
								{/*		variant={"outlined"}*/}
								{/*		type={"text"}*/}
								{/*		onChange={handleChange}*/}
								{/*		value={obj.reserve_note || ""}*/}
								{/*		style={{ width: "100%" }}/>*/}
								{/*	</MC.TableCell>*/}
								{/*</MC.TableRow>*/}
								{/* 비고 끝 */}
							</MC.TableBody>
						</MC.Table>

					</MC.TableContainer>

				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default MoveReservationEditForm;
