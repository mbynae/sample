import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import clsx from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import {
	AlertDialog,
	DateFormat,
	PhoneHyphen,
	TablePaginationActions,
} from "../../../../../components";
import palette from "../../../../../theme/adminTheme/palette";
import { sendSMSRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles((theme) => ({
	root: {},
	content: {
		padding: 0,
	},
	inner: {
		minWidth: 1530,
	},
	nameContainer: {
		display: "flex",
		alignItems: "center",
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between",
	},
}));

const SendSMSsTable = (props) => {
	const classes = useStyles();
	const {
		className,
		history,
		menuKey,
		aptId,
		rootUrl,
		sendSMSs,
		getSendSMSs,
		pageInfo,
		setPageInfo,
		staticContext,
		...rest
	} = props;

	const [selectedObjects, setSelectedObjects] = useState([]);

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

	const handleSelectAll = (event) => {
		let selectedList;
		event.target.checked
			? (selectedList = sendSMSs.map((sendSMS) => sendSMS))
			: (selectedList = []);
		setSelectedObjects(selectedList);
	};

	const handleSelectOne = (event, selectedObject) => {
		const selectedIndex = selectedObjects.indexOf(selectedObject);
		let newSelectedObjects = [];

		if (selectedIndex === -1) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects,
				selectedObject
			);
		} else if (selectedIndex === 0) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if (selectedIndex === selectedObjects.length - 1) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, -1)
			);
		} else if (selectedIndex > 0) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}

		setSelectedObjects(newSelectedObjects);
	};

	const handlePageChange = (event, page) => {
		setPageInfo((prev) => {
			return {
				...prev,
				page: page,
			};
		});
		getSendSMSs(page, pageInfo.size);
	};

	const handleRowsPerPageChange = (event) => {
		setPageInfo((prev) => {
			return {
				...prev,
				page: 0,
				size: event.target.value,
			};
		});
		getSendSMSs(0, event.target.value);
	};

	const handleRowClick = (obj) => {
		// history.push(`${rootUrl}/${menuKey}/${obj.id}`);
	};

	const removeObject = async (id) => {
		return sendSMSRepository.removeSendSMS(id, { aptId: aptId });
	};

	const handleOpenRegisterPage = () => {
		history.push(`${rootUrl}/${menuKey}/edit`);
	};

	const handleDeleteAllClick = async () => {
		let check = selectedObjects.filter((so) => !(so.isSend !== "SUCCESS"));
		if (check.length > 0) {
			handleAlertToggle(
				"isOpen",
				"삭제 불가",
				"선택된 문자발송 데이터 중 발송이 되지 않은 데이터가 있습니다.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			// 선택된 데이터의 상태 값 검사
			handleAlertToggle(
				"isConfirmOpen",
				"문자발송 삭제",
				"선택하신 문자발송 정보에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 문자발송 데이터를 삭제하겠습니까?",
				async () => {
					await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					await selectedObjects.map(async (obj) => {
						await removeObject(obj.id);
					});
					handleAlertToggle(
						"isOpen",
						"삭제완료",
						"선택된 문자발송 데이터를 모두 삭제 하였습니다.",
						() => {
							setSelectedObjects([]);
							getSendSMSs(pageInfo.page, pageInfo.size);
							setAlertOpens({ ...alertOpens, isOpen: false });
						}
					);
				},
				() => {
					// 삭제안하기
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				}
			);
		}
	};

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow hover key={obj.id}>
			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={(event) => handleSelectOne(event, obj)}
					value={true}
				/>
			</MC.TableCell>

			{/*구분*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.smsType === "SMS" ? (
					<MC.Chip label={"SMS"} />
				) : (
					obj.smsType === "MMS" && <MC.Chip label={"MMS"} />
				)}
			</MC.TableCell>

			{/*발송여부*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.isSend === "SUCCESS" ? (
					<MC.Chip label={"발송"} />
				) : obj.isSend === "RESERVED" ? (
					<MC.Chip label={"예약중"} />
				) : (
					<MC.Chip label={"실패"} />
				)}
			</MC.TableCell>

			{/*발송형태*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.sendType === "SEND_RESERVATION" ? (
					<MC.Chip label={"예약전송"} />
				) : (
					obj.sendType === "SEND_IMMEDIATE" && <MC.Chip label={"즉시전송"} />
				)}
			</MC.TableCell>

			{/*발신번호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{PhoneHyphen(obj.sendNumber)}
			</MC.TableCell>

			{/*발송대상*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.sendTargetType === "TOTAL" ? (
					<MC.Chip label={"전체"} />
				) : obj.sendTargetType === "AUTONOMOUS_ORGANIZATION" ? (
					<MC.Chip label={"자치기구"} />
				) : obj.sendTargetType === "BUILDING" ? (
					<MC.Chip label={"특정동"} />
				) : obj.sendTargetType === "HOUSEHOLDERS" ? (
					<MC.Chip label={"세대주"} />
				) : obj.sendTargetType === "INDIVIDUAL" ? (
					<MC.Chip label={"직접입력"} />
				) : (
					obj.sendTargetType === "PRE_CHECK" && <MC.Chip label={"사전점검"} />
				)}
			</MC.TableCell>

			{/*예약발송일*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.reservationDate ? (
					<DateFormat
						date={obj.reservationDate}
						format={"YYYY-MM-DD HH:mm:ss"}
					/>
				) : (
					<>-</>
				)}
			</MC.TableCell>

			{/*발송일*/}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.sendDate ? (
					<DateFormat date={obj.sendDate} format={"YYYY-MM-DD"} />
				) : (
					<>-</>
				)}
			</MC.TableCell>
		</MC.TableRow>
	);

	return (
		<MC.Card {...rest} className={clsx(classes.root, className)}>
			<MC.CardHeader
				title={"문자발송 목록"}
				subheader={<>총 {pageInfo.total} 건</>}
				titleTypographyProps={{ variant: "h4" }}
				action={
					<MC.ButtonGroup
						aria-label="text primary button group"
						style={{ marginTop: 12 }}
						color="primary"
					>
						<MC.Button
							disabled={selectedObjects.length === 0}
							style={{
								color:
									selectedObjects.length === 0
										? "rgba(0, 0, 0, 0.26)"
										: palette.error.main,
								borderColor:
									selectedObjects.length === 0
										? "rgba(0, 0, 0, 0.12)"
										: palette.error.main,
								marginLeft: 10,
								borderTopLeftRadius: 4,
								borderBottomLeftRadius: 4,
							}}
							onClick={handleDeleteAllClick}
						>
							삭제
						</MC.Button>
					</MC.ButtonGroup>
				}
			/>

			<MC.Divider />

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"} padding={"checkbox"}>
										<MC.Checkbox
											checked={
												sendSMSs
													? sendSMSs.length === 0
														? false
														: selectedObjects.length === sendSMSs.length
													: false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0 &&
												selectedObjects.length <
													(sendSMSs ? sendSMSs.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>구분</MC.TableCell>
									<MC.TableCell align={"center"}>발송여부</MC.TableCell>
									<MC.TableCell align={"center"}>발송형태</MC.TableCell>
									<MC.TableCell align={"center"}>발신번호</MC.TableCell>
									<MC.TableCell align={"center"}>발송대상</MC.TableCell>
									<MC.TableCell align={"center"}>예약발송일</MC.TableCell>
									<MC.TableCell align={"center"}>발송일</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{sendSMSs ? (
									sendSMSs.length === 0 ? (
										<MC.TableRow hover>
											<MC.TableCell colSpan={8} align="center">
												조회된 문자발송 데이터가 한 건도 없네요.
											</MC.TableCell>
										</MC.TableRow>
									) : (
										sendSMSs.slice(slice).map(objView)
									)
								) : (
									<MC.TableRow hover>
										<MC.TableCell colSpan={8} align="center">
											<MC.CircularProgress color="secondary" />
										</MC.TableCell>
									</MC.TableRow>
								)}
							</MC.TableBody>
						</MC.Table>
					</div>
				</PerfectScrollbar>
			</MC.CardContent>

			<MC.Divider />
			<MC.CardActions className={classes.actions}>
				<MC.Grid container justify={"space-between"} alignItems={"center"}>
					<MC.Grid item>
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary"
						>
							<MC.Button onClick={handleOpenRegisterPage}>문자발송</MC.Button>
						</MC.ButtonGroup>
					</MC.Grid>
					<MC.Grid item>
						<MC.TablePagination
							component="div"
							count={pageInfo.total}
							labelDisplayedRows={({ from, to, count }) =>
								"총 " +
								count +
								" 건 / " +
								from +
								" ~ " +
								(to === -1 ? count : to)
							}
							labelRowsPerPage={"페이지당 목록 수 : "}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
							ActionsComponent={TablePaginationActions}
							page={pageInfo.page}
							rowsPerPage={pageInfo.size}
							rowsPerPageOptions={[10, 15, 30, 50, 100]}
						/>
					</MC.Grid>
				</MC.Grid>
			</MC.CardActions>

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
		</MC.Card>
	);
};

export default SendSMSsTable;
