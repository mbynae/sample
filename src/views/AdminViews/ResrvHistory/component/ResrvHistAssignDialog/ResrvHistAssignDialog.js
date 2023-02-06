import React, { useEffect, useState } from "react";
import clsx                           from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { contractTypeRepository, resrvHistRepository } from "../../../../../repositories";
import { AlertDialog }                                 from "../../../../../components";
import palette                                         from "../../../../../theme/adminTheme/palette";
import { autorun, toJS }                               from "mobx";
import ResrvHistMemberSearchDialog                     from "../ResrvHistMemberSearchDialog";
import PerfectScrollbar                                from "react-perfect-scrollbar";

const useStyles = MS.makeStyles(theme => ({
	root:          {},
	content:       {
		padding: 0
	},
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

const ResrvHistAssignDialog = props => {

	const classes = useStyles();
	const { contractTypes, setContractTypes, open, onClose, selectedObject, getResrvHists, ResrvHistStore,
	alertOpens, setAlertOpens, handleAlertToggle, memberObject, setMemberObject } = props;

	let [scroll, setScroll] = React.useState("paper");

	const [resrvHistMemberSearchDialogOpen, setResrvHistMemberSearchDialogOpen] = useState(false);

	const handleAssignMember = () => {
		setResrvHistMemberSearchDialogOpen(true);
	}

	const handleAssignMemberClose = (value) => {
		// 다이얼로그 닫고 param을 받아옴
		setResrvHistMemberSearchDialogOpen(false);
		setMemberObject(value);
	}

	const handleAssignSubmit = () => {

		const param = {
			memb_numb : memberObject.memb_numb,
			prgm_numb: selectedObject.prgm_numb,
			rsvt_numb: selectedObject.rsvt_numb,
			prts_rsvt_numb: ""
		}

		// 선택된 멤버가 있을 경우 양도 진행
		if (Object.keys(memberObject).length !== 0) {
			handleAlertToggle(
				"isConfirmOpen",
				undefined,
				"선택된 회원에게 상품을 양도 하시겠습니까?",
				async () => {
					await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
					const resrvHistorySearchAdmins = resrvHistRepository.setAssignInsert(param);

					resrvHistorySearchAdmins.then((data) => {
						if(data.msgcode == 1){

							let oddArray = {smslist : []};
							oddArray.smslist.push({
								send_hpno: memberObject.phonenumber.replaceAll("-",""),
								smstype: "ASSIGN_RSVT"
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
							handleAlertToggle(
								"isOpen",
								undefined,
								"양도 처리 되었습니다.",
								() => {
									setAlertOpens(prev => { return { ...prev, isOpen: false }; });
									getResrvHists(ResrvHistStore.pageInfo.page, ResrvHistStore.pageInfo.size);
									setMemberObject({}); // 선택된 멤버 초기화
									onClose();
								}
							);
						}
						else {
							handleAlertToggle(
								"isOpen",
								undefined,
								"양도 진행중 문제가 \n발생 되었습니다.",
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
		// 선택된 입주민 없을 경우
		else {
			handleAlertToggle(
				"isOpen",
				undefined,
				"입주민을 먼저 선택해주세요.",
				() => {
					setAlertOpens(prev => { return { ...prev, isOpen: false }; });
				}
			);
		}
	}

	const objView = (obj) => (
		<MC.TableRow hover>
			<MC.TableCell align={"center"}>
				{ obj.id }
			</MC.TableCell>

			<MC.TableCell align={"center"}>
				{ obj.name }
			</MC.TableCell>

			<MC.TableCell align={"center"}>
				{ obj.phonenumber }
			</MC.TableCell>

		</MC.TableRow>
	)

	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			scroll={scroll}
			aria-labelledby="form-contractType-dialog-title">
			<MC.DialogTitle id="form-contractType-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				예약 양도
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
												{<MC.ListItemText primary="입주민을 선택하여 상품을 양도 할 수 있습니다. 양도받을 입주민을 검색 해 주세요." />}
											</MC.ListItem>
										)
								}
							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.CardContent className={classes.content}>
							<PerfectScrollbar>
								<div className={classes.inner}>
									<MC.Table size="small">
							<MC.TableBody>
							{
								(Object.keys(memberObject || {}).length > 0) == true && memberObject != undefined ?
									objView(memberObject)
									:
									<MC.TableRow hover>
										<MC.TableCell colSpan={3} align="center">
											선택된 입주민이 없습니다.
										</MC.TableCell>
									</MC.TableRow>
							}
							</MC.TableBody>
							</MC.Table>
								</div>
							</PerfectScrollbar>
						</MC.CardContent>
						{/* 입주민 검색 버튼 */}
						<MC.Grid container justify={"flex-start"}>
							<MC.FormControl style={{ width: "95%" }} className={clsx(classes.margin, classes.textField)}>
								<MC.Button
									style={{
										color: palette.primary.main,
										borderColor: palette.primary.main,
										marginLeft: 10,
										borderTopLeftRadius: 4,
										borderBottomLeftRadius: 4,
										backgroundColor: "#A9BCF5"
									}}
									onClick={() => handleAssignMember()}>양도받을 입주민 검색</MC.Button>
							</MC.FormControl>
						</MC.Grid>
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
				onClick={handleAssignSubmit}>양도
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
			<ResrvHistMemberSearchDialog
				open={resrvHistMemberSearchDialogOpen}
				onClose={handleAssignMemberClose}
			/>
		</MC.Dialog>
	);
};

export default ResrvHistAssignDialog;
