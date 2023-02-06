import * as React                 from "react";
import getDaysInMonth             from "date-fns/getDaysInMonth";
import startOfMonth               from "date-fns/startOfMonth";
import getDay                     from "date-fns/getDay";
import addDays                    from "date-fns/addDays";
import subDays                    from "date-fns/subDays";
import startOfWeek                from "date-fns/startOfWeek";
import endOfMonth                 from "date-fns/endOfMonth";
import { defaultCellRenderer }    from "./RenderCell";
import { defaultWeekDayRenderer } from "./RenderWeekDay";

export const DayView = ({
	date,
	renderCell = defaultCellRenderer,
	isPreviousPeriod = false,
	isNextPeriod = false,
	isMobile = false
}) => {
	return (
		<div style={{ width: "calc(100% / 7)" }}>
			{renderCell({ date, isPreviousPeriod, isNextPeriod, isMobile })}
		</div>
	);
};

export const WeekDay = ({
	date,
	renderWeekDay = defaultWeekDayRenderer,
	view
}) => {
	return (
		<div style={{ width: "calc(100% / 7)" }}>
			{renderWeekDay({
				date,
				view: view
			})}
		</div>
	);
};

export const WeekDays = ({
	date,
	view,
	renderWeekDay
}) => {
	const startOfCurrentWeek = startOfWeek(date, {
		weekStartsOn: 0
	});
	const days = [];
	
	for ( let i = 0; i < 7; i++ ) {
		const day = addDays(startOfCurrentWeek, i);
		days.push(
			<WeekDay
				key={day.getTime()}
				date={day}
				view={view}
				renderWeekDay={renderWeekDay}
			/>
		);
	}
	
	return <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>{days}</div>;
};

export const EmptyDayView = () => {
	return <div style={{ width: "calc(100% / 7)" }}></div>;
};

export const MonthView = ({
	date,
	withWeekDays,
	renderWeekDay,
	view,
	renderCell
}) => {
	const firstDayOfMonth = startOfMonth(date);
	const lastDayOfMonth = endOfMonth(date);
	const daysInMonth = getDaysInMonth(date);
	const weekDayOfFirstDay = getDay(firstDayOfMonth);
	const weekDayOfLastDay = getDay(lastDayOfMonth);
	const needToAddDays = weekDayOfFirstDay === 0 ? 6 : weekDayOfFirstDay;
	let days = [];
	
	// Add previous days
	for ( let i = 0; i < needToAddDays; i++ ) {
		const day = subDays(firstDayOfMonth, i + 1);
		days.unshift(
			<DayView
				key={day.getTime()}
				date={day}
				renderCell={renderCell}
				isPreviousPeriod
			/>
		);
	}
	
	for ( let i = 0; i < daysInMonth; i++ ) {
		const day = addDays(firstDayOfMonth, i);
		days.push(
			<DayView key={day.getTime()} date={day} renderCell={renderCell} />
		);
	}
	
	// Add next days
	for ( let i = 0; i < 6 - weekDayOfLastDay; i++ ) {
		const day = addDays(lastDayOfMonth, i + 1);
		days.push(
			<DayView
				key={day.getTime()}
				date={day}
				renderCell={renderCell}
				isNextPeriod
			/>
		);
	}
	
	return (
		<>
			{withWeekDays && (
				<WeekDays date={date} view={view} renderWeekDay={renderWeekDay} />
			)}
			<div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>{days}</div>
		</>
	);
};
