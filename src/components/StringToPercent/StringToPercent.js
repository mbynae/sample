import React from "react";

const stringToPercent = (str) => {
	if ( str ) {
		let integer = str.substring(0, 3);
		let decimal = "0." + str.substring(3, str.length);
		return integer * 1 + decimal * 1;
	} else {
		return 0;
	}
};

export default stringToPercent;
