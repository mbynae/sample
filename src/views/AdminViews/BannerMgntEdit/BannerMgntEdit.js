import React, { useEffect, useState }        from "react";
import { inject, observer }                  from "mobx-react";
import * as MS                               from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import {BannerEditForm}                      from "./components";
import * as MC                               from "@material-ui/core";
import palette                               from "../../../theme/adminTheme/palette";
import moment                                from "moment";
import { bannerRepository, commonCodeRepository }                  from "../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
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
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
}));

const BannerMgntEdit = props => {
	const classes = useStyles();
	const {SignInStore, AptComplexStore, match, history } = props;
	const {evnt_numb } = match.params;
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `게시판 관리 ${evnt_numb ? "수정" : "등록"}`,
			href:  `${rootUrl}/bannerMgntEdit${evnt_numb ? "/" + evnt_numb : ""}`
		}
	]);
	// 배너 정보
	const [bannerMgnt, setBannerMgnt] = useState({});
	const [bannerAttachFile, setBannerAttachFile] = useState();
	const [errors, setErrors] = useState({
		evnt_name:    	false
	});
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

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getBannerDetail = async () => {
		await bannerRepository.getBannerDetail(evnt_numb)
			.then(result => {
				dataBinding(result.data_json);
		})
	}

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();
			if(evnt_numb) {
				setIsEdit(true);
				await getBannerDetail();
			} else {
				dataBinding(undefined);
			}
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const dataBinding = (obj) => {
		setBannerMgnt(prev => {
			return {
				...prev,
				cmpx_numb:             	obj ? obj.cmpx_numb : "",
				prmt_code:              obj ? obj.prmt_code : "",
				prmt_type:              obj ? obj.prmt_type : "",
				prmt_clss:							obj ? obj.prmt_clss : getPrmtClss(),
				prmt_clss_name:					obj ? obj.prmt_clss_name : "",
				prmt_name:							obj ? obj.prmt_name : "",
				evnt_numb:            	obj ? obj.evnt_numb : "",
				evnt_name:							obj ? obj.evnt_name : "",
				evnt_strt_dttm:         obj ? obj.evnt_strt_dttm : dateInit(true),
				evnt_end_dttm:          obj ? obj.evnt_end_dttm : dateInit(false),
				evnt_type:              obj ? obj.evnt_type : "",
				disp_at:             		obj ? obj.disp_at : "Y",
				link:										obj ? obj.eventcntdata.link : "",
				attachedFile:						obj ? obj.imglist && obj.imglist.image_list[0] : ""
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

		return date.format('YYYY-MM-DD HH:mm:ss');
	};

	const getPrmtClss = () => {
		commonCodeRepository.getGrpCode("C290")
			.then(result => {
				setBannerMgnt(prev => {
					return {
						...prev,
						prmt_clss: result.data_json_array[0].commcode
					}
				})
			})

	}

	const handleGoBack = () => {
		history.goBack();
	};

	const handleEdit = () => {

		if(bannerMgnt.evnt_name !== "") {
			if ( isEdit ) {
				// 수정
				updateBanner();
			} else {
				// 등록
				saveBanner();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					evnt_name: bannerMgnt.evnt_name === ""
				};
			});
		}

	};

	const updateBanner = () => {
		bannerRepository.updateBanner(evnt_numb, bannerAttachFile,
			{
				evnt_name : bannerMgnt.evnt_name,
				evnt_strt_dttm : bannerMgnt.evnt_strt_dttm,
				evnt_end_dttm : bannerMgnt.evnt_end_dttm,
				link : bannerMgnt.link ? bannerMgnt.link : null ,
				disp_at : bannerMgnt.disp_at,
				attachedFile: bannerMgnt.attachedFile === null ? null : bannerMgnt.attachedFile.imag_seq
			}).then(result => {
			handleAlertToggle(
				"isOpen",
				"배너 수정",
				"배너수정을 완료하였습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/bannerMgnt`);
				},
				undefined
			);
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

	const saveBanner = () => {
		bannerRepository.createBanner(
			{
				evnt_name : bannerMgnt.evnt_name,
				evnt_strt_dttm : bannerMgnt.evnt_strt_dttm,
				evnt_end_dttm : bannerMgnt.evnt_end_dttm,
				disp_at : bannerMgnt.disp_at,
				link : bannerMgnt.link === "" ? null : bannerMgnt.link,
				prmt_clss: bannerMgnt.prmt_clss,
			}, bannerAttachFile).then(result => {
			handleAlertToggle(
				"isOpen",
				"배너 등록",
				"배너등록을 완료하였습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/bannerMgnt`);
				},
				undefined
			);
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

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

				<div className={classes.content}>
					<MC.Typography variant="h2" gutterBottom>
						배너 &nbsp;
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
							<BannerEditForm
								isEdit={isEdit}
								AptComplexStore={AptComplexStore}
								bannerMgnt={bannerMgnt}
								setBannerMgnt={setBannerMgnt}
								bannerAttachFile={bannerAttachFile}
								setBannerAttachFile={setBannerAttachFile}
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

export default inject("SignInStore", "AptComplexStore")(observer(BannerMgntEdit));
