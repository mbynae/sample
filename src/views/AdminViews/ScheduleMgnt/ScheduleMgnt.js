import React, { useEffect, useState } from "react";
import { inject, observer }                   from "mobx-react";
import * as MS                                from "@material-ui/styles";
import * as MC                                from "@material-ui/core";
import moment                                 from "moment";
import * as MUI                               from "@mui/material";

import {
	Scheduler,
	MonthView,
	Appointments,
	Toolbar,
	DateNavigator,
	TodayButton,
}                                            from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState }                         from "@devexpress/dx-react-scheduler";
import { scheduleMgntRepository }            from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
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
		paddingBottom: '10px',
		textAlign: 'center',
	}
}));

moment.locale("ko")

const ScheduleMgnt = props => {
	const classes = useStyles();
	const {SignInStore, AptComplexStore, match, className, history, ...rest } = props;

	const [rootUrl, setRootUrl] = useState("");
	const [today, setToday] = useState(moment(new Date()).format("YYYY-MM-DD"))	// 오늘날짜
	const [selectedDate, setSelectedDate] = useState("");	// 선택된 날짜
	const [selectedDay, setSelectedDay] = useState("")	// 선택된 날짜의 요일
	const [markedDateList, setMarkedDateList ] = useState([]);	// 달력에 표시될 날짜 목록(scheduleList 안 객체의 startDate 추출)
	const [selectedDateScheduleList, setSelectedDateScheduleList] = useState([]);	// 선택된 날짜의 스케줄 목록
	const [alignment, setAlignment] = useState(0);	// 선택된 날짜
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자/아파트일정",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `일정관리`,
			href:  `${rootUrl}/scheduleMgnt`
		}
	]);

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			await getScheduleList(today);
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
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getScheduleList = (date) => {	// 기본 스케줄 목록 조회
		scheduleMgntRepository.getScheduleList({sch_date : date})
			.then(result => {
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

	// ---------------NOT USE----------------- //
	// const getScheduleDetailList = (date) => {	// 선택된 날짜의 스케줄 상세 목록 조회(처음 렌더링 또는 Month 변경 시에만 호출)
	// 	scheduleMgntRepository.getScheduleDetailList({sch_date : date})
	// 		.then(result => {
	// 			setSelectedDate(date);
	// 			setSelectedDay(moment(date).format("dd"));
	// 			setSelectedDateScheduleList(result.data_json_array);
	// 		}).catch(e => {
	// 		handleAlertToggle(
	// 			"isOpen",
	// 			e.msg,
	// 			e.errormsg + "\n" + "errorcode: " + e.errorcode,
	// 			() => {
	// 				setAlertOpens({ ...alertOpens, isOpen: false });
	// 			},
	// 			undefined
	// 		);
	// 	});
	// }

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

	const addSchedule = () => {
		history.push(`${rootUrl}/articles/notice/edit`);
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
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<div className={classes.content}>
				<MC.Card>

					<MC.CardHeader
						title={"일정관리"}
						titleTypographyProps={{variant: "h4"}}
					/>

					<MC.Divider/>

					<MC.CardContent>
						<MC.Grid container spacing={3}>
							<MC.Grid item xs={12} md={7}>
								<MC.Grid item xs={12} md={12}>
									<MC.Paper>
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
								<MC.Grid item xs={12} md={12}>
									<MC.Button
										className={classes.addScheduleBtn}
										color={"primary"}
										variant={"outlined"}
										onClick={addSchedule} >
										일정추가
									</MC.Button>
								</MC.Grid>
							</MC.Grid>

							<MC.Grid item xs={12} md={5}>
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
					</MC.CardContent>
				</MC.Card>
			</div>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>
		</div>
	)
}

export default inject("SignInStore", "AptComplexStore")(observer(ScheduleMgnt));
