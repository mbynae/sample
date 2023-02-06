import React, { useEffect, useState } from "react";
import moment                         from "moment";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC        from "@material-ui/core";
import * as MS        from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "moment/locale/ko";

import { PhoneMask, PreviousLocationCheck }            from "../../../../../components";
import palette                                         from "../../../../../theme/adminTheme/palette";
import { PurposeVisitTypeKind }                        from "../../../../../enums";
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

const MoveReservationsSearchBar = props => {
	const classes = useStyles();

	const { MoveReservationStore, getMoveReservations } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();

	useEffect(() => {
		const init = () => {
			//PreviousLocationCheck(lastLocation, "/moveReservation") ? dataBinding(MoveReservationStore.moveReservationSearch) : dataBinding(undefined);
			dataBinding(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			dong_numb:         searchObj ? searchObj.dong_numb : "",
			ho_numb:           searchObj ? searchObj.ho_numb : "",
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			MoveReservationStore.setMoveReservationSearch(tempSearchInfo);
			getMoveReservations(0, 10);
		} else {
			getMoveReservations(MoveReservationStore.pageInfo.page, MoveReservationStore.pageInfo.size);
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

		setSearchInfo({
			...searchInfo,
			[name]: value
		});

	};

	const handleSearchList = event => {
		event.preventDefault();
		MoveReservationStore.setMoveReservationSearch(searchInfo);
		getMoveReservations(0, MoveReservationStore.pageInfo.size);
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
						이사예약 검색필터
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
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="dong_numb-basic">동</MC.InputLabel>
											<MC.Input
												id="dong_numb-basic"
												name="dong_numb"
												endAdornment={<MC.InputAdornment position="end">동</MC.InputAdornment>}
												value={searchInfo.dong_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={6} md={6}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.InputLabel htmlFor="ho_numb-basic">호</MC.InputLabel>
											<MC.Input
												id="ho_numb-basic"
												name="ho_numb"
												endAdornment={<MC.InputAdornment position="end">호</MC.InputAdornment>}
												value={searchInfo.ho_numb || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
									<MC.Grid item xs={12} md={6} />
								</MC.Grid>
							</MC.Grid>

							{/*<MC.Grid item xs={12} md={12}>*/}
							{/*	<MC.Grid container spacing={3}>*/}
							{/*		<MC.Grid item xs={6} md={6}>*/}
							{/*			<MC.FormControl fullWidth className={classes.formControl}>*/}
							{/*				<MC.TextField*/}
							{/*					id="carNumber-basic"*/}
							{/*					name="carNumber"*/}
							{/*					label="차량번호"*/}
							{/*					placeholder={"차량번호를 입력해주세요.(ex.12가1234)"}*/}
							{/*					value={searchInfo.carNumber || ""}*/}
							{/*					onChange={handleChange} />*/}
							{/*			</MC.FormControl>*/}
							{/*		</MC.Grid>*/}
							{/*		<MC.Grid item xs={6} md={6}>*/}
							{/*			<MC.FormControl fullWidth className={classes.formControl}>*/}
							{/*				<MC.InputLabel id="purposeVisitType-label">방문목적</MC.InputLabel>*/}
							{/*				<MC.Select*/}
							{/*					labelId="purposeVisitType-label"*/}
							{/*					name="purposeVisitType"*/}
							{/*					id="purposeVisitType-basic"*/}
							{/*					value={searchInfo.purposeVisitType || "total"}*/}
							{/*					onChange={handleChange}>*/}
							{/*					<MC.MenuItem value="total">전체</MC.MenuItem>*/}
							{/*					<MC.MenuItem value={"HOUSEHOLD_VISIT"}>세대방문</MC.MenuItem>*/}
							{/*					<MC.MenuItem value={"ETC"}>기타</MC.MenuItem>*/}
							{/*				</MC.Select>*/}
							{/*			</MC.FormControl>*/}
							{/*		</MC.Grid>*/}
							{/*	</MC.Grid>*/}
							{/*</MC.Grid>*/}

							{/*<MC.Grid item xs={12} md={12}>*/}
							{/*	<MC.Grid container spacing={3}>*/}
							{/*		<MC.Grid item xs={6} md={6}>*/}
							{/*			<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>*/}
							{/*				<MC.FormGroup row>*/}
							{/*					<MC.FormControlLabel*/}
							{/*						control={*/}
							{/*							<MC.Checkbox*/}
							{/*								checked={!!searchInfo.isUseVisitDate}*/}
							{/*								onChange={handleChange}*/}
							{/*								name="isUseVisitDate" />*/}
							{/*						}*/}
							{/*						label="방문일"*/}
							{/*					/>*/}
							{/*				</MC.FormGroup>*/}
							{/*			</MC.FormControl>*/}
							{/*			<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>*/}
							{/*				<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>*/}
							{/*					<MC.Grid item xs={5} md={5}>*/}
							{/*						<KeyboardDatePicker*/}
							{/*							autoOk*/}
							{/*							variant="inline"*/}
							{/*							margin="normal"*/}
							{/*							id="visitFromDate-picker-dialog"*/}
							{/*							label="방문일(시작)"*/}
							{/*							format="yyyy/MM/DD"*/}
							{/*							disabled={!searchInfo.isUseVisitDate}*/}
							{/*							disableToolbar*/}
							{/*							maxDate={searchInfo.visitToDate || new Date()}*/}
							{/*							value={searchInfo.visitFromDate || new Date()}*/}
							{/*							onChange={(date, value) => handleDateChange("visitFromDate", date, value, true)}*/}
							{/*							KeyboardButtonProps={{*/}
							{/*								"aria-label": "change date"*/}
							{/*							}}*/}
							{/*							className={classes.keyboardDatePicker} />*/}
							{/*					</MC.Grid>*/}
							{/*					<MC.Grid item xs={2} md={2}*/}
							{/*					         style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>*/}
							{/*						&nbsp; ~ &nbsp;*/}
							{/*					</MC.Grid>*/}
							{/*					<MC.Grid item xs={5} md={5}>*/}
							{/*						<KeyboardDatePicker*/}
							{/*							autoOk*/}
							{/*							variant="inline"*/}
							{/*							margin="normal"*/}
							{/*							id="visitToDate-picker-dialog"*/}
							{/*							label="방문일(종료)"*/}
							{/*							format="yyyy/MM/DD"*/}
							{/*							disabled={!searchInfo.isUseVisitDate}*/}
							{/*							disableToolbar*/}
							{/*							minDate={searchInfo.visitFromDate || new Date()}*/}
							{/*							value={searchInfo.visitToDate || new Date()}*/}
							{/*							onChange={(date, value) => handleDateChange("visitToDate", date, value, false)}*/}
							{/*							KeyboardButtonProps={{*/}
							{/*								"aria-label": "change date"*/}
							{/*							}}*/}
							{/*							className={classes.keyboardDatePicker} />*/}
							{/*					</MC.Grid>*/}
							{/*				</MC.Grid>*/}
							{/*			</MuiPickersUtilsProvider>*/}
							{/*		</MC.Grid>*/}
							{/*		<MC.Grid item xs={6} md={6}>*/}
							{/*			<MC.FormControl component="fieldset" className={classes.formControl} style={{ marginTop: 10, marginBottom: 0 }}>*/}
							{/*				<MC.FormGroup row>*/}
							{/*					<MC.FormControlLabel*/}
							{/*						control={*/}
							{/*							<MC.Checkbox*/}
							{/*								checked={!!searchInfo.isUseCreateDate}*/}
							{/*								onChange={handleChange}*/}
							{/*								name="isUseCreateDate" />*/}
							{/*						}*/}
							{/*						label="등록일"*/}
							{/*					/>*/}
							{/*				</MC.FormGroup>*/}
							{/*			</MC.FormControl>*/}
							{/*			<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>*/}
							{/*				<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>*/}
							{/*					<MC.Grid item xs={5} md={5}>*/}
							{/*						<KeyboardDatePicker*/}
							{/*							autoOk*/}
							{/*							variant="inline"*/}
							{/*							margin="normal"*/}
							{/*							id="createFromDate-picker-dialog"*/}
							{/*							label="등록일(시작)"*/}
							{/*							format="yyyy/MM/DD"*/}
							{/*							disabled={!searchInfo.isUseCreateDate}*/}
							{/*							disableToolbar*/}
							{/*							maxDate={searchInfo.createToDate || new Date()}*/}
							{/*							value={searchInfo.createFromDate || new Date()}*/}
							{/*							onChange={(date, value) => handleDateChange("createFromDate", date, value, true)}*/}
							{/*							KeyboardButtonProps={{*/}
							{/*								"aria-label": "change date"*/}
							{/*							}}*/}
							{/*							className={classes.keyboardDatePicker} />*/}
							{/*					</MC.Grid>*/}
							{/*					<MC.Grid item xs={2} md={2}*/}
							{/*					         style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>*/}
							{/*						&nbsp; ~ &nbsp;*/}
							{/*					</MC.Grid>*/}
							{/*					<MC.Grid item xs={5} md={5}>*/}
							{/*						<KeyboardDatePicker*/}
							{/*							autoOk*/}
							{/*							variant="inline"*/}
							{/*							margin="normal"*/}
							{/*							id="createToDate-picker-dialog"*/}
							{/*							label="등록일(종료)"*/}
							{/*							format="yyyy/MM/DD"*/}
							{/*							disabled={!searchInfo.isUseCreateDate}*/}
							{/*							disableToolbar*/}
							{/*							minDate={searchInfo.createFromDate || new Date()}*/}
							{/*							value={searchInfo.createToDate || new Date()}*/}
							{/*							onChange={(date, value) => handleDateChange("createToDate", date, value, false)}*/}
							{/*							KeyboardButtonProps={{*/}
							{/*								"aria-label": "change date"*/}
							{/*							}}*/}
							{/*							className={classes.keyboardDatePicker} />*/}
							{/*					</MC.Grid>*/}
							{/*				</MC.Grid>*/}
							{/*			</MuiPickersUtilsProvider>*/}
							{/*		</MC.Grid>*/}
							{/*	</MC.Grid>*/}
							{/*</MC.Grid>*/}

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
											onClick={() => dataBinding(undefined)}>
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

export default inject("MoveReservationStore")(withRouter(observer(MoveReservationsSearchBar)));
