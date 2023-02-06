import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";
import * as MI             from "@material-ui/icons";

import { categoryRepository } from "../../../../../repositories";
import { AlertDialog }        from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	categoriesLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:           {
		margin: theme.spacing(1)
	},
	listItemLayout:   {
		paddingRight: 96
	}
}));

const CategoryDialog = props => {
	const classes = useStyles();
	
	const { categories, setCategories, menuKey, aptId, getCategories, open, onClose } = props;
	const [categoryName, setCategoryName] = useState("");
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		setCategoryName(event.target.value);
	};
	
	const handleSaveCategory = () => {
		categoryRepository.saveCategory({
			menuKey:  menuKey,
			aptId:    aptId,
			name:     categoryName,
			sequence: categories.length
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"카테고리 등록 완료",
				`카테고리 "${categoryName}" 을(를) 등록 완료 하였습니다.`,
				() => {
					getCategories();
					setCategoryName("");
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		});
	};
	
	const handleUpdateCategory = (category) => {
		categoryRepository
			.updateCategory(category.id, {
				...category
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"카테고리 수정 완료",
					`카테고리 "${category.name}" 을(를) 수정 완료 하였습니다.`,
					() => {
						getCategories();
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			});
	};
	
	const handleDeleteCategory = (id) => {
		let category = categories.find(obj => obj.id === id);
		if ( category.count > 0 ) {
			handleAlertToggle(
				"isOpen",
				"카테고리 삭제 불가",
				`"${categories.find(obj => obj.id === id).name}" 카테고리에 등록된 게시글이 있습니다. \n(수정만 가능)`,
				() => {
					getCategories();
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			handleAlertToggle(
				"isConfirmOpen",
				"카테고리 삭제",
				`카테고리 "${categories.find(obj => obj.id === id).name}" 을(를) 정말로 삭제 하겠습니까?`,
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					categoryRepository
						.removeCategory(id)
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"카테고리 삭제 완료",
								`카테고리 "${categories.find(obj => obj.id === id).name}" 을(를) 삭제 완료 하였습니다.`,
								() => {
									getCategories();
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
			aria-labelledby="form-category-dialog-title">
			<MC.DialogTitle id="form-category-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				카테고리 관리
				{/*</MC.Typography>*/}
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={12}>
						<div className={classes.categoriesLayout}>
							<MC.List>
								{
									categories && categories.length > 0 ? categories.map((category, index) => (
											<MC.ListItem key={index} className={classes.listItemLayout}>
												{/*<MC.ListItemText*/}
												{/*	primary={category.name}*/}
												{/*/>*/}
												
												<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
													{/*<MC.InputLabel htmlFor="category-basic">카테고리명</MC.InputLabel>*/}
													<MC.Input
														id={`category-update-basic-${index}`}
														type={"text"}
														value={category.name}
														startAdornment={
															<MC.InputAdornment position="start">
																<MC.Typography variant={"h5"}>
																	{index + 1}
																</MC.Typography>
															</MC.InputAdornment>
														}
														onChange={(event) => {
															let value = event.target.value;
															setCategories(prev => {
																const which = ct => ct.id === category.id;
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
														onClick={() => handleUpdateCategory(category)}>
														<MI.Edit />
													</MC.IconButton>
													
													<MC.IconButton
														edge="end"
														aria-label="delete"
														onClick={() => handleDeleteCategory(category.id)}>
														<MI.Delete />
													</MC.IconButton>
												</MC.ListItemSecondaryAction>
											</MC.ListItem>
										))
										:
										(
											<MC.ListItem>
												<MC.ListItemText primary="등록된 카테고리가 없습니다." />
											</MC.ListItem>
										)
								}
							
							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
							<MC.InputLabel htmlFor="category-basic">카테고리명</MC.InputLabel>
							<MC.Input
								id="category-basic"
								type={"text"}
								value={categoryName}
								onChange={handleChange}
								endAdornment={
									<MC.InputAdornment position="end">
										<MC.IconButton
											aria-label="toggle password visibility"
											onClick={() => {
												handleSaveCategory();
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

export default CategoryDialog;
