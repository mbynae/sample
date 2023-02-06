import React, { useEffect, useState } from "react";
import clsx from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import AddCommentIcon from "@material-ui/icons/AddComment";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ReplyIcon from "@material-ui/icons/Reply";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import CloseIcon from "@material-ui/icons/Close";

import { CDivider, DateFormat } from "../../../../../components";

import { commentRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles((theme) => ({
	commentLayout: {
		borderBottom: "1px solid rgb(238, 238, 238)",
	},
	margin: {
		margin: theme.spacing(1),
	},
	padding: {
		padding: theme.spacing(1),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
	inputLabelLayout: {
		"& fieldset legend": {
			width: 200,
		},
	},
	inputAdornmentLayout: {
		position: "absolute",
		right: 20,
		bottom: 24,
	},
	paperLayout: {
		padding: 10,
	},
}));
const Comments = (props) => {
	const classes = useStyles();

	const {
		SignInStore,
		getArticle,
		article,
		articleId,
		comments,
		handleAlertToggle,
		setAlertOpens,
	} = props;
	const [currentUser, setCurrentUser] = useState({
		...SignInStore.currentUser,
	});
	const [commentTotalCount, setCommentTotalCount] = useState(comments.length);
	const [tempComments, setTempComments] = useState([...comments]);
	const [newComment, setNewComment] = useState({ content: "" });
	const [isNewComment, setIsNewComment] = useState(true);

	const sort = (a, b) =>
		a.baseDateDataType.createDate - b.baseDateDataType.createDate;

	useEffect(() => {
		const init = () => {
			let nowComments = comments;
			setCommentTotalCount(nowComments.length);
			setTempComments((prev) => {
				prev = nowComments.filter(
					(comment) => comment.parentCommentId === null
				);
				prev.map((comment) => {
					comment.isEdit = false;
					comment.isReply = false;
					comment.childComments.map((childComment) => {
						childComment.isEdit = false;
					});
				});

				return [...prev];
			});
		};

		setTimeout(() => {
			init();
		});
	}, [comments]);

	const initForms = (isEdit) => {
		setNewComment({ content: "" });
		setIsNewComment(!isEdit);
		setTempComments((prev) => {
			prev.map((comment) => {
				comment.isEdit = false;
				comment.isReply = false;
				comment.childComments.map((childComment) => {
					childComment.isEdit = false;
				});
			});
			return [...prev];
		});
	};

	const handleNewReplyForm = async (index, isNewReply) => {
		initForms(isNewReply);
		setTempComments((prev) => {
			prev[index].isReply = isNewReply;
			return [...prev];
		});
	};

	const handleEditForm = async (index, isEdit, isChildComment, childIndex) => {
		initForms(isEdit);
		if (!isChildComment) {
			setTempComments((prev) => {
				prev[index].isEdit = isEdit;
				return [...prev];
			});
		} else {
			setTempComments((prev) => {
				prev[index].childComments[childIndex].isEdit = isEdit;
				return [...prev];
			});
		}
	};

	const handleChangeComment = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setNewComment((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const handleCreate = (parentId) => {
		let createRequestParams = {
			content: newComment.content,
			articleId: articleId,
		};
		if (parentId) {
			createRequestParams.parent = parentId;
		}
		commentRepository.saveComment(createRequestParams).then((result) => {
			handleAlertToggle(
				"isOpen",
				"댓글 등록 완료",
				"댓글을 등록 하였습니다.",
				() => {
					getArticle(articleId);
					setNewComment({ content: "" });
					setIsNewComment(true);
					setAlertOpens((prev) => {
						return { ...prev, isOpen: false };
					});
				}
			);
		});
	};

	const handleUpdate = (comment, parentId) => {
		let updateRequestParams = {
			content: comment.content,
			articleId: articleId,
		};
		if (parentId) {
			updateRequestParams.parent = parentId;
		}
		commentRepository
			.updateComment(comment.id, updateRequestParams)
			.then((result) => {
				handleAlertToggle(
					"isOpen",
					"댓글 수정 완료",
					"댓글을 수정 하였습니다.",
					() => {
						getArticle(articleId);
						setIsNewComment(true);
						setAlertOpens((prev) => {
							return { ...prev, isOpen: false };
						});
					}
				);
			});
	};

	const handleDelete = (id) => {
		handleAlertToggle(
			"isConfirmOpen",
			"댓글 삭제",
			"댓글에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 댓글을 삭제하겠습니까?",
			async () => {
				await setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
				commentRepository.removeComment(id).then(() => {
					handleAlertToggle(
						"isOpen",
						"삭제완료",
						"댓글을 삭제 하였습니다.",
						() => {
							getArticle(articleId);
							setAlertOpens((prev) => {
								return { ...prev, isOpen: false };
							});
						}
					);
				});
			},
			() => {
				// 삭제안하기
				setAlertOpens((prev) => {
					return { ...prev, isConfirmOpen: false };
				});
			}
		);
	};

	return (
		<MC.Grid container spacing={1}>
			<MC.Grid item xs={12} md={12}>
				<MC.Typography variant={"h5"}>댓글({commentTotalCount})</MC.Typography>
			</MC.Grid>

			<CDivider />

			{/*댓글 목록*/}
			<MC.Grid item xs={12} md={12}>
				{tempComments &&
					tempComments.length > 0 &&
					tempComments.sort(sort).map((comment, index) => (
						<MC.Grid container key={"comment-" + index}>
							{/*상위 댓글*/}
							{!comment.isEdit ? (
								// 상위 댓글
								<MC.Grid item xs={12} md={12}>
									<MC.Grid
										container
										direction={"row"}
										className={clsx(classes.padding, classes.commentLayout)}
									>
										<MC.Grid item xs={10} md={10}>
											<MC.Grid container>
												<MC.Grid item xs={12} md={12}>
													<MC.Typography variant={"h6"}>
														{comment.author.accountType ===
														"MANAGEMENT_OFFICE_MANAGER"
															? "관리자"
															: `${comment.author.userDataType.building}동 ${comment.author.userDataType.nickName}`}
													</MC.Typography>
												</MC.Grid>
												<MC.Grid item xs={12} md={12}>
													<MC.Typography
														variant={"body1"}
														style={{ whiteSpace: "pre-line" }}
													>
														{comment.content}
													</MC.Typography>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
										<MC.Grid item xs={2} md={2}>
											<MC.Grid
												container
												justify={"flex-end"}
												alignItems={"flex-start"}
												style={{ height: "100%" }}
											>
												<MC.Grid item xs={12} md={12}>
													<MC.Grid
														container
														justify={"flex-end"}
														alignItems={"center"}
														style={{ height: "100%" }}
													>
														<DateFormat
															date={comment.baseDateDataType.createDate}
														/>
														<MC.Grid
															container
															justify={"flex-end"}
															alignItems={"center"}
															style={{ height: "100%" }}
														>
															<MC.IconButton
																aria-label="reply"
																onClick={() => handleNewReplyForm(index, true)}
															>
																<ReplyIcon fontSize="small" />
															</MC.IconButton>
															{comment.author.id === currentUser.id && (
																<>
																	<MC.IconButton
																		aria-label="edit"
																		onClick={() =>
																			handleEditForm(index, true, false)
																		}
																	>
																		<EditIcon fontSize="small" />
																	</MC.IconButton>
																	<MC.IconButton
																		aria-label="delete"
																		onClick={() => handleDelete(comment.id)}
																	>
																		<DeleteIcon fontSize="small" />
																	</MC.IconButton>
																</>
															)}
														</MC.Grid>
													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							) : (
								// 상위 댓글 수정폼
								<MC.Grid item xs={12} md={12}>
									<MC.Paper className={classes.paperLayout} variant="outlined">
										<MC.Grid container spacing={1}>
											<MC.Grid item xs={12} md={12}>
												<MC.FormControl fullWidth variant="outlined">
													<MC.InputLabel
														variant="outlined"
														htmlFor="outlined-adornment-content"
													>
														{currentUser.accountType ===
														"MANAGEMENT_OFFICE_MANAGER"
															? "관리자"
															: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`}
													</MC.InputLabel>
													<MC.OutlinedInput
														id="outlined-adornment-content"
														aria-describedby="outlined-adornment-content-helper-text"
														name="content"
														value={comment.content || ""}
														label={
															currentUser.accountType ===
															"MANAGEMENT_OFFICE_MANAGER"
																? "관리자"
																: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`
														}
														multiline
														rows={4}
														onChange={(event) => {
															let value = event.target.value;
															setTempComments((prev) => {
																prev[index].content = value;
																return [...prev];
															});
														}}
														inputProps={{
															maxLength: 3000,
														}}
														endAdornment={
															<MC.InputAdornment
																position="end"
																className={classes.inputAdornmentLayout}
															>
																<MC.IconButton
																	aria-label="toggle password visibility"
																	onClick={() => handleUpdate(comment)}
																>
																	<AddCommentIcon />
																</MC.IconButton>
																<MC.IconButton
																	aria-label="toggle password visibility"
																	onClick={() =>
																		handleEditForm(index, false, false)
																	}
																>
																	<CloseIcon />
																</MC.IconButton>
															</MC.InputAdornment>
														}
													/>
													<MC.FormHelperText id="outlined-adornment-content-helper-text">
														{comment.content.length + " / 3000"}
													</MC.FormHelperText>
												</MC.FormControl>
											</MC.Grid>
										</MC.Grid>
									</MC.Paper>
								</MC.Grid>
							)}

							{
								// 상위 댓글의 하위 댓글 등록 폼
								comment.isReply && (
									<MC.Grid item xs={12} md={12}>
										<MC.Paper
											className={classes.paperLayout}
											variant="outlined"
										>
											<MC.Grid container spacing={1}>
												<MC.Grid item xs={1} md={1}>
													<MC.Grid
														container
														justify={"center"}
														alignItems={"center"}
														style={{ height: "100%" }}
													>
														<MC.Grid item xs={12} md={12}>
															<MC.Grid
																container
																justify={"center"}
																alignItems={"center"}
																style={{ height: "100%" }}
															>
																<MC.IconButton aria-label="reReply">
																	<SubdirectoryArrowRightIcon fontSize="small" />
																</MC.IconButton>
															</MC.Grid>
														</MC.Grid>
													</MC.Grid>
												</MC.Grid>
												<MC.Grid item xs={11} md={11}>
													<MC.FormControl fullWidth variant="outlined">
														<MC.InputLabel
															variant="outlined"
															htmlFor="outlined-adornment-content"
														>
															{currentUser.accountType ===
															"MANAGEMENT_OFFICE_MANAGER"
																? "관리자"
																: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`}
														</MC.InputLabel>
														<MC.OutlinedInput
															id="outlined-adornment-content"
															aria-describedby="outlined-adornment-content-helper-text"
															name="content"
															value={newComment.content || ""}
															label={
																currentUser.accountType ===
																"MANAGEMENT_OFFICE_MANAGER"
																	? "관리자"
																	: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`
															}
															multiline
															rows={4}
															onChange={handleChangeComment}
															inputProps={{
																maxLength: 3000,
															}}
															endAdornment={
																<MC.InputAdornment
																	position="end"
																	className={classes.inputAdornmentLayout}
																>
																	<MC.IconButton
																		aria-label="toggle password visibility"
																		onClick={() => handleCreate(comment.id)}
																	>
																		<AddCommentIcon />
																	</MC.IconButton>
																	<MC.IconButton
																		aria-label="toggle password visibility"
																		onClick={() =>
																			handleNewReplyForm(index, false)
																		}
																	>
																		<CloseIcon />
																	</MC.IconButton>
																</MC.InputAdornment>
															}
														/>
														<MC.FormHelperText id="outlined-adornment-content-helper-text">
															{newComment.content.length + " / 3000"}
														</MC.FormHelperText>
													</MC.FormControl>
												</MC.Grid>
											</MC.Grid>
										</MC.Paper>
									</MC.Grid>
								)
							}

							{/*하위 댓글*/}
							{comment.childComments &&
								comment.childComments.length > 0 &&
								comment.childComments
									.sort(sort)
									.map((childComment, childIndex) => (
										<MC.Grid
											container
											key={"childComment-" + index + "-" + childIndex}
										>
											{!childComment.isEdit ? (
												// 하위 댓글
												<MC.Grid item xs={12} md={12}>
													<MC.Grid
														container
														direction={"row"}
														className={clsx(
															classes.padding,
															classes.commentLayout
														)}
													>
														<MC.Grid item xs={1} md={1}>
															<MC.Grid
																container
																justify={"center"}
																alignItems={"center"}
																style={{ height: "100%" }}
															>
																<MC.Grid item xs={12} md={12}>
																	<MC.Grid
																		container
																		justify={"center"}
																		alignItems={"center"}
																		style={{ height: "100%" }}
																	>
																		<MC.IconButton aria-label="reReply">
																			<SubdirectoryArrowRightIcon fontSize="small" />
																		</MC.IconButton>
																	</MC.Grid>
																</MC.Grid>
															</MC.Grid>
														</MC.Grid>
														<MC.Grid item xs={9} md={9}>
															<MC.Grid container>
																<MC.Grid item xs={12} md={12}>
																	<MC.Typography variant={"h6"}>
																		{childComment.author.accountType ===
																		"MANAGEMENT_OFFICE_MANAGER"
																			? "관리자"
																			: `${childComment.author.userDataType.building}동 ${childComment.author.userDataType.nickName}`}
																	</MC.Typography>
																</MC.Grid>
																<MC.Grid item xs={12} md={12}>
																	<MC.Typography
																		variant={"body1"}
																		style={{ whiteSpace: "pre-line" }}
																	>
																		{childComment.content}
																	</MC.Typography>
																</MC.Grid>
															</MC.Grid>
														</MC.Grid>
														<MC.Grid item xs={2} md={2}>
															<MC.Grid
																container
																justify={"flex-end"}
																alignItems={"flex-start"}
																style={{ height: "100%" }}
															>
																<MC.Grid item xs={12} md={12}>
																	<MC.Grid
																		container
																		justify={"flex-end"}
																		alignItems={"center"}
																		style={{ height: "100%" }}
																	>
																		<DateFormat
																			date={
																				childComment.baseDateDataType.createDate
																			}
																		/>
																		<MC.Grid
																			container
																			justify={"flex-end"}
																			alignItems={"center"}
																			style={{ height: "100%" }}
																		>
																			{childComment.author.id ===
																				currentUser.id && (
																				<>
																					<MC.IconButton
																						aria-label="edit"
																						onClick={() =>
																							handleEditForm(
																								index,
																								true,
																								true,
																								childIndex
																							)
																						}
																					>
																						<EditIcon fontSize="small" />
																					</MC.IconButton>
																					<MC.IconButton
																						aria-label="delete"
																						onClick={() =>
																							handleDelete(childComment.id)
																						}
																					>
																						<DeleteIcon fontSize="small" />
																					</MC.IconButton>
																				</>
																			)}
																		</MC.Grid>
																	</MC.Grid>
																</MC.Grid>
															</MC.Grid>
														</MC.Grid>
													</MC.Grid>
												</MC.Grid>
											) : (
												// 하위 댓글 수정폼
												<MC.Grid item xs={12} md={12}>
													<MC.Paper
														className={classes.paperLayout}
														variant="outlined"
													>
														<MC.Grid container spacing={1}>
															<MC.Grid item xs={1} md={1}>
																<MC.Grid
																	container
																	justify={"center"}
																	alignItems={"center"}
																	style={{ height: "100%" }}
																>
																	<MC.Grid item xs={12} md={12}>
																		<MC.Grid
																			container
																			justify={"center"}
																			alignItems={"center"}
																			style={{ height: "100%" }}
																		>
																			<MC.IconButton aria-label="reReply">
																				<SubdirectoryArrowRightIcon fontSize="small" />
																			</MC.IconButton>
																		</MC.Grid>
																	</MC.Grid>
																</MC.Grid>
															</MC.Grid>
															<MC.Grid item xs={11} md={11}>
																<MC.FormControl fullWidth variant="outlined">
																	<MC.InputLabel
																		variant="outlined"
																		htmlFor="outlined-adornment-content"
																	>
																		{currentUser.accountType ===
																		"MANAGEMENT_OFFICE_MANAGER"
																			? "관리자"
																			: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`}
																	</MC.InputLabel>
																	<MC.OutlinedInput
																		id="outlined-adornment-content"
																		aria-describedby="outlined-adornment-content-helper-text"
																		name="content"
																		value={childComment.content || ""}
																		label={
																			currentUser.accountType ===
																			"MANAGEMENT_OFFICE_MANAGER"
																				? "관리자"
																				: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`
																		}
																		multiline
																		rows={4}
																		onChange={(event) => {
																			let value = event.target.value;
																			setTempComments((prev) => {
																				prev[index].childComments[
																					childIndex
																				].content = value;
																				return [...prev];
																			});
																		}}
																		inputProps={{
																			maxLength: 3000,
																		}}
																		endAdornment={
																			<MC.InputAdornment
																				position="end"
																				className={classes.inputAdornmentLayout}
																			>
																				<MC.IconButton
																					aria-label="toggle password visibility"
																					onClick={() =>
																						handleUpdate(
																							childComment,
																							comment.id
																						)
																					}
																				>
																					<AddCommentIcon />
																				</MC.IconButton>
																				<MC.IconButton
																					aria-label="toggle password visibility"
																					onClick={() =>
																						handleEditForm(
																							index,
																							false,
																							true,
																							childIndex
																						)
																					}
																				>
																					<CloseIcon />
																				</MC.IconButton>
																			</MC.InputAdornment>
																		}
																	/>
																	<MC.FormHelperText id="outlined-adornment-content-helper-text">
																		{childComment.content.length + " / 3000"}
																	</MC.FormHelperText>
																</MC.FormControl>
															</MC.Grid>
														</MC.Grid>
													</MC.Paper>
												</MC.Grid>
											)}
										</MC.Grid>
									))}
						</MC.Grid>
					))}
			</MC.Grid>

			{/*신규 댓글 입력폼*/}
			{isNewComment && (
				<MC.Grid item xs={12} md={12}>
					<MC.Paper className={classes.paperLayout} variant="outlined">
						<MC.Grid container spacing={1}>
							<MC.Grid item xs={12} md={12}>
								<MC.FormControl fullWidth variant="outlined">
									<MC.InputLabel
										variant="outlined"
										htmlFor="outlined-adornment-content"
									>
										{currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER"
											? "관리자"
											: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`}
									</MC.InputLabel>
									<MC.OutlinedInput
										id="outlined-adornment-content"
										aria-describedby="outlined-adornment-content-helper-text"
										name="content"
										value={newComment.content || ""}
										label={
											currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER"
												? "관리자"
												: `${currentUser.userDataType.building}동 ${currentUser.userDataType.nickName}`
										}
										multiline
										rows={4}
										onChange={handleChangeComment}
										inputProps={{
											maxLength: 3000,
										}}
										endAdornment={
											<MC.InputAdornment
												position="end"
												className={classes.inputAdornmentLayout}
											>
												<MC.IconButton
													aria-label="toggle password visibility"
													onClick={() => handleCreate()}
													edge="end"
												>
													<AddCommentIcon />
												</MC.IconButton>
											</MC.InputAdornment>
										}
									/>
									<MC.FormHelperText id="outlined-adornment-content-helper-text">
										{newComment.content.length + " / 3000"}
									</MC.FormHelperText>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
					</MC.Paper>
				</MC.Grid>
			)}
		</MC.Grid>
	);
};

export default Comments;
