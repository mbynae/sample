import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import palette                                                                  from "../../../theme/adminTheme/palette";
import { visitingCarMgntRepository, commonCodeRepository, resrvHistRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                                    from "../../../components";
import { VisitingCarEditForm }            from "./components";

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
	}
}));

const VisitingCarEdit = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("visitingCar");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `방문차량예약 관리`,
			href:  `${rootUrl}/visitingCar`
		},
		{
			title: `방문차량예약 관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/visitingCar/edit${id ? "/" + id : ""}`
		}
	]);

	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false); // 등록 or 수정 Flag

	//-------------------NOT USE--------------------//
	// 등록 시 차량 번호 검색 모달 Open State, 함수
	// const [findingCarModal, setFindingCarModal] = useState(false);
	// const showFindingCarModal = () => setFindingCarModal(true); // 모달 Open
	// const hideFindingCarModal = () => {
	// 	// 입력 필드 초기화
	// 	setSearchInfo({
	// 		...searchInfo,
	// 		dong_numb : "",
	// 		ho_numb : "",
	// 		car_numb : ""
	// 	});
	//
	// 	setShowSearchedTable(false)
	// 	setFindingCarModal(false)
	// }; // 모달 Close
	// const [showSearchedTable, setShowSearchedTable] = useState(false); // 모달 내부 테이블 표시 여부
	// 모달 내부 검색 Field
	// const [searchInfo, setSearchInfo] = useState({
	// 	dong_numb : "",
	// 	ho_numb : "",
	// 	car_numb : "",
	// 	strt_date : "2020-01-01 00:00:00",
	// 	end_date : "2099-12-31 23:59:59"
	// });

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

	// 방문차량예약 관리 정보
	const [visitingCar, setVisitingCar] = useState({});
	const [errors, setErrors] = useState({
		park_use_clss:  false,
		park_use_stat:  false,
		park_cycl_code: false,
		vist_code: false,

		// 등록 시에만
		dong_numb: false,
		ho_numb: false,
		car_numb: false
	});

	// 등록/수정 화면 Dropdown 설정
	const [parkUseClssList, setParkUseClssList] = useState([]);
	const [parkUseStatList, setParkUseStatList] = useState([]);
	const [parkCyclCodeList, setParkCyclCodeList] = useState([]);
	const [vistCodeList, setVistCodeList] = useState([]);
	const [dongList, setDongList] = useState([]); // 동 Dropdown 리스트
	const [hoList, setHoList] = useState([]); // 호 Dropdown 리스트

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
						title: `방문차량예약 관리`,
						href:  `${rootUrl}/visitingCar`
					},
					{
						title: `방문차량예약 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/visitingCar/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});

			await getDropdownList();
			await getDongNumList();

			if ( id ) {
				setIsEdit(true);
				await getVisitingCar(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

	// 등록/수정 화면 내 Dropdown의 목록 가져옴 (공통 코드 사용)
	const getDropdownList = () => {
		commonCodeRepository.getGrpCode("A141")
			.then(result => {
				setParkUseClssList(result.data_json_array)
			})
		commonCodeRepository.getGrpCode("A150")
			.then(result => {
				setParkUseStatList(result.data_json_array)
			})
		commonCodeRepository.getGrpCode("A160")
			.then(result => {
				setParkCyclCodeList(result.data_json_array)
			})
		commonCodeRepository.getGrpCode("A142")
			.then(result => {
				setVistCodeList(result.data_json_array)
			})
	}

	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (동)
	const getDongNumList = () => {
		resrvHistRepository.getDongSearch({}, "donghosearch/dong")
			.then(result => {
				setDongList(result.data_json_array)
			})
	}
	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (호)
	const getHoNumList = (hoNumb) => {
		resrvHistRepository.getHoSearch({}, `donghosearch/ho/${hoNumb}`)
			.then(result => {
				setHoList(result.data_json_array)
			})
	}

	const getVisitingCar = async (id) => {
		visitingCarMgntRepository
			.detailParkingReservation({
				park_use_numb: id
			})
			.then(result => {
				dataBinding(result.data_json);
				setLoading(false);
			});
	};

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const dataBinding = (obj) => {
		setVisitingCar(prev => {
			return {
				...prev,
				park_use_clss:         obj ? obj.park_use_clss : "", 		// 주차이용구분
				park_use_stat:         obj ? obj.park_use_stat : "", 		// 주차이용상태
				park_cycl_code:  		   obj ? obj.park_cycl_code : "",		// 주차이용단위코드
				vist_code: 						 obj ? obj.vist_code : "",				// 방문목적코드
				vist_purp: 						 obj ? obj.vist_purp : "",				// 방문사유
				park_strt_dttm:     	 obj ? obj.park_strt_dttm : dateInit(true),  // 방문일 (시작)
				park_end_dttm:      	 obj ? obj.park_end_dttm : dateInit(false), // 방문일 (종료)
				// 수정 시에만:
				park_use_numb: 				 obj ? obj.park_use_numb : "",		// 주차예약고유번호
				// 등록 시에만
				dong_numb:						 obj ? obj.dong_numb : "",				// 동
				ho_numb:						 	 obj ? obj.ho_numb : "",					// 호
				//park_car_numb:				 obj ? obj.park_car_numb : "", 		// 주차차량고유번호
				car_numb:							 obj ? obj.car_numb : "", 				// 주차차량번호
			};
		});
	};

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 9 : 18).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}

		return date;
	};

	const updateVisitingCar = () => {
		visitingCarMgntRepository
			.updateParkingReservation({
					...visitingCar,
				park_strt_dttm : moment(visitingCar.park_strt_dttm).format('YYYY-MM-DD HH:mm:ss'),
				park_end_dttm : moment(visitingCar.park_end_dttm).format('YYYY-MM-DD HH:mm:ss')
			})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"방문차량예약 수정 완료",
					"방문차량예약 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/visitingCar/${id}`);
					},
					undefined
				);
			});
	};

	const saveVisitingCar = () => {
		visitingCarMgntRepository.addParkingReservation({
			...visitingCar,
			park_strt_dttm : moment(visitingCar.park_strt_dttm).format('YYYY-MM-DD HH:mm:ss'),
			park_end_dttm : moment(visitingCar.park_end_dttm).format('YYYY-MM-DD HH:mm:ss')
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"방문차량예약 등록 완료",
				"방문차량예약 등록이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/visitingCar`);
				},
				undefined
			);
		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				},
				undefined
			);
		});
	};

	const handleEdit = () => {

		if (isEdit && !(visitingCar.park_use_clss === "" || visitingCar.park_use_stat === "" ||
				visitingCar.park_cycl_code === "" || visitingCar.vist_code === "")) {

				// 수정
				updateVisitingCar();

		} else if (!(visitingCar.park_use_clss === "" || visitingCar.park_use_stat === "" ||
			visitingCar.park_cycl_code === "" || visitingCar.vist_code === "" ||
			visitingCar.dong_numb === "" || visitingCar.ho_numb === "" ||
			visitingCar.car_numb === "")) {

				// 등록
				saveVisitingCar();

		} else {
			setErrors(prev => {
				return {
					...prev,
					park_use_clss:  visitingCar.park_use_clss === "",
					park_use_stat:  visitingCar.park_use_stat === "",
					park_cycl_code: visitingCar.park_cycl_code === "",
					vist_code: visitingCar.vist_code === "",
					dong_numb: visitingCar.dong_numb === "",
					ho_numb: visitingCar.ho_numb === "",
					car_numb: visitingCar.car_numb === ""
				};
			});
		}
	};

	const handleGoBack = () => {
		history.goBack();
	};

	return (
		<div className={classes.root}>

			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs}/>
			<div className={classes.content}>

				<MC.Typography variant="h2" gutterBottom>
					방문차량예약&nbsp;
					{
						isEdit ? "수정" : "등록"
					}
				</MC.Typography>
				<MC.Divider className={classes.divider}/>

				{
					!loading && (
						<MC.Paper elevation={2} className={classes.paper}>

							<MC.Grid
								container
								spacing={2}
								justify={"space-between"}
								alignItems={"flex-start"}>

								<MC.Grid item xs={12} md={12}>
									<VisitingCarEditForm
										isEdit={isEdit}
										visitingCar={visitingCar}
										setVisitingCar={setVisitingCar}
										errors={errors}
										setErrors={setErrors}
										parkUseClssList={parkUseClssList}
										parkUseStatList={parkUseStatList}
										parkCyclCodeList={parkCyclCodeList}
										vistCodeList={vistCodeList}
										// showFindingCarModal={showFindingCarModal}
										dongList={dongList}
										hoList={hoList}
										getHoNumList={getHoNumList}
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
												color: palette.error.main,
												borderColor: palette.error.main,
												marginLeft: 10,
												borderTopLeftRadius: 4,
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
												isEdit ? "저장" : "등록"
											}
										</MC.Button>
									</MC.ButtonGroup>
								</MC.Grid>
							</MC.Grid>
						</MC.Paper>
					)
				}
				{
					loading && (
						<MC.Grid container justify={"center"}>
							<MC.CircularProgress color={"secondary"}/>
						</MC.Grid>
					)
				}
			</div>

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

			{/* 주차 차량 번호 검색 모달 */}
			{/*-------------NOT USE---------------*/}
			{/*<FindingCarModal*/}
			{/*	open={findingCarModal}*/}
			{/*	hideModal={hideFindingCarModal}*/}
			{/*	setSearchInfo={setSearchInfo}*/}
			{/*	searchInfo={searchInfo}*/}
			{/*	setVisitingCar={setVisitingCar}*/}
			{/*	showSearchedTable={showSearchedTable}*/}
			{/*	setShowSearchedTable={setShowSearchedTable}*/}
			{/*/>*/}

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(VisitingCarEdit));
