import React, { useState }                   from "react";
import * as MC                               from "@material-ui/core";
import * as MS                               from "@material-ui/styles";
import { useLocation }                       from "react-router-dom";
import { ResrvFacilityTab, ResrvLectureTab } from "./components";

const useStyles = MS.makeStyles(theme => ({
	keyboardDatePicker: {
		width: "100%"
	},
	textField: {
		"& input": {
			fontWeight: "normal"
		},
		"& p": {
			color: "#222222",
			fontWeight: "normal",
			marginLeft: 0
		}
	},
	cardContent: {
		width: "90%", marginLeft: "5%", marginTop: "1%"
	},
}));

const a11yProps = index => {
	return {
		id: `tab-${index}`,
		"aria-controls": `tabpanel-${index}`
	};
};

const AntTabs = MS.withStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(1),
		width: "100%",
		"box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.04)"
	},
	scrollButtons: {
		color: "#222222"
	},
	indicator: {
		display: "flex",
		justifyContent: "center",
		backgroundColor: "transparent",
		// height:          4,
		"& > span": {
			// maxWidth:        "100%",
			// height:          4,
			width: "100%",
			backgroundColor: "#42a5f5"
		}
	}
}))((props) => <MC.Tabs {...props} TabIndicatorProps={{ children: <span/> }}/>);

const AntTab = MS.withStyles((theme) => ({
	root: {
		textTransform: "none",
		fontSize: 18,
		minWidth: 72,
		color: "#bcbcbc",
		marginRight: theme.spacing(1),
		height: 60,
		"&:hover": {
			color: "#42a5f5",
			opacity: 1
		},
		"&$selected": {
			color: "#222222",
			fontSize: 18,
			fontWeight: theme.typography.fontWeightBold
		},
		"&:focus": {
			color: "#222222"
		}
	},
	selected: {}
}))((props) => <MC.Tab {...props} />);


const ResrvForm = props => {

	const {
		dateInit, getDate, SignInStore, AptComplexStore, UserMgntStore, handleAlertToggle, alertOpens, setAlertOpens,
		selectedUser, selectedMembNumb, reservationInfo, setReservationInfo, fcltAdditionalFlag, setFcltAdditionalFlag,
		getSeatList, seatList, selectedSeat, setSelectedSeat, tab, setTab, errors, setErrors, prtmClss, setPrtmClss,
		selectedCourse, setSelectedCourse, courseAdditionalList, getCourseAdditionalList, setCourseAdditionalList,
		setSeatListFlag, seatListFlag
	} = props;
	const classes = useStyles();
	const location = useLocation();


	const [seatModalOpen, setSeatModalOpen] = useState(false);	// 좌석배치 상태관리 state

	const handleTabChange = (event, newTab) => {
		setTab(newTab);
		setReservationInfo({
			facility: "",
			ticket: "",
			additional: "",
			rsvt_strt_date: dateInit(true),
			rsvt_strt_time: "09",
			rsvt_end_date: dateInit(false),
			rsvt_end_time: "18"
		}); // 탭 변경시 선택된 값 초기화
		setErrors({
			facility: false,
			ticket: false,
			additional: false,
			detl_numb: false,
			rsvt_strt_time: false,
			rsvt_end_time: false
		}); // 탭 변경시 에러 초기화
		setPrtmClss("");
		setFcltAdditionalFlag(false);
		setSeatListFlag(false);
	};

	const handleDateChange = (key, date) => {
		setReservationInfo(prev => {
			return {
				...prev,
				[key]: date.format("YYYY-MM-DD")
			};
		});
	};

	const handleSeatModal = (state) => {
		if ((!fcltAdditionalFlag && reservationInfo.additional === "") ||
			(fcltAdditionalFlag && reservationInfo.ticket === "")) {
			handleAlertToggle(
				"isOpen",
				"좌석 선택",
				"상품을 먼저 선택해주세요.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				},
				undefined
			);
		} else {
			// 선택된 prgm_numb에 따른 좌석 호출
			getSeatList(fcltAdditionalFlag ? reservationInfo.ticket.split("|")[0] : reservationInfo.additional.split("|")[0], prtmClss, true);
			setSeatModalOpen(state);
		}
	};

	return (
		<MC.Card style={{ overflow: "visible" }}>
			<MC.CardContent className={classes.cardContent}>
				<MC.Typography variant="h2" gutterBottom style={{ padding: "10px" }}>
					{selectedUser.name} {selectedUser.userDataType.building}동 {selectedUser.userDataType.unit}호
				</MC.Typography>
				<MC.Divider className={classes.divider}/>

				<MC.Grid container spacing={2} justify="center" alignItems="center" style={{ marginTop: "1%" }}>
					<MC.Grid item xs={12} md={8}>
						<MC.AppBar position="static" elevation={0}>
							<AntTabs
								value={tab}
								onChange={handleTabChange}
								aria-label="simple tabs"
								classes={{
									scrollButtons: classes.scrollButtons
								}}
								variant="fullWidth"
								style={{ backgroundColor: "#F8F8FF" }}
								textColor="primary"
							>
								<AntTab label={"시설예약"} {...a11yProps(0)} />
								<AntTab label={"강좌예약"} {...a11yProps(1)} />
							</AntTabs>
						</MC.AppBar>
						{
							tab === 0 &&
							<ResrvFacilityTab
								reservationInfo={reservationInfo}
								setReservationInfo={setReservationInfo}
								seatModalOpen={seatModalOpen}
								handleDateChange={handleDateChange}
								handleSeatModal={handleSeatModal}
								fcltAdditionalFlag={fcltAdditionalFlag}
								setFcltAdditionalFlag={setFcltAdditionalFlag}
								dateInit={dateInit}
								getDate={getDate}
								getSeatList={getSeatList}
								seatList={seatList}
								selectedSeat={selectedSeat}
								setSelectedSeat={setSelectedSeat}
								errors={errors}
								setErrors={setErrors}
								prtmClss={prtmClss}
								setPrtmClss={setPrtmClss}
								seatListFlag={seatListFlag}
								selectedMembNumb={selectedMembNumb}
							/>
						}
						{
							tab === 1 &&
							<ResrvLectureTab
								reservationInfo={reservationInfo}
								setReservationInfo={setReservationInfo}
								errors={errors}
								setErrors={setErrors}
								selectedCourse={selectedCourse}
								setSelectedCourse={setSelectedCourse}
								courseAdditionalList={courseAdditionalList}
								getCourseAdditionalList={getCourseAdditionalList}
								setCourseAdditionalList={setCourseAdditionalList}
							/>
						}
					</MC.Grid>
				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	);
};

export default ResrvForm;
