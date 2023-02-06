import React, {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as ML from "@material-ui/lab";

import { DateFormat } from "../../../../../components";
import { apiObject } from "repositories/api";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import FormDialog from "components/FormDialog";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		width: "100%",
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
		},
	},
	tableHead: {
		height: 50,
		minHeight: 50,
		maxHeight: 50,
		backgroundColor: "transparent",
	},
	tableRow: {
		height: 50,
		minHeight: 50,
		maxHeight: 50,
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
		width: "20%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width: "25%",
		},
	},
}));

const useDetailStyle = makeStyles((theme) => ({
	divider: {
		height: 2,
		backgroundColor: "rgb(34, 34, 34)",
		marginTop: "45px",
		marginBottom: "16px",
	},
	root: {
		"& table": {
			width: "100%",
			borderCollapse: "collapse",
		},
		"& tr": {
			borderBottom: "1px solid #eeeeee",
		},
		"& td": {
			padding: theme.spacing(2),
		},
	},
	label: {
		width: "20%",
		maxWidth: 200,
		backgroundColor: "#f2f2f2",
	},
	noBorder: {
		border: "none",
	},
	buttonGroup: {
		marginTop: theme.spacing(5),
		"& button": {
			width: 80,
			[theme.breakpoints.up("sm")]: {
				width: 140,
			},
		},
	},
}));

const noteDetailInit = {
	open: false,
	content: "",
	createDate: Date.now(),
	deleteDate: Date.now(),
	dong_numb: "",
	id: 0,
	memb_name: "",
	receiverId: 0,
	senderId: 0,
	title: "",
};

const NoteForm = forwardRef((props, ref) => {
	const { noteDetail } = props;
	const receiver = `${noteDetail.dong_numb}동 ${noteDetail.memb_name}`;

	return (
		<MC.FormControl fullWidth>
			<MC.Typography>{`받는 사람 : ${receiver}`}</MC.Typography>
			<MC.TextField
				id="content-basic"
				name="content"
				multiline
				rows={8}
				variant="outlined"
				inputProps={{
					maxLength: 1000,
				}}
				inputRef={ref}
				placeholder="내용을 입력해주세요."
				style={{ marginTop: 8 }}
			/>
			<MC.Grid container justify="space-between">
				<MC.Typography
					component={"div"}
					variant="subtitle2"
					color="textSecondary"
				></MC.Typography>
				<MC.Typography
					component={"div"}
					variant="subtitle2"
					color="textSecondary"
				>
					1000 byte
				</MC.Typography>
			</MC.Grid>
		</MC.FormControl>
	);
});

const NoteDetail = (props) => {
	const {
		noteDetail,
		setNoteDetail,
		handleDelete,
		handleAlertToggle,
		setAlertOpens,
		listNote,
	} = props;
	const classes = useDetailStyle();
	const [noteOpen, setNoteOpen] = useState(false);
	const noteRef = useRef(null);

	const createNote = useCallback(async () => {
		const content = noteRef.current.value;
		if (!content) {
			return;
		}
		const params = {
			aptId: "",
			title: "",
			content: content,
			receiverId: noteDetail.senderId,
		};
		try {
			const response = await apiObject.createNote(params);
			if (response.id) {
				setNoteOpen(false);
				handleAlertToggle(
					"isOpen",
					undefined,
					"쪽지가 전송되었습니다.",
					undefined,
					() => {
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
					}
				);
			}
		} catch (error) {
			console.log({ error });
			setNoteOpen(false);
			handleAlertToggle(
				"isOpen",
				undefined,
				"쪽지가 전송되지 않았습니다. 다시 시도해주세요.",
				undefined,
				() => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				}
			);
		}
	}, []);

	const handleDetailDelete = async ({ id }) => {
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"정말 지우시겠습니까?",
			"확인",
			async () => {
				await setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
				try {
					await apiObject.deleteNote({ id: [noteDetail.id] });
					handleAlertToggle(
						"isOpen",
						undefined,
						"해당 쪽지는 삭제되었습니다",
						undefined,
						() => {
							setAlertOpens((prev) => {
								return { ...prev, isOpen: false };
							});
							setNoteDetail((prev) => ({
								open: false,
								...noteDetailInit,
							}));
						}
					);
					await listNote();
				} catch (error) {
					console.log({ error });
					handleAlertToggle(
						"isOpen",
						undefined,
						"쪽지가 삭제되지 않았습니다. 다시 시도해주세요.",
						undefined,
						() => {
							setAlertOpens((prev) => {
								return { ...prev, isOpen: false };
							});
						}
					);
				}
			},
			"취소",
			() => {
				setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	return (
		<>
			<MC.Divider variant="fullWidth" className={classes.divider} />
			<MC.Paper className={classes.root}>
				<table>
					<tbody>
						<tr>
							<td className={classes.label}>
								<MC.Typography align="center">보낸 사람</MC.Typography>
							</td>
							<td className={classes.content}>
								<MC.Typography>{`${noteDetail.dong_numb}동 ${noteDetail.memb_name}`}</MC.Typography>
							</td>
						</tr>
						<tr>
							<td className={classes.label}>
								<MC.Typography align="center">받은 시간</MC.Typography>
							</td>
							<td className={classes.content}>
								<MC.Typography>
									<DateFormat
										date={noteDetail.createDate}
										format={"YYYY.MM.DD"}
									/>
								</MC.Typography>
							</td>
						</tr>
						<tr>
							<td className={classes.label}>
								<MC.Typography align="center">쪽지 내용</MC.Typography>
							</td>
							<td>
								<MC.TextField
									fullWidth
									multiline
									rows={10}
									variant="outlined"
									InputProps={{
										classes: { notchedOutline: classes.noBorder },
									}}
									value={noteDetail.content}
								></MC.TextField>
							</td>
						</tr>
					</tbody>
				</table>
			</MC.Paper>
			<MC.Grid
				container
				justify="space-between"
				className={classes.buttonGroup}
			>
				<MC.Grid item>
					<MC.Button
						variant="outlined"
						size="large"
						onClick={() => {
							setNoteDetail((prev) => ({
								open: false,
								...noteDetailInit,
							}));
						}}
					>
						목록
					</MC.Button>
				</MC.Grid>
				<MC.Grid item>
					<MC.Grid container spacing={1}>
						<MC.Grid item>
							<MC.Button
								variant="contained"
								size="large"
								color="secondary"
								onClick={() => {
									handleDetailDelete({ id: [noteDetail.id] });
								}}
							>
								삭제
							</MC.Button>
						</MC.Grid>
						<MC.Grid item>
							<MC.Button
								variant="contained"
								size="large"
								color="primary"
								onClick={() => {
									setNoteOpen((prev) => !prev);
								}}
							>
								답장
							</MC.Button>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>
			<FormDialog
				isOpen={noteOpen}
				title={"쪽지 보내기"}
				content={<NoteForm noteDetail={noteDetail} ref={noteRef} />}
				handleClose={() => {
					setNoteOpen(false);
				}}
				onSubmit={createNote}
			/>
		</>
	);
};

const NoteList = (props) => {
	const classes = useStyles();

	const { value, isMobile, handleAlertToggle, setAlertOpens } = props;

	const [noteList, setNoteList] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page: 1,
		size: 10,
		total: 0,
	});
	const [selectedObjects, setSelectedObjects] = useState([]);
	const [isSelectAll, setIsSelectAll] = useState(false);
	const [noteDetail, setNoteDetail] = useState(noteDetailInit);

	const listNote = async (page = 1, size = 10) => {
		try {
			let result = await apiObject.listNote(
				{
					direction: "DESC",
					page: page - 1,
					size: size,
					sort: "baseDateDataType.createDate",
				},
				true
			);
			setNoteList(result.content ?? []);
			setPageInfo((prev) => {
				return {
					...prev,
					page: result.pageable.page + 1,
					total: result.total,
				};
			});
		} catch (error) {
			console.log({ error });
		}
	};

	const handleSelectAll = (event) => {
		let selectedList;
		if (event.target) {
			event.target.checked
				? (selectedList = noteList.map((contract) => contract))
				: (selectedList = []);
			setIsSelectAll(event.target.checked);
		} else {
			event
				? (selectedList = noteList.map((contract) => contract))
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

	const handleRowClick = (obj) => {
		setNoteDetail((prev) => ({
			...prev,
			open: true,
			...obj,
		}));
	};

	const handlePageChange = (event, page) => {
		setPageInfo((prev) => {
			return {
				...prev,
				page: page,
			};
		});
		listNote(page, pageInfo.size);
	};

	const getTotalPage = () => {
		let totalPage = Math.floor(pageInfo.total / pageInfo.size);
		if (pageInfo.total % pageInfo.size > 0) {
			totalPage++;
		}
		return totalPage;
	};

	const handleDelete = async ({ id }) => {
		handleAlertToggle(
			"isConfirmOpen",
			undefined,
			"정말 지우시겠습니까?",
			"확인",
			async () => {
				await setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
				try {
					await apiObject.deleteNote({ id: id });
					handleAlertToggle(
						"isOpen",
						undefined,
						"해당 쪽지는 삭제되었습니다",
						undefined,
						() => {
							setAlertOpens((prev) => {
								return { ...prev, isOpen: false };
							});
						}
					);
					await listNote();
				} catch (error) {
					console.log({ error });
					handleAlertToggle(
						"isOpen",
						undefined,
						"쪽지가 삭제되지 않았습니다. 다시 시도해주세요.",
						undefined,
						() => {
							setAlertOpens((prev) => {
								return { ...prev, isOpen: false };
							});
						}
					);
				}
			},
			"취소",
			() => {
				setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	const objView = (obj, index) => (
		<MC.TableRow
			className={classes.tableRow}
			hover
			style={{
				borderBottom: index === noteList.length - 1 && "2px solid #222222",
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

			{/*제목*/}
			{isMobile && (
				<MC.TableCell
					onClick={() => handleRowClick(obj)}
					className={classes.body4}
					style={{ color: "#222222", fontWeight: 500 }}
					align={"left"}
				>
					<MC.Grid
						container
						direction="column"
						justify={"center"}
						alignItems={"flex-start"}
					>
						<MC.Grid
							item
							style={{
								textDecoration:
									obj.menuKey === "fleaMarket" &&
									obj.transactionType === "TRANSACTION_COMPLETE"
										? "line-through"
										: "none",
								overflow: "hidden",
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
								width: "calc(100vw - 96px)",
							}}
						>
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
									{`보낸 사람 ${obj.dong_numb}동 ${obj.memb_name}`}
								</MC.Grid>
								<MC.Grid item style={{ color: "#dedede" }}>
									&nbsp;|&nbsp;
								</MC.Grid>
								<MC.Grid item style={{ fontSize: 12 }}>
									날짜&nbsp;
									<DateFormat date={obj.createDate} format={"YYYY.MM.DD"} />
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				</MC.TableCell>
			)}
			{!isMobile && (
				<>
					{/*보낸사람*/}
					<MC.TableCell
						onClick={() => handleRowClick(obj)}
						className={classes.body4}
						style={{ color: "#222222" }}
					>
						<MC.Typography
							noWrap
						>{`${obj.dong_numb}동 ${obj.memb_name}`}</MC.Typography>
					</MC.TableCell>

					{/*내용*/}
					<MC.TableCell
						onClick={() => handleRowClick(obj)}
						className={classes.body4}
						style={{ color: "#222222", maxWidth: "620px" }}
					>
						<MC.Typography noWrap>{obj.content}</MC.Typography>
					</MC.TableCell>

					{/*날짜*/}
					<MC.TableCell
						onClick={() => handleRowClick(obj)}
						className={classes.body4}
						style={{ color: "#222222" }}
					>
						<MC.Typography noWrap>
							<DateFormat date={obj.createDate} format={"YYYY.MM.DD"} />
						</MC.Typography>
					</MC.TableCell>
				</>
			)}
		</MC.TableRow>
	);

	useEffect(() => {
		setNoteDetail(noteDetailInit);
	}, [value]);

	useEffect(() => {
		const init = async () => {
			await listNote();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	return (
		<div hidden={value !== 6} className={classes.root}>
			{!noteDetail.open ? (
				<MC.Grid
					container
					direction={"column"}
					justify={"center"}
					alignItems={"center"}
				>
					<MC.Grid item style={{ width: "100%", marginTop: 45 }}>
						<PerfectScrollbar>
							<MC.Table>
								<MC.TableHead className={classes.tableHead}>
									{isMobile ? (
										<MC.TableRow
											className={classes.tableRow}
											style={{ borderTop: "2px solid #222222" }}
										>
											<MC.TableCell align={"center"} padding={"checkbox"}>
												<MC.Checkbox
													checked={
														noteList
															? noteList.length === 0
																? false
																: selectedObjects.length === noteList.length
															: false
													}
													color={"primary"}
													indeterminate={
														selectedObjects.length > 0 &&
														selectedObjects.length <
															(noteList ? noteList.length : 10)
													}
													onChange={handleSelectAll}
												/>
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell)}
												align={"left"}
												onClick={() => {
													handleSelectAll(!isSelectAll);
												}}
											>
												전체선택
											</MC.TableCell>
										</MC.TableRow>
									) : (
										<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
											<MC.TableCell align={"center"} padding={"checkbox"}>
												<MC.Checkbox
													checked={
														noteList
															? noteList.length === 0
																? false
																: selectedObjects.length === noteList.length
															: false
													}
													color={"primary"}
													indeterminate={
														selectedObjects.length > 0 &&
														selectedObjects.length <
															(noteList ? noteList.length : 10)
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
											>
												보낸사람
											</MC.TableCell>
											<MC.TableCell
												className={clsx(classes.body4, classes.tableHeadCell)}
											>
												내용
											</MC.TableCell>
											<MC.TableCell
												className={clsx(
													classes.body4,
													classes.tableHeadCell,
													classes.tableHeadCellFont
												)}
											>
												날짜
											</MC.TableCell>
										</MC.TableRow>
									)}
								</MC.TableHead>
								<MC.TableBody>
									{noteList ? (
										noteList.length === 0 ? (
											<MC.TableRow
												className={classes.tableRow}
												style={{ borderBottom: "2px solid #222222" }}
												hover
											>
												<MC.TableCell colSpan={4} align="center">
													받은 쪽지가 없습니다.
												</MC.TableCell>
											</MC.TableRow>
										) : (
											noteList.map(objView)
										)
									) : (
										<MC.TableRow
											className={classes.tableRow}
											style={{ borderBottom: "2px solid #222222" }}
											hover
										>
											<MC.TableCell colSpan={4} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
									)}
								</MC.TableBody>
							</MC.Table>
						</PerfectScrollbar>
					</MC.Grid>

					<MC.Grid item style={{ width: "100%", marginTop: 40 }}>
						<MC.Grid
							container
							direction={"row"}
							justify={isMobile ? "center" : "flex-end"}
							alignItems={"center"}
						>
							<MC.Button
								size="large"
								variant="contained"
								color="secondary"
								style={{ width: 140 }}
								onClick={() => {
									const targetDelete = selectedObjects.map((x) => x.id);
									handleDelete({ id: targetDelete });
								}}
								disabled={selectedObjects.length === 0}
							>
								삭제
							</MC.Button>
						</MC.Grid>
					</MC.Grid>

					<MC.Grid item style={{ width: "100%", marginTop: 49 }}>
						<MC.Grid
							container
							direction={"row"}
							justify={"center"}
							alignItems={"center"}
						>
							<ML.Pagination
								count={getTotalPage()}
								page={pageInfo.page}
								onChange={handlePageChange}
								showFirstButton
								showLastButton
							/>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
			) : (
				<NoteDetail
					noteDetail={noteDetail}
					setNoteDetail={setNoteDetail}
					handleDelete={handleDelete}
					handleAlertToggle={handleAlertToggle}
					setAlertOpens={setAlertOpens}
					listNote={listNote}
				/>
			)}
		</div>
	);
};

export default NoteList;
