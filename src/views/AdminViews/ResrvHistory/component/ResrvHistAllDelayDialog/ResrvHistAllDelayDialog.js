import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { resrvHistRepository } from "../../../../../repositories";
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

const ResrvHistAllDelayDialog = props => {

	const classes = useStyles();
	const { contractTypes, setContractTypes, open, onClose, delayObject, setDelayObject, getResrvHists, ResrvHistStore,
	setAlertOpens, handleAlertToggle, alertOpens } = props;
	const [periodDayCnt, setPeriodDayCnt] = useState("");
	const [periodReason, setperiodReason] = useState("");
	const [smsYn, setSmsYn] = useState(false);
	const [smsChecked, setSmsChecked] = useState(false);
	let [scroll, setScroll] = React.useState("paper");

	const handlePeriodChange = (event) => {
		const regex = event.target.value.replace(/[^0-9]/g,'');
		if(regex != undefined) {
			setPeriodDayCnt(regex);
		}else{
			return;
		}
	};

	const handleReasonChange = (event) => {
		setperiodReason(event.target.value);
	};

	const handleSmsCheckChange = (event) => {
		if (event.target.checked == true) {
			setSmsYn( true);
			setSmsChecked(true);
		} else if (event.target.checked == false) {
			setSmsYn( false);
			setSmsChecked(false);
		}
	}

	const handleResrvPeriodChange = (event) => {

		let oddArray = {item : []};

		delayObject.forEach(function(element){
			oddArray.item.push({
				prgm_numb: element.prgm_numb,
				rsvt_numb: element.rsvt_numb,
				rsvt_strt_date: element.rsvt_strt_date + " 00:00:00",
				rsvt_end_date: element.rsvt_end_date + " 00:00:00",
				period_day_cnt: Number(periodDayCnt)
			})
		});

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"일괄 연장을 진행 하시겠습니까?",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });

				const resrvHistorySearchAdmins = resrvHistRepository.getResrvPeriodUpdate(oddArray, "");

				resrvHistorySearchAdmins.then((data) => {
					if(data.msgcode == 1){

						if(smsYn == true){
							oddArray = {smslist : []};

							delayObject.forEach(function(element){
								oddArray.smslist.push({
									send_hpno: element.mbil_teln,
									smstype: "EXTENDED_RSVT"
								})
							});

							const resrvHistorySearchAdmins = resrvHistRepository.getResrvSmsSubmit(oddArray, "");

							resrvHistorySearchAdmins.then((data) => {
								if(data.msgcode != 1){
									handleAlertToggle(
										"isOpen",
										undefined,
										"일괄 SMS 발송중 문제가 \n발생 되었습니다.",
										() => {
											setAlertOpens(prev => { return { ...prev, isOpen: false }; });
										}
									);
								}
							});
						}
						handleAlertToggle(
							"isOpen",
							undefined,
							"일괄 연장 처리 되었습니다.",
							() => {
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
								onClose();
								setDelayObject({}); // 선택된 객체 초기화
								getResrvHists(ResrvHistStore.pageInfo.page, ResrvHistStore.pageInfo.size);
							}
						);
					}
					else {
						handleAlertToggle(
							"isOpen",
							undefined,
							"일괄 연장 진행중 문제가 \n발생 되었습니다.",
							() => {
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
							}
						);
					}
				});

			},
			() => {
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		)

	}

	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			scroll={scroll}
			aria-labelledby="form-contractType-dialog-title">
			<MC.DialogTitle id="form-contractType-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				예약 일괄 연장
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
												{<MC.ListItemText primary="선택된 예약정보의 날짜를 일괄 연장 할 수 있습니다. 연장 하고자 하는 기간과 연장사유를 입력하신 후 등록해 주세요." />}
											</MC.ListItem>
										)
								}

							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="periodDayCnt">연장기간일수</MC.InputLabel>
							<MC.Input
								id="periodDayCnt"
								name="periodDayCnt"
								type={"text"}
								value={periodDayCnt}
								onChange={handlePeriodChange}
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
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="rsvtEndDate">연장사유</MC.InputLabel>
							<MC.Input
								id="rsvtEndDate"
								name="rsvtEndDate"
								type={"text"}
								value={periodReason}
								onChange={handleReasonChange}
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
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
								<MC.ListItemText htmlFor="periodSmsYn">문자전송여부
									<MC.Checkbox
										id="periodSmsYn"
										name="periodSmsYn"
										checked={smsChecked}
										color={"primary"}
										onChange={event => handleSmsCheckChange(event)}
										value={smsYn} />
								</MC.ListItemText>
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
				onClick={handleResrvPeriodChange}>일괄연장
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

export default ResrvHistAllDelayDialog;
