import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { contractTypeRepository, resrvHistRepository } from "../../../../../repositories";
import { AlertDialog }                                 from "../../../../../components";
import palette           from "../../../../../theme/adminTheme/palette";
import { autorun, toJS } from "mobx";

const useStyles = MS.makeStyles(theme => ({
	contractTypesLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:              {
		margin: theme.spacing(1)
	},
	listItemLayout:      {
		paddingRight: 96
	}
}));

const ResrvHistAllSmsDialog = props => {

	const classes = useStyles();
	const { contractTypes, setContractTypes, open, onClose, DelayObject } = props;
	const [smsComment, setSmsComment] = useState("");
	const [smsYn, setSmsYn] = useState(true);
	const [smsChecked, setSmsChecked] = useState(false);
	let [scroll, setScroll] = React.useState("paper");

	const handleSmsCommentChange = (event) => {
		setSmsComment(event.target.value);
	};

	const handleAllSmsCommentSubmit = (event) => {

		let oddArray = {smslist : []};

		DelayObject.forEach(function(element){
			oddArray.smslist.push({
				send_hpno: element.mbil_teln,
				smstype: "CUSTOM_RSVT",
				comment: smsComment
			})
		});

		console.log(oddArray);

		if (window.confirm("일괄 SMS 발송을 하시겠습니까?")) {
			const resrvHistorySearchAdmins = resrvHistRepository.getResrvSmsSubmit(oddArray, "");

			resrvHistorySearchAdmins.then((data) => {
				console.log(data);
				if(data.msgcode == 1){
					alert("일괄 SMS 발송 되었습니다.");
				}else{
					alert("일괄 SMS 발송중 문제가 \n발생 되었습니다.");
				}
			});
		}
	}

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

	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			scroll={scroll}
			aria-labelledby="form-contractType-dialog-title">
			<MC.DialogTitle id="form-contractType-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				SMS 일괄 발송
				{/*</MC.Typography>*/}
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>

				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={12}>
						<div className={classes.contractTypesLayout}>
							<MC.List>
								{
									contractTypes && contractTypes.length > 0 ? contractTypes.map((contractType, index) => (
											<MC.ListItem key={index} className={classes.listItemLayout}>
												<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
													<MC.Input
														id={`contractType-update-basic-${index}`}
														type={"text"}
														value={contractType.name}
														startAdornment={
															<MC.InputAdornment position="start">
																<MC.Typography variant={"h5"}>
																	{index + 1}
																</MC.Typography>
															</MC.InputAdornment>
														}
														onChange={(event) => {
															let value = event.target.value;
															setContractTypes(prev => {
																const which = ct => ct.id === contractType.id;
																let index = prev.findIndex(which);
																let temp = prev.find(which);
																temp.name = value;
																prev[index] = temp;
																return [
																	...prev
																];
															});
														}}
													/>
												</MC.FormControl>

												<MC.ListItemSecondaryAction>
													<MC.IconButton
														edge="end"
														aria-label="edit"
														onClick={() => handleUpdateContractType(contractType)}>
														<MI.Edit />
													</MC.IconButton>

													<MC.IconButton
														edge="end"
														aria-label="delete"
														onClick={() => handleDeleteContractType(contractType.id)}>
														<MI.Delete />
													</MC.IconButton>
												</MC.ListItemSecondaryAction>
											</MC.ListItem>
										))
										:
										(
											<MC.ListItem>
												{<MC.ListItemText primary="수동으로 SMS를 일괄 발송할 수 있습니다. 발송할 내용을 입력 후 일괄 발송버튼을 눌러주세요." />}
											</MC.ListItem>
										)
								}

							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.TextField
								label="SMS발송 내용"
								id="smsMessage"
								name="smsMessage"
								type={"text"}
								value={smsComment}
								onChange={handleSmsCommentChange}
								endAdornment={
									<MC.InputAdornment position="end">
										<MC.IconButton
											aria-label="toggle password visibility"
											onClick={() => {

											}}
										>
											<MI.PlaylistAdd />
										</MC.IconButton>
									</MC.InputAdornment>
								}
							/>
						</MC.FormControl>
					</MC.Grid>
				</MC.Grid>

			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button
					style={{
						color: palette.primary.main,
						borderColor: palette.primary.main,
						marginLeft: 10,
						borderTopLeftRadius: 4,
						borderBottomLeftRadius: 4
					}}
				onClick={handleAllSmsCommentSubmit}>일괄발송
				</MC.Button>
				<MC.Button onClick={onClose}>
					닫기
				</MC.Button>
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

export default ResrvHistAllSmsDialog;
