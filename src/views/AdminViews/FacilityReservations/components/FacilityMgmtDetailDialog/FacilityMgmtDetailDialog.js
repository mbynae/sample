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

const FacilityMgmtDetailDialog = props => {
	const classes = useStyles();
	
	const { facilityMgmts, setFacilityMgmts, aptId, getFacilityMgmts, open, onClose } = props;
	const [categoryName, setCategoryName] = useState("");
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		setCategoryName(event.target.value);
	};
	
	const handleSaveCategory = () => {
		categoryRepository.saveCategory({
			aptId:    aptId,
			name:     categoryName,
			sequence: facilityMgmts.length
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"시설관리 등록 완료",
				`시설관리 "${categoryName}" 을(를) 등록 완료 하였습니다.`,
				() => {
					getFacilityMgmts();
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
					"시설 수정 완료",
					`시설 "${category.name}" 을(를) 수정 완료 하였습니다.`,
					() => {
						getFacilityMgmts();
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			});
	};
	
	const handleDeleteCategory = (id) => {
		let category = facilityMgmts.find(obj => obj.id === id);
		if ( category.count > 0 ) {
			handleAlertToggle(
				"isOpen",
				"시설 삭제 불가",
				`"${facilityMgmts.find(obj => obj.id === id).name}" 시설에 등록된 게시글이 있습니다. \n(수정만 가능)`,
				() => {
					getFacilityMgmts();
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			handleAlertToggle(
				"isConfirmOpen",
				"시설관리 삭제",
				`시설관리 "${facilityMgmts.find(obj => obj.id === id).name}" 을(를) 정말로 삭제 하겠습니까?`,
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					categoryRepository
						.removeCategory(id)
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"시설관리 삭제 완료",
								`시설관리 "${facilityMgmts.find(obj => obj.id === id).name}" 을(를) 삭제 완료 하였습니다.`,
								() => {
									getFacilityMgmts();
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
				시설 관리
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={12}>
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

export default FacilityMgmtDetailDialog;
