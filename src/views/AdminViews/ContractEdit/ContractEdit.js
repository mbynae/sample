import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                                        from "../../../theme/adminTheme/palette";
import { contractRepository, contractTypeRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }          from "../../../components";
import { ContractEditForm }                           from "./components";
import moment                                         from "moment";

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

const ContractEdit = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("contract");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `계약서 관리`,
			href:  `${rootUrl}/contract`
		},
		{
			title: `계약서 관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/contract/edit${id ? "/" + id : ""}`
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
	
	// 계약 관리 정보
	const [contract, setContract] = useState({});
	const [contractTypes, setContractTypes] = useState([]);
	const [attachFiles, setAttachFiles] = useState([]);
	const [errors, setErrors] = useState({
		isContractTypeKind: false,
		isContractType:     false,
		isCompanyName:      false,
		isCompanyAddress:   false,
		isPrice:            false
	});
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const init = async () => {
			await getContractTypes();
			let rootUrl = generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `계약서 관리`,
						href:  `${rootUrl}/contract`
					},
					{
						title: `계약서 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/contract/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getContract(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};
		
		setTimeout(async () => {
			await init();
		});
	}, [id]);
	
	const getContract = async (id) => {
		contractRepository
			.getContract(id, {
				aptId: AptComplexStore.aptComplex.id
			})
			.then(result => {
				dataBinding(result);
				setLoading(false);
			});
	};
	
	const getContractTypes = async () => {
		const contractTypes = await contractTypeRepository.getContractTypes({
			aptId: AptComplexStore.aptComplex.id
		});
		const sort = (a, b) => a.sequence - b.sequence;
		setContractTypes(contractTypes.sort(sort));
	};
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	const dataBinding = (obj) => {
		setContract(prev => {
			return {
				...prev,
				aptId:               AptComplexStore.aptComplex.id,
				id:                  obj ? obj.id : "",
				attachmentDataTypes: obj ? obj.attachmentDataTypes : [],
				price:               obj ? obj.price : "",
				contractStartDate:   obj ? obj.contractStartDate : dateInit(true),
				contractEndDate:     obj ? obj.contractEndDate : dateInit(false),
				contractTypeKind:    obj ? obj.contractTypeKind : "",
				baseDateDataType:    obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				chargeName:          obj ? obj.chargeName : "",
				chargeCallNumber:    obj ? obj.chargeCallNumber : "",
				callNumber:          obj ? obj.callNumber : "",
				memo:                obj ? obj.memo : "",
				companyName:         obj ? obj.companyName : "",
				companyAddress:      obj ? obj.companyAddress : "",
				contractType:        obj ? obj.contractType : {},
				contractTypeId:      obj ? obj.contractType.id : "",
				aptComplex:          obj ? obj.aptComplex : {}
			};
		});
	};
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 12);
		}
		
		return date;
	};
	
	const updateContract = () => {
		contractRepository
			.updateContract(
				id,
				{
					...contract,
					chargeCallNumber: contract.chargeCallNumber.replaceAll("-", ""),
					callNumber:       contract.callNumber.replaceAll("-", ""),
					files:            attachFiles
				})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"계약 수정 완료",
					"계약 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/contract/${id}`);
					},
					undefined
				);
			});
	};
	
	const saveContract = () => {
		contractRepository.saveContract({
			...contract,
			chargeCallNumber: contract.chargeCallNumber.replaceAll("-", ""),
			callNumber:       contract.callNumber.replaceAll("-", ""),
			files:            attachFiles
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"계약 생성 완료",
				"계약 생성이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/contract/${result.id}`);
				},
				undefined
			);
		});
	};
	
	const handleEdit = () => {
		
		setErrors(prev => {
			return {
				...prev,
				isContractTypeKind: false,
				isContractType:     false,
				isCompanyName:      false,
				isCompanyAddress:   false,
				isPrice:            false
			};
		});
		
		if (
			!(
				contract.contractTypeKind === "" ||
				contract.contractTypeId === "" ||
				contract.companyName === "" ||
				contract.companyAddress === "" ||
				contract.price === ""
			)
		) {
			if ( isEdit ) {
				// 수정
				updateContract();
			} else {
				// 등록
				saveContract();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isContractTypeKind: contract.contractTypeKind === "",
					isContractType:     contract.contractTypeId === "",
					isCompanyName:      contract.companyName === "",
					isCompanyAddress:   contract.companyAddress === "",
					isPrice:            contract.price === ""
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
								계약&nbsp;
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
										<ContractEditForm
											isEdit={isEdit}
											contract={contract}
											setContract={setContract}
											contractTypes={contractTypes}
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

export default inject("SignInStore", "AptComplexStore")(observer(ContractEdit));
