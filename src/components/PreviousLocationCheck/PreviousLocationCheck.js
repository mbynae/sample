import React from "react";

const previousLocationCheck = (lastLocation, str) => {
	
	if ( lastLocation ) {
		return lastLocation.pathname.includes(str);
	} else {
		return false;
	}
};

export default previousLocationCheck;
