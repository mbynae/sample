import React, { useEffect, useState, useRef } from "react";
import ReactDOM     from "react-dom";

import * as MC from "@material-ui/core";
import PerfectScrollbar                        from "react-perfect-scrollbar";

import { AlertDialog } from "../../../../../components";
import * as MS         from "@material-ui/styles";
import palette         from "../../../../../theme/adminTheme/palette";

const useStyles = MS.makeStyles(theme => ({

	content: {
		margin: 0,
		padding: 0,
		font: "12pt Tahoma"
	},
	page: {
		width: "21cm",
		minHeight: "29.7cm",
		padding: "2cm",
		margin: "1cm auto",
		borderRadius: "5px",
		background: "white",
		boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)"
	},
	subpage: {
		padding: "1cm",
		height: "256mm",
		border: "1px solid #dcdcdc",
		boxShadow: "none",
		display: "flex",
		justifyContent: "center"
	},
	dialogActions: {
		display: "flex",
		justifyContent: "center"
	}
}));

const MoveReservationInfoDialog = props => {
	const classes = useStyles();
	const { open, onClose, selectedObjectForNotice: obj, AptComplexStore } = props;

	const [scroll, setScroll] = React.useState("paper");

	const a4Notice = useRef();

	useEffect(() => {
		const init = () => {

		};
		setTimeout(() => {
			init();
		});
	}, [open]);

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};

	// 인쇄 기능 Handler
	const onPrintHandler = () => {

		let printContents = ReactDOM.findDOMNode(a4Notice.current).innerHTML;
		let windowObject = window.open('', "PrintWindow", "width=1000, height=800, top=100, left=300, toolbars=no, scrollbars=no, status=no, resizale=no");

		windowObject.document.writeln(printContents);
		windowObject.document.close();
		windowObject.focus();
		windowObject.print();
		windowObject.close();
	}

	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			scroll={scroll}
			maxWidth="lg"
			aria-labelledby="moveReservation-notice-dialog-title">

			<PerfectScrollbar>
				<MC.DialogContent className={classes.content} style={{margin: 0, padding: 0, font: "12pt Tahoma"}}>

					<MC.Paper
						className={classes.page}
						ref={a4Notice}
						style={{
							width: "21cm",
							minHeight: "29.7cm",
							padding: "2cm",
							margin: "1cm auto",
							borderRadius: "5px",
							background: "white",
							boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)"
						}}
					>
						<MC.Paper className={classes.subpage}
							style={{
								padding: "1cm",
								height: "250mm",
								border: "1px solid #dcdcdc",
								boxShadow: "none",
								display: "flex",
								justifyContent: "center"
							}}
						>

							{/* 본문 */}
							<MC.Grid>

								<MC.Typography variant="h1" style={{
									textAlign: "center",
									padding: "20px 0px",
									borderTop: "thick double black",
									borderBottom: "thick double black"
								}}>
									이사 안내문
								</MC.Typography>

								<MC.Typography variant="h3" style={{ textAlign: "center", paddingTop: 150}}>
									{obj.mvio_strt_date}일 {obj.mvio_strt_time && obj.mvio_strt_time.substring(0, 2)}시에
								</MC.Typography>
								<br/>
								<MC.Typography variant="h3" style={{ textAlign: "center", paddingBottom: 130 }}>
									{obj.dong_numb}동 {obj.ho_numb}호 이사합니다.
								</MC.Typography>

								<MC.Typography variant="h4" style={{ textAlign: "center", paddingBottom: 270 }}>
									엘리베이터 및 주차이용에 불편을 드려 죄송합니다. <br/><br/>
									입주민 여러분의 협조 부탁드립니다.
								</MC.Typography>

								<MC.Typography variant="h4" style={{ textAlign: "center"}}>
									{AptComplexStore.aptComplex.aptInformationDataType.aptName} 아파트
								</MC.Typography>

							</MC.Grid>

						</MC.Paper>
					</MC.Paper>

				</MC.DialogContent>
			</PerfectScrollbar>

			<MC.DialogActions className={classes.dialogActions}>
				<MC.ButtonGroup
					aria-label="text primary button group"
					color="primary">
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4,
							minWidth: 150
						}}
						onClick={onClose}
					>
						취소
					</MC.Button>
					<MC.Button
						style={{
							color: palette.primary.main,
							borderColor: palette.primary.main,
							marginLeft: 10,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4,
							minWidth: 150
						}}
						onClick={onPrintHandler}
					>
						인쇄하기
					</MC.Button>
				</MC.ButtonGroup>
			</MC.DialogActions>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>

		</MC.Dialog>
	);
};

export default MoveReservationInfoDialog;
