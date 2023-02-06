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
		paddingTop:                     4,
		paddingBottom:                  4,
		display:                        "flex",
		alignItems:                     "center",
		width:                          "100%",
		height:                         60,
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
		width:                          240,
		"& fieldset":                   {
			borderRadius: 0
		},
		[theme.breakpoints.down("xs")]: {
			width: 122
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

const PreCheckDetailsSearchBar = props => {
	const classes = useStyles();

	const { PreCheckDetailStore, getPreCheckDetails, isMobile } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/preCheckDetail") ? dataBinding(PreCheckDetailStore.preCheckDetailSearch) : dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			isCheck:          searchObj ? searchObj.isCheck : "total",
			preCheckFromDate: searchObj ? searchObj.preCheckFromDate : dateInit(true),
			preCheckToDate:   searchObj ? searchObj.preCheckToDate : dateInit(false)
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			PreCheckDetailStore.setPreCheckDetailSearch(tempSearchInfo);
			getPreCheckDetails(1, 10);
		} else {
			getPreCheckDetails(PreCheckDetailStore.pageInfo.page === 0 ? 1 : PreCheckDetailStore.pageInfo.page, PreCheckDetailStore.pageInfo.size);
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
		PreCheckDetailStore.setPreCheckDetailSearch(searchInfo);
		getPreCheckDetails(1, PreCheckDetailStore.pageInfo.size);
	};

	return (
		<div className={classes.root}>
			<form onSubmit={handleSearchList} style={{ width: "100%" }}>
				<MC.Paper component="div" elevation={2} className={classes.paper}>

					<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"center"}
					         style={{ height: "100%" }}>

						<MC.Grid item xs={12} md={4}>
							<MC.Grid container direction={"row"} justify={isMobile ? "flex-start" : "center"} alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item>
									<MC.Typography variant={"subtitle1"}>
										점검표작성
									</MC.Typography>
								</MC.Grid>
								<MC.Grid item style={{ width: isMobile ? 238 : 210, marginLeft: 20 }}>
									<MC.RadioGroup
										row
										aria-label="isCheck"
										name="isCheck"
										value={searchInfo.isCheck || "total"}
										onChange={handleChange}>
										<MC.FormControlLabel value="total" control={<MC.Radio color={"primary"} />} label="전체" style={{ marginRight: 25 }} />
										<MC.FormControlLabel value="true" control={<MC.Radio color={"primary"} />} label="Y" style={{ marginRight: 25 }} />
										<MC.FormControlLabel value="false" control={<MC.Radio color={"primary"} />} label="N" />
									</MC.RadioGroup>
								</MC.Grid>

							</MC.Grid>
						</MC.Grid>

						<MC.Grid item xs={12} md={8} style={{ borderLeft: isMobile ? "none" : "1px solid #ebebeb" }}>
							<MC.Grid container direction={"row"} justify={isMobile ? "flex-start" : "center"} alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item>
									<MC.Typography variant={"subtitle1"}>
										점검일
									</MC.Typography>
								</MC.Grid>
								<MC.Grid item style={{ width: isMobile ? 277 : 536, marginLeft: 10 }}>
									<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
										<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
											<MC.Grid item style={{ width: isMobile ? 122 : 240 }}>
												<KeyboardDatePicker
													autoOk
													variant="inline"
													inputVariant="outlined"
													id="preCheckFromDate-picker-dialog"
													format="yyyy/MM/DD"
													disableToolbar
													maxDate={searchInfo.preCheckToDate || new Date()}
													value={searchInfo.preCheckFromDate || new Date()}
													keyboardIcon={<CalendarTodayOutlinedIcon />}
													KeyboardButtonProps={{
														className: classes.calendarButton
													}}
													onChange={(date, value) => handleDateChange("preCheckFromDate", date, value, true)}
													inputProps={{ className: classes.datePicker }}
													className={classes.datePickerContainer}
												/>
											</MC.Grid>
											<MC.Grid item>
												&nbsp; - &nbsp;
											</MC.Grid>
											<MC.Grid item style={{ width: isMobile ? 122 : 240 }}>
												<KeyboardDatePicker
													autoOk
													variant="inline"
													inputVariant="outlined"
													id="preCheckToDate-picker-dialog"
													format="yyyy/MM/DD"
													disableToolbar
													minDate={searchInfo.preCheckFromDate || new Date()}
													value={searchInfo.preCheckToDate || new Date()}
													keyboardIcon={<CalendarTodayOutlinedIcon />}
													KeyboardButtonProps={{
														className: classes.calendarButton
													}}
													onChange={(date, value) => handleDateChange("preCheckToDate", date, value, false)}
													inputProps={{ className: classes.datePicker }}
													className={classes.datePickerContainer}
												/>
											</MC.Grid>
										</MC.Grid>
									</MuiPickersUtilsProvider>
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
										style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)", marginRight: 10 }}
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
										style={{ padding: 0, borderRadius: 0, width: 140, height: 40 }}>
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

export default inject("PreCheckDetailStore")(withRouter(observer(PreCheckDetailsSearchBar)));
