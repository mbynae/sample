import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { managementFeeItemRepository, managementFeeRepository, userMgntRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                                        from "../../../components";
import { ManagementFeeEditForm }                                                    from "./components";

import "moment/locale/ko";

moment.locale("ko");

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

const ManagementFeeEdit = props => {
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
			title: `관리비 관리 ${id ? "수정" : "등록"}`,
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
	
	// 관리비 관리 정보
	const [managementFee, setManagementFee] = useState({});
	const [datasheetGrid, setDatasheetGrid] = useState([]);
	const [managementFeeItems, setManagementFeeItems] = useState([]);
	const [attachFile, setAttachFile] = useState();
	const [errors, setErrors] = useState({
		isTitle:     false,
		isYearMonth: false
	});
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const init = async () => {
			let rootUrl = generateRootUrl();
			await getManagementFeeItems();
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
						title: `관리비 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/${menuKey}/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getManagementFee(id);
			} else {
				setLoading(false);
				dataBinding(undefined, await getManagementFeeItems());
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
		
		if ( obj ) {
			bindingToExcelSheet(obj, mfi);
		}
		
	};
	
	const bindingToExcelSheet = (obj, mfi) => {
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
	
	const updateManagementFee = () => {
		let tempManagementFee = managementFee;
		tempManagementFee.managementFeeInfos = [];
		bindingParams(tempManagementFee);
		let tempDate = moment(tempManagementFee.billingYearMonth);
		let firstDate = new Date(tempDate.year(), tempDate.month(), 1);
		let lastDate = new Date(tempDate.year(), tempDate.month() + 1, 0);
		
		getDuplicate(firstDate, lastDate)
			.then(result => {
				if ( result.id ) {
					if ( result.id * 1 !== id * 1 ) {
						setErrors(prev => {
							return {
								...prev,
								isYearMonth: true
							};
						});
						handleAlertToggle(
							"isOpen",
							"관리비 수정 불가(청구년월)",
							"해당 청구년월에 이미 관리비가 있습니다. \n다시 확인하시고 수정 해주세요.",
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
							},
							undefined
						);
					} else {
						setErrors(prev => {
							return {
								...prev,
								isYearMonth: false
							};
						});
						managementFeeRepository
							.updateManagementFee(
								id,
								{
									...tempManagementFee,
									file: attachFile
								})
							.then(result => {
								handleAlertToggle(
									"isOpen",
									"관리비 수정 완료",
									managementFee.title + " 관리비 수정이 완료 되었습니다.",
									() => {
										setAlertOpens({ ...alertOpens, isOpen: false });
										history.push(`${rootUrl}/${menuKey}/${id}`);
									},
									undefined
								);
							});
					}
				}
			});
		
	};
	
	const saveManagementFee = async () => {
		let tempManagementFee = managementFee;
		bindingParams(tempManagementFee);
		let tempDate = moment(tempManagementFee.billingYearMonth);
		let firstDate = new Date(tempDate.year(), tempDate.month(), 1);
		let lastDate = new Date(tempDate.year(), tempDate.month() + 1, 0);
		getDuplicate(firstDate, lastDate)
			.then(result => {
				if ( result.id ) {
					setErrors(prev => {
						return {
							...prev,
							isYearMonth: true
						};
					});
					handleAlertToggle(
						"isOpen",
						"관리비 등록 불가(청구년월)",
						"해당 청구년월에 이미 관리비가 있습니다. \n다시 확인하시고 등록 해주세요.",
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
						},
						undefined
					);
				} else {
					setErrors(prev => {
						return {
							...prev,
							isYearMonth: false
						};
					});
					managementFeeRepository.saveManagementFee({
						...tempManagementFee,
						file: attachFile
					}).then(async result => {
						handleAlertToggle(
							"isOpen",
							"관리비 생성 완료",
							managementFee.title + " 관리비 생성이 완료 되었습니다.",
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
								history.push(`${rootUrl}/${menuKey}/${result.id}`);
							},
							undefined
						);
					});
				}
			});
	};
	
	const bindingParams = (tempManagementFee) => {
		datasheetGrid.map(async (row, rowIndex) => {
			if ( rowIndex === 0 ) {
				if ( managementFeeItems.length === 0 ) {
					row.map(async (managementFeeItem, index) => {
						await saveManagementFeeItems(managementFeeItem.value, index);
					});
				} else {
					if ( managementFeeItems.length < row.length ) {
						for ( let i = managementFeeItems.length; i < row.length; i++ ) {
							await saveManagementFeeItems(row[i].value, i);
						}
					}
				}
			} else {
				let managementFeeInfoRequest = {
					building:                   row[1].value,
					unit:                       row[2].value,
					managementFeeInfoDataTypes: []
				};
				row.map((managementFeeInfoDataType, index) => {
					managementFeeInfoRequest.managementFeeInfoDataTypes.push({
						position: index,
						data:     managementFeeInfoDataType.value
					});
				});
				tempManagementFee.managementFeeInfos.push(managementFeeInfoRequest);
			}
		});
	};
	
	const saveManagementFeeItems = async (title, position) => {
		await managementFeeItemRepository.saveManagementFeeItem({
			aptId:    AptComplexStore.aptComplex.id,
			title:    title,
			position: position
		});
	};
	
	const getDuplicate = (startDate, endDate) => {
		return managementFeeRepository
			.getDuplicate({
				aptId: AptComplexStore.aptComplex.id,
				startDate: startDate,
				endDate:   endDate
			});
	};
	
	const handleEdit = () => {
		
		if (
			!(
				managementFee.title === ""
			)
		) {
			if ( isEdit ) {
				// 수정
				updateManagementFee();
			} else {
				// 등록
				saveManagementFee();
			}
		}
		setErrors(prev => {
			return {
				...prev,
				isTitle: managementFee.title === ""
			};
		});
	};
	
	const handleGoBack = () => {
		history.goBack();
	};
	
	return (
		<div className={classes.root}>
			{
				!loading ? (
						<>
							<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
							<div className={classes.content}>
								
								<MC.Typography variant="h2" gutterBottom>
									관리비&nbsp;
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
											<ManagementFeeEditForm
												isEdit={isEdit}
												managementFee={managementFee}
												setManagementFee={setManagementFee}
												attachFile={attachFile}
												setAttachFile={setAttachFile}
												datasheetGrid={datasheetGrid}
												setDatasheetGrid={setDatasheetGrid}
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

export default inject("SignInStore", "AptComplexStore")(observer(ManagementFeeEdit));
