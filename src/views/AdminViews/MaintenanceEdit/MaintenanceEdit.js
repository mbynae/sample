import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                                                                  from "../../../theme/adminTheme/palette";
import { contractRepository, maintenanceRepository, maintenanceTypeRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                                    from "../../../components";
import { MaintenanceEditForm }                                                  from "./components";
import moment                                                                   from "moment";

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
	}
}));

const MaintenanceEdit = props => {
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
			title: `시설물 안전관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/maintenance/edit${id ? "/" + id : ""}`
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

	// 시설물 안전관리 관리 정보
	const [maintenance, setMaintenance] = useState({});
	const [maintenanceTypes, setMaintenanceTypes] = useState([]);
	const [contracts, setContracts] = useState([]);
	const [attachFiles, setAttachFiles] = useState([]);
	const [errors, setErrors] = useState({
		isMaintenanceTitle: false
	});

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			await getMaintenanceTypes();
			await getContracts();
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
						title: `시설물 안전관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/maintenance/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getMaintenance(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

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

	const getContracts = async () => {
		let findContracts = await contractRepository.getContracts({
			aptId:     AptComplexStore.aptComplex.id,
			direction: "DESC",
			page:      0,
			size:      100000,
			sort:      "baseDateDataType.createDate"
		});

		setContracts(findContracts.content);
	};

	const getMaintenanceTypes = async () => {
		const maintenanceTypes = await maintenanceTypeRepository.getMaintenanceTypes({
			aptId: AptComplexStore.aptComplex.id
		});
		const sort = (a, b) => a.sequence - b.sequence;
		setMaintenanceTypes(maintenanceTypes.sort(sort));
	};

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
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
				inspectionStartDate:  obj ? obj.inspectionStartDate : dateInit(true),
				inspectionEndDate:    obj ? obj.inspectionEndDate : dateInit(false),
				maintenanceStartDate: obj ? (!!(obj.maintenanceStartDate) ? obj.maintenanceStartDate : dateInit(true)) : dateInit(true),
				maintenanceEndDate:   obj ? (!!(obj.maintenanceEndDate) ? obj.maintenanceEndDate : dateInit(false)) : dateInit(false),
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

	const updateMaintenance = () => {
		maintenanceRepository
			.updateMaintenance(
				id,
				{
					...maintenance,
					files: attachFiles
				})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"시설물 안전관리 수정 완료",
					"시설물 안전관리 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/maintenance/${id}`);
					},
					undefined
				);
			});
	};

	const saveMaintenance = () => {

		delete maintenance.maintenanceStartDate;
		delete maintenance.maintenanceEndDate;

		maintenanceRepository.saveMaintenance({
			...maintenance,
			files: attachFiles
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"시설물 안전관리 생성 완료",
				"시설물 안전관리 생성이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/maintenance/${result.id}`);
				},
				undefined
			);
		});
	};

	const handleEdit = () => {

		setErrors(prev => {
			return {
				...prev,
				isMaintenanceTitle: false
			};
		});

		if (
			!(
				maintenance.maintenanceTitle === ""
			)
		) {
			if ( isEdit ) {
				// 수정
				updateMaintenance();
			} else {
				// 등록
				saveMaintenance();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isMaintenanceTitle: maintenance.maintenanceTitle === ""
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
								시설물 안전관리&nbsp;
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
										<MaintenanceEditForm
											isEdit={isEdit}
											maintenance={maintenance}
											setMaintenance={setMaintenance}
											maintenanceTypes={maintenanceTypes}
											contracts={contracts}
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
												style={{
													color:                  palette.error.main,
													borderColor:            palette.error.main,
													marginLeft:             10,
													borderTopLeftRadius:    4,
													borderBottomLeftRadius: 4
												}}
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

export default inject("SignInStore", "AptComplexStore")(observer(MaintenanceEdit));
