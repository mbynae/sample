import React, {useState, useEffect} from "react";
import clsx from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";
import palette from "../../../../../theme/userTheme/palette";

const useStyles = MS.makeStyles(theme => ({
    root: {
        width: "800px",
				height: "auto",
        padding: 10,
        backgroundColor: "white"
    },
    itemRow: {
        width: "100%",
				padding: "3px 5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    btnGroup: {
        width: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    dateBtn: {
        padding: 0,
        border: "1px solid #eaeaea",
        borderRadius: 0,
        borderCollapse: "collapse",
        left: "1px"
    },
    itemExpl: {
        fontSize: 12,
        paddingLeft: 5,
        paddingRight: 5
    }
}));

const ResrvSeatModal = props => {

	const classes = useStyles();
	const { seatModalOpen, handleSeatModal, selectedSeat, setSelectedSeat, seatList, setErrors } = props;

	// 좌석 선택 Handler
	const handleSelectSeat = (seat) => {
		// Validation 체크
		setErrors(prev => {
			return {
				...prev,
				detl_numb : false
			}
		});
		setSelectedSeat(seat);
	};

	// 모달 Close
	const handleCloseModal = () => {
		handleSeatModal(false);
	}

	return (
		<MC.Modal
			open={seatModalOpen}
			onClose={() => handleSeatModal(false)}
			disablePortal
			disableEnforceFocus
			disableAutoFocus
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<MC.Grid container className={classes.root}>
				{/* Header 시작 */}
				<MC.Grid item className={classes.itemRow}>
					<MC.Typography variant={"h4"}>좌석 선택</MC.Typography>
					<MI.Close onClick={handleCloseModal} />
				</MC.Grid>
				{/* Header 끝 */}
				<MC.Grid item style={{width: '100%'}}>
					<hr style={{
						marginTop: 10,
						width: "100%",
						color: "#bfbfbf",
						backgroundColor: "#bfbfbf",
						height: "1px"
					}} />
				</MC.Grid>

				{/* 좌석 선택 */}
				<MC.Paper style={{ marginTop: 20, padding: "30px 20px", minWidth: 780 }}>
					<MC.Grid container spacing={4} alignItems={"center"}>
						{seatList && seatList.map((item, index) =>
							<MC.Grid item xs={6} lg={3} key={index}>
								<MC.Button
									onClick={() => handleSelectSeat(item.detl_numb)}
									disabled={item.seat_cnt !== 0}
									variant={"contained"}
									color={item.detl_numb === selectedSeat ? "primary" : palette.white.main}
									style={{ width: "100%" }}
								>
									{item.detl_numb}
								</MC.Button>
							</MC.Grid>
						)}
					</MC.Grid>
				</MC.Paper>
				{/*	좌석 색깔별 가이드*/}
				<MC.Grid container spacing={6} alignItems={"center"} justify={"flex-start"}
								 style={{ marginTop: 15, marginLeft: 2 }}>
					<div style={{ border: "1px solid gray", backgroundColor: "#3f51b5", width: 20, height: 20 }}></div>
					<MC.Typography>&nbsp;선택 완료</MC.Typography>
					&nbsp;&nbsp;
					<div style={{ border: "1px solid gray", backgroundColor: "#FFFFFF", width: 20, height: 20 }}></div>
					<MC.Typography>&nbsp;예약 가능</MC.Typography>
					&nbsp;&nbsp;
					<div
						style={{ border: "1px solid gray", backgroundColor: "rgba(0, 0, 0, 0.12)", width: 20, height: 20 }}></div>
					<MC.Typography>&nbsp;예약 완료</MC.Typography>
					&nbsp;&nbsp;
				</MC.Grid>

				<MC.Grid container spacing={1} alignItems={"center"} justify={"flex-end"} style={{ marginRight: 2 }}>
					<MC.Button
						color="primary"
						size="large"
						variant="contained"
						disableElevation
						onClick={() => handleCloseModal()}
					>
						선택
					</MC.Button>
				</MC.Grid>
			</MC.Grid>
		</MC.Modal>
	);
};

export default ResrvSeatModal;
