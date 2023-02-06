import React, { useCallback, useEffect, useRef, useState } from "react";
import filesize                                            from "filesize";
import update                                              from "immutability-helper";

import * as MS           from "@material-ui/styles";
import * as MC           from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import Quill              from "quill";
import { htmlEditButton } from "quill-html-edit-button";
import QuillBetterTable   from "quill-better-table";
import BlotFormatter      from "quill-blot-formatter";
import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import CustomImage        from "./CustomImage";
import CustomVideo        from "./CustomVideo";

import Dropzone                  from "react-dropzone";
import "./editorStyle.css";
import { imageUploadRepository } from "../../repositories";

const __ISMSIE__ = !!navigator.userAgent.match(/Trident/i);
const __ISIOS__ = !!navigator.userAgent.match(/iPad|iPhone|iPod/i);

window.Quill = Quill;
const FontStyle = Quill.import("formats/font");
FontStyle.whitelist = ["Roboto", "NotoSansKR", "BlackHanSans"];
Quill.register(FontStyle, true);
Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/htmlEditButton", htmlEditButton);
Quill.register("modules/better-table", QuillBetterTable);
Quill.register({ "formats/image": CustomImage });
Quill.register({ "formats/video": CustomVideo });

const useStyles = MS.makeStyles((theme) => ({
	tableCellTitle:           {
		width:  "15%",
		border: "none"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%",
		border:   "none"
	},
	attachLayout:             {
		// padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	},
	attachListLayoutRight:    {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	attachListLayoutLeft:     {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center",
		alignContent:   "center"
	},
	margin:                   {
		margin: theme.spacing(0),
		width:  24
	},
	body4:                    {
		...theme.typography.body4
	},
	quillContainer:           {
		"& .quill-editor iframe":                                                   {
			pointerEvents: "none"
		},
		"& .quill-editor video":                                                    {
			pointerEvents: "none"
		},
		"& .ql-tooltip":                                                            {
			zIndex: 1200
		},
		"& .ql-container":                                                          {
			height: 400
		},
		"& .ql-picker.ql-font":                                                     {
			"& .ql-picker-item": {
				fontSize:   0,
				"&:before": {
					content:  "attr(data-value) !important",
					fontSize: "14px"
				}
			},
			"& .ql-active":      {
				"&:before": {
					content:  "attr(data-value) !important",
					fontSize: "14px"
				}
			}
		},
		"& .ql-picker.ql-font .ql-picker-label[data-value='Roboto']::before":       {
			fontFamily: "Roboto, sans-serif;",
			content:    "Roboto !important"
		},
		"& .ql-picker.ql-font .ql-picker-item[data-value='Roboto']::before":        {
			fontFamily: "Roboto, sans-serif;",
			content:    "Roboto !important"
		},
		"& .ql-picker.ql-font .ql-picker-label[data-value='BlackHanSans']::before": {
			fontFamily: "Black Han Sans, sans-serif;",
			content:    "Black Han Sans !important"
		},
		"& .ql-picker.ql-font .ql-picker-item[data-value='BlackHanSans']::before":  {
			fontFamily: "Black Han Sans, sans-serif;",
			content:    "Black Han Sans !important"
		},
		"& .ql-picker.ql-font .ql-picker-label[data-value='NotoSansKR']::before":   {
			fontFamily: "Noto Sans KR, sans-serif",
			content:    "Noto Sans KR !important"
		},
		"& .ql-picker.ql-font .ql-picker-item[data-value='NotoSansKR']::before":    {
			fontFamily: "Noto Sans KR, sans-serif",
			content:    "Noto Sans KR !important"
		}
	}
}));

const HTMLEditor = props => {
	
	const classes = useStyles();
	
	const {
		      content,
		      obj,
		      isMobile,
		      setObj,
		      attachFiles,
		      setAttachFiles
	      } = props;
	
	const quillElement = useRef();
	const quillInstance = useRef();
	const dropzoneRef = useRef();
	const attachRef = useRef();
	const inputRef = useRef();
	
	const [onKeyEvent, setOnKeyEvent] = useState(false);
	const [workings, setWorkings] = useState({});
	
	useEffect(() => {
		if ( quillElement.current ) {
			quillInstance.current = new Quill(quillElement.current, {
				theme:       "snow",
				placeholder: "내용을 입력해주세요.",
				modules:     modules,
				formats:     formats
			});
			
			const quill = quillInstance.current;
			const toolbar = quill.getModule("toolbar");
			
			quill.on("text-change", (delta, source, editor) => onChange(delta, source, editor, quill));
			toolbar.addHandler("video", () => videoHandler(quill));
			toolbar.addHandler("table", insertTable);
			toolbar.addHandler("image", imageHandler);
		}
	}, []);
	
	const mounted = useRef(false);
	useEffect(() => {
		if ( content === "" || mounted.current ) {
			return;
		}
		mounted.current = true;
		quillInstance.current.root.innerHTML = content;
	}, [content]);
	
	const videoHandler = (quill) => {
		let url = prompt("Enter Video URL: ");
		url = getVideoUrl(url);
		
		let range = quill.getSelection();
		if ( url != null ) {
			quill.insertEmbed(range.index, "video", url);
			quill.setSelection(range.index + 1);
			quill.focus();
		}
	};
	
	const getVideoUrl = (url) => {
		let match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
		            url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/) ||
		            url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
		
		if ( match && match[2].length === 11 ) {
			return ("https") + "://www.youtube.com/embed/" + match[2] + "?showinfo=0";
		}
		if ( match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/) ) { // eslint-disable-line no-cond-assign
			return (match[1] || "https") + "://player.vimeo.com/video/" + match[2] + "/";
		}
		return null;
	};
	
	const saveFile = (file) => {
		const nowDate = new Date().getTime();
		const _workings = { ...workings, [nowDate]: true };
		setWorkings({ _workings });
		
		return imageUploadRepository.uploadFile(file, true).then(
			(results) => {
				_workings[nowDate] = false;
				setWorkings({ _workings });
				return Promise.resolve({ url: results });
			},
			(error) => {
				console.error("saveFile error: ", error);
				_workings[nowDate] = false;
				setWorkings({ _workings });
				return Promise.reject(error);
			}
		);
	};
	
	const onDrop = async (acceptedFiles) => {
		try {
			await acceptedFiles.map(async file => {
				const { url } = await saveFile(file);
				const quill = quillInstance.current;
				const range = quill.getSelection();
				quill.insertEmbed(range.index, "image", url);
				quill.setSelection(range.index + 1);
				quill.focus();
			});
		} catch ( e ) {
		
		}
	};
	
	const imageHandler = () => {
		if ( dropzoneRef ) {
			dropzoneRef.current.open();
		}
	};
	
	const modules = {
		toolbar:        [
			[{ "font": FontStyle.whitelist }],
			[{ "header": [1, 2, 3, 4, 5, 6, false] }, { "size": ["small", false, "large", "huge"] }, { "color": [] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }, { "align": [] }],
			["link", "image", "video"],
			["clean"],
			["table"]
		],
		htmlEditButton: {},
		blotFormatter:  {},
		table:          false,  // disable table module
		"better-table": {
			operationMenu: {
				items: {
					unmergeCells: {
						text: "Another unmerge cells name"
					}
				},
				color: {
					colors: ["green", "red", "yellow", "blue", "white"],
					text:   "Background Colors:"
				}
			}
		},
		// keyboard: {
		// 	bindings: QuillBetterTable.keyboardBindings
		// },
		clipboard: { matchVisual: false }
	};
	
	const formats = [
		"font",
		"header", "size", "color",
		"bold", "italic", "underline", "strike", "blockquote",
		"list", "bullet", "indent", "align",
		"link", "image", "video",
		"clean"
	];
	
	const onChange = (delta, oldDelta, source, quill) => {
		let content = quillInstance.current.root.innerHTML;
		let _contents = "";
		if ( __ISMSIE__ ) {
			if ( content.indexOf("<p><br></p>") > -1 ) {
				_contents = content.replace(/<p><br><\/p>/gi, "<p>&nbsp;</p>");
				setObj(prev => {
					return {
						...prev,
						content: _contents
					};
				});
			}
		} else {
			setObj(prev => {
				return {
					...prev,
					content: content
				};
			});
		}
	};
	
	const onKeyup = (event) => {
		if ( !__ISIOS__ ) {
			return;
		}
		quillElement.current.blur();
		quillElement.current.focus();
		if ( event.keyCode === 13 ) {
			setOnKeyEvent(true);
			quillElement.current.blur();
			quillElement.current.focus();
			if ( document.documentElement.className.indexOf("edit-focus") === -1 ) {
				document.documentElement.classList.toggle("edit-focus");
			}
			setOnKeyEvent(false);
		}
	};
	
	const onFocus = () => {
		if ( !onKeyEvent && document.documentElement.className.indexOf("edit-focus") === -1 ) {
			document.documentElement.classList.toggle("edit-focus");
			window.scrollTo(0, 0);
		}
	};
	
	const onBlur = () => {
		if ( !onKeyEvent && document.documentElement.className.indexOf("edit-focus") !== -1 ) {
			document.documentElement.classList.toggle("edit-focus");
		}
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
			setObj(prev => {
				prev.attachmentDataTypes = update(obj.attachmentDataTypes, {
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
	
	const insertTable = () => {
		let tableModule = quillInstance.current.getModule("better-table");
		tableModule.insertTable(3, 3);
	};
	
	return (
		<div
			className={classes.quillContainer}
		>
			<div
				ref={quillElement}
				onKeyUp={onKeyup}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
			<Dropzone
				ref={dropzoneRef}
				style={{ width: 0, height: 0 }}
				onDrop={onDrop}
				accept="image/*"
				noClick
				noKeyboard
			>
				{({ getRootProps, getInputProps }) => (
					<div {...getRootProps()}>
						<input {...getInputProps()} />
					</div>
				)}
			</Dropzone>
			
			{
				attachFiles &&
				<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"center"} style={{ marginTop: 20 }}>
					<MC.Grid item xs={12} md={12}>
						<MC.Typography className={classes.body4}>
							파일첨부
						</MC.Typography>
					</MC.Grid>
					<MC.Grid item xs={12} md={12}>
						<Dropzone
							ref={attachRef}
							style={{ width: "100%", height: "40px" }}
							onDrop={onAttach}
							maxSize={50000000}
							noKeyboard
							noClick
						>
							{({ getRootProps, getInputProps }) => (
								<MC.Grid container justify={"space-between"} alignItems={"flex-start"} {...getRootProps()} style={{ paddingTop: 11 }}>
									
									<MC.Grid item className={classes.attachLayout}
									         style={{ width: isMobile ? 209 : 979, border: "1px solid #ebebeb", paddingLeft: 15, paddingTop: 11, paddingBottom: 11, marginRight: 8 }}>
										{
											(obj.attachmentDataTypes && obj.attachmentDataTypes.length > 0) &&
											obj.attachmentDataTypes.map((file, index) => (
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
													!(obj.attachmentDataTypes && obj.attachmentDataTypes.length > 0) &&
													<MC.Typography variant="body2" style={{ color: "#bcbcbc" }}>
														파일을 선택해주세요.
													</MC.Typography>
												)
										}
									</MC.Grid>
									
									<MC.Grid item className={classes.attachLayout} style={{ width: 111 }}>
										<input id="contained-button-file" {...getInputProps()} ref={inputRef} />
										<label htmlFor="contained-button-file">
											<MC.Button
												component={"span"}
												variant="contained"
												size="large"
												disableElevation
												style={{ color: "#ffffff", padding: 0, borderRadius: 0, width: "100%", height: 40, border: "1px solid rgb(51, 51, 51, 0.2)", backgroundColor: "#4a4745" }}>
												파일선택
											</MC.Button>
										</label>
									</MC.Grid>
								
								</MC.Grid>
							)}
						</Dropzone>
					</MC.Grid>
				</MC.Grid>
			}
		
		</div>
	);
};

export default HTMLEditor;
