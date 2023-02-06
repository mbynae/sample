import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import update                         from "immutability-helper";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { documentFormRepository }            from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { DocumentFormEditForm }              from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	paper:             {
		padding: theme.spacing(2)
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	errorButton:       {
		color:                  theme.palette.error.main,
		borderColor:            theme.palette.error.main,
		marginLeft:             10,
		borderTopLeftRadius:    4,
		borderBottomLeftRadius: 4
	}
}));

const DocumentFormEdit = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("documentForm");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `문서양식 관리`,
			href:  `${rootUrl}/${menuKey}`
		},
		{
			title: `문서양식 관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/${menuKey}/edit${id ? "/" + id : ""}`
		}
	]);
	
	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};
	
	// 문서양식 관리 정보
	const [aoList, setAOList] = useState([]);
	const [documentForm, setDocumentForm] = useState({});
	const [attachFiles, setAttachFiles] = useState([]);
	const [errors, setErrors] = useState({
		isTitle: false
	});
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const init = async () => {
			let rootUrl = generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `문서양식 관리`,
						href:  `${rootUrl}/${menuKey}`
					},
					{
						title: `문서양식 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/${menuKey}/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getDocumentForm(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};
		
		setTimeout(async () => {
			await init();
		});
	}, [id]);
	
	const getDocumentForm = async (id) => {
		documentFormRepository
			.getDocumentForm(id, {
				aptId: AptComplexStore.aptComplex.id
			})
			.then(result => {
				dataBinding(result);
				setLoading(false);
			});
	};
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	const dataBinding = (obj) => {
		setDocumentForm(prev => {
			return {
				...prev,
				aptId:               AptComplexStore.aptComplex.id,
				id:                  obj ? obj.id : "",
				sequence:            obj ? obj.sequence : "",
				name:                obj ? obj.name : "",
				title:               obj ? obj.title : "",
				content:             obj ? obj.content : "",
				attachmentDataTypes: obj ? obj.attachmentDataTypes : [],
				aptComplex:          obj ? obj.aptComplex : {},
				aoPositions:         obj ? obj.aoPositions : "",
				baseDateDataType:    obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				}
			};
		});
	};
	
	const updateDocumentForm = () => {
		
		let fIndex = aoList.findIndex(ao => ao.id === id * 1);
		setAOList(prev => {
			prev = update(aoList, {
				$splice: [
					[fIndex, 1],
					[documentForm.sequence - 1, 0, documentForm]
				]
			});
			prev.map(async (ao, index) => {
				ao.sequence = index + 1;
				
				let obj = {
					...ao,
					aptId: AptComplexStore.aptComplex.id
				};
				
				if ( ao.id === id * 1 ) {
					obj.files = attachFiles;
				}
				
				await documentFormRepository
					.updateDocumentForm(ao.id, obj);
			});
			return [
				...prev
			];
		});
		
		handleAlertToggle(
			"isOpen",
			"문서양식 수정 완료",
			documentForm.title + " 문서양식 수정이 완료 되었습니다.",
			() => {
				setAlertOpens({ ...alertOpens, isOpen: false });
				history.push(`${rootUrl}/${menuKey}/${id}`);
			},
			undefined
		);
		
	};
	const sort = (a, b) => a.sequence - b.sequence;
	
	const saveDocumentForm = () => {
		documentFormRepository.saveDocumentForm({
			...documentForm,
			files: attachFiles
		}).then(async result => {
			handleAlertToggle(
				"isOpen",
				"문서양식 생성 완료",
				documentForm.title + " 문서양식 생성이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/${menuKey}/${result.id}`);
				},
				undefined
			);
		});
	};
	
	const handleEdit = () => {
		
		setErrors(prev => {
			return {
				...prev,
				isTitle: false
			};
		});
		
		if (
			!(
				documentForm.title === ""
			)
		) {
			if ( isEdit ) {
				// 수정
				updateDocumentForm();
			} else {
				// 등록
				saveDocumentForm();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isTitle: documentForm.title === ""
				};
			});
		}
	};
	
	const handleGoBack = () => {
		history.goBack();
	};
	
	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>
							
							<MC.Typography variant="h2" gutterBottom>
								문서양식&nbsp;
								{
									isEdit ? "수정" : "등록"
								}
							</MC.Typography>
							<MC.Divider className={classes.divider} />
							
							<MC.Paper elevation={2} className={classes.paper}>
								
								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>
									
									<MC.Grid item xs={12} md={12}>
										<DocumentFormEditForm
											isEdit={isEdit}
											aoList={aoList}
											documentForm={documentForm}
											setDocumentForm={setDocumentForm}
											attachFiles={attachFiles}
											setAttachFiles={setAttachFiles}
											errors={errors} />
									</MC.Grid>
									
									<MC.Grid item xs={12} md={12} className={classes.buttonLayoutRight}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											<MC.Button
												className={classes.errorButton}
												onClick={handleGoBack}>
												취소
											</MC.Button>
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleEdit}>
												{
													isEdit ? "저장" : "등록"
												}
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>
								</MC.Grid>
							</MC.Paper>
						</div>
					</>
				)
			}
			
			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>
			
			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>
		
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(DocumentFormEdit));
