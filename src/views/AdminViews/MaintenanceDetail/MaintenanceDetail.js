import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { maintenanceRepository }             from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { MaintenanceDetailForm }             from "./components";

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

const MaintenanceDetail = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("maintenance");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `시설물 안전관리`,
			href:  `${rootUrl}/maintenance`
		},
		{
			title: `시설물 안전관리 상세`,
			href:  `${rootUrl}/maintenance${id ? "/" + id : ""}`
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
	
	// 시설물 안전관리 관리 정보
	const [maintenance, setMaintenance] = useState({});
	
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
						title: `시설물 안전관리`,
						href:  `${rootUrl}/maintenance`
					},
					{
						title: `시설물 안전관리 상세`,
						href:  `${rootUrl}/maintenance${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getMaintenance(id);
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
	
	const getMaintenance = async (id) => {
		maintenanceRepository
			.getMaintenance(id, {
				aptId: AptComplexStore.aptComplex.id
			})
			.then(result => {
				dataBinding(result);
				setLoading(false);
			});
	};
	
	const dataBinding = (obj) => {
		setMaintenance(prev => {
			return {
				...prev,
				aptId:                AptComplexStore.aptComplex.id,
				id:                   obj ? obj.id : "",
				maintenanceTitle:     obj ? obj.maintenanceTitle : "",
				contractCompany:      obj ? obj.contractCompany : {},
				contractCompanyId:    obj ? obj.contractCompany.id : "",
				maintenanceType:      obj ? obj.maintenanceType : {},
				maintenanceTypeId:    obj ? obj.maintenanceType.id : "",
				attachmentDataTypes:  obj ? obj.attachmentDataTypes : [],
				maintenanceStartDate: obj ? obj.maintenanceStartDate : dateInit(true),
				maintenanceEndDate:   obj ? obj.maintenanceEndDate : dateInit(false),
				inspectionStartDate:  obj ? obj.inspectionStartDate : dateInit(true),
				inspectionEndDate:    obj ? obj.inspectionEndDate : dateInit(false),
				baseDateDataType:     obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				aptComplex:           obj ? obj.aptComplex : {}
			};
		});
	};
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}
		
		return date;
	};
	
	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"시설물 안전관리 정보 삭제",
			"시설물 안전관리 정보에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 시설물 안전관리 정보를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				maintenanceRepository
					.removeMaintenance(id, { aptId: AptComplexStore.aptComplex.id })
					.then(result => {
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"시설물 안전관리 정보를 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/maintenance`);
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
		history.push(`${rootUrl}/maintenance/edit/${id}`);
	};
	
	const handleGoBack = () => {
		history.push(`${rootUrl}/maintenance`);
	};
	
	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>
							
							<MC.Typography variant="h2" gutterBottom>
								시설물 안전관리 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />
							
							<MC.Paper elevation={2} className={classes.paper}>
								
								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>
									
									<MC.Grid item xs={12} md={12}>
										<MaintenanceDetailForm
											maintenance={maintenance}
											setMaintenance={setMaintenance} />
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

export default inject("SignInStore", "AptComplexStore")(observer(MaintenanceDetail));
