import React, { useEffect, useState } from "react";

import * as MC from "@material-ui/core";

import { moveReservationRepository }      from "../../../../../repositories";
import { AlertDialog, HTMLEditor } from "../../../../../components";

const MoveReservationInfoDialog = props => {
	const { open, onClose } = props;
	const [moveReservationInfo, setMoveReservationInfo] = useState({
		mvio_cnts: "",
		mvio_code: ""
	});
	const [scroll, setScroll] = React.useState("paper");
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		const init = () => {
			getMoveReservationInfo();
		};
		setTimeout(() => {
			init();
		});
	}, [open]);

	const getMoveReservationInfo = () => {

			moveReservationRepository
				.getMoveReservationInfo()
				.then(result => {
					if (result.data_json) {
						setIsEdit(true)
						setMoveReservationInfo(prev => {
							return {
								...prev,
								mvio_cnts: result.data_json.mvio_cnts || "",
								mvio_code: result.data_json.mvio_code || ""
							};
						});
					} else {
						setIsEdit(false)
					}
				});
	};

	const handleUpdatePreCheckInfo = () => {

		let param = {}

		param.mvio_cnts = moveReservationInfo.content;
		//param.mvio_code = "JI" // Temp: 전입

		// 수정
		if (isEdit) {
			//delete param.mvio_code; // 수정일 경우 전입,전출 코드 넘기지 않음
			//param.info_numb = 3 	  // Temp: 3

			moveReservationRepository
				.editMoveReservationInfo({
					...param
				})
				.then(result => {
					handleAlertToggle(
						"isOpen",
						"이사예약안내 수정 완료",
						`이사예약 안내를 수정 완료 하였습니다.`,
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							onClose();
						}
					);
				});
		}
		// 등록
		else {
			moveReservationRepository
				.addMoveReservationInfo({
					...param
				})
				.then(result => {
					handleAlertToggle(
						"isOpen",
						"이사예약안내 등록 완료",
						`이사예약 안내를 등록 완료 하였습니다.`,
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							onClose();
						}
					);
				});
		}
	};

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

	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			scroll={scroll}
			aria-labelledby="moveReservation-dialog-title">
			<MC.DialogTitle id="moveReservation-dialog-title">
				이사예약 안내 관리
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>

				<HTMLEditor
					content={moveReservationInfo.mvio_cnts || ""}
					obj={moveReservationInfo}
					setObj={setMoveReservationInfo}
				/>

			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={onClose}>
					취소
				</MC.Button>
				<MC.Button onClick={handleUpdatePreCheckInfo}>
					저장
				</MC.Button>
			</MC.DialogActions>

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

		</MC.Dialog>
	);
};

export default MoveReservationInfoDialog;
