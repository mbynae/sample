import React, { useEffect, useState } from "react";

import * as MC from "@material-ui/core";

import { aptComplexRepository }    from "../../../../../repositories";
import { AlertDialog, HTMLEditor } from "../../../../../components";

const ReceivingInformationDialog = props => {
	const { aptId, open, onClose } = props;
	const [aptComplex, setAptComplex] = useState({});
	const [receivingInformation, setReceivingInformation] = useState({
		content: ""
	});
	const [scroll, setScroll] = React.useState("paper");
	
	useEffect(() => {
		const init = () => {
			getReceivingInformation();
		};
		setTimeout(() => {
			init();
		});
	}, [aptId, open]);
	
	const getReceivingInformation = () => {
		if ( aptId ) {
			aptComplexRepository
				.getAptComplex(aptId)
				.then(result => {
					setAptComplex(prev => {
						return {
							...prev,
							...result
						};
					});
					setReceivingInformation(prev => {
						return {
							...prev,
							content: result.receivingInformation || ""
						};
					});
				});
		}
	};
	
	const handleUpdateReceivingInformation = () => {
		let tempAptComplex = aptComplex;
		tempAptComplex.receivingInformation = receivingInformation.content;
		aptComplexRepository
			.updateAptComplex(
				aptComplex.id,
				{
					...tempAptComplex
				})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"수납정보 수정 완료",
					`수납정보를 수정 완료 하였습니다.`,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						onClose();
					}
				);
			});
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
			aria-labelledby="form-receivingInformation-dialog-title">
			<MC.DialogTitle id="form-receivingInformation-dialog-title">
				수납정보 관리
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<HTMLEditor
					content={receivingInformation.content || ""}
					obj={receivingInformation}
					setObj={setReceivingInformation}
				/>
			
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={onClose}>
					취소
				</MC.Button>
				<MC.Button onClick={handleUpdateReceivingInformation}>
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

export default ReceivingInformationDialog;
