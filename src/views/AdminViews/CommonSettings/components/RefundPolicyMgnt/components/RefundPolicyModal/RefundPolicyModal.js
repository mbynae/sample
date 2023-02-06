import * as MC                    from "@material-ui/core";
import palette                    from "../../../../../../../theme/adminTheme/palette";
import React                   		from "react";
import * as MS                    from "@material-ui/styles";
import { refundPolicyRepository } from "../../../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	fcltDropdown:                {
		margin:       theme.spacing(1),
		padding:			"5px 15px 15px 0px"
	},
	addButton:									 {
		marginLeft:  8
	}
}));

const RefundPolicyModal = props => {

	const classes = useStyles();
	const {
		open, handleClose, isEdit, alertOpens,
		setAlertOpens, handleAlertToggle, policySlots, setPolicySlots,
		getFacilityList, errors, setErrors, fcltNumb, setFcltNumb,
		pageInfo, fcltNumbList, setErrorDropdown, errorDropdown
	} = props;

	// 모달 Add버튼 클릭시 Slot 추가
	const addSlot = () => {
		if(policySlots.length < 3) {
			setPolicySlots(policySlots.concat({dday_name: '', dday_day: '', rfnd_rate: ''}));
			setErrors(errors.concat({dday_name: false, dday_day: false, rfnd_rate: false}));
		}
	}

  // 모달에서 삭제 클릭시 Slot 삭제
	const removeSlot = (idx) => {
		setPolicySlots(policySlots.filter((std, eIdx) => eIdx !== idx));
		setErrors(errors.filter((error, eIdx) => eIdx !== idx))
	}

	// 환불정책 입력 슬롯 Change Handler
	const handleInputChange = (idx) => (event) => {
		const {name, value} = event.currentTarget

		// 입력 값 있을 경우 에러 초기화
		setErrors((prevErrors) =>
			prevErrors.map((error, eIdx) => {
				if (eIdx == idx) {
					if (name === "dday_name") return { ...error, dday_name: value === "" }
					else if (name === "dday_day") return { ...error, dday_day: value === "" }
					else if (name === "rfnd_rate") return { ...error, rfnd_rate: value === "" }
				} else {
					return { ...error}
				}
			})
		)

		// 각 항목별 입력값 validation 정규식
		if (name !== "dday_name") {
			let numberReg =
				(name === "dday_day") ? /^(-?)[0-9]*$/ : // 기준일(양수, 음수 가능)
					(name === "rfnd_rate") && /^[0-9]*$/; // 환불수수료율(양수만 가능)
			if ( !numberReg.test(value) ) {
				return;
			}
		}

		const editStd = JSON.parse(JSON.stringify(policySlots))
		editStd[idx][name] = value
		setPolicySlots(editStd)
	}

	// 등록 시 표시될 DropDown Change Handler
	const handleDropdownChange = (event) => {

			let value = event.target.value;

		  // 입력 값 있을 경우 에러 초기화
			if (value.length > 0) {
				setErrorDropdown(false)
			}
			setFcltNumb(value)
	}

	// 등록 Handler
	const handleCreate = () => {

		for(let i=0; i < policySlots.length; i++) {
			if(!(policySlots[i].dday_name === "" || policySlots[i].dday_day === "" || policySlots[i].rfnd_rate === "" || fcltNumb === "")) {
				if(i == policySlots.length - 1) {
					handleClose();
					refundPolicyRepository.createRefundPolicy(fcltNumb,{
						policyList: policySlots
					}).then(result => {
						handleAlertToggle(
							"isOpen",
							"환불규정 등록",
							"환불규정 등록을 완료하였습니다.",
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
								getFacilityList(pageInfo.page, pageInfo.size);
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
					continue;
				}
			} else {
				// 환불정책 입력 슬롯에 대한 Validation 적용 (Empty)
				setErrors((prevErrors) =>
					prevErrors.map((error, eIdx) => {
						return {
							...error,
							dday_name: policySlots[eIdx].dday_name === "",
							dday_day: policySlots[eIdx].dday_day === "",
							rfnd_rate: policySlots[eIdx].rfnd_rate === ""
						}
					})
				)
				// 시설 Dropdown에 대한 Validation 적용 (Empty)
				setErrorDropdown(fcltNumb === "")
				break;
			}
		}
	};

	// 수정 Handler
	const handleEdit = () => {

		for(let i=0; i < policySlots.length; i++) {
			if(!(policySlots[i].dday_name === "" || policySlots[i].dday_day === "" || policySlots[i].rfnd_rate === "")) {
				if(i == policySlots.length - 1) {
					handleClose();
					refundPolicyRepository.updateRefundPolicy(fcltNumb,{
						policyList: policySlots
					}).then(result => {
						handleAlertToggle(
							"isOpen",
							"환불규정 수정",
							"환불규정 수정을 완료하였습니다.",
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
								getFacilityList(pageInfo.page, pageInfo.size);
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
					continue;
				}
			} else {
				// 환불정책 입력 슬롯에 대한 Validation 적용 (Empty)
				setErrors((prevErrors) =>
					prevErrors.map((error, eIdx) => {
						return {
							...error,
							dday_name: policySlots[eIdx].dday_name === "",
							dday_day: policySlots[eIdx].dday_day === "",
							rfnd_rate: policySlots[eIdx].rfnd_rate === ""
						}
					})
				)
				break;
			}
		}
	}

	return (
		<MC.Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
			<MC.DialogTitle id="form-dialog-title">취소/환불규정 {isEdit ? '수정' : '등록'}</MC.DialogTitle>
			<MC.DialogContent>
				{/*등록일때만 시설 Dropdown 노출*/}
				{!isEdit &&
					<MC.FormControl fullWidth className={classes.fcltDropdown}>
						<MC.TextField
							select
							name="fclt_numb"
							label="시설"
							value={fcltNumb || "0000"}
							onChange={handleDropdownChange}
							variant="outlined"
							error={errorDropdown}
						>
							{
								fcltNumbList.map((fclt, index) => (
									<MC.MenuItem key={index} value={fclt.fclt_numb}>{fclt.fclm_name}</MC.MenuItem>
								))
							}
						</MC.TextField>
					</MC.FormControl>
				}
				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={2}>
						<MC.Button
							variant={"outlined"}
							color="primary"
							onClick={addSlot}
							className={classes.addButton}
							disabled={policySlots.length >= 3}
						>
							추가
						</MC.Button>
					</MC.Grid>
					<MC.Grid item xs={12} md={10}>
						<MC.Typography variant="body2">
							기준일 입력시 D-DAY 이전일땐 1, 이후일땐 -1 처럼 입력
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>

				<MC.Table>
					<MC.TableBody>
						{policySlots && policySlots.map((policy, idx) => {
							return (
								<MC.TableRow key={idx}>
									<MC.TableCell>
										<MC.TextField
											error={errors[idx].dday_name}
											id={`dday_name${idx}`}
											name="dday_name"
											label={"환불기준"}
											placeholder={"ex) 이틀 후"}
											value={policy.dday_name || ""}
											onChange={handleInputChange(idx)} />
									</MC.TableCell>
									<MC.TableCell>
										<MC.TextField
											error={errors[idx].dday_day}
											id={`dday_day${idx}`}
											name="dday_day"
											label="기준일"
											placeholder={"ex) -2"}
											value={policy.dday_day || ""}
											onChange={handleInputChange(idx)} />
									</MC.TableCell>
									<MC.TableCell>
										<MC.TextField
											error={errors[idx].rfnd_rate}
											id={`rfnd_rate${idx}`}
											name="rfnd_rate"
											label="환불수수료율"
											placeholder={"ex) 100"}
											value={policy.rfnd_rate || ""}
											onChange={handleInputChange(idx)} />
										{idx === 0 ? '' :
											<MC.Button
												style={{
													color: palette.primary.main,
													borderColor: palette.primary.main,
													marginLeft: 10,
													borderTopLeftRadius: 4,
													borderBottomLeftRadius: 4
												}}
												onClick={() => removeSlot(idx)}>
												삭제
											</MC.Button>
										}
									</MC.TableCell>
								</MC.TableRow>
							)
						})
						}
					</MC.TableBody>
				</MC.Table>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={handleClose} color="primary">
					취소
				</MC.Button>
				<MC.Button onClick={isEdit ? handleEdit : handleCreate} color="primary">
					{
						isEdit ? '수정' : '등록'
					}
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	)
}

export default RefundPolicyModal
