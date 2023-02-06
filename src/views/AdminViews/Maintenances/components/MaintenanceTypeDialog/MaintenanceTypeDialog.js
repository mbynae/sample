import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { maintenanceTypeRepository } from "../../../../../repositories";
import { AlertDialog }               from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	maintenanceTypesLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:              {
		margin: theme.spacing(1)
	},
	listItemLayout:      {
		paddingRight: 96
	}
}));

const MaintenanceTypeDialog = props => {
	const classes = useStyles();
	
	const { maintenanceTypes, setMaintenanceTypes, menuKey, aptId, getMaintenanceTypes, open, onClose } = props;
	const [maintenanceTypeName, setMaintenanceTypeName] = useState("");
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		setMaintenanceTypeName(event.target.value);
	};
	
	const handleSaveMaintenanceType = () => {
		maintenanceTypeRepository.saveMaintenanceType({
			aptId:    aptId,
			name:     maintenanceTypeName,
			sequence: maintenanceTypes.length
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"유지보수종류 등록 완료",
				`유지보수종류 "${maintenanceTypeName}" 을(를) 등록 완료 하였습니다.`,
				() => {
					getMaintenanceTypes();
					setMaintenanceTypeName("");
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		});
	};
	
	const handleUpdateMaintenanceType = (maintenanceType) => {
		maintenanceTypeRepository
			.updateMaintenanceType(maintenanceType.id, {
				...maintenanceType,
				aptId: maintenanceType.aptComplex.id
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"유지보수종류 수정 완료",
					`유지보수종류 "${maintenanceType.name}" 을(를) 수정 완료 하였습니다.`,
					() => {
						getMaintenanceTypes();
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			});
	};
	
	const handleDeleteMaintenanceType = (id) => {
		let maintenanceType = maintenanceTypes.find(obj => obj.id === id);
		if ( maintenanceType.count > 0 ) {
			handleAlertToggle(
				"isOpen",
				"유지보수종류 삭제 불가",
				`"${maintenanceTypes.find(obj => obj.id === id).name}" 유지보수종류에 등록된 유지보수가 있습니다. \n(수정만 가능)`,
				() => {
					getMaintenanceTypes();
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			handleAlertToggle(
				"isConfirmOpen",
				"유지보수종류 삭제",
				`유지보수종류 "${maintenanceTypes.find(obj => obj.id === id).name}" 을(를) 정말로 삭제 하겠습니까?`,
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					maintenanceTypeRepository
						.removeMaintenanceType(id, { aptId: maintenanceType.aptComplex.id })
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"유지보수종류 삭제 완료",
								`유지보수종류 "${maintenanceTypes.find(obj => obj.id === id).name}" 을(를) 삭제 완료 하였습니다.`,
								() => {
									getMaintenanceTypes();
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
			aria-labelledby="form-maintenanceType-dialog-title">
			<MC.DialogTitle id="form-maintenanceType-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				유지보수종류 관리
				{/*</MC.Typography>*/}
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={12}>
						<div className={classes.maintenanceTypesLayout}>
							<MC.List>
								{
									maintenanceTypes && maintenanceTypes.length > 0 ? maintenanceTypes.map((maintenanceType, index) => (
											<MC.ListItem key={index} className={classes.listItemLayout}>
												{/*<MC.ListItemText*/}
												{/*	primary={maintenanceType.name}*/}
												{/*/>*/}
												
												<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
													{/*<MC.InputLabel htmlFor="maintenanceType-basic">유지보수종류명</MC.InputLabel>*/}
													<MC.Input
														id={`maintenanceType-update-basic-${index}`}
														type={"text"}
														value={maintenanceType.name}
														startAdornment={
															<MC.InputAdornment position="start">
																<MC.Typography variant={"h5"}>
																	{index + 1}
																</MC.Typography>
															</MC.InputAdornment>
														}
														onChange={(event) => {
															let value = event.target.value;
															setMaintenanceTypes(prev => {
																const which = ct => ct.id === maintenanceType.id;
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
														onClick={() => handleUpdateMaintenanceType(maintenanceType)}>
														<MI.Edit />
													</MC.IconButton>
													
													<MC.IconButton
														edge="end"
														aria-label="delete"
														onClick={() => handleDeleteMaintenanceType(maintenanceType.id)}>
														<MI.Delete />
													</MC.IconButton>
												</MC.ListItemSecondaryAction>
											</MC.ListItem>
										))
										:
										(
											<MC.ListItem>
												<MC.ListItemText primary="등록된 유지보수종류가 없습니다." />
											</MC.ListItem>
										)
								}
							
							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="maintenanceType-basic">유지보수종류명</MC.InputLabel>
							<MC.Input
								id="maintenanceType-basic"
								type={"text"}
								value={maintenanceTypeName}
								onChange={handleChange}
								endAdornment={
									<MC.InputAdornment position="end">
										<MC.IconButton
											aria-label="toggle password visibility"
											onClick={() => {
												handleSaveMaintenanceType();
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

export default MaintenanceTypeDialog;
