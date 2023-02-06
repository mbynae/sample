import * as MC             from "@material-ui/core";
import React, { useState } from "react";
import * as MS             from "@material-ui/styles";
import {facilityCategoryRepository} from "../../../../../repositories"

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	},
	tableCellTitle:           {
		width: "25%"
	},
	tableCellDescriptionFull: {
		width:    "75%",
		maxWidth: "75%"
	},
}));

const CategoryMgntModal = props => {

	const classes = useStyles();
	const {open, handleOpen, handleClose, alertOpens, setAlertOpens, handleAlertToggle, getCategoryList, categoryInfo, setCategoryInfo, prgmTypeList, pageInfo, isEdit, errors, setErrors} = props;


	const handleEdit = () => {

		if(categoryInfo.prgm_name !== "" && categoryInfo.fclt_info !== "" && categoryInfo.prgm_type !== "") {
			handleClose();
			facilityCategoryRepository.updateCategory(categoryInfo.fclt_code, categoryInfo.fclt_numb, categoryInfo.prgm_numb,{
				prgm_name: categoryInfo.prgm_name,	// 중분류명
				fclt_info: categoryInfo.fclt_info,	// 대분류명
				prgm_type: categoryInfo.prgm_type	  // 상품유형
			}).then(result => {
				handleAlertToggle(
					"isOpen",
					"카테고리 수정",
					"카테고리 수정을 완료하였습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						getCategoryList(pageInfo.page, pageInfo.size);
					},
					undefined
				);
			}).catch(e => {
				handleAlertToggle(
					"isOpen",
					e.msg,
					e.errormsg + "\n" + "errorcode: " + e.errorcode,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					},
					undefined
				);
			})
		} else {
			setErrors(prev => {
				return {
					...prev,
					fclt_info: categoryInfo.fclt_info === "",
					prgm_name: categoryInfo.prgm_name === "",
					prgm_type: categoryInfo.prgm_type === ""
				};
			});
		}
	}

	const handleCreate = () => {

		if(categoryInfo.prgm_name !== "" && categoryInfo.fclt_info !== "" && categoryInfo.prgm_type !== "") {
			handleClose();
			facilityCategoryRepository.createCategory(categoryInfo.fclt_code, categoryInfo.fclt_numb, {
				prgm_name: categoryInfo.prgm_name,	// 중분류명
				fclt_info: categoryInfo.fclt_info,	// 대분류명
				prgm_type: categoryInfo.prgm_type	  // 상품유형
			}).then(result => {
				handleAlertToggle(
					"isOpen",
					"카테고리 등록",
					"카테고리 등록을 완료하였습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						getCategoryList(pageInfo.page, pageInfo.size);
					},
					undefined
				);
			}).catch(e => {
				handleAlertToggle(
					"isOpen",
					e.msg,
					e.errormsg + "\n" + "errorcode: " + e.errorcode,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					},
					undefined
				);
			});
		} else {
			setErrors(prev => {
				return {
					...prev,
					fclt_info: categoryInfo.fclt_info === "",
					prgm_name: categoryInfo.prgm_name === "",
					prgm_type: categoryInfo.prgm_type === ""
				};
			});
		}
	}

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		// 입력 값 있을 경우 에러 초기화
		setErrors(prev => {
			if (name === "fclt_info") return {...prev, fclt_info: value === ""}
			else if (name === "prgm_name") return {...prev, prgm_name: value === ""}
			else if (name === "prgm_type") return {...prev, prgm_type: value === ""}
		});

		setCategoryInfo(prev => {
			return {
				...prev,
				[name]: value
			}
		})
	};

	return (
		<MC.Dialog maxWidth={"sm"} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<MC.DialogTitle id="form-dialog-title">카테고리 관리</MC.DialogTitle>
			<MC.DialogContent>
				<MC.Table>
					<MC.TableBody>
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">대분류</MC.TableCell>
							<MC.TableCell className={classes.tableCellDescriptionFull}>
								<MC.TextField
									fullWidth
									disabled={categoryInfo.exist === 2}
									error={errors.fclt_info}
									variant={"outlined"}
									id={"fclt-info"}
									name={"fclt_info"}
									value={categoryInfo.fclt_info || ""}
									onChange={handleChange}/>
							</MC.TableCell>
						</MC.TableRow>

						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">중분류</MC.TableCell>
							<MC.TableCell className={classes.tableCellDescriptionFull}>
								<MC.OutlinedInput
									fullWidth
									error={errors.prgm_name}
									id={"prgm-name"}
									name={"prgm_name"}
									value={categoryInfo.prgm_name || ""}
									onChange={handleChange}
								/>
							</MC.TableCell>
						</MC.TableRow>

						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">상품 유형</MC.TableCell>
							<MC.TableCell className={classes.tableCellDescriptionFull}>
								<MC.TextField
									select
									fullWidth
									error={errors.prgm_type}
									name="prgm_type"
									value={categoryInfo.prgm_type || ""}
									onChange={handleChange}
									variant="outlined">
									{
										prgmTypeList.map((prgmType, index) => (
											<MC.MenuItem key={index} value={prgmType.commcode}>{prgmType.commname}</MC.MenuItem>
										))
									}
								</MC.TextField>
							</MC.TableCell>
						</MC.TableRow>

					</MC.TableBody>
				</MC.Table>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={handleClose} color="primary">
					취소
				</MC.Button>
				<MC.Button onClick={isEdit ? handleEdit : handleCreate} color="primary">
					{
						isEdit ? "수정" : "등록"
					}
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	)
}

export default CategoryMgntModal;
