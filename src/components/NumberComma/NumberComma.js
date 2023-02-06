import React from "react";

/*
	뷰 전용 숫자 콤마 컴포넌트
 */
const NumberComma = ( number ) => {
	if ( number ) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		return 0;
	}
};

export default NumberComma;
