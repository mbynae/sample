import React   from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import palette                     from "../../../../../theme/adminTheme/palette";
import { DateFormat, PhoneHyphen } from "../../../../../components";
import filesize                    from "filesize";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
		marginTop: theme.spacing(2)
	},
	cardHeader:               {
		color:           palette.icon,
		backgroundColor: palette.info.moreLight
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
	}
}));

const PreCheckDetailForm = props => {
	const classes = useStyles();
	
	const { preCheckDetail, setPreCheckDetail } = props;
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"사전점검 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				
				<MC.Table>
					<MC.TableBody>
						
						{/*동/호*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle}>
								동/호
							</MC.TableCell>
							<MC.TableCell>
								{`${preCheckDetail.preCheckUser.building}동 ${preCheckDetail.preCheckUser.unit}호`}
							</MC.TableCell>
						</MC.TableRow>
						
						{/*이름*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle}>
								이름
							</MC.TableCell>
							<MC.TableCell>
								{`${preCheckDetail.preCheckUser.name}`}
							</MC.TableCell>
						</MC.TableRow>
						
						{/*휴대폰번호*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle}>
								휴대폰번호
							</MC.TableCell>
							<MC.TableCell>
								{PhoneHyphen(preCheckDetail.preCheckUser.phoneNumber)}
							</MC.TableCell>
						</MC.TableRow>
						
						{/*점검일*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle}>
								점검일
							</MC.TableCell>
							<MC.TableCell>
								<DateFormat date={preCheckDetail.preCheckDate || new Date()} format={"YYYY-MM-DD"} />
							</MC.TableCell>
						</MC.TableRow>
					
					</MC.TableBody>
				</MC.Table>
				
				<MC.Table size="small" style={{ marginTop: 10 }}>
					
					<MC.TableHead>
						<MC.TableRow>
							<MC.TableCell align={"center"} style={{ width: "10%" }}>구분</MC.TableCell>
							<MC.TableCell align={"center"} style={{ width: "50%" }}>하자내용</MC.TableCell>
							<MC.TableCell align={"center"} style={{ width: "25%" }}>첨부파일</MC.TableCell>
							<MC.TableCell align={"center"} style={{ width: "15%" }}>등록일</MC.TableCell>
						</MC.TableRow>
					</MC.TableHead>
					
					<MC.TableBody>
						{
							preCheckDetail.preCheckDefects.length === 0 ?
								(
									<MC.TableRow>
										<MC.TableCell colSpan={6} align="center">
											입력하신 하자내용이 없습니다.
										</MC.TableCell>
									</MC.TableRow>
								)
								:
								(
									preCheckDetail.preCheckDefects.map((preCheckDefect, index) => (
										<MC.TableRow key={index}>
											
											{/*구분*/}
											<MC.TableCell align={"center"}>
												{
													preCheckDefect.defectType === "LIVING_ROOM" ? "거실" :
														preCheckDefect.defectType === "ROOM" ? "방" :
															preCheckDefect.defectType === "KITCHEN" ? "주방" :
																preCheckDefect.defectType === "MAIN_DOOR" ? "현관문" :
																	preCheckDefect.defectType === "VERANDA" ? "베란다" :
																		preCheckDefect.defectType === "BATHROOM" ? "욕실" :
																			preCheckDefect.defectType === "ETC" && "기타"
												}
											</MC.TableCell>
											
											{/*하자내용*/}
											<MC.TableCell align={"left"} style={{ whiteSpace: "pre-line" }}>
												{preCheckDefect.content}
											</MC.TableCell>
											
											{/*첨부파일*/}
											<MC.TableCell align={"center"}>
												{
													preCheckDefect.preCheckDefectAttachments.length > 0 ?
														(
															<MC.Grid container spacing={1}>
																{
																	preCheckDefect.preCheckDefectAttachments.map(
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
															"-"
														)
												}
											</MC.TableCell>
											
											{/*등록일*/}
											<MC.TableCell align={"center"}>
												<DateFormat date={preCheckDefect.baseDateDataType.lastModifiedDate} format={"YYYY-MM-DD"} />
											</MC.TableCell>
										
										</MC.TableRow>
									))
								)
						}
					</MC.TableBody>
				
				</MC.Table>
			</MC.CardContent>
		</MC.Card>
	);
};

export default PreCheckDetailForm;
