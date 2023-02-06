import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import SearchIcon                from "@material-ui/icons/Search";
import CachedIcon                from "@material-ui/icons/Cached";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";

import { PreviousLocationCheck }                                   from "../../../../../components";
import moment                                                      from "moment";
import MomentUtils                                                 from "@date-io/moment";
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const useStyles = MS.makeStyles((theme) => ({
	root:                {
		width: "100%"
	},
	paper:               {
		display:                        "flex",
		alignItems:                     "center",
		width:                          "100%",
		height:                         "auto",
		margin:                         0,
		[theme.breakpoints.down("xs")]: {
			height:        256,
			paddingTop:    20,
			paddingBottom: 26,
			paddingLeft:   14,
			paddingRight:  14
		}
	},
	input:               {
		border:      "1px solid rgba(0,0,0,0.23)",
		paddingLeft: 10,
		flex:        1,
		fontSize:    16,
		height:      40
	},
	searchIconButton:    {
		width:           60,
		height:          60,
		padding:         0,
		backgroundColor: "#449CE8",
		borderRadius:    0,
		"&:hover":       {
			backgroundColor: "rgba(242,128,62,0.5)"
		}
	},
	refreshIconButton:   {
		width:   60,
		height:  60,
		padding: 0,
		// backgroundColor: "#449CE8",
		borderRadius: 0,
		borderLeft:   "1px solid #ebebeb",
		"&:hover":    {
			backgroundColor: "rgba(0,0,0,0.2)"
		}
	},
	datePickerContainer: {
		"& fieldset": {
			borderRadius: 0
		}
	},
	datePicker:          {
		paddingTop:    10,
		paddingBottom: 10,
		margin:        0,
		height:        20
	},
	calendarButton:      {
		padding:    0,
		paddingTop: 2,
		"& svg":    {
			fontSize: 16
		}
	}
}));

const VisitingCarsSearchBar = props => {
	const classes = useStyles();

	const { VisitingCarStore, getVisitingCars, isMobile } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			//PreviousLocationCheck(lastLocation, "/visitingCar/edit") ? dataBinding(VisitingCarStore.visitingCarSearch) : dataBinding(undefined);
			dataBinding(undefined)
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			carNumber:        searchObj ? searchObj.carNumber : "",
			purposeVisitType: searchObj ? searchObj.purposeVisitType : "total",
			visitFromDate:    searchObj ? searchObj.visitFromDate : dateInit(true),
			visitToDate:      searchObj ? searchObj.visitToDate : dateInit(false),
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			VisitingCarStore.setVisitingCarSearch(tempSearchInfo);
			getVisitingCars(1, 10);
		} else {
			getVisitingCars(VisitingCarStore.pageInfo.page === 0 ? 1 : VisitingCarStore.pageInfo.page, VisitingCarStore.pageInfo.size);
		}
	};

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);

	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);

		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 3);
		} else {
			let monthOfYear = date.month();
			date.month(monthOfYear - 3);
		}

		return date;
	};

	const handleDateChange = (key, date, value, isFrom) => {
		setSearchInfo({
			...searchInfo,
			[key]: getDate(date, isFrom)
		});
	};

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setSearchInfo({
			...searchInfo,
			[name]: value
		});
	};

	const handleSearchList = event => {
		event.preventDefault();

		VisitingCarStore.setVisitingCarSearch(searchInfo);
		getVisitingCars(1, VisitingCarStore.pageInfo.size);
	};

	return (
		<div className={classes.root}>
			<form onSubmit={handleSearchList} style={{ width: "100%" }}>
				<MC.Paper component="div" elevation={2} className={classes.paper}>

					<MC.Grid container style={{ height: "100%" }}>

						<MC.Grid item xs={12} md={6}>
							<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", height: "100%" }}>
								<MC.Grid item style={{ marginLeft: 0 }}>
									<MC.Typography variant={"subtitle1"}>
										방문일
									</MC.Typography>
								</MC.Grid>
								<MC.Grid item style={{ marginLeft: isMobile? 32 : 20 }}>
									<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
										<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
											<MC.Grid item style={{ width: isMobile ? 127 : 170 }}>
												<KeyboardDatePicker
													autoOk
													variant="inline"
													inputVariant="outlined"
													id="visitFromDate-picker-dialog"
													format="yyyy/MM/DD"
													disableToolbar
													maxDate={searchInfo.visitToDate || new Date()}
													value={searchInfo.visitFromDate || new Date()}
													keyboardIcon={<CalendarTodayOutlinedIcon />}
													KeyboardButtonProps={{
														className: classes.calendarButton
													}}
													onChange={(date, value) => handleDateChange("visitFromDate", date, value, true)}
													inputProps={{ className: classes.datePicker }}
													className={classes.datePickerContainer}
												/>
											</MC.Grid>
											<MC.Grid item>
												&nbsp; - &nbsp;
											</MC.Grid>
											<MC.Grid item style={{ width: isMobile ? 126 : 170 }}>
												<KeyboardDatePicker
													autoOk
													variant="inline"
													inputVariant="outlined"
													id="visitToDate-picker-dialog"
													format="yyyy/MM/DD"
													disableToolbar
													minDate={searchInfo.visitFromDate || new Date()}
													value={searchInfo.visitToDate || new Date()}
													keyboardIcon={<CalendarTodayOutlinedIcon />}
													KeyboardButtonProps={{
														className: classes.calendarButton
													}}
													onChange={(date, value) => handleDateChange("visitToDate", date, value, false)}
													inputProps={{ className: classes.datePicker }}
													className={classes.datePickerContainer}
												/>
											</MC.Grid>
										</MC.Grid>
									</MuiPickersUtilsProvider>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>

						<MC.Grid item xs={12} md={6} style={{ borderLeft: isMobile ? "none" : "1px solid #ebebeb"}}>
							<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", height: "100%" }}>
								<MC.Grid item style={{ marginLeft: isMobile? 0 : 9 }}>
									<MC.Typography variant={"subtitle1"}>
										차량번호
									</MC.Typography>
								</MC.Grid>
								<MC.Grid item style={{ marginLeft: 17 }}>
									<MC.InputBase
										className={classes.input}
										name="carNumber"
										value={searchInfo.carNumber || ""}
										inputProps={{
											style: {
												width: isMobile ? 271 : 390
											}
										}}
										onChange={handleChange}
									/>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>

						{
							isMobile &&
							<MC.Grid item xs={12} md={4}>
								<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}
								         style={{ width: "100%", marginTop: 26 }}>
									<MC.Button
										size="large"
										disableElevation
										style={{ padding: 0, borderRadius: 0, width: isMobile? "44%" : 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)", marginRight: 10 }}
										startIcon={<CachedIcon />}
										onClick={() => dataBinding(undefined)}>
										초기화
									</MC.Button>
									<MC.Button
										variant="contained"
										size="large"
										type="submit"
										color="primary"
										disableElevation
										startIcon={<SearchIcon />}
										style={{ padding: 0, borderRadius: 0, width: isMobile? "44%" : 140, height: 40 }}>
										조회
									</MC.Button>
								</MC.Grid>
							</MC.Grid>
						}

					</MC.Grid>

					{
						!isMobile &&
						<>
							<MC.IconButton className={classes.refreshIconButton} aria-label="search" onClick={() => dataBinding(undefined)}>
								<CachedIcon style={{ color: "#222222" }} />
							</MC.IconButton>
							<MC.IconButton type="submit" className={classes.searchIconButton} aria-label="search">
								<SearchIcon style={{ color: "#ffffff" }} fontSize={"large"} />
							</MC.IconButton>
						</>
					}
				</MC.Paper>
			</form>
		</div>
	);

};

export default inject("VisitingCarStore")(withRouter(observer(VisitingCarsSearchBar)));
