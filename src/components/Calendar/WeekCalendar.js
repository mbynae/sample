import * as React              from "react";
import addDays                 from "date-fns/addDays";
import startOfWeek             from "date-fns/startOfWeek";
import { defaultCellRenderer } from "./RenderCell";

export const DayView = ({
	date,
	renderCell = defaultCellRenderer,
	isPreviousPeriod = false,
	isNextPeriod = false,
	isMobile = true
}) => {
	return (
		<div style={{ width: "100%" }}>
			{renderCell({ date, isPreviousPeriod, isNextPeriod, isMobile })}
		</div>
	);
};

export const WeekView = ({ date, renderCell }) => {
	const startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 1 });
	let days = [];
	
	for ( let i = 0; i < 7; i++ ) {
		const day = addDays(startOfCurrentWeek, i);
		days.push(
			<DayView key={day.getTime()} date={day} renderCell={renderCell} />
		);
	}
	
	return <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>{days}</div>;
};

export const WeekCalendar = ({
	date = new Date(),
	renderCell
}) => {
	return <WeekView date={date} renderCell={renderCell} />;
};
