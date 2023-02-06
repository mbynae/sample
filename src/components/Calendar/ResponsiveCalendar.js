import * as React       from "react";
import { useState }     from "react";
import { MonthView }    from "./MonthCalendar";
import { WeekCalendar } from "./WeekCalendar";
import { ViewType }     from "./index";

const ResponsiveCalendar = (props) => {
	const {
		      withWeekDays,
		      date       = new Date(),
		      onViewChanged,
		      renderWeekDay,
		      renderCell,
		      breakPoint = 375
	      } = props;
	const [view, setView] = useState();
	const updateView = React.useCallback((size) => {
		if ( size > breakPoint ) {
			setView(ViewType.DESKTOP);
		} else {
			setView(ViewType.MOBILE);
		}
	}, [breakPoint]);
	const onResize = React.useCallback((e) => {
		updateView(document.body.offsetWidth);
	}, []);
	React.useEffect(() => {
		updateView(document.body.offsetWidth);
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);
	
	React.useEffect(() => {
		if ( onViewChanged && view ) {
			onViewChanged(view);
		}
	}, [view]);
	
	if ( !view ) {
		return null;
	}
	
	if ( view === ViewType.DESKTOP ) {
		return (
			<MonthView date={date} withWeekDays={withWeekDays} view={view} renderWeekDay={renderWeekDay} renderCell={renderCell} />
		);
	}
	
	return (
		<WeekCalendar date={date} view={view} renderCell={renderCell} />
	);
};

export default ResponsiveCalendar;
