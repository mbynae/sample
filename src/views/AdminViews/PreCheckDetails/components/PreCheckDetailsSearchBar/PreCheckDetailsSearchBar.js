import React, { useEffect, useState } from "react";
import moment                         from "moment";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import ExpandMoreIcon                                  from "@material-ui/icons/ExpandMore";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import "moment/locale/ko";
import MomentUtils                                     from "@date-io/moment";

import { PreviousLocationCheck } from "../../../../../components";
import palette                   from "../../../../../theme/adminTheme/palette";
import { aptComplexRepository }  from "../../../../../repositories";

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

const PreCheckDetailsSearchBar = props => {
	const classes = useStyles();
	
	const { PreCheckDetailStore, getPreCheckDetails } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();
	
	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/preCheckDetails") ? allInitialize(PreCheckDetailStore.preCheckDetailSearch) : allInitialize(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const allInitialize = async (preCheckDetailsSearch) => {
		let tempSearchInfo = {
			aptId:             preCheckDetailsSearch ? preCheckDetailsSearch.aptId : "",
			building:          preCheckDetailsSearch ? preCheckDetailsSearch.building : "",
			unit:              preCheckDetailsSearch ? preCheckDetailsSearch.unit : "",
			name:              preCheckDetailsSearch ? preCheckDetailsSearch.name : "",
			phoneNumber:       preCheckDetailsSearch ? preCheckDetailsSearch.phoneNumber : "",
			isCheck:           preCheckDetailsSearch ? preCheckDetailsSearch.isCheck : "total",
			isUsePreCheckDate: false,
			preCheckFromDate:  preCheckDetailsSearch ? preCheckDetailsSearch.preCheckFromDate : dateInit(true),
			preCheckToDate:    preCheckDetailsSearch ? preCheckDetailsSearch.preCheckToDate : dateInit(false),
			isUseCreateDate:   false,
			createFromDate:    preCheckDetailsSearch ? preCheckDetailsSearch.createFromDate : dateInit(true),
			createToDate:      preCheckDetailsSearch ? preCheckDetailsSearch.createToDate : dateInit(false)
		};
		
		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});
		
		if ( !preCheckDetailsSearch ) {
			PreCheckDetailStore.setPreCheckDetailSearch(tempSearchInfo);
			getPreCheckDetails(0, 10);
		} else {
			getPreCheckDetails(PreCheckDetailStore.pageInfo.page, PreCheckDetailStore.pageInfo.size);
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
		
		if ( name === "isUseCreateDate" || name === "isPreCheckDate" ) {
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
		searchInfo.phoneNumber = searchInfo.phoneNumber.replace(/-/g, "");
		PreCheckDetailStore.setPreCheckDetailSearch(searchInfo);
		getPreCheckDetails(0, PreCheckDetailStore.pageInfo.size);
	};
	
	return (
		<div className={classes.root}>
			<MC.Accordion square>
				{/*expanded={true}>*/}
				
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon style={{ color: palette.white }} />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<MC.Typography className={classes.heading}>
						사전점검 검색필터
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
									
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.FormLabel component="legend">점검표작성</MC.FormLabel>
											<MC.RadioGroup row aria-label="isCheck" name="isCheck" value={searchInfo.isCheck || "total"} onChange={handleChange}>
												<MC.FormControlLabel value="total" control={<MC.Radio />} label="전체" />
												<MC.FormControlLabel value="true" control={<MC.Radio />} label="Y" />
												<MC.FormControlLabel value="false" control={<MC.Radio />} label="N" />
											</MC.RadioGroup>
										</MC.FormControl>
									</MC.Grid>
									
									<MC.Grid item xs={12} md={12}>
										<MC.Grid container spacing={0}>
											<MC.Grid item xs={6} md={6}>
												<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>
													<MC.FormGroup row>
														<MC.FormControlLabel
															control={
																<MC.Checkbox
																	checked={!!searchInfo.isPreCheckDate}
																	onChange={handleChange}
																	name="isPreCheckDate" />
															}
															label="점검일 검색 여부"
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
																id="preCheckFromDate-picker-dialog"
																label="점검일(시작)"
																format="yyyy/MM/DD"
																disabled={!searchInfo.isPreCheckDate}
																disableToolbar
																maxDate={searchInfo.preCheckToDate || new Date()}
																value={searchInfo.preCheckFromDate || new Date()}
																onChange={(date, value) => handleDateChange("preCheckFromDate", date, value, true)}
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
																id="preCheckToDate-picker-dialog"
																label="점검일(종료)"
																format="yyyy/MM/DD"
																disabled={!searchInfo.isPreCheckDate}
																disableToolbar
																minDate={searchInfo.preCheckFromDate || new Date()}
																value={searchInfo.preCheckToDate || new Date()}
																onChange={(date, value) => handleDateChange("preCheckToDate", date, value, false)}
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
											onClick={() => allInitialize(undefined)}>
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
	);
	
};

export default inject("PreCheckDetailStore")(withRouter(observer(PreCheckDetailsSearchBar)));
