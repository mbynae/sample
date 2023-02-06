import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import palette from "../../../theme/adminTheme/palette";
import {
	aoPositionRepository,
	autonomousOrganizationRepository,
	sendSMSRepository,
} from "../../../repositories";
import {
	ActiveLastBreadcrumb,
	AlertDialog,
	PhoneHyphen,
} from "../../../components";
import { SendSMSEditForm } from "./components";
import { toJS } from "mobx";
import moment from "moment";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3),
	},
	divider: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)",
	},
	content: {
		marginTop: theme.spacing(2),
	},
	paper: {
		padding: theme.spacing(2),
	},
	buttonLayoutRight: {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "center",
	},
}));

const SendSMSEdit = (props) => {
	const classes = useStyles();

	const { SignInStore, AptComplexStore, history, match } = props;
	const { id } = match.params;

	const [menuKey] = useState("sendSMS");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href: `${rootUrl}/dashboard`,
		},
		{
			title: `문자발송 관리`,
			href: `${rootUrl}/${menuKey}`,
		},
		{
			title: `문자발송 관리 ${id ? "수정" : "등록"}`,
			href: `${rootUrl}/${menuKey}/edit${id ? "/" + id : ""}`,
		},
	]);

	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
	});
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens((prev) => {
			return {
				...prev,
				title,
				content,
				[key]: !alertOpens[key],
				yesFn: () => yesCallback(),
				noFn: () => noCallback(),
			};
		});
	};

	// 문자발송 관리 정보
	const [sendSMS, setSendSMS] = useState({});
	const [errors, setErrors] = useState({
		isContent: false,
		isSendToAutonomousOrganizationId: false,
		isBuilding: false,
		isPhoneNumber: false,
	});

	const [aoList, setAOList] = useState([]);
	const [aoPositions, setAOPositions] = useState([]);

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			await getAOList();
			let rootUrl = generateRootUrl();
			await setBreadcrumbs((prev) => {
				prev = [
					{
						title: "관리자",
						href: `${rootUrl}/dashboard`,
					},
					{
						title: `문자발송 관리`,
						href: `${rootUrl}/${menuKey}`,
					},
					{
						title: `문자발송 관리 ${id ? "수정" : "등록"}`,
						href: `${rootUrl}/${menuKey}/edit${id ? "/" + id : ""}`,
					},
				];
				return [...prev];
			});
			if (id) {
				setIsEdit(true);
				await getSendSMS(id);
			} else {
				setLoading(false);
				dataBinding(undefined);
			}
		};

		setTimeout(async () => {
			await init();
		});
	}, [id]);

	const getSendSMS = async (id) => {
		sendSMSRepository
			.getSendSMS(id, {
				aptId: AptComplexStore.aptComplex.id,
			})
			.then((result) => {
				dataBinding(result);
				setLoading(false);
			});
	};

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const dataBinding = (obj) => {
		setSendSMS((prev) => {
			let sendTargetDataTypes = [];
			for (let i = 0; i < 10; i++) {
				let sendTargetDataType = {
					phoneNumber: "",
				};
				sendTargetDataTypes.push(sendTargetDataType);
			}

			const getDate = (date, isFrom) =>
				moment(date)
					.hour(isFrom ? 0 : 23)
					.minute(isFrom ? 0 : 59)
					.second(isFrom ? 0 : 59)
					.milliseconds(isFrom ? 0 : 59);
			let date = moment(new Date()).add(1, "days");

			return {
				...prev,
				aptId: AptComplexStore.aptComplex.id,
				smsType: obj ? obj.smsType : "SMS",
				sendType: obj ? obj.sendType : "SEND_IMMEDIATE",
				reservationDate: obj
					? obj.reservationDate
					: getDate(date.format("YYYY-MM-DD"), true).toDate(),
				sendTargetType: obj ? obj.sendTargetType : "TOTAL",

				isSendForHouseHolders: obj ? obj.isSendForHouseHolders : "",
				building: obj ? obj.building : "",
				sendTargetDataTypes: obj
					? obj.sendTargetDataTypes
					: sendTargetDataTypes,
				sendToAutonomousOrganizationId: obj
					? obj.sendToAutonomousOrganizationId
					: "",
				sendToAOPositionId: obj ? obj.sendToAOPositionId : "",
				title: `${AptComplexStore.aptComplex.aptInformationDataType.aptName} 공지알림`,
				content: ``,
				telephone: `관리사무소 전화연결 : ${PhoneHyphen(
					AptComplexStore.aptComplex.aptInformationDataType.officeCallNumber
				)}`,
			};
		});
	};

	const generateContent = () => {
		return `${
			AptComplexStore.aptComplex.aptInformationDataType.aptName
		} 공지알림\n\n{내용을 입력해주세요}\n\n관리사무소 전화연결 : ${PhoneHyphen(
			AptComplexStore.aptComplex.aptInformationDataType.officeCallNumber
		)}`;
	};

	const saveSendSMS = () => {
		let { title, telephone, ...tempSendSMS } = {
			...sendSMS,
			content: `${sendSMS.title}\n\n${sendSMS.content}\n\n${sendSMS.telephone}`,
		};

		if (tempSendSMS.sendType === "SEND_IMMEDIATE") {
			delete tempSendSMS.reservationDate;
		}

		if (tempSendSMS.sendTargetType === "TOTAL") {
			delete tempSendSMS.isSendForHouseHolders;
			delete tempSendSMS.building;
			delete tempSendSMS.sendTargetDataTypes;
			delete tempSendSMS.sendToAutonomousOrganizationId;
			delete tempSendSMS.sendToAOPositionId;
		} else if (tempSendSMS.sendTargetType === "AUTONOMOUS_ORGANIZATION") {
			delete tempSendSMS.isSendForHouseHolders;
			delete tempSendSMS.building;
			delete tempSendSMS.sendTargetDataTypes;
			if (tempSendSMS.sendToAOPositionId === 0) {
				delete tempSendSMS.sendToAOPositionId;
			}
		} else if (tempSendSMS.sendTargetType === "BUILDING") {
			delete tempSendSMS.isSendForHouseHolders;
			delete tempSendSMS.sendTargetDataTypes;
			delete tempSendSMS.sendToAutonomousOrganizationId;
			delete tempSendSMS.sendToAOPositionId;
		} else if (tempSendSMS.sendTargetType === "HOUSEHOLDERS") {
			delete tempSendSMS.building;
			delete tempSendSMS.sendTargetDataTypes;
			delete tempSendSMS.sendToAutonomousOrganizationId;
			delete tempSendSMS.sendToAOPositionId;
		} else if (tempSendSMS.sendTargetType === "INDIVIDUAL") {
			delete tempSendSMS.isSendForHouseHolders;
			delete tempSendSMS.building;
			delete tempSendSMS.sendToAutonomousOrganizationId;
			delete tempSendSMS.sendToAOPositionId;
			let tempSTDT = tempSendSMS.sendTargetDataTypes.filter(
				(stdt) => stdt.phoneNumber !== ""
			);
			tempSendSMS = {
				...tempSendSMS,
				sendTargetDataTypes: tempSTDT,
			};
		} else if (tempSendSMS.sendTargetType === "PRE_CHECK") {
			delete tempSendSMS.isSendForHouseHolders;
			delete tempSendSMS.building;
			delete tempSendSMS.sendTargetDataTypes;
			delete tempSendSMS.sendToAutonomousOrganizationId;
			delete tempSendSMS.sendToAOPositionId;
			tempSendSMS.isSendForPreCheckUsers = true;
		}

		sendSMSRepository
			.saveSendSMS({
				...tempSendSMS,
			})
			.then(() => {
				handleAlertToggle(
					"isOpen",
					"문자발송 완료",
					"문자발송을 완료 하였습니다.",
					() => {
						setAlertOpens({ ...alertOpens, isOpen: false });
						history.push(`${rootUrl}/${menuKey}`);
					},
					undefined
				);
			});
	};

	const handleEdit = () => {
		setErrors((prev) => {
			return {
				...prev,
				isContent: false,
				isSendToAutonomousOrganizationId: false,
				isBuilding: false,
				isPhoneNumber: false,
			};
		});
		if (!(sendSMS.content === "")) {
			if (sendSMS.sendTargetType === "AUTONOMOUS_ORGANIZATION") {
				if (
					!(
						sendSMS.sendToAutonomousOrganizationId === "" ||
						sendSMS.sendToAutonomousOrganizationId === 0
					)
				) {
					saveSendSMS();
				} else {
					setErrors((prev) => {
						return {
							...prev,
							isSendToAutonomousOrganizationId:
								sendSMS.sendToAutonomousOrganizationId === "" ||
								sendSMS.sendToAutonomousOrganizationId === 0,
						};
					});
				}
			} else if (sendSMS.sendTargetType === "INDIVIDUAL") {
				let tempSTDT = sendSMS.sendTargetDataTypes.filter(
					(stdt) => stdt.phoneNumber !== ""
				);
				if (tempSTDT.length > 0) {
					saveSendSMS();
				} else {
					setErrors((prev) => {
						return {
							...prev,
							isPhoneNumber: tempSTDT.length === 0,
						};
					});
				}
			} else if (sendSMS.sendTargetType === "BUILDING") {
				if (!(sendSMS.building === "")) {
					saveSendSMS();
				} else {
					setErrors((prev) => {
						return {
							...prev,
							isBuilding: sendSMS.building === "",
						};
					});
				}
			} else {
				saveSendSMS();
			}
		} else {
			setErrors((prev) => {
				return {
					...prev,
					isContent: sendSMS.content === "",
				};
			});
		}
	};

	const handleGoBack = () => {
		history.goBack();
	};

	const getAOList = async () => {
		let autonomousOrganizationSearch = {
			aptId: AptComplexStore.aptComplex.id,
		};
		let findAutonomousOrganizations =
			await autonomousOrganizationRepository.getAutonomousOrganizations({
				...autonomousOrganizationSearch,
				direction: "ASC",
				page: 0,
				size: 100000,
				sort: "sequence",
			});

		setAOList(findAutonomousOrganizations.content);
	};

	const getAOPositions = async (aoId) => {
		let searchParams = {
			autonomousOrganizationId: aoId,
		};
		const aoPositions = await aoPositionRepository.getAOPositions(searchParams);
		const sort = (a, b) => a.aoPosition.sequence - b.aoPosition.sequence;
		setAOPositions(aoPositions.sort(sort));
	};

	return (
		<div className={classes.root}>
			{!loading && (
				<>
					<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
					<div className={classes.content}>
						<MC.Typography variant="h2" gutterBottom>
							문자발송&nbsp;
							{isEdit ? "수정" : "등록"}
						</MC.Typography>
						<MC.Divider className={classes.divider} />

						<MC.Paper elevation={2} className={classes.paper}>
							<MC.Grid
								container
								spacing={2}
								justify={"space-between"}
								alignItems={"flex-start"}
							>
								<MC.Grid item xs={12} md={12}>
									<SendSMSEditForm
										isEdit={isEdit}
										sendSMS={sendSMS}
										setSendSMS={setSendSMS}
										aptComplex={toJS(AptComplexStore.aptComplex)}
										aoList={aoList}
										aoPositions={aoPositions}
										setAOPositions={setAOPositions}
										getAOPositions={getAOPositions}
										dataBinding={dataBinding}
										errors={errors}
									/>
								</MC.Grid>

								<MC.Grid
									item
									xs={12}
									md={12}
									className={classes.buttonLayoutRight}
								>
									<MC.ButtonGroup
										aria-label="text primary button group"
										size="large"
										style={{ marginTop: 12 }}
										color="primary"
									>
										<MC.Button
											style={{
												color: palette.error.main,
												borderColor: palette.error.main,
												marginLeft: 10,
												borderTopLeftRadius: 4,
												borderBottomLeftRadius: 4,
											}}
											onClick={handleGoBack}
										>
											취소
										</MC.Button>
										<MC.Button
											variant="outlined"
											color="primary"
											onClick={handleEdit}
										>
											{isEdit
												? "저장"
												: sendSMS.sendType === "SEND_IMMEDIATE"
												? "발송"
												: "예약 발송"}
										</MC.Button>
									</MC.ButtonGroup>
								</MC.Grid>
							</MC.Grid>
						</MC.Paper>
					</div>
				</>
			)}

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

export default inject("SignInStore", "AptComplexStore")(observer(SendSMSEdit));
