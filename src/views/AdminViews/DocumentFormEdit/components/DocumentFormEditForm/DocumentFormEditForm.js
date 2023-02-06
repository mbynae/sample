import React, { useCallback, useEffect, useRef } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { HTMLEditor } from "../../../../../components";
import theme          from "../../../../../theme/adminTheme";
import filesize       from "filesize";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Dropzone          from "react-dropzone";
import update            from "immutability-helper";

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
	}
}));

const DocumentFormEditForm = props => {
	const classes = useStyles();
	
	const { aoList, documentForm, setDocumentForm, attachFiles, setAttachFiles, errors } = props;
	
	const attachRef = useRef();
	const inputRef = useRef();
	
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		setDocumentForm({
			...documentForm,
			[name]: value
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
			setDocumentForm(prev => {
				prev.attachmentDataTypes = update(documentForm.attachmentDataTypes, {
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
				title={"문서양식 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>
						
						{/*제목*/}
						<MC.Grid item xs={12} md={12}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="title-basic"
									name="title"
									label="제목"
									placeholder="제목을 입력해주세요."
									error={errors.isTitle}
									value={documentForm.title || ""}
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
												(documentForm.attachmentDataTypes && documentForm.attachmentDataTypes.length > 0) &&
												documentForm.attachmentDataTypes.map((file, index) => (
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
														!(documentForm.attachmentDataTypes && documentForm.attachmentDataTypes.length > 0) &&
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

export default DocumentFormEditForm;
