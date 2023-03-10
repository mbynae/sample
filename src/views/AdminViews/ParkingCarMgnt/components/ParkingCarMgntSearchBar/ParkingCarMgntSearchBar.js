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

	// Date ?????? ?????????
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

	// Date ?????? Change Handler
	const handleDateChange = (key, date, value, isFrom) => {
		setSearchInfo({
			...searchInfo,
			[key]: getDate(date, isFrom)
		});
	}

	// Input ?????? Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		setSearchInfo({
			...searchInfo,
			[name]: value
		});
	}

	// Search Bar ????????? Submit Handler
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
						?????? ?????? ????????????
					</MC.Typography>
					<MC.Typography className={classes.secondaryHeading}>
						?????? ????????? ????????? ??????????????????.
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
										{/*??? ??????*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="dong_numb">???</MC.InputLabel>
											<MC.Input
												id="dong_numb"
												name="dong_numb"
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={searchInfo.dong_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={3}>
										{/*??? ??????*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="ho_numb">???</MC.InputLabel>
											<MC.Input
												id="ho_numb"
												name="ho_numb"
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={searchInfo.ho_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={3}>
										{/*???????????? ??????*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="car_numb"
												name="car_numb"
												label="????????????"
												placeholder={"??????????????? ??????????????????.(ex.12???1234)"}
												value={searchInfo.car_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={3}>
										{/*???????????? ??????*/}
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												select
												id="park_type"
												name="park_type"
												label="????????????"
												value={searchInfo.park_type || ""}
												onChange={handleChange}
											>
												<MC.MenuItem key={"REG"} value={"REG"}>?????? ?????? ??????</MC.MenuItem>
												<MC.MenuItem key={"VST"} value={"VST"}>?????? ?????? ??????</MC.MenuItem>
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
													{/*????????? ??????*/}
													<KeyboardDatePicker
														autoOk
														variant="inline"
														margin="normal"
														id="strt_date-picker-dialog"
														label="?????????"
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
													{/*????????? ??????*/}
													<KeyboardDatePicker
														autoOk
														variant="inline"
														margin="normal"
														id="end_date-picker-dialog"
														label="?????????"
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

							{/*?????? ?????? ?????? ??????*/}
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
											?????????
										</MC.Button>
										<MC.Button
											style={{
												color:       palette.secondary.main,
												borderColor: palette.secondary.main
											}}
											type={"submit"}>
											??????
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
