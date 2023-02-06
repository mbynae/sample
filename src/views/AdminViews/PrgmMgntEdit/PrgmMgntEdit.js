import React, { useState, useEffect }                                   from "react";
import * as MC                                                          from "@material-ui/core";
import * as MS                                                          from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog }                            from "../../../components";
import {PrgmMgntEditForm, SeatModal, TicketRegisterModal, DetInfoModal} from "./components";
import { inject, observer }                                             from "mobx-react";
import palette                                                          from "../../../theme/adminTheme/palette";
import moment                                      from "moment";
import { prgmMgntRepository } from "../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root: {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	paper:             {
		padding: theme.spacing(2)
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
}));

const PrgmMgntEdit = props => {

	const classes = useStyles();
	const { SignInStore, AptComplexStore, match, history } = props;
	const { prgmNumb } = match.params;
	const [rootUrl, setRootUrl] = useState("");
	const [prgmName, setPrgmName] = useState(""); // 상품명
	const [isEdit, setIsEdit] = useState(false);
	const [detInfoModal, setDetInfoModal] = useState(false);
	const [seatModal, setSeatModal] = useState(false);
	const [ticketModal, setTicketModal] = useState(false);
	// const [pymtCheck, setPymtCheck] = useState("N");
	// const [rsvtCheck, setRsvtCheck] = useState("N");
	const [imgAttachFile, setImgAttachFile] = useState(false);
	const [fileAttachFile, setFileAttachFile] = useState(false);
	const [errors, setErrors] = useState({
		fclt_name: false,
		prgm_name: false,
		prts_prgm_numb: false,
		prtm_clss: false,
		prgm_end_date: false,
		prgm_strt_date: false,
		prgm_end_time: false,
		prgm_strt_time: false,
		min_cnt: false,
		max_cnt: false,
		term_code: false,
		max_term_code: false,
		rsvt_info: false,
		pymt_info: false,
		use_amt: false,
		cnt_chck: false
	});

	const [programInfo, setProgramInfo] = useState({});
	const [seatInfo, setSeatInfo] = useState({});
	const [lectureInfo, setLectureInfo] = useState({});

	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "시설/강좌관리",
			href: `${rootUrl}/dashboard`
		},
		{
			title: "상품설정",
			href: `${rootUrl}/prgmMgnt`
		},
		{
			title: `상품${prgmNumb ? "수정" : "등록"}`,
			href: `${rootUrl}/prgmMgnt/register`
		},
	]);

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});

	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};

	const showDetInfoModal = () => setDetInfoModal(true);																														// 상세정보 모달 보여주기
	const hideDetInfoModal = () => setDetInfoModal(false);																													// 상세정보 모달 숨기기
	const showSeatModal = () => setSeatModal(true);																																	// 좌석모달 보여주기
	const hideSeatModal = () => setSeatModal(false);																																// 좌석모달 숨기기
	const showTicketModal = () => setTicketModal(true);																															// 이용권 모달 보여주기
	const hideTicketModal = () => setTicketModal(false);																														// 이용권 모달 숨기기

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			if(prgmNumb) {
				setIsEdit(true);
				await getPrgmDetl();
				await getPrgmSeat();
				await getPrgmLecture();
			} else {
				dataBinding(undefined);
			}
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const getPrgmDetl = async() => {
		await prgmMgntRepository.getPrgmDetl(prgmNumb)
			.then(result => {
				dataBinding(result.data_json_array[0]);
			});
	};

	const getPrgmSeat = async() => {
		await prgmMgntRepository.getPrgmSeat(prgmNumb)
			.then(result => {
				// console.log(result)
				seatData(result);
			});
	};

	const getPrgmLecture = async() => {
		await prgmMgntRepository.getPrgmLecture(prgmNumb)
			.then(result => {
				// console.log(result)
				lectureData(result);
			});
	};

	// console.log(seatInfo)
	// console.log(lectureInfo)

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const dataBinding = (obj) => {
		setProgramInfo(prev => {
			return {
				...prev,
				fclt_code: obj ? obj.fclt_code : "", // 대분류
				fclt_numb: obj ? obj.fclt_numb : "", // 중분류
				fclt_name: obj ? obj.fclt_code+"/"+obj.fclt_numb : "",
				prgm_name: obj ? obj.prgm_name : "", // 상품명
				program_son: obj ? obj.prts_prgm_numb : "",
				program_son_chck: obj ? obj.prgm_numb === obj.prts_prgm_numb ? "Y" : "N" : "N",
				prts_prgm_numb: obj ? obj.prts_prgm_numb !== "" ? obj.prts_prgm_numb : obj.prgm_numb : "",
				prtm_clss: obj ? obj.prtm_clss : 0, // 이용권유형
				dayw_clss_info: obj ? obj.dayw_clss_info : "", // 요일
				prgm_strt_date: obj ? obj.prgm_strt_date : dateInit(true), // 시작일
				prgm_end_date: obj ? obj.prgm_end_date : dateInit(false), // 종료일
				prgm_strt_time: obj ? obj.prgm_strt_time : "00:00:00", // 시작시간
				prgm_end_time: obj ? obj.prgm_end_time : "23:59:59", //  종료시간
				gend_clss: obj ? obj.gend_clss : "N", // 성별
				max_cnt: obj ? obj.max_cnt : "", // 최대인원
				totl_cnt: obj ? obj.totl_cnt : "",
				recp_cnt: obj ? obj.recp_cnt : "",
				min_cnt: obj ? obj.min_cnt : "", // 최소인원
				term_code: obj ? obj.term_code : "2001", // 최소운영시간
				max_term_code: obj ? obj.max_term_code : "2001", // 최대운영시간
				rsvt_info: obj ? obj.rsvt_info : [""], // 예약방법
				pymt_info: obj ? obj.pymt_info : [""], // 결제구분
				use_amt: obj ? obj.use_amt : "", // 가격
				cnt_chck: obj ? obj.cnt_chck : 0, // 1일 입실제한,
				inst_numb: obj ? obj.inst_numb : "", // 강사선택,
				schd_numb: obj? obj.schd_numb : "", // 신청기간
			};
		});
	};

	const seatData = (obj) => {
		setSeatInfo(prev => {
			return {
				...prev,
				detl_name: obj.detllist && obj.detllist[0] ? obj.detllist[0].detl_name : "", // 좌석명
				user_cnt: obj.detllist && obj.detllist[0] ? obj.detllist[0].detl_numb : "", // 시작번호
				add_cnt: obj.detllist && obj.detllist[obj.detllist.length -1] ? obj.detllist[obj.detllist.length -1].detl_numb : "", // 종료번호
				img: obj && obj.img ? obj.img.fileInfo : "", // 배치도 이미지 업로드
			}
		})
	};

	const lectureData = (obj) => {
		setLectureInfo(prev => {
			return {
				...prev,
				cnts_info: obj.detlinfo ? obj.detlinfo.cnts_info : "", // 강의안내
				cnts_memo: obj.detlinfo ? obj.detlinfo.cnts_memo : "", // 준비물
				file: obj.fileinfo ? obj.fileinfo.fileInfo : "", // 강의 계획서 업로드
			}
		})
	};

	const getDate = (date, isFrom) => moment(date).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}
		return date;
	};

	const handleGoBack = () => {
		history.goBack();
	};

	const savePrgm = () => {
		let params = {
			fclt_code: programInfo.fclt_code, // 대분류
			fclt_numb: programInfo.fclt_numb, // 중분류
			prgm_name: prgmName,
			prts_prgm_numb: programInfo.prts_prgm_numb,
			prtm_clss: programInfo.prtm_clss,
			dayw_clss_info: programInfo.dayw_clss_info,
			prgm_end_date: programInfo.prgm_end_date,
			prgm_strt_date: programInfo.prgm_strt_date,
			prgm_end_time: programInfo.prgm_end_time,
			prgm_strt_time: programInfo.prgm_strt_time,
			gend_clss: programInfo.gend_clss,
			max_cnt: programInfo.max_cnt,
			totl_cnt: programInfo.totl_cnt,
			recp_cnt: programInfo.recp_cnt,
			min_cnt: programInfo.min_cnt,
			term_code: programInfo.term_code,
			max_term_code: programInfo.max_term_code,
			rsvt_info: programInfo.rsvt_info,
			pymt_info: programInfo.pymt_info,
			use_amt: programInfo.use_amt,
			cnt_chck: programInfo.cnt_chck,
		}
		prgmMgntRepository.prgmmstrInsert(params).then(result => {
			handleAlertToggle(
				"isOpen",
				"상품 등록",
				"상품등록을 완료하였습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/prgmMgnt`);
				},
				undefined
			);
		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n" + "errorcode: " + e.errorcode,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				},
				undefined
			);
		})
	}

	const updatePrgm = () => {
		let params = {
			fclt_code: programInfo.fclt_code, // 대분류
			fclt_numb: programInfo.fclt_numb, // 중분류
			prgm_name: prgmName,
			prts_prgm_numb: programInfo.prts_prgm_numb,
			prtm_clss: programInfo.prtm_clss,
			dayw_clss_info: programInfo.dayw_clss_info,
			prgm_end_date: programInfo.prgm_end_date,
			prgm_strt_date: programInfo.prgm_strt_date,
			prgm_end_time: programInfo.prgm_end_time,
			prgm_strt_time: programInfo.prgm_strt_time,
			gend_clss: programInfo.gend_clss,
			max_cnt: programInfo.max_cnt,
			totl_cnt: programInfo.totl_cnt,
			recp_cnt: programInfo.recp_cnt,
			min_cnt: programInfo.min_cnt,
			term_code: programInfo.term_code,
			max_term_code: programInfo.max_term_code,
			rsvt_info: programInfo.rsvt_info,
			pymt_info: programInfo.pymt_info,
			use_amt: programInfo.use_amt,
			cnt_chck: programInfo.cnt_chck,
			inst_numb: programInfo.inst_numb,
			schd_numb: programInfo.schd_numb,
		}

		let seatParams = {
			detl_name: seatInfo.detl_name,
			user_cnt: seatInfo.user_cnt,
			add_cnt: seatInfo.add_cnt,
			// img: seatInfo.img === null ? null : seatInfo.img.imag_seq
		}

		let lectureParams = {
			cnts_info: lectureInfo.cnts_info,
			cnts_memo: lectureInfo.cnts_memo,
			// file: lectureInfo.file === null ? null : lectureInfo.file.imag_seq
		}

		if(programInfo.program_son==="" || programInfo.program_son_chck==="Y") {
			if(seatInfo.detl_name !== null && seatInfo.user_cnt !== undefined && seatInfo.add_cnt !== undefined){
				prgmMgntRepository.prgmSeat(seatParams, prgmNumb, imgAttachFile).then(result => {})
			}
			if(lectureInfo.cnts_info !== undefined && lectureInfo.cnts_memo !== null){
				prgmMgntRepository.prgmLecture(lectureParams, prgmNumb, fileAttachFile).then(result => {})
			}
		}

		prgmMgntRepository.prgmmstrUpdate(params, prgmNumb).then(result => {
			handleAlertToggle(
				"isOpen",
				"상품 수정",
				"상품수정을 완료하였습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/prgmMgnt`);
				},
				undefined
			);
		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n" + "errorcode: " + e.errorcode,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				},
				undefined
			);
		})
	}

	const handleEdit = () => {
		if(!(programInfo.fclt_name === "" || programInfo.prtm_clss === "" || programInfo.prts_prgm_numb === ""
			|| errors.min_cnt === true || errors.max_cnt === true || programInfo.max_cnt === "" || programInfo.min_cnt === ""
			|| programInfo.prtm_clss === "" || programInfo.rsvt_info === "" || programInfo.use_amt === "" || errors.user_cnt === true || errors.add_cnt === true
			|| errors.prgm_strt_time === true	|| errors.prgm_end_time === true || errors.term_code === true || errors.max_term_code === true
			|| errors.prgm_end_date === true || errors.prgm_strt_date === true)) {
				// if(rsvtCheck === 'Y' && pymtCheck === 'Y'){
					if ( isEdit) {
						// 수정
						updatePrgm();
					} else {
						savePrgm();
					}
				// }
		} else {
			setErrors(prev => {
				return {
					...prev,
					fclt_name: programInfo.fclt_name === "",
					prtm_clss: programInfo.prtm_clss === "",
					prts_prgm_numb: programInfo.prts_prgm_numb === "",
					cnt_chck: programInfo.cnt_chck === "",
					rsvt_info: programInfo.rsvt_info === "",
					pymt_info: programInfo.pymt_info === "",
					use_amt: programInfo.use_amt === "",
				};
			});
			if(programInfo.min_cnt < programInfo.max_cnt && programInfo.min_cnt !== "" && programInfo.max_cnt !== ""){
				setErrors(prev => {
					return {
						...prev,
						max_cnt: false,
						min_cnt: false,
					};
				});
			} else {
				setErrors(prev => {
					return {
						...prev,
						max_cnt: true,
						min_cnt: true,
					};
				});
			}
			if(programInfo.prgm_end_date < programInfo.prgm_strt_date || programInfo.prgm_strt_date === "" || programInfo.prgm_end_date === ""){
				setErrors(prev => {
					return {
						...prev,
						prgm_end_date: true,
						prgm_strt_date: true,
					};
				});
			} else {
				setErrors(prev => {
					return {
						...prev,
						prgm_end_date: false,
						prgm_strt_date: false,
					};
				});
			}
		}
	};

	return (
		<div className={classes.root}>
			{/* 상단 gnb 시작 */}
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs}/>

				<MC.Grid className={classes.content}>
					<MC.Typography variant="h2" gutterBottom>
						상품 &nbsp;
						{
							isEdit ? "수정" : "등록"
						}
					</MC.Typography>
					<MC.Divider className={classes.divider} />

					<MC.Paper elevation={2} className={classes.paper}>
						<MC.Grid
							container
							spacing={2}
							justify={"space-between"}
							alignItems={"flex-start"}>

							<MC.Grid item xs={12} md={12}>
								<PrgmMgntEditForm
									isEdit={isEdit}
									AptComplexStore={AptComplexStore}
									getDate={getDate}
									showDetInfoModal={showDetInfoModal}
									showSeatModal={showSeatModal}
									showTicketModal={showTicketModal}
									errors={errors}
									setErrors={setErrors}
									programInfo={programInfo}
									setProgramInfo={setProgramInfo}
									dateInit={dateInit}
									prgmName={prgmName}
									setPrgmName={setPrgmName}
									// pymtCheck={pymtCheck}
									// setPymtCheck={setPymtCheck}
									// rsvtCheck={rsvtCheck}
									// setRsvtCheck={setRsvtCheck}
								/>
							</MC.Grid>
							<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
								<MC.ButtonGroup
									aria-label="text primary button group"
									size="large"
									style={{ marginTop: 12 }}
									color="primary">
									<MC.Button
										style={{
											color:                  palette.error.main,
											borderColor:            palette.error.main,
											marginLeft:             10,
											borderTopLeftRadius:    4,
											borderBottomLeftRadius: 4
										}}
										onClick={handleGoBack}>
										취소
									</MC.Button>
									<MC.Button
										variant="outlined"
										color="primary"
										onClick={handleEdit}>
										{
											isEdit ? "수정" : "등록"
										}
									</MC.Button>
								</MC.ButtonGroup>
							</MC.Grid>
						</MC.Grid>
					</MC.Paper>
				</MC.Grid>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>

			<SeatModal
				open={seatModal}
				hideModal={hideSeatModal}
				errors={errors}
				setErrors={setErrors}
				seatInfo={seatInfo}
				setSeatInfo={setSeatInfo}
				imgAttachFile={imgAttachFile}
				setImgAttachFile={setImgAttachFile}
			/>

			<DetInfoModal
				open={detInfoModal}
				hideModal={hideDetInfoModal}
				errors={errors}
				setErrors={setErrors}
				lectureInfo={lectureInfo}
				setLectureInfo={setLectureInfo}
				fileAttachFile={fileAttachFile}
				setFileAttachFile={setFileAttachFile}
			/>

			<TicketRegisterModal
				open={ticketModal}
				hideModal={hideTicketModal}
			/>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(PrgmMgntEdit));
