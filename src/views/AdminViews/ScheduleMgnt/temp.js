import * as MC         from "@material-ui/core";
import {
	Appointments,
	DateNavigator,
	MonthView,
	Scheduler,
	TodayButton,
	Toolbar
}                      from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState }   from "@devexpress/dx-react-scheduler";
import { AlertDialog } from "../../../components";
import React           from "react";

<MC.Grid container spacing={3}>
	<MC.Grid item xs={12} md={7} style={{paddingTop:'5%', paddingLeft:'3%'}}>
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

	<MC.Grid item xs={12} md={5} style={{width: '90%', paddingRight: '5%'}}>
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
