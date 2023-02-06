import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import update                         from "immutability-helper";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { aoPositionRepository, documentFormRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }            from "../../../components";
import { DocumentFormDetailForm }                       from "./components";

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

const DocumentFormDetail = props => {
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
			title: `문서양식 관리 상세`,
			href:  `${rootUrl}/${menuKey}${id ? "/" + id : ""}`
		}
	]);
	
	const [loading, setLoading] = useState(true);
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
	const [documentForm, setDocumentForm] = useState({});
	
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
						title: `문서양식 관리 상세`,
						href:  `${rootUrl}/${menuKey}${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getDocumentForm(id);
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
				aptId: AptComplexStore.aptComplex.id,
				
				id:                  obj ? obj.id : "",
				aptComplex:          obj ? obj.aptComplex : "",
				title:               obj ? obj.title : "",
				baseDateDataType:    obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				attachmentDataTypes: obj ? obj.attachmentDataTypes : []
			};
		});
	};
	
	const handleEdit = () => {
		history.push(`${rootUrl}/${menuKey}/edit/${id}`);
	};
	
	const handleGoBack = () => {
		history.push(`${rootUrl}/${menuKey}`);
	};
	
	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"문서양식 삭제",
			"문서양식에 연결된 모든 데이터가 삭제 됩니다. \n 정말로 문서양식을 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				documentFormRepository
					.removeDocumentForm(id, { aptId: AptComplexStore.aptComplex.id })
					.then(() => {
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"문서양식을 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/${menuKey}`);
								setAlertOpens({ ...alertOpens, isOpen: false });
							}
						);
					});
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};
	
	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>
							
							<MC.Typography variant="h2" gutterBottom>
								문서양식 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />
							
							<MC.Paper elevation={2} className={classes.paper}>
								
								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>
									
									<MC.Grid item xs={12} md={12}>
										<DocumentFormDetailForm
											documentForm={documentForm}
											setDocumentForm={setDocumentForm} />
									</MC.Grid>
									
									<MC.Grid item xs={6} md={6}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											<MC.Button
												className={classes.errorButton}
												onClick={handleDelete}>
												삭제
											</MC.Button>
										</MC.ButtonGroup>
									</MC.Grid>
									
									<MC.Grid item xs={6} md={6}
									         className={classes.buttonLayoutRight}>
										<MC.ButtonGroup
											aria-label="text primary button group"
											size="large"
											style={{ marginTop: 12 }}
											color="primary">
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleGoBack}>
												목록보기
											</MC.Button>
											<MC.Button
												variant="outlined"
												color="primary"
												onClick={handleEdit}>
												수정
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

export default inject("SignInStore", "AptComplexStore")(observer(DocumentFormDetail));
