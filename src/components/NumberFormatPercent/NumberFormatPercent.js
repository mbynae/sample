import React        from "react";
import NumberFormat from "react-number-format";

/*
	입력폼 전용 숫자 퍼센트 포맷 컴포넌트
 */
const NumberFormatPercent = props => {
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
			format={"###.## %"}
			mask="_"
			thousandSeparator
			isNumericString
		/>
	);
};

export default NumberFormatPercent;
