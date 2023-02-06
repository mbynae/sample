import React, { forwardRef, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import filesize from "filesize";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { AlertDialog, DateFormat } from "../../../../../components";
import { Comments } from "../../components";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FormDialog from "components/FormDialog";

import { apiObject } from "repositories/api";

const useStyles = MS.makeStyles((theme) => ({
	tableCellTitle: {
		width: "70%",
		height: 80,
	},
	tableCell: {
		width: "25%",
	},
	tableCellDescriptionFull: {
		width: "85%",
		maxWidth: "85%",
	},
	buttonLayoutRight: {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "center",
	},
	wrapIcon: {
		verticalAlign: "middle",
		display: "inline-flex",
	},
	dotIcon: {
		width: 4,
		height: 4,
		margin: "8 10",
		backgroundColor: "#c4c4c4",
	},
	h6: {
		...theme.typography.h6,
	},
	body4: {
		...theme.typography.body4,
		// height:     24,
		fontWeight: 500,
		// lineHeight: "24px"
	},
	dividerVertical: {
		width: "1px",
		height: "12px",
		margin: "12px 10px",
		backgroundColor: "#ebebeb",
	},
	qlEditor: {
		"& img": {
			[theme.breakpoints.down("xs")]: {
				width: "100%",
			},
		},
	},
}));

const ArticleDetailForm = (props) => {
	const classes = useStyles();

	const {
		isMobile,
		rootUrl,
		menuKey,
		article,
		beforeArticle,
		afterArticle,
		getArticle,
		history,
		UserSignInStore,
	} = props;

	const isAuthor =
		JSON.parse(localStorage.getItem("UserSignInStore")).currentUser.id ==
		article.author.id;

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
	});

	const [noteOpen, setNoteOpen] = useState(false);
	const noteRef = useRef(null);

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

	const goOtherArticle = (obj, id) => {
		if (!isSecretView(obj)) {
			history.push(`${rootUrl}/articles/${menuKey}/${id}`);
		}
	};

	const checkFleMarket = () => menuKey === "fleaMarket";

	const isSecretView = (obj) => {
		return obj.isSecret && obj.author.id !== UserSignInStore.currentUser.id;
	};

	const generateTitle = (obj, isCommentCount = false) => {
		let title = "";

		if (menuKey !== "suggestions") {
			title += `[ ${obj.category.name} ] `;
		}
		if (menuKey === "fleaMarket" && obj.transactionType) {
			title += ` ${
				obj.transactionType === "RESERVATION"
					? "(예약중)"
					: obj.transactionType === "TRADING"
					? "(거래중)"
					: obj.transactionType === "TRANSACTION_COMPLETE"
					? "(거래완료)"
					: obj.transactionType === "TRANSACTION_STATUS" && ""
			} `;
		}
		title += obj.title;
		if (isCommentCount) {
			if (
				menuKey === "complaints" ||
				menuKey === "fleaMarket" ||
				menuKey === "freeBoard" ||
				menuKey === "suggestions"
			) {
				if (obj.comments.length > 0) {
					title += ` [${obj.comments.length}]`;
				}
			}
		}
		return title;
	};

	const NoteForm = forwardRef((props, ref) => {
		const receiver = article.author.aptComplex
			? article.author.accountType === "MANAGEMENT_OFFICE_MANAGER"
				? `관리자`
				: `${article.author.userDataType.building}동 ${article.author.userDataType.nickName}`
			: article.author.name;
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
					helperText={
						<MC.Grid container justify="space-between">
							<MC.Typography
								variant="subtitle2"
								color="textSecondary"
							></MC.Typography>
							<MC.Typography variant="subtitle2" color="textSecondary">
								1000 byte
							</MC.Typography>
						</MC.Grid>
					}
					placeholder="내용을 입력해주세요."
					style={{ marginTop: 8 }}
				/>
			</MC.FormControl>
		);
	});

	const handleNoteOpen = () => {
		const authenticated = JSON.parse(
			localStorage.getItem("UserSignInStore")
		).authenticated;
		if (!authenticated) {
			handleAlertToggle(
				"isOpen",
				"로그인 후 이용할 수 있습니다.",
				undefined,
				() => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				}
			);
		} else {
			setNoteOpen(true);
		}
	};

	const createNote = async () => {
		const content = noteRef.current.value;
		if (!content) {
			return;
		}
		const params = {
			aptId: article.author.aptComplex.id,
			title: "",
			content: content,
			receiverId: article.author.id,
		};

		try {
			const response = await apiObject.createNote(params);
			if (response.id) {
				setNoteOpen(false);
				handleAlertToggle("isOpen", "쪽지가 전송되었습니다.", undefined, () => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				});
			}
		} catch (error) {
			console.log({ error });
			setNoteOpen(false);
			handleAlertToggle(
				"isOpen",
				"쪽지가 전송되지 않았습니다. 다시 시도해주세요.",
				undefined,
				() => {
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				}
			);
		}
	};

	return (
		<div>
			<MC.Table>
				<MC.TableBody>
					{/*제목 + 작성자 + 작성일*/}
					<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
						<MC.TableCell
							colSpan={isMobile ? 3 : 2}
							className={clsx(classes.tableCellTitle, classes.h6)}
							style={{
								textDecoration:
									checkFleMarket() &&
									article.transactionType === "TRANSACTION_COMPLETE"
										? "line-through"
										: "none",
							}}
						>
							{isMobile ? (
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
												menuKey === "fleaMarket" &&
												article.transactionType === "TRANSACTION_COMPLETE"
													? "line-through"
													: "none",
										}}
									>
										{generateTitle(article)}
									</MC.Grid>
									<MC.Grid item style={{ marginTop: 8 }}>
										<MC.Grid
											container
											direction={"row"}
											justify={"flex-end"}
											alignItems={"center"}
											className={classes.body4}
										>
											{article.author.aptComplex
												? article.author.accountType ===
												  "MANAGEMENT_OFFICE_MANAGER"
													? `관리자`
													: `${article.author.userDataType.building}동 ${article.author.userDataType.nickName}`
												: article.author.name}

											{!isAuthor &&
											(menuKey === "freeBoard" || menuKey === "fleaMarket") ? (
												<MC.IconButton
													onClick={handleNoteOpen}
													style={{ color: "#222222" }}
												>
													<MailOutlineIcon />
												</MC.IconButton>
											) : (
												<>
													&nbsp;
													<div className={classes.dotIcon} />
													&nbsp;
												</>
											)}
											{
												article.baseDateDataType.createDate ?
													<DateFormat
														date={article.baseDateDataType.createDate}
														format={"YYYY.MM.DD"}
													/>
													:
													""
											}
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							) : (
								<>{generateTitle(article)}</>
							)}
						</MC.TableCell>

						{!isMobile && (
							<MC.TableCell className={clsx(classes.tableCell, classes.body4)}>
								<MC.Grid
									container
									direction={"row"}
									justify={"flex-end"}
									alignItems={"center"}
								>
									{article.author.aptComplex
										? article.author.accountType === "MANAGEMENT_OFFICE_MANAGER"
											? `관리자`
											: `${article.author.userDataType.building}동 ${article.author.userDataType.nickName}`
										: article.author.name}
									{!isAuthor &&
									(menuKey === "freeBoard" || menuKey === "fleaMarket") ? (
										<MC.IconButton
											onClick={handleNoteOpen}
											style={{ color: "#222222" }}
										>
											<MailOutlineIcon />
										</MC.IconButton>
									) : (
										<>
											&nbsp;
											<div className={classes.dotIcon} />
											&nbsp;
										</>
									)}
									{
										article.baseDateDataType.createDate ?
											<DateFormat
												date={article.baseDateDataType.createDate}
												format={"YYYY.MM.DD"}
											/>
											:
											""
									}
								</MC.Grid>
							</MC.TableCell>
						)}
					</MC.TableRow>
					{/*본문*/}
					<MC.TableRow>
						<MC.TableCell colSpan={3}>
							{article.attachmentDataTypes.map((x) => {
								return (
									<>
										{x.fileExtension === "pdf" && (
											<iframe
												src={`https://docs.google.com/gview?url=${x.fileUrl}&embedded=true`}
												style={{
													width: "100%",
													maxWidth: 824,
													aspectRatio: "824/1216",
													margin: "0 auto",
													display: "block",
												}}
												frameborder="0"
											/>
										)}
									</>
								);
							})}
							<div
								className={clsx("ql-editor", classes.qlEditor)}
								dangerouslySetInnerHTML={{ __html: article.content }}
								style={{ minHeight: 398, maxHeight: "none" }}
							></div>
						</MC.TableCell>
					</MC.TableRow>

					{/*첨부파일*/}
					<MC.TableRow>
						<MC.TableCell
							colSpan={3}
							style={{ backgroundColor: "#fafafa", height: 60 }}
						>
							<MC.Grid
								container
								justify={"flex-start"}
								alignItems={"flex-start"}
							>
								<MC.Grid item style={{ marginTop: 5 }}>
									<GetAppIcon style={{ marginTop: 0, marginRight: 12 }} />
								</MC.Grid>
								<MC.Grid item xs={10} md={10} style={{ display: "flex" }}>
									{article.attachmentDataTypes &&
									article.attachmentDataTypes.length > 0 ? (
										<MC.Grid container spacing={1} style={{ marginTop: 3 }}>
											{article.attachmentDataTypes.map((file, index) => (
												<MC.Grid item xs={12} md={12} key={index}>
													<MC.Typography className={classes.body4}>
														<MC.Link
															href={file.fileUrl}
															target="_blank"
															download
															style={{ color: "#333333" }}
														>
															{file.fileOriginalName} ({filesize(file.fileSize)}
															)
														</MC.Link>
													</MC.Typography>
												</MC.Grid>
											))}
										</MC.Grid>
									) : (
										<MC.Grid
											container
											direction={"row"}
											justify={"flex-start"}
											alignItems={"flex-start"}
											style={{ height: 29, marginTop: 7 }}
										>
											<MC.Grid item>
												<MC.Typography className={classes.body4}>
													{"첨부된 파일이 없습니다."}
												</MC.Typography>
											</MC.Grid>
										</MC.Grid>
									)}
								</MC.Grid>
							</MC.Grid>
						</MC.TableCell>
					</MC.TableRow>

					{/*댓글*/}
					{(menuKey === "complaints" ||
						menuKey === "suggestions" ||
						menuKey === "freeBoard" ||
						menuKey === "fleaMarket") && (
						<MC.TableRow>
							<MC.TableCell
								colSpan={3}
								style={{ paddingTop: 25, paddingLeft: 0, paddingRight: 0 }}
							>
								<Comments
									UserSignInStore={UserSignInStore}
									getArticle={getArticle}
									article={article}
									articleId={article.id}
									comments={article.comments}
									handleAlertToggle={handleAlertToggle}
									setAlertOpens={setAlertOpens}
								/>
							</MC.TableCell>
						</MC.TableRow>
					)}

					{/*다음글*/}
					{afterArticle && afterArticle.id ? (
						<>
							<MC.TableRow>
								<MC.TableCell
									colSpan={isMobile ? 3 : 0}
									onClick={() => goOtherArticle(afterArticle, afterArticle.id)}
									style={{ paddingLeft: 10, paddingRight: 10 }}
								>
									{isMobile ? (
										<MC.Grid
											container
											direction={"row"}
											justify={"flex-start"}
											alignItems={"center"}
										>
											<MC.Grid item>
												<MC.Typography
													className={clsx(classes.wrapIcon, classes.body4)}
												>
													<ExpandLessIcon
														fontSize="small"
														style={{ marginRight: 12 }}
													/>{" "}
													{"다음글"}
												</MC.Typography>
											</MC.Grid>
											<MC.Grid item className={classes.dividerVertical} />
											<MC.Grid item style={{ width: 130, overflow: "hidden" }}>
												<MC.Typography
													className={classes.body4}
													style={{
														width: 120,
														textOverflow: "ellipsis",
														overflow: "hidden",
														whiteSpace: "nowrap",
													}}
												>
													{isSecretView(afterArticle) ? (
														"비공개 건의사항"
													) : (
														<>{generateTitle(afterArticle, true)}</>
													)}
												</MC.Typography>
											</MC.Grid>
											<MC.Grid item>
												{afterArticle && (
													<DateFormat
														date={afterArticle.baseDateDataType.createDate}
														format={"YYYY.MM.DD"}
													/>
												)}
											</MC.Grid>
										</MC.Grid>
									) : (
										<>
											<MC.Typography
												className={clsx(classes.wrapIcon, classes.body4)}
											>
												<ExpandLessIcon
													fontSize="small"
													style={{ marginRight: 12 }}
												/>{" "}
												{"다음글"}
											</MC.Typography>
										</>
									)}
								</MC.TableCell>
								{!isMobile && (
									<>
										<MC.TableCell
											style={{
												width: "60%",
												cursor: "pointer",
												textDecoration:
													checkFleMarket() &&
													afterArticle.transactionType ===
														"TRANSACTION_COMPLETE"
														? "line-through"
														: "none",
											}}
											onClick={() =>
												goOtherArticle(afterArticle, afterArticle.id)
											}
										>
											{isSecretView(afterArticle) ? (
												"비공개 건의사항"
											) : (
												<>{generateTitle(afterArticle, true)}</>
											)}
										</MC.TableCell>
										<MC.TableCell
											className={clsx(classes.tableCell, classes.body4)}
										>
											<MC.Grid
												container
												direction={"row"}
												justify={"flex-end"}
												alignItems={"center"}
											>
												{!isMobile && (
													<>
														{isSecretView(afterArticle) ? (
															"비공개"
														) : (
															<>
																{afterArticle &&
																	(afterArticle.author.aptComplex
																		? afterArticle.author.accountType ===
																		  "MANAGEMENT_OFFICE_MANAGER"
																			? `관리자`
																			: `${afterArticle.author.userDataType.building}동 ${afterArticle.author.userDataType.nickName}`
																		: afterArticle.author.name)}
															</>
														)}
														&nbsp;
														<div className={classes.dotIcon} />
														&nbsp;
													</>
												)}
												{afterArticle && (
													<DateFormat
														date={afterArticle.baseDateDataType.createDate}
														format={"YYYY.MM.DD"}
													/>
												)}
											</MC.Grid>
										</MC.TableCell>
									</>
								)}
							</MC.TableRow>
						</>
					) : undefined}

					{/*이전글*/}
					{beforeArticle && beforeArticle.id ? (
						<>
							<MC.TableRow>
								<MC.TableCell
									colSpan={isMobile ? 3 : 0}
									onClick={() =>
										goOtherArticle(beforeArticle, beforeArticle.id)
									}
									style={{ paddingLeft: 10, paddingRight: 10 }}
								>
									{isMobile ? (
										<MC.Grid
											container
											direction={"row"}
											justify={"flex-start"}
											alignItems={"center"}
										>
											<MC.Grid item>
												<MC.Typography
													className={clsx(classes.wrapIcon, classes.body4)}
												>
													<ExpandMoreIcon
														fontSize="small"
														style={{ marginRight: 12 }}
													/>{" "}
													{"이전글"}
												</MC.Typography>
											</MC.Grid>
											<MC.Grid item className={classes.dividerVertical} />
											<MC.Grid item style={{ width: 130, overflow: "hidden" }}>
												<MC.Typography
													className={classes.body4}
													style={{
														width: 120,
														textOverflow: "ellipsis",
														overflow: "hidden",
														whiteSpace: "nowrap",
													}}
												>
													{isSecretView(beforeArticle) ? (
														"비공개 건의사항"
													) : (
														<>{generateTitle(beforeArticle, true)}</>
													)}
												</MC.Typography>
											</MC.Grid>
											<MC.Grid item>
												{beforeArticle && (
													<DateFormat
														date={beforeArticle.baseDateDataType.createDate}
														format={"YYYY.MM.DD"}
													/>
												)}
											</MC.Grid>
										</MC.Grid>
									) : (
										<>
											<MC.Typography
												className={clsx(classes.wrapIcon, classes.body4)}
											>
												<ExpandMoreIcon
													fontSize="small"
													style={{ marginRight: 12 }}
												/>{" "}
												{"이전글"}
											</MC.Typography>
										</>
									)}
								</MC.TableCell>

								{!isMobile && (
									<>
										<MC.TableCell
											style={{
												width: "60%",
												cursor: "pointer",
												textDecoration:
													checkFleMarket() &&
													beforeArticle.transactionType ===
														"TRANSACTION_COMPLETE"
														? "line-through"
														: "none",
											}}
											onClick={() =>
												goOtherArticle(beforeArticle, beforeArticle.id)
											}
										>
											{isSecretView(beforeArticle) ? (
												"비공개 건의사항"
											) : (
												<>{generateTitle(beforeArticle, true)}</>
											)}
										</MC.TableCell>
										<MC.TableCell
											className={clsx(classes.tableCell, classes.body4)}
										>
											<MC.Grid
												container
												direction={"row"}
												justify={"flex-end"}
												alignItems={"center"}
											>
												{!isMobile && (
													<>
														{isSecretView(beforeArticle) ? (
															"비공개"
														) : (
															<>
																{beforeArticle &&
																	(beforeArticle.author.aptComplex
																		? beforeArticle.author.accountType ===
																		  "MANAGEMENT_OFFICE_MANAGER"
																			? `관리자`
																			: `${beforeArticle.author.userDataType.building}동 ${beforeArticle.author.userDataType.nickName}`
																		: beforeArticle.author.name)}
															</>
														)}
														&nbsp;
														<div className={classes.dotIcon} />
														&nbsp;
													</>
												)}
												{beforeArticle && (
													<DateFormat
														date={beforeArticle.baseDateDataType.createDate}
														format={"YYYY.MM.DD"}
													/>
												)}
											</MC.Grid>
										</MC.TableCell>
									</>
								)}
							</MC.TableRow>
						</>
					) : undefined}
				</MC.TableBody>
			</MC.Table>

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
			<FormDialog
				isOpen={noteOpen}
				title={"쪽지 보내기"}
				content={<NoteForm ref={noteRef} />}
				handleClose={() => {
					setNoteOpen(false);
				}}
				onSubmit={createNote}
			/>
		</div>
	);
};

export default ArticleDetailForm;
