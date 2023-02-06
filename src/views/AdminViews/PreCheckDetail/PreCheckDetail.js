import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                               from "../../../theme/adminTheme/palette";
import { preCheckDetailRepository }          from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { PreCheckDetailForm }                from "./components";

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

const PreCheckDetail = props => {
	const classes = useStyles();
	
	const { SignInStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("preCheck");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: "사전점검 관리",
			href:  `${rootUrl}/preCheck`
		},
		{
			title: "사전점검 관리 상세",
			href:  `${rootUrl}/preCheck/${id}`
		},
		
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
	
	// 사전점검 정보
	const [preCheckDetail, setPreCheckDetail] = useState({});
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const getPreCheck = async (id) => {
			
			let rootUrl = await generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: "사전점검 관리",
						href:  `${rootUrl}/preCheck`
					},
					{
						title: "사전점검 관리 상세",
						href:  `${rootUrl}/preCheck/${id}`
					}
				];
				return [
					...prev
				];
			});
			
			preCheckDetailRepository
				.getPreCheckDetail(id)
				.then(result => {
					allInitialize(result);
					setLoading(false);
				});
		};
		
		setTimeout(async () => {
			if ( id ) {
				await getPreCheck(id);
			} else {
				setLoading(false);
				allInitialize(undefined);
			}
		}, 100);
	}, []);
	
	const allInitialize = (obj) => {
		setPreCheckDetail(prev => {
			return {
				...prev,
				id:               obj ? obj.id : "",
				isCheck:          obj ? obj.isCheck : "",
				preCheckDate:     obj ? obj.preCheckDate : "",
				preCheckDefects:  obj ? obj.preCheckDefects : [],
				preCheckTitle:    obj ? obj.preCheckTitle : "",
				preCheckUser:     obj ? obj.preCheckUser : "",
				aptComplex:       obj ? obj.preCheckUser.preCheck.aptComplex : {},
				baseDateDataType: obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				}
			};
		});
	};
	
	const handleGoBack = () => {
		history.push(`${rootUrl}/preCheck`);
	};
	
	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"사전점검 삭제",
			"사전점검 데이터에 연결된 모든 데이터가 삭제 됩니다. \n 정말로 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				preCheckDetailRepository
					.removePreCheckDetail(id)
					.then(result => {
						handleAlertToggle(
							"isOpen",
							"삭제완료",
							"사저점검 데이터 모두를 삭제 하였습니다.",
							() => {
								history.push(`${rootUrl}/preCheck`);
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
	
	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
						<div className={classes.content}>
							
							<MC.Typography variant="h2" gutterBottom>
								사전점검 상세
							</MC.Typography>
							<MC.Divider className={classes.divider} />
							
							<MC.Paper elevation={2} className={classes.paper}>
								
								<MC.Grid
									container
									spacing={2}
									justify={"space-between"}
									alignItems={"flex-start"}>
									
									<MC.Grid item xs={12} md={12}>
										<PreCheckDetailForm
											preCheckDetail={preCheckDetail}
											setPreCheckDetail={setPreCheckDetail} />
									</MC.Grid>
									
									<MC.Grid item xs={6} md={6}>
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

export default inject("SignInStore", "PreCheckDetailStore")(observer(PreCheckDetail));
