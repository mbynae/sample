import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { officialPositionRepository } from "../../../../../repositories";
import { AlertDialog }                from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	officialPositionsLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:                  {
		margin: theme.spacing(1)
	},
	listItemLayout:          {
		paddingRight: 96
	}
}));

const OfficialDialog = props => {
	const classes = useStyles();
	
	const { officialPositions, setOfficialPositions, menuKey, aptId, departments, getOfficialPositions, open, onClose } = props;
	const [selectDepartment, setSelectDepartment] = useState({});
	const [officialPositionName, setOfficialPositionName] = useState("");
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		if ( name === "departmentId" ) {
			if ( value === "total" ) {
				setSelectDepartment({ id: value });
				setOfficialPositions([]);
			} else {
				let findDepartment = departments.find(department => department.id + "" === value + "");
				setSelectDepartment(findDepartment);
				getOfficialPositions(findDepartment.id);
			}
		} else {
			setOfficialPositionName(value);
		}
	};
	
	const handleSaveOfficialPosition = () => {
		officialPositionRepository.saveOfficialPosition({
			departmentId: selectDepartment.id,
			title:        officialPositionName.trim(),
			sequence:     officialPositions.length
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"직책 등록 완료",
				`직책 "${officialPositionName}" 을(를) 등록 완료 하였습니다.`,
				() => {
					getOfficialPositions(selectDepartment.id);
					setOfficialPositionName("");
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		});
	};
	
	const handleUpdateOfficialPosition = (officialPosition) => {
		officialPositionRepository
			.updateOfficialPosition(officialPosition.id, {
				...officialPosition,
				title: officialPosition.title.trim(),
				aptId: officialPosition.aptComplex.id
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"직책 수정 완료",
					`직책 "${officialPosition.name}" 을(를) 수정 완료 하였습니다.`,
					() => {
						getOfficialPositions();
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			});
	};
	
	const handleDeleteOfficialPosition = (id) => {
		let officialPosition = officialPositions.find(obj => obj.id === id);
		if ( officialPosition.count > 0 ) {
			handleAlertToggle(
				"isOpen",
				"직책 삭제 불가",
				`"${officialPositions.find(obj => obj.id === id).title}" 직책에 등록된 직원이 있습니다. \n(수정만 가능)`,
				() => {
					getOfficialPositions(selectDepartment.id);
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			handleAlertToggle(
				"isConfirmOpen",
				"직책 삭제",
				`직책 "${officialPositions.find(obj => obj.id === id).title}" 을(를) 정말로 삭제 하겠습니까?`,
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					officialPositionRepository
						.removeOfficialPosition(id, { departmentId: selectDepartment.id })
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"직책 삭제 완료",
								`직책 "${officialPositions.find(obj => obj.id === id).title}" 을(를) 삭제 완료 하였습니다.`,
								() => {
									getOfficialPositions(selectDepartment.id);
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
			aria-labelledby="form-officialPosition-dialog-title">
			<MC.DialogTitle id="form-officialPosition-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				직책 관리
				{/*</MC.Typography>*/}
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel id="departmentId-label">부서</MC.InputLabel>
							<MC.Select
								labelId="departmentId-label"
								name="departmentId"
								id="departmentId-basic"
								value={selectDepartment.id || "total"}
								onChange={handleChange}>
								<MC.MenuItem value="total">부서를 선택해주세요.</MC.MenuItem>
								{
									departments && departments.length > 0 &&
									departments.map((department, index) => (
										<MC.MenuItem key={index} value={department.id + ""}>{department.title}</MC.MenuItem>
									))
								}
							</MC.Select>
						</MC.FormControl>
					</MC.Grid>
					
					<MC.Grid item xs={12} md={12}>
						<div className={classes.officialPositionsLayout}>
							<MC.List>
								{
									officialPositions && officialPositions.length > 0 ? officialPositions.map((officialPosition, index) => (
											<MC.ListItem key={index} className={classes.listItemLayout}>
												{/*<MC.ListItemText*/}
												{/*	primary={officialPosition.name}*/}
												{/*/>*/}
												
												<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
													{/*<MC.InputLabel htmlFor="officialPosition-basic">직책명</MC.InputLabel>*/}
													<MC.Input
														id={`officialPosition-update-basic-${index}`}
														type={"text"}
														value={officialPosition.title}
														startAdornment={
															<MC.InputAdornment position="start">
																<MC.Typography variant={"h5"}>
																	{index + 1}
																</MC.Typography>
															</MC.InputAdornment>
														}
														onChange={(event) => {
															let value = event.target.value;
															setOfficialPositions(prev => {
																const which = ct => ct.id === officialPosition.id;
																let index = prev.findIndex(which);
																let temp = prev.find(which);
																temp.title = value;
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
														onClick={() => handleUpdateOfficialPosition(officialPosition)}>
														<MI.Edit />
													</MC.IconButton>
													
													<MC.IconButton
														edge="end"
														aria-label="delete"
														onClick={() => handleDeleteOfficialPosition(officialPosition.id)}>
														<MI.Delete />
													</MC.IconButton>
												</MC.ListItemSecondaryAction>
											</MC.ListItem>
										))
										:
										(
											<MC.ListItem>
												<MC.ListItemText primary="등록된 직책가 없습니다." />
											</MC.ListItem>
										)
								}
							
							</MC.List>
						</div>
					</MC.Grid>
					
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="officialPosition-basic">직책명</MC.InputLabel>
							<MC.Input
								id="officialPosition-basic"
								type={"text"}
								value={officialPositionName}
								disabled={!(selectDepartment.id)}
								onChange={handleChange}
								endAdornment={
									<MC.InputAdornment position="end">
										<MC.IconButton
											aria-label="toggle password visibility"
											onClick={() => {
												handleSaveOfficialPosition();
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

export default OfficialDialog;
