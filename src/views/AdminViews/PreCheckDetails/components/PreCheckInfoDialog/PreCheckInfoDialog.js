import React, { useEffect, useState } from "react";

import * as MC from "@material-ui/core";

import { preCheckRepository } from "../../../../../repositories";
import { AlertDialog, HTMLEditor } from "../../../../../components";

const PreCheckInfoDialog = (props) => {
	const { aptId, open, onClose } = props;
	const [preCheckInfo, setPreCheckInfo] = useState({
		content: "",
	});
	const [scroll, setScroll] = React.useState("paper");

	useEffect(() => {
		const init = () => {
			getPreCheckInfo();
		};
		setTimeout(() => {
			init();
		});
	}, [aptId, open]);

	const getPreCheckInfo = () => {
		if (aptId) {
			preCheckRepository
				.getPreCheck({
					aptId: aptId,
				})
				.then((result) => {
					setPreCheckInfo((prev) => {
						return {
							...prev,
							id: result.id || "",
							content: result.preCheckInfo || "",
						};
					});
				});
		}
	};

	const handleUpdatePreCheckInfo = () => {
		preCheckInfo.preCheckInfo = preCheckInfo.content;
		preCheckRepository
			.updatePreCheck(preCheckInfo.id, {
				...preCheckInfo,
			})
			.then((result) => {
				handleAlertToggle(
					"isOpen",
					"사전점검 안내 수정 완료",
					`사전점검 안내를 수정 완료 하였습니다.`,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						onClose();
					}
				);
			});
	};

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
	});
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens((prev) => {
			return {
				...prev,
				title,
				content,
				[key]: !alertOpens[key],
				yesFn: () => yesCallback(),
				noFn: () => noCallback(),
			};
		});
	};

	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			scroll={scroll}
			aria-labelledby="form-preCheckInfo-dialog-title"
		>
			<MC.DialogTitle id="form-preCheckInfo-dialog-title">
				사전점검 안내 관리
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				<HTMLEditor
					content={preCheckInfo.content || ""}
					obj={preCheckInfo}
					setObj={setPreCheckInfo}
				/>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={onClose}>취소</MC.Button>
				<MC.Button onClick={handleUpdatePreCheckInfo}>저장</MC.Button>
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

export default PreCheckInfoDialog;
