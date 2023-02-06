import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import palette                               from "../../../theme/adminTheme/palette";
import { resrvHistRepository, moveReservationRepository }             from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { MoveReservationEditForm }               from "./components";

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

const MoveReservationEdit = props => {
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
			title: `이사예약 관리`,
			href:  `${rootUrl}/visitingCar`
		},
		{
			title: `이사예약 관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/visitingCar/edit${id ? "/" + id : ""}`
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

	const [dongList, setDongList] = useState([]); // 동 Dropdown 리스트
	const [hoList, setHoList] = useState([]); // 호 Dropdown 리스트

	// 이사예약 관리 정보
	const [moveReservation, setMoveReservation] = useState({});

	// Validation 항목
	const [errors, setErrors] = useState({
		dong_numb:  false,
		ho_numb:      false,
		mvio_name: false,
		mvio_tel: false
	});

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
						title: `이사예약 관리`,
						href:  `${rootUrl}/visitingCar`
					},
					{
						title: `이사예약 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/visitingCar/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});

			await getDongNumList();

			// 수정일 경우 : Detail 정보 호출
			if ( id ) {
				setIsEdit(true);
				await getMoveReservation(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (동)
	const getDongNumList = () => {
		resrvHistRepository.getDongSearch({}, "donghosearch/dong")
			.then(result => {
				setDongList(result.data_json_array)
			})
	}
	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (호)
	const getHoNumList = (dongNumb) => {
		resrvHistRepository.getHoSearch({}, `donghosearch/ho/${dongNumb}`)
			.then(result => {
				setHoList(result.data_json_array)
			})
	}

	// 수정일 경우 Detail 정보 호출 함수
	const getMoveReservation = async (id) => {
		moveReservationRepository
			.getMoveReservation({
				mvio_numb : id
			})
			.then(result => {

				dataBinding({
					...result.detailinfo,
					mvio_strt_time: result.detailinfo.mvio_strt_time.substring(0, 2),
					deleted_carlist: []
				});

				// 호 Number 매핑
				getHoNumList(result.detailinfo.dong_numb);
				setLoading(false);
			});
	};

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const dataBinding = (obj) => {
		setMoveReservation(prev => {
			return {
				...prev,
				dong_numb: obj ? obj.dong_numb : "",
				ho_numb: obj ? obj.ho_numb : "",
				mvio_name: obj ? obj.mvio_name : "",
				mvio_tel: obj ? obj.mvio_tel : "",
				mvio_code: obj ? obj.mvio_code : "JI",
				mvio_strt_date: obj ? obj.mvio_strt_date : dateInit(true),
				mvio_end_date: obj ? obj.mvio_end_date : dateInit(true),
				mvio_strt_time: obj ? obj.mvio_strt_time : "09",
				mvio_end_time: obj ? obj.mvio_end_time : "09",
				carlist: obj ? obj.carlist : [{ car_numb: "", worktype: "IN" }],
				deleted_carlist: obj ? obj.deleted_carlist : [] // 삭제 선택된 Car List
			};
		});
	};

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 9 : 18).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);

		let day = date.day();
		date.day(day + 1);

		return date;
	};

	const updateVisitingCar = () => {

		let updateParam = {
			...moveReservation,
			mvio_numb: id,
			carlist: moveReservation.carlist.filter((item, index) => item.car_numb !== "").concat(moveReservation.deleted_carlist),
			mvio_strt_date: moment(moveReservation.mvio_strt_date).format('YYYY-MM-DD'),
			mvio_end_date: moment(moveReservation.mvio_strt_date).format('YYYY-MM-DD'),
			mvio_strt_time: moveReservation.mvio_strt_time + ":00:00",
			mvio_end_time: moveReservation.mvio_strt_time + ":00:00"
		}

		const param = JSON.stringify(updateParam)

		moveReservationRepository.editMoveReservation(id, param)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"이사예약 수정 완료",
					"이사예약 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/moveReservation/${id}`);
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

	const saveVisitingCar = () => {

		let addParam = {
			...moveReservation,
			mvio_strt_date: moment(moveReservation.mvio_strt_date).format('YYYY-MM-DD'),
			mvio_end_date: moment(moveReservation.mvio_strt_date).format('YYYY-MM-DD'),
			mvio_strt_time: moveReservation.mvio_strt_time + ":00:00",
			mvio_end_time: moveReservation.mvio_strt_time + ":00:00",
			carlist: moveReservation.carlist.filter((item, index) => item.car_numb !== "")
		}

		const param = JSON.stringify(addParam)

		moveReservationRepository.addMoveReservation(param)
			.then(result => {
			handleAlertToggle(
				"isOpen",
				"이사예약 등록 완료",
				"이사예약 등록이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/moveReservation`);
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

	// Submit Handler
	const handleEdit = () => {

		if (!(moveReservation.dong_numb === "" || moveReservation.ho_numb === "" || moveReservation.mvio_name === "" || moveReservation.mvio_tel === "")) {
			if ( isEdit ) {
				// 수정
				updateVisitingCar();
			} else {
				// 등록
				saveVisitingCar();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					dong_numb: moveReservation.dong_numb === "",
					ho_numb: moveReservation.ho_numb === "",
					mvio_name: moveReservation.mvio_name === "",
					mvio_tel: moveReservation.mvio_tel === ""
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
					이사예약&nbsp;
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
									<MoveReservationEditForm
										isEdit={isEdit}
										moveReservation={moveReservation}
										setMoveReservation={setMoveReservation}
										errors={errors}
										setErrors={setErrors}
										dongList={dongList}
										hoList={hoList}
										getHoNumList={getHoNumList}
									/>

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
													isEdit ? "수정" : "등록"
												}
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>

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

		</div>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(MoveReservationEdit));
