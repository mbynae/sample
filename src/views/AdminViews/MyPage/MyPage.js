import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { MyPageEditForm }                    from "./components";
import { toJS }                              from "mobx";
import { officeAdminRepository }             from "../../../repositories";

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
const MyPage = props => {

	const classes = useStyles();
	const { SignInStore, AptComplexStore, history, match } = props;

	const [menuKey] = useState("myPage");
	const [rootUrl, setRootUrl] = useState("");
	const [loading, setLoading] = useState(true);
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `마이페이지`,
			href:  `${rootUrl}/${menuKey}`
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

	const [officeAdmin, setOfficeAdmin] = useState({});
	const [errors, setErrors] = useState({
		isPassword: false,
		isPasswordCheck: false
	});
	const [passwordErrMsg, setPasswordErrMsg] = useState("") // 비밀번호 에러 메시지
	const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState("") // 비밀번호 확인 에러 메시지

	const passwordRule = new RegExp("^(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,18}"); // 비밀번호 정규식

	useEffect(() => {
		const init = () => {
			setLoading(false);
			dataBinding(toJS(SignInStore.currentUser));
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const dataBinding = (obj) => {
		setOfficeAdmin(prev => {
			return {
				...prev,
				id:               obj ? obj.id : "",
				userId:           obj ? obj.userId : "",
				adminTypeKind:    obj ? obj.adminType : "",
				aptComplex:       obj ? obj.aptComplex : {},
				aptId:            obj ? obj.aptComplex.id : "",
				baseDateDataType: obj ? obj.baseDateDataType : {
					createDate:       new Date(),
					lastModifiedDate: new Date()
				}
			};
		});
	};

	const updateOfficeAdmin = () => {
		officeAdminRepository
			.updateOfficeAdmin(
				officeAdmin.id,
				{
					...officeAdmin
				})
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"내 정보 수정 완료",
					"비밀번호 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						// history.push("/menuKey/" + id);
						setOfficeAdmin(prev => {
							return {
								...prev,
								password:      "",
								passwordCheck: ""
							};
						});
					},
					undefined
				);
			});
	};

	const handleEdit = () => {
		if (!(officeAdmin.password === "" || !passwordRule.test(officeAdmin.password) ||
				officeAdmin.passwordCheck === "" || !passwordRule.test(officeAdmin.passwordCheck) || officeAdmin.password !== officeAdmin.passwordCheck)) {
			updateOfficeAdmin();
		}
		else {
			setErrors(prev => {
				return {
					...prev,
					isPassword: true,
					isPasswordCheck: true
				};
			});
		}

	};

	return (
		<div className={classes.root}>
			{
				!loading && (
					<>
						<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

						<MC.Typography variant="h2" gutterBottom style={{ marginTop: 10 }}>
							마이페이지
						</MC.Typography>
						<MC.Divider className={classes.divider} />

						<MC.Paper elevation={2} className={classes.paper}>

							<MC.Grid
								container
								spacing={2}
								justify={"space-between"}
								alignItems={"flex-start"}>

								<MC.Grid item xs={12} md={12}>
									<MyPageEditForm
										officeAdmin={officeAdmin}
										setOfficeAdmin={setOfficeAdmin}
										errors={errors}
										setErrors={setErrors}
										passwordErrMsg={passwordErrMsg}
										setPasswordErrMsg={setPasswordErrMsg}
										confirmPasswordErrMsg={confirmPasswordErrMsg}
										setConfirmPasswordErrMsg={setConfirmPasswordErrMsg}
										passwordRule={passwordRule}
									/>
								</MC.Grid>

								<MC.Grid item xs={6} md={6} />

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
											onClick={handleEdit}>
											저장
										</MC.Button>
									</MC.ButtonGroup>
								</MC.Grid>

							</MC.Grid>
						</MC.Paper>
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

export default inject("SignInStore", "AptComplexStore")(observer(MyPage));

