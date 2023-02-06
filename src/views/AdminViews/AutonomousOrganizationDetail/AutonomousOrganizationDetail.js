import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import update                         from "immutability-helper";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { autonomousOrganizationRepository, aoPositionRepository, categoryRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                                          from "../../../components";
import { AOPositionDialog, AutonomousOrganizationDetailForm }                         from "./components";

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

const AutonomousOrganizationDetail = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("autonomousOrganization");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `자치기구 관리`,
			href:  `${rootUrl}/autonomousOrganization`
		},
		{
			title: `자치기구 관리 상세`,
			href:  `${rootUrl}/autonomousOrganization${id ? "/" + id : ""}`
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
	
	// 자치기구 관리 정보
	const [aoList, setAOList] = useState([]);
	const [autonomousOrganization, setAutonomousOrganization] = useState({});
	const [aoPositions, setAOPositions] = useState([]);
	const [aoPositionOpen, setAOPositionOpen] = useState(false);
	
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
						title: `자치기구 관리`,
						href:  `${rootUrl}/autonomousOrganization`
					},
					{
						title: `자치기구 관리 상세`,
						href:  `${rootUrl}/autonomousOrganization${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getAutonomousOrganization(id);
			}
			await getAOList();
			await getAOPositions();
		};
		
		setTimeout(async () => {
			await init();
		});
	}, [id]);
	
	const getAOList = async () => {
		let autonomousOrganizationSearch = {
			aptId: AptComplexStore.aptComplex.id
		};
		let findAutonomousOrganizations = await autonomousOrganizationRepository
			.getAutonomousOrganizations({
				...autonomousOrganizationSearch,
				direction: "ASC",
				page:      0,
				size:      100000,
				sort:      "sequence"
			});
		
		setAOList(findAutonomousOrganizations.content);
	};
	
	const getAutonomousOrganization = async (id) => {
		autonomousOrganizationRepository
			.getAutonomousOrganization(id, {
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
		setAutonomousOrganization(prev => {
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
	
	const handleEdit = () => {
		history.push(`${rootUrl}/autonomousOrganizations/edit/${id}`);
	};
	
	const handleGoBack = () => {
		history.push(`${rootUrl}/autonomousOrganizations`);
	};
	
	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"자치기구 삭제",
			"자치기구에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 자치기구를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				autonomousOrganizationRepository
					.removeAutonomousOrganization(id, { aptId: AptComplexStore.aptComplex.id })
					.then(() => {
						let fIndex = aoList.findIndex(ao => ao.id === id * 1);
						setAOList(prev => {
							prev = update(aoList, {
								$splice: [
									[fIndex, 1]
								]
							});
							prev.map(async (ao, index) => {
								ao.sequence = index + 1;
								await autonomousOrganizationRepository
									.updateAutonomousOrganization(
										ao.id,
										{
											...ao,
											aptId: AptComplexStore.aptComplex.id
										});
							});
							return [
								...prev
							];
						});
						
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"자치기구를 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/autonomousOrganizations`);
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
	
	const sort = (a, b) => a.aoPosition.sequence - b.aoPosition.sequence;
	
	const getAOPositions = async () => {
		let searchParams = {
			autonomousOrganizationId: id
		};
		const aoPositions = await aoPositionRepository.getAOPositions(searchParams);
		setAOPositions(aoPositions.sort(sort));
	};
	
	const handleClickOpen = () => {
		setAOPositionOpen(true);
	};
	
	const handleClickClose = () => {
		setAOPositionOpen(false);
	};
	
	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>
							
							<MC.Typography variant="h2" gutterBottom>
								자치기구 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />
							
							<MC.Paper elevation={2} className={classes.paper}>
								
								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>
									
									<MC.Grid item xs={12} md={12}>
										<AutonomousOrganizationDetailForm
											autonomousOrganization={autonomousOrganization}
											setAutonomousOrganization={setAutonomousOrganization}
											aoPositions={aoPositions} />
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
											<MC.Button onClick={handleClickOpen}>
												직책관리
											</MC.Button>
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
			
			<AOPositionDialog
				aoPositions={aoPositions}
				setAOPositions={setAOPositions}
				autonomousOrganizationId={id}
				getAOPositions={getAOPositions}
				open={aoPositionOpen}
				onClose={handleClickClose}
			/>
			
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

export default inject("SignInStore", "AptComplexStore")(observer(AutonomousOrganizationDetail));
