import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                                                                      from "../../../theme/adminTheme/palette";
import { departmentRepository, employeeMgntRepository, officialPositionRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                                        from "../../../components";
import { EmployeeMgntEditForm }                                                     from "./components";
import moment                                                                       from "moment";

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

const EmployeeMgntEdit = props => {
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
			title: `직원 관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/employeeMgnt/edit${id ? "/" + id : ""}`
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
	
	// 직원 관리 정보
	const [employeeMgnt, setEmployeeMgnt] = useState({});
	const [departments, setDepartments] = useState([]);
	const [officialPositions, setOfficialPositions] = useState([]);
	const [errors, setErrors] = useState({
		isDepartment:       false,
		isOfficialPosition: false,
		isName:             false,
		isPhoneNumber:      false
	});
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const init = async () => {
			await getDepartments();
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
						title: `직원 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/employeeMgnt/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getEmployeeMgnt(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};
		
		setTimeout(async () => {
			await init();
		});
	}, [id]);
	
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
	
	const getDepartments = async () => {
		const departments = await departmentRepository.getDepartments({
			aptId: AptComplexStore.aptComplex.id
		});
		const sort = (a, b) => a.sequence - b.sequence;
		setDepartments(departments.sort(sort));
	};
	
	const getOfficialPositions = async (departmentId) => {
		let findOfficialPositions = await officialPositionRepository
			.getOfficialPositions({
				departmentId: departmentId
			});
		
		setOfficialPositions(findOfficialPositions);
	};
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	const dataBinding = (obj) => {
		
		obj && getOfficialPositions(obj.department.id);
		
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
	
	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);
	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}
		
		return date;
	};
	
	const updateEmployeeMgnt = () => {
		employeeMgntRepository
			.updateEmployeeMgnt(
				id,
				{
					...employeeMgnt,
					phoneNumber: employeeMgnt.phoneNumber.replaceAll("-", ""),
					callNumber:  employeeMgnt.callNumber.replaceAll("-", "")
				})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"직원 수정 완료",
					"직원 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/employeeMgnt/${id}`);
					},
					undefined
				);
			});
	};
	
	const saveEmployeeMgnt = () => {
		employeeMgntRepository.saveEmployeeMgnt({
			...employeeMgnt,
			phoneNumber: employeeMgnt.phoneNumber.replaceAll("-", ""),
			callNumber:  employeeMgnt.callNumber.replaceAll("-", "")
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"직원 생성 완료",
				"직원 생성이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/employeeMgnt/${result.id}`);
				},
				undefined
			);
		});
	};
	
	const handleEdit = () => {
		
		setErrors(prev => {
			return {
				...prev,
				isDepartment:       false,
				isOfficialPosition: false,
				isName:             false,
				isPhoneNumber:      false
			};
		});
		
		if (
			!(
				employeeMgnt.departmentId === "" || employeeMgnt.departmentId === "total" ||
				employeeMgnt.officialPositionId === "" || employeeMgnt.officialPositionId === "total" ||
				employeeMgnt.name === "" ||
				employeeMgnt.phoneNumber === ""
			)
		) {
			if ( isEdit ) {
				// 수정
				updateEmployeeMgnt();
			} else {
				// 등록
				saveEmployeeMgnt();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isDepartment:       employeeMgnt.departmentId === "" || employeeMgnt.departmentId === "total",
					isOfficialPosition: employeeMgnt.officialPositionId === "" || employeeMgnt.officialPositionId === "total",
					isName:             employeeMgnt.name === "",
					isPhoneNumber:      employeeMgnt.phoneNumber === ""
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
								직원&nbsp;
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
										<EmployeeMgntEditForm
											isEdit={isEdit}
											employeeMgnt={employeeMgnt}
											setEmployeeMgnt={setEmployeeMgnt}
											departments={departments}
											officialPositions={officialPositions}
											setOfficialPositions={setOfficialPositions}
											getOfficialPositions={getOfficialPositions}
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

export default inject("SignInStore", "AptComplexStore")(observer(EmployeeMgntEdit));
