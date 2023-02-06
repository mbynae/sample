import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { departmentRepository } from "../../../../../repositories";
import { AlertDialog }          from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	departmentsLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:            {
		margin: theme.spacing(1)
	},
	listItemLayout:    {
		paddingRight: 96
	}
}));

const DepartmentDialog = props => {
	const classes = useStyles();
	
	const { departments, setDepartments, menuKey, aptId, getDepartments, open, onClose } = props;
	const [departmentName, setDepartmentName] = useState("");
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		setDepartmentName(event.target.value);
	};
	
	const handleSaveDepartment = () => {
		departmentRepository.saveDepartment({
			aptId:    aptId,
			title:    departmentName.trim(),
			sequence: departments.length
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"부서 등록 완료",
				`부서 "${departmentName}" 을(를) 등록 완료 하였습니다.`,
				() => {
					getDepartments();
					setDepartmentName("");
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		});
	};
	
	const handleUpdateDepartment = (department) => {
		departmentRepository
			.updateDepartment(department.id, {
				...department,
				title: department.title.trim(),
				aptId: department.aptComplex.id
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"부서 수정 완료",
					`부서 "${department.title}" 을(를) 수정 완료 하였습니다.`,
					() => {
						getDepartments();
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			});
	};
	
	const handleDeleteDepartment = (id) => {
		let department = departments.find(obj => obj.id === id);
		if ( department.count > 0 ) {
			handleAlertToggle(
				"isOpen",
				"부서 삭제 불가",
				`"${departments.find(obj => obj.id === id).title}" 부서에 등록된 직원이 있습니다. \n(수정만 가능)`,
				() => {
					getDepartments();
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			handleAlertToggle(
				"isConfirmOpen",
				"부서 삭제",
				`부서 "${departments.find(obj => obj.id === id).title}" 을(를) 정말로 삭제 하겠습니까?`,
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					departmentRepository
						.removeDepartment(id, { aptId: department.aptComplex.id })
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"부서 삭제 완료",
								`부서 "${departments.find(obj => obj.id === id).title}" 을(를) 삭제 완료 하였습니다.`,
								() => {
									getDepartments();
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
			aria-labelledby="form-department-dialog-title">
			<MC.DialogTitle id="form-department-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				부서 관리
				{/*</MC.Typography>*/}
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={12}>
						<div className={classes.departmentsLayout}>
							<MC.List>
								{
									departments && departments.length > 0 ? departments.map((department, index) => (
											<MC.ListItem key={index} className={classes.listItemLayout}>
												{/*<MC.ListItemText*/}
												{/*	primary={department.name}*/}
												{/*/>*/}
												
												<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
													{/*<MC.InputLabel htmlFor="department-basic">부서명</MC.InputLabel>*/}
													<MC.Input
														id={`department-update-basic-${index}`}
														type={"text"}
														value={department.title}
														startAdornment={
															<MC.InputAdornment position="start">
																<MC.Typography variant={"h5"}>
																	{index + 1}
																</MC.Typography>
															</MC.InputAdornment>
														}
														onChange={(event) => {
															let value = event.target.value;
															setDepartments(prev => {
																const which = ct => ct.id === department.id;
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
														onClick={() => handleUpdateDepartment(department)}>
														<MI.Edit />
													</MC.IconButton>
													
													<MC.IconButton
														edge="end"
														aria-label="delete"
														onClick={() => handleDeleteDepartment(department.id)}>
														<MI.Delete />
													</MC.IconButton>
												</MC.ListItemSecondaryAction>
											</MC.ListItem>
										))
										:
										(
											<MC.ListItem>
												<MC.ListItemText primary="등록된 부서가 없습니다." />
											</MC.ListItem>
										)
								}
							
							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="department-basic">부서명</MC.InputLabel>
							<MC.Input
								id="department-basic"
								type={"text"}
								value={departmentName}
								onChange={handleChange}
								endAdornment={
									<MC.InputAdornment position="end">
										<MC.IconButton
											aria-label="toggle password visibility"
											onClick={() => {
												handleSaveDepartment();
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

export default DepartmentDialog;
