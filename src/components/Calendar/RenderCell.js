import React from "react";

export const defaultCellRenderer = ({ date, isPreviousPeriod, isNextPeriod }) => {
	const isNotCurr = isPreviousPeriod || isNextPeriod;
	return (
		<div style={{ height: 100, opacity: isNotCurr ? 0.5 : 1 }}>
			{date.getDate()}
		</div>
	);
};
