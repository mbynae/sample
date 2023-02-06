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

	const steps = ["강좌 선택", "예약 확인"]; // 각 Steps Label
	const [activeStep, setActiveStep] = useState(0); // 현재 Active Step

	const {
		history, rootUrl, isMobile, alertOpens, setAlertOpens, handleAlertToggle,
		facilityBigList, getFacilityMidList, facilityMidList, getFacilityAdditionalList, setFacilityAdditionalList,
		facilityAdditionalList: obj
	} = props; // Props

	const [reservationObj, setReservationObj] = useState({
		first: "",
		prgm_numb: ""
	}); // 드랍다운 Input State

	const [selectedCourseObj, setSelectedCourseObj] = useState({}); // 선택된 강좌 아이템 객체 (Submit)

	// Validation 처리
	const [errors, setErrors] = useState({
		first: false,
		prgm_numb: false
	});

	const [selectedCourse, setSelectedCourse] = useState(-1); // 선택된 강좌 아이템
	const [basketReservation, setBasketReservation] = useState({}); // 임시 예약 등록 저장 State
	const [courseReservationInfo, setCourseReservationInfo] = useState([]); // 강좌 안내문 State
	// 예약 이용 안내
	const [reservationGuide, setReservationGuide] = useState("");

	// 안내사항 Alert
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
	// 안내사항 버튼 Handler
	const handleNotiOpen = () => {
		if (reservationObj.prgm_numb === "") {
			handleAlertToggle(
				"isOpen",
				undefined,
				"강좌를 먼저 선택해주세요.",
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

	// 강좌에 대한 안내 호출
	const getCourseReservationInfo = (value) => {
		resrvHistRepository.getCourseReservationInfo(value)
			.then(result => {
				setCourseReservationInfo(result.data_json_array);
			});
	};

	// 좌석 선택 Handler
	const handleSelectCourse = (selectedCourse) => {
		setSelectedCourse(selectedCourse);
		setSelectedCourseObj(obj[selectedCourse]);
	};

	// 다음 스텝 이동 Handler
	const handleNext = () => {
		if (activeStep === 0) {
			if (selectedCourse === -1) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"강좌를 선택해주세요.",
					undefined,
					() => {
						setAlertOpens(prev => {
							return { ...prev, isOpen: false };
						});
					}
				);
			} else {
				// Step 1에서 입력한 정보로 임시예약등록 진행
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
						// 예약 이용 안내 조회
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
						"확인",
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
	// 이전 스텝 이동 Handler
	const handleBack = () => {
		if (activeStep > 0) {
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		} else {
			handleGoBack();
		}
	};
	// 취소 버튼 Handler
	const handleGoBack = () => {
		history.goBack();
	};

	// Input Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		// 강좌 선택되었을 경우 중분류 목록 가져오기
		if (name === "first") {
			getFacilityMidList(value);
			setReservationObj({
				...reservationObj,
				[name]: value,
				prgm_numb: "",
				third: ""
			});
			setFacilityAdditionalList([]); // 강좌 리스트 목록 초기화
			setSelectedCourse(-1); // 선택 아이템 초기화
			setCourseReservationInfo([]) // 강좌 안내 초기화
		}
		// 강좌 선택되었을 경우 추가상품 목록 가져오기 / 안내문 가져오기
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

	// 최종 예약 Handler
	const handleSubmit = () => {

		let addParam = {};

		let facilityNumb = reservationObj.first.split("/");
		addParam.fclt_code = facilityNumb[0]; // 시설 코드
		addParam.fclt_numb = facilityNumb[1]; // 대분류
		addParam.prgm_numb = selectedCourseObj.prgm_numb; // 강좌 아이템
		addParam.rsvt_strt_date = selectedCourseObj.prgm_strt_date; // 예약 시작 날짜
		addParam.rsvt_end_date = selectedCourseObj.prgm_end_date; // 예약 종료 날짜
		addParam.rsvt_strt_time = selectedCourseObj.prgm_strt_time; // 예약 시작 시간
		addParam.rsvt_end_time = selectedCourseObj.prgm_end_time; // 예약 종료 시간

		const params = JSON.stringify(addParam);

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"선택하신 정보로 예약 신청을 하시겠습니까?",
			"확인",
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
							"신청되었습니다.\n관리사무소에서 확인 후 최종 예약이 진행됩니다.",
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
						"확인",
						() => {
							setAlertOpens(prev => {
								return { ...prev, isOpen: false };
							});
						},
						undefined
					);
				});
			},
			"취소",
			() => {
				setAlertOpens(prev => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	// Step1 - 강좌 선택 테이블 Row Render
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
												수강요일 &nbsp; <span style={{ fontWeight: "normal" }}>{`${item.dayw_clss_name}`}</span>
											</MC.Grid>
											<MC.Grid item style={{ color: "#dedede" }}>&nbsp;|&nbsp;</MC.Grid>
											<MC.Grid item style={{ fontSize: 12 }}>
												예약현황&nbsp;
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
									선택
								</MC.Button>
							</MC.TableCell>
						</>
					)
					:
					(
						<>
							{/*번호*/}
							<MC.TableCell align={"center"}>
								{index + 1}
							</MC.TableCell>

							{/*강좌명*/}
							<MC.TableCell align={"center"}>
								{item.prgm_name}
							</MC.TableCell>

							{/*수강요일*/}
							<MC.TableCell align={"center"}>
								{`${item.dayw_clss_name}`}
							</MC.TableCell>

							{/*수강시간*/}
							<MC.TableCell align={"center"}>
								{item.prgm_strt_time.substring(0, 5)}
								~
								{item.prgm_end_time.substring(0, 5)}
							</MC.TableCell>

							{/*예약현황*/}
							<MC.TableCell align={"center"}>
								{`${item.use_cnt}/${item.totl_cnt}`}
							</MC.TableCell>

							{/*선택 버튼*/}
							<MC.TableCell align={"center"}>
								<MC.Button
									variant="contained"
									color={index === selectedCourse ? "secondary" : palette.white.main}
									onClick={() => handleSelectCourse(index)}
									disabled={!item.rsvt_chck || item.use_cnt === item.totl_cnt}
								>
									선택
								</MC.Button>
							</MC.TableCell>
						</>
					)
			}

		</MC.TableRow>
	);

	// Step 2 예약확인 테이블 Row - Render
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
			{/*--------------------------------------------- Step 1 : 강좌 선택 ---------------------------------------------*/}
			{
				activeStep === 0 &&
				<>
					{/* 시설 선택 */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Grid container spacing={1} alignItems={"center"}>
							<MC.Typography>&nbsp;&nbsp;시설 선택</MC.Typography>
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
					{/* 강좌 선택 */}
					<MC.FormControl fullWidth style={{ margin: "15px 0px" }}>
						<MC.Typography style={{ marginBottom: 3 }}>&nbsp;강좌 선택</MC.Typography>
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
									강좌 안내
								</MC.Button>
							</MC.Grid>
						</MC.Grid>
						{reservationObj.first === "" && <MC.FormHelperText>시설을 먼저 선택해주세요.</MC.FormHelperText>}
					</MC.FormControl>

					{/* 강좌 선택 테이블 */}
					<MC.Table style={{ marginTop: 50 }}>
						<MC.TableHead className={classes.tableHead}>
							{
								isMobile ?
									(
										<MC.TableRow className={classes.tableRow} style={{ borderTop: "2px solid #222222" }}>
											<MC.TableCell align={"center"} className={clsx(classes.body4, classes.tableHeadCell)}>
												목록
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell)}
												align={"center"}
											>
												선택
											</MC.TableCell>
										</MC.TableRow>
									)
									:
									(
										<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												번호
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												강좌명
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												수강요일
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												수강시간
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												예약현황
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
												align={"center"}>
												선택
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
													조회된 강좌가 한 건도 없네요.
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
			{/*--------------------------------------------- Step 2 : 예약 확인 ---------------------------------------------*/}
			{
				activeStep === 1 &&
				<>
					<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} className={classes.tableRoot}>
						{renderTableRow("강좌명", basketReservation.prgm_name)}
						{renderTableRow("이용일자", basketReservation.rsvt_strt_date ? (basketReservation.rsvt_strt_date + " ~ " + basketReservation.rsvt_end_date) : "미등록")}
						{renderTableRow("이용시간", basketReservation.rsvt_strt_time && (basketReservation.rsvt_strt_time.substring(0, 5) + " ~ " + basketReservation.rsvt_end_time.substring(0, 5)))}
						{renderTableRow("이용요금", basketReservation.rsvt_amt)}
						{renderTableRow("강사", (basketReservation.inst_name ? basketReservation.inst_name : "미등록") + " | " + basketReservation.inst_teln)}
					</MC.Grid>

					<div className={classes.reservInfoField}>
						<MC.Grid container direction={"row"} alignItems={"center"}>
							<ErrorOutlineIcon/>&nbsp;<MC.Typography>유료 예약안내</MC.Typography>
							<br />
							<br />
						</MC.Grid>
						<div
							className="ql-editor"
							dangerouslySetInnerHTML={{
								__html:
									reservationGuide !== ""
										? reservationGuide
										: "등록된 안내사항이 없습니다.",
							}}
							style={{ maxHeight: "none", fontSize: 14 }}
						/>
					</div>
				</>
			}

			{/*------------------------------------------------ 하단 버튼 --------------------------------------------------*/}
			<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
				<MC.Button
					onClick={handleBack}
					variant="outlined"
					style={{
						marginRight: 10, width: 200,
					}}
				>
					{activeStep === 0 ? "취소" : "이전"}
				</MC.Button>
				<MC.Button
					onClick={activeStep !== 1 ? handleNext : handleSubmit}
					variant="contained"
					color="primary"
					style={{
						width: 200,
					}}
				>
					{activeStep !== 1 ? "다음" : "예약신청"}
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

