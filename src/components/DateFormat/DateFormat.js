import React  from "react";
import Moment from "react-moment";

const DateFormat = (props) => {
	return (
		<Moment
			format={props.format || "YYYY.MM.DD HH:mm"}
			tz={"Asia/SEOUL"}>
			{props.date}
		</Moment>
	);
};

export default DateFormat;
