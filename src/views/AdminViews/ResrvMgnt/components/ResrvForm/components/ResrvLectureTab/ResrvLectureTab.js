import React, {useState, useEffect}                    from "react";
import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import {useLocation}                                   from "react-router-dom";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";
import ResrvSeatModal                                  from "../../../ResrvSeatModal";
import { resrvHistRepository }                         from "../../../../../../../repositories";
import palette                                         from "../../../../../../../theme/userTheme/palette";
import clsx                                            from "clsx";

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
	cardContent:              {
		width:"90%", marginLeft:"5%", marginTop:"1%"
	},
	tableHeadCell:     {
		height:     "50px !important",
		fontWeight: "bold",
		color:      "#222222"
	},
	tableHeadCellFont: {
		fontSize:                       14,
		width:                          "15%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width:    "50%"
		}
	},
	body4:             {
		...theme.typography.body4
	},

}));

const ResrvLectureTab = props => {

	const {reservationInfo, setReservationInfo, errors, setErrors,
	selectedCourse, courseAdditionalList : obj, getCourseAdditionalList, setSelectedCourse, setCourseAdditionalList} = props;
	const classes = useStyles();
	const [lctrList, setLctrList] = useState([]);
	const [lctrPrgmList, setLctrPrgmList] = useState([]);

	useEffect(() => {
		const init = async () => {
			await getResrvLecture();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const handleFormChange = (event) => {
		const e = event.target;

		// Validation ??????
		setErrors(prev => {
			if (event.target.name === "facility") return {...prev, facility: e.value === ""}
			else if (event.target.name === "ticket") return {...prev, ticket: e.value === ""}
			else { return {...prev} }
		});

		setReservationInfo({...reservationInfo, [e.name]: e.value})

		// ????????? ??????????????? ??? ????????? ?????????
		if (event.target.name === "facility") {
			getResrvLecturePrgm(event.target.value);
			setCourseAdditionalList([]) // ?????? ?????? ????????? ?????????
		}

		// ????????? ??????????????? ??? ?????? ?????? ????????? ?????????
		if (event.target.name == "ticket") {
			getCourseAdditionalList(e.value)
		}

		// ????????? or ????????? ??????????????? ?????? ???????????? ????????? ?????????
		setSelectedCourse(-1);
	}

	const getResrvLecture = () => {
		resrvHistRepository.getFcltSearch({}, "rsvtbigload/9000")
			.then(result => {
				// setFcltDataSize(data.data_json_array_size);
				// let resultList = result.data_json_array.map(a=>{a.fclm_name});
				setLctrList(result.data_json_array);
			})
	}

	// ?????? ????????? Dropdown
	const getResrvLecturePrgm = (fcltNumb) => {
		resrvHistRepository.getPrgmSearch({}, `9000/${fcltNumb}`)
			.then(result => {
				// setFcltDataSize(data.data_json_array_size);
				// let resultList = result.data_json_array.map(a=>{a.fclm_name});
				setLctrPrgmList(result.data_json_array);
			})
	}

	// ?????? ??????????????? ????????? ?????? ?????? Handler
	const handleSelectCourse = (selectedCourse) => {
		setSelectedCourse(selectedCourse);
	}

	// ?????? ??????????????? ????????? Render
	const objView = (item, index) => (
		<MC.TableRow
			hover
			style={{ borderBottom: index === (item.length - 1) && "2px solid #222222" }}
			key={index}>
			<>
				{/*??????*/}
				<MC.TableCell align={"center"}>
					{index + 1}
				</MC.TableCell>

				{/*?????????*/}
				<MC.TableCell align={"center"}>
					{item.prgm_name}
				</MC.TableCell>

				{/*????????????*/}
				<MC.TableCell align={"center"}>
					{`${item.dayw_clss_name}`}
				</MC.TableCell>

				{/*????????????*/}
				<MC.TableCell align={"center"}>
					{item.prgm_strt_time.substring(0, 5)}
					~
					{item.prgm_end_time.substring(0, 5)}
				</MC.TableCell>

				{/*????????????*/}
				<MC.TableCell align={"center"}>
					{`${item.use_cnt}/${item.totl_cnt}`}
				</MC.TableCell>

				{/*?????? ??????*/}
				<MC.TableCell align={"center"}>
					<MC.Button
						variant="contained"
						color={index === selectedCourse ? "secondary" : palette.white.main}
						onClick={() => handleSelectCourse(index)}
						disabled={!item.rsvt_chck || item.use_cnt === item.totl_cnt}
					>
						??????
					</MC.Button>
				</MC.TableCell>
			</>
		</MC.TableRow>
	)

	return (
		<MC.Card style={{ overflow: "visible"}}>
			<MC.CardContent>
				<MC.Grid container spacing={2} justify="center" alignItems="center" style={{marginTop: "1%"}}>
					{/* ?????? ?????? */}
					<MC.Grid item xs={12} md={8}>
						<MC.TextField
							select
							variant={"outlined"}
							label={"?????? ??????"}
							name="facility"
							id="facility"
							value={reservationInfo.facility || ""}
							onChange={handleFormChange}
							error={errors.facility}
							style={{width:"100%"}}
						>
							{
								lctrList.map((item) => (
									<MC.MenuItem key={item.fclt_numb} value={item.fclt_numb}>
										{item.fclm_name}
									</MC.MenuItem>
								))
							}
						</MC.TextField>
					</MC.Grid>

					{/* ?????? ?????? */}
					<MC.Grid item xs={12} md={8}>
						<MC.TextField
							select
							variant={"outlined"}
							label={"????????? ??????"}
							name="ticket"
							id="ticket"
							placeholder={"?????????"}
							value={reservationInfo.ticket || ""}
							disabled={reservationInfo.facility === ""}
							onChange={handleFormChange}
							error={errors.ticket}
							style={{width:"100%"}}
						>
							{
								lctrPrgmList.map((item) => (
									<MC.MenuItem key={item.prgm_numb} value={item.prgm_numb}>
										{item.prgm_name}
									</MC.MenuItem>
								))
							}
						</MC.TextField>
						{reservationInfo.facility === "" && <MC.FormHelperText>????????? ?????? ??????????????????.</MC.FormHelperText>}
					</MC.Grid>

				  {/* ?????? ?????? ????????? */}
					{
						reservationInfo.ticket !== "" &&
						<MC.Grid item xs={12} md={8}>
							<MC.Table style={{ marginTop: 20 }}>
								<MC.TableHead className={classes.tableHead}>
									<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
										<MC.TableCell
											className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
											align={"center"}>
											??????
										</MC.TableCell>
										<MC.TableCell
											className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
											align={"center"}>
											?????????
										</MC.TableCell>
										<MC.TableCell
											className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
											align={"center"}>
											????????????
										</MC.TableCell>
										<MC.TableCell
											className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
											align={"center"}>
											????????????
										</MC.TableCell>
										<MC.TableCell
											className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
											align={"center"}>
											????????????
										</MC.TableCell>
										<MC.TableCell
											className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
											align={"center"}>
											??????
										</MC.TableCell>
									</MC.TableRow>
								</MC.TableHead>
								<MC.TableBody>
									{
										obj ?
											(
												obj.length === 0 ?
													<MC.TableRow>
														<MC.TableCell colSpan={5} align="center">
															????????? ????????? ??? ?????? ?????????.
														</MC.TableCell>
													</MC.TableRow>
													:
													obj.map(objView)
											)
											:
											<MC.TableRow>
												<MC.TableCell colSpan={5} align="center">
													<MC.CircularProgress color="secondary" />
												</MC.TableCell>
											</MC.TableRow>
									}
								</MC.TableBody>

							</MC.Table>
						</MC.Grid>
					}

				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	)
};

export default ResrvLectureTab;
