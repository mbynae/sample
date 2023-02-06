import React, { useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";

import { facilityMgmtRepository } from "../../../../../repositories";
import { AlertDialog }            from "../../../../../components";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

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

const FacilityMgmtsDialog = props => {
	const classes = useStyles();
	
	const { facilityMgmts, getFacilityMgmts, open, onClose, editOpen } = props;
	const [scroll, setScroll] = React.useState("paper");
	
	const handleUpdate = (facilityMgmt) => {
		editOpen(facilityMgmt.id);
	};
	
	const handleDelete = (facilityMgmt) => {
		let findFacilityMgmt = facilityMgmts.find(obj => obj.id === facilityMgmt.id);
		let removeCheckObj = findFacilityMgmt.facilityReservationSlots.filter(obj => obj.facilityReservations.length > 0);
		if ( removeCheckObj.length > 0 ) {
			handleAlertToggle(
				"isOpen",
				"시설 삭제 불가",
				`"${findFacilityMgmt.facilityTitle}" 시설에 등록된 예약이 있습니다.`,
				() => {
					getFacilityMgmts();
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			handleAlertToggle(
				"isConfirmOpen",
				"시설 삭제",
				`시설 "${findFacilityMgmt.facilityTitle}" 을(를) 정말로 삭제 하겠습니까?`,
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					facilityMgmtRepository
						.removeFacilityMgmt(findFacilityMgmt.id)
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"시설 삭제 완료",
								`시설 "${findFacilityMgmt.facilityTitle}" 을(를) 삭제 완료 하였습니다.`,
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
						<div className={classes.categoriesLayout}>
							<MC.List>
								{
									facilityMgmts && facilityMgmts.length > 0 ? facilityMgmts.sort((a, b) => a.id - b.id).map((facilityMgmt, index) => (
											<MC.ListItem key={index} className={classes.listItemLayout}>
												
												<MC.Grid container justify={"center"} alignItems={"center"}>
													<MC.Grid item xs={2} md={2}>
														{index + 1}
													</MC.Grid>
													<MC.Grid item xs={10} md={10}>
														{facilityMgmt.facilityTitle}
													</MC.Grid>
												</MC.Grid>
												
												<MC.ListItemSecondaryAction>
													<MC.IconButton
														edge="end"
														aria-label="edit"
														onClick={() => handleUpdate(facilityMgmt)}>
														<MI.Edit />
													</MC.IconButton>
													
													<MC.IconButton
														edge="end"
														aria-label="delete"
														onClick={() => handleDelete(facilityMgmt)}>
														<MI.Delete />
													</MC.IconButton>
												</MC.ListItemSecondaryAction>
											</MC.ListItem>
										))
										:
										(
											<MC.ListItem>
												<MC.Grid container justify={"center"}>
													<MC.Typography variant={"subtitle1"}>
														등록된 시설이 없습니다.
													</MC.Typography>
												</MC.Grid>
											</MC.ListItem>
										)
								}
							</MC.List>
						</div>
					</MC.Grid>
					<MC.Grid item xs={12} md={12} style={{ textAlign: "right" }}>
						<MC.Button
							startIcon={<AddCircleOutlineIcon />}
							onClick={() => editOpen()}>
							시설추가
						</MC.Button>
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

export default FacilityMgmtsDialog;
