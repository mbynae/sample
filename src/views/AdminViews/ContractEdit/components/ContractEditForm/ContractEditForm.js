import React, { useCallback, useRef }                  from "react";
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
	}, attachLayout:   {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	}
}));

const ContractEditForm = props => {
	const classes = useStyles();
	
	const { isEdit, contract, setContract, contractTypes, attachFiles, setAttachFiles, errors } = props;
	
	const attachRef = useRef();
	const inputRef = useRef();
	
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		setContract(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const handleDateChange = (key, date, value, isFrom) => {
		setContract(prev => {
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
			setContract(prev => {
				prev.attachmentDataTypes = update(contract.attachmentDataTypes, {
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
				title={"계약 정보"}
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
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isContractTypeKind}>
								<MC.InputLabel id="contractTypeKind-label">구분</MC.InputLabel>
								<MC.Select
									labelId="contractTypeKind-label"
									name="contractTypeKind"
									id="contractTypeKind-basic"
									defaultValue={""}
									value={contract.contractTypeKind || ""}
									onChange={handleChange}>
									<MC.MenuItem value="BIDDING">입찰</MC.MenuItem>
									<MC.MenuItem value="PRIVATE_CONTRACT">수의계약</MC.MenuItem>
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>
						
						{/*계약종류*/}
						{
							contractTypes.length > 0 &&
							<MC.Grid item xs={12} md={6}>
								<MC.FormControl fullWidth className={classes.formControl} error={errors.isContractType}>
									<MC.InputLabel id="contractTypeId-label">계약종류</MC.InputLabel>
									<MC.Select
										labelId="contractTypeId-label"
										name="contractTypeId"
										id="contractTypeId-basic"
										defaultValue={""}
										value={contract.contractTypeId || ""}
										onChange={handleChange}>
										{
											contractTypes.map((contractType, index) => (
												<MC.MenuItem value={contractType.id} key={index}>
													{contractType.name}
												</MC.MenuItem>
											))
										}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
						}
						
						{/*회사명*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="companyName-basic"
									name="companyName"
									label={"회사명"}
									error={errors.isCompanyName}
									value={contract.companyName || ""}
									inputProps={{
										maxLength: 20
									}}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*대표번호*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.InputLabel id="callNumber-label">대표번호</MC.InputLabel>
								<MC.Input
									size="small"
									labelid="callNumber-label"
									id="callNumber-input"
									name="callNumber"
									value={contract.callNumber || ""}
									onChange={handleChange}
									inputComponent={PhoneMask}
								/>
							</MC.FormControl>
						</MC.Grid>
						
						{/*회사주소*/}
						<MC.Grid item xs={12} md={12}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="companyAddress-basic"
									name="companyAddress"
									label={"회사주소"}
									error={errors.isCompanyAddress}
									value={contract.companyAddress || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*담당자명*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="chargeName-basic"
									name="chargeName"
									label={"담당자명"}
									value={contract.chargeName || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*담당자 연락처*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.InputLabel id="chargeCallNumber-label">담당자 연락처</MC.InputLabel>
								<MC.Input
									size="small"
									labelid="chargeCallNumber-label"
									id="chargeCallNumber-input"
									name="chargeCallNumber"
									value={contract.chargeCallNumber || ""}
									onChange={handleChange}
									inputComponent={PhoneMask}
								/>
							</MC.FormControl>
						</MC.Grid>
						
						{/*계약금액(부가세포함)*/}
						<MC.Grid item xs={12} md={12}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="price-basic"
									name="price"
									label="계약금액(부가세포함)"
									error={errors.isPrice}
									InputProps={{
										startAdornment: <MC.InputAdornment position="start">￦</MC.InputAdornment>,
										inputComponent: NumberFormatWon
									}}
									value={contract ? contract.price : ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*계약일*/}
						<MC.Grid item xs={12} md={6}>
							<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
								<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>
									<MC.Grid item xs={5} md={5}>
										<KeyboardDatePicker
											autoOk
											openTo="year"
											views={["year", "month", "date"]}
											variant="inline"
											margin="normal"
											id="contractStartDate-picker-dialog"
											label="계약일(시작)"
											format="yyyy/MM/DD"
											disableToolbar
											maxDate={contract.contractEndDate || new Date()}
											value={contract.contractStartDate || new Date()}
											onChange={(date, value) => handleDateChange("contractStartDate", date, value, true)}
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
											openTo="year"
											views={["year", "month", "date"]}
											variant="inline"
											margin="normal"
											id="contractEndDate-picker-dialog"
											label="계약일(종료)"
											format="yyyy/MM/DD"
											disableToolbar
											minDate={contract.contractStartDate || new Date()}
											value={contract.contractEndDate || new Date()}
											onChange={(date, value) => handleDateChange("contractEndDate", date, value, false)}
											KeyboardButtonProps={{
												"aria-label": "change date"
											}}
											className={classes.keyboardDatePicker} />
									</MC.Grid>
								</MC.Grid>
							</MuiPickersUtilsProvider>
						</MC.Grid>
						
						{/*메모*/}
						<MC.Grid item xs={12} md={12}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="memo-basic"
									name="memo"
									label="메모"
									multiline
									rows={4}
									value={contract ? contract.memo || "" : ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*첨부파일*/}
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
												(contract.attachmentDataTypes && contract.attachmentDataTypes.length > 0) &&
												contract.attachmentDataTypes.map((file, index) => (
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
														!(contract.attachmentDataTypes && contract.attachmentDataTypes.length > 0) &&
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

export default ContractEditForm;
