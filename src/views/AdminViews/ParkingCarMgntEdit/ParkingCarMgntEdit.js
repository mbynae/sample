import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import palette                                                              from "../../../theme/adminTheme/palette";
import { parkingMgntRepository, commonCodeRepository, resrvHistRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                                from "../../../components";
import { ParkingCarMgntEditForm }                                           from "./components";

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

const ParkingCarMgntEdit = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("parkingCarMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `차량정보 관리`,
			href:  `${rootUrl}/parkingCarMgnt`
		},
		{
			title: `차량정보  ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/parkingCarMgnt/edit${id ? "/" + id : ""}`
		}
	]);

	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
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

	const [parkingCar, setParkingCar] = useState({}); // 등록차량 관리 정보
	const [errors, setErrors] = useState({
		car_numb: false,
		car_name: false,
		car_type: false,
		car_clss: false,
		car_stat: false,
		park_type: false,
		dong_numb: false,
		ho_numb: false
	});

  // 등록/수정 화면 Dropdown 설정
	const [carTypeList, setCarTypeList] = useState([]);
	const [carClssList, setCarClssList] = useState([]);
	const [carStatList, setCarStatList] = useState([]);
	const [parkTypeList, setParkTypeList] = useState([]);
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
						title: `차량정보 관리`,
						href:  `${rootUrl}/parkingCarMgnt`
					},
					{
						title: `차량정보 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/parkingCarMgnt/edit${id ? "/" + id : ""}`
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
				await getParkingCar(id);
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
		commonCodeRepository.getGrpCode("A120")
			.then(result => {
				setCarTypeList(result.data_json_array)
			})
		commonCodeRepository.getGrpCode("A130")
			.then(result => {
				setCarClssList(result.data_json_array)
			})
		commonCodeRepository.getGrpCode("A131")
			.then(result => {
				setCarStatList(result.data_json_array)
			})
		commonCodeRepository.getGrpCode("A140")
			.then(result => {
				setParkTypeList(result.data_json_array)
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

	const getParkingCar = async (id) => {
		parkingMgntRepository
			.detailParkingReservation({
				park_car_numb	: id
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
		setParkingCar(prev => {
			return {
				...prev,
				park_car_numb:	     obj ? obj.park_car_numb : "", // 차량 고유 ID
				dong_numb:           obj ? obj.dong_numb : "", // 동
				ho_numb:             obj ? obj.ho_numb : "", // 호
				park_type_info: 		 obj ? obj.park_type_info : "", // 등록 차량 정보
				park_type: 		 			 obj ? obj.park_type : "", // 등록 차량 정보 코드
				park_strt_dttm:    	 obj ? obj.park_strt_dttm : dateInit(true), // 등록 시작일
				park_end_dttm:       obj ? obj.park_end_dttm : dateInit(false), // 등록 종료일
				car_numb:            obj ? obj.car_numb : "", // 차량 번호
				car_type_info:       obj ? obj.car_type_info : "", // 차량 구분
				car_type:						 obj ? obj.car_type : "", // 차량 구분 코드
				car_clss_info:       obj ? obj.car_clss_info : "", // 차량 크기
				car_clss:       		 obj ? obj.car_clss : "", // 차량 크기 코드
				car_name:            obj ? obj.car_name : "", // 차량 이름
				car_stat_info:			 obj ? obj.car_stat_info: "", // 차량 상태
				car_stat:			 			 obj ? obj.car_stat: "" // 차량 상태 코드

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

	// 수정 API 호출 함수
	const updateParkingCar = () => {
		parkingMgntRepository
			.updateParkingReservation(
				{
					...parkingCar
				})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"등록차량 수정 완료",
					"등록차량 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/parkingCarMgnt/${parkingCar.park_car_numb}`);
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

	// 등록 API 호출 함수
	const saveParkingCar = () => {
		parkingMgntRepository.addParkingReservation({
			...parkingCar
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"등록차량 등록 완료",
				"등록차량 등록이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/parkingCarMgnt/${parkingCar.park_car_numb}`);
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

	// 등록/수정 Handler
	const handleEdit = () => {

		if (isEdit && !(parkingCar.car_numb === "" || parkingCar.car_name === "" ||
			parkingCar.car_type === "" || parkingCar.car_clss === "" ||
			parkingCar.car_stat === "" || parkingCar.park_type === "" ||
			parkingCar.dong_numb === "" || parkingCar.ho_numb === "")) {

			// 수정
			updateParkingCar();

		} else if (!(parkingCar.car_numb === "" || parkingCar.car_name === "" ||
			parkingCar.dong_numb === "" || parkingCar.ho_numb === "")) {

			// 등록
			saveParkingCar();

		} else {
			setErrors(prev => {
				return {
					...prev,
					car_numb: parkingCar.car_numb === "",
					car_name: parkingCar.car_name === "",
					car_type: parkingCar.car_type === "",
					car_clss: parkingCar.car_clss === "",
					car_stat: parkingCar.car_stat === "",
					park_type: parkingCar.park_type === "",
					dong_numb: parkingCar.dong_numb === "",
					ho_numb: parkingCar.ho_numb === ""
				};
			});
		}
	};

	const handleGoBack = () => {
		history.goBack();
	};

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>
							<MC.Typography variant="h2" gutterBottom>
								차량정보&nbsp;
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
										<ParkingCarMgntEditForm
											isEdit={isEdit}
											parkingCar={parkingCar}
											setParkingCar={setParkingCar}
											errors={errors}
											setErrors={setErrors}
											carTypeList={carTypeList}
											carClssList={carClssList}
											carStatList={carStatList}
											parkTypeList={parkTypeList}
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
													isEdit ? "저장" : "등록"
												}
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>
								</MC.Grid>
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
	)

}

export default inject("SignInStore", "AptComplexStore")(observer(ParkingCarMgntEdit));
