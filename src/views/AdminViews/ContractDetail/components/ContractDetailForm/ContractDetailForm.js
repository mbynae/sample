import React    from "react";
import filesize from "filesize";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { DateFormat, NumberComma, PhoneHyphen } from "../../../../../components";

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

const ContractDetailForm = props => {
	const classes = useStyles();
	
	const { contract: obj } = props;
	
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
								{
									obj.contractTypeKind === "BIDDING" ? <MC.Chip label={"입찰"} /> :
										obj.contractTypeKind === "PRIVATE_CONTRACT" && <MC.Chip label={"수의계약"} />
								}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*계약종류*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										계약종류
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.contractType.name}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*회사명*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										회사명
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.companyName}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*대표번호*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										대표번호
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{PhoneHyphen(obj.callNumber)}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*회사주소*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										회사주소
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.companyAddress}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*담당자명*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										담당자명
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.chargeName}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*담당자 연락처*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										담당자 연락처
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{obj.chargeCallNumber}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*계약금액 (부가세포함)*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"} style={{ whiteSpace: "pre-line" }}>
										{"계약금액 \n(부가세포함)"}
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10}>
								{"￦ " + NumberComma(obj.price || "") + " 원"}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
					{/*계약일*/}
					<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={2} md={2}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										계약일
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={10} md={10} style={{ whiteSpace: "pre-line" }}>
								<DateFormat date={obj.contractStartDate} format={"YYYY-MM-DD"} />
								&nbsp; ~ &nbsp;
								<DateFormat date={obj.contractEndDate} format={"YYYY-MM-DD"} />
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
					
					{/*메모*/}
					<MC.Grid item xs={12} md={12} className={classes.rowHeight}>
						<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item xs={1} md={1}>
								<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
									<MC.Typography variant={"subtitle2"}>
										메모
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item xs={11} md={11} style={{ whiteSpace: "pre-line" }}>
								{obj.memo}
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
					
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

export default ContractDetailForm;
