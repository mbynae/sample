import React, { useEffect, useState }                  from "react";
import moment                                          from "moment";
import { inject, observer }                            from "mobx-react";
import { withRouter }                                  from "react-router-dom";
import { useLastLocation }                             from "react-router-last-location";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";

import * as MC        from "@material-ui/core";
import * as MS        from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "moment/locale/ko";

import { PreviousLocationCheck } from "../../../../../components";

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
		color:      theme.palette.secondary.contrastText
	},
	secondaryHeading:      {
		fontSize: theme.typography.pxToRem(13),
		color:    theme.palette.secondary.contrastText
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
		backgroundColor: theme.palette.info.light
	},
	cardHeader:            {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	keyboardDatePicker:    {
		width: "100%"
	},
	primaryButton:         {
		color:       theme.palette.primary.main,
		borderColor: theme.palette.primary.main
	},
	secondaryButton:       {
		color:       theme.palette.secondary.main,
		borderColor: theme.palette.secondary.main
	},
	colorWhite:            {
		color: theme.palette.white
	}
}));

const FacilityReservationsSearchBar = props => {
	const classes = useStyles();
	
	const { FacilityReservationStore, getFacilityReservations } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();
	
	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, `/facilityReservation`) ? dataBinding(FacilityReservationStore.facilityReservationSearch) : dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const dataBinding = async (obj) => {
		let tempSearchInfo = {
			aptId:                obj ? obj.aptId : "",
			building:             obj ? obj.building : "",
			unit:                 obj ? obj.unit : "",
			name:                 obj ? obj.name : "",
			phoneNumber:          obj ? obj.phoneNumber : "",
			isUseReservationDate: false,
			reservationFromDate:  obj ? obj.reservationFromDate : dateInit(true),
			reservationToDate:    obj ? obj.reservationToDate : dateInit(false),
			isUseCreateDate:      false,
			createFromDate:       obj ? obj.createFromDate : dateInit(true),
			createToDate:         obj ? obj.createToDate : dateInit(false)
		};
		
		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});
		
		if ( !obj ) {
			FacilityReservationStore.setFacilityReservationSearch(tempSearchInfo);
			getFacilityReservations(0, 10);
		} else {
			getFacilityReservations(FacilityReservationStore.pageInfo.page, FacilityReservationStore.pageInfo.size);
		}
	};
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
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
		let id = event.target.id;
		let checked = event.target.checked;
		
		if ( name === "isUseCreateDate" || name === "isUseReservationDate" ) {
			setSearchInfo({
				...searchInfo,
				[name]: checked
			});
		} else {
			setSearchInfo({
				...searchInfo,
				[name]: value
			});
		}
	};
	
	const handleSearchList = event => {
		event.preventDefault();
		FacilityReservationStore.setFacilityReservationSearch(searchInfo);
		getFacilityReservations(0, FacilityReservationStore.pageInfo.size);
	};
	
	return (
		<div className={classes.root}>
			<MC.Accordion square>
				{/*expanded={true}>*/}
				
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon className={classes.colorWhite} />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<MC.Typography className={classes.heading}>
						커뮤니티 시설예약 검색
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
									
									<MC.Grid item xs={6} md={6}>
										<MC.Grid container spacing={2}>
											<MC.Grid item xs={6} md={6}>
												<MC.FormControl fullWidth className={classes.formControl}>
													<MC.InputLabel htmlFor="building-basic">동</MC.InputLabel>
													<MC.Input
														id="building-basic"
														name="building"
														endAdornment={<MC.InputAdornment position="end">동</MC.InputAdornment>}
														value={searchInfo.building || ""}
														onChange={handleChange} />
												</MC.FormControl>
											</MC.Grid>
											<MC.Grid item xs={6} md={6}>
												<MC.FormControl fullWidth className={classes.formControl}>
													<MC.InputLabel htmlFor="unit-basic">호</MC.InputLabel>
													<MC.Input
														id="unit-basic"
														name="unit"
														endAdornment={<MC.InputAdornment position="end">호</MC.InputAdornment>}
														value={searchInfo.unit || ""}
														onChange={handleChange} />
												</MC.FormControl>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
									
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="name-basic"
												name="name"
												label="이름"
												value={searchInfo.name || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="phoneNumber-basic"
												name="phoneNumber"
												label="휴대폰번호"
												value={searchInfo.phoneNumber || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									
									<MC.Grid item xs={6} md={6} />
									
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
											<MC.FormGroup row>
												<MC.FormControlLabel
													control={
														<MC.Checkbox
															checked={!!searchInfo.isUseReservationDate}
															onChange={handleChange}
															name="isUseReservationDate" />
													}
													label="예약일 검색 여부"
												/>
											</MC.FormGroup>
										</MC.FormControl>
										<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
											<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>
												<MC.Grid item xs={5} md={5}>
													<KeyboardDatePicker
														autoOk
														variant="inline"
														margin="normal"
														id="reservationFromDate-picker-dialog"
														label="예약일(시작)"
														format="yyyy/MM/DD"
														disabled={!searchInfo.isUseReservationDate}
														disableToolbar
														maxDate={searchInfo.reservationToDate || new Date()}
														value={searchInfo.reservationFromDate || new Date()}
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
														variant="inline"
														margin="normal"
														id="reservationToDate-picker-dialog"
														label="예약일(종료)"
														format="yyyy/MM/DD"
														disabled={!searchInfo.isUseReservationDate}
														disableToolbar
														minDate={searchInfo.reservationFromDate || new Date()}
														value={searchInfo.reservationToDate || new Date()}
														onChange={(date, value) => handleDateChange("reservationToDate", date, value, false)}
														KeyboardButtonProps={{
															"aria-label": "change date"
														}}
														className={classes.keyboardDatePicker} />
												</MC.Grid>
											</MC.Grid>
										</MuiPickersUtilsProvider>
									</MC.Grid>
									
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
											<MC.FormGroup row>
												<MC.FormControlLabel
													control={
														<MC.Checkbox
															checked={!!searchInfo.isUseCreateDate}
															onChange={handleChange}
															name="isUseCreateDate" />
													}
													label="등록일 검색 여부"
												/>
											</MC.FormGroup>
										</MC.FormControl>
										<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
											<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>
												<MC.Grid item xs={5} md={5}>
													<KeyboardDatePicker
														autoOk
														variant="inline"
														margin="normal"
														id="createFromDate-picker-dialog"
														label="등록일(시작)"
														format="yyyy/MM/DD"
														disabled={!searchInfo.isUseCreateDate}
														disableToolbar
														maxDate={searchInfo.createToDate || new Date()}
														value={searchInfo.createFromDate || new Date()}
														onChange={(date, value) => handleDateChange("createFromDate", date, value, true)}
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
														variant="inline"
														margin="normal"
														id="createToDate-picker-dialog"
														label="등록일(종료)"
														format="yyyy/MM/DD"
														disabled={!searchInfo.isUseCreateDate}
														disableToolbar
														minDate={searchInfo.createFromDate || new Date()}
														value={searchInfo.createToDate || new Date()}
														onChange={(date, value) => handleDateChange("createToDate", date, value, false)}
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
											className={classes.primaryButton}
											onClick={() => dataBinding(undefined)}>
											초기화
										</MC.Button>
										<MC.Button
											className={classes.secondaryButton}
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
	);
	
};

export default inject("FacilityReservationStore")(withRouter(observer(FacilityReservationsSearchBar)));
