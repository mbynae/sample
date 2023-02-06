import React from "react";

/*
	뷰 전용 전화번호 하이픈 추가 컴포넌트
 */
const PhoneHyphen = (number) => {
	if ( number ) {
		return number.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
	} else {
		return "";
	}
};

export default PhoneHyphen;
