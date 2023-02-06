import * as React from "react";
import format     from "date-fns/format";

export const defaultWeekDayRenderer = ({ date }) => {
	return format(date, "E");
};
