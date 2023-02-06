import * as MS                                         from "@material-ui/styles";
import * as MC                                         from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils           from "@date-io/moment";
import React						     from "react";
import { regSchdRepository } from "../../../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	keyboardDatePicker:    {
		width: "100%"
	},
	keyboardTimePicker: {
		width: "100%",
	},
	formControl:                {
		margin:       theme.spacing(1)
	},
}));

const RegSchdModal = props => {

	const classes = useStyles();
	const {open, setOpen, handleClose, isEdit, regSchdInfo, setRegSchdInfo, fcltList, regTypeList, alertOpens, setAlertOpens, handleAlertToggle, getRegSchdList, pageInfo, errors, setErrors} = props;


	const handleDateChange = (key, date) => {

		setRegSchdInfo(prev => {
			return {
				...prev,
				[key]: date.format('YYYY-MM-DD')
			};
		});
	};

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		if(name === "schd_strt_time") {
			value = value.concat(':00')
			//시작 시간 필드: 날짜 같을 경우 시간 비교하여 시작 시간이 끝 시간보다 이후일 때 에러 표시
			if(regSchdInfo.schd_strt_date == regSchdInfo.schd_end_date) {
				let startTimeSplit = value.split(':').map(Number)
				let endTimeSplit = regSchdInfo.schd_end_time.split(':').map(Number)
				let startDate = new Date(2021, 1, 1, startTimeSplit[0], startTimeSplit[1], startTimeSplit[2])
				let endDate = new Date(2021, 1, 1, endTimeSplit[0], endTimeSplit[1], endTimeSplit[2])
				if(startDate >= endDate) {
					setErrors({schd_strt_time: true, schd_end_time: false})
				} else {
					setErrors({schd_strt_time: false, schd_end_time: false})
				}
			}
		} else if(name === "schd_end_time") {
			value = value.concat(':59')
			//끝 시간 필드: 날짜 같을 경우 시간 비교하여 시작 시간이 끝 시간보다 이후일 때 에러 표시
			if(regSchdInfo.schd_strt_date == regSchdInfo.schd_end_date) {
				let startTimeSplit = regSchdInfo.schd_strt_time.split(':').map(Number)
				let endTimeSplit = value.split(':').map(Number)
				let startDate = new Date(2021, 1, 1, startTimeSplit[0], startTimeSplit[1], startTimeSplit[2])
				let endDate = new Date(2021, 1, 1, endTimeSplit[0], endTimeSplit[1], endTimeSplit[2])
				if(startDate >= endDate) {
					setErrors({schd_strt_time: false, schd_end_time: true})
				} else {
					setErrors({schd_strt_time: false, schd_end_time: false})
				}
			}
		}
		setRegSchdInfo(prev => {
			return {
				...prev,
				[name]: value
			}
		})
	};

	const handleCreate = () => {
		if(!errors.schd_strt_time && !errors.schd_end_time) {
			handleClose();
			regSchdRepository.createRegSchd(regSchdInfo)
				.then(result => {
					handleAlertToggle(
						"isOpen",
						"신청기간 등록",
						"신청기간 등록을 완료하였습니다.",
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							getRegSchdList();
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
		}
	};

	const handleEdit = () => {
		if (!errors.schd_strt_time && !errors.schd_end_time) {
			handleClose();
			regSchdRepository.updateRegSchd(regSchdInfo.fclt_numb, regSchdInfo.schd_clss, {
				schd_numb: regSchdInfo.schd_numb,
				schd_strt_date: regSchdInfo.schd_strt_date,
				schd_end_date: regSchdInfo.schd_end_date,
				schd_strt_time: regSchdInfo.schd_strt_time,
				schd_end_time: regSchdInfo.schd_end_time
			}).then(result => {
				handleAlertToggle(
					"isOpen",
					"신청기간 수정",
					"신청기간 수정을 완료하였습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						getRegSchdList(pageInfo.page, pageInfo.size);
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
		}
	}

	return (
		<MC.Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
			<MC.DialogTitle id="form-dialog-title">신청기간 등록</MC.DialogTitle>
			<MC.DialogContent>
				<MC.FormControl fullWidth className={classes.formControl}>
					<MC.TextField
						select
						name="fclt_numb"
						label="시설"
						disabled={isEdit}
						value={regSchdInfo.fclt_numb || "0000"}
						onChange={handleChange}
						variant="outlined">
						{
							fcltList.map((fclt, index) => (
								<MC.MenuItem key={index} value={fclt.fclt_numb}>{fclt.fclm_name}</MC.MenuItem>
							))
						}
					</MC.TextField>
				</MC.FormControl>

				<MC.Table>
					<MC.TableBody>
						<MC.TableRow>
							<MC.TableCell rowSpan={2}>
								<MC.TextField
									select
									name="schd_clss"
									label="예약유형"
									disabled={isEdit}
									value={regSchdInfo.schd_clss || "1000"}
									onChange={handleChange}
									variant="outlined">
									{
										regTypeList.map((regType, index) => (
											<MC.MenuItem key={index} value={regType.commcode}>{regType.commname}</MC.MenuItem>
										))
									}
								</MC.TextField>
							</MC.TableCell>
							<MC.TableCell>
								<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									<MC.Grid container spacing={1}>
										<MC.Grid item xs={12} md={5}>
											<KeyboardDatePicker
												autoOk
												variant="inline"
												margin="normal"
												id="schd-strt-date"
												format="yyyy/MM/DD"
												label="시작일"
												format="yyyy/MM/DD"
												disableToolbar
												maxDate={regSchdInfo.schd_end_date}
												value={regSchdInfo.schd_strt_date || new Date()}
												onChange={(date, value) => handleDateChange("schd_strt_date", date)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker}/>
										</MC.Grid>
										<MC.Grid item xs={2} md={2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
											&nbsp; ~ &nbsp;
										</MC.Grid>
										<MC.Grid item xs={12} md={5}>
											<KeyboardDatePicker
												autoOk
												variant="inline"
												margin="normal"
												id="schd-end-date"
												label="종료일"
												format="yyyy/MM/DD"
												disableToolbar
												minDate={regSchdInfo.schd_strt_date}
												value={regSchdInfo.schd_end_date || new Date()}
												onChange={(date, value) => handleDateChange("schd_end_date", date)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker}/>
										</MC.Grid>
									</MC.Grid>
								</MuiPickersUtilsProvider>
							</MC.TableCell>
						</MC.TableRow>
						<MC.TableRow>
							<MC.TableCell>
								<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									<MC.Grid container spacing={1}>
										<MC.Grid item xs={12} md={5}>
											<MC.TextField
												error={errors.schd_strt_time}
												id="schd_strt_time"
												name="schd_strt_time"
												label="시작시간"
												type="time"
												defaultValue={regSchdInfo.schd_strt_time ? regSchdInfo.schd_strt_time.slice(0, 5) : "08:30:00"}
												className={classes.keyboardTimePicker}
												InputLabelProps={{
													shrink: true,
												}}
												onChange={handleChange}
											/>
										</MC.Grid>
										<MC.Grid item xs={2} md={2}
														 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
											&nbsp; ~ &nbsp;
										</MC.Grid>
										<MC.Grid item xs={12} md={5}>
											<MC.TextField
												error={errors.schd_end_time}
												id="schd_end_time"
												name="schd_end_time"
												label="종료시간"
												type="time"
												defaultValue={regSchdInfo.schd_end_time ? regSchdInfo.schd_end_time.slice(0, 5) : "22:59:59"}
												className={classes.keyboardTimePicker}
												InputLabelProps={{
													shrink: true,
												}}
												onChange={handleChange}
											/>
										</MC.Grid>
									</MC.Grid>
								</MuiPickersUtilsProvider>
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
}

export default RegSchdModal
