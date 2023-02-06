import React from "react";
import * as MC from "@material-ui/core";

const PayFeeInfo = (props) => {
	const { info } = props;

	return (
		<MC.Grid
			container
			direction={"column"}
			justify={"center"}
			alignItems={"center"}
			style={{
				backgroundColor: "#fafafa",
				paddingTop: 16,
				paddingBottom: 12,
			}}
		>
			<MC.Grid
				item
				style={{
					width: "100%",
					borderBottom: "2px dashed #ebebeb",
					paddingBottom: 16,
					marginBottom: 19,
				}}
			>
				<MC.Grid
					container
					direction={"row"}
					justify={"center"}
					alignItems={"center"}
				>
					<MC.Grid item style={{ textAlign: "center" }}>
						<MC.Typography variant={"subtitle1"}>수납정보</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
			<MC.Grid item>
				<div
					className="ql-editor"
					dangerouslySetInnerHTML={{
						__html:
							info?.aptComplex?.receivingInformation !== ""
								? info?.aptComplex?.receivingInformation
								: "등록된 수납정보가 없습니다.",
					}}
					style={{ maxHeight: "none", fontSize: 14, fontFamily: "Noto Sans KR, sans-serif", fontWeight: 700, color: "#546e7a" }}
				/>
			</MC.Grid>
		</MC.Grid>
	);
};

export default PayFeeInfo;
