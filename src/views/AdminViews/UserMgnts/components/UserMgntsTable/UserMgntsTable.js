import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, PhoneHyphen, TablePaginationActions } from "../../../../../components";
import palette                                                          from "../../../../../theme/adminTheme/palette";
import { userMgntRepository }                                           from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:          {},
	content:       {
		padding: 0
	},
	inner:         {
		minWidth: 1530
	},
	nameContainer: {
		display:    "flex",
		alignItems: "center"
	},
	actions:       {
		padding:        theme.spacing(1),
		paddingLeft:    theme.spacing(2),
		paddingRight:   theme.spacing(2),
		justifyContent: "space-between"
	}
}));

const UserMgntsTable = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, userMgnts, getUserMgnts, pageInfo, setPageInfo, staticContext, ...rest } = props;

	const [selectedObjects, setSelectedObjects] = useState([]);

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

	const handleSelectAll = event => {
		let selectedList;
		event.target.checked ? selectedList = userMgnts.map(userMgnt => userMgnt) : selectedList = [];
		setSelectedObjects(selectedList);
	};

	const handleSelectOne = (event, selectedObject) => {
		const selectedIndex = selectedObjects.indexOf(selectedObject);
		let newSelectedObjects = [];

		if ( selectedIndex === -1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects, selectedObject);
		} else if ( selectedIndex === 0 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if ( selectedIndex === selectedObjects.length - 1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
		} else if ( selectedIndex > 0 ) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}

		setSelectedObjects(newSelectedObjects);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getUserMgnts(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getUserMgnts(0, event.target.value);
	};

	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/userMgnt/${obj.id}`);
	};

	const removeObject = async (id) => {
		return userMgntRepository.removeUserMgnt(id);
	};

	const updateResidentsType = (obj) => {
		return userMgntRepository.updateUserMgnt(obj.id, {
			...obj,
			userDataType: {
				...obj.userDataType,
				residentsType: "RESIDENTS"
			}
		}).then(result => {
			handleAlertToggle(
				"isOpen",
				"승인완료",
				"선택된 계정 모두를 승인처리 하였습니다.",
				() => {
					setSelectedObjects([]);
					setAlertOpens({ ...alertOpens, isOpen: false });
					getUserMgnts(pageInfo.page, pageInfo.size);
				}
			);
		}).catch(e => {
			handleAlertToggle(
				"isOpen",
				e.msg,
				e.errormsg + "\n" + "errorcode: " + e.errorcode,
				() => {
					setSelectedObjects([]);
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		})
	};

	const handleConfirm = () => {
		let findObj = selectedObjects.filter(obj => obj.userDataType.residentsType !== "AWAITING_RESIDENTS");

		if ( findObj && findObj.length > 0 ) {
			handleAlertToggle(
				"isOpen",
				"다중 승인불가",
				"'승인대기' 상태의 항목만 승인 가능합니다.",
				() => {
					setSelectedObjects([]);
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			// 선택된 데이터의 상태 값 검사
			handleAlertToggle(
				"isConfirmOpen",
				"입주민 승인",
				"선택하신 계정들을 승인하시겠습니까?",
				async () => {
					await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					await selectedObjects.map(async (obj) => {
						await updateResidentsType(obj);
					});
				},
				() => {
					setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				}
			);
		}
	};

	const handleDeleteAllClick = async () => {
		// 선택된 데이터의 상태 값 검사
		handleAlertToggle(
			"isConfirmOpen",
			"입주민 계정 삭제",
			"선택하신 계정에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 계정을 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				await selectedObjects.map(async (obj) => {
					await removeObject(obj.id);
				});
				handleAlertToggle(
					"isOpen",
					"삭제완료",
					"선택된 계정 정보 모두를 삭제 하였습니다.",
					() => {
						setSelectedObjects([]);
						setAlertOpens({ ...alertOpens, isOpen: false });
						getUserMgnts(pageInfo.page, pageInfo.size);
					}
				);

			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};

	const handleRegister = async () => {																			// 입주민 등록 페이지로 이동
		history.push(`${rootUrl}/userMgnt/register`);
	}

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.id}>

			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>

			{/*상태*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{
					obj.userDataType.residentsType === "AWAITING_RESIDENTS" ? <MC.Chip label={"승인대기"} /> :
						obj.userDataType.residentsType === "RESIDENTS" && <MC.Chip label={"입주민"} />
				}
			</MC.TableCell>

			{/*이름*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.name}
			</MC.TableCell>

			{/*아이디*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.userId}
			</MC.TableCell>

			{/*동*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.userDataType.building}
			</MC.TableCell>

			{/*호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{obj.userDataType.unit}
			</MC.TableCell>

			{/*휴대폰번호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{PhoneHyphen(obj.phoneNumber)}
			</MC.TableCell>

			{/*소유주 여부*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{
					obj.userDataType.ownerType === "TO_BE_CONFIRMED" ? <MC.Chip label={"확인예정"} /> :
						obj.userDataType.ownerType === "NON_OWNER" ? <MC.Chip label={"비소유주"} /> :
							obj.userDataType.ownerType === "OWNER" && <MC.Chip label={"소유주"} />
				}
			</MC.TableCell>

			{/*세대주 여부*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				{
					obj.userDataType.houseHolderType === "HOUSEHOLD_OWNER" ? <MC.Chip label={"세대주"} /> :
						obj.userDataType.houseHolderType === "HOUSEHOLD_MEMBER" && <MC.Chip label={"세대원"} />
				}
			</MC.TableCell>

			{/*등록일*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
										align={"center"}>
				<DateFormat date={obj.baseDateDataType.createDate} format={"YYYY-MM-DD"} />
			</MC.TableCell>

		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"입주민 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
				titleTypographyProps={{ variant: "h4" }}
				action={
					<MC.ButtonGroup
						aria-label="text primary button group"
						style={{ marginTop: 12 }}
						color="primary">

						<MC.Button
							style={{
								color:                  palette.primary.main,
								borderColor:            palette.primary.main,
								marginLeft:             10,
								borderTopLeftRadius:    4,
								borderBottomLeftRadius: 4
							}}
							onClick={handleRegister}>
							신규
						</MC.Button>

						<MC.Button
							disabled={selectedObjects.length === 0}
							style={{
								color:                  selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.error.main,
								borderColor:            selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.12)" : palette.error.main,
								marginLeft:             10,
								borderTopLeftRadius:    4,
								borderBottomLeftRadius: 4
							}}
							onClick={handleDeleteAllClick}>
							삭제
						</MC.Button>
					</MC.ButtonGroup>
				} />

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
												userMgnts ?
													(userMgnts.length === 0 ? false : selectedObjects.length === userMgnts.length) : false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0
												&& selectedObjects.length < (userMgnts ? userMgnts.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>상태</MC.TableCell>
									<MC.TableCell align={"center"}>이름</MC.TableCell>
									<MC.TableCell align={"center"}>아이디</MC.TableCell>
									<MC.TableCell align={"center"}>동</MC.TableCell>
									<MC.TableCell align={"center"}>호</MC.TableCell>
									<MC.TableCell align={"center"}>휴대폰번호</MC.TableCell>
									<MC.TableCell align={"center"}>소유주 여부</MC.TableCell>
									<MC.TableCell align={"center"}>세대주 여부</MC.TableCell>
									<MC.TableCell align={"center"}>등록일</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									userMgnts ?
										(
											userMgnts.length === 0 ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={9} align="center">
														조회된 입주민 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												userMgnts.slice(slice).map(objView)
										)
										:
										<MC.TableRow hover>
											<MC.TableCell colSpan={9} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
								}
							</MC.TableBody>

						</MC.Table>
					</div>
				</PerfectScrollbar>
			</MC.CardContent>

			<MC.Divider />
			<MC.CardActions className={classes.actions}>
				<MC.Grid
					container
					justify={"space-between"}
					alignItems={"center"}>
					<MC.Grid item>
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button
								disabled={selectedObjects.length === 0}
								onClick={handleConfirm}>
								승인
							</MC.Button>
						</MC.ButtonGroup>
					</MC.Grid>
					<MC.Grid item>
						<MC.TablePagination
							component="div"
							count={pageInfo.total}
							labelDisplayedRows={({ from, to, count }) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
							labelRowsPerPage={"페이지당 목록 수 : "}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
							ActionsComponent={TablePaginationActions}
							page={pageInfo.page}
							rowsPerPage={pageInfo.size}
							rowsPerPageOptions={[10, 15, 30, 50, 100]} />
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

export default UserMgntsTable;
