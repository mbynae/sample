import React                                               from "react";

import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";

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
	formControl:       {
		marginBottom:		10
	}
}));

const ParkingCarMgntEditForm = props => {
	const classes = useStyles();

	const { isEdit, parkingCar: obj, setParkingCar: setObj, errors, setErrors,
		carTypeList, carClssList, carStatList, parkTypeList,
		dongList, hoList, getHoNumList} = props;

	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		// 입력 값 있을 경우 에러 초기화
		setErrors(prev => {
			if (name === "car_numb") return {...prev, car_numb: value === ""};
			else if (name === "car_name") return {...prev, car_name: value === ""};
			else if (name === "car_type") return {...prev, car_type: value === ""};
			else if (name === "car_clss") return {...prev, car_clss: value === ""};
			else if (name === "car_stat") return {...prev, car_stat: value === ""};
			else if (name === "park_type") return {...prev, park_type: value === ""};
			else if (name === "dong_numb") return {...prev, dong_numb: value === ""};
			else if (name === "ho_numb") return {...prev, ho_numb: value === ""};
			else return {...prev}
		});

		// 동 값이 입력 되었을 때 호 Dropdown List 출력 함수 호출
		if (name === "dong_numb") {
			getHoNumList(value);
		}


		setObj(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	// 각 Input Field에 대한 Render 함수
	const renderInput = (key, label, disabled, value, error) => {
		return (
			<MC.Grid item xs={12} md={6}>
				<MC.FormControl fullWidth className={classes.formControl} error={error}>
					<MC.InputLabel htmlFor={key}>{label}</MC.InputLabel>
					<MC.Input
						id={key}
						name={key}
						value={value || ""}
						disabled={disabled}
						onChange={handleChange} />
				</MC.FormControl>
			</MC.Grid>
		)
	}

	// 각 Dropdown Field에 대한 Render 함수
	const renderDropdown = (key, label, list, value, error) => {
		return (
			<MC.Grid item xs={12} md={6}>
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
				title={"차량정보 입력"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={3}>

						{!isEdit &&
							<>
						{/*동*/}
						<MC.Grid item xs={12} md={6} className={classes.gridItem}>
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

						{/*호*/}
						<MC.Grid item xs={12} md={6} className={classes.gridItem}>
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
							</>
						}
						{/*차량 번호*/}
						{renderInput("car_numb", "차량번호", false, obj.car_numb, errors.car_numb)}

						{/*차량 이름*/}
						{renderInput("car_name", "차량이름", false, obj.car_name, errors.car_name)}

						{/*차량 구분*/}
						{isEdit && renderDropdown("car_type", "차량구분", carTypeList, obj.car_type, errors.car_type)}

						{/*차량 유형*/}
						{isEdit && renderDropdown("car_clss", "차량유형", carClssList, obj.car_clss, errors.car_clss)}

						{/*주차 차량 상태*/}
						{isEdit && renderDropdown("car_stat", "주차차량상태", carStatList, obj.car_stat, errors.car_stat)}

						{/*주차 이용 유형*/}
						{isEdit && renderDropdown("park_type", "주차이용유형", parkTypeList, obj.park_type, errors.park_type)}

					</MC.Grid>
				</form>
			</MC.CardContent>
		</MC.Card>
	)
}

export default ParkingCarMgntEditForm;
