import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";

// import * as MC from "@material-ui/core";
// import * as MS from "@material-ui/styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";

import { PreviousLocationCheck } from "../../../../../components";
import moment from "moment";

import { useTheme } from "@material-ui/styles";
import { Button } from "@material-ui/core";

import format from "date-fns/format";
import addHours from "date-fns/addHours";
import { apiObject } from "../../../../../repositories/api";
import { toJS } from "mobx";

// const useStyles = MS.makeStyles((theme) => ({}));

const labelWidth = 240;

const radiusLabel = {
	borderRadius: 1,
	borderTopRightRadius: (theme) => ({
		xs: theme.shape.borderRadius,
		sm: 0,
	}),
	borderBottomLeftRadius: (theme) => ({
		xs: 0,
		sm: theme.shape.borderRadius,
	}),
	borderBottomRightRadius: 0,
};

const PreCheckTitle = (props) => {
	const v4Theme = useTheme();

	const {
		preCheckDetails,
		isReserved,
		setIsReserved,
		PreCheckSignInStore,
		handleAlertToggle,
		setAlertOpens,
	} = props;

	const deletePreCheck = async (id) => {
		try {
			const preCheckUserId = toJS(PreCheckSignInStore).currentUser.id;
			const responseDeletePreCheck = await apiObject.deletePreCheck({
				id: preCheckUserId,
			});
			handleAlertToggle(
				"isOpen",
				undefined,
				"사전점검 예약이 취소되었습니다.",
				undefined,
				() => {
					setAlertOpens((prev) => ({ ...prev, isOpen: false }));
				}
			);
			setIsReserved(false);
		} catch (error) {
			console.log({ error });
			handleAlertToggle(
				"isOpen",
				undefined,
				"예약이 취소되지 않았습니다.\n다시 시도해주세요.",
				undefined,
				() => {
					setAlertOpens((prev) => ({ ...prev, isOpen: false }));
				}
			);
		}
	};

	return (
		<Box
			sx={{
				mt: (theme) => theme.spacing(3),
				px: (theme) => ({
					xs: theme.spacing(2),
					sm: 0,
				}),
				width: "100%",
			}}
		>
			<Paper
				sx={{
					// borderRadius: 0,
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						...radiusLabel,
						width: {
							xs: "100%",
							sm: 240,
						},
						height: (theme) => ({
							xs: theme.spacing(6),
							sm: theme.spacing(7),
						}),
						bgcolor: () => v4Theme.palette.primary.main,
						color: "white",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Typography>나의 예약내역</Typography>
				</Box>

				<Typography
					sx={{
						height: "fit-content",
						p: (theme) => theme.spacing(2),
						color: (theme) => {
							return isReserved
								? v4Theme.palette.primary.main
								: theme.palette.text.disabled;
						},
						flex: "1 1 auto",
					}}
				>
					{isReserved
						? `${format(
								new Date(preCheckDetails.preCheckDate),
								"yyyy-MM-dd HH:mm"
						  )} ~ ${format(
								addHours(
									new Date(preCheckDetails.preCheckDate),
									preCheckDetails.slot
								),
								"HH:mm"
						  )}`
						: "아래 사점검검일 예약을 통해 방문일시를 선택해주세요."}
				</Typography>

				{isReserved && (
					<Box
						sx={{
							flex: "1 1 content",
							display: "flex",
							justifyContent: {
								xs: "center",
								sm: "flex-end",
							},
							height: "100%",
							px: (theme) => theme.spacing(1),
							pb: (theme) => ({
								xs: theme.spacing(1),
								sm: 0,
							}),
						}}
					>
						<Button
							variant="outlined"
							color="secondary"
							onClick={() => {
								deletePreCheck();
							}}
						>
							예약취소
						</Button>
					</Box>
				)}
			</Paper>
		</Box>
	);
};

export default inject(
	"PreCheckDetailStore",
	"PreCheckSignInStore"
)(withRouter(observer(PreCheckTitle)));
