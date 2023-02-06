import React, { useEffect, useState } from "react";
import moment                         from "moment";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC        from "@material-ui/core";
import * as MS        from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "moment/locale/ko";

import { PreviousLocationCheck }            from "../../../../../components";
import palette                                         from "../../../../../theme/adminTheme/palette";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";

moment.locale("ko");

const useStyles = MS.makeStyles((theme) => ({
	root:                  {
		width:     "100%",
		marginTop: 1
	},
	heading:               {
		fontSize:   theme.typography.pxToRem(15),
		flexBasis:  "15%",
		flexShrink: 0,
		color:      palette.secondary.contrastText
	},
	secondaryHeading:      {
		fontSize: theme.typography.pxToRem(13),
		color:    palette.secondary.contrastText
	},
	formControl:           {
		margin:       theme.spacing(0),
		marginBottom: 10
	},
	buttonGroupLayout:     {
		display:        "flex",
		justifyContent: "center"
	},
	expansionPanelSummary: {
		backgroundColor: palette.info.light
	},
	cardHeader:            {
		color:           palette.icon,
		backgroundColor: palette.info.moreLight
	},
	keyboardDatePicker:    {
		width: "100%"
	}
}));

const ParkingCarMgntSearchBar = props => {
	const classes = useStyles();
	const { ParkingCarMgntStore, getParkingCars } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/parkingCarMgnt") ? dataBinding(ParkingCarMgntStore.parkingCarsSearch) : dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			dong_numb:         searchObj ? searchObj.dong_numb : "",
			ho_numb:           searchObj ? searchObj.ho_numb : "",
			car_numb:          searchObj ? searchObj.car_numb : "",
			strt_date:    		 searchObj ? searchObj.strt_date : dateInit(true),
			end_date:      		 searchObj ? searchObj.end_date : dateInit(false),
			park_type:				 searchObj ? searchObj.park_type : ""
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			ParkingCarMgntStore.setParkingCarsSearch(tempSearchInfo);
			getParkingCars(0, 10);
		} else {
			getParkingCars(ParkingCarMgntStore.pageInfo.page, ParkingCarMgntStore.pageInfo.size);
		}
	}

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);

	// Date 필드 초기화
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);

		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 12);
		} else {
			let monthOfYear = date.month();
			date.month(monthOfYear - 12);
		}

		return date;
	};

	// Date 필드 Change Handler
	const handleDateChange = (key, date, value, isFrom) => {
		setSearchInfo({
			...searchInfo,
			[key]: getDate(date, isFrom)
		});
	}

	// Input 필드 Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		setSearchInfo({
			...searchInfo,
			[name]: value
		});
	}

	// Search Bar 입력값 Submit Handler
	const handleSearchList = event => {
		event.preventDefault();
		ParkingCarMgntStore.setParkingCarsSearch(searchInfo);
		getParkingCars(0, ParkingCarMgntStore.pageInfo.size);
	}

	return (
		<div className={classes.root}>
			<MC.Accordion square>
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon style={{ color: palette.white }} />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<MC.Typography className={classes.heading}>
						차량 정보 검색필터
					</MC.Typography>
					<MC.Typography className={classes.secondaryHeading}>
						검색 하려면 여기를 클릭해주세요.
					</MC.Typography>
				</MC.AccordionSummary>

				<MC.AccordionDetails>
					<form onSubmit={handleSearchList} style={{ width: "100%" }}>
						<MC.Grid
							container
							spacing={3}
							justify={"space-between"}
							alignItems={"flex-start"}>

							<MC.Grid item xs={12} md={12}>
								<MC.Grid container spacing={3}>
									<MC.Grid item xs={6} md={3}>
										{/*동 입력*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="dong_numb">동</MC.InputLabel>
											<MC.Input
												id="dong_numb"
												name="dong_numb"
												endAdornment={<MC.InputAdornment position="end">동</MC.InputAdornment>}
												value={searchInfo.dong_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={3}>
										{/*호 입력*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="ho_numb">호</MC.InputLabel>
											<MC.Input
												id="ho_numb"
												name="ho_numb"
												endAdornment={<MC.InputAdornment position="end">호</MC.InputAdornment>}
												value={searchInfo.ho_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={3}>
										{/*차량번호 입력*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="car_numb"
												name="car_numb"
												label="차량번호"
												placeholder={"차량번호를 입력해주세요.(ex.12가1234)"}
												value={searchInfo.car_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={3}>
										{/*차량구분 입력*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												select
												id="park_type"
												name="park_type"
												label="차량구분"
												value={searchInfo.park_type || ""}
												onChange={handleChange}
											>
												<MC.MenuItem key={"REG"} value={"REG"}>정기 등록 차량</MC.MenuItem>
												<MC.MenuItem key={"VST"} value={"VST"}>방문 등록 차량</MC.MenuItem>
											</MC.TextField>
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							<MC.Grid item xs={12} md={12}>
								<MC.Grid container>
									<MC.Grid item xs={12} md={12}>
										<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
											<MC.Grid container spacing={3} style={{ marginBottom: 10 }}>
												<MC.Grid item xs={6} md={6}>
													{/*시작일 입력*/}
													<KeyboardDatePicker
														autoOk
														variant="inline"
														margin="normal"
														id="strt_date-picker-dialog"
														label="시작일"
														format="yyyy/MM/DD"
														disableToolbar
														maxDate={searchInfo.end_date || new Date()}
														value={searchInfo.strt_date || new Date()}
														onChange={(date, value) => handleDateChange("strt_date", date, value, true)}
														KeyboardButtonProps={{
															"aria-label": "change date"
														}}
														className={classes.keyboardDatePicker} />
												</MC.Grid>
												{/*<MC.Grid item xs={2} md={2}*/}
												{/*				 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>*/}
												{/*	&nbsp; ~ &nbsp;*/}
												{/*</MC.Grid>*/}
												<MC.Grid item xs={6} md={6}>
													{/*종료일 입력*/}
													<KeyboardDatePicker
														autoOk
														variant="inline"
														margin="normal"
														id="end_date-picker-dialog"
														label="종료일"
														format="yyyy/MM/DD"
														disableToolbar
														minDate={searchInfo.strt_date || new Date()}
														value={searchInfo.end_date || new Date()}
														onChange={(date, value) => handleDateChange("end_date", date, value, false)}
														KeyboardButtonProps={{
															"aria-label": "change date"
														}}
														className={classes.keyboardDatePicker} />
												</MC.Grid>
											</MC.Grid>
										</MuiPickersUtilsProvider>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							{/*하단 검색 버튼 그룹*/}
							<MC.Grid item xs={12} md={12}>
								<div className={classes.buttonGroupLayout}>
									<MC.ButtonGroup
										aria-label="text primary button group"
										color="primary">
										<MC.Button
											style={{
												color:       palette.primary.main,
												borderColor: palette.primary.main
											}}
											onClick={() => dataBinding(undefined)}>
											초기화
										</MC.Button>
										<MC.Button
											style={{
												color:       palette.secondary.main,
												borderColor: palette.secondary.main
											}}
											type={"submit"}>
											검색
										</MC.Button>
									</MC.ButtonGroup>
								</div>
							</MC.Grid>

						</MC.Grid>
					</form>
				</MC.AccordionDetails>
			</MC.Accordion>
		</div>
	)
}

export default inject("ParkingCarMgntStore")(withRouter(observer(ParkingCarMgntSearchBar)));
