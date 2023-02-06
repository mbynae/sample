import React, { useEffect, useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { resrvHistRepository } from "../../../../../repositories";
import { AlertDialog }         from "../../../../../components";
import palette                 from "../../../../../theme/adminTheme/palette";
import { autorun, toJS }       from "mobx";
import moment                  from "moment";
import { inject, observer }    from "mobx-react";

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

const ResrvHistAllCancelDialog = props => {

	const classes = useStyles();
	const { contractTypes, setContractTypes, open, onClose, cancelObject, setCancelObject, getResrvHists, ResrvHistStore, AptComplexStore,
		RfndStat, RefundPolicy, RfndClss } = props;
	const [rfndCode, setRfndCode] = useState("");
	const [rfndStat, setRfndStat] = useState("");
	const [rfndClss, setRfndClss] = useState(""); //환불사유
	const [rfndInfo, setRfndInfo] = useState(""); //환불비고
	const [smsYn, setSmsYn] = useState(false);
	const [smsChecked, setSmsChecked] = useState(false);
	let [scroll, setScroll] = React.useState("paper");

	const handlePeriodChange = (event) => {
		if(event.target.value != undefined) {
			setRfndCode(event.target.value);
		}else{
			return;
		}
	};

	const handleStatChange = (event) => {
		if(event.target.value != undefined) {
			setRfndStat(event.target.value);
		}else{
			return;
		}
	};

	const handleClssChange = (event) => {
		if(event.target.value != undefined) {
			setRfndClss(event.target.value);
		}else{
			return;
		}
	};

	const handleReasonChange = (event) => {
		setRfndInfo(event.target.value);
	};

	const handleSmsCheckChange = (event) => {
		if(event.target.checked == true) {
			setSmsYn( true);
			setSmsChecked(true);
		}else if(event.target.checked == false){
			setSmsYn( false);
			setSmsChecked(false);
		}
	}

	const handleResrvPeriodChange = (event) => {

		let oddArray = { admin_yn : "Y", item : []};

		if(cancelObject.length>0) {
			cancelObject.forEach(function (element) {
				oddArray.item.push({
					cmpx_numb: AptComplexStore.cmpxNumb,
					prgm_numb: element.prgm_numb,
					rsvt_numb: element.rsvt_numb,
					rsvt_stat: element.rsvt_stat,
					rfnd_code: rfndCode,
					rfnd_info: rfndInfo,
					rfnd_name: "",
					rfnd_bank: "",
					rfnd_acct: "",
					rfnd_amt: 0, //api 서브쿼리 처리
					rfnd_strt_dttm: "",
					rfnd_end_dttm: "",
					rfnd_clss: rfndClss,
					rfnd_stat: "9030",
					rfnd_cnt: 1
				})
			});
		}else{
			oddArray.item.push({
				cmpx_numb: AptComplexStore.cmpxNumb,
				prgm_numb: cancelObject.prgm_numb,
				rsvt_numb: cancelObject.rsvt_numb,
				rsvt_stat: cancelObject.rsvt_stat,
				rfnd_code: rfndCode,
				rfnd_info: rfndInfo,
				rfnd_name: "",
				rfnd_bank: "",
				rfnd_acct: "",
				rfnd_amt: 0, //api 서브쿼리 처리
				rfnd_strt_dttm: "",
				rfnd_end_dttm: "",
				rfnd_clss: rfndClss,
				rfnd_stat: "9030",
				rfnd_cnt: 1
			})
		}

		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"취소를 진행 하시겠습니까?",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				const resrvHistorySearchAdmins = resrvHistRepository.getResrvDeleteUpdate(oddArray, "Y");

				resrvHistorySearchAdmins.then((data,reject) => {
					if(data.msgcode == 1){

						if(smsYn == true) {
							oddArray = { smslist: [] };

							if(cancelObject>0){
								cancelObject.forEach(function (element) {
									oddArray.smslist.push({
										send_hpno: element.mbil_teln,
										smstype: "CANCEL_RSVT"
									})
								});
							}else{
								oddArray.smslist.push({
									send_hpno: cancelObject.mbil_teln,
									smstype: "CANCEL_RSVT"
								})
							}

							const resrvHistorySearchAdmins = resrvHistRepository.getResrvSmsSubmit(oddArray, "");

							resrvHistorySearchAdmins.then((data) => {
								if (data.msgcode != 1) {
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
							"일괄 취소 처리 되었습니다.",
							() => {
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
								onClose();
								setCancelObject({}); // 선택된 객체 초기화
								getResrvHists(ResrvHistStore.pageInfo.page, ResrvHistStore.pageInfo.size);
							}
						);
					}
					else {
						handleAlertToggle(
							"isOpen",
							undefined,
							"일괄 취소 진행중 문제가 \n발생 되었습니다.",
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

	// rfnd_rate(환불 수수료율)
	function fnRfndRate(RefundPolicy) {
		let items = [];
		for(let i = 0; i < RefundPolicy.length; i++ ){
			items.push(<MC.MenuItem value={RefundPolicy[i].rfnd_code} key={i}>{RefundPolicy[i].dday_name}</MC.MenuItem>);
		}
		return items;
	}

	// rfnd_clss(환불유형)
	function fnRfndClss(RfndClss) {
		let items = [];
		for(let i = 0; i < RfndClss.length; i++ ){
			items.push(<MC.MenuItem value={RfndClss[i].commcode} key={i}>{RfndClss[i].comminfo}</MC.MenuItem>);
		}
		return items;
	}

	// rfnd_stat(환불상태)
	function fnRfndStat(RfndStat) {
		let items = [];
		for(let i = 0; i < RfndStat.length; i++ ){
			items.push(<MC.MenuItem value={RfndStat[i].commcode} key={i}>{RfndStat[i].comminfo}</MC.MenuItem>);
		}
		return items;
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
				예약 일괄 취소
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
												{
													<MC.ListItemText primary="예약 일괄 취소는 동일한 상품만 가능합니다. (예약일자가 다를시 일괄 취소 불가) 취소하고자 하는 기간과 취소사유를 입력하신 후 등록해주세요." />
												}
											</MC.ListItem>
										)
								}
							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="cancelPercent">환불수수료율(%)</MC.InputLabel>
							{<MC.Select
								labelId="rfndRate-label"
								name="rfndRate"
								id="rfndRate-basic"
								value={rfndCode}
								onChange={handlePeriodChange}>
								<MC.MenuItem value=":::Select:::">선택</MC.MenuItem>
								{
									fnRfndRate(RefundPolicy)
								}
							</MC.Select>}
						</MC.FormControl>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="rfndInfo">환불정보</MC.InputLabel>
							<MC.Input
								id="rfndInfo"
								name="rfndInfo"
								type={"text"}
								value={rfndInfo}
								onChange={handleReasonChange}
								endAdornment={
									<MC.InputAdornment position="end">
									</MC.InputAdornment>
								}
							/>
						</MC.FormControl>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="RfndClss">환불유형</MC.InputLabel>
							{<MC.Select
								labelId="rfndClss-label"
								name="rfndClss"
								id="rfndClss-basic"
								value={rfndClss}
								onChange={handleClssChange}>
								<MC.MenuItem value=":::Select:::">선택</MC.MenuItem>
								{
									fnRfndClss(RfndClss)
								}
							</MC.Select>}
						</MC.FormControl>
						{/*<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="RfndStat">환불상태</MC.InputLabel>
							{<MC.Select
								labelId="RfndStat-label"
								name="RfndStat"
								id="RfndStat-basic"
								value={rfndStat}
								onChange={handleStatChange}>
								<MC.MenuItem value=":::Select:::">선택</MC.MenuItem>
								{
									fnRfndStat(RfndStat)
								}
							</MC.Select>}
						</MC.FormControl>*/}
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
				onClick={handleResrvPeriodChange}>실행
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

export default inject("AptComplexStore")(observer(ResrvHistAllCancelDialog));
