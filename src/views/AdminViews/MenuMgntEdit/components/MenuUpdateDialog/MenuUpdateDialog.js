import React, { useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog } from "../../../../../components";

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

const MenuUpdateDialog = props => {
	const classes = useStyles();
	
	const { selectedMenu, setSelectedMenu, open, onClose } = props;
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		let value = event.target.value;
		setSelectedMenu(prev => {
			return {
				...prev,
				title: value
			};
		});
	};
	
	const handleUpdateMenu = (menu) => {
		handleAlertToggle(
			"isOpen",
			"메뉴명 수정 완료",
			`메뉴명 "${menu.title}" 을(를) 수정 하였습니다. \n 최종적으로 수정을 완료하려면 화면 하단의 "저장" 버튼을 클릭하여 완료하세요.`,
			() => {
				setAlertOpens({ ...alertOpens, isOpen: false });
				onClose(true);
			}
		);
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
				메뉴명 수정
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={12}>
						<MC.FormControl fullWidth className={classes.margin}>
							<MC.InputLabel htmlFor="category-basic">메뉴명</MC.InputLabel>
							<MC.Input
								id="category-basic"
								type={"text"}
								inputProps={{
									maxLength: 10
								}}
								value={selectedMenu ? selectedMenu.title : ""}
								onChange={handleChange} />
						</MC.FormControl>
					</MC.Grid>
				</MC.Grid>
			
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={() => handleUpdateMenu(selectedMenu)}>
					수정
				</MC.Button>
				<MC.Button onClick={() => onClose(false)}>
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

export default MenuUpdateDialog;
