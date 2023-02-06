import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import palette                                    from "../../../theme/adminTheme/palette";
import { callBookRepository, categoryRepository } from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog }      from "../../../components";
import { CallBookEditForm }                       from "./components";

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

const CallBookEdit = props => {
	const classes = useStyles();
	
	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;
	
	const [menuKey] = useState("callBook");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `전화번호부 관리`,
			href:  `${rootUrl}/callBook`
		},
		{
			title: `전화번호부 관리 ${id ? "수정" : "등록"}`,
			href:  `${rootUrl}/callBook/edit${id ? "/" + id : ""}`
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
	
	// 전화번호부 관리 정보
	const [callBook, setCallBook] = useState({});
	const [categories, setCategories] = useState([]);
	const [errors, setErrors] = useState({
		isTitle:      false,
		isCategory:   false,
		isCallNumber: false
	});
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
		const init = async () => {
			await getCategories();
			let rootUrl = generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `전화번호부 관리`,
						href:  `${rootUrl}/callBook`
					},
					{
						title: `전화번호부 관리 ${id ? "수정" : "등록"}`,
						href:  `${rootUrl}/callBook/edit${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				setIsEdit(true);
				await getCallBook(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};
		
		setTimeout(async () => {
			await init();
		});
	}, [id]);
	
	const getCallBook = async (id) => {
		callBookRepository
			.getCallBook(id, {
				aptId: AptComplexStore.aptComplex.id
			})
			.then(result => {
				dataBinding(result);
				setLoading(false);
			});
	};
	
	const getCategories = async () => {
		const categories = await categoryRepository.getCategories({
			aptId:   AptComplexStore.aptComplex.id,
			menuKey: menuKey
		});
		const sort = (a, b) => a.sequence - b.sequence;
		setCategories(categories.sort(sort));
	};
	
	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};
	
	const dataBinding = (obj) => {
		setCallBook(prev => {
			return {
				...prev,
				aptId:      AptComplexStore.aptComplex.id,
				id:         obj ? obj.id : "",
				title:      obj ? obj.title : "",
				callNumber: obj ? obj.callNumber : "",
				faxNumber:  obj ? obj.faxNumber : "",
				category:   obj ? obj.category : {},
				categoryId: obj ? obj.category.id : "",
				aptComplex: obj ? obj.aptComplex : {}
			};
		});
	};
	
	const updateCallBook = () => {
		callBookRepository
			.updateCallBook(
				id,
				{
					...callBook,
					callNumber: callBook.callNumber.replaceAll("-", ""),
					faxNumber:  callBook.faxNumber.replaceAll("-", "")
				})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"전화번호부 수정 완료",
					callBook.title + " 전화번호부 수정이 완료 되었습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/callBook/${id}`);
					},
					undefined
				);
			});
	};
	
	const saveCallBook = () => {
		callBookRepository.saveCallBook({
			...callBook,
			callNumber: callBook.callNumber.replaceAll("-", ""),
			faxNumber:  callBook.faxNumber.replaceAll("-", "")
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"전화번호부 생성 완료",
				callBook.title + " 전화번호부 생성이 완료 되었습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
					history.push(`${rootUrl}/callBook/${result.id}`);
				},
				undefined
			);
		});
	};
	
	const handleEdit = () => {
		
		setErrors(prev => {
			return {
				...prev,
				isTitle:      false,
				isCategory:   false,
				isCallNumber: false
			};
		});
		
		if (
			!(
				callBook.title === "" ||
				callBook.categoryId === "" ||
				callBook.callNumber === ""
			)
		) {
			if ( isEdit ) {
				// 수정
				updateCallBook();
			} else {
				// 등록
				saveCallBook();
			}
		} else {
			setErrors(prev => {
				return {
					...prev,
					isTitle:      callBook.title === "",
					isCategory:   callBook.categoryId === "",
					isCallNumber: callBook.callNumber === ""
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
								전화번호부&nbsp;
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
										<CallBookEditForm
											isEdit={isEdit}
											callBook={callBook}
											setCallBook={setCallBook}
											categories={categories}
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

export default inject("SignInStore", "AptComplexStore")(observer(CallBookEdit));
