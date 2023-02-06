import React, { useState } from "react";
import clsx                from "clsx";
import * as MC             from "@material-ui/core";
import * as MS             from "@material-ui/styles";

import { maturityRepository } from "../../../../../repositories";
import { AlertDialog }        from "../../../../../components";
import { MaturityTypeKind }   from "../../../../../enums";

const useStyles = MS.makeStyles(theme => ({
	maturitiesLayout: {
		backgroundColor: theme.palette.background.paper
	},
	margin:           {
		margin: 0
	},
	listItemLayout:   {
		paddingRight: 96
	},
	textField:        {},
	inputCenter:      {
		textAlign: "center"
	}
}));

const MaturityDialog = props => {
	const classes = useStyles();
	
	const { aptId, maturity, setMaturity, open, onClose } = props;
	const [scroll, setScroll] = React.useState("paper");
	
	const handleChange = (event) => {
		let value = event.target.value;
		
		let numberReg = /^[0-9]*$/;
		if ( !numberReg.test(value) ) {
			return;
		}
		
		setMaturity(prev => {
			return {
				...prev,
				aptId:              aptId,
				endNotificationDay: value || "",
				maturityTypeKind:   MaturityTypeKind.CONTRACT
			};
		});
	};
	
	const handleUpdateMaturity = (maturity) => {
		maturityRepository
			.updateMaturity({
				...maturity
			})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"만기알림 저장 완료",
					`만기알림을 저장 하였습니다.`,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						onClose();
					}
				);
			});
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
	
	const saveAndClose = () => {
		handleUpdateMaturity(maturity);
	};
	
	return (
		<MC.Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={true}
			scroll={scroll}
			aria-labelledby="form-maturity-dialog-title">
			<MC.DialogTitle id="form-maturity-dialog-title">
				{/*<MC.Typography variant={"h4"}>*/}
				만기알림설정
				{/*</MC.Typography>*/}
			</MC.DialogTitle>
			<MC.DialogContent dividers={scroll === "paper"}>
				
				<MC.Grid container spacing={1}>
					<MC.Grid item xs={12} md={12}>
						<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"}>
							<MC.Grid item className={classes.maturitiesLayout}>
								계약종료
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
							<MC.Grid item>
								<MC.FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
									<MC.Input
										id="maturity-basic"
										type={"text"}
										classes={{
											input: classes.inputCenter
										}}
										value={maturity.endNotificationDay}
										onChange={handleChange}
									/>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<MC.Grid container direction={"row"} justify={"flex-end"} alignItems={"center"}>
							<MC.Grid item className={classes.maturitiesLayout}>
								일 전 알림
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
			</MC.DialogContent>
			<MC.DialogActions>
				<MC.Button onClick={saveAndClose}>
					저장
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

export default MaturityDialog;
