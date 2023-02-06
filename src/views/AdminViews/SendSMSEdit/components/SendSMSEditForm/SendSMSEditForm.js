import React, { useEffect, useState } from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, PhoneHyphen, PhoneMask } from "../../../../../components";
import MomentUtils from "@date-io/moment";
import {
	KeyboardDatePicker,
	KeyboardDateTimePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import moment from "moment";
import clsx from "clsx";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3),
	},
	content: {
		"& > * ": {
			marginTop: theme.spacing(1),
		},
	},
	cardHeader: {
		color: theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight,
	},
	cardContent: {},
	tableCellTitle: {
		width: "15%",
	},
	tableCellDescriptionFull: {
		width: "85%",
		maxWidth: "85%",
	},
	buttonLayoutRight: {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "center",
	},
	rowHeight: {
		marginTop: theme.spacing(2),
	},
	numberInput: {
		"& input[type='number']::-webkit-outer-spin-button": {
			"-webkit-appearance": "none",
			margin: 0,
		},
		"& input[type='number']::-webkit-inner-spin-button": {
			"-webkit-appearance": "none",
			margin: 0,
		},
	},
	formControl: {
		"& legend": {
			fontWeight: "bold",
		},
	},
}));

const SendSMSEditForm = (props) => {
	const classes = useStyles();

	const {
		isEdit,
		sendSMS: obj,
		setSendSMS: setObj,
		aptComplex,
		aoList,
		aoPositions,
		setAOPositions,
		getAOPositions,
		errors,
	} = props;

	const [minDate, setMinDate] = useState();

	useEffect(() => {
		const init = () => {
			newDate();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		if (name.indexOf("userDataType") !== -1) {
			let dotIndex = name.indexOf(".");
			let key = name.substring(dotIndex + 1, name.length);
			setObj((prev) => {
				return {
					...prev,
					userDataType: {
						...prev.userDataType,
						[key]: value,
					},
				};
			});
		} else if (name === "sendTargetType") {
			setObj((prev) => {
				return {
					...prev,
					[name]: value,
					isSendForHouseHolders: value === "HOUSEHOLDERS",
				};
			});
		} else if (name === "sendToAutonomousOrganizationId") {
			let findAO = {
				id: 0,
			};
			if (value > 0) {
				findAO = aoList.find((ao) => ao.id + "" === value + "");
				getAOPositions(value);
			}
			setAOPositions([]);
			setObj((prev) => {
				return {
					...prev,
					sendToAutonomousOrganizationId: findAO.id,
					sendToAOPositionId: "",
				};
			});
		} else if (name === "sendToAOPositionId") {
			let findAO = {
				aoPosition: { id: 0 },
			};
			if (value > 0) {
				findAO = aoPositions.find(
					(groups) => groups.aoPosition.id + "" === value + ""
				);
				delete findAO.aoPosition.autonomousOrganization;
			}
			setObj((prev) => {
				return {
					...prev,
					sendToAOPositionId: findAO.aoPosition.id,
				};
			});
		} else if (name === "content") {
			if (getByteLengthOfUtf8String(value) <= 2000) {
				setObj((prev) => {
					return {
						...prev,
						smsType: getByteLengthOfUtf8String(value) < 81 ? "SMS" : "MMS",
						[name]: value,
					};
				});
			}
		} else {
			setObj((prev) => {
				return {
					...prev,
					[name]: value,
				};
			});
		}
	};

	const getDate = (date, isFrom) =>
		moment(date)
			.hour(isFrom ? 0 : 23)
			.minute(isFrom ? 0 : 59)
			.second(isFrom ? 0 : 59)
			.milliseconds(isFrom ? 0 : 59);

	const handleDateChange = (key, date, value, isFrom) => {
		setObj((prev) => {
			return {
				...prev,
				[key]: date,
			};
		});
	};

	const newDate = () => {
		let date = moment(new Date()).add(1, "days");
		setMinDate(getDate(date.format("YYYY-MM-DD"), true).toDate());
	};

	const getByteLengthOfUtf8String = (string) => {
		let stringByteLength = (function (s, b, i, c) {
			for (
				b = i = 0;
				(c = s.charCodeAt(i++));
				b += c >> 11 ? 3 : c >> 7 ? 2 : 1
			) {}
			return b;
		})(string);
		return stringByteLength;
	};

	return (
		<MC.Card>
			<MC.CardHeader
				title={"문자발송 정보"}
				classes={{
					root: classes.cardHeader,
					title: classes.cardHeader,
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>
						{/*발송형태*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.Grid
								container
								alignItems={"center"}
								style={{ height: "100%" }}
							>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.FormLabel component="legend">발송형태</MC.FormLabel>
									<MC.RadioGroup
										row
										aria-label="sendType"
										name="sendType"
										value={obj.sendType || "SEND_IMMEDIATE"}
										onChange={handleChange}
									>
										<MC.FormControlLabel
											value="SEND_IMMEDIATE"
											control={<MC.Radio />}
											label="즉시전송"
										/>
										<MC.FormControlLabel
											value="SEND_RESERVATION"
											control={<MC.Radio />}
											label="예약전송"
										/>
									</MC.RadioGroup>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>

						{/*예약발송일*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
								<KeyboardDateTimePicker
									autoOk
									inputVariant="outlined"
									margin="normal"
									id="reservationDate-picker-dialog"
									label="예약발송일"
									format="yyyy/MM/DD HH:mm:ss"
									disabled={obj.sendType !== "SEND_RESERVATION"}
									// disableToolbar
									disablePast
									value={
										obj.reservationDate ??
										new Date(new Date().setDate(new Date().getDate() + 1))
									}
									onChange={(date, value) =>
										handleDateChange("reservationDate", date, value, true)
									}
									KeyboardButtonProps={{
										"aria-label": "change date",
									}}
								/>
							</MuiPickersUtilsProvider>
						</MC.Grid>

						{/*발송대상*/}
						<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
							<MC.Grid
								container
								alignItems={"center"}
								style={{ height: "100%" }}
							>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.FormLabel component="legend">발송대상</MC.FormLabel>
									<MC.RadioGroup
										row
										aria-label="sendTargetType"
										name="sendTargetType"
										value={obj.sendTargetType || "TOTAL"}
										onChange={handleChange}
									>
										<MC.FormControlLabel
											value="TOTAL"
											control={<MC.Radio />}
											label="전체"
										/>
										<MC.FormControlLabel
											value="AUTONOMOUS_ORGANIZATION"
											control={<MC.Radio />}
											label="자치기구"
										/>
										<MC.FormControlLabel
											value="BUILDING"
											control={<MC.Radio />}
											label="특정동"
										/>
										<MC.FormControlLabel
											value="HOUSEHOLDERS"
											control={<MC.Radio />}
											label="세대주"
										/>
										<MC.FormControlLabel
											value="INDIVIDUAL"
											control={<MC.Radio />}
											label="직접입력"
										/>
										<MC.FormControlLabel
											value="PRE_CHECK"
											control={<MC.Radio />}
											label="사전점검대상"
										/>
									</MC.RadioGroup>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>

						{/*대상상세*/}
						{obj.sendTargetType === "AUTONOMOUS_ORGANIZATION" ? (
							<>
								{/*소속*/}
								<MC.Grid item xs={12} md={6}>
									<MC.FormControl
										fullWidth
										className={classes.formControl}
										error={errors.isSendToAutonomousOrganizationId}
									>
										<MC.InputLabel id="sendToAutonomousOrganizationId-label">
											소속
										</MC.InputLabel>
										<MC.Select
											labelId="sendToAutonomousOrganizationId-label"
											name="sendToAutonomousOrganizationId"
											id="sendToAutonomousOrganizationId-basic"
											value={obj.sendToAutonomousOrganizationId || 0}
											onChange={handleChange}
										>
											<MC.MenuItem value={0}>소속 없음</MC.MenuItem>
											{aoList &&
												aoList.length > 0 &&
												aoList.map((ao, index) => (
													<MC.MenuItem key={index} value={ao.id}>
														{ao.name}
													</MC.MenuItem>
												))}
										</MC.Select>
									</MC.FormControl>
								</MC.Grid>

								{/*직책*/}
								<MC.Grid item xs={12} md={6}>
									<MC.FormControl
										fullWidth
										className={classes.formControl}
										disabled={!(aoPositions && aoPositions.length > 0)}
									>
										<MC.InputLabel id="sendToAOPositionId-label">
											직책
										</MC.InputLabel>
										<MC.Select
											labelId="sendToAOPositionId-label"
											name="sendToAOPositionId"
											id="sendToAOPositionId-basic"
											value={
												!(aoPositions && aoPositions.length > 0)
													? 0
													: obj.sendToAOPositionId || 0
											}
											onChange={handleChange}
										>
											<MC.MenuItem value={0}>직책 없음</MC.MenuItem>
											{aoPositions &&
												aoPositions.length > 0 &&
												aoPositions.map((group, index) => (
													<MC.MenuItem key={index} value={group.aoPosition.id}>
														{group.aoPosition.name}
													</MC.MenuItem>
												))}
										</MC.Select>
									</MC.FormControl>
								</MC.Grid>
							</>
						) : obj.sendTargetType === "BUILDING" ? (
							<>
								{/*동*/}
								<MC.Grid item xs={12} md={6}>
									<MC.FormControl
										fullWidth
										className={clsx(classes.formControl, classes.numberInput)}
										error={errors.isBuilding}
									>
										<MC.InputLabel htmlFor="building-basic">동</MC.InputLabel>
										<MC.Input
											id="building-basic"
											name="building"
											endAdornment={
												<MC.InputAdornment position="end">동</MC.InputAdornment>
											}
											value={obj.building || ""}
											onChange={handleChange}
										/>
									</MC.FormControl>
								</MC.Grid>
							</>
						) : (
							obj.sendTargetType === "INDIVIDUAL" && (
								<>
									{/*휴대폰번호*/}
									{obj.sendTargetDataTypes.map((sendTargetDataType, index) => (
										<MC.Grid item xs={12} md={6} key={index}>
											<MC.FormControl
												fullWidth
												className={classes.formControl}
												error={errors.isPhoneNumber}
											>
												<MC.InputLabel
													id={`phoneNumber-label-${index}`}
												>{`휴대폰번호 - ${index + 1} 번`}</MC.InputLabel>
												<MC.Input
													size="small"
													labelid={`phoneNumber-label-${index}`}
													id="phoneNumber-input"
													name="phoneNumber"
													value={sendTargetDataType.phoneNumber || ""}
													onChange={(event) => {
														let value = event.target.value;
														setObj((prev) => {
															prev.sendTargetDataTypes[index] = {
																phoneNumber: value,
															};
															return {
																...prev,
															};
														});
													}}
													inputComponent={PhoneMask}
												/>
											</MC.FormControl>
										</MC.Grid>
									))}
								</>
							)
						)}

						{/*내용*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.FormControl
								fullWidth
								className={clsx(classes.formControl, classes.content)}
							>
								<MC.FormLabel component="legend">발송내용</MC.FormLabel>
								<MC.TextField
									name="title"
									variant="outlined"
									error={errors.isContent}
									value={obj.title || ""}
									onChange={handleChange}
								/>
								<MC.TextField
									id="content-basic"
									name="content"
									multiline
									rows={8}
									variant="outlined"
									error={errors.isContent}
									helperText={`${obj.smsType} (${getByteLengthOfUtf8String(
										obj.content || ""
									)}/${obj.smsType === "SMS" ? "80" : "2000"} byte)`}
									value={obj.content || ""}
									onChange={handleChange}
								/>
								<MC.TextField
									name="telephone"
									variant="outlined"
									error={errors.isContent}
									value={obj.telephone || ""}
									onChange={handleChange}
								/>
							</MC.FormControl>
						</MC.Grid>
					</MC.Grid>
				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default SendSMSEditForm;
