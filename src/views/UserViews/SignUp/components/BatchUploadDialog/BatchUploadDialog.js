import React, { useEffect, forwardRef } from "react";
import { accountRepository }            from "../../../../../repositories";

//import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

const Transition = forwardRef((props, ref) => {
	return <MC.Slide direction={"up"} ref={ref} {...props} />;
});

// const useStyles = MS.makeStyles(theme => ({
// 	content: {
// 		// minWidth:  432,
// 		// maxWidth:  432,
// 		maxHeight: 147,
// 		minHeight: 147,
// 		display: "flex",
// 		justifyContent: "center",
// 		alignItems: "center"
// 	},
// 	h6: {
// 		...theme.typography.h6
// 	}
// }));

const BatchUploadDialog = props => {

	//const classes = useStyles();

	const {
		isMobile,
		isOpen,
		handleYes,
		batchCheckList,
		formState,
		UserAptComplexStore,
		aptComplex,
		alertOpens,
		setAlertOpens,
		handleAlertToggle,
		history
	} = props;

	useEffect(() => {
		const init = () => {

		};
		setTimeout(() => {
			init();
		});
	}, []);

	const handleRowClick = (obj) => {

		handleYes() // 모달 Close

		let addParam = {
			mbil_teln: obj.mbil_teln,
			memb_nick: formState.values.nickName.trim(),
			id: formState.values.userId.trim(),
			pswd: formState.values.password.trim(),
			prvc_polc_at: "Y",
			memb_numb: obj.memb_numb,
			cmpx_numb: obj.cmpx_numb
		};

		handleAlertToggle(
			"isConfirmOpen",
			"자동 승인 진행",
			"선택한 계정이 본인의 계정이 맞습니까?",
			"예",
			async () => {

				const param = JSON.stringify(addParam);

				accountRepository.addUserBatchUpload(param, true).then(result => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					handleAlertToggle(
						"isOpen",
						undefined,
						result.msg,
						undefined,
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							history.push(`/${aptComplex.aptId}/dashboard`);
						}
					);
				}).catch(e => {
					handleAlertToggle(
						"isOpen",
						undefined,
						e.errormsg,
						"확인",
						async () => {
							setAlertOpens({ ...alertOpens, isOpen: false });
						},
						undefined
					);
				});
			},
			"아니오",
			() => {
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	return (
		<MC.Dialog
			fullScreen={isMobile}
			open={isOpen}
			onClose={() => handleYes()}
			TransitionComponent={Transition}
			// onClose={handleClose}
			scroll={"paper"}
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
		>
			<MC.DialogTitle id="scroll-dialog-title">
				자동 승인 절차
			</MC.DialogTitle>

			<MC.DialogContent dividers={true}>
				<MC.Grid container direction={"column"} justify={"center"}>
					<MC.Typography style={{ fontSize: 14 }}>본인에 해당하는 항목을 선택해주세요.</MC.Typography>
					<br/>
					<MC.Paper style={{ padding: "7px 7px", minWidth: 400 }}>
						<MC.Table>
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>이름</MC.TableCell>
									<MC.TableCell align={"center"}>전화번호</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{batchCheckList.map((obj, index) => (
									<MC.TableRow key={index} hover>
										<MC.TableCell align={"center"} onClick={() => handleRowClick(obj)}>
											{`${obj.memb_name}`}
										</MC.TableCell>
										<MC.TableCell align={"center"} onClick={() => handleRowClick(obj)}>
											{`${obj.mbil_teln}`}
										</MC.TableCell>
									</MC.TableRow>
								))}
							</MC.TableBody>
						</MC.Table>
					</MC.Paper>
				</MC.Grid>
			</MC.DialogContent>

			<MC.DialogActions>
				<MC.Button fullWidth variant="contained" disableElevation onClick={() => handleYes()} color="primary"
									 style={{ height: 40 }}>
					닫기
				</MC.Button>
			</MC.DialogActions>

		</MC.Dialog>
	);
};

export default BatchUploadDialog;
