import React, { useEffect, useState } from "react";
import moment                         from "moment";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC        from "@material-ui/core";
import * as MS        from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";
import "moment/locale/ko";
import { PhoneMask, PreviousLocationCheck }            from "../../../../../components";

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
	buttonColorPrimary:    {
		color:       theme.palette.primary.main,
		borderColor: theme.palette.primary.main
	},
	buttonColorSecondary:  {
		color:       theme.palette.secondary.main,
		borderColor: theme.palette.secondary.main
	},
	buttonColorWhite:      {
		color: theme.palette.white
	}
}));

const SendSMSsSearchBar = props => {
	const classes = useStyles();
	
	const { SendSMSStore, getSendSMSs, aptId } = props;
	const [searchInfo, setSearchInfo] = useState({
		userDataType: {}
	});
	const lastLocation = useLastLocation();
	
	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/sendSMS") ? dataBinding(SendSMSStore.sendSMSSearch) : dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			sendNumber:           searchObj ? searchObj.sendNumber : "",
			smsType:              searchObj ? searchObj.smsType : "total",
			sendType:             searchObj ? searchObj.sendType : "total",
			sendTargetType:       searchObj ? searchObj.sendTargetType : "total",
			isUseReservationDate: searchObj ? searchObj.isUseReservationDate : false,
			reservationStartDate: searchObj ? searchObj.reservationStartDate : dateInit(true),
			reservationEndDate:   searchObj ? searchObj.reservationEndDate : dateInit(false),
			isUseSendDate:        searchObj ? searchObj.isUseSendDate : false,
			sendStartDate:        searchObj ? searchObj.sendStartDate : dateInit(true),
			sendEndDate:          searchObj ? searchObj.sendEndDate : dateInit(false)
		};
		
		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});
		
		if ( !searchObj ) {
			SendSMSStore.setSendSMSSearch(tempSearchInfo);
			getSendSMSs(0, 10);
		} else {
			getSendSMSs(SendSMSStore.pageInfo.page, SendSMSStore.pageInfo.size);
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
		let checked = event.target.checked;
		
		if ( name.indexOf("userDataType") !== -1 ) {
			let dotIndex = name.indexOf(".");
			let key = name.substring(dotIndex + 1, name.length);
			setSearchInfo(prev => {
				return {
					...prev,
					userDataType: {
						...prev.userDataType,
						[key]: value
					}
				};
			});
		} else if ( name === "isUseReservationDate" || name === "isUseSendDate" ) {
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
		SendSMSStore.setSendSMSSearch(searchInfo);
		getSendSMSs(0, SendSMSStore.pageInfo.size);
	};
	
	return (
		<div className={classes.root}>
			<MC.Accordion square>
				{/*expanded={true}>*/}
				
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon className={classes.buttonColorWhite} />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<MC.Typography className={classes.heading}>
						문자발송 검색필터
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
							
							{/*구분*/}
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.InputLabel id="smsType-label">구분</MC.InputLabel>
									<MC.Select
										labelId="smsType-label"
										name="smsType"
										id="smsType-basic"
										value={searchInfo.smsType || "total"}
										onChange={handleChange}>
										<MC.MenuItem value="total">전체</MC.MenuItem>
										<MC.MenuItem value={"SMS"}>SMS</MC.MenuItem>
										<MC.MenuItem value={"MMS"}>MMS</MC.MenuItem>
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
							
							{/*발송형태*/}
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.InputLabel id="sendType-label">발송형태</MC.InputLabel>
									<MC.Select
										labelId="sendType-label"
										name="sendType"
										id="sendType-basic"
										value={searchInfo.sendType || "total"}
										onChange={handleChange}>
										<MC.MenuItem value="total">전체</MC.MenuItem>
										<MC.MenuItem value={"SEND_RESERVATION"}>예약전송</MC.MenuItem>
										<MC.MenuItem value={"SEND_IMMEDIATE"}>즉시전송</MC.MenuItem>
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
							
							{/*/!*발신번호*!/*/}
							{/*<MC.Grid item xs={12} md={6}>*/}
							{/*	<MC.FormControl fullWidth className={classes.formControl}>*/}
							{/*		<MC.InputLabel id="sendNumber-label">발신번호</MC.InputLabel>*/}
							{/*		<MC.Input*/}
							{/*			size="small"*/}
							{/*			labelid="sendNumber-label"*/}
							{/*			id="sendNumber-input"*/}
							{/*			name="sendNumber"*/}
							{/*			value={searchInfo.sendNumber || ""}*/}
							{/*			onChange={handleChange}*/}
							{/*			inputComponent={PhoneMask}*/}
							{/*		/>*/}
							{/*	</MC.FormControl>*/}
							{/*</MC.Grid>*/}
							
							{/*발송대상*/}
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.InputLabel id="sendTargetType-label">발송대상</MC.InputLabel>
									<MC.Select
										labelId="sendTargetType-label"
										name="sendTargetType"
										id="sendTargetType-basic"
										value={searchInfo.sendTargetType || "TOTAL"}
										onChange={handleChange}>
										<MC.MenuItem value={"total"}>전체</MC.MenuItem>
										<MC.MenuItem value={"TOTAL"}>전체발송</MC.MenuItem>
										<MC.MenuItem value={"AUTONOMOUS_ORGANIZATION"}>자치기구</MC.MenuItem>
										<MC.MenuItem value={"BUILDING"}>특정동</MC.MenuItem>
										<MC.MenuItem value={"HOUSEHOLDERS"}>세대주</MC.MenuItem>
										<MC.MenuItem value={"INDIVIDUAL"}>직접입력</MC.MenuItem>
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
							<MC.Grid item xs={12} md={6} />
							
							{/*예약발송일*/}
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
									<MC.FormGroup row>
										<MC.FormControlLabel
											control={
												<MC.Checkbox
													checked={!!searchInfo.isUseCreateDate}
													onChange={handleChange}
													name="isUseReservationDate" />
											}
											label="예약발송일 검색 여부"
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
												id="reservationStartDate-picker-dialog"
												label="예약발송일(시작)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseReservationDate}
												disableToolbar
												maxDate={searchInfo.reservationEndDate || new Date()}
												value={searchInfo.reservationStartDate || new Date()}
												onChange={(date, value) => handleDateChange("reservationStartDate", date, value, true)}
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
												id="reservationEndDate-picker-dialog"
												label="예약발송일(종료)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseReservationDate}
												disableToolbar
												minDate={searchInfo.reservationStartDate || new Date()}
												value={searchInfo.reservationEndDate || new Date()}
												onChange={(date, value) => handleDateChange("reservationEndDate", date, value, false)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker} />
										</MC.Grid>
									</MC.Grid>
								</MuiPickersUtilsProvider>
							</MC.Grid>
							
							{/*발송일*/}
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
									<MC.FormGroup row>
										<MC.FormControlLabel
											control={
												<MC.Checkbox
													checked={!!searchInfo.isUseCreateDate}
													onChange={handleChange}
													name="isUseSendDate" />
											}
											label="발송일 검색 여부"
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
												id="sendStartDate-picker-dialog"
												label="예약발송일(시작)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseSendDate}
												disableToolbar
												maxDate={searchInfo.sendEndDate || new Date()}
												value={searchInfo.sendStartDate || new Date()}
												onChange={(date, value) => handleDateChange("sendStartDate", date, value, true)}
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
												id="sendEndDate-picker-dialog"
												label="예약발송일(종료)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseSendDate}
												disableToolbar
												minDate={searchInfo.sendStartDate || new Date()}
												value={searchInfo.sendEndDate || new Date()}
												onChange={(date, value) => handleDateChange("sendEndDate", date, value, false)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker} />
										</MC.Grid>
									</MC.Grid>
								</MuiPickersUtilsProvider>
							</MC.Grid>
							
							{/*하단 검색 버튼 그룹*/}
							<MC.Grid item xs={12} md={12}>
								<div className={classes.buttonGroupLayout}>
									<MC.ButtonGroup
										aria-label="text primary button group"
										color="primary">
										<MC.Button
											className={classes.buttonColorPrimary}
											onClick={() => dataBinding(undefined)}>
											초기화
										</MC.Button>
										<MC.Button
											className={classes.buttonColorSecondary}
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

export default inject("SendSMSStore")(withRouter(observer(SendSMSsSearchBar)));
