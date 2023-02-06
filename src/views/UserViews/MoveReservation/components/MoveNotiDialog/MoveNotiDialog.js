import React, { useState, useEffect, forwardRef } from "react";

import * as MS                       from "@material-ui/styles";
import * as MC                       from "@material-ui/core";
import { moveReservationRepository } from "../../../../../repositories";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

const useStyles = MS.makeStyles(theme => ({
	content: {
		// minWidth:  432,
		// maxWidth:  432,
		maxHeight:      147,
		minHeight:      147,
		display:        "flex",
		justifyContent: "center",
		alignItems:     "center"
	},
	h6:      {
		...theme.typography.h6
	}
}));

const MoveNotiDialog = props => {

	const classes = useStyles();

	const [moveReservationInfo, setMoveReservationInfo] = useState({
		mvio_cnts: "",
		//mvio_code: ""
	});

	useEffect(() => {
		const init = () => {
			getMoveReservationInfo();
		};
		setTimeout(() => {
			init();
		});
	}, []);


	const getMoveReservationInfo = () => {

		moveReservationRepository
			.getMoveReservationInfo({
				//info_numb : 3 // Temp: 3
			}, true)
			.then(result => {
				if (result.data_json) {
					setMoveReservationInfo(prev => {
						return {
							...prev,
							mvio_cnts: result.data_json.mvio_cnts || "",
							//mvio_code: result.data_json.mvio_code || ""
						};
					});
				} else {
					setMoveReservationInfo(prev => {
						return {
							...prev,
							mvio_cnts: "",
							//mvio_code: ""
						};
					});
				}
			});
	};

	return (
		<MC.Dialog
			fullScreen={props.isMobile}
			open={props.isOpen}
			onClose={() => props.handleYes()}
			TransitionComponent={Transition}
			// onClose={handleClose}
			scroll={"paper"}
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
		>
			<MC.DialogTitle id="scroll-dialog-title">
				이사예약 안내사항
			</MC.DialogTitle>
			<MC.DialogContent dividers={true}>
				{/*<MC.DialogContentText id="scroll-dialog-description" style={{ whiteSpace: "pre-line" }}>*/}
					{moveReservationInfo.mvio_cnts !== "<p><br></p>" && moveReservationInfo.mvio_cnts !== "" &&
					<div className="ql-editor"
							 dangerouslySetInnerHTML={{ __html: moveReservationInfo.mvio_cnts }}
							 style={{ minHeight: 300, minWidth: 400, maxHeight: "none", fontSize: 14, fontFamily: "Noto Sans KR, sans-serif", fontWeight: 700, color: "#546e7a" }}>
					</div>
					}
					{moveReservationInfo.mvio_cnts === "<p><br></p>" || moveReservationInfo.mvio_cnts === "" &&
					<div
							 style={{ minHeight: 30, minWidth: 300, paddingTop: 5, textAlign: "center", fontSize: 14, fontFamily: "Noto Sans KR, sans-serif", fontWeight: 700, color: "#546e7a" }}>
						등록된 안내사항이 없습니다.
					</div>
					}
				{/*</MC.DialogContentText>*/}
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button fullWidth variant="contained" disableElevation onClick={() => props.handleYes()} color="primary" style={{ height: 40 }}>
					닫기
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	);
};

export default MoveNotiDialog;

