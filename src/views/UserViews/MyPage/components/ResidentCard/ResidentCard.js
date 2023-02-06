import React, {useState, useEffect}            from "react";
import * as MC                                 from "@material-ui/core";
import * as MS                                 from "@material-ui/styles";
import { PhoneHyphen } from "../../../../../components";
import PerfectScrollbar                        from "react-perfect-scrollbar";
import ResidentCardEditModal                   from "../ResidentCardEditModal";
import { residentCardRepository }          from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		width:      "100%",
		[theme.breakpoints.down("xs")]: {
			width:    "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin:   0
		},
		minHeight: "500px"
	},
	h6:             {
		...theme.typography.h6,
		whiteSpace: "pre-line",
		marginTop: "30px",
		marginBottom: "20px"
	},
	inner: {
		minWidth: 1148
	},
	tableCellTitle:           {
		width: "20%",
		backgroundColor: "#f2f2f2"
	},
	tableCellDescriptionFull: {
		width:    "80%",
		maxWidth: "80%"
	},
	formControl:                {
		margin:    theme.spacing(1)
	},
}));

const ResidentCard = props => {

	const classes = useStyles();

	const { userInfo, isMobile, value, alertOpens, setAlertOpens, handleAlertToggle} = props;
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [relationship, setRelationship] = useState([]);			// 모달 관계 리스트
	const [cardInfo, setCardInfo] = useState({});							// 회원 카드정보

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getResidentCard();
			await getRelationTypeList();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getResidentCard = () => {
		residentCardRepository.getResidentCard(true)
			.then(result => {
				setCardInfo(result);
				if(result.isResidentExist == true) {
					setIsEdit(true);
				} else {
					setIsEdit(false);
					// dataBinding(undefined);
				}
			})
	}

	const getRelationTypeList = () => {
		residentCardRepository.getPrgmTypeList("C051",true)
			.then(result => {
				setRelationship(result.data_json_array)
			})
	}

	const handleClose = () => setOpen(false);
	const handleOpen = () => {
		setOpen(true);
	}

	// const a11yProps = index => {
	// 	return {
	// 		id:              `tab-${index}`,
	// 		"aria-controls": `tabpanel-${index}`
	// 	};
	// };

	function TabPanel(props) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<MC.Box p={0}>
						<div>{children}</div>
					</MC.Box>
				)}
			</div>
		);
	}

	return (
		<div hidden={value !== 1} className={classes.root}>
			<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
				<MC.Grid item style={{ width: "100%", marginTop: 45 }}>
					<TabPanel value={0} index={0}>
						{/* 세대주가 아닌 경우*/}
						{cardInfo.isHouseholdOwner===false ?
							<MC.Table size="medium">
								<MC.TableBody>
									<MC.TableRow>
										<MC.TableCell colSpan={7} align="center" style={{paddingBottom:50}}>
											입주자카드 정보는 세대주만 열람 및 수정이 가능합니다.
										</MC.TableCell>
									</MC.TableRow>
								</MC.TableBody>
							</MC.Table> : null}

						{cardInfo.isHouseholdOwner===true ?
							cardInfo.isResidentExist===true ? (
									<MC.Card style={{ overflow: "visible", minHeight: 400}}>
										<MC.CardContent>
											<PerfectScrollbar>
												{/* 테이블컨테이너 시작 */}
												<MC.TableContainer component={MC.Paper}>
													<MC.Table size={"small"}>
														<MC.TableBody>
															<MC.TableRow>
																<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">입주(예정)일</MC.TableCell>
																<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
																	<MC.FormControl fullWidth className={classes.formControl}>
																		{cardInfo.residentInfo_data && cardInfo.residentInfo_data.entr_date}
																	</MC.FormControl>
																</MC.TableCell>
															</MC.TableRow>

															<MC.TableRow>
																<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">입주형태</MC.TableCell>
																<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
																	<MC.FormControl fullWidth className={classes.formControl}>
																		{cardInfo.residentInfo_data && cardInfo.residentInfo_data.rsdc_clss_name}
																	</MC.FormControl>
																</MC.TableCell>
															</MC.TableRow>

															<MC.TableRow>
																<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">차량정보</MC.TableCell>
																<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
																	<MC.FormControl fullWidth className={classes.formControl}>
																		{cardInfo.residentInfo_data.carlist && cardInfo.residentInfo_data.carlist.map((car, index) => (
																			<span key={index}>{car.car_numb}</span>
																		))}
																	</MC.FormControl>
																</MC.TableCell>
															</MC.TableRow>

															<MC.TableRow>
																<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">서비스제공동의</MC.TableCell>
																<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
																	<MC.FormControl fullWidth className={classes.formControl}>
																		{cardInfo.residentInfo_data && cardInfo.residentInfo_data.prvc_polc_at === "Y" ? "동의" : "동의안함"} {cardInfo.residentInfo_data && cardInfo.residentInfo_data.prvc_polc_date ? "(동의일자 : "+cardInfo.residentInfo_data.prvc_polc_date+")" : ""}
																	</MC.FormControl>
																</MC.TableCell>
															</MC.TableRow>
														</MC.TableBody>
													</MC.Table>

													<MC.Grid item>
														<MC.Typography className={classes.h6}>
															세대구성원 정보
														</MC.Typography>
													</MC.Grid>

													<MC.Table size="medium">
														<MC.TableHead style={{backgroundColor: "#f2f2f2"}}>
															<MC.TableRow>
																<MC.TableCell align={"center"}>이름</MC.TableCell>
																<MC.TableCell align={"center"}>관계</MC.TableCell>
																<MC.TableCell align={"center"}>휴대폰번호</MC.TableCell>
																<MC.TableCell align={"center"}>구분</MC.TableCell>
																<MC.TableCell align={"center"}>소속/직책</MC.TableCell>
															</MC.TableRow>
														</MC.TableHead>
														<MC.TableBody>
															{
																cardInfo.residentUserInfo_json_array_data &&
																(
																	cardInfo.residentUserInfo_json_array_data.map((card, index) => (
																		<MC.TableRow key={index} hover>
																			<MC.TableCell align="center">{card.memb_name}</MC.TableCell>
																			<MC.TableCell align="center">{card.rltn_type_name}</MC.TableCell>
																			<MC.TableCell align="center">{PhoneHyphen(card.mbil_teln || "")}</MC.TableCell>
																			<MC.TableCell align="center">{card.memb_type_name}</MC.TableCell>
																			<MC.TableCell align="center">{card.work_type&&card.work_type==='NONE'?'없음':card.work_type}</MC.TableCell>
																		</MC.TableRow>
																	))
																)}
														</MC.TableBody>
													</MC.Table>
													{/* 테이블컨테이너 끝 */}
												</MC.TableContainer>
												{/*	세대구성원 테이블 끝 */}

												<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", marginTop: 40 }}>
													<ResidentCardEditModal
														open={open}
														setOpen={setOpen}
														getResidentCard={getResidentCard}
														handleClose={handleClose}
														alertOpens={alertOpens}
														setAlertOpens={setAlertOpens}
														handleAlertToggle={handleAlertToggle}
														cardInfo={cardInfo}
														setCardInfo={setCardInfo}
														relationship={relationship}
														isEdit={isEdit}
														isMobile={isMobile}
													/>
													<MC.Button
														size="large"
														disableElevation
														onClick={handleOpen}
														style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
													>
														{
															isEdit ? "수정하기" : "등록하기"
														}
													</MC.Button>
												</MC.Grid>
											</PerfectScrollbar>
										</MC.CardContent>
									</MC.Card>
								) : (
									<MC.Table size="medium">
										<MC.TableBody>
											<MC.TableRow>
												<MC.TableCell colSpan={7} align="center" style={{paddingBottom:50}}>
													등록된 입주자카드 정보가 없습니다.
													<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", marginTop: 40 }}>
														<ResidentCardEditModal
															open={open}
															setOpen={setOpen}
															getResidentCard={getResidentCard}
															handleClose={handleClose}
															alertOpens={alertOpens}
															setAlertOpens={setAlertOpens}
															handleAlertToggle={handleAlertToggle}
															cardInfo={cardInfo}
															setCardInfo={setCardInfo}
															relationship={relationship}
															isEdit={isEdit}
															isMobile={isMobile}
														/>
														<MC.Button
															size="large"
															disableElevation
															onClick={handleOpen}
															style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
														>
															작성하기
														</MC.Button>
													</MC.Grid>
												</MC.TableCell>
											</MC.TableRow>
										</MC.TableBody>
									</MC.Table>
								) : null }
					</TabPanel>
				</MC.Grid>
			</MC.Grid>
		</div>
	);
};

export default ResidentCard;
