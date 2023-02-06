import React, {useState, useEffect}                               from "react";
import {inject, observer}                                         from "mobx-react";
import * as MC                                                    from "@material-ui/core";
import * as MS                                                    from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog, AlertDialogUserView } from "../../../components";
import {FacilityMgntEditForm}                                     from "./components";
import palette                                                    from "../../../theme/adminTheme/palette";
import { facilityIntroductionRepository }                         from "../../../repositories";
import { useLocation }                                            from "react-router-dom";

const useStyles = MS.makeStyles(theme => ({
	root: {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	paper:             {
		padding: theme.spacing(2)
	},
}));

const FacilityMgntEdit = props => {
	const classes = useStyles();

	const {SignInStore, AptComplexStore, match, history} = props;
	const location = useLocation();
	const {type} = match.params;

	const [rootUrl, setRootUrl] = useState("");
	const [isEdit, setIsEdit] = useState(false);
	const [fcltMgnt, setFcltMgnt] = useState({});
	const [fcltAttachFiles, setFcltAttachFiles] = useState([]);
	const [errors, setErrors] = useState({
		cnts_info: false,
		cnts_schd: false,
		cnts_amt: false,
		cnts_rfnd: false
	});

	const [breadcrumbs, setBreadcrumbs] = useState([                                                                                                                                          // 상단 gnb 레벨 표시
		{
			title: "관리자",
			href: `${rootUrl}/dashboard`
		},
		{
			title: `시설 관리`,
			href: `${rootUrl}/facilityMgnt`
		},
		{
			title: `등록`,
			href: `${rootUrl}/facilityMgnt/register`
		}
	]);

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

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			if(type === "edit") {
				setIsEdit(true);
				getFcltDetail(location.state.facility.fclt_numb);
			} else {
				dataBinding(undefined);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const dataBinding = (obj) => {
		setFcltMgnt(prev => {
			return {
				...prev,
				aptId:                  AptComplexStore.aptComplex.id,
				cnts_numb:							obj ? obj.detailinfo.cnts_numb : "",
				fclt_code: 							obj ? obj.detailinfo.fclt_code : "",
				cmpx_numb: 							obj ? obj.detailinfo.cmpx_numb : "",
				fclt_numb:							obj ? obj.detailinfo.fclt_numb : location.state.facility.fclt_numb,
				cnts_info: 						  obj ? obj.detailinfo.cnts_json.cnts_info : "",
				cnts_schd: 						  obj ? obj.detailinfo.cnts_json.cnts_schd : "",
				cnts_desc: 						  obj ? obj.detailinfo.cnts_json.cnts_desc : "",
				cnts_memo: 						  obj ? obj.detailinfo.cnts_json.cnts_memo : "",
				cnts_amt: 						  obj ? obj.detailinfo.cnts_json.cnts_amt : "",
				cnts_rfnd:							obj ? obj.detailinfo.cnts_json.cnts_rfnd: "",
				imag_numb:							obj ? obj.detailinfo.imag_numb : "",
				disp_sort:							obj ? obj.detailinfo.disp_sort : "",
				fclm_name:							obj ? obj.detailinfo.fclm_name : location.state.facility.fclm_name,
				worktype: 							type === "create" ? "IN" : "UP",
				attachedFiles:					obj ? obj.imagelist : []
			};
		});
	};

	const getFcltDetail = (fclt_numb) => {
		facilityIntroductionRepository.getFacilityDetail(fclt_numb)
			.then(result => {
				dataBinding(result);
			});
	}

	const handleGoBack = () => {
		history.goBack();
	};

	const handleEdit = () => {

		if(!(fcltMgnt.cnts_info === "" || fcltMgnt.cnts_schd === "" || fcltMgnt.cnts_amt === "" || fcltMgnt.cnts_rfnd === "")) {
			if ( isEdit ) {
				// 수정
				updateFacility();
			} else {
				// 등록
				saveFacility();
			}
		} else {
			// 입력 Field에 대한 Validation 적용 (Empty)
			setErrors(prev => {
				return {
					...prev,
					cnts_info: fcltMgnt.cnts_info === "",
					cnts_schd: fcltMgnt.cnts_schd === "",
					cnts_amt: fcltMgnt.cnts_amt === "",
					cnts_rfnd: fcltMgnt.cnts_rfnd === ""
				};
			});
		}

	};

	const updateFacility = () => {
		/*console.log("기존파일 갯수: " + fcltMgnt.attachedFiles.length);
		console.log("신규파일 갯수: " + fcltAttachFiles.length);
		console.log("신규파일: " + JSON.stringify(fcltAttachFiles));*/

		if( (fcltAttachFiles.length + fcltMgnt.attachedFiles.length) > 3) {	// 기존파일 갯수 + 신규파일 갯수의 합이 3이 넘을 경우
			handleAlertToggle(
				"isOpen",
				"파일 업로드 개수 제한",
				"이미지 파일은 최대 3개까지 업로드가 가능합니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					setFcltAttachFiles([]);
				},
				undefined
			)
		} else {
			facilityIntroductionRepository.updateFacility({
				fclt_numb: fcltMgnt.fclt_numb,
				fclm_name: fcltMgnt.fclm_name,
				cnts_info: fcltMgnt.cnts_info,
				cnts_schd: fcltMgnt.cnts_schd,
				cnts_amt:  fcltMgnt.cnts_amt,
				cnts_rfnd: fcltMgnt.cnts_rfnd,
				cnts_memo: fcltMgnt.cnts_memo,
				worktype:  fcltMgnt.worktype,
				files:	 	 fcltAttachFiles,
				imgseqlist: fcltMgnt.attachedFiles.map(file => (file.imag_seq))
			}).then(result => {
				if(result.msgcode === 1) {
					handleAlertToggle(
						"isOpen",
						"시설안내 수정",
						"시설안내 수정을 완료하였습니다.",
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							history.push(`${rootUrl}/facilityMgnt`);
						},
						undefined
					);
				} else {
					console.log(result.msg);
				}
			}).catch(e => {
				handleAlertToggle(
					"isOpen",
					e.msg,
					e.errormsg + "\n" + "errorcode: " + e.errorcode,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					},
					undefined
				);
			})
		}
	}

	const saveFacility = () => {

		if(fcltAttachFiles.length > 3) {
			handleAlertToggle(
				"isOpen",
				"파일 업로드 개수 제한",
				"이미지 파일은 최대 3개까지 업로드가 가능합니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					setFcltAttachFiles([]);
				},
				undefined
			)
		} else {
			facilityIntroductionRepository.createFacility({
				fclt_numb: fcltMgnt.fclt_numb,
				fclm_name: fcltMgnt.fclm_name,
				cnts_info: fcltMgnt.cnts_info,
				cnts_schd: fcltMgnt.cnts_schd,
				cnts_amt:  fcltMgnt.cnts_amt,
				cnts_rfnd: fcltMgnt.cnts_rfnd,
				cnts_memo: fcltMgnt.cnts_memo,
				worktype:  fcltMgnt.worktype,
				files:	 fcltAttachFiles
			}).then(result => {
				if(result.msgcode === 1) {
					handleAlertToggle(
						"isOpen",
						"시설안내 등록",
						"시설안내 등록을 완료하였습니다.",
						() => {
							setAlertOpens({ ...alertOpens, isOpen: false });
							history.push(`${rootUrl}/facilityMgnt`);
						},
						undefined
					);
				} else {
					console.log(result.msg);
				}
			}).catch(e => {
				handleAlertToggle(
					"isOpen",
					e.msg,
					e.errormsg + "\n" + "errorcode: " + e.errorcode,
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
					},
					undefined
				);
			})
		}
	}

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs}/>

			<div className={classes.content}>
				<MC.Typography variant="h2" gutterBottom>
					시설 &nbsp;
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
							<FacilityMgntEditForm
								SignInStore={SignInStore}
								AptComplexStore={AptComplexStore}
								history={history}
								fcltMgnt={fcltMgnt}
								setFcltMgnt={setFcltMgnt}
								fcltAttachFiles={fcltAttachFiles}
								setFcltAttachFiles={setFcltAttachFiles}
								alertOpens={alertOpens}
								setAlertOpens={setAlertOpens}
								handleAlertToggle={handleAlertToggle}
								isEdit={isEdit}
								errors={errors}
								setErrors={setErrors}
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
										isEdit ? "수정" : "등록"
									}
								</MC.Button>
							</MC.ButtonGroup>
						</MC.Grid>
					</MC.Grid>
				</MC.Paper>
			</div>

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

export default inject("SignInStore", "AptComplexStore")(observer(FacilityMgntEdit));
