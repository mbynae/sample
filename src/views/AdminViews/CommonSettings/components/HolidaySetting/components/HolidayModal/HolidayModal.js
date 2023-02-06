import React, { useEffect, useState } from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { commonCodeRepository, holidayRepository } from "../../../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	container: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexWrap: "wrap",
	},
	keyboardDatePicker: {
		width: "100%"
	},
	timePicker: {
		width: 200,
	},
}));

const HolidayModal = props => {

	const classes = useStyles();
	const {
		open,
		setOpen,
		handleClose,
		isEdit,
		alertOpens,
		setAlertOpens,
		handleAlertToggle,
		holidayInfo,
		setHolidayInfo,
		holidayDivision,
		getHolidayList,
		pageInfo
	} = props;
	const [dayOfWeek, setDayOfWeek] = useState([]);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getDayOfWeek();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	// 요일 정보 조회
	const getDayOfWeek = () => {
		commonCodeRepository.getGrpCode("C100")
			.then(result => {
				setDayOfWeek(result.data_json_array);
			});
	};

	// 휴일정보 초기화
	const holidayInitialize = (holiType) => {
		if (holiType === "DY") {
			setHolidayInfo(prev => {
				return {
					...prev,
					holi_date: new Date(),
					holi_type_name: "일자",
					holi_type: "DY",
					holi_name: "",
					holi_strt_time: "",
					holi_end_time: "",
					holi_dayw: "",
					cycl_at: "N"
				};
			});
		} else if (holiType === "WD") {
			setHolidayInfo(prev => {
				return {
					...prev,
					holi_date: "",
					holi_type_name: "요일",
					holi_type: "WD",
					holi_name: "",
					holi_strt_time: "",
					holi_end_time: "",
					holi_dayw: "1",
					cycl_at: "Y"
				};
			});
		} else if (holiType === "TM") {
			setHolidayInfo(prev => {
				return {
					...prev,
					holi_date: "",
					holi_type_name: "시간",
					holi_type: "TM",
					holi_name: "",
					holi_strt_time: "09:30:00",
					holi_end_time: "18:30:59",
					holi_dayw: "",
					cycl_at: "N"
				};
			});
		}
	};

	const handleDateChange = (key, date) => {
		setHolidayInfo(prev => {
			return {
				...prev,
				[key]: date.format("YYYY-MM-DD")
			};
		});
	};

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		if (name === "holi_type") {
			// 구분 변경시 휴일정보 초기화
			holidayInitialize(value);
		} else {

			// 시간 변경일 경우 포맷 수정
			if (name === "holi_strt_time") {
				value = value.concat(":00");

			} else if (name === "holi_end_time") {
				value = value.concat(":59");
			}

			setHolidayInfo(prev => {
				return {
					...prev,
					[name]: value
				};
			});
		}
	};

	const handleCreate = () => {
		setOpen(false);
		holidayRepository.createHoliday({
			fclt_numb: "0000",
			...holidayInfo
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"휴일 등록",
				"휴일 등록을 완료하였습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					getHolidayList();
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
	};

	const handleEdit = () => {
		setOpen(false);
		holidayRepository.updateHoliday(holidayInfo)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"휴일 수정",
					"휴일 수정을 완료하였습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						getHolidayList(pageInfo.page, pageInfo.size);
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
	};

	return (
		<MC.Dialog maxWidth={"sm"} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<MC.DialogTitle id="form-dialog-title">
				{isEdit ? "휴일 수정" : "휴일 등록"}
			</MC.DialogTitle>
			<MC.DialogContent>
				<MC.TextField
					select
					fullWidth
					name="holi_type"
					label="구분"
					disabled={isEdit}
					value={holidayInfo.holi_type || "DY"}
					onChange={handleChange}
					variant="outlined">
					{
						isEdit ?
							<MC.MenuItem value={holidayInfo.holi_type}>{holidayInfo.holi_type_name}</MC.MenuItem>
							:
							holidayDivision.map((division, index) => (
								<MC.MenuItem key={index} value={division.commcode}>{division.commname}</MC.MenuItem>
							))
					}
				</MC.TextField>

				<MC.Typography style={{marginTop: 13, fontSize: 12, fontWeight: 500}}>휴일 명칭</MC.Typography>
				<MC.TextField
					fullWidth
					name="holi_name"
					placeholder="휴일 명칭을 입력해주세요."
					value={holidayInfo.holi_name || ""}
					onChange={handleChange}
					variant="outlined"
					style={{marginTop: 2}}
				>
				</MC.TextField>
				{
					holidayInfo.holi_type === "DY" ?	// 일자
						<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
							<KeyboardDatePicker
								autoOk
								variant="inline"
								margin="normal"
								id="holi_date"
								label="휴일"
								format="yyyy/MM/DD"
								disableToolbar
								// maxDate={holidayInfo.holi_date || new Date()}
								value={holidayInfo.holi_date || new Date()}
								onChange={(date) => handleDateChange("holi_date", date)}
								KeyboardButtonProps={{
									"aria-label": "change date"
								}}
								className={classes.keyboardDatePicker}/>
						</MuiPickersUtilsProvider>

						: holidayInfo.holi_type === "WD" ?	// 요일
							<MC.RadioGroup
								row
								aria-label={"payment-method"}
								name={"holi_dayw"}
								onChange={handleChange}
								value={holidayInfo.holi_dayw || "1"}
								style={{marginTop: 10}}
							>
								{
									dayOfWeek.map((day, index) => (
										<MC.FormControlLabel key={index} label={day.commname}
																				 control={<MC.Radio color={"primary"} value={day.commcode}/>}/>
									))
								}
							</MC.RadioGroup>

							: holidayInfo.holi_type === "TM" &&	// 시간
							<MC.Grid container justify={"space-between"} alignItems={"center"} spacing={1}
											 className={classes.container}>
								<MC.Grid item xs={12} sm={5}>
									<MC.TextField
										id="holi_strt_time"
										name="holi_strt_time"
										label="시작시간"
										type="time"
										defaultValue={holidayInfo.holi_strt_time.slice(0, 5)}
										className={classes.timePicker}
										InputLabelProps={{
											shrink: true,
										}}
										onChange={handleChange}
									/>
								</MC.Grid>
								<MC.Grid item xs={2} md={2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
									&nbsp; ~ &nbsp;
								</MC.Grid>
								<MC.Grid item xs={12} sm={5}>
									<MC.TextField
										id="holi_end_time"
										name="holi_end_time"
										label="종료시간"
										type="time"
										defaultValue={holidayInfo.holi_end_time.slice(0, 5)}
										className={classes.timePicker}
										InputLabelProps={{
											shrink: true,
										}}
										onChange={handleChange}
									/>
								</MC.Grid>
							</MC.Grid>

				}

				<MC.FormLabel component="legend">반복여부</MC.FormLabel>
				<MC.RadioGroup
					row
					aria-label="holidayInfo.cycl_at"
					name="cycl_at"
					value={holidayInfo.cycl_at || "N"}
					onChange={handleChange}>
					<MC.FormControlLabel value="Y" control={<MC.Radio/>} label="Y"/>
					{
						holidayInfo.holi_type !== "WD" &&
						<MC.FormControlLabel value="N" control={<MC.Radio/>} label="N"/>
					}
				</MC.RadioGroup>

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
	);
};

export default HolidayModal;
