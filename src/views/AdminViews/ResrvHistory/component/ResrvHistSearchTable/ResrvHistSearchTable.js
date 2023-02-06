import React, { useState } from "react";
import clsx                from "clsx";

import * as MC          from "@material-ui/core";
import * as MS          from "@material-ui/styles";
import palette          from "../../../../../theme/adminTheme/palette";
import PerfectScrollbar from "react-perfect-scrollbar";

import { AlertDialog, TablePaginationActions } from "../../../../../components";
import ResrvHistAllDelayDialog                 from "../ResrvHistAllDelayDialog";
import ResrvHistAllCancelDialog                from "../ResrvHistAllCancelDialog";
import ResrvHistAllSmsDialog                   from "../ResrvHistAllSmsDialog";
import ResrvHistAssignDialog                   from "../ResrvHistAssignDialog";

import { aptComplexRepository, resrvHistRepository } from "../../../../../repositories";
import moment                                                                from "moment";
import { inject, observer }    from "mobx-react";
import { withRouter }          from "react-router-dom";

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
	root:          {},
	content:       {
		padding: 0
	},
	inner:         {
		minWidth: 1530
	},
	nameContainer: {
		display:    "flex",
		alignItems: "center"
	},
	actions:       {
		padding:        theme.spacing(1),
		paddingLeft:    theme.spacing(2),
		paddingRight:   theme.spacing(2),
		justifyContent: "space-between"
	}
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvHistSearchTable = props => {
	// State -----------------------------------------------------------------------------------------------------------
	const classes = useStyles();

	const {
		alertOpens, setAlertOpens, handleAlertToggle, ResrvHistStore,
		className, history, menuKey, rootUrl, resrvHists, getResrvHists, pageInfo, setPageInfo, staticContext,
		renewAll, cancelAll, sendSms, cancel, modify, handOver, confirm, ...rest} = props
	const [selectedObjects, setSelectedObjects] = useState([]);                                               // 선택된 목록들 관리 state

	const [ResrvHistAllDelayDialogOpen, setResrvHistAllDelayDialogOpen] = useState(false);
	const [ResrvHistAllDelayObject, setResrvHistAllDelayObject] = useState({ });

	const [ResrvHistAllCancelDialogOpen, setResrvHistAllCancelDialogOpen] = useState(false);
	const [ResrvHistAllCancelObject, setResrvHistAllCancelObject] = useState({ });

	const [ResrvHistAllSmsDialogOpen, setResrvHistAllSmsDialogOpen] = useState(false);
	const [ResrvHistAllSmsObject, setResrvHistAllSmsObject] = useState({ });

	const [ResrvHistAssignDialogOpen, setResrvHistAssignDialogOpen] = useState(false);
	const [ResrvHistAssignObject, setResrvHistAssignObject] = useState({ });

	const [memberObject, setMemberObject] = useState({});

	const [RfndStat, setRfndStat] = useState([{}]);
	const [RefundPolicy, setRefundPolicy] = useState([{}]);
	const [RfndClss, setRfndClss] = useState([{}]);
	// Function --------------------------------------------------------------------------------------------------------

	const handleSelectAll = event => {
		let selectedList;
		event.target.checked ? selectedList = resrvHists.map(resrvHist => resrvHist) : selectedList = [];
		setSelectedObjects(selectedList);
	};

	const handleSelectOne = (event, obj) => {
		const selectedIndex = selectedObjects.indexOf(obj);
		let newSelectedObjects = [];

		if (selectedIndex === -1) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects, obj);
		} else if (selectedIndex === 0) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if (selectedIndex === selectedObjects.length -1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
		} else if ( selectedIndex > 0 ) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}

		setSelectedObjects(newSelectedObjects);
	}

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getResrvHists(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getResrvHists(0, event.target.value);
	};


	const handleButtonClick = (obj, buttonKey) => {
		// ------- 취소
		if(buttonKey == "cancel") {
			let oddArray = {
				item: [{
					"prgm_numb": obj.prgm_numb,
					"rsvt_numb": obj.rsvt_numb
				}]
			};
			if(obj.rsvt_stat=="2010" || obj.rsvt_stat=="2020"){

			handleAlertToggle(
				"isConfirmOpen",
				undefined,
				"예약을 취소 하시겠습니까?",
				async () => {
					await setAlertOpens(prev => {
						return { ...prev, isConfirmOpen: false };
					});
					const resrvHistorySearchAdmins = resrvHistRepository.getResrvDeleteUpdate(oddArray, "N");

					resrvHistorySearchAdmins.then((data) => {

						if (data.msgcode == 1) {
							oddArray = { smslist: [] };

							oddArray.smslist.push({
								send_hpno: obj.mbil_teln,
								smstype: "CANCEL_RSVT"
							});

							const resrvHistorySearchAdmins = resrvHistRepository.getResrvSmsSubmit(oddArray, "");

							resrvHistorySearchAdmins.then((data) => {
								if (data.msgcode != 1) {
									handleAlertToggle(
										"isOpen",
										undefined,
										"일괄 SMS 발송중 문제가 \n발생 되었습니다.",
										() => {
											setAlertOpens(prev => {
												return { ...prev, isOpen: false };
											});
										}
									);
								}
							});
							handleAlertToggle(
								"isOpen",
								undefined,
								"예약 취소 되었습니다.",
								() => {
									setAlertOpens(prev => {
										return { ...prev, isOpen: false };
									});
									getResrvHists(ResrvHistStore.pageInfo.page, ResrvHistStore.pageInfo.size);
								}
							);
						} else {
							handleAlertToggle(
								"isOpen",
								undefined,
								"예약 취소중 문제가 발생 되었습니다.",
								() => {
									setAlertOpens(prev => {
										return { ...prev, isOpen: false };
									});
								}
							);
						}
					}).catch(e => {
						handleAlertToggle(
							"isOpen",
							e.msg,
							e.errormsg + "\n",
							() => {
								setAlertOpens(prev => {
									return { ...prev, isOpen: false };
								});
							},
							undefined
						);
					});
				},
				() => {
					setAlertOpens(prev => {
						return { ...prev, isConfirmOpen: false };
					});
				}
			);

			}else{
				const resrvHistorySearchAdmins = resrvHistRepository.getRfndStatList("B460");

				resrvHistorySearchAdmins.then((data) => {
					const jsonVal = {
						data : data.data_json_array
					}
					setRfndStat(jsonVal.data);

					if (data.msgcode != 1) {
						handleAlertToggle(
							"isOpen",
							undefined,
							"환불 취소중 문제가 발생 되었습니다.",
							() => {
								setSelectedObjects([]); // 선택 초기화
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
							}
						);
					}
					else {
						const cmpxSearchAdmins = resrvHistRepository.getCmpxInfo();
						let cmpx_numb = "";

						cmpxSearchAdmins.then((data) => {
							if (data.msgcode != 1) {
								handleAlertToggle(
									"isOpen",
									undefined,
									"환불 취소중 문제가 발생 되었습니다.",
									() => {
										setSelectedObjects([]); // 선택 초기화
										setAlertOpens(prev => { return { ...prev, isOpen: false }; });
									}
								);
							}

							const refundPolicyList = resrvHistRepository.getRefundPolicy(cmpx_numb);
							refundPolicyList.then((data) => {
								if (data.msgcode != 1) {
									handleAlertToggle(
										"isOpen",
										undefined,
										"환불 취소중 문제가 발생 되었습니다.",
										() => {
											setSelectedObjects([]); // 선택 초기화
											setAlertOpens(prev => { return { ...prev, isOpen: false }; });
										}
									);
								}
								const jsonVal = {
									data : data.data_json_array
								}
								setRefundPolicy(jsonVal.data);

								const resrvHistorySearchAdmins = resrvHistRepository.getRfndStatList("B450");

								resrvHistorySearchAdmins.then((data) => {
									const jsonVal = {
										data : data.data_json_array
									}
									setRfndClss(jsonVal.data);

									if (data.msgcode != 1) {
										handleAlertToggle(
											"isOpen",
											undefined,
											"환불 취소중 문제가 발생 되었습니다.",
											() => {
												setSelectedObjects([]); // 선택 초기화
												setAlertOpens(prev => { return { ...prev, isOpen: false }; });
											}
										);
									}
								});
							});
						});
					}
				});

				//console.log(RfndStat);
				//console.log(RefundPolicy);

				setResrvHistAllCancelObject(obj);
				setResrvHistAllCancelDialogOpen(true);
			}

		}
		// ------- 승인
		else if(buttonKey == "confirm") {

			let oddArray = {
				approvelist: []
			};

			for (let i = 0; i < selectedObjects.length; i++) {
				if (selectedObjects[i].rsvt_stat == "2010" || selectedObjects[i].rsvt_stat == "2020") {

					oddArray.approvelist.push({
						rsvt_numb: selectedObjects[i].rsvt_numb,
						user_memb: selectedObjects[i].memb_numb
					});
				} else {
					setSelectedObjects([]); // 선택 초기화
					oddArray.approvelist = []; // 승인 보낼 리스트 초기화
					handleAlertToggle(
						"isOpen",
						undefined,
						"예약승인은 예약대기, 예약중 상태에서만 가능합니다.",
						() => {
							setAlertOpens(prev => { return { ...prev, isOpen: false }; });
						}
					);
					break;
				}
			}
			if (oddArray.approvelist.length > 0) {
				handleAlertToggle(
					"isConfirmOpen",
					undefined,
					"예약을 일괄 승인 하시겠습니까?",
					async () => {
						await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
						const resrvHistorySearchAdmins = resrvHistRepository.setRevApprovesList(oddArray);

						resrvHistorySearchAdmins.then((data) => {
							if (data.msgcode != 1) {
								handleAlertToggle(
									"isOpen",
									undefined,
									"일괄 승인중 문제가 발생 되었습니다.",
									() => {
										setSelectedObjects([]); // 선택 초기화
										oddArray.approvelist = []; // 승인 보낼 리스트 초기화
										setAlertOpens(prev => { return { ...prev, isOpen: false }; });
									}
								);
							}
							else {
								handleAlertToggle(
									"isOpen",
									undefined,
									"승인 완료 되었습니다.",
									() => {
										setSelectedObjects([]); // 선택 초기화
										oddArray.approvelist = []; // 승인 보낼 리스트 초기화
										setAlertOpens(prev => { return { ...prev, isOpen: false }; });
										getResrvHists(pageInfo.page, pageInfo.size);
									}
								);
							}
						}).catch(e => {
							handleAlertToggle(
								"isOpen",
								e.msg,
								e.errormsg + "\n",
								() => {
									setAlertOpens(prev => {
										return { ...prev, isOpen: false };
									});
								},
								undefined
							);
						});
					},
					() => {
						setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
					}
				);
			}
		}
	};

	const slice = () => (0, pageInfo.size);

	// Component -------------------------------------------------------------------------------------------------------
	const objView = (obj, index) => (
		<MC.TableRow hover key={index}>
			{/* 체크박스 시작 */}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true}
				/>
			</MC.TableCell>
			{/* 체크박스 끝 */}

			{/* 동 시작 */}
			<MC.TableCell align={"center"}>
				{obj.dong_numb}
			</MC.TableCell>
			{/* 동 끝 */}

			{/* 호 시작 */}
			<MC.TableCell align={"center"}>
				{obj.ho_numb}
			</MC.TableCell>
			{/* 호 끝 */}

			{/* 예약자명 시작 */}
			<MC.TableCell align={"center"}>
				{obj.memb_name}
			</MC.TableCell>
			{/* 예약자명 끝 */}

			{/* 예약일 시작 */}
			<MC.TableCell align={"center"}>
				{moment(obj.rsvt_dttm).format("yyyy-MM-DD")}
			</MC.TableCell>
			{/* 예약일 끝 */}

			{/* 상품명 시작 */}
			<MC.TableCell align={"center"}>
				{obj.prgm_name}
			</MC.TableCell>
			{/* 상품명 끝 */}

			{/* 타석번호 시작 */}
			<MC.TableCell align={"center"}>
				{obj.detl_numb}
			</MC.TableCell>
			{/* 타석번호 끝 */}

			{/* 예약기간 시작 */}
			<MC.TableCell align={"center"}>
				{obj.rsvt_strt_date}
				{(obj.rsvt_strt_date && obj.rsvt_end_date) && " - "}
				{obj.rsvt_end_date}
			</MC.TableCell>
			{/* 기간 끝 */}

			{/* 상태 시작 */}
			<MC.TableCell align={"center"}>
				{obj.comm_desc}
			</MC.TableCell>
			{/* 상태 끝 */}

			{/* 관리 시작 */}
			<MC.TableCell align={"center"}>
				<MC.ButtonGroup>
					<MC.Button
						disabled={obj.rsvt_stat == "2090" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" ||  obj.rsvt_stat == "2070"}
						style={{
							color: obj.rsvt_stat == "2090" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" ||  obj.rsvt_stat == "2070" ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
							borderColor: obj.rsvt_stat == "2090" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" ||  obj.rsvt_stat == "2070" ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={() => (handleButtonClick(obj, "cancel"))}>취소</MC.Button>
					<MC.Button
						disabled={obj.rsvt_stat == "2010" || obj.rsvt_stat == "2020" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" || obj.rsvt_stat == "2070" || obj.rsvt_stat == "2090"}
						style={{
							color: obj.rsvt_stat == "2010" || obj.rsvt_stat == "2020" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" || obj.rsvt_stat == "2070" || obj.rsvt_stat == "2090" ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
							borderColor: obj.rsvt_stat == "2010" || obj.rsvt_stat == "2020" || obj.rsvt_stat == "2040" || obj.rsvt_stat == "2050" || obj.rsvt_stat == "2070" || obj.rsvt_stat == "2090" ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={() => handleAssign(obj)}>양도</MC.Button>
				</MC.ButtonGroup>
			</MC.TableCell>
			{/* 관리 끝 */}
		</MC.TableRow>
	);

	// 일괄연장
	const handleAllDelay = (obj) => {

		let checkDialog = 0;

		obj.forEach((item) => {
			if (item.rsvt_stat != "2030" && item.rsvt_stat != "2060") {
				checkDialog = 1;
				handleAlertToggle(
					"isOpen",
					undefined,
					"예약완료 및 예약연장인 상태만 연장 하실 수 있습니다.",
					() => {
						setAlertOpens(prev => { return { ...prev, isOpen: false }; });
					}
				);
				return false;
			}
		});

		if (checkDialog == 0) {
			setResrvHistAllDelayObject(obj);
			setResrvHistAllDelayDialogOpen(true);
		}
	};

	const handleDelayClickClose = () => {
		setResrvHistAllDelayDialogOpen(false);
	};

	// 환불취소
	const handleAllCancel = (obj) => {
		console.log(obj);
		let checkDialog = 0;
		obj.forEach((item) => {
			if (item.rsvt_stat == "2090") {
				checkDialog = 1;
				handleAlertToggle(
					"isOpen",
					undefined,
					"이미 취소된 항목이 포함되어 취소할 수 없습니다.",
					() => {
						setAlertOpens(prev => { return { ...prev, isOpen: false }; });
					}
				);
				return false;
			}
		});

		let oddArray = {item:[]}
		obj.forEach((item) => {
			if (item.rsvt_stat == "2010" || item.rsvt_stat == "2020") {
				checkDialog = 1;

				oddArray.item.push({
					"prgm_numb": item.prgm_numb,
					"rsvt_numb": item.rsvt_numb
				});

				handleAlertToggle(
					"isConfirmOpen",
					undefined,
					"예약을 취소 하시겠습니까?",
					async () => {
						await setAlertOpens(prev => {
							return { ...prev, isConfirmOpen: false };
						});
						const resrvHistorySearchAdmins = resrvHistRepository.getResrvDeleteUpdate(oddArray, "N");

						resrvHistorySearchAdmins.then((data) => {

							if (data.msgcode == 1) {
								oddArray = { smslist: [] };

								oddArray.smslist.push({
									send_hpno: obj.mbil_teln,
									smstype: "CANCEL_RSVT"
								});

								const resrvHistorySearchAdmins = resrvHistRepository.getResrvSmsSubmit(oddArray, "");

								resrvHistorySearchAdmins.then((data) => {
									if (data.msgcode != 1) {
										handleAlertToggle(
											"isOpen",
											undefined,
											"일괄 SMS 발송중 문제가 \n발생 되었습니다.",
											() => {
												setAlertOpens(prev => {
													return { ...prev, isOpen: false };
												});
											}
										);
									}
								});
								handleAlertToggle(
									"isOpen",
									undefined,
									"예약 취소 되었습니다.",
									() => {
										setAlertOpens(prev => {
											return { ...prev, isOpen: false };
										});
										getResrvHists(ResrvHistStore.pageInfo.page, ResrvHistStore.pageInfo.size);
									}
								);
							} else {
								handleAlertToggle(
									"isOpen",
									undefined,
									"예약 취소중 문제가 발생 되었습니다.",
									() => {
										setAlertOpens(prev => {
											return { ...prev, isOpen: false };
										});
									}
								);
							}
						}).catch(e => {
							handleAlertToggle(
								"isOpen",
								e.msg,
								e.errormsg + "\n",
								() => {
									setAlertOpens(prev => {
										return { ...prev, isOpen: false };
									});
								},
								undefined
							);
						});
					},
					() => {
						setAlertOpens(prev => {
							return { ...prev, isConfirmOpen: false };
						});
					}
				);
				setSelectedObjects([]); // 선택 초기화
				return false;
			}
		});

		if (checkDialog == 0) {
			const resrvHistorySearchAdmins = resrvHistRepository.getRfndStatList("B460");

			resrvHistorySearchAdmins.then((data) => {
				const jsonVal = {
					data : data.data_json_array
				}
				setRfndStat(jsonVal.data);

				if (data.msgcode != 1) {
					handleAlertToggle(
						"isOpen",
						undefined,
						"환불 취소중 문제가 발생 되었습니다.",
						() => {
							setSelectedObjects([]); // 선택 초기화
							setAlertOpens(prev => { return { ...prev, isOpen: false }; });
						}
					);
				}
				else {
					const cmpxSearchAdmins = resrvHistRepository.getCmpxInfo();
					let cmpx_numb = "";

					cmpxSearchAdmins.then((data) => {
						if (data.msgcode != 1) {
							handleAlertToggle(
								"isOpen",
								undefined,
								"환불 취소중 문제가 발생 되었습니다.",
								() => {
									setSelectedObjects([]); // 선택 초기화
									setAlertOpens(prev => { return { ...prev, isOpen: false }; });
								}
							);
						}

						const refundPolicyList = resrvHistRepository.getRefundPolicy(cmpx_numb);
						refundPolicyList.then((data) => {
							if (data.msgcode != 1) {
								handleAlertToggle(
									"isOpen",
									undefined,
									"환불 취소중 문제가 발생 되었습니다.",
									() => {
										setSelectedObjects([]); // 선택 초기화
										setAlertOpens(prev => { return { ...prev, isOpen: false }; });
									}
								);
							}
							const jsonVal = {
								data : data.data_json_array
							}
							setRefundPolicy(jsonVal.data);

							const resrvHistorySearchAdmins = resrvHistRepository.getRfndStatList("B450");

							resrvHistorySearchAdmins.then((data) => {
								const jsonVal = {
									data : data.data_json_array
								}
								setRfndClss(jsonVal.data);

								if (data.msgcode != 1) {
									handleAlertToggle(
										"isOpen",
										undefined,
										"환불 취소중 문제가 발생 되었습니다.",
										() => {
											setSelectedObjects([]); // 선택 초기화
											setAlertOpens(prev => { return { ...prev, isOpen: false }; });
										}
									);
								}
							});
						});
					});
				}
			});

			//console.log(RfndStat);
			//console.log(RefundPolicy);

			setResrvHistAllCancelObject(obj);
			setResrvHistAllCancelDialogOpen(true);
		}
	};

	const handleAllCancelClose = () => {
		setResrvHistAllCancelDialogOpen(false);
	};

	// 문자발송
	const handleAllSmsSubmit = (obj) => {
		setResrvHistAllSmsObject(obj);
		setResrvHistAllSmsDialogOpen(true);
	};

	const handleAllSmsSubmitClose = () => {
		setResrvHistAllSmsDialogOpen(false);
	};

	// 양도
	const handleAssign = (obj) => {
		setResrvHistAssignObject(obj);
		setResrvHistAssignDialogOpen(true);
	};

	const handleAssignClose = () => {
		setResrvHistAssignDialogOpen(false);
		setMemberObject({}); // 선택된 멤버 초기화
	};

	// DOM -------------------------------------------------------------------------------------------------------------
	return (
		<div className={classes.root}>
			<MC.Card
				{...rest}
				className={clsx(classes.root, className)}
			>
				<MC.CardHeader
					title={"예약내역 목록"}
					subheader={
						<>
							총 {pageInfo.total} 건
						</>
					}
					titleTypographyProps={{ variant: "h4" }}
					action={
						<MC.ButtonGroup
							aria-label="text primary button group"
							style={{ marginTop: 12 }}
						>
							{/* ===================== 일괄연장 버튼 시작 ===================== */}
							<MC.Button
								disabled={selectedObjects.length === 0}
								style={{
									color: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
									borderColor: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
									marginLeft: 10,
									borderTopLeftRadius: 4,
									borderBottomLeftRadius: 4
								}}
								onClick={() => (handleAllDelay(selectedObjects))}
							>
								일괄연장
							</MC.Button>
							{/* ===================== 일관연장 버튼 끝 ===================== */}

							{/* ===================== 일괄취소 버튼 시작 ===================== */}
							<MC.Button
								disabled={selectedObjects.length === 0}
								style={{
									color: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
									borderColor: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
									marginLeft: 10,
									borderTopLeftRadius: 4,
									borderBottomLeftRadius: 4
								}}
								onClick={() => (handleAllCancel(selectedObjects))}
							>
								환불취소
							</MC.Button>
							{/* ===================== 일괄취소 버튼 끝 ===================== */}

							{/* ===================== 일괄 문자발송 버튼 시작 ===================== */}
							<MC.Button
								disabled={selectedObjects.length === 0}
								style={{
									color: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
									borderColor: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
									marginLeft: 10,
									borderTopLeftRadius: 4,
									borderBottomLeftRadius: 4
								}}
								onClick={() => (handleAllSmsSubmit(selectedObjects))}
							>
								문자발송
							</MC.Button>
							{/* ===================== 일괄 문자발송 버튼 끝 ===================== */}
						</MC.ButtonGroup>
					}
				/>

				<MC.Divider/>

				<MC.CardContent className={classes.content}>
					<PerfectScrollbar>
						<div className={classes.inner}>
							<MC.Table size="small">
								{/* 테이블 헤더 시작 */}
								<MC.TableHead>
									<MC.TableRow>
										<MC.TableCell align={"center"} padding={"checkbox"}>
											<MC.Checkbox
												checked={
													resrvHists ?
														(resrvHists.length === 0 ? false : selectedObjects.length === resrvHists.length) : false
												}
												color={"primary"}
												indeterminate={
													selectedObjects.length > 0
													&& selectedObjects.length < (resrvHists ? resrvHists.length : 10)
												}
												onChange={handleSelectAll}
											/>
										</MC.TableCell>
										<MC.TableCell align={"center"}>동</MC.TableCell>
										<MC.TableCell align={"center"}>호</MC.TableCell>
										<MC.TableCell align={"center"}>예약자명</MC.TableCell>
										<MC.TableCell align={"center"}>예약일</MC.TableCell>
										<MC.TableCell align={"center"}>상품명</MC.TableCell>
										<MC.TableCell align={"center"}>좌석</MC.TableCell>
										<MC.TableCell align={"center"}>예약기간</MC.TableCell>
										<MC.TableCell align={"center"}>상태</MC.TableCell>
										<MC.TableCell align={"center"}>관리</MC.TableCell>
									</MC.TableRow>
								</MC.TableHead>
								{/* 테이블 헤더 끝 */}

								{/* 테이블 바디 시작 */}
								<MC.TableBody>
									{
										resrvHists ?
											(
												resrvHists.length === 0 ?
													<MC.TableRow hover>
														<MC.TableCell colSpan={9} align="center">
															조회된 예약 데이터가 한 건도 없네요.
														</MC.TableCell>
													</MC.TableRow>
													:
													resrvHists.slice(slice).map((item, index) => objView(item, index))
											)
											:
											<MC.TableRow hover>
												<MC.TableCell colSpan={9} align="center">
													<MC.CircularProgress color="secondary"/>
												</MC.TableCell>
											</MC.TableRow>
									}
								</MC.TableBody>
								{/* 테이블 바디 끝 */}
							</MC.Table>
						</div>
					</PerfectScrollbar>
				</MC.CardContent>
				<MC.Divider/>
				<MC.CardActions className={classes.actions}>
					<MC.Grid container justify={"space-between"} alignItems={"center"}>
						<MC.Grid item>
							<MC.ButtonGroup>
								<MC.Button
									disabled={selectedObjects.length === 0}
									style={{
										color: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
										borderColor: selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.primary.main,
										marginLeft: 10,
										borderTopLeftRadius: 4,
										borderBottomLeftRadius: 4
									}}
									onClick={() => (handleButtonClick(resrvHists, "confirm"))}>승인
								</MC.Button>
							</MC.ButtonGroup>
						</MC.Grid>
						<MC.Grid item>
							<MC.TablePagination
								component="div"
								count={pageInfo.total}
								labelDisplayedRows={({
																			 from,
																			 to,
																			 count
																		 }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
								labelRowsPerPage={"페이지당 목록 수 : "}
								onChangePage={handlePageChange}
								onChangeRowsPerPage={handleRowsPerPageChange}
								ActionsComponent={TablePaginationActions}
								page={pageInfo.page}
								rowsPerPage={pageInfo.size}
								rowsPerPageOptions={[10, 15, 30, 50, 100]}
							/>
						</MC.Grid>
					</MC.Grid>
				</MC.CardActions>
			</MC.Card>
			<ResrvHistAllDelayDialog
				open={ResrvHistAllDelayDialogOpen}
				delayObject={ResrvHistAllDelayObject}
				setDelayObject={setResrvHistAllDelayObject}
				onClose={handleDelayClickClose}
				ResrvHistStore={ResrvHistStore}
				getResrvHists={getResrvHists}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
			/>
			<ResrvHistAllCancelDialog
				open={ResrvHistAllCancelDialogOpen}
				cancelObject={ResrvHistAllCancelObject}
				setCancelObject={setResrvHistAllCancelObject}
				onClose={handleAllCancelClose}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				ResrvHistStore={ResrvHistStore}
				getResrvHists={getResrvHists}
				RfndStat={RfndStat}
				RefundPolicy={RefundPolicy}
				RfndClss={RfndClss}
			/>
			<ResrvHistAllSmsDialog
				open={ResrvHistAllSmsDialogOpen}
				DelayObject={ResrvHistAllSmsObject}
				onClose={handleAllSmsSubmitClose}
			/>
			<ResrvHistAssignDialog
				open={ResrvHistAssignDialogOpen}
				selectedObject={ResrvHistAssignObject}
				ResrvHistStore={ResrvHistStore}
				getResrvHists={getResrvHists}
				onClose={handleAssignClose}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				setMemberObject={setMemberObject}
				memberObject={memberObject}
			/>
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
		</div>
	);
};

export default inject("ResrvHistStore")(withRouter(observer(ResrvHistSearchTable)));
