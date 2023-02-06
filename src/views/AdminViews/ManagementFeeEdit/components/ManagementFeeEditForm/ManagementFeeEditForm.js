import React, { useRef, useState } from "react";
import Dropzone                    from "react-dropzone";
import XLSX                        from "xlsx";
import PerfectScrollbar            from "react-perfect-scrollbar";
import iconv                       from "iconv-lite";
import { isWindows }               from "react-device-detect";

import MomentUtils                                     from "@date-io/moment";
import DeleteForeverIcon                               from "@material-ui/icons/DeleteForever";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment                                          from "moment";

import ReactDataSheet from "react-datasheet";
import "react-datasheet/lib/react-datasheet.css";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import theme         from "../../../../../theme/adminTheme";
import { SheetJSFT } from "./types";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
		marginTop: theme.spacing(2)
	},
	cardHeader:               {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:              {},
	tableCellTitle:           {
		width: "15%"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%"
	},
	buttonLayoutRight:        {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	attachLayout:             {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	},
	reactDataSheet:           {
		marginTop:                                               20,
		maxHeight:                                               400,
		"& .data-grid-container .data-grid .cell.read-only":     {
			height:        30,
			verticalAlign: "middle"
		},
		"& .data-grid-container .data-grid .cell .value-viewer": {
			display:   "block",
			boxSizing: "content-box",
			width:     "inherit",
			textAlign: "center"
		},
		"& .data-grid-container .data-grid .cell .data-editor":  {
			display:   "block",
			boxSizing: "content-box",
			width:     "inherit"
		}
	}
}));

const ManagementFeeEditForm = props => {
	const classes = useStyles();
	
	const { isEdit, managementFee, setManagementFee, attachFile, setAttachFile, datasheetGrid, setDatasheetGrid, errors } = props;
	
	const attachRef = useRef();
	const inputRef = useRef();
	
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		setManagementFee({
			...managementFee,
			[name]: value
		});
	};
	
	const onAttach = async (acceptedFiles) => {
		try {
			inputRef.current.value = "";
			await acceptedFiles.map(async file => {
				setAttachFile(file);
				handleFile(file);
			});
		} catch ( e ) {
		
		}
	};
	
	const deleteAttach = (file, isNew) => {
		if ( isNew ) {
			setAttachFile();
		} else {
			setManagementFee(prev => {
				return {
					...prev,
					attachmentDataType: {}
				};
			});
		}
		setDatasheetGrid([]);
	};
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const handleDateChange = (key, date, value, isFrom) => {
		setManagementFee(prev => {
			return {
				...prev,
				[key]: getDate(date, isFrom)
			};
		});
	};
	
	const handleFile = (file) => {
		/* Boilerplate to set up FileReader */
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		
		reader.onload = async (e) => {
			const bstr = e.target.result;
			const wb = XLSX.read(
				isWindows ? iconv.decode(bstr, "euc-kr") : bstr,
				{ type: rABS ? "binary" : "array", bookVBA: true }
			);
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			let gridFromXlsx = getGrid(ws);
			convertToGrid(gridFromXlsx);
		};
		
		if ( rABS ) {
			if ( file.type.includes("csv") > 0 ) {
				reader.readAsText(file, "EUC-KR");
			} else {
				reader.readAsBinaryString(file);
			}
		} else {
			reader.readAsArrayBuffer(file);
		}
	};
	
	const getGrid = (sheet) => {
		let grid = [];
		let range = XLSX.utils.decode_range(sheet["!ref"]);
		let C, R = range.s.r;
		for ( R = range.s.r; R <= range.e.r; ++R ) {
			grid.push(getRow(sheet, range, R, C));
		}
		return grid;
	};
	
	const getRow = (sheet, range, R, C) => {
		let rows = [];
		for ( C = range.s.c; C <= range.e.c; ++C ) {
			let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
			let hdr = R === 0 ? `unknown-${C}` : `none-${C}`; // <-- replace with your desired default
			if ( cell && cell.t ) {
				hdr = XLSX.utils.format_cell(cell);
			}
			rows.push(hdr);
		}
		return rows;
	};
	
	// 참고 코드
	// const getHeaderRow = (sheet) => {
	// 	let headers = [];
	// 	let range = XLSX.utils.decode_range(sheet["!ref"]);
	// 	let C, R = range.s.r; /* start in the first row */
	// 	/* walk every column in the range */
	// 	for ( C = range.s.c; C <= range.e.c; ++C ) {
	// 		let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
	// 		let hdr = "Unknown-" + C; // <-- replace with your desired default
	// 		if ( cell && cell.t ) {
	// 			hdr = XLSX.utils.format_cell(cell);
	// 		}
	//
	// 		headers.push(hdr);
	// 	}
	// 	return headers;
	// };
	
	const convertToGrid = (beforeGrids) => {
		let grid = [];
		beforeGrids.map((beforeGrid, index) => {
			let row = [];
			beforeGrid.map(value => {
				let obj = {
					value:    value,
					readOnly: true, //index === 0,
					width:    150
				};
				row.push(obj);
			});
			grid.push(row);
		});
		setDatasheetGrid(grid);
	};
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"관리비 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>
						
						<MC.Grid item xs={12} md={6}>
							<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
								<MC.Grid container spacing={1} style={{ marginBottom: 10 }}>
									<MC.Grid item xs={5} md={5}>
										<KeyboardDatePicker
											autoOk
											error={errors.isYearMonth}
											variant="inline"
											margin="normal"
											id="billingYearMonth-picker-dialog"
											label="청구년월"
											format="yyyy/MM"
											openTo="year"
											views={["year", "month"]}
											disableToolbar
											disablePast
											value={managementFee.billingYearMonth || new Date()}
											onChange={(date, value) => handleDateChange("billingYearMonth", date, value, true)}
											KeyboardButtonProps={{
												"aria-label": "change date"
											}}
											className={classes.keyboardDatePicker} />
									</MC.Grid>
								</MC.Grid>
							</MuiPickersUtilsProvider>
						</MC.Grid>
						<MC.Grid item xs={12} md={6} />
						
						{/*제목*/}
						<MC.Grid item xs={12} md={12}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="title-basic"
									name="title"
									label="제목"
									placeholder="제목을 입력해주세요."
									error={errors.isTitle}
									value={managementFee.title || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*엑셀화면*/}
						<MC.Grid item xs={12} md={12} className={classes.reactDataSheet}>
							
							<PerfectScrollbar>
								<ReactDataSheet
									data={datasheetGrid}
									valueRenderer={cell => cell.value}
									onCellsChanged={changes => {
										const grid = datasheetGrid.map(row => [...row]);
										changes.forEach(({ cell, row, col, value }) => {
											grid[row][col] = { ...grid[row][col], value };
										});
										setDatasheetGrid(grid);
									}}
								/>
							</PerfectScrollbar>
						</MC.Grid>
						
						{/*엑셀업로드*/}
						<MC.Grid item xs={12} md={12}>
							<Dropzone
								ref={attachRef}
								style={{ width: "100%", height: "40px" }}
								onDrop={onAttach}
								maxSize={50000000}
								accept={SheetJSFT}
								noKeyboard
								noClick
								multiple={false}
							>
								{({ getRootProps, getInputProps }) => (
									<MC.Grid container {...getRootProps()}>
										<MC.Grid item xs={2} md={2} className={classes.attachLayout} style={{ padding: theme.spacing(2) }}>
											<input id="contained-button-file" {...getInputProps()} ref={inputRef} />
											<label htmlFor="contained-button-file">
												<MC.Button variant="contained" color="primary" component="span">
													엑셀업로드
												</MC.Button>
											</label>
										</MC.Grid>
										<MC.Grid item xs={10} md={10} className={classes.attachLayout}>
											{
												attachFile ?
													(
														<MC.Typography variant="body2">
															{attachFile.name}
															<MC.IconButton
																size="small"
																aria-label="delete"
																className={classes.margin}
																onClick={() => deleteAttach(attachFile, true)}>
																<DeleteForeverIcon fontSize="small" />
															</MC.IconButton>
														</MC.Typography>
													)
													:
													(
														(isEdit && managementFee.attachmentDataType.fileOriginalName) ?
															(
																<MC.Typography variant="body2">
																	{managementFee.attachmentDataType.fileOriginalName}
																	<MC.IconButton
																		size="small"
																		aria-label="delete"
																		className={classes.margin}
																		onClick={() => deleteAttach(managementFee.attachmentDataType, false)}>
																		<DeleteForeverIcon fontSize="small" />
																	</MC.IconButton>
																</MC.Typography>
															)
															:
															(
																<MC.Typography variant="body2">
																	엑셀 파일을 선택해주세요.(최대용량 50 MB)
																</MC.Typography>
															)
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

export default ManagementFeeEditForm;
