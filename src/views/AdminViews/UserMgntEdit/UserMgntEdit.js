import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                                                                        from "../../../theme/adminTheme/palette";
import {
	aoPositionRepository,
	autonomousOrganizationRepository,
	resrvHistRepository,
	userMgntRepository
} from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }                                          from "../../../components";
import { UserMgntEditForm }                                                           from "./components";

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

const UserMgntEdit = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("userMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `입주민 관리`,
			href:  `${rootUrl}/userMgnt`
		},
		{
			title: `입주민 관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/userMgnt/edit${id ? "/" + id : ""}`
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

	// 입주민 관리 정보
	const [userMgnt, setUserMgnt] = useState({});
	const [errors, setErrors] = useState({
		isBuilding:    false,
		isUnit:        false,
		isPhoneNumber: false,
		isAOPosition:  false,
		isHouseHolder: false
	});

	const [aoList, setAOList] = useState([]);
	const [aoPositions, setAOPositions] = useState([]);

	const [dongList, setDongList] = useState([]); // 동 Dropdown 리스트
	const [hoList, setHoList] = useState([]); // 호 Dropdown 리스트

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
						title: `입주민 관리`,
						href:  `${rootUrl}/userMgnt`
					},
					{
						title: `입주민 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/userMgnt/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getUserMgnt(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
			await getAOList();
			await getDongNumList();
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

	const getUserMgnt = async (id) => {
		userMgntRepository
			.getUserMgnt(id, {
				aptId: AptComplexStore.aptComplex.id
			})
			.then(result => {
				dataBinding(result);
				setLoading(false);
				// 호 Number 매핑
				getHoNumList(result.userDataType.building);
			});
	};

	const getUserMgntsByBuildingAndUnit = async (building, unit) => {
		return userMgntRepository
			.getUserMgntsByBuildingAndUnit({
				aptId:    AptComplexStore.aptComplex.id,
				building: building,
				unit:     unit
			});
	};

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (동)
	const getDongNumList = () => {
		resrvHistRepository.getDongSearch({}, "donghosearch/dong")
			.then(result => {
				setDongList(result.data_json_array)
			})
	}
	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (호)
	const getHoNumList = (dongNumb) => {
		resrvHistRepository.getHoSearch({}, `donghosearch/ho/${dongNumb}`)
			.then(result => {
				setHoList(result.data_json_array)
			})
	}

	const dataBinding = (obj) => {
		setUserMgnt(prev => {
			return {
				...prev,
				aptId:                  AptComplexStore.aptComplex.id,
				accountType:            obj ? obj.accountType : "",
				aptComplex:             obj ? obj.aptComplex : {},
				baseDateDataType:       obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				},
				id:                     obj ? obj.id : "",
				name:                   obj ? obj.name : "",
				phoneNumber:            obj ? obj.phoneNumber : "",
				rankType:               obj ? obj.rankType : "",
				userDataType:           obj ? obj.userDataType : {},
				userId:                 obj ? obj.userId : "",
				autonomousOrganization: obj ? obj.autonomousOrganization : {},
				aoPosition:             obj ? obj.aoPosition : {}
			};
		});
		obj && obj.autonomousOrganization && getAOPositions(obj.autonomousOrganization.id);
	};

	const updateUserMgnt = () => {
		userMgntRepository
			.updateUserMgnt(
				id,
				{
					...userMgnt,
					phoneNumber: userMgnt.phoneNumber.replaceAll("-", "")
				})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"입주민 수정 완료",
					userMgnt.name + " 입주민 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/userMgnt/${id}`);
					},
					undefined
				);
			});
	};

	const handleEdit = () => {

		if (!( userMgnt.userDataType.building === "" || userMgnt.userDataType.unit === "" || userMgnt.phoneNumber === "" ||
			!!((userMgnt.autonomousOrganization && userMgnt.autonomousOrganization.id !== 0) && userMgnt.aoPosition.id === 0)
			)) {
			if ( isEdit ) {
				// 수정
				if ( userMgnt.autonomousOrganization && userMgnt.autonomousOrganization.id === 0 ) {
					delete userMgnt.autonomousOrganization;
					delete userMgnt.aoPosition;
				}

				if ( userMgnt.userDataType.houseHolderType === "HOUSEHOLD_OWNER" ) {
					getUserMgntsByBuildingAndUnit(userMgnt.userDataType.building, userMgnt.userDataType.unit)
						.then(result => {
							if ( result.id && result.id !== userMgnt.id) {
								setErrors(prev => {
									return {
										...prev,
										isHouseHolder: true
									};
								});
								handleAlertToggle(
									"isOpen",
									"입주민 수정 불가(세대주)",
									"해당 동호수에서 이미 세대주가 있습니다. \n다시 확인하시고 수정 해주세요.",
									() => {
										setAlertOpens({ ...alertOpens, isOpen: false });
									},
									undefined
								);
							} else {
								updateUserMgnt();
							}
						});
				} else {
					setErrors(prev => {
						return {
							...prev,
							isHouseHolder: false
						};
					});
					updateUserMgnt();
				}
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isBuilding:    userMgnt.userDataType.building === "",
					isUnit:        userMgnt.userDataType.unit === "",
					isPhoneNumber: userMgnt.phoneNumber === "",
					isAOPosition:  !!((userMgnt.autonomousOrganization && userMgnt.autonomousOrganization.id !== 0) && userMgnt.aoPosition.id === 0)
				};
			});
		}
	};

	const handleGoBack = () => {
		history.goBack();
	};

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

	const getAOPositions = async (aoId) => {
		let searchParams = {
			autonomousOrganizationId: aoId
		};
		const aoPositions = await aoPositionRepository.getAOPositions(searchParams);
		const sort = (a, b) => a.aoPosition.sequence - b.aoPosition.sequence;
		setAOPositions(aoPositions.sort(sort));
	};

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>

							<MC.Typography variant="h2" gutterBottom>
								입주민&nbsp;
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
										<UserMgntEditForm
											userMgnt={userMgnt}
											setUserMgnt={setUserMgnt}
											aoList={aoList}
											aoPositions={aoPositions}
											setAOPositions={setAOPositions}
											getAOPositions={getAOPositions}
											errors={errors}
											setErrors={setErrors}
											dongList={dongList}
											hoList={hoList}
											getHoNumList={getHoNumList}
										/>
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

export default inject("SignInStore", "AptComplexStore")(observer(UserMgntEdit));
