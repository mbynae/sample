import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";

import { PhoneHyphen } from "../../../../../components";

import { apiObject } from "../../../../../repositories/api";

import addYears from "date-fns/addYears";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import format from "date-fns/format";
import koLocale from "date-fns/locale/ko";
import { split } from "lodash";
import moment from "moment";

import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		borderTop: "2px solid #449CE8",
	},
	cellTitle: {
		backgroundColor: "#f9f9f9",
		width: 150,
		height: 50,
		paddingLeft: 21,
		[theme.breakpoints.down("xs")]: {
			width: 120,
		},
	},
	cellContent: {
		width: 420,
		paddingLeft: 20,
		paddingRight: 20,
		[theme.breakpoints.down("xs")]: {
			width: 208,
			paddingLeft: 15,
			paddingRight: 15,
		},
	},
	body4: {
		...theme.typography.body4,
	},
	datePickerContainer: {
		"& fieldset": {
			// borderRadius: 0
		},
		width: 160,
	},
	datePicker: {
		paddingTop: 8,
		paddingBottom: 8,
		margin: 0,
		height: 20,
	},
	calendarButton: {
		padding: 0,
		paddingTop: 2,
		"& svg": {
			fontSize: 16,
		},
	},
	// preCheckDateTime: {
	// 	"& > * ": {
	// 		margin: theme.spacing(1),
	// 	},
	// },
}));

const PreCheckDetailEditForm = (props) => {
	const classes = useStyles();

	const {
		isEdit,
		isMobile,
		menuKey,
		aptComplex,
		currentUser,
		aptId,
		preCheckDetail,
		setPreCheckDetail,
		errors,
		preCheck,
		UserAptComplexStore,
		PreCheckSignInStore,
		editState,
		setEditState,
	} = props;

	const getPreCheckOpenTime = async (aptId, preCheckDate) => {
		const date = moment(preCheckDate)
			.set("hour", 0)
			.set("minute", 0)
			.set("second", 0)
			.set("millisecond", 0);
		const responseGetPreCheckOpenTime = await apiObject.getPreCheckOpenTime({
			aptId: aptId,
			preCheckDate: new Date(date.unix() * 1000),
		});
		// console.log({ responseGetPreCheckOpenTime });
		const data = responseGetPreCheckOpenTime;
		// // const mock = {
		// // 	id: 106,
		// // 	slot: 2,
		// // 	preCheckStTime: "09:00",
		// // 	preCheckEndTime: "16:00",
		// // 	limitCount: 2,
		// // 	closed: ["11:00", "12:00"],
		// // 	createDate: null,
		// // };
		// // const data = mock;
		const preCheckStTime = Number(split(data.preCheckStTime, ":")[0]);
		const preCheckEndTime = Number(split(data.preCheckEndTime, ":")[0]);

		const openTimeTable = [];
		for (let i = preCheckStTime; i < preCheckEndTime; i += data.slot) {
			const startHour = i < 10 ? `0${i}` : i;
			const endHour = i + data.slot < 10 ? `0${i + data.slot}` : i + data.slot;
			openTimeTable.push({
				label: `${startHour}:00~${endHour}:00`,
				value: `${startHour}:00`,
				closed: Boolean(data.closed.find((x) => x === `${startHour}:00`)),
			});
		}
		setEditState((prev) => ({
			...prev,
			openTimeTable: openTimeTable,
		}));
	};

	const getPrecheckInfo = async ({ aptId, preCheckuserId }) => {
		try {
			const responseGetPreCheckInfo = await apiObject.getPreCheckInfo(aptId);

			const responseGetPreCheckByUserId = await apiObject.getPreCheckByUserId(
				preCheckuserId
			);

			setEditState((prev) => ({
				...prev,
				...responseGetPreCheckInfo,
				preCheckDate: responseGetPreCheckByUserId.preCheckDate ?? Date.now(),
				// openTimeTable: openTimeTable,
			}));
		} catch (error) {
			console.log({ error });
		}
	};

	useEffect(() => {
		getPrecheckInfo({
			aptId: UserAptComplexStore.aptComplex.id,
			preCheckuserId: PreCheckSignInStore.currentUser.id,
		});
	}, []);

	useEffect(() => {
		editState.preCheckDate &&
			getPreCheckOpenTime(
				UserAptComplexStore.aptComplex.id,
				editState.preCheckDate
			);
	}, [editState.preCheckDate]);

	return (
		<MC.Grid
			container
			direction={"row"}
			justify={"center"}
			alignItems={"center"}
			className={classes.root}
		>
			<MC.Grid
				item
				xs={12}
				md={6}
				style={{
					height: 50,
					borderBottom: "1px solid #ebebeb",
				}}
			>
				<MC.Grid
					container
					direction={"row"}
					justify={"flex-start"}
					alignItems={"center"}
				>
					<MC.Grid item className={classes.cellTitle}>
						<MC.Grid
							container
							direction={"row"}
							justify={"flex-start"}
							alignItems={"center"}
							style={{ height: "100%" }}
						>
							<MC.Typography className={classes.body4}>아파트명</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.Typography
							className={classes.body4}
							style={{ color: "#909090" }}
						>
							{aptComplex.aptInformationDataType.aptName}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid
				item
				xs={12}
				md={6}
				style={{ height: 50, borderBottom: "1px solid #ebebeb" }}
			>
				<MC.Grid
					container
					direction={"row"}
					justify={"flex-start"}
					alignItems={"center"}
				>
					<MC.Grid item className={classes.cellTitle}>
						<MC.Grid
							container
							direction={"row"}
							justify={"flex-start"}
							alignItems={"center"}
							style={{ height: "100%" }}
						>
							<MC.Typography className={classes.body4}>동/호</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.Typography
							className={classes.body4}
							style={{ color: "#909090" }}
						>
							{`${currentUser.building}동 ${currentUser.unit}호`}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid
				item
				xs={12}
				md={6}
				style={{ height: 50, borderBottom: "1px solid #ebebeb" }}
			>
				<MC.Grid
					container
					direction={"row"}
					justify={"flex-start"}
					alignItems={"center"}
				>
					<MC.Grid item className={classes.cellTitle}>
						<MC.Grid
							container
							direction={"row"}
							justify={"flex-start"}
							alignItems={"center"}
							style={{ height: "100%" }}
						>
							<MC.Typography className={classes.body4}>이름</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.Typography
							className={classes.body4}
							style={{ color: "#909090" }}
						>
							{currentUser.name}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid
				item
				xs={12}
				md={6}
				style={{ height: 50, borderBottom: "1px solid #ebebeb" }}
			>
				<MC.Grid
					container
					direction={"row"}
					justify={"flex-start"}
					alignItems={"center"}
				>
					<MC.Grid item className={classes.cellTitle}>
						<MC.Grid
							container
							direction={"row"}
							justify={"flex-start"}
							alignItems={"center"}
							style={{ height: "100%" }}
						>
							<MC.Typography className={classes.body4}>
								휴대폰번호
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MC.Typography
							className={classes.body4}
							style={{ color: "#909090" }}
						>
							{PhoneHyphen(currentUser.phoneNumber)}
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			<MC.Grid
				item
				xs={12}
				md={12}
				style={{
					// height: 50,
					borderBottom: "1px solid #ebebeb",
				}}
			>
				<MC.Grid
					container
					direction={"row"}
					justify={"flex-start"}
					alignItems={"center"}
				>
					<MC.Grid
						item
						className={classes.cellTitle}
						style={{ height: isMobile ? 120 : 50 }}
					>
						<MC.Grid
							container
							direction={"row"}
							justify={"flex-start"}
							alignItems={"center"}
							style={{ height: "100%" }}
						>
							<MC.Typography className={classes.body4}>점검일자</MC.Typography>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item className={classes.cellContent}>
						<MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
							<MC.Grid
								container
								direction={"row"}
								justify={"flex-start"}
								alignItems={isMobile ? "flex-start" : "center"}
							>
								<MC.Grid item xs={12} className={classes.preCheckDateTime}>
									<MC.Grid container spacing={1}>
										<MC.Grid item>
											<KeyboardDatePicker
												id="preCheckDate-picker-dialog"
												autoOk
												inputVariant="outlined"
												format="yyyy.MM.dd"
												disablePast
												maxDate={
													editState?.preApplyToDate
														? // ? endOfDay(new Date(editState?.preApplyToDate))
														  new Date(editState?.preApplyToDate)
														: addYears(new Date(), 1)
												}
												value={editState.preCheckDate}
												keyboardIcon={<CalendarTodayOutlinedIcon />}
												KeyboardButtonProps={{
													className: classes.calendarButton,
												}}
												onChange={(date, value) => {
													setEditState((prev) => ({
														...prev,
														preCheckDate: date,
													}));
												}}
												inputProps={{ className: classes.datePicker }}
												InputProps={{ readOnly: true }}
												className={classes.datePickerContainer}
												allowKeyboardControl={false}
												// TextFieldComponent={(props) => (
												// 	<MC.TextField {...props} disabled />
												// )}
											/>
										</MC.Grid>
										<MC.Grid item>
											<MC.TextField
												select
												variant="outlined"
												size="small"
												value={editState.preCheckTime}
												InputProps={{
													style: {
														width: 160,
														color:
															editState.preCheckTime === false
																? "rgb(144, 144, 144)"
																: "inherit",
													},
												}}
												onChange={(e) => {
													setEditState((prev) => ({
														...prev,
														preCheckTime: e.target.value,
													}));
												}}
											>
												<MC.MenuItem value={false} disabled>
													{"선택"}
												</MC.MenuItem>
												{editState.openTimeTable.map((x, i) => (
													<MC.MenuItem
														key={i}
														value={x.value}
														disabled={x.closed}
													>
														{x.closed ? `${x.label}(마감)` : x.label}
													</MC.MenuItem>
												))}
												{/* <MC.MenuItem value={0}>{"12:00 ~ 13:00"}</MC.MenuItem>
												<MC.MenuItem value={1} disabled>
													{"13:00 ~ 14:00"}
												</MC.MenuItem>
												<MC.MenuItem value={2}>{"14:00 ~ 15:00"}</MC.MenuItem> */}
											</MC.TextField>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
						</MuiPickersUtilsProvider>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
		</MC.Grid>
	);
};

export default inject(
	"PreCheckSignInStore",
	"UserAptComplexStore"
)(observer(PreCheckDetailEditForm));
