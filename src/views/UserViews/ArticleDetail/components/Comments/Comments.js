import React, { useEffect, useState } from "react";
import clsx                           from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";

import { DateFormat } from "../../../../../components";

import { commentRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles((theme) => ({
	commentLayout:        {
		borderBottom: "1px solid rgb(238, 238, 238)"
	},
	margin:               {
		margin: theme.spacing(1)
	},
	padding:              {
		padding: theme.spacing(1)
	},
	extendedIcon:         {
		marginRight: theme.spacing(1)
	},
	inputLabelLayout:     {
		"& fieldset legend": {
			width: 200
		}
	},
	inputAdornmentLayout: {
		position: "absolute",
		right:    15,
		bottom:   30
	},
	paperLayout:          {
		padding: 0,
		border:  0
	},
	body4:                {
		...theme.typography.body4,
		// height:     24,
		fontWeight: 500
	},
	dotIcon:              {
		width:           4,
		height:          4,
		margin:          "8 10",
		backgroundColor: "#c4c4c4"
	},
	childCommentButton:   {
		padding:         0,
		borderRadius:    0,
		width:           50,
		height:          20,
		backgroundColor: "transparent",
		color:           "#666666"
	}
}));

const Comments = props => {
	const classes = useStyles();

	const { UserSignInStore, getArticle, article, articleId, comments, handleAlertToggle, setAlertOpens } = props;
	const [currentUser, setCurrentUser] = useState({ ...UserSignInStore.currentUser });
	const [commentTotalCount, setCommentTotalCount] = useState(comments.length);
	const [tempComments, setTempComments] = useState([...comments]);
	const [newComment, setNewComment] = useState({ content: "" });
	const [isNewComment, setIsNewComment] = useState(true);

	const sort = (a, b) => a.baseDateDataType.createDate - b.baseDateDataType.createDate;

	useEffect(() => {
		const init = () => {
			let nowComments = comments;
			setCommentTotalCount(nowComments.length);
			setTempComments(prev => {
				prev = nowComments.filter(comment => comment.parentCommentId === null);
				prev.map(comment => {
					comment.isEdit = false;
					comment.isReply = false;
					comment.childComments.map(childComment => {
						childComment.isEdit = false;
					});
				});

				return [
					...prev
				];
			});
		};

		setTimeout(() => {
			init();
		});
	}, [comments]);

	const initForms = (isEdit) => {
		setNewComment({ content: "" });
		setIsNewComment(!isEdit);
		setTempComments(prev => {
			prev.map(comment => {
				comment.isEdit = false;
				comment.isReply = false;
				comment.childComments.map(childComment => {
					childComment.isEdit = false;
				});
			});
			return [...prev];
		});
	};

	const handleNewReplyForm = async (index, isNewReply) => {
		initForms(isNewReply);
		setTempComments(prev => {
			prev[index].isReply = isNewReply;
			return [...prev];
		});
	};

	const handleEditForm = async (index, isEdit, isChildComment, childIndex) => {
		initForms(isEdit);
		if (isEdit) {
			if ( !isChildComment ) {
				setTempComments(prev => {
					prev[index].isEdit = isEdit;
					return [...prev];
				});
			} else {
				setTempComments(prev => {
					prev[index].childComments[childIndex].isEdit = isEdit;
					return [...prev];
				});
			}
		}
		else {
			getArticle(articleId);
		}
	};

	const handleChangeComment = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setNewComment(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	const handleCreate = (parentId) => {
		let createRequestParams = {
			content:   newComment.content,
			articleId: articleId
		};
		if ( parentId ) {
			createRequestParams.parent = parentId;
		}
		commentRepository
			.saveComment(createRequestParams, true)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"?????? ?????? ??????",
					"????????? ?????? ???????????????.",
					() => {
						getArticle(articleId);
						setNewComment({ content: "" });
						setIsNewComment(true);
						setAlertOpens(prev => { return { ...prev, isOpen: false };});
					}
				);
			});
	};

	const handleUpdate = (comment, parentId) => {
		let updateRequestParams = {
			content:   comment.content,
			articleId: articleId
		};
		if ( parentId ) {
			updateRequestParams.parent = parentId;
		}
		commentRepository
			.updateComment(comment.id, updateRequestParams, true)
			.then(result => {
				handleAlertToggle(
					"isOpen",
					"?????? ?????? ??????",
					"????????? ?????? ???????????????.",
					() => {
						getArticle(articleId);
						setIsNewComment(true);
						setAlertOpens(prev => { return { ...prev, isOpen: false };});
					}
				);
			});
	};

	const handleDelete = (id) => {
		handleAlertToggle(
			"isConfirmOpen",
			"?????? ??????",
			"????????? ????????? ?????? ???????????? ????????? ?????????. \n ????????? ????????? ??????????????????????",
			async () => {
				await setAlertOpens(prev => { return { ...prev, isConfirmOpen: false };});
				commentRepository
					.removeComment(id, true)
					.then(() => {
						handleAlertToggle(
							"isOpen",
							"????????????",
							"????????? ?????? ???????????????.",
							() => {
								getArticle(articleId);
								setAlertOpens(prev => { return { ...prev, isOpen: false };});
							}
						);
					});
			},
			() => {
				// ???????????????
				setAlertOpens(prev => { return { ...prev, isConfirmOpen: false };});
			}
		);
	};

	return (
		<MC.Grid container spacing={1}>
			<MC.Grid item xs={12} md={12}>
				<MC.Typography variant={"subtitle1"}>
					??????&nbsp; <span style={{ color: "#449CE8" }}>{commentTotalCount}</span>
				</MC.Typography>
			</MC.Grid>

			{/*?????? ?????? ?????????*/}
			{
				currentUser.id && isNewComment &&
				<MC.Grid item xs={12} md={12}>
					<MC.Paper className={classes.paperLayout} variant="outlined">
						<MC.Grid container>
							<MC.Grid item xs={12} md={12}>
								<MC.FormControl fullWidth variant="outlined">
									<MC.InputLabel
										variant="outlined"
										htmlFor="outlined-adornment-content">
										{
											currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
												"?????????"
												:
												`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
										}
									</MC.InputLabel>
									<MC.OutlinedInput
										id="outlined-adornment-content"
										aria-describedby="outlined-adornment-content-helper-text"
										name="content"
										value={newComment.content || ""}
										label={
											currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
												"?????????"
												:
												`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
										}
										multiline
										placeholder={"????????? ????????????."}
										rows={4}
										onChange={handleChangeComment}
										inputProps={{
											maxLength: 3000
										}}
										endAdornment={
											<MC.InputAdornment position="end" className={classes.inputAdornmentLayout}>
												<MC.Button
													size="large"
													disableElevation
													disabled={newComment.content === ""}
													style={{ padding: 0, borderRadius: 0, width: 80, height: 30, backgroundColor: "#fafafa" }}
													onClick={() => handleCreate()}>
													??????
												</MC.Button>
											</MC.InputAdornment>
										}
									/>
									<MC.FormHelperText id="outlined-adornment-content-helper-text">{newComment.content.length + " / 3000"}</MC.FormHelperText>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
					</MC.Paper>
				</MC.Grid>
			}

			{/*<CDivider />*/}

			{/*?????? ??????*/}
			<MC.Grid item xs={12} md={12} style={{ marginTop: 20 }}>
				{
					tempComments && tempComments.length > 0 &&
					tempComments.sort(sort).map((comment, index) => (

						<MC.Grid container key={"comment-" + index}>

							{/*?????? ??????*/}
							{
								!comment.isEdit ?
									(
										// ?????? ??????
										<MC.Grid item xs={12} md={12}>
											<MC.Grid container
											         direction={"row"}
											         className={clsx(classes.padding, classes.commentLayout)}>
												<MC.Grid item xs={12} md={12}>
													<MC.Grid container>
														<MC.Grid item xs={12} md={12}>
															<MC.Typography className={classes.body4} style={{ fontWeight: "bold" }}>
																{
																	comment.author.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
																		"?????????"
																		:
																		`${comment.author.userDataType.building}??? ${comment.author.userDataType.nickName}`
																}
															</MC.Typography>
														</MC.Grid>
														<MC.Grid item xs={12} md={12} style={{ marginTop: 10 }}>
															<MC.Typography className={classes.body4} style={{ fontWeight: "normal", whiteSpace: "pre-line" }}>
																{comment.content}
															</MC.Typography>
														</MC.Grid>
														<MC.Grid item xs={12} md={12} style={{ marginTop: 10 }}>
															<MC.Grid container justify={"flex-start"} alignItems={"flex-start"} style={{ height: "100%" }}>
																<MC.Grid item xs={12} md={12}>
																	<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
																		<MC.Grid item style={{ height: 20 }}>
																			<MC.Typography className={classes.body4} style={{ color: "#929292" }}>
																				<DateFormat date={comment.baseDateDataType.createDate} format={"YYYY.MM.DD"} />
																			</MC.Typography>
																		</MC.Grid>
																		{
																			currentUser.id &&
																			<>
																				<div className={classes.dotIcon} style={{ marginLeft: 10 }} />
																				<MC.Button
																					size="small"
																					disableElevation
																					className={classes.childCommentButton}
																					onClick={() => handleNewReplyForm(index, true)}>
																					????????????
																				</MC.Button>
																			</>
																		}
																		{
																			comment.author.id === currentUser.id &&
																			(
																				<>
																					<div className={classes.dotIcon} />
																					<MC.Button
																						size="small"
																						disableElevation
																						className={classes.childCommentButton}
																						onClick={() => handleEditForm(index, true, false)}>
																						??????
																					</MC.Button>
																					<div className={classes.dotIcon} />
																					<MC.Button
																						size="small"
																						disableElevation
																						className={classes.childCommentButton}
																						onClick={() => handleDelete(comment.id)}>
																						??????
																					</MC.Button>
																				</>
																			)
																		}

																	</MC.Grid>
																</MC.Grid>
															</MC.Grid>
														</MC.Grid>
													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
									)
									:
									(
										// ?????? ?????? ?????????
										<MC.Grid item xs={12} md={12}>
											{/*<MC.Paper className={classes.paperLayout} variant="outlined">*/}
											<MC.Grid container
											         direction={"row"}
											         className={clsx(classes.padding, classes.commentLayout)}>
												<MC.Grid item xs={12} md={12}>
													<MC.FormControl fullWidth variant="outlined">
														<MC.InputLabel
															variant="outlined"
															htmlFor="outlined-adornment-content">
															{
																currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
																	"?????????"
																	:
																	`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
															}
														</MC.InputLabel>
														<MC.OutlinedInput
															id="outlined-adornment-content"
															aria-describedby="outlined-adornment-content-helper-text"
															name="content"
															value={comment.content || ""}
															label={
																currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
																	"?????????"
																	:
																	`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
															}
															multiline
															rows={4}
															onChange={(event) => {
																let value = event.target.value;
																setTempComments(prev => {
																	prev[index].content = value;
																	return [
																		...prev
																	];
																});
															}}
															inputProps={{
																maxLength: 3000
															}}
															endAdornment={
																<MC.InputAdornment position="end" className={classes.inputAdornmentLayout}>
																	<MC.Button
																		size="large"
																		disableElevation
																		style={{ padding: 0, borderRadius: 0, width: 80, height: 30, backgroundColor: "#fafafa" }}
																		onClick={() => handleUpdate(comment)}>
																		??????
																	</MC.Button>
																	<MC.Button
																		size="large"
																		disableElevation
																		style={{ padding: 0, borderRadius: 0, width: 80, height: 30, backgroundColor: "#fafafa" }}
																		onClick={() => handleEditForm(index, false, false)}>
																		??????
																	</MC.Button>
																</MC.InputAdornment>
															}
														/>
														<MC.FormHelperText id="outlined-adornment-content-helper-text">{comment.content.length + " / 3000"}</MC.FormHelperText>
													</MC.FormControl>
												</MC.Grid>
											</MC.Grid>
											{/*</MC.Paper>*/}
										</MC.Grid>
									)
							}

							{
								// ?????? ????????? ?????? ?????? ?????? ???
								comment.isReply &&
								<MC.Grid item xs={12} md={12}>
									{/*<MC.Paper className={classes.paperLayout} variant="outlined">*/}
									<MC.Grid container
									         direction={"row"}
									         className={clsx(classes.padding, classes.commentLayout)}>
										<MC.Grid item>
											<MC.Grid container justify={"flex-start"} alignItems={"flex-start"} style={{ height: "100%" }}>
												<MC.Grid item xs={12} md={12}>
													<SubdirectoryArrowRightIcon fontSize="small" />
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
										<MC.Grid item style={{ width: "95%" }}>
											<MC.FormControl fullWidth variant="outlined">
												<MC.InputLabel
													variant="outlined"
													htmlFor="outlined-adornment-content">
													{
														currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
															"?????????"
															:
															`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
													}
												</MC.InputLabel>
												<MC.OutlinedInput
													id="outlined-adornment-content"
													aria-describedby="outlined-adornment-content-helper-text"
													name="content"
													value={newComment.content || ""}
													label={
														currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
															"?????????"
															:
															`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
													}
													multiline
													rows={4}
													onChange={handleChangeComment}
													inputProps={{
														maxLength: 3000
													}}
													endAdornment={
														<MC.InputAdornment position="end" className={classes.inputAdornmentLayout}>
															<MC.Button
																size="large"
																disableElevation
																style={{ padding: 0, borderRadius: 0, width: 80, height: 30, backgroundColor: "#fafafa" }}
																onClick={() => handleCreate(comment.id)}>
																??????
															</MC.Button>
															<MC.Button
																size="large"
																disableElevation
																style={{ padding: 0, borderRadius: 0, width: 80, height: 30, backgroundColor: "#fafafa" }}
																onClick={() => handleNewReplyForm(index, false)}>
																??????
															</MC.Button>
														</MC.InputAdornment>
													}
												/>
												<MC.FormHelperText id="outlined-adornment-content-helper-text">{newComment.content.length + " / 3000"}</MC.FormHelperText>
											</MC.FormControl>
										</MC.Grid>
									</MC.Grid>
									{/*</MC.Paper>*/}
								</MC.Grid>
							}

							{/*?????? ??????*/}
							{
								comment.childComments && comment.childComments.length > 0 &&
								comment.childComments.sort(sort).map((childComment, childIndex) => (
									<MC.Grid container key={"childComment-" + index + "-" + childIndex}>

										{
											!childComment.isEdit ?
												(
													// ?????? ??????
													<MC.Grid item xs={12} md={12}>
														<MC.Grid container
														         direction={"row"}
														         className={clsx(classes.padding, classes.commentLayout)}>

															<MC.Grid item>
																<MC.Grid container justify={"flex-start"} alignItems={"flex-start"} style={{ height: "100%" }}>
																	<MC.Grid item xs={12} md={12}>
																		<SubdirectoryArrowRightIcon fontSize="small" />
																	</MC.Grid>
																</MC.Grid>
															</MC.Grid>

															<MC.Grid item>
																<MC.Grid container>
																	<MC.Grid item xs={12} md={12}>
																		<MC.Typography className={classes.body4} style={{ fontWeight: "bold" }}>
																			{
																				childComment.author.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
																					"?????????"
																					:
																					`${childComment.author.userDataType.building}??? ${childComment.author.userDataType.nickName}`
																			}
																		</MC.Typography>
																	</MC.Grid>
																	<MC.Grid item xs={12} md={12} style={{ marginTop: 10 }}>
																		<MC.Typography className={classes.body4} style={{ fontWeight: "normal", whiteSpace: "pre-line" }}>
																			{childComment.content}
																		</MC.Typography>
																	</MC.Grid>
																	<MC.Grid item xs={12} md={12} style={{ marginTop: 10 }}>
																		<MC.Grid container justify={"flex-start"} alignItems={"flex-start"} style={{ height: "100%" }}>
																			<MC.Grid item xs={12} md={12}>
																				<MC.Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
																					<MC.Grid item style={{ height: 20 }}>
																						<MC.Typography className={classes.body4} style={{ color: "#929292" }}>
																							<DateFormat date={childComment.baseDateDataType.createDate} format={"YYYY.MM.DD"} />
																						</MC.Typography>
																					</MC.Grid>
																					{
																						childComment.author.id === currentUser.id &&
																						(
																							<>
																								<div className={classes.dotIcon} style={{ marginLeft: 10 }} />
																								<MC.Button
																									size="small"
																									disableElevation
																									className={classes.childCommentButton}
																									onClick={() => handleEditForm(index, true, true, childIndex)}>
																									??????
																								</MC.Button>
																								<div className={classes.dotIcon} />
																								<MC.Button
																									size="small"
																									disableElevation
																									className={classes.childCommentButton}
																									onClick={() => handleDelete(childComment.id)}>
																									??????
																								</MC.Button>
																							</>
																						)
																					}
																				</MC.Grid>
																			</MC.Grid>
																		</MC.Grid>
																	</MC.Grid>
																</MC.Grid>
															</MC.Grid>

														</MC.Grid>
													</MC.Grid>
												)
												:
												(
													// ?????? ?????? ?????????
													<MC.Grid item xs={12} md={12}>
														{/*<MC.Paper className={classes.paperLayout} variant="outlined">*/}
														<MC.Grid container
														         direction={"row"}
														         className={clsx(classes.padding, classes.commentLayout)}>
															<MC.Grid item>
																<MC.Grid container justify={"flex-start"} alignItems={"flex-start"} style={{ height: "100%" }}>
																	<SubdirectoryArrowRightIcon fontSize="small" />
																</MC.Grid>
															</MC.Grid>
															<MC.Grid item style={{ width: "95%" }}>
																<MC.FormControl fullWidth variant="outlined">
																	<MC.InputLabel
																		variant="outlined"
																		htmlFor="outlined-adornment-content">
																		{
																			currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
																				"?????????"
																				:
																				`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
																		}
																	</MC.InputLabel>
																	<MC.OutlinedInput
																		id="outlined-adornment-content"
																		aria-describedby="outlined-adornment-content-helper-text"
																		name="content"
																		value={childComment.content || ""}
																		label={
																			currentUser.accountType === "MANAGEMENT_OFFICE_MANAGER" ?
																				"?????????"
																				:
																				`${currentUser.userDataType.building}??? ${currentUser.userDataType.nickName}`
																		}
																		multiline
																		rows={4}
																		onChange={(event) => {
																			let value = event.target.value;
																			setTempComments(prev => {
																				prev[index].childComments[childIndex].content = value;
																				return [
																					...prev
																				];
																			});
																		}}
																		inputProps={{
																			maxLength: 3000
																		}}
																		endAdornment={
																			<MC.InputAdornment position="end" className={classes.inputAdornmentLayout}>
																				<MC.Button
																					size="large"
																					disableElevation
																					style={{ padding: 0, borderRadius: 0, width: 80, height: 30, backgroundColor: "#fafafa" }}
																					onClick={() => handleUpdate(childComment, comment.id)}>
																					??????
																				</MC.Button>
																				<MC.Button
																					size="large"
																					disableElevation
																					style={{ padding: 0, borderRadius: 0, width: 80, height: 30, backgroundColor: "#fafafa" }}
																					onClick={() => handleEditForm(index, false, true, childIndex)}>
																					??????
																				</MC.Button>
																			</MC.InputAdornment>
																		}
																	/>
																	<MC.FormHelperText id="outlined-adornment-content-helper-text">
																		{childComment.content.length + " / 3000"}
																	</MC.FormHelperText>
																</MC.FormControl>
															</MC.Grid>
														</MC.Grid>
														{/*</MC.Paper>*/}
													</MC.Grid>
												)
										}
									</MC.Grid>
								))
							}
						</MC.Grid>
					))

				}
			</MC.Grid>

		</MC.Grid>
	);
};

export default Comments;
