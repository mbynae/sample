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
		marginTop: 16
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

const VisitingCarsSearchBar = props => {
	const classes = useStyles();

	const { VisitingCarStore, getVisitingCars } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/visitingCar") ? dataBinding(VisitingCarStore.visitingCarSearch) : dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			building:         searchObj ? searchObj.building : "", // ???
			unit:             searchObj ? searchObj.unit : "", // ???
			visitFromDate:    searchObj ? searchObj.visitFromDate : dateInit(true), // ?????????(??????) - ????????? (?????? ???)
			visitToDate:      searchObj ? searchObj.visitToDate : dateInit(false), // ?????????(??????) - ????????? (?????? ???)
			stateCheckbox:	  searchObj ? searchObj.stateCheckbox : "" // ?????? ????????????
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			VisitingCarStore.setVisitingCarSearch(tempSearchInfo);
			getVisitingCars(0, 10);
		} else {
			getVisitingCars(VisitingCarStore.pageInfo.page, VisitingCarStore.pageInfo.size);
		}
	};

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);

	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);

		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		} else {
			let monthOfYear = date.month();
			date.month(monthOfYear - 1);
		}

		return date;
	};

	const handleDateChange = (key, date, value, isFrom) => {
		setSearchInfo({
			...searchInfo,
			[key]: getDate(date, isFrom)
		});
	};

	// Input Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setSearchInfo({
			...searchInfo,
			[name]: value
		});
	};

	// Search ?????? Handler
	const handleSearchList = event => {
		event.preventDefault();
		VisitingCarStore.setVisitingCarSearch(searchInfo);
		getVisitingCars(0, VisitingCarStore.pageInfo.size);
	};

	return (
		<div className={classes.root}>
			<MC.Accordion square>

				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon style={{ color: palette.white }} />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<MC.Typography className={classes.heading}>
						?????????????????? ????????????
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

							<MC.Grid item xs={12} md={12} style={{paddingBottom: 0}}>
								<MC.Grid container spacing={4}>
									{/* ??? */}
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="building-basic">???</MC.InputLabel>
											<MC.Input
												id="building-basic"
												name="building"
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={searchInfo.building || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									{/* ??? */}
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="unit-basic">???</MC.InputLabel>
											<MC.Input
												id="unit-basic"
												name="unit"
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={searchInfo.unit || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={6} />
								</MC.Grid>
							</MC.Grid>

							<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
								{/* ????????? (??????) */}
								<MC.Grid item xs={6} md={6}>
									<KeyboardDatePicker
										autoOk
										variant="inline"
										margin="normal"
										id="visitFromDate-picker-dialog"
										label="?????????(??????)"
										format="yyyy/MM/DD"
										disableToolbar
										maxDate={searchInfo.visitToDate || new Date()}
										value={searchInfo.visitFromDate || new Date()}
										onChange={(date, value) => handleDateChange("visitFromDate", date, value, true)}
										KeyboardButtonProps={{
											"aria-label": "change date"
										}}
										className={classes.keyboardDatePicker}/>
								</MC.Grid>
								{/* ????????? (??????) */}
								<MC.Grid item xs={6} md={6}>
									<KeyboardDatePicker
										autoOk
										variant="inline"
										margin="normal"
										id="visitToDate-picker-dialog"
										label="?????????(??????)"
										format="yyyy/MM/DD"
										disableToolbar
										minDate={searchInfo.visitFromDate || new Date()}
										value={searchInfo.visitToDate || new Date()}
										onChange={(date, value) => handleDateChange("visitToDate", date, value, false)}
										KeyboardButtonProps={{
											"aria-label": "change date"
										}}
										className={classes.keyboardDatePicker}/>
								</MC.Grid>
							</MuiPickersUtilsProvider>
							{/* ?????? ???????????? - ???????????????*/}
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.FormLabel component="legend">??????</MC.FormLabel>
									<MC.RadioGroup
										row
										aria-label="stateCheckbox"
										name="stateCheckbox"
										value={searchInfo.stateCheckbox|| ""}
										onChange={handleChange}>
										<MC.FormControlLabel value="Y" control={<MC.Radio />} label="??????" /> &nbsp; &nbsp; &nbsp;
										<MC.FormControlLabel value="N" control={<MC.Radio />} label="??????" />
									</MC.RadioGroup>
								</MC.FormControl>
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
	);

};

export default inject("VisitingCarStore")(withRouter(observer(VisitingCarsSearchBar)));
