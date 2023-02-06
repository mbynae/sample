import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Grid from "@mui/material/Grid";

import { useTheme } from "@material-ui/styles";
import { Button } from "@material-ui/core";

const PreCheckDetailsSearchBar = (props) => {
	const {
		isReserved,
		handleAlertToggle,
		setAlertOpens,
		preCheckInfo,
		goToCreatePrecheck,
		precheckInfo,
	} = props;
	const v4Theme = useTheme();

	return (
		<Grid
			container
			justifyContent={"center"}
			alignItems={"center"}
			sx={{
				mt: (theme) => theme.spacing(1),
				px: (theme) => ({
					xs: theme.spacing(2),
					sm: 0,
				}),
			}}
			spacing={1}
		>
			<Grid
				item
				sx={{
					width: {
						xs: "100%",
						sm: "fit-content",
					},
				}}
			>
				<Button
					size="large"
					// disabled={selectedObjects.length === 0}
					disableElevation
					color="primary"
					variant="contained"
					fullWidth
					onClick={() => {
						handleAlertToggle(
							"isOpen",
							undefined,
							<div
								dangerouslySetInnerHTML={{ __html: preCheckInfo }}
								style={{ minHeight: 398, maxHeight: "none" }}
							/>,
							undefined,
							() => {
								setAlertOpens((prev) => {
									return { ...prev, isOpen: false };
								});
							},
							undefined,
							undefined,
							"FLEX_START"
						);
					}}
				>
					사전점검 유의사항
				</Button>
			</Grid>
			{!isReserved && precheckInfo.isBetween && (
				<Grid
					item
					sx={{
						width: {
							xs: "100%",
							sm: "fit-content",
						},
					}}
				>
					<Button
						variant="contained"
						size="large"
						color="primary"
						disableElevation
						fullWidth
						onClick={goToCreatePrecheck}
					>
						사전점검일 예약
					</Button>
				</Grid>
			)}
		</Grid>
	);
};

export default inject("PreCheckDetailStore")(
	withRouter(observer(PreCheckDetailsSearchBar))
);
