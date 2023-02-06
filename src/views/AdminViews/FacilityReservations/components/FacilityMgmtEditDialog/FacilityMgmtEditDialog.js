import React, { useEffect, useState } from "react";
import clsx                           from "clsx";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";

import { facilityMgmtRepository }                                                     from "../../../../../repositories";
import { AlertDialog, HTMLEditor }                                                    from "../../../../../components";
import { DayWeekTypeKind, MaxReservationTypeKind, ReservationTypeKind, TimeTypeKind } from "../../../../../enums";
import MomentUtils                                                                    from "@date-io/moment";
import { KeyboardDatePicker, MuiPickersUtilsProvider }                                from "@material-ui/pickers";

const useStyles = MS.makeStyles(theme => ({
	categoriesLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:           {
		margin: theme.spacing(1)
	},
	listItemLayout:   {
		paddingRight: 96
	}
}));

const FacilityMgmtEditDialog = props => {
	const classes = useStyles();
	
	const { aptId, open, onClose, id } = props;
	const [scroll, setScroll] = React.useState("paper");
	const [tempFacilityMgmt, setTempFacilityMgmt] = useState({});
	const [errors, setErrors] = useState({
		isFacilityTitle:         false,
		isReservationTotalCount: false,
		isDayWeekTypes:          false
	});
	const [toTimeTypeKind, setToTimeTypeKind] = useState([]);
	const [maxReservationMinute, setMaxReservationMinute] = useState(540);
	
	const [isEdit, setIsEdit] = useState(false);
	
	useEffect(() => {
		const init = () => {
			if ( id ) {
				getFacilityMgmt(id);
			} else {
				dataBinding(undefined);
				setIsEdit(false);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, [open]);
	
	const getFacilityMgmt = (id) => {
		facilityMgmtRepository
			.getFacilityMgmt(id)
			.then(result => {
				dataBinding(result);
				setIsEdit(true);
			});
	};
	
	const dataBinding = (obj) => {
		setTempFacilityMgmt(prev => {
			return {
				...prev,
				aptId:                    aptId,
				id:                       obj ? obj.id : "",
				facilityTitle:            obj ? obj.facilityTitle : "",
				isUse:                    obj ? obj.isUse + "" : "true",
				reservationType:          obj ? obj.reservationType : ReservationTypeKind.DAY,
				reservationFromDate:      obj ? obj.reservationFromDate : dateInit(true),
				reservationToDate:        obj ? obj.reservationToDate : dateInit(false),
				dayWeekTypes:             obj ? obj.dayWeekTypes : [],
				fromTimeType:             obj ? obj.fromTimeType : TimeTypeKind.HOUR_09,
				toTimeType:               obj ? obj.toTimeType : TimeTypeKind.HOUR_18,
				maxReservationType:       obj ? obj.maxReservationType : MaxReservationTypeKind.MIN_60,
				reservationTotalCount:    obj ? obj.reservationTotalCount : "",
				facilityInfo:             obj ? obj.facilityInfo : "",
				content:                  obj ? obj.facilityInfo : "",
				residentReservationSlots: obj ? obj.residentReservationSlots : [],
				aptComplex:               obj ? obj.aptComplex : {}
			};
		});
		
		let index = Object.entries(TimeTypeKind).findIndex(data => data[0] === (obj ? obj.fromTimeType : TimeTypeKind.HOUR_09));
		let total = Object.entries(TimeTypeKind).length;
		setToTimeTypeKind(prev => {
			prev = Object.entries(TimeTypeKind).splice(index + 1, total);
			return [...prev];
		});
		obj && changeMaxReservationTypeKind(obj.fromTimeType, obj.toTimeType);
	};
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 3);
		}
		
		return date;
	};
	
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;
		
		if ( name.includes("dayWeekTypes-") ) {
			
			setTempFacilityMgmt(prev => {
				
				let dayWeekType = name.replaceAll("dayWeekTypes-", "");
				
				if ( checked ) {
					prev.dayWeekTypes.push(dayWeekType);
				} else {
					let idx = prev.dayWeekTypes.indexOf(dayWeekType);
					if ( idx > -1 ) {
						prev.dayWeekTypes.splice(idx, 1);
					}
				}
				
				return {
					...prev
				};
			});
		} else if ( name === "toTimeType" ) {
			changeMaxReservationTypeKind(tempFacilityMgmt.fromTimeType, value);
			setTempFacilityMgmt(prev => {
				return {
					...prev,
					[name]: value
				};
			});
		} else if ( name === "fromTimeType" ) {
			let index = Object.entries(TimeTypeKind).findIndex(obj => obj[0] === value);
			let total = Object.entries(TimeTypeKind).length;
			setToTimeTypeKind(prev => {
				prev = Object.entries(TimeTypeKind).splice(index + 1, total);
				return [...prev];
			});
			changeMaxReservationTypeKind(value, tempFacilityMgmt.toTimeType);
			setTempFacilityMgmt(prev => {
				return {
					...prev,
					[name]: value
				};
			});
		} else {
			setTempFacilityMgmt(prev => {
				return {
					...prev,
					[name]: value
				};
			});
		}
		
	};
	
	const changeMaxReservationTypeKind = (fromTimeType = 9, toTimeType = 18) => {
		let fromTime = fromTimeType.replaceAll("HOUR_", "");
		let toTime = toTimeType.replaceAll("HOUR_", "");
		let totalTimeForMinute = (toTime - fromTime) * 60;
		setMaxReservationMinute(totalTimeForMinute);
	};
	
	const handleDateChange = (key, date, value, isFrom) => {
		
		if ( tempFacilityMgmt.reservationType === ReservationTypeKind.DAY ) {
			setTempFacilityMgmt(prev => {
				return {
					...prev,
					[key]: getDate(date, isFrom)
				};
			});
		} else {
			setTempFacilityMgmt(prev => {
				return {
					...prev,
					[key]: isFrom ? getDate(date, isFrom).startOf("month") : getDate(date, isFrom).endOf("month")
				};
			});
		}
		
	};
	
	const handleEdit = () => {
		
		setErrors(prev => {
			return {
				...prev,
				isFacilityTitle:         false,
				isReservationTotalCount: false,
				isDayWeekTypes:          false
			};
		});
		
		if (
			!(
				tempFacilityMgmt.facilityTitle === "" ||
				tempFacilityMgmt.reservationTotalCount === "" ||
				tempFacilityMgmt.reservationType === "DAY" && tempFacilityMgmt.dayWeekTypes.length === 0
			)
		) {
			if ( isEdit ) {
				// 수정
				handleUpdateFacilityMgmt();
			} else {
				// 등록
				handleSaveFacilityMgmt();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isFacilityTitle:         tempFacilityMgmt.facilityTitle === "",
					isReservationTotalCount: tempFacilityMgmt.reservationTotalCount === "",
					isDayWeekTypes:          tempFacilityMgmt.reservationType === "DAY" && tempFacilityMgmt.dayWeekTypes.length === 0
				};
			});
		}
		
	};
	
	const handleSaveFacilityMgmt = () => {
		facilityMgmtRepository.saveFacilityMgmt({
			...tempFacilityMgmt,
			facilityInfo: tempFacilityMgmt.content
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"시설 등록 완료",
				`시설 "${tempFacilityMgmt.facilityTitle}" 을(를) 등록 완료 하였습니다.`,
				() => {
					dataBinding(undefined);
					setAlertOpens({ ...alertOpens, isOpen: false });
					onClose();
				}
			);
		});
	};
	
	const handleUpdateFacilityMgmt = () => {
		facilityMgmtRepository
			.updateFacilityMgmt(tempFacilityMgmt.id, {
				...tempFacilityMgmt,
				facilityInfo: tempFacilityMgmt.content
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"시설 수정 완료",
					`시설 "${tempFacilityMgmt.facilityTitle}" 을(를) 수정 완료 하였습니다.`,
					() => {
						dataBinding(undefined);
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
	
	const handleClose = () => {
		dataBinding(undefined);
		onClose();
	};
	
	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			fullWidth={true}
			scroll={scroll}
			aria-labelledby="form-facilityMgmt-dialog-title">
			
			<MC.DialogTitle id="form-facilityMgmt-dialog-title">
				시설 관리
			</MC.DialogTitle>
			
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					
					{/*시설명*/}
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={classes.formControl}>
							<MC.TextField
								id="facilityTitle-basic"
								name="facilityTitle"
								label={"시설명"}
								error={errors.isFacilityTitle}
								value={tempFacilityMgmt.facilityTitle || ""}
								inputProps={{
									maxLength: 20
								}}
								onChange={handleChange} />
						</MC.FormControl>
					</MC.Grid>
					
					{/*사용여부*/}
					<MC.Grid item xs={6} md={6}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.FormLabel component="legend">사용여부</MC.FormLabel>
								<MC.RadioGroup
									row
									aria-label="isUse"
									name="isUse"
									value={tempFacilityMgmt.isUse || "true"}
									onChange={handleChange}>
									<MC.FormControlLabel value={"true"} control={<MC.Radio />} label="Y" />
									<MC.FormControlLabel value={"false"} control={<MC.Radio />} label="N" />
								</MC.RadioGroup>
							</MC.FormControl>
						</MC.Grid>
					</MC.Grid>
					
					{/*예약유형*/}
					<MC.Grid item xs={6} md={6}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.FormLabel component="legend">예약유형</MC.FormLabel>
								<MC.RadioGroup
									row
									aria-label="reservationType"
									name="reservationType"
									value={tempFacilityMgmt.reservationType || ReservationTypeKind.DAY}
									onChange={handleChange}>
									<MC.FormControlLabel value={ReservationTypeKind.DAY} control={<MC.Radio />} label="일간" />
									<MC.FormControlLabel value={ReservationTypeKind.MONTH} control={<MC.Radio />} label="월간" />
								</MC.RadioGroup>
							</MC.FormControl>
						</MC.Grid>
					</MC.Grid>
					
					<MC.Grid item xs={12} md={12}>
						<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
							<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>
								<MC.Grid item xs={5} md={5}>
									<KeyboardDatePicker
										autoOk
										openTo="year"
										views={tempFacilityMgmt.reservationType === ReservationTypeKind.DAY ? ["year", "month", "date"] : ["year", "month"]}
										variant="inline"
										margin="normal"
										id="reservationFromDate-picker-dialog"
										label="시작일"
										format="yyyy/MM/DD"
										disableToolbar
										disablePast={!isEdit}
										maxDate={tempFacilityMgmt.reservationToDate || new Date()}
										value={tempFacilityMgmt.reservationFromDate || new Date()}
										onChange={(date, value) => handleDateChange("reservationFromDate", date, value, true)}
										KeyboardButtonProps={{
											"aria-label": "change date"
										}}
										className={classes.keyboardDatePicker} />
								</MC.Grid>
								<MC.Grid item xs={2} md={2}
								         style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
									&nbsp; ~ &nbsp;
								</MC.Grid>
								<MC.Grid item xs={5} md={5}>
									<KeyboardDatePicker
										autoOk
										openTo="year"
										views={tempFacilityMgmt.reservationType === ReservationTypeKind.DAY ? ["year", "month", "date"] : ["year", "month"]}
										variant="inline"
										margin="normal"
										id="reservationToDate-picker-dialog"
										label="종료일"
										format="yyyy/MM/DD"
										disableToolbar
										minDate={tempFacilityMgmt.reservationFromDate || new Date()}
										value={tempFacilityMgmt.reservationToDate || new Date()}
										onChange={(date, value) => handleDateChange("reservationToDate", date, value, false)}
										KeyboardButtonProps={{
											"aria-label": "change date"
										}}
										className={classes.keyboardDatePicker} />
								</MC.Grid>
							</MC.Grid>
						</MuiPickersUtilsProvider>
					</MC.Grid>
					
					{/*예약가능요일*/}
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl component="fieldset" className={classes.formControl} error={errors.isDayWeekTypes}>
							<MC.FormLabel component="legend">예약가능요일</MC.FormLabel>
							<MC.FormGroup row>
								{
									Object.entries(DayWeekTypeKind).map((value, index) => {
										return (
											<MC.FormControlLabel
												key={index}
												disabled={tempFacilityMgmt.reservationType === ReservationTypeKind.MONTH}
												control={
													<MC.Checkbox
														checked={tempFacilityMgmt.dayWeekTypes && tempFacilityMgmt.dayWeekTypes.includes(value[0])}
														onChange={handleChange}
														name={"dayWeekTypes-" + value[0]} />
												}
												label={
													value[0] === "MONDAY" ? "월" :
														value[0] === "TUESDAY" ? "화" :
															value[0] === "WEDNESDAY" ? "수" :
																value[0] === "THURSDAY" ? "목" :
																	value[0] === "FRIDAY" ? "금" :
																		value[0] === "SATURDAY" ? "토" :
																			value[0] === "SUNDAY" && "일"
													
												}
											/>
										);
									})
								}
							</MC.FormGroup>
						</MC.FormControl>
					</MC.Grid>
					
					{/*예약 시작시간*/}
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={classes.formControl}>
							<MC.FormLabel component="legend">예약 시작시간</MC.FormLabel>
							<MC.Select
								labelId="fromTimeType-label"
								name="fromTimeType"
								id="fromTimeType-basic"
								defaultValue={""}
								value={tempFacilityMgmt.fromTimeType || ""}
								onChange={handleChange}
							>
								{
									Object.entries(TimeTypeKind).map((value, index) => (
										<MC.MenuItem key={index} value={value[0]}>
											{`${("" + index).length === 1 ? `0${index}` : index} 시`}
										</MC.MenuItem>
									))
								}
							</MC.Select>
						</MC.FormControl>
					</MC.Grid>
					
					{/*예약 종료시간*/}
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={classes.formControl}>
							<MC.FormLabel component="legend">예약 종료시간</MC.FormLabel>
							<MC.Select
								labelId="toTimeType-label"
								name="toTimeType"
								id="toTimeType-basic"
								defaultValue={""}
								value={tempFacilityMgmt.toTimeType || ""}
								onChange={handleChange}
							>
								{
									toTimeTypeKind.map((value, index) => (
										<MC.MenuItem key={index} value={value[0]}>
											{`${("" + value[0].replaceAll("HOUR_", "")).length === 1 ? `0${value[0].replaceAll("HOUR_", "")}` : value[0].replaceAll("HOUR_", "")} 시`}
										</MC.MenuItem>
									))
								}
							</MC.Select>
						</MC.FormControl>
					</MC.Grid>
					
					{/*최대 예약시간*/}
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={classes.formControl}>
							<MC.FormLabel component="legend">최대 예약시간</MC.FormLabel>
							<MC.Select
								labelId="maxReservationType-label"
								name="maxReservationType"
								id="maxReservationType-basic"
								defaultValue={""}
								value={tempFacilityMgmt.maxReservationType || ""}
								onChange={handleChange}
							>
								{
									Object.entries(MaxReservationTypeKind).map((value, index) => {
										let minute = value[0].replaceAll("MIN_", "");
										if ( maxReservationMinute % minute === 0 ) {
											return (
												<MC.MenuItem key={index} value={value[0]}>
													{`${("" + value[0].replaceAll("MIN_", "")).length === 1 ? `0${value[0].replaceAll("MIN_", "")}` : value[0].replaceAll("MIN_", "")} 분`}
												</MC.MenuItem>
											);
										}
									})
								}
							</MC.Select>
						</MC.FormControl>
					</MC.Grid>
					
					{/*슬롯당 예약수*/}
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={classes.formControl}>
							<MC.TextField
								id="reservationTotalCount-basic"
								name="reservationTotalCount"
								label={"슬롯당 예약수"}
								error={errors.isReservationTotalCount}
								value={tempFacilityMgmt.reservationTotalCount || ""}
								inputProps={{
									maxLength: 20
								}}
								onChange={handleChange} />
						</MC.FormControl>
					</MC.Grid>
					
					{/*이용안내*/}
					<MC.Grid item xs={12} md={12}>
						<HTMLEditor
							content={tempFacilityMgmt.content}
							obj={tempFacilityMgmt}
							setObj={setTempFacilityMgmt}
							cheight={200}
						/>
					</MC.Grid>
				
				</MC.Grid>
			
			</MC.DialogContent>
			
			<MC.DialogActions>
				<MC.Button onClick={handleClose}>
					취소
				</MC.Button>
				<MC.Button onClick={handleEdit}>
					{
						id ? "저장" : "등록"
					}
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

export default FacilityMgmtEditDialog;
