import React       from "react";
import MaskedInput from "react-text-mask";

const PhoneMask = props => {
	const { inputRef, ...other } = props;
	
	return (
		<MaskedInput
			{...other}
			ref={(ref) => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={(rawValue) => {
				let str = rawValue.replace(/-/g, "");
				let first = "";
				
				if ( str.length > 2 ) {
					first = str.substring(0, 3);
				}
				
				if ( first.indexOf("02") !== -1 ) {
					// 서울 지역번호
					if ( str.length === 10 ) {
						return [/\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
					} else {
						return [/\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
					}
				} else {
					// 서울 이외 지역번호 + 휴대폰 지역번호
					if ( str.length === 11 ) {
						return [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
					} else {
						return [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
					}
				}
				
			}}
			placeholderChar={"_"}
			showMask
			placeholder={props.placeholder ? props.placeholder : "02-4321-2342 or 010-5321-1234"}
			guide={false}
		/>
	);
};

export default PhoneMask;
