import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { residentCardRepository, userMgntRepository }     from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog, PhoneHyphen } from "../../../components";

import { ResidentCardEditModal, UserMgntDetailForm }      from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	content:           {
		marginTop: theme.spacing(2)
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
	errorButton:       {
		color:                  theme.palette.error.main,
		borderColor:            theme.palette.error.main,
		marginLeft:             10,
		borderTopLeftRadius:    4,
		borderBottomLeftRadius: 4
	},
	cardHeader:               {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
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
		margin:       theme.spacing(1)
	},
}));

const UserMgntDetail = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	const [tutorInfo, setTutorInfo] = useState({});
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [errors, setErrors] = useState({
		inst_name: false,
		inst_teln: false,
	});
	const [menuKey] = useState("userMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `입주민 관리`,
			href:  `${rootUrl}/userMgnt`
		},
		{
			title: `입주민 관리 상세`,
			href:  `${rootUrl}/userMgnt${id ? "/" + id : ""}`
		}
	]);
	const [cardInfoAdmin, setCardInfoAdmin] = useState({});
	const [loading, setLoading] = useState(true);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	const [delCarList, setDelCarList] = useState([]);
	const [delMemList, setDelMemList] = useState([]);
	const [carList, setCarList] = useState([]);    // 차량정보 관리 state
	const [memberList, setMemberList] = useState([]);
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

	// 입주민 정보
	const [userMgnt, setUserMgnt] = useState({});
	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getMembNumb();
			await getRelationTypeList();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [])

	// 멤버 가져오기
	const [membNumb, setMembNumb] = useState("");
	const getMembNumb = () => {
		residentCardRepository.getMembNumb(id, false)
			.then(numb => {
				setMembNumb(numb.memb_numb);
				residentCardRepository.getResidentCardAdmin(numb.memb_numb, false)
					.then(info => {
						setCardInfoAdmin(info);

						if (info.residentUserInfo_json_array_data_size > 0) {
							setIsEdit(true);
							setCarList(info.residentInfo_data?.carlist)
							setMemberList(info.residentUserInfo_json_array_data)
					}})
			})
	}

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			let rootUrl = generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `입주민 관리`,
						href:  `${rootUrl}/userMgnt`
					},
					{
						title: `입주민 관리 상세`,
						href:  `${rootUrl}/userMgnt${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getUserMgnt(id);
			}
		};

		setTimeout(() => {
			init();
		});
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	// 입주민 타입
	const [houseHoldType, setHouseHoldType] = useState("");
	const getUserMgnt = async (id) => {
		userMgntRepository
			.getUserMgnt(id, { aptId: AptComplexStore.aptComplex.id })
			.then(result => {
				setHouseHoldType(result.userDataType.houseHolderType)
				dataBinding(result);
				setLoading(false);
			});
	};

	const dataBinding = (obj) => {
		setUserMgnt(prev => {
			return {
				...prev,
				aptId:                  AptComplexStore.aptComplex.id,
				accountType:            obj ? obj.accountType : "",
				aptComplex:             obj ? obj.aptComplex : {},
				baseDateDataType:       obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				id:                     obj ? obj.id : "",
				name:                   obj ? obj.name : "",
				phoneNumber:            obj ? obj.phoneNumber : "",
				rankType:               obj ? obj.rankType : "",
				userDataType:           obj ? obj.userDataType : {},
				userId:                 obj ? obj.userId : "",
				autonomousOrganization: obj ? obj.autonomousOrganization : {},
				aoPosition:             obj ? obj.aoPosition : {}
			};
		});
	};

	const handleEdit = () => {
		history.push(`${rootUrl}/userMgnt/edit/${id}`);
	};

	const handleGoBack = () => {
		history.push(`${rootUrl}/userMgnt`);
	};

	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"입주민 삭제",
			"입주민에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 입주민를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				userMgntRepository
					.removeUserMgnt(id)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"입주민 정보를 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/userMgnt`);
								setAlertOpens({ ...alertOpens, isOpen: false });
							}
						);
					});
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	const handleConfirm = (obj) => {
		handleAlertToggle(
			"isConfirmOpen",
			"입주민 승인",
			"해당 계정을 승인하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				await updateResidentsType(obj);
			},
			() => {
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	const updateResidentsType = (obj) => {
		return userMgntRepository.updateUserMgnt(obj.id, {
			...obj,
			userDataType: {
				...obj.userDataType,
				residentsType: "RESIDENTS"
			}
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"승인완료",
				"계정을 승인처리 하였습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					getUserMgnt(obj.id);
				}
			);
		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n" + "errorcode: " + e.errorcode,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		})
	};

	const handleOpen = (obj, isEdit) => {
		// 에러 초기화
		setErrors(prev => {
			return {
				...prev,
				inst_name: false,
				inst_teln: false,
			}
		});
		{
			memberList ? setMemberList(memberList.filter(mem => mem.memb_type!=="C")?.map((mem, idx) =>
					({memb_numb: mem.memb_numb, memb_name: mem.memb_name, memb_type: "I", rltn_type: mem.rltn_type,	mbil_teln: mem.mbil_teln, work_type: "UP", migo_serl: mem.migo_serl})))
				: setMemberList([{memb_name: "", memb_type: "I", rltn_type: "",	mbil_teln: "", work_type: "IN"}]);  																																																																																																		// 입주민정보 관리 stat
		}
		{
			carList ? setCarList(carList.filter(car=>car.park_car_numb)?.map((car, idx) =>
					({car_numb: car.car_numb, work_type: "UP", park_car_numb: car.park_car_numb})))
				: setCarList([{car_numb: "", work_type: "IN"}]);
		}

		if(isEdit) {	// 수정
			setIsEdit(isEdit);
			setTutorInfo(prev => {
				return {
					...prev,
					inst_numb: obj.inst_numb,
					clss_code: obj.clss_code,
					inst_name: obj.inst_name,
					inst_teln: obj.inst_teln
				}
			});
			setOpen(true);
		} else {	// 등록
			setIsEdit(isEdit);
			initTutorInfo();
			setOpen(true);
		}
	}

	const handleEditOpen = () => {
		setOpen(true);
		setIsEdit(true);
		setDelCarList([]);
		setDelMemList([]);
		{
			memberList ? setMemberList(memberList.filter(mem => mem.memb_type!=="C")?.map((mem, idx) =>
					({memb_numb: mem.memb_numb, memb_name: mem.memb_name, memb_type: "I", rltn_type: mem.rltn_type,	mbil_teln: mem.mbil_teln, work_type: "UP", migo_serl: mem.migo_serl})))
			: setMemberList([{memb_name: "", memb_type: "I", rltn_type: "",	mbil_teln: "", work_type: "IN"}]);  																																																																																																		// 입주민정보 관리 stat
		}
		{
			carList ? setCarList(carList.filter(car=>car.park_car_numb)?.map((car, idx) =>
				({car_numb: car.car_numb, work_type: "UP", park_car_numb: car.park_car_numb})))
			: setCarList([{car_numb: "", work_type: "IN"}]);
		}
	}

	const initTutorInfo = () => {
		setTutorInfo(prev => {
			return {
				...prev,
				inst_numb: null,
				clss_code: "00000000",
				inst_name: "",
				inst_teln: ""
			}
		});
	}

	const handleClose = () => setOpen(false);

	const [rltnType, setRltnType] = useState("");							// 관계정보
	const [relationship, setRelationship] = useState([]);			// 모달 관계 리스트

	const getRelationTypeList = () => {
		residentCardRepository.getPrgmTypeList("C051", false)
			.then(result => {
				setRelationship(result.data_json_array)
			})
	}

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>

							<MC.Typography variant="h2" gutterBottom>
								입주민 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />

							<MC.Paper elevation={2} className={classes.paper}>

								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>

									<MC.Grid item xs={12} md={12}>
										<UserMgntDetailForm
											userMgnt={userMgnt}
											setUserMgnt={setUserMgnt} />
									</MC.Grid>

									<MC.Grid item xs={6} md={6}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											<MC.Button
												className={classes.errorButton}
												onClick={handleDelete}>
												삭제
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>

									<MC.Grid item xs={6} md={6}
													 className={classes.buttonLayoutRight}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											{
												userMgnt.userDataType.residentsType === "AWAITING_RESIDENTS" &&
												<MC.Button
													variant="outlined"
													color="primary"
													onClick={() => handleConfirm(userMgnt)}>
													승인
												</MC.Button>
											}
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleGoBack}>
												목록보기
											</MC.Button>
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleEdit}>
												수정
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>
								</MC.Grid>

								{/* 세대주이고 입주자카드 정보가 있는 경우 */}
								{/* 입주민 입주자카드 정보 시작 */}
								{houseHoldType==="HOUSEHOLD_OWNER" && cardInfoAdmin.isResidentExist===true ?
									<MC.TableContainer component={MC.Paper} style={{marginTop: "30px"}}>
										<MC.Table size={"small"}>
											<MC.TableBody>
												<MC.TableRow>
													<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">입주(예정)일</MC.TableCell>
													<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
														<MC.FormControl fullWidth className={classes.formControl}>
															{cardInfoAdmin.residentInfo_data && cardInfoAdmin.residentInfo_data.entr_date}
														</MC.FormControl>
													</MC.TableCell>
												</MC.TableRow>

												<MC.TableRow>
													<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">입주형태</MC.TableCell>
													<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
														<MC.FormControl fullWidth className={classes.formControl}>
															{cardInfoAdmin.residentInfo_data && cardInfoAdmin.residentInfo_data.rsdc_clss_name}
														</MC.FormControl>
													</MC.TableCell>
												</MC.TableRow>

												<MC.TableRow>
													<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">차량정보</MC.TableCell>
													<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
														<MC.FormControl fullWidth className={classes.formControl}>
															{cardInfoAdmin.residentInfo_data.carlist && cardInfoAdmin.residentInfo_data.carlist.map((car, index) => (
																<span key={index}>{car.car_numb}</span>
															))}
														</MC.FormControl>
													</MC.TableCell>
												</MC.TableRow>

												<MC.TableRow>
													<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">서비스제공동의</MC.TableCell>
													<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
														<MC.FormControl fullWidth className={classes.formControl}>
															{cardInfoAdmin.residentInfo_data && cardInfoAdmin.residentInfo_data.prvc_polc_at === "Y" ? "동의" : "동의안함"} {cardInfoAdmin.residentInfo_data && cardInfoAdmin.residentInfo_data.prvc_polc_date ? "(동의일자 : "+cardInfoAdmin.residentInfo_data.prvc_polc_date+")" : ""}
														</MC.FormControl>
													</MC.TableCell>
												</MC.TableRow>
											</MC.TableBody>
										</MC.Table>
									</MC.TableContainer> : null}
								{/* 입주민 입주자카드 정보 끝 */}

								{/* 세대주이고 입주자카드 정보가 있는 경우 */}
								{/* 세대구성원 정보 시작 */}
								{houseHoldType==="HOUSEHOLD_OWNER" && cardInfoAdmin.isResidentExist===true ?
									<MC.Card style={{marginTop: 50}}>
										<MC.CardHeader
											title={"세대구성원 정보"}
											classes={{
												root:  classes.cardHeader,
												title: classes.cardHeader
											}}
										/>
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
													cardInfoAdmin.residentUserInfo_json_array_data &&
													(
														cardInfoAdmin.residentUserInfo_json_array_data.map((card, index) => (
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

										<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", marginTop: 40 }}>
											<ResidentCardEditModal
												open={open}
												setOpen={setOpen}
												handleClose={handleClose}
												alertOpens={alertOpens}
												setAlertOpens={setAlertOpens}
												handleAlertToggle={handleAlertToggle}
												cardInfoAdmin={cardInfoAdmin}
												relationship={relationship}
												rltnType={rltnType}
												setRltnType={setRltnType}
												isEdit={isEdit}
												errors={errors}
												setErrors={setErrors}
												membNumb={membNumb}
												getMembNumb={getMembNumb}
												delCarList={delCarList}
												setDelCarList={setDelCarList}
												delMemList={delMemList}
												setDelMemList={setDelMemList}
												memberList={memberList}
												setMemberList={setMemberList}
												carList={carList}
												setCarList={setCarList}
											/>
											<MC.Grid item>
												<MC.ButtonGroup
													aria-label="text primary button group"
													color="primary">
													<MC.Button onClick={() => handleEditOpen()}>
														수정하기
													</MC.Button>
												</MC.ButtonGroup>
											</MC.Grid>
										</MC.Grid>

									</MC.Card>
									: null}

								{/* 세대주이고 입주자카드 정보가 없는 경우 */}
								{/* 입주자카드 정보가 없는 경우*/}
								{houseHoldType==="HOUSEHOLD_OWNER" && cardInfoAdmin.isResidentExist===false ?
									<MC.Table size="medium">
										<MC.TableBody>
											<MC.TableRow>
												<MC.TableCell colSpan={7} align="center">
													세대구성원 정보가 없습니다.
													<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", marginTop: 40 }}>
														<ResidentCardEditModal
															open={open}
															setOpen={setOpen}
															handleClose={handleClose}
															alertOpens={alertOpens}
															setAlertOpens={setAlertOpens}
															handleAlertToggle={handleAlertToggle}
															cardInfoAdmin={cardInfoAdmin}
															relationship={relationship}
															rltnType={rltnType}
															setRltnType={setRltnType}
															delCarList={delCarList}
															setDelCarList={setDelCarList}
															isEdit={isEdit}
															errors={errors}
															setErrors={setErrors}
															getMembNumb={getMembNumb}
															delMemList={delMemList}
															setDelMemList={setDelMemList}
															memberList={memberList}
															setMemberList={setMemberList}
															carList={carList}
															setCarList={setCarList}
														/>
														<MC.Grid item>
															<MC.ButtonGroup
																aria-label="text primary button group"
																color="primary">
																<MC.Button onClick={() => handleOpen(undefined, false)}>
																	구성원 정보 등록
																</MC.Button>
															</MC.ButtonGroup>
														</MC.Grid>
													</MC.Grid>
												</MC.TableCell>
											</MC.TableRow>
										</MC.TableBody>
									</MC.Table>: null}
								{/* 세대구성원 정보 끝 */}
							</MC.Paper>
						</div>
					</>
				)
			}

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

export default inject("SignInStore", "AptComplexStore")(observer(UserMgntDetail));
