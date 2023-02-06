import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { managementFeeItemRepository, managementFeeRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                    from "../../../components";
import { ManagementFeeDetailForm }                              from "./components";

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

const ManagementFeeDetail = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("managementFee");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `관리비 관리`,
			href:  `${rootUrl}/${menuKey}`
		},
		{
			title: `관리비 관리 상세`,
			href:  `${rootUrl}/${menuKey}/${id}`
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
	
	// 관리비 관리 정보
	const [managementFee, setManagementFee] = useState({});
	const [datasheetGrid, setDatasheetGrid] = useState([]);
	const [managementFeeItems, setManagementFeeItems] = useState([]);
	const [attachFile, setAttachFile] = useState();
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
						title: `관리비 관리`,
						href:  `${rootUrl}/${menuKey}`
					},
					{
						title: `관리비 관리 상세`,
						href:  `${rootUrl}/${menuKey}/${id}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getManagementFee(id);
			}
		};
		
		setTimeout(async () => {
			await init();
		});
	}, [id]);
	
	const getManagementFee = async (id) => {
		managementFeeRepository
			.getManagementFee(id, {
				aptId: AptComplexStore.aptComplex.id
			})
			.then(async result => {
				let mfi = await getManagementFeeItems();
				dataBinding(result, mfi);
				setLoading(false);
			});
	};
	
	const getManagementFeeItems = async () => {
		return await managementFeeItemRepository.getManagementFeeItems({ aptId: AptComplexStore.aptComplex.id });
	};
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	const dataBinding = (obj, mfi) => {
		setManagementFee(prev => {
			return {
				...prev,
				aptId:              AptComplexStore.aptComplex.id,
				id:                 obj ? obj.id : "",
				title:              obj ? obj.title : "",
				billingYearMonth:   obj ? obj.billingYearMonth : new Date(),
				managementFeeInfos: obj ? obj.managementFeeInfos : [],
				attachmentDataType: obj ? obj.attachmentDataType : {},
				aptComplex:         obj ? obj.aptComplex : {},
				baseDateDataType:   obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				}
			};
		});
		setManagementFeeItems(prev => {
			return [
				...mfi
			];
		});
		const sort = (a, b) => a.position - b.position;
		let beforeGrids = [];
		let headerRow = [];
		mfi.sort(sort).map(mf => {
			headerRow.push(mf.title);
		});
		obj.managementFeeInfos.map((mfinfo, index) => {
			if ( index === 0 ) {
				beforeGrids.push(headerRow);
			}
			let valueRow = [];
			mfinfo.managementFeeInfoDataTypes.sort(sort).map(data => {
				valueRow.push(data.data);
			});
			beforeGrids.push(valueRow);
		});
		convertToGrid(beforeGrids);
	};
	
	const convertToGrid = (beforeGrids) => {
		let grid = [];
		beforeGrids.map((beforeGrid, index) => {
			let row = [];
			beforeGrid.map(value => {
				let obj = {
					value:    value,
					readOnly: true, //index === 0,
					width:    150
				};
				row.push(obj);
			});
			grid.push(row);
		});
		setDatasheetGrid(grid);
	};
	
	const handleEdit = () => {
		history.push(`${rootUrl}/${menuKey}/edit/${id}`);
	};
	
	const handleGoBack = () => {
		history.push(`${rootUrl}/${menuKey}`);
	};
	
	const getManagementFees = () => {
		return managementFeeRepository.getManagementFees({
			aptId:     AptComplexStore.aptComplex.id,
			direction: "DESC",
			page:      0,
			size:      100000,
			sort:      "baseDateDataType.createDate"
		});
	};
	
	const removeManagementFeeItem = async (id) => {
		await managementFeeItemRepository.removeManagementFeeItem(
			id,
			{
				aptId: AptComplexStore.aptComplex.id
			});
	};
	
	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"관리비 삭제",
			"관리비 데이터에 연결된 모든 데이터가 삭제 됩니다. \n 정말로 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				getManagementFees()
					.then(result => {
						if ( result.total === 1 ) {
							managementFeeItems.map(mfi => {
								removeManagementFeeItem(mfi.id);
							});
						}
						managementFeeRepository
							.removeManagementFee(id, { aptId: AptComplexStore.aptComplex.id })
							.then(() => {
								handleAlertToggle(
									"isOpen",
									"삭제완료",
									"관리비 데이터를 삭제 하였습니다.",
									() => {
										history.push(`${rootUrl}/${menuKey}`);
										setAlertOpens({ ...alertOpens, isOpen: false });
									}
								);
							});
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
				!loading ? (
						<>
							<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
							<div className={classes.content}>
								
								<MC.Typography variant="h2" gutterBottom>
									관리비 상세
								</MC.Typography>
								<MC.Divider className={classes.divider} />
								
								<MC.Paper elevation={2} className={classes.paper}>
									
									<MC.Grid
										container
										spacing={2}
										justify={"space-between"}
										alignItems={"flex-start"}>
										
										<MC.Grid item xs={12} md={12}>
											<ManagementFeeDetailForm
												isEdit={isEdit}
												managementFee={managementFee}
												setManagementFee={setManagementFee}
												attachFile={attachFile}
												setAttachFile={setAttachFile}
												datasheetGrid={datasheetGrid}
												setDatasheetGrid={setDatasheetGrid}
												errors={errors} />
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
					:
					(
						<MC.CircularProgress color="secondary" />
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

export default inject("SignInStore", "AptComplexStore")(observer(ManagementFeeDetail));
