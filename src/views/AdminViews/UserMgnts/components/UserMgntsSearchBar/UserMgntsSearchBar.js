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

const UserMgntsSearchBar = props => {
	const classes = useStyles();

	const { UserMgntStore, getUserMgnts, aoList } = props;
	const [searchInfo, setSearchInfo] = useState({
		userDataType: {}
	});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/userMgnt") ? allInitialize(UserMgntStore.userMgntSearch) : allInitialize(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const allInitialize = async (searchObj) => {
		let tempSearchInfo = {
			aoId:            searchObj ? searchObj.aoId : "",
			name:            searchObj ? searchObj.name : "",
			phoneNumber:     searchObj ? searchObj.phoneNumber : "",
			userId:          searchObj ? searchObj.userId : "",
			userDataType:    searchObj ? searchObj.userDataType : {
				building:        searchObj ? searchObj.userDataType.building : "",
				unit:            searchObj ? searchObj.userDataType.unit : "",
				houseHolderType: searchObj ? searchObj.userDataType.houseHolderType : "total",
				ownerType:       searchObj ? searchObj.userDataType.ownerType : "total",
				residentsType:   searchObj ? searchObj.userDataType.residentsType : "total"
			},
			isUseCreateDate: searchObj ? searchObj.isUseCreateDate : false,
			createFromDate:  searchObj ? searchObj.createFromDate : dateInit(true),// ?????????(??????)
			createToDate:    searchObj ? searchObj.createToDate : dateInit(false)  // ?????????(??????)
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			UserMgntStore.setUserMgntSearch(tempSearchInfo);
			getUserMgnts(0, 10);
		} else {
			getUserMgnts(UserMgntStore.pageInfo.page, UserMgntStore.pageInfo.size);
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

		// ???????????? ?????? -(?????????) ??????
		if(name === "phoneNumber") {
			value = value.replace(/-/g, '');
		}

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
		} else if ( name === "isUseCreateDate" ) {
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
		UserMgntStore.setUserMgntSearch(searchInfo);
		getUserMgnts(0, UserMgntStore.pageInfo.size);
	};

	return (
		<div className={classes.root}>
			<MC.Accordion square>
				{/*expanded={true}>*/}

				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon className={classes.buttonColorWhite} />}
					aria-controls="panel1a-content"
					id="panel1a-header"
					onClick={() => allInitialize(undefined)}
				>
					<MC.Typography className={classes.heading}>
						????????? ????????????
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

								<MC.Grid container spacing={2}>
									<MC.Grid item xs={12} md={4}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel id="userDataType.residentsType-label">??????</MC.InputLabel>
											<MC.Select
												labelId="userDataType.residentsType-label"
												name="userDataType.residentsType"
												id="userDataType.residentsType-basic"
												value={searchInfo.userDataType.residentsType || "total"}
												onChange={handleChange}>
												<MC.MenuItem value="total">??????</MC.MenuItem>
												<MC.MenuItem value={"AWAITING_RESIDENTS"}>????????????</MC.MenuItem>
												<MC.MenuItem value={"RESIDENTS"}>?????????</MC.MenuItem>
											</MC.Select>
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={4}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel id="userDataType.ownerType-label">???????????????</MC.InputLabel>
											<MC.Select
												labelId="userDataType.ownerType-label"
												name="userDataType.ownerType"
												id="userDataType.ownerType-basic"
												value={searchInfo.userDataType.ownerType || "total"}
												onChange={handleChange}
											>
												<MC.MenuItem value="total">??????</MC.MenuItem>
												<MC.MenuItem value={"TO_BE_CONFIRMED"}>????????????</MC.MenuItem>
												<MC.MenuItem value={"NON_OWNER"}>????????????</MC.MenuItem>
												<MC.MenuItem value={"OWNER"}>?????????</MC.MenuItem>
											</MC.Select>
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={4}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.FormLabel component="legend">???????????????</MC.FormLabel>
											<MC.RadioGroup
												row
												aria-label="userDataType.houseHolderType"
												name="userDataType.houseHolderType"
												value={searchInfo.userDataType.houseHolderType || "total"}
												onChange={handleChange}>
												<MC.FormControlLabel value="total" control={<MC.Radio />} label="??????" />
												<MC.FormControlLabel value="HOUSEHOLD_OWNER" control={<MC.Radio />} label="?????????" />
												<MC.FormControlLabel value="HOUSEHOLD_MEMBER" control={<MC.Radio />} label="?????????" />
											</MC.RadioGroup>
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>

							</MC.Grid>

							<MC.Grid item xs={12} md={12}>
								<MC.Grid container spacing={2}>
									<MC.Grid item xs={12} md={4}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="userId-basic"
												name="userId"
												label="?????????"
												placeholder={""}
												value={searchInfo.userId || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={4}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="name-basic"
												name="name"
												label="??????"
												placeholder={""}
												value={searchInfo.name || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={4}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel id="aoId-label">??????</MC.InputLabel>
											<MC.Select
												labelId="aoId-label"
												name="aoId"
												id="aoId-basic"
												value={searchInfo.aoId || "total"}
												onChange={handleChange}
											>
												<MC.MenuItem value="total">??????</MC.MenuItem>
												{
													aoList && aoList.length > 0 &&
													aoList.map((ao, index) => (
														<MC.MenuItem key={index} value={ao.id}>{ao.name}</MC.MenuItem>
													))
												}
											</MC.Select>
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							<MC.Grid item xs={12} md={12}>
								<MC.Grid container spacing={2}>
									<MC.Grid item xs={6} md={3}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="userDataType.building-basic">???</MC.InputLabel>
											<MC.Input
												id="userDataType.building-basic"
												name="userDataType.building"
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={searchInfo.userDataType.building || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={3}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="userDataType.unit-basic">???</MC.InputLabel>
											<MC.Input
												id="userDataType.unit-basic"
												name="userDataType.unit"
												endAdornment={<MC.InputAdornment position="end">???</MC.InputAdornment>}
												value={searchInfo.userDataType.unit || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel id="phoneNumber-label">?????????</MC.InputLabel>
											<MC.Input
												size="small"
												labelid="phoneNumber-label"
												id="phoneNumber-input"
												name="phoneNumber"
												value={searchInfo.phoneNumber || ""}
												onChange={handleChange}
												inputComponent={PhoneMask}
											/>
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>

							<MC.Grid item xs={12} md={12}>
								<MC.Grid container spacing={3}>
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
													label="?????????"
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
														label="?????????(??????)"
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
														label="?????????(??????)"
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
									<MC.Grid item xs={6} md={6}>
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
											className={classes.buttonColorPrimary}
											onClick={() => allInitialize(undefined)}>
											?????????
										</MC.Button>
										<MC.Button
											className={classes.buttonColorSecondary}
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

export default inject("UserMgntStore")(withRouter(observer(UserMgntsSearchBar)));
