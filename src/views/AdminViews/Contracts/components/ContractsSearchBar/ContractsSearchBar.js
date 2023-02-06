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

const ContractsSearchBar = props => {
	const classes = useStyles();
	
	const { ContractStore, getContracts, contractTypes } = props;
	const [searchInfo, setSearchInfo] = useState({
		userDataType: {}
	});
	const lastLocation = useLastLocation();
	
	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/contract") ? dataBinding(ContractStore.contractSearch) : dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			contractTypeKind:  searchObj ? searchObj.contractTypeKind : "total",
			contractTypeId:    searchObj ? searchObj.contractTypeId : "",
			companyName:       searchObj ? searchObj.companyName : "",
			isUseContractDate: searchObj ? searchObj.isUseContractDate : false,
			contractStartDate: searchObj ? searchObj.contractStartDate : dateInit(true),
			contractEndDate:   searchObj ? searchObj.contractEndDate : dateInit(false),
			isUseCreateDate:   searchObj ? searchObj.isUseCreateDate : false,
			createFromDate:    searchObj ? searchObj.createFromDate : dateInit(true),
			createToDate:      searchObj ? searchObj.createToDate : dateInit(false)
		};
		
		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});
		
		if ( !searchObj ) {
			ContractStore.setContractSearch(tempSearchInfo);
			getContracts(0, 10);
		} else {
			getContracts(ContractStore.pageInfo.page, ContractStore.pageInfo.size);
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
		} else if ( name === "isUseCreateDate" || name === "isUseContractDate" ) {
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
		ContractStore.setContractSearch(searchInfo);
		getContracts(0, ContractStore.pageInfo.size);
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
						계약서 검색필터
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
								
								<MC.Grid container spacing={2}>
									<MC.Grid item xs={12} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel id="contractTypeKind-label">구분</MC.InputLabel>
											<MC.Select
												labelId="contractTypeKind-label"
												name="contractTypeKind"
												id="contractTypeKind-basic"
												value={searchInfo.contractTypeKind || "total"}
												onChange={handleChange}>
												<MC.MenuItem value="total">전체</MC.MenuItem>
												<MC.MenuItem value={"BIDDING"}>입찰</MC.MenuItem>
												<MC.MenuItem value={"PRIVATE_CONTRACT"}>수의계약</MC.MenuItem>
											</MC.Select>
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel id="contractTypeId-label">계약종류</MC.InputLabel>
											<MC.Select
												labelId="contractTypeId-label"
												name="contractTypeId"
												id="contractTypeId-basic"
												value={searchInfo.contractTypeId || "total"}
												onChange={handleChange}
											>
												<MC.MenuItem value="total">전체</MC.MenuItem>
												{
													contractTypes && contractTypes.length > 0 &&
													contractTypes.map((contractType, index) => (
														<MC.MenuItem key={index} value={contractType.id + ""}>{contractType.name}</MC.MenuItem>
													))
												}
											</MC.Select>
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>
							
							</MC.Grid>
							
							<MC.Grid item xs={12} md={12}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="companyName-basic"
										name="companyName"
										label="회사명"
										placeholder={""}
										value={searchInfo.companyName || ""}
										onChange={handleChange} />
								</MC.FormControl>
							</MC.Grid>
							
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
									<MC.FormGroup row>
										<MC.FormControlLabel
											control={
												<MC.Checkbox
													checked={!!searchInfo.isUseContractDate}
													onChange={handleChange}
													name="isUseContractDate" />
											}
											label="계약일"
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
												id="contractStartDate-picker-dialog"
												label="계약일(시작)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseContractDate}
												disableToolbar
												maxDate={searchInfo.contractEndDate || new Date()}
												value={searchInfo.contractStartDate || new Date()}
												onChange={(date, value) => handleDateChange("contractStartDate", date, value, true)}
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
												id="contractEndDate-picker-dialog"
												label="계약일(종료)"
												format="yyyy/MM/DD"
												disabled={!searchInfo.isUseContractDate}
												disableToolbar
												minDate={searchInfo.contractStartDate || new Date()}
												value={searchInfo.contractEndDate || new Date()}
												onChange={(date, value) => handleDateChange("contractEndDate", date, value, false)}
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
											label="등록일"
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

export default inject("ContractStore")(withRouter(observer(ContractsSearchBar)));
