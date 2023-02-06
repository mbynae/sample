import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, TablePaginationActions, PhoneHyphen } from "../../../../../components";

import palette                   from "../../../../../theme/adminTheme/palette";
import { sendSMSRepository } from "../../../../../repositories";
import MoveReservationInfoDialog from "../MoveReservationInfoDialog";
import MoveReservationsNoticeDialog from "../MoveReservationsNoticeDialog";

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

const MoveReservationsTable = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, moveReservations, getMoveReservations, pageInfo, setPageInfo, isLoading, AptComplexStore } = props;

	const [selectedObjects, setSelectedObjects] = useState([]);
	const [moveReservationInfoOpen, setMoveReservationInfoOpen] = useState(false); // 이사예약 안내 Dialog
	const [moveReservationNoticeOpen, setMoveReservationNoticeOpen] = useState(false); // 안내문 작성 Dialog
	const [selectedObjectForNotice, setSelectedObjectForNotice] = useState({});

	const handleSelectAll = event => {
		let selectedList;
		event.target.checked ? selectedList = moveReservations.map(moveReservation => moveReservation) : selectedList = [];
		setSelectedObjects(selectedList);
	};

	const handleSelectOne = (event, selectedObject) => {
		const selectedIndex = selectedObjects.indexOf(selectedObject);
		let newSelectedObjects = [];

		if ( selectedIndex === -1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects, selectedObject);
		} else if ( selectedIndex === 0 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if ( selectedIndex === selectedObjects.length - 1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
		} else if ( selectedIndex > 0 ) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}

		setSelectedObjects(newSelectedObjects);
	};

	// --------------- NOT USE --------------- //
	// const removeObject = async (id) => {
	// 	//return visitingCarRepository.removeVisitingCar(id);
	// };
	//
	// const handleDeleteAllClick = async () => {
	// 	// 선택된 데이터의 상태 값 검사
	// 	handleAlertToggle(
	// 		"isConfirmOpen",
	// 		"이사예약 삭제",
	// 		"선택하신 이사예약 데이터가 모두 삭제가 됩니다. \n 정말로 데이터를 삭제하겠습니까?",
	// 		async () => {
	// 			await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
	// 			// await selectedObjects.map(async (obj) => {
	// 			// 	await removeObject(obj.id);
	// 			// });
	// 			handleAlertToggle(
	// 				"isOpen",
	// 				"삭제완료",
	// 				"선택된 이사예약 정보 모두를 삭제 하였습니다.",
	// 				() => {
	// 					setSelectedObjects([]);
	// 					setAlertOpens({ ...alertOpens, isOpen: false });
	// 				}
	// 			);
	// 			await getMoveReservations(pageInfo.page, pageInfo.size);
	// 		},
	// 		() => {
	// 			// 삭제안하기
	// 			setAlertOpens({ ...alertOpens, isConfirmOpen: false });
	// 		}
	// 	);
	// };

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

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getMoveReservations(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getMoveReservations(0, event.target.value);
	};

	const handleOpenRegisterPage = event => {
		history.push(`${rootUrl}/moveReservation/edit`);
	};

	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/moveReservation/${obj.mvio_numb}`);
	};

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.mvio_numb}>

			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>

			{/*상태*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{
					obj.rsvt_stat === "2030" ? <MC.Chip label={"예약완료"} /> :
						obj.rsvt_stat === "2020" ? <MC.Chip label={"예약중"} /> :
							obj.rsvt_stat === "2090" && <MC.Chip label={"예약취소"} />
				}
			</MC.TableCell>

			{/*구분*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.mvio_code === "JI" ? "전입" : "전출"}
			</MC.TableCell>

			{/*시작날짜*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				<DateFormat date={obj.mvio_strt_date} format={"YYYY-MM-DD"} />
			</MC.TableCell>

			{/*동*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.dong_numb}
			</MC.TableCell>

			{/*호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.ho_numb}
			</MC.TableCell>

			{/*예약자명*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.memb_name}
			</MC.TableCell>

			{/*비고*/}
			<MC.TableCell align={"center"}>

				<MC.ButtonGroup
					aria-label="text primary button group"
					color="primary">
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4
						}}
						onClick={() => handleClickOpenNoticeDialog(obj)}
					>
						안내문 작성
					</MC.Button>

					{/* 전출의 경우에만 관리비정산 알림 버튼 표출*/}
					{
						obj.mvio_code === "JC" &&

						<MC.Button
							style={{
								color: palette.primary.main,
								borderColor: palette.primary.main,
								marginLeft: 10,
								borderTopLeftRadius: 4,
								borderBottomLeftRadius: 4
							}}
							onClick={() => handleClickSendSMSButton(obj)}
						>
							관리비정산 알림
						</MC.Button>
					}

				</MC.ButtonGroup>

				{/*{*/}
				{/*	obj.purposeVisitType === "HOUSEHOLD_VISIT" ? <MC.Chip label={"세대방문"} /> :*/}
				{/*		obj.purposeVisitType === "ETC" && <MC.Chip label={"기타"} />*/}
				{/*}*/}
			</MC.TableCell>

		</MC.TableRow>
	);

	// 관리비 정산 메시지 전송
	const handleClickSendSMSButton = (obj) => {

		let sendSMSParam = {
			aptId: AptComplexStore.aptComplex.id,
			content:
				`${AptComplexStore.aptComplex.aptInformationDataType.aptName}\n관리비 정산이 완료되었습니다. 관리사무소로 방문하시어 정산내역서를 수령해주세요\n관리사무소 통화연결: ${PhoneHyphen(AptComplexStore.aptComplex.aptInformationDataType.officeCallNumber)}`,
			smsType: "MMS",
			sendTargetType: "INDIVIDUAL",
			sendType: "SEND_IMMEDIATE",
			sendTargetDataTypes: [{phoneNumber: obj.mbil_teln}] // obj.memb_info.mbil_teln
		}

		handleAlertToggle(
			"isConfirmOpen",
			"관리비 정산 알림 메시지",
			"관리비 정산 메시지를 전송하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				sendSMSRepository
					.saveSendSMS(
						{
							...sendSMSParam
						})
					.then(() => {
						handleAlertToggle(
							"isOpen",
							"문자발송 완료",
							"문자발송을 완료 하였습니다.",
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
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
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	}

	// 이사 예약 안내 Dialog Open/Close
	const handleClickOpenInfoDialog = () => {
		setMoveReservationInfoOpen(true);
	};
	const handleClickCloseInfoDialog = () => {
		setMoveReservationInfoOpen(false);
	};

	// 안내문 작성 Dialog Open/Close
	const handleClickOpenNoticeDialog = (obj) => {
		setMoveReservationNoticeOpen(true);
		setSelectedObjectForNotice(obj)
	};
	const handleClickCloseNoticeDialog = () => {
		setMoveReservationNoticeOpen(false);
	};

	return (
		<MC.Card
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"이사예약 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
				titleTypographyProps={{ variant: "h4" }}
				// action={
				// 	<MC.ButtonGroup
				// 		aria-label="text primary button group"
				// 		style={{ marginTop: 12 }}
				// 		color="primary">
				// 		<MC.Button
				// 			disabled={selectedObjects.length === 0}
				// 			style={{
				// 				color:                  selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.error.main,
				// 				borderColor:            selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.12)" : palette.error.main,
				// 				marginLeft:             10,
				// 				borderTopLeftRadius:    4,
				// 				borderBottomLeftRadius: 4
				// 			}}
				// 			onClick={handleDeleteAllClick}>
				// 			삭제
				// 		</MC.Button>
				// 	</MC.ButtonGroup>
				// }
			/>

			<MC.Divider />

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"} padding={"checkbox"}>
										<MC.Checkbox
											checked={
												moveReservations ?
													(moveReservations.length === 0 ? false : selectedObjects.length === moveReservations.length) : false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0
												&& selectedObjects.length < (moveReservations ? moveReservations.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>상태</MC.TableCell>
									<MC.TableCell align={"center"}>구분</MC.TableCell>
									<MC.TableCell align={"center"}>이사예정일</MC.TableCell>
									<MC.TableCell align={"center"}>동</MC.TableCell>
									<MC.TableCell align={"center"}>호</MC.TableCell>
									<MC.TableCell align={"center"}>예약자명</MC.TableCell>
									<MC.TableCell align={"center"}>비고</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									isLoading ?
										<MC.TableRow hover>
											<MC.TableCell colSpan={8} align="center">
												<MC.CircularProgress color="secondary"/>
											</MC.TableCell>
										</MC.TableRow>
										:
										moveReservations.length === 0 ?
											<MC.TableRow>
												<MC.TableCell colSpan={8} align="center">
													조회된 이사예약 데이터가 한 건도 없네요.
												</MC.TableCell>
											</MC.TableRow>
											:
											moveReservations.slice(slice).map(objView)
								}
							</MC.TableBody>

						</MC.Table>
					</div>
				</PerfectScrollbar>
			</MC.CardContent>

			<MC.Divider />
			<MC.CardActions className={classes.actions}>
				<MC.Grid
					container
					justify={"space-between"}
					alignItems={"center"}>
					<MC.Grid item>
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button onClick={handleOpenRegisterPage}>
								등록
							</MC.Button>
							<MC.Button onClick={handleClickOpenInfoDialog}>
								이사예약 안내
							</MC.Button>
						</MC.ButtonGroup>
					</MC.Grid>
					<MC.Grid item>
						<MC.TablePagination
							component="div"
							count={pageInfo.total}
							labelDisplayedRows={({ from, to, count }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
							labelRowsPerPage={"페이지당 목록 수 : "}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
							ActionsComponent={TablePaginationActions}
							page={pageInfo.page}
							rowsPerPage={pageInfo.size}
							rowsPerPageOptions={[10, 15, 30, 50, 100]} />
					</MC.Grid>
				</MC.Grid>
			</MC.CardActions>

			{/* 이사예약 안내 Dialog */}
			<MoveReservationInfoDialog
				// aptId={AptComplexStore.aptComplex.id}
				open={moveReservationInfoOpen}
				onClose={handleClickCloseInfoDialog}
			/>
			{/* 안내문 작성 Dialog */}
			<MoveReservationsNoticeDialog
				// aptId={AptComplexStore.aptComplex.id}
				selectedObjectForNotice={selectedObjectForNotice}
				open={moveReservationNoticeOpen}
				onClose={handleClickCloseNoticeDialog}
				AptComplexStore={AptComplexStore}
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

		</MC.Card>
	);

};

export default MoveReservationsTable;
