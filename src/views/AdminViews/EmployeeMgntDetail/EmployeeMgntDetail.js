import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { employeeMgntRepository }            from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { EmployeeMgntDetailForm }            from "./components";

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

const EmployeeMgntDetail = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("employeeMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `직원 관리`,
			href:  `${rootUrl}/employeeMgnt`
		},
		{
			title: `직원 관리 상세`,
			href:  `${rootUrl}/employeeMgnt${id ? "/" + id : ""}`
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
	
	// 직원 관리 정보
	const [employeeMgnt, setEmployeeMgnt] = useState({});
	
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
						title: `직원 관리`,
						href:  `${rootUrl}/employeeMgnt`
					},
					{
						title: `직원 관리 상세`,
						href:  `${rootUrl}/employeeMgnt${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getEmployeeMgnt(id);
			}
		};
		
		setTimeout(async () => {
			await init();
		});
	}, [id]);
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	const getEmployeeMgnt = async (id) => {
		employeeMgntRepository
			.getEmployeeMgnt(id, {
				aptId: AptComplexStore.aptComplex.id
			})
			.then(result => {
				dataBinding(result);
				setLoading(false);
			});
	};
	
	const dataBinding = (obj) => {
		setEmployeeMgnt(prev => {
			return {
				...prev,
				aptId: AptComplexStore.aptComplex.id,
				
				id:                 obj ? obj.id : "",
				name:               obj ? obj.name : "",
				phoneNumber:        obj ? obj.phoneNumber : "",
				callNumber:         obj ? obj.callNumber : "",
				baseDateDataType:   obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				aptComplex:         obj ? obj.aptComplex : {},
				department:         obj ? obj.department : {},
				departmentId:       obj ? obj.department.id : "",
				officialPosition:   obj ? obj.officialPosition : "",
				officialPositionId: obj ? obj.officialPosition.id : ""
			};
		});
	};
	
	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"직원 정보 삭제",
			"직원 정보에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 직원 정보를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				employeeMgntRepository
					.removeEmployeeMgnt(id, { aptId: AptComplexStore.aptComplex.id })
					.then(result => {
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"직원 정보를 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/employeeMgnt`);
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
	
	const handleEdit = () => {
		history.push(`${rootUrl}/employeeMgnt/edit/${id}`);
	};
	
	const handleGoBack = () => {
		history.push(`${rootUrl}/employeeMgnt`);
	};
	
	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>
							
							<MC.Typography variant="h2" gutterBottom>
								직원 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />
							
							<MC.Paper elevation={2} className={classes.paper}>
								
								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>
									
									<MC.Grid item xs={12} md={12}>
										<EmployeeMgntDetailForm
											employeeMgnt={employeeMgnt}
											setEmployeeMgnt={setEmployeeMgnt} />
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

export default inject("SignInStore", "AptComplexStore")(observer(EmployeeMgntDetail));
