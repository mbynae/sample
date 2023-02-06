import React                                               from "react";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                         from "@date-io/moment";
import moment                                              from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	cardHeader:        {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:       {},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	attachLayout:      {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	},
	keyboardDatePicker:{
		width:					"100%"
	},
	gridItem:          {
		padding: 				"0px 10px 10px 10px !important"
	}
}));

const VisitingCarEditForm = props => {
	const classes = useStyles();

	const { isEdit, visitingCar: obj, setVisitingCar: setObj, errors, setErrors,
		parkUseClssList, parkUseStatList, parkCyclCodeList, vistCodeList,
		dongList, hoList, getHoNumList} = props;

	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		// 입력 값 있을 경우 에러 초기화
		setErrors(prev => {
			if (name === "park_use_clss") return {...prev, park_use_clss: value === ""};
			else if (name === "park_use_stat") return {...prev, park_use_stat: value === ""};
			else if (name === "park_cycl_code") return {...prev, park_cycl_code: value === ""};
			else if (name === "vist_code") return {...prev, vist_code: value === ""};

			else if (name === "dong_numb") return {...prev, dong_numb: value === ""};
			else if (name === "ho_numb") return {...prev, ho_numb: value === ""};
			else if (name === "car_numb") return {...prev, car_numb: value === ""};
			else return {...prev}
		});

		// 동 값이 입력 되었을 때 호 Dropdown List 출력 함수 호출
		if (name === "dong_numb") {
			getHoNumList(value);
		}

		// 방문목적 값이 변경 되었을 때 기타방문목적 필드 초기화
		if (name === "vist_code") {
			setObj(prev => {
				return {
					...prev,
					vist_purp: ""
				};
			});
		}

		setObj(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	const getDate = (date, isFrom) => moment(date).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const handleDateChange = (key, date, value, isFrom) => {
		setObj(prev => {
			return {
				...prev,
				[key]: getDate(date, isFrom)
			};
		});
	};

	// 각 Dropdown Field에 대한 Render 함수
	const renderDropdown = (key, label, list, value, error, gridSizeXS, gridSizeMD) => {
		return (
			<MC.Grid item xs={gridSizeXS} md={gridSizeMD} className={classes.gridItem}>
				<MC.FormControl fullWidth className={classes.formControl} error={error}>
					<MC.InputLabel id={key}>{label}</MC.InputLabel>
					<MC.Select
						labelId={key}
						name={key}
						id={key}
						defaultValue={""}
						value={value || ""}
						onChange={handleChange}>
						{list.map((item, index) =>
							<MC.MenuItem key={index} value={item.commcode}>{item.comminfo}</MC.MenuItem>
						)}
					</MC.Select>
				</MC.FormControl>
			</MC.Grid>
		)
	}

	return (
		<MC.Card>
			<MC.CardHeader
				title={"방문차량예약 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>

						{/*// --------------------------NOT USE---------------------------- //*/}
						{/*주차 차량 번호 (등록 시에만 표시)*/}
						{/*<MC.Grid item xs={12} md={12} className={classes.gridItem} style={{marginTop: 15}}>*/}
						{/*	<MC.Grid container alignItems={"center"} spacing={3}>*/}
						{/*		<MC.Grid item xs={12} md={1}>*/}
						{/*			주차차량번호*/}
						{/*		</MC.Grid>*/}
						{/*		<MC.Grid item xs={12} md={1}>*/}
						{/*			<MC.Button*/}
						{/*				color={"primary"}*/}
						{/*				size={"small"}*/}
						{/*				onClick={showFindingCarModal}*/}
						{/*				variant={"outlined"}>*/}
						{/*				찾기*/}
						{/*			</MC.Button>*/}
						{/*		</MC.Grid>*/}
						{/*		<MC.Grid item xs={12} md={4}>*/}
						{/*			<MC.Typography variant={"subtitle2"}>*/}
						{/*				{obj.car_numb}*/}
						{/*			</MC.Typography>*/}
						{/*		</MC.Grid>*/}
						{/*	</MC.Grid>*/}
						{/*</MC.Grid>*/}

						{/* 등록 시에만 동, 호, 차량 번호 입력 */}
						{!isEdit &&
						<>
							{/*동 선택*/}
							<MC.Grid item xs={12} md={3} className={classes.gridItem}>
								<MC.FormControl fullWidth className={classes.formControl} error={errors.dong_numb}>
									<MC.InputLabel id="dong_numb">동</MC.InputLabel>
									<MC.Select
										labelId="dong_numb"
										name="dong_numb"
										id="dong_numb"
										defaultValue={""}
										disabled={isEdit}
										value={obj.dong_numb || ""}
										onChange={handleChange}>
										{dongList.map((item, index) =>
											<MC.MenuItem key={index} value={item.dong_numb}>{item.dong_numb}</MC.MenuItem>
										)}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>

							{/*호 선택*/}
							<MC.Grid item xs={12} md={3} className={classes.gridItem}>
								<MC.FormControl fullWidth className={classes.formControl} error={errors.ho_numb}>
									<MC.InputLabel id="ho_numb">호</MC.InputLabel>
									<MC.Select
										labelId="ho_numb"
										name="ho_numb"
										id="ho_numb"
										defaultValue={""}
										disabled={obj.dong_numb === ""}
										value={obj.ho_numb || ""}
										onChange={handleChange}>
										{hoList.map((item, index) =>
											<MC.MenuItem key={index} value={item.ho_numb}>{item.ho_numb}</MC.MenuItem>
										)}
									</MC.Select>
									{obj.dong_numb === "" && <MC.FormHelperText>동을 먼저 선택해주세요.</MC.FormHelperText>}
								</MC.FormControl>
							</MC.Grid>

							{/*차량 번호*/}
							<MC.Grid item xs={12} md={6} className={classes.gridItem}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="car_numb"
										name="car_numb"
										label={"차량 번호"}
										placeholder={"차량 번호를 입력해주세요."}
										value={obj.car_numb || ""}
										error={errors.car_numb}
										onChange={handleChange}/>
								</MC.FormControl>
							</MC.Grid>

						</>
						}

						{/*주차 이용 구분*/}
						{renderDropdown("park_use_clss", "주차이용구분", parkUseClssList, obj.park_use_clss, errors.park_use_clss, 12, 6)}

						{/*주차 이용 상태*/}
						{renderDropdown("park_use_stat", "주차이용상태", parkUseStatList, obj.park_use_stat, errors.park_use_stat, 12, 6)}

						{/*주차 이용 단위 코드*/}
						{renderDropdown("park_cycl_code", "주차이용단위", parkCyclCodeList, obj.park_cycl_code, errors.park_cycl_code, 12, 6)}

						{/*방문목적*/}
						{renderDropdown("vist_code", "방문목적", vistCodeList, obj.vist_code, errors.vist_code, 4, 2)}

						{/*기타 방문목적*/}
						<MC.Grid item xs={8} md={4} className={classes.gridItem}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="vist_purp"
									name="vist_purp"
									disabled={obj.vist_code !== "GT"}
									label={"기타 방문목적"}
									placeholder={"방문 목적을 입력해주세요."}
									value={obj.vist_purp || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>

						{/*방문일시*/}
							<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									{/*방문일 (시작)*/}
									<MC.Grid item xs={6} md={6} className={classes.gridItem}>
										<KeyboardDateTimePicker
											autoOk
											openTo="date"
											ampm={false}
											views={["date", "hours"]}
											variant="inline"
											margin="normal"
											id="park_strt_dttm"
											label="방문일시(시작)"
											format="yyyy/MM/DD HH시"
											disableToolbar
											maxDate={obj.park_end_dttm || new Date()}
											value={obj.park_strt_dttm || new Date()}
											onChange={(date, value) => handleDateChange("park_strt_dttm", date, value, true)}
											KeyboardButtonProps={{
												"aria-label": "change date"
											}}
											className={classes.keyboardDatePicker} />
									</MC.Grid>
									{/*<MC.Grid item xs={2} md={2}*/}
									{/*				 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>*/}
									{/*	&nbsp; ~ &nbsp;*/}
									{/*</MC.Grid>*/}

									{/*방문일 (종료)*/}
									<MC.Grid item xs={6} md={6} className={classes.gridItem}>
										<KeyboardDateTimePicker
											autoOk
											openTo="date"
											ampm={false}
											views={["date", "hours"]}
											variant="inline"
											margin="normal"
											id="park_end_dttm"
											label="방문일시(종료)"
											format="yyyy/MM/DD HH시"
											disableToolbar
											minDate={obj.park_strt_dttm || new Date()}
											value={obj.park_end_dttm || new Date()}
											onChange={(date, value) => handleDateChange("park_end_dttm", date, value, false)}
											KeyboardButtonProps={{
												"aria-label": "change date"
											}}
											className={classes.keyboardDatePicker} />
									</MC.Grid>
							</MuiPickersUtilsProvider>
					</MC.Grid>
				</form>

			</MC.CardContent>
		</MC.Card>
	);
};

export default VisitingCarEditForm;
