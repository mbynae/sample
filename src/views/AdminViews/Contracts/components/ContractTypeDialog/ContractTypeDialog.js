import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { contractTypeRepository } from "../../../../../repositories";
import { AlertDialog }            from "../../../../../components";

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

const ContractTypeDialog = props => {
	const classes = useStyles();
	
	const { contractTypes, setContractTypes, menuKey, aptId, getContractTypes, open, onClose } = props;
	const [contractTypeName, setContractTypeName] = useState("");
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		setContractTypeName(event.target.value);
	};
	
	const handleSaveContractType = () => {
		contractTypeRepository.saveContractType({
			aptId:    aptId,
			name:     contractTypeName,
			sequence: contractTypes.length
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"계약종류 등록 완료",
				`계약종류 "${contractTypeName}" 을(를) 등록 완료 하였습니다.`,
				() => {
					getContractTypes();
					setContractTypeName("");
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		});
	};
	
	const handleUpdateContractType = (contractType) => {
		contractTypeRepository
			.updateContractType(contractType.id, {
				...contractType,
				aptId: contractType.aptComplex.id
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"계약종류 수정 완료",
					`계약종류 "${contractType.name}" 을(를) 수정 완료 하였습니다.`,
					() => {
						getContractTypes();
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			});
	};
	
	const handleDeleteContractType = (id) => {
		let contractType = contractTypes.find(obj => obj.id === id);
		if ( contractType.count > 0 ) {
			handleAlertToggle(
				"isOpen",
				"계약종류 삭제 불가",
				`"${contractTypes.find(obj => obj.id === id).name}" 계약종류에 등록된 계약이 있습니다. \n(수정만 가능)`,
				() => {
					getContractTypes();
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			handleAlertToggle(
				"isConfirmOpen",
				"계약종류 삭제",
				`계약종류 "${contractTypes.find(obj => obj.id === id).name}" 을(를) 정말로 삭제 하겠습니까?`,
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					contractTypeRepository
						.removeContractType(id, { aptId: contractType.aptComplex.id })
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"계약종류 삭제 완료",
								`계약종류 "${contractTypes.find(obj => obj.id === id).name}" 을(를) 삭제 완료 하였습니다.`,
								() => {
									getContractTypes();
									setAlertOpens({ ...alertOpens, isOpen: false });
								}
							);
						});
				},
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				}
			);
		}
	};
	
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
				계약종류 관리
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
												{/*<MC.ListItemText*/}
												{/*	primary={contractType.name}*/}
												{/*/>*/}
												
												<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
													{/*<MC.InputLabel htmlFor="contractType-basic">계약종류명</MC.InputLabel>*/}
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
												<MC.ListItemText primary="등록된 계약종류가 없습니다." />
											</MC.ListItem>
										)
								}
							
							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="contractType-basic">계약종류명</MC.InputLabel>
							<MC.Input
								id="contractType-basic"
								type={"text"}
								value={contractTypeName}
								onChange={handleChange}
								endAdornment={
									<MC.InputAdornment position="end">
										<MC.IconButton
											aria-label="toggle password visibility"
											onClick={() => {
												handleSaveContractType();
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

export default ContractTypeDialog;
