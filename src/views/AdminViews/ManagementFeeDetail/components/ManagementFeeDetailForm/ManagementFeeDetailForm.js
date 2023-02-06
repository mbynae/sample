import React            from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import filesize         from "filesize";

import ReactDataSheet from "react-datasheet";
import "react-datasheet/lib/react-datasheet.css";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat } from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:           {
		padding: theme.spacing(3)
	},
	content:        {
		marginTop: theme.spacing(2)
	},
	cardHeader:     {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:    {},
	rowHeight:      {
		height: 54
	},
	reactDataSheet: {
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

const ManagementFeeDetailForm = props => {
	const classes = useStyles();
	
	const { managementFee: obj, datasheetGrid, setDatasheetGrid } = props;
	
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
				<MC.Grid container spacing={1}>
					
					{/*청구년월*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										청구년월
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								<DateFormat date={obj.billingYearMonth} format={"YYYY년 MM월"} />
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item xs={12} md={6} />
					
					{/*제목*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										제목
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.title}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item xs={12} md={6} />
					
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
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										엑셀업로드
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								{
									obj &&
									(
										<>
											{
												obj.attachmentDataType.fileOriginalName ?
													(
														<MC.Grid container spacing={1}>
															{
																<MC.Grid item xs={12} md={12}>
																	<MC.Typography variant="body2">
																		<MC.Link href={obj.attachmentDataType.fileUrl} target="_blank" download>
																			{obj.attachmentDataType.fileOriginalName} ({filesize(obj.attachmentDataType.fileSize)})
																		</MC.Link>
																	</MC.Typography>
																</MC.Grid>
															}
														</MC.Grid>
													)
													:
													(
														<MC.Typography variant="body2">
															{"첨부된 파일이 없습니다."}
														</MC.Typography>
													)
											}
										</>
									)
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				
				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	);
};

export default ManagementFeeDetailForm;
