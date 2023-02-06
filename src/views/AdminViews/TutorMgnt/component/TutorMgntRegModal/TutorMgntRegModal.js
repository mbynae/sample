import React, {useState,useEffect} from "react";
import clsx              from "clsx";
import * as MC                                         from "@material-ui/core";
import * as MS                                     from "@material-ui/styles";
import { prgmMgntRepository, tutorMgntRepository } from "../../../../../repositories";
import { PhoneMask }                               from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	tableCellTitle:           {
		width: "25%"
	},
	tableCellDescriptionFull: {
		width:    "75%",
		maxWidth: "75%"
	},
}));

const TutorMgntRegModal = props => {

	const classes = useStyles();
	const {open, setOpen, handleClose, alertOpens, setAlertOpens, handleAlertToggle, getTutorList, tutorInfo, setTutorInfo, isEdit, errors, setErrors, pageInfo} = props;
	const [fcltList, setFcltList] = useState([]);

	useEffect(() => {
		window.scrollTo(0,0);
		const init = async () => {
			await getFcltList();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getFcltList = () => {
		prgmMgntRepository.getFcltList()
			.then(result => {
				setFcltList(result.data_json_array);
			})
	}

	// Dropdown, Input field의 Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		// 입력 값 있을 경우 에러 초기화
		if (name !== "clss_code") {
			setErrors(prev => {
				if (name === "inst_name") return { ...prev, inst_name: value === "" }
				else if (name === "inst_teln") return { ...prev, inst_teln: value === "" }
			});
		}

		setTutorInfo(prev => {
			return {
				...prev,
				[name]: value
			}
		})

	};

	// 강사 등록 Handler
	const handleCreate = () => {

		if(!(tutorInfo.inst_name === "" || tutorInfo.inst_teln === "")) {
			setOpen(false);
			tutorMgntRepository.createTutorInfo(tutorInfo)
				.then(result => {
					handleAlertToggle(
						"isOpen",
						"강사 등록",
						"강사 등록을 완료하였습니다.",
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							getTutorList();
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
			})
		} else {
			setErrors(prev => {
				return {
					...prev,
					inst_name: tutorInfo.inst_name === "",
					inst_teln: tutorInfo.inst_teln === ""
				}
			});
		}
	}

	// 강사 수정 Handler
	const handleEdit = () => {

		if(!(tutorInfo.inst_name === "" || tutorInfo.inst_teln === "")) {
			setOpen(false);
			tutorMgntRepository.updateTutorInfo(tutorInfo.clss_code, {
				inst_numb: tutorInfo.inst_numb,
				inst_name: tutorInfo.inst_name,
				inst_teln: tutorInfo.inst_teln
			}).then(result => {
				handleAlertToggle(
					"isOpen",
					"강사 수정",
					"강사 등록을 완료하였습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						getTutorList(pageInfo.page, pageInfo.size);
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
			})
		} else {
			setErrors(prev => {
				return {
					...prev,
					inst_name: tutorInfo.inst_name === "",
					inst_teln: tutorInfo.inst_teln === ""
				}
			});
		}
	}

	return (
		<MC.Dialog maxWidth={"sm"} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<MC.DialogTitle id="form-dialog-title">강사 등록</MC.DialogTitle>
			<MC.DialogContent>
				<MC.Table>
					<MC.TableBody>
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">시설</MC.TableCell>
							<MC.TableCell className={classes.tableCellDescriptionFull}>
								<MC.TextField
									select
									fullWidth
									disabled={isEdit}
									variant={"outlined"}
									name={"clss_code"}
									id={"clss-code"}
									value={tutorInfo.clss_code}
									onChange={handleChange}>
									{
										fcltList.map((facility, index) => (
											<MC.MenuItem key={index} value={facility.fclt_code+facility.fclt_numb}>{facility.fclm_name}</MC.MenuItem>
										))
									}
								</MC.TextField>
							</MC.TableCell>
						</MC.TableRow>

						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">강사이름</MC.TableCell>
							<MC.TableCell className={classes.tableCellDescriptionFull}>
								<MC.TextField
									fullWidth
									error={errors.inst_name}
									variant={"outlined"}
									id={"inst-name"}
									name={"inst_name"}
									value={tutorInfo.inst_name}
									placeholder={"예) 홍길동"}
									onChange={handleChange}/>
							</MC.TableCell>
						</MC.TableRow>

						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">연락처</MC.TableCell>
							<MC.TableCell className={classes.tableCellDescriptionFull}>
								<MC.OutlinedInput
									fullWidth
									error={errors.inst_teln}
									id="inst-teln"
									name="inst_teln"
									placeholder={"숫자만 입력해주세요"}
									value={tutorInfo.inst_teln || ""}
									onChange={handleChange}
									inputComponent={PhoneMask}
								/>
							</MC.TableCell>
						</MC.TableRow>
					</MC.TableBody>
				</MC.Table>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={handleClose} color="primary">
					취소
				</MC.Button>
				<MC.Button onClick={isEdit ? handleEdit : handleCreate} color="primary">
					{
						isEdit ? "수정" : "등록"
					}
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	)
};

export default TutorMgntRegModal;
