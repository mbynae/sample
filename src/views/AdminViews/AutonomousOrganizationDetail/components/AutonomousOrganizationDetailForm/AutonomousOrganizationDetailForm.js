import React   from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat } from "../../../../../components";
import filesize       from "filesize";

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
	tableCellSmall:    {
		width: "15%"
	},
	tableCellFull:     {
		width:    "70%",
		maxWidth: "70%"
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	}
}));

const AutonomousOrganizationDetailForm = props => {
	const classes = useStyles();
	
	const { autonomousOrganization, aoPositions } = props;
	
	return (
		<MC.Card>
			<MC.CardContent className={classes.cardContent}>
				
				<MC.Table>
					<MC.TableBody>
						
						{/*카테고리*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellFull}>
								{`[ ${autonomousOrganization.name} ] ${autonomousOrganization.title}`}
							</MC.TableCell>
							<MC.TableCell className={classes.tableCellSmall}>
								{`노출순서: ${autonomousOrganization.sequence}`}
							</MC.TableCell>
							<MC.TableCell className={classes.tableCellSmall}>
								<DateFormat date={autonomousOrganization.baseDateDataType.createDate} />
							</MC.TableCell>
						</MC.TableRow>
						
						{/*본문*/}
						<MC.TableRow>
							<MC.TableCell colSpan={3}>
								<div className="ql-editor" dangerouslySetInnerHTML={{ __html: autonomousOrganization.content }}
								     style={{ minHeight: 398, maxHeight: "none" }}>
								</div>
							</MC.TableCell>
						</MC.TableRow>
						
						<MC.TableRow>
							<MC.TableCell colSpan={3}>
								
								<MC.Grid container>
									<MC.Grid
										item
										xs={2}
										md={2}
										style={{ display: "flex" }}>
										구성원
									</MC.Grid>
									<MC.Grid
										item
										xs={10}
										md={10}
										style={{ display: "flex" }}>
										
										{
											(aoPositions && aoPositions.length > 0) ?
												<MC.Grid container spacing={1} direction={"row"} justify={"flex-start"} alignItems={"center"}>
													{
														aoPositions.map((groups, groupsIndex) => (
															<MC.Grid key={groupsIndex} item xs={6} md={3} style={{ textAlign: "left" }}>
																{groups.aoPosition.name} : &nbsp;
																{
																	groups.userList.length > 0 ?
																		(
																			groups.userList.map((user, index) => (
																					<span key={index}>
																						{user.name} {(groups.userList.length - 1) > index && ", "}
																					</span>
																				)
																			)
																		)
																		:
																		(
																			"-"
																		)
																}
															</MC.Grid>
														))
													}
												</MC.Grid>
												:
												<MC.Typography variant={"body2"}>
													관리되고 있는 직책이 없습니다.
												</MC.Typography>
										}
									</MC.Grid>
								</MC.Grid>
							
							</MC.TableCell>
						</MC.TableRow>
						
						
						{/*첨부파일*/}
						<MC.TableRow>
							<MC.TableCell colSpan={3}>
								<MC.Grid container>
									<MC.Grid
										item
										xs={2}
										md={2}
										style={{ display: "flex" }}>
										<MC.Typography>
											첨부파일
										</MC.Typography>
									</MC.Grid>
									<MC.Grid
										item
										xs={10}
										md={10}
										style={{ display: "flex" }}>
										{
											autonomousOrganization.attachmentDataTypes && autonomousOrganization.attachmentDataTypes.length >= 1 ?
												(
													<MC.Grid container spacing={1}>
														{
															autonomousOrganization.attachmentDataTypes.map((file, index) => (
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
							</MC.TableCell>
						</MC.TableRow>
					
					</MC.TableBody>
				</MC.Table>
			
			</MC.CardContent>
		</MC.Card>
	);
};

export default AutonomousOrganizationDetailForm;
