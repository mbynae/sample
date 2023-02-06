import React, { useEffect, useState, useRef }                	from "react";
import { inject, observer }                           from "mobx-react";
import * as MS             from "@material-ui/styles";
import * as MC             from "@material-ui/core";
import moment              from "moment";
import * as MUI 					from '@mui/material';

import {
	Scheduler,
	MonthView,
	Appointments,
	Toolbar,
	DateNavigator,
	TodayButton,
}                                 from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState }              from '@devexpress/dx-react-scheduler';
import { scheduleMgntRepository } from "../../../repositories"
import { AlertDialogUserView }    from "../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:       {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background: {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          245,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:    {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		maxWidth:                       "1180px",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	layout:     {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width:                          "100%",
		paddingTop:                     85,
		paddingBottom:                  80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			paddingTop:    0,
			paddingBottom: 80
		}
	},
	scheduleContainer: {
		backgroundColor: 'rgba(255, 255, 255, 0)',
		'&:hover': {
			backgroundColor: 'rgba(237, 237, 237, 0.5)'
		},
	},
	btnContainer: {
		position: 'relative',
		left: '43%',
		marginTop: '45px',
	},
	addScheduleBtn: {
		marginTop: '15px',
		marginLeft: '90%',
	},
	scheduleInfo: {
		paddingTop: '10%',
		paddingBottom: '10px',
		textAlign: 'center',
	},
	toolbar: {
		"box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.04)",
		backgroundColor: "white",
		display: "flex",
		justifyContent: "center"
	},
	appBar: {
		height: 60,
		paddingBottom: 66,
		[theme.breakpoints.down("xs")]: {
			paddingBottom: 60
		}
	}
}));

moment.locale("ko")

const ScheduleMgnt = props => {
	const classes = useStyles();
	const {UserSignInStore, UserAptComplexStore, match, className, history, ...rest } = props;
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	const isDesktop = MC.useMediaQuery(theme.breakpoints.up("lg"));

	const [rootUrl, setRootUrl] = useState("");
	const [today, setToday] = useState(moment(new Date()).format("YYYY-MM-DD"))	// 오늘날짜
	const [selectedDate, setSelectedDate] = useState("");	// 선택된 날짜
	const [selectedDay, setSelectedDay] = useState("")	// 선택된 날짜의 요일
	const [markedDateList, setMarkedDateList ] = useState([]);	// 달력에 표시될 날짜 목록(scheduleList 안 객체의 startDate 추출)
	const [selectedDateScheduleList, setSelectedDateScheduleList] = useState([]);	// 선택된 날짜의 스케줄 목록
	const [alignment, setAlignment] = useState(0);	// 선택된 날짜
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			await getScheduleList(today);
			//await getScheduleDetailList(today);
			await setIsLoading(false);
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const Appointment = ({ children, style, data, ...restProps }) => (
		<Appointments.Appointment
			{...restProps}
			className={classes.scheduleContainer}
			onClick={(event) => handleClickDate(data, event)}
		>
			{
				data.cnt > 0 &&
				<MUI.ToggleButtonGroup
					className={classes.btnContainer}
					color="primary"
					value={alignment}
					exclusive
				>
					<MUI.ToggleButton
						style={{
							borderRadius: '50%',
							backgroundColor: 'rgba(255, 193, 7, 0.5)'
						}}
						size={"small"}
						value={data.seq} />
				</MUI.ToggleButtonGroup>
			}
		</Appointments.Appointment>
	);

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle()
	});

	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn: () => noCallback()
				};
			}
		);
	};

	const generateRootUrl = async () => {
		let rootUrl = `/${UserAptComplexStore.aptComplex.aptId}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getScheduleList = (date) => {	// 기본 스케줄 목록 조회
		scheduleMgntRepository.getScheduleList({
			sch_date : date,
			cmpx_numb: UserAptComplexStore.cmpxNumb
		}, true).then(result => {
			let tempScheduleList = result.data_json_array;
			getMarkedDateList(tempScheduleList, date);	// 달력에 노란 동그라미로 표시될 날짜 리스트 생성

			// 첫 렌더링 및 Month 변경 시 Default 설정
			setSelectedDate(date);
			setSelectedDay(moment(date).format("dd"));

			let selectedDefaultDate = result.data_json_array.filter((item, index) => item.cal_date === date);
			setSelectedDateScheduleList(selectedDefaultDate[0].cal_json);

		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n" + "errorcode: " + e.errorcode,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				},
				undefined
			);
		});
	}

	const getMarkedDateList = (data, tempDate) => {
		let tempArray = [];
		let result = [];

		data.map((item, index) => {
			tempArray.push({
				tempDate: moment(item.cal_date).format("YYYY-MM-DD"),
				tempList: item.cal_json,
				tempCnt: item.cal_cnt,
				tempDay: item.cal_week
			});
		});

		tempArray.map((item, index) => {
			let date = item.tempDate;
			let scheduleList = item.tempList;
			let cnt = item.tempCnt;
			let day = item.tempDay;

			if(date == tempDate) {	// 선택된 날짜인 경우의 index 번호 저장
				setAlignment(index)
			}

			let tempObj = {seq: index, startDate: "", endDate: "", cnt: 0, day: "", scheduleList: []};
			tempObj.startDate = date.concat(" 00:00:00");
			tempObj.endDate = date.concat(" 23:59:59");
			tempObj.cnt = cnt;
			tempObj.day = day;
			tempObj.scheduleList = scheduleList;
			result.push(tempObj);
		});
		setMarkedDateList(result);
	}

	const handleClickDate = (item, event) => {
		let date = moment(item.startDate).format("YYYY-MM-DD");
		setAlignment(item.seq);	// 선택딘 날짜의 순서 저장
		setSelectedDate(date);	// 선택된 날짜 저장
		setSelectedDay(item.day)	// 선택된 날짜의 요일 저장
		setSelectedDateScheduleList(item.scheduleList);	// 날짜 클릭 시 해당 날짜에 이미 존재하는 데이터로 리스트에 저장(API 호출 X)
	}

	const goDetailSchedule = (id) => {
		history.push(`${rootUrl}/articles/notice/` + id);
	}

	const handleChangeMonth = (date) => {
		let tempDate = moment(date).format("YYYY-MM-DD");
		getScheduleList(tempDate);
		//getScheduleDetailList(tempDate);
	}

	return (
		<div className={classes.root}>
			{
				!isMobile &&
				<div className={classes.background} />
			}

			{
				!isLoading &&
				<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"} className={classes.content}>
					<div className={classes.layout}>

						{
							!isMobile &&
							<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
								<MC.Grid item>
									<MC.Typography variant="h3">
										아파트 일정
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
						}

						<MC.Grid item style={{ marginTop: isMobile ? 0 : 66 }}>
							<MC.AppBar position="static" elevation={0} className={classes.appBar}>
								<MC.Toolbar className={classes.toolbar}>
									<MC.Typography variant="h5" component="div">
										{selectedDate.split('-')[0] + "년 " + selectedDate.split('-')[1] + "월"}
									</MC.Typography>
								</MC.Toolbar>
							</MC.AppBar>
						</MC.Grid>

						<MC.Grid container spacing={2} style={{ marginTop: isMobile ? 0 : 0 }}>
							<MC.Grid item xs={12} md={8} style={{ paddingTop: isMobile ? 0 : 40 }}>
								<MC.Paper style={{ width: isDesktop ? '750px' : 'auto' }}>
									<Scheduler
										data={markedDateList}
									>
										<ViewState
											defaultCurrentDate={today}
											onCurrentDateChange={(date) => handleChangeMonth(date)}
										/>
										<MonthView/>
										<Appointments
											appointmentComponent={Appointment}
										/>
										<Toolbar />
										<DateNavigator />
										<TodayButton />
									</Scheduler>
								</MC.Paper>
							</MC.Grid>

							<MC.Grid item xs={12} md={4} style={{ padding: '0px 10px'}}>
								<MC.Grid item xs={12} md={12} className={classes.scheduleInfo}>
									<MC.Typography variant={"h4"}>{selectedDate + '(' + selectedDay + ')'}</MC.Typography>
								</MC.Grid>

								<MC.Divider />

								<MC.Grid item xs={12} md={12}>
									<MC.Table size="small">
										<MC.TableBody>
											{
												selectedDateScheduleList.length === 0 ?
													<MC.TableRow hover>
														<MC.TableCell colSpan={2} align="center">
															조회된 일정이 없습니다.
														</MC.TableCell>
													</MC.TableRow>
													:
													selectedDateScheduleList.map((schedule, index) => (
														<MC.TableRow key={index} hover>
															<MC.TableCell align={"center"}>{schedule.title}</MC.TableCell>
															<MC.TableCell align={"center"}>
																<MC.Button
																	color={"primary"}
																	variant={"outlined"}
																	onClick={() => goDetailSchedule(schedule.id)}
																>
																	상세보기
																</MC.Button>
															</MC.TableCell>
														</MC.TableRow>
													))
											}
										</MC.TableBody>
									</MC.Table>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					</div>
				</MC.Grid>
			}

			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
			/>

		</div>
	)
}

export default inject("UserSignInStore", "UserAptComplexStore")(observer(ScheduleMgnt));
