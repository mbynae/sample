import React    from "react";
import filesize from "filesize";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat } from "../../../../../components";

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
	},
	rowHeight:         {
		height: 54
	}
}));

const MaintenanceDetailForm = props => {
	const classes = useStyles();
	
	const { maintenance: obj } = props;
	
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
				<MC.Grid container spacing={1}>
					
					{/*구분*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										구분
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.maintenanceType.name}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*점검업체*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										점검업체
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.contractCompany.companyName}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*점검명*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										점검명
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.maintenanceTitle}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item xs={12} md={6}/>
					
					{/*점검일*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										점검일
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								<DateFormat date={obj.inspectionStartDate} format={"YYYY-MM-DD"} />
								&nbsp; ~ &nbsp;
								<DateFormat date={obj.inspectionEndDate} format={"YYYY-MM-DD"} />
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*시행일*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										시행일
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								
								{
									obj.maintenanceStartDate ?
										(
											<>
												<DateFormat date={obj.maintenanceStartDate} format={"YYYY-MM-DD"} />
												&nbsp; ~ &nbsp;
												<DateFormat date={obj.maintenanceEndDate} format={"YYYY-MM-DD"} />
											</>
										)
										:
										("-")
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*등록일*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										등록일
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								<DateFormat date={obj.baseDateDataType.createDate} format={"YYYY-MM-DD"} />
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					<MC.Grid item xs={12} md={6} />
					
					{/*첨부파일*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										첨부파일
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								{
									obj.attachmentDataTypes && obj.attachmentDataTypes.length >= 1 ?
										(
											<MC.Grid container spacing={1}>
												{
													obj.attachmentDataTypes.map(
														(file, index) => (
															<MC.Grid item xs={12} md={12} key={index}>
																<MC.Typography variant="body2">
																	<MC.Link href={file.fileUrl} target="_blank" download>
																		{file.fileOriginalName} ({filesize(file.fileSize)})
																	</MC.Link>
																</MC.Typography>
															</MC.Grid>
														)
													)
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
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				
				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	);
};

export default MaintenanceDetailForm;
