import React, { useCallback, useEffect, useRef }       from "react";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";
import moment                                          from "moment";
import Dropzone                                        from "react-dropzone";
import update                                          from "immutability-helper";
import filesize                                        from "filesize";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { NumberFormatWon, PhoneMask } from "../../../../../components";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import theme             from "../../../../../theme/adminTheme";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	cardHeader:        {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:       {},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	attachLayout:      {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	}
}));

const MaintenanceEditForm = props => {
	const classes = useStyles();
	
	const { isEdit, maintenance, setMaintenance, maintenanceTypes, contracts, attachFiles, setAttachFiles, errors } = props;
	
	const attachRef = useRef();
	const inputRef = useRef();
	
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		setMaintenance(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const handleDateChange = (key, date, value, isFrom) => {
		setMaintenance(prev => {
			return {
				...prev,
				[key]: getDate(date, isFrom)
			};
		});
	};
	
	const onAttach = useCallback(async (acceptedFiles) => {
		inputRef.current.value = "";
		try {
			await acceptedFiles.map(async file => {
				setAttachFiles(prev => {
					return [
						...prev,
						file
					];
				});
			});
		} catch ( e ) {
		
		}
	}, []);
	
	const deleteAttach = (file, index, isNew) => {
		if ( isNew ) {
			setAttachFiles(update(attachFiles, {
				$splice: [
					[index, 1]
				]
			}));
		} else {
			setMaintenance(prev => {
				prev.attachmentDataTypes = update(maintenance.attachmentDataTypes, {
					$splice: [
						[index, 1]
					]
				});
				return {
					...prev
				};
			});
		}
	};
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"시설물 안전관리 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>
						
						{/*구분*/}
						{
							maintenanceTypes.length > 0 &&
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl} error={errors.isMaintenanceType}>
									<MC.InputLabel id="maintenanceTypeId-label">구분</MC.InputLabel>
									<MC.Select
										labelId="maintenanceTypeId-label"
										name="maintenanceTypeId"
										id="maintenanceTypeId-basic"
										defaultValue={""}
										value={maintenance.maintenanceTypeId || ""}
										onChange={handleChange}>
										{
											maintenanceTypes.map((maintenanceType, index) => (
												<MC.MenuItem value={maintenanceType.id} key={index}>
													{maintenanceType.name}
												</MC.MenuItem>
											))
										}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
						}
						
						{/*점검업체*/}
						{
							maintenanceTypes.length > 0 &&
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl} error={errors.isMaintenanceType}>
									<MC.InputLabel id="contractCompanyId-label">점검업체</MC.InputLabel>
									<MC.Select
										labelId="contractCompanyId-label"
										name="contractCompanyId"
										id="contractCompanyId-basic"
										defaultValue={""}
										value={maintenance.contractCompanyId || ""}
										onChange={handleChange}>
										{
											contracts.map((contract, index) => (
												<MC.MenuItem value={contract.id} key={index}>
													{contract.companyName}
												</MC.MenuItem>
											))
										}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
						}
						
						{/*점검명*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="maintenanceTitle-basic"
									name="maintenanceTitle"
									label={"점검명"}
									error={errors.isMaintenanceTitle}
									value={maintenance.maintenanceTitle || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						<MC.Grid item xs={12} md={6} />
						
						{/*점검일*/}
						<MC.Grid item xs={12} md={6}>
							<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
								<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>
									<MC.Grid item xs={5} md={5}>
										<KeyboardDatePicker
											autoOk
											variant="inline"
											margin="normal"
											id="inspectionStartDate-picker-dialog"
											label="점검일(시작)"
											format="yyyy/MM/DD"
											disableToolbar
											maxDate={maintenance.inspectionEndDate || new Date()}
											value={maintenance.inspectionStartDate || new Date()}
											onChange={(date, value) => handleDateChange("inspectionStartDate", date, value, true)}
											KeyboardButtonProps={{
												"aria-label": "change date"
											}}
											className={classes.keyboardDatePicker} />
									</MC.Grid>
									<MC.Grid item xs={2} md={2}
									         style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
										&nbsp; ~ &nbsp;
									</MC.Grid>
									<MC.Grid item xs={5} md={5}>
										<KeyboardDatePicker
											autoOk
											variant="inline"
											margin="normal"
											id="inspectionEndDate-picker-dialog"
											label="점검일(종료)"
											format="yyyy/MM/DD"
											disableToolbar
											minDate={maintenance.inspectionStartDate || new Date()}
											value={maintenance.inspectionEndDate || new Date()}
											onChange={(date, value) => handleDateChange("inspectionEndDate", date, value, false)}
											KeyboardButtonProps={{
												"aria-label": "change date"
											}}
											className={classes.keyboardDatePicker} />
									</MC.Grid>
								</MC.Grid>
							</MuiPickersUtilsProvider>
						</MC.Grid>
						
						{/*시행일*/}
						{
							isEdit &&
							<MC.Grid item xs={12} md={6}>
								<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
									<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>
										<MC.Grid item xs={5} md={5}>
											<KeyboardDatePicker
												autoOk
												variant="inline"
												margin="normal"
												id="maintenanceStartDate-picker-dialog"
												label="시행일(시작)"
												format="yyyy/MM/DD"
												disableToolbar
												maxDate={maintenance.maintenanceEndDate || new Date()}
												value={maintenance.maintenanceStartDate || new Date()}
												onChange={(date, value) => handleDateChange("maintenanceStartDate", date, value, true)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker} />
										</MC.Grid>
										<MC.Grid item xs={2} md={2}
										         style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
											&nbsp; ~ &nbsp;
										</MC.Grid>
										<MC.Grid item xs={5} md={5}>
											<KeyboardDatePicker
												autoOk
												variant="inline"
												margin="normal"
												id="maintenanceEndDate-picker-dialog"
												label="시행일(종료)"
												format="yyyy/MM/DD"
												disableToolbar
												minDate={maintenance.maintenanceStartDate || new Date()}
												value={maintenance.maintenanceEndDate || new Date()}
												onChange={(date, value) => handleDateChange("maintenanceEndDate", date, value, false)}
												KeyboardButtonProps={{
													"aria-label": "change date"
												}}
												className={classes.keyboardDatePicker} />
										</MC.Grid>
									</MC.Grid>
								</MuiPickersUtilsProvider>
							</MC.Grid>
						}
						
						<MC.Grid item xs={12} md={12}>
							<Dropzone
								ref={attachRef}
								style={{ width: "100%", height: "40px" }}
								onDrop={onAttach}
								maxSize={50000000}
								noKeyboard
								noClick
								multiple={true}
							>
								{({ getRootProps, getInputProps }) => (
									<MC.Grid container {...getRootProps()}>
										<MC.Grid item xs={2} md={2} className={classes.attachLayout} style={{ padding: theme.spacing(2) }}>
											<input id="contained-button-file" {...getInputProps()} ref={inputRef} />
											<label htmlFor="contained-button-file">
												<MC.Button variant="contained" color="primary" component="span">
													파일첨부
												</MC.Button>
											</label>
										</MC.Grid>
										<MC.Grid item xs={10} md={10} className={classes.attachLayout}>
											{
												(maintenance.attachmentDataTypes && maintenance.attachmentDataTypes.length > 0) &&
												maintenance.attachmentDataTypes.map((file, index) => (
													<MC.Typography variant="body2" key={index}>
														{file.fileOriginalName} ({filesize(file.fileSize)})
														<MC.IconButton
															size="small"
															aria-label="delete"
															className={classes.margin}
															onClick={() => deleteAttach(file, index, false)}>
															<DeleteForeverIcon fontSize="small" />
														</MC.IconButton>
													</MC.Typography>
												))
											}
											{
												attachFiles.length > 0 ?
													(
														attachFiles.map((file, index) => (
															<MC.Typography variant="body2" key={index}>
																{file.name} ({filesize(file.size)})
																<MC.IconButton
																	size="small"
																	aria-label="delete"
																	className={classes.margin}
																	onClick={() => deleteAttach(file, index, true)}>
																	<DeleteForeverIcon fontSize="small" />
																</MC.IconButton>
															</MC.Typography>
														))
													)
													:
													(
														!(maintenance.attachmentDataTypes && maintenance.attachmentDataTypes.length > 0) &&
														<MC.Typography variant="body2">
															파일을 선택해주세요.(최대용량 50 MB)
														</MC.Typography>
													)
											}
										</MC.Grid>
									</MC.Grid>
								)}
							</Dropzone>
						</MC.Grid>
					
					</MC.Grid>
				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default MaintenanceEditForm;
