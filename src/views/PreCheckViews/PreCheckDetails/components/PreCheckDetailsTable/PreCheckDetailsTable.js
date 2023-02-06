import React, { useEffect, useState } from "react";
import clsx from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as ML from "@material-ui/lab";

import PhoneCallbackTwoToneIcon from "@material-ui/icons/PhoneCallbackTwoTone";
import LocalPrintshopTwoToneIcon from "@material-ui/icons/LocalPrintshopTwoTone";

import { DateFormat, PhoneHyphen } from "../../../../../components";
import {
	preCheckDetailRepository,
	preCheckDefectRepository,
} from "../../../../../repositories";
import format from "date-fns/format";
import { constants } from "../../../../../commons";

import ExportExcel from "../ExportExcel";

import { toJS } from "mobx";
import { inject, observer } from "mobx-react";

const useStyles = MS.makeStyles((theme) => ({
	root: {},
	content: {
		padding: 0,
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
	body5: {
		...theme.typography.body5,
		whiteSpace: "pre-line",
	},
	formControlSelect: {
		width: 130,
		height: 36,
	},
	select: {
		paddingLeft: 13,
		paddingTop: 8,
		paddingBottom: 8,
	},
	tableHead: {
		height: 50,
		minHeight: 50,
		maxHeight: 50,
		backgroundColor: "transparent",
	},
	body4: {
		...theme.typography.body4,
		color: "#ffffff",
		height: 24,
		lineHeight: "24px",
	},
	tableHeadCell: {
		height: "50px !important",
		fontWeight: "bold",
		color: "#222222",
	},
	tableHeadCellFont: {
		fontSize: 14,
		width: "15%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width: "50%",
		},
	},
	dotDivider: {
		width: "4px",
		height: "4px",
		margin: "8px",
		backgroundColor: "#c4c4c4",
	},
}));

const PreCheckDetailsTable = (props) => {
	const classes = useStyles();
	const {
		className,
		history,
		menuKey,
		rootUrl,
		PreCheckDetailStore,
		isMobile,
		precheckReport,
		getPreCheckReport,
		precheckId,
		categories,
		pageInfo,
		setPageInfo,
		staticContext,
		handleAlertToggle,
		setAlertOpens,
		...rest
	} = props;

	const [sizeOptions] = useState([10, 15, 30, 50, 100]);
	const [selectSizeOption, setSelectSizeOption] = useState(10);

	const [selectedObjects, setSelectedObjects] = useState([]);
	const [isSelectAll, setIsSelectAll] = useState(false);

	const handleSelectAll = (event) => {
		let selectedList;
		if (event.target) {
			event.target.checked
				? (selectedList = precheckReport.map(
						(preCheckDetail) => preCheckDetail
				  ))
				: (selectedList = []);
			setIsSelectAll(event.target.checked);
		} else {
			event
				? (selectedList = precheckReport.map(
						(preCheckDetail) => preCheckDetail
				  ))
				: (selectedList = []);
			setIsSelectAll(event);
		}
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

	const deletePrecheckReport = async () => {
		try {
			const responseRemovePreCheckReport = await Promise.all(
				selectedObjects.map((x) => {
					return preCheckDefectRepository.removePreCheckDefect(x.id);
				})
			);

			handleAlertToggle(
				"isOpen",
				undefined,
				"선택된 사전점검 정보 모두를 삭제 하였습니다.",
				undefined,
				() => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				}
			);
		} catch (error) {
			console.log({ error });
			handleAlertToggle(
				"isOpen",
				undefined,
				"삭제도중 오류가 발생했습니다. 다시 시도해 주세요.",
				undefined,
				() => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				}
			);
		} finally {
			setSelectedObjects([]);
			getPreCheckReport(precheckId);
		}
	};

	const handleDeleteAllClick = async () => {
		// 선택된 데이터의 상태 값 검사
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"선택하신 사전점검 데이터가 모두 삭제 됩니다. \n 정말로 데이터를 삭제하겠습니까?",
			"확인",
			() => {
				setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
				deletePrecheckReport();
			},
			"취소",
			() => {
				// 삭제안하기
				setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	const getTotalPage = () => {
		let totalPage = Math.floor(pageInfo.total / pageInfo.size);
		if (pageInfo.total % pageInfo.size > 0) {
			totalPage++;
		}
		return totalPage;
	};

	const handleOpenRegisterPage = (event) => {
		history.push(`${rootUrl}/${menuKey}/edit`);
	};

	const handleRowClick = (obj) => {
		// history.push(`${rootUrl}/${menuKey}/detail/` + obj.id);
	};

	const objView = (obj, index) => (
		<MC.TableRow
			hover
			style={{
				borderBottom:
					index === precheckReport.length - 1 && "2px solid #222222",
			}}
			key={obj.id}
		>
			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={(event) => handleSelectOne(event, obj)}
					value={true}
				/>
			</MC.TableCell>

			{isMobile ? (
				<>
					<MC.TableCell align={"left"} onClick={() => handleRowClick(obj)}>
						<MC.Grid
							container
							direction="column"
							justify={"center"}
							alignItems={"flex-start"}
						>
							<MC.Grid item style={{ fontSize: 14 }}>
								{obj.content}
							</MC.Grid>
							<MC.Grid item>
								<MC.Grid
									container
									direction="row"
									justify={"flex-start"}
									alignItems={"center"}
								>
									<MC.Grid item style={{ fontSize: 12 }}>
										작성일&nbsp;{" "}
										<span style={{ fontWeight: "normal" }}>
											{obj?.baseDateDataType?.createDate
												? format(
														new Date(obj.baseDateDataType.createDate),
														"yyyy-MM-dd"
												  )
												: ` - `}
										</span>
									</MC.Grid>
									<MC.Grid item style={{ color: "#dedede" }}>
										&nbsp;|&nbsp;
									</MC.Grid>
									<MC.Grid item style={{ fontSize: 12 }}>
										구분&nbsp;{" "}
										<span style={{ fontWeight: "normal" }}>
											{constants.PRECHECK_REPORT_TYPE[obj.defectType]}
										</span>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					</MC.TableCell>
				</>
			) : (
				<>
					{/*작성일*/}
					<MC.TableCell align={"center"} onClick={() => handleRowClick(obj)}>
						{obj?.baseDateDataType?.createDate
							? format(new Date(obj.baseDateDataType.createDate), "yyyy-MM-dd")
							: "-"}
					</MC.TableCell>

					{/*구분*/}
					<MC.TableCell
						onClick={() => handleRowClick(obj)}
						style={{}}
						align={"center"}
					>
						{constants.PRECHECK_REPORT_TYPE[obj.defectType]}
					</MC.TableCell>
					{/*내용*/}
					<MC.TableCell align={"center"} onClick={() => handleRowClick(obj)}>
						{obj.content}
					</MC.TableCell>
					{/*첨부*/}
					<MC.TableCell align={"center"} onClick={() => handleRowClick(obj)}>
						{`${obj.preCheckDefectAttachments[0]?.fileOriginalName ?? "-"}`}
					</MC.TableCell>
				</>
			)}
		</MC.TableRow>
	);

	return (
		<div {...rest} className={clsx(classes.root, className)}>
			<MC.Grid
				container
				direction={"row"}
				justify={"space-between"}
				alignItems={"center"}
				style={{ marginTop: 30 }}
			>
				<MC.Grid item>
					<MC.Typography variant="h6">사전점검 목록</MC.Typography>
				</MC.Grid>
				<MC.Grid item>
					<MC.Grid container spacing={1}>
						<MC.Grid item>
							<MC.Button
								// size="large"
								// disabled={selectedObjects.length === 0}
								disableElevation
								// color="primary"
								variant="outlined"
								onClick={handleDeleteAllClick}
							>
								삭제
							</MC.Button>
						</MC.Grid>

						<MC.Grid item>
							<ExportExcel
								dataSet={precheckReport}
								disabled={precheckReport?.length === 0}
							/>
						</MC.Grid>
					</MC.Grid>

					{/* <MC.FormControl
						variant="outlined"
						className={classes.formControlSelect}
					>
						<MC.Select
							id="sizeOptions"
							name="sizeOptions"
							value={selectSizeOption}
							className={clsx(classes.formControlSelect, classes.body5)}
							classes={{
								select: classes.select,
							}}
							onChange={handleSelectSizeOption}
						>
							{sizeOptions.map((so, index) => (
								<MC.MenuItem
									key={index}
									value={so}
								>{`${so} 개씩 보기`}</MC.MenuItem>
							))}
						</MC.Select>
					</MC.FormControl> */}
				</MC.Grid>
			</MC.Grid>

			<MC.Table style={{ marginTop: 8 }}>
				<MC.TableHead className={classes.tableHead}>
					{isMobile ? (
						<MC.TableRow
							className={classes.tableRow}
							style={{ borderTop: "2px solid #222222" }}
						>
							<MC.TableCell align={"center"} padding={"checkbox"}>
								<MC.Checkbox
									checked={
										precheckReport
											? precheckReport.length === 0
												? false
												: selectedObjects.length === precheckReport.length
											: false
									}
									color={"primary"}
									indeterminate={
										selectedObjects.length > 0 &&
										selectedObjects.length <
											(precheckReport ? precheckReport.length : 10)
									}
									onChange={handleSelectAll}
								/>
							</MC.TableCell>
							<MC.TableCell
								className={clsx(classes.body4, classes.tableHeadCell)}
								align={"left"}
								onClick={() => handleSelectAll(!isSelectAll)}
							>
								전체선택
							</MC.TableCell>
						</MC.TableRow>
					) : (
						<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
							<MC.TableCell align={"center"} padding={"checkbox"}>
								<MC.Checkbox
									checked={
										precheckReport
											? precheckReport.length === 0
												? false
												: selectedObjects.length === precheckReport.length
											: false
									}
									color={"primary"}
									indeterminate={
										selectedObjects.length > 0 &&
										selectedObjects.length <
											(precheckReport ? precheckReport.length : 10)
									}
									onChange={handleSelectAll}
								/>
							</MC.TableCell>
							<MC.TableCell
								className={clsx(
									classes.body4,
									classes.tableHeadCell,
									classes.tableHeadCellFont
								)}
								align={"center"}
							>
								작성일
							</MC.TableCell>
							<MC.TableCell
								className={clsx(
									classes.body4,
									classes.tableHeadCell,
									classes.tableHeadCellFont
								)}
								align={"center"}
							>
								구분
							</MC.TableCell>
							<MC.TableCell
								className={clsx(classes.body4, classes.tableHeadCell)}
								align={"center"}
							>
								내용
							</MC.TableCell>
							<MC.TableCell
								className={clsx(
									classes.body4,
									classes.tableHeadCell,
									classes.tableHeadCellFont
								)}
								align={"center"}
							>
								첨부
							</MC.TableCell>
						</MC.TableRow>
					)}
				</MC.TableHead>
				<MC.TableBody>
					{precheckReport ? (
						precheckReport.length === 0 ? (
							<MC.TableRow>
								<MC.TableCell colSpan={isMobile ? 2 : 5} align="center">
									조회된 사전점검 데이터가 한 건도 없네요.
								</MC.TableCell>
							</MC.TableRow>
						) : (
							precheckReport.map(objView)
						)
					) : (
						<MC.TableRow>
							<MC.TableCell colSpan={isMobile ? 2 : 5} align="center">
								<MC.CircularProgress color="secondary" />
							</MC.TableCell>
						</MC.TableRow>
					)}
				</MC.TableBody>
			</MC.Table>

			{/* <MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}
			         style={{ width: "100%", marginTop: 40 }}>
				<MC.Button
					size="large"
					disabled={selectedObjects.length === 0}
					disableElevation
					style={{ padding: 0, borderRadius: 0, width: 140, height: 40, border: "1px solid rgb(51, 51, 51, 0.2)", marginRight: 10 }}
					onClick={handleDeleteAllClick}>
					삭제
				</MC.Button>
				<MC.Button
					variant="contained"
					size="large"
					color="primary"
					disableElevation
					style={{ padding: 0, borderRadius: 0, width: 140, height: 40 }}
					onClick={handleOpenRegisterPage}>
					사전점검일 예약
				</MC.Button>
			</MC.Grid> */}

			{/* <MC.Grid
				container
				direction={"row"}
				justify={"center"}
				alignItems={"center"}
				style={{ width: "100%", marginTop: 49 }}
			>
				<ML.Pagination
					count={getTotalPage()}
					page={pageInfo.page}
					onChange={handlePageChange}
					showFirstButton
					showLastButton
				/>
			</MC.Grid> */}
		</div>
	);
};

export default PreCheckDetailsTable;
