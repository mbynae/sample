import React        from "react";
import NumberFormat from "react-number-format";

/*
	입력폼 전용 숫자 포인트 포맷 컴포넌트
 */
const NumberFormatPoint = props => {
	const { inputRef, onChange, ...other } = props;
	
	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name:  props.name,
						value: values.value
					}
				});
			}}
			thousandSeparator
			isNumericString
			suffix={" point"}
		/>
	);
};

export default NumberFormatPoint;
