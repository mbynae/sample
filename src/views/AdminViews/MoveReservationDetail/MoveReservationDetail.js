import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import moment                         from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { moveReservationRepository }                from "../../../repositories";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import { MoveReservationDetailForm }                from "./components";

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

const MoveReservationDetail = props => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("moveReservation");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `이사예약 관리`,
			href:  `${rootUrl}/moveReservation`
		},
		{
			title: `이사예약 관리 상세`,
			href:  `${rootUrl}/moveReservation${id ? "/" + id : ""}`
		}
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

	// 이사예약 관리 정보
	const [moveReservation, setMoveReservation] = useState({});

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
						title: `이사예약 관리`,
						href:  `${rootUrl}/moveReservation`
					},
					{
						title: `이사예약 관리 상세`,
						href:  `${rootUrl}/moveReservation${id ? "/" + id : ""}`
					}
				];
				return [
					...prev
				];
			});
			if ( id ) {
				await getMoveReservation(id);
			}
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getMoveReservation = async (id) => {
		moveReservationRepository
			.getMoveReservation({
				mvio_numb : id
			})
			.then(result => {
				dataBinding(result.detailinfo);
				setLoading(false);
			});
	};

	const dataBinding = (obj) => {
		setMoveReservation(prev => {
			return {
				...prev,

				dong_numb:        obj ? obj.dong_numb : "",
				ho_numb:          obj ? obj.ho_numb : "",
				mvio_code_name:  	obj ? obj.mvio_code_name : "",
				mvio_strt_date:   obj ? obj.mvio_strt_date : "",
				mvio_strt_time:		obj ? obj.mvio_strt_time : "",
				carlist:        	obj ? obj.carlist : "",
				rsvt_stat:				obj ? obj.rsvt_stat : "",
				memb_numb:				obj ? obj.memb_numb : "",
				memb_info:			  obj ? obj.memb_info : {},
				mvio_name:				obj ? obj.mvio_name : "",
				mvio_tel:					obj ? obj.mvio_tel : "",

			};
		});
	};

	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"이사예약 정보 삭제",
			"해당 이사예약 정보가 삭제가 됩니다. \n 정말로 이사예약 정보를 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				moveReservationRepository.deleteMoveReservation({
					mvio_numb: id,
					memb_numb: moveReservation.memb_numb,
					dong_numb: moveReservation.dong_numb,
					ho_numb: moveReservation.ho_numb
				})
					.then(result => {
						handleAlertToggle(
							"isOpen",
							"삭제 완료",
							"해당 이사예약을 삭제처리 하였습니다.",
							() => {
								history.push(`${rootUrl}/moveReservation`);
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

	const handleApprove = (flag) => {
		// flag true => 승인, flag false => 반려
		handleAlertToggle(
			"isConfirmOpen",
			flag ? "이사예약 정보 승인" : "이사예약 정보 반려",
			flag ? "해당 이사예약에 대해 승인 처리 하시겠습니까?" : "해당 이사예약에 대해 반려 처리 하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });

				if (flag) {
					moveReservationRepository.approveMoveReservation({
						mvio_numb: id,
						memb_numb: moveReservation.memb_numb,
						dong_numb: moveReservation.dong_numb,
						ho_numb: moveReservation.ho_numb
					})
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"승인 완료",
								"해당 이사예약을 승인처리 하였습니다.",
								() => {
									history.push(`${rootUrl}/moveReservation`);
									setAlertOpens({ ...alertOpens, isOpen: false });
								}
							);
						});
				} else {
					moveReservationRepository.cancelMoveReservationMgnt({
						mvio_numb: id,
						memb_numb: moveReservation.memb_numb,
						dong_numb: moveReservation.dong_numb,
						ho_numb: moveReservation.ho_numb
					})
						.then(result => {
							handleAlertToggle(
								"isOpen",
								"반려 완료",
								"해당 이사예약을 반려처리 하였습니다.",
								() => {
									history.push(`${rootUrl}/moveReservation`);
									setAlertOpens({ ...alertOpens, isOpen: false });
								}
							);
						});
				}
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	}

	const handleEdit = () => {
		history.push(`${rootUrl}/moveReservation/edit/${id}`);
	};

	const handleGoBack = () => {
		history.push(`${rootUrl}/moveReservation`);
	};

	return (
		<div className={classes.root}>

			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs}/>
			<div className={classes.content}>

				<MC.Typography variant="h2" gutterBottom>
					이사예약 상세
				</MC.Typography>
				<MC.Divider className={classes.divider}/>
				{
					!loading && (
						<MC.Paper elevation={2} className={classes.paper}>

							<MC.Grid
								container
								spacing={2}
								justify={"space-between"}
								alignItems={"flex-start"}>

								<MC.Grid item xs={12} md={12}>
									<MoveReservationDetailForm
										moveReservation={moveReservation}
										setMoveReservation={setMoveReservation}/>
								</MC.Grid>

								<MC.Grid item xs={6} md={6}>
									<MC.ButtonGroup
										aria-label="text primary button group"
										size="large"
										style={{ marginTop: 12 }}
										color="primary">
										<MC.Button
											onClick={(e) => handleApprove(true)}>
											승인
										</MC.Button>
										<MC.Button
											onClick={(e) => handleApprove(false)}>
											반려
										</MC.Button>
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
					)
				}
				{
					loading && (
						<MC.Grid container justify={"center"}>
							<MC.CircularProgress color={"secondary"}/>
						</MC.Grid>
					)
				}
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

export default inject("SignInStore", "AptComplexStore")(observer(MoveReservationDetail));
