import * as MC from "@material-ui/core";
import React   from "react";
import * as MS from "@material-ui/styles";
import { useGuideRepository } from "../../../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	container: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexWrap: "wrap",
	},
}));

const UseGuideModal = props => {

	const classes = useStyles();
	const {
		open,
		handleClose,
		isEdit,
		alertOpens,
		setAlertOpens,
		handleAlertToggle,
		getUseGuide,
		useGuideInfo,
		tempUseGuide,
		setTempUseGuide,
		errors,
		setErrors
	} = props;

	// 예약이용안내 관리 모달 Input Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		// 입력 값 있을 경우 에러 초기화
		setErrors(prev => {
			return {
				...prev,
				use_info: value === ""
			};
		});

		setTempUseGuide(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	// 등록 Handler
	const handleCreate = () => {

		if (!(tempUseGuide.use_info === "")) {
			handleClose();
			useGuideRepository.createUseGuide(tempUseGuide)
				.then(result => {
					handleAlertToggle(
						"isOpen",
						"이용안내 등록",
						"이용안내 등록을 완료하였습니다.",
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							getUseGuide();
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
			});
		} else {
			setErrors(prev => {
				return {
					...prev,
					use_info: tempUseGuide.use_info === ""
				};
			});
		}

	};

	// 수정 Handler
	const handleEdit = () => {

		if (!(tempUseGuide.use_info === "")) {
			handleClose();
			useGuideRepository.updateUseGuide({
				cnts_numb: useGuideInfo.cnts_numb,
				use_info: tempUseGuide.use_info,
			}).then(result => {
				handleAlertToggle(
					"isOpen",
					"이용안내 수정",
					"이용안내 수정을 완료하였습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						getUseGuide();
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
			});
		} else {
			setErrors(prev => {
				return {
					...prev,
					use_info: tempUseGuide.use_info === ""
				};
			});
		}
	};

	return (
		<MC.Dialog maxWidth={"sm"} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<MC.DialogTitle id="form-dialog-title">예약이용안내 {isEdit ? "수정" : "등록"}</MC.DialogTitle>
			<MC.DialogContent>
				<MC.TextField
					multiline
					fullWidth
					error={errors.use_info}
					rows={20}
					variant="outlined"
					id="outlined-multiline-static"
					name="use_info"
					value={tempUseGuide.use_info}
					onChange={handleChange}
				/>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={handleClose} color="primary">
					취소
				</MC.Button>
				<MC.Button color="primary" onClick={isEdit ? handleEdit : handleCreate}>
					{
						isEdit ? "수정" : "등록"
					}
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	);
};

export default UseGuideModal;
