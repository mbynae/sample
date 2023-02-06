import React, { useEffect, useRef, useState } from "react";
import clsx                                   from "clsx";
import Dropzone                               from "react-dropzone";
import filesize                               from "filesize";
import update                                 from "immutability-helper";

import GetAppIcon        from "@material-ui/icons/GetApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import { DefectTypeKind }                                     from "../../../../../enums";
import { preCheckDefectRepository, preCheckDetailRepository } from "../../../../../repositories";
import { DateFormat }                                         from "../../../../../components";
import { PreCheckDefectEdit }                                 from "../index";

const useStyles = MS.makeStyles(theme => ({
	body4:       {
		...theme.typography.body4
	},
	formControl: {
		width:  210,
		height: 40
	},
	body5:       {
		...theme.typography.body5,
		whiteSpace: "pre-line"
	},
	select:      {
		paddingLeft:   15,
		paddingTop:    11,
		paddingBottom: 11
	}
}));

const PreCheckDefect = props => {
	const classes = useStyles();

	const { isMobile, preCheckDetailId, preCheckDefect, getPreCheckDetail, preCheckDefectCount, alertOpens, setAlertOpens, handleAlertToggle } = props;

	const [tempPreCheckDefect, setTempPreCheckDefect] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		const init = () => {
			if ( preCheckDefect ) {
				dataBinding(preCheckDefect);
			} else {
				dataBinding(undefined);
			}
		};

		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const dataBinding = (obj) => {
		setTempPreCheckDefect(prev => {
			return {
				...prev,
				id:                        obj ? obj.id : "",
				defectType:                obj ? obj.defectType : "",
				content:                   obj ? obj.content : "",
				preCheckDefectAttachments: obj ? obj.preCheckDefectAttachments : [],
				preCheckDetail:            obj ? obj.preCheckDetail : "",
				baseDateDataType:          obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				preCheckDetailId:          preCheckDetailId
			};
		});
		setIsLoading(false);
	};

	const toggleEdit = (value = false) => {
		setIsEdit(value);
	};

	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"하자내용이 삭제 됩니다. \n 정말로 삭제하겠습니까?",
			"삭제",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
				preCheckDefectRepository
					.removePreCheckDefect(tempPreCheckDefect.id, false, true)
					.then(async result => {
						if ( preCheckDefectCount === 0 ) {
							await preCheckDetailRepository.updatePreCheckDetail(preCheckDetailId, { isCheck: false });
						}
						handleAlertToggle(
							"isOpen",
							undefined,
							"하자내용을 삭제 하였습니다.",
							undefined,
							() => {
								getPreCheckDetail(preCheckDetailId);
								setAlertOpens(prev => { return { ...prev, isOpen: false }; });
							}
						);
					});
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false }; });
			}
		);
	};

	return (
		<>
			{
				!isLoading &&
				<>
					{
						isEdit ?
							(
								<PreCheckDefectEdit
									isMobile={isMobile}
									preCheckDetailId={preCheckDetailId}
									getPreCheckDetail={getPreCheckDetail}
									preCheckDefect={preCheckDefect}
									toggleRegisterForm={toggleEdit}
									preCheckDefectCount={preCheckDefectCount}
									alertOpens={alertOpens}
									setAlertOpens={setAlertOpens}
									handleAlertToggle={handleAlertToggle} />
							)
							:
							(
								<MC.Grid container justify={"center"} alignItems={"center"} style={{ marginTop: 30 }}>

									{
										isMobile &&
										<MC.Grid item xs={12} md={12} style={{ textAlign: "right", marginBottom: 8 }}>
											<span className={classes.body4} style={{ color: "#222222" }}>
												등록일 <DateFormat date={tempPreCheckDefect.baseDateDataType.lastModifiedDate} format={"YYYY.MM.DD"} />
											</span>
										</MC.Grid>
									}

									<MC.Grid item xs={12} md={12}>
										<MC.Grid container justify={"space-between"} alignItems={"center"}>
											<MC.Grid item xs={4} md={6} style={{ borderLeft: "4px solid #449CE8", paddingLeft: 8 }}>
												<MC.Typography variant={"h6"} style={{ color: "#222222", marginRight: 20 }}>
													{
														tempPreCheckDefect.defectType === "LIVING_ROOM" ? "거실" :
															tempPreCheckDefect.defectType === "ROOM" ? "방" :
																tempPreCheckDefect.defectType === "KITCHEN" ? "주방" :
																	tempPreCheckDefect.defectType === "MAIN_DOOR" ? "현관문" :
																		tempPreCheckDefect.defectType === "VERANDA" ? "베란다" :
																			tempPreCheckDefect.defectType === "BATHROOM" ? "욕실" :
																				tempPreCheckDefect.defectType === "ETC" && "기타"
													}
												</MC.Typography>
											</MC.Grid>
											<MC.Grid item xs={8} md={6} style={{ textAlign: "right" }}>
												{
													!isMobile &&
													<span className={classes.body4} style={{ color: "#222222", marginRight: 20 }}>
														등록일 <DateFormat date={tempPreCheckDefect.baseDateDataType.lastModifiedDate} format={"YYYY.MM.DD"} />
													</span>
												}
												<MC.Button
													size="large"
													disableElevation
													style={{ padding: 0, borderRadius: 0, width: isMobile ? 65 : 120, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)", marginRight: 10 }}
													onClick={() => toggleEdit(true)}>
													수정
												</MC.Button>
												<MC.Button
													size="large"
													disableElevation
													style={{ padding: 0, borderRadius: 0, width: isMobile ? 65 : 120, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)" }}
													onClick={handleDelete}>
													삭제
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>

									<MC.Grid item xs={12} md={12} style={{
										marginTop:       12,
										whiteSpace:      "pre-line",
										border:          "1px solid #ebebeb",
										backgroundColor: "#f8f8f8",
										height:          150,
										overflow:        "scroll",
										paddingLeft:     15,
										paddingTop:      11,
										paddingRight:    15,
										paddingBottom:   11
									}}>
										{tempPreCheckDefect.content}
									</MC.Grid>

									{
										tempPreCheckDefect.preCheckDefectAttachments.length !== 0 &&
										<MC.Grid item xs={12} md={12} style={{ backgroundColor: "#fafafa", marginTop: 12, paddingTop: 20, paddingBottom: 20, paddingRight: 16, paddingLeft: 16 }}>
											{
												(tempPreCheckDefect.preCheckDefectAttachments && tempPreCheckDefect.preCheckDefectAttachments.length > 0) &&
												tempPreCheckDefect.preCheckDefectAttachments.map((file, index) => (
													<MC.Grid item xs={12} md={12} key={index}>
														<MC.Typography className={classes.body4}>
															<MC.IconButton size="small" style={{ cursor: "default" }}>
																<GetAppIcon fontSize={"small"} />
															</MC.IconButton>
															<MC.Link href={file.fileUrl} target="_blank" download style={{ color: "#333333" }}>
																{file.fileOriginalName} ({filesize(file.fileSize)})
															</MC.Link>
														</MC.Typography>
													</MC.Grid>
												))
											}
										</MC.Grid>
									}

								</MC.Grid>
							)
					}
				</>
			}
		</>
	);
};

export default PreCheckDefect;
