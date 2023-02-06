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
import { PreviousLocationCheck }                       from "../../../../../components";

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

const MaintenancesSearchBar = props => {
	const classes = useStyles();
	
	const { MaintenanceStore, getMaintenances, maintenanceTypes, contracts } = props;
	const [searchInfo, setSearchInfo] = useState({
		userDataType: {}
	});
	const lastLocation = useLastLocation();
	
	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/maintenance") ? dataBinding(MaintenanceStore.maintenanceSearch) : dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			maintenanceTypeId:    searchObj ? searchObj.maintenanceTypeId : "total",
			maintenanceTitle:     searchObj ? searchObj.maintenanceTitle : "",
			contractCompanyId:    searchObj ? searchObj.contractCompanyId : "total",
			isUseMaintenanceDate: searchObj ? searchObj.isUseMaintenanceDate : false,
			maintenanceStartDate: searchObj ? searchObj.maintenanceStartDate : dateInit(true),
			maintenanceEndDate:   searchObj ? searchObj.maintenanceEndDate : dateInit(false),
			isUseInspectionDate:  searchObj ? searchObj.isUseInspectionDate : false,
			inspectionStartDate:  searchObj ? searchObj.inspectionStartDate : dateInit(true),
			inspectionEndDate:    searchObj ? searchObj.inspectionEndDate : dateInit(false),
			isUseCreateDate:      searchObj ? searchObj.isUseCreateDate : false,
			createFromDate:       searchObj ? searchObj.createFromDate : dateInit(true),
			createToDate:         searchObj ? searchObj.createToDate : dateInit(false)
		};
		
		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});
		
		if ( !searchObj ) {
			MaintenanceStore.setMaintenanceSearch(tempSearchInfo);
			getMaintenances(0, 10);
		} else {
			getMaintenances(MaintenanceStore.pageInfo.page, MaintenanceStore.pageInfo.size);
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
		} else if ( name === "isUseInspectionDate" || name === "isUseCreateDate" || name === "isUseMaintenanceDate" ) {
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
		MaintenanceStore.setMaintenanceSearch(searchInfo);
		getMaintenances(0, MaintenanceStore.pageInfo.size);
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
						시설물 안전관리 검색필터
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
							
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.InputLabel id="maintenanceTypeId-label">시설물 안전구분</MC.InputLabel>
									<MC.Select
										labelId="maintenanceTypeId-label"
										name="maintenanceTypeId"
										id="maintenanceTypeId-basic"
										value={searchInfo.maintenanceTypeId || "total"}
										onChange={handleChange}
									>
										<MC.MenuItem value="total">전체</MC.MenuItem>
										{
											maintenanceTypes && maintenanceTypes.length > 0 &&
											maintenanceTypes.map((maintenanceType, index) => (
												<MC.MenuItem key={index} value={maintenanceType.id + ""}>{maintenanceType.name}</MC.MenuItem>
											))
										}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
							
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="maintenanceTitle-basic"
										name="maintenanceTitle"
										label="점검명"
										placeholder={""}
										value={searchInfo.maintenanceTitle || ""}
										onChange={handleChange} />
								</MC.FormControl>
							</MC.Grid>
							
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.InputLabel id="contractCompanyId-label">점검업체</MC.InputLabel>
									<MC.Select
										labelId="contractCompanyId-label"
										name="contractCompanyId"
										id="contractCompanyId-basic"
										value={searchInfo.contractCompanyId || "total"}
										onChange={handleChange}
									>
										<MC.MenuItem value="total">전체</MC.MenuItem>
										{
											contracts && contracts.length > 0 &&
											contracts.map((contract, index) => (
												<MC.MenuItem key={index} value={contract.id + ""}>{contract.companyName}</MC.MenuItem>
											))
										}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
							
							<MC.Grid item xs={12} md={6} />
							
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
									<MC.FormGroup row>
										<MC.FormControlLabel
											control={
												<MC.Checkbox
													checked={!!searchInfo.isUseInspectionDate}
													onChange={handleChange}
													name="isUseInspectionDate" />
											}
											label="점검시기 "
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
												id="inspectionStartDate-picker-dialog"
												label="점검일(시작)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseInspectionDate}
												disableToolbar
												maxDate={searchInfo.inspectionEndDate || new Date()}
												value={searchInfo.inspectionStartDate || new Date()}
												onChange={(date, value) => handleDateChange("inspectionStartDate", date, value, true)}
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
												id="inspectionEndDate-picker-dialog"
												label="점검일(종료)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseInspectionDate}
												disableToolbar
												minDate={searchInfo.inspectionStartDate || new Date()}
												value={searchInfo.inspectionEndDate || new Date()}
												onChange={(date, value) => handleDateChange("inspectionEndDate", date, value, false)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker} />
										</MC.Grid>
									</MC.Grid>
								</MuiPickersUtilsProvider>
							</MC.Grid>
							
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
									<MC.FormGroup row>
										<MC.FormControlLabel
											control={
												<MC.Checkbox
													checked={!!searchInfo.isUseMaintenanceDate}
													onChange={handleChange}
													name="isUseMaintenanceDate" />
											}
											label="시행일 "
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
												id="maintenanceStartDate-picker-dialog"
												label="시행일(시작)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseMaintenanceDate}
												disableToolbar
												maxDate={searchInfo.maintenanceEndDate || new Date()}
												value={searchInfo.maintenanceStartDate || new Date()}
												onChange={(date, value) => handleDateChange("maintenanceStartDate", date, value, true)}
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
												id="maintenanceEndDate-picker-dialog"
												label="시행일(종료)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseMaintenanceDate}
												disableToolbar
												minDate={searchInfo.maintenanceStartDate || new Date()}
												value={searchInfo.maintenanceEndDate || new Date()}
												onChange={(date, value) => handleDateChange("maintenanceEndDate", date, value, false)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker} />
										</MC.Grid>
									</MC.Grid>
								</MuiPickersUtilsProvider>
							</MC.Grid>
							
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
									<MC.FormGroup row>
										<MC.FormControlLabel
											control={
												<MC.Checkbox
													checked={!!searchInfo.isUseCreateDate}
													onChange={handleChange}
													name="isUseCreateDate" />
											}
											label="등록일 "
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

export default inject("MaintenanceStore")(withRouter(observer(MaintenancesSearchBar)));
