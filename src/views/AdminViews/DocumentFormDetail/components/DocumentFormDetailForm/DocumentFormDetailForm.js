import React    from "react";
import filesize from "filesize";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	cardHeader:  {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent: {},
	rowHeight:   {
		height: 54
	}
}));

const DocumentFormDetailForm = props => {
	const classes = useStyles();
	
	const { documentForm: obj } = props;
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"문서양식 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<MC.Grid container spacing={1}>
					
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

export default DocumentFormDetailForm;
