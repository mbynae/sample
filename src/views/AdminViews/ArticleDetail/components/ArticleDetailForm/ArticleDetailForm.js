import React, { useState } from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat } from "../../../../../components";
import filesize from "filesize";

import PublishIcon from "@material-ui/icons/Publish";
import GetAppIcon from "@material-ui/icons/GetApp";

import { Comments } from "../../components";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3),
	},
	content: {
		marginTop: theme.spacing(2),
	},
	cardHeader: {
		color: theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight,
	},
	cardContent: {},
	tableCellTitle: {
		width: "70%",
	},
	tableCell: {
		width: "15%",
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
}));

const ArticleDetailForm = (props) => {
	const classes = useStyles();

	const {
		rootUrl,
		menuKey,
		article,
		beforeArticle,
		afterArticle,
		getArticle,
		history,
		SignInStore,
	} = props;

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

	const goOtherArticle = (id) => {
		history.push(`${rootUrl}/articles/${menuKey}/${id}`);
	};

	const checkFleMarket = () => menuKey === "fleaMarket";

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

	return (
		<MC.Card>
			<MC.CardContent className={classes.cardContent}>
				<MC.Table>
					<MC.TableBody>
						{/*제목*/}
						<MC.TableRow>
							<MC.TableCell
								colSpan={2}
								className={classes.tableCellTitle}
								style={{
									textDecoration:
										checkFleMarket() &&
										article.transactionType === "TRANSACTION_COMPLETE"
											? "line-through"
											: "none",
								}}
							>
								{generateTitle(article)}
							</MC.TableCell>
							<MC.TableCell className={classes.tableCell}>
								{article.author.aptComplex
									? article.author.accountType === "MANAGEMENT_OFFICE_MANAGER"
										? `관리자`
										: `${article.author.userDataType.building}동 ${article.author.userDataType.unit}호 ${article.author.userDataType.nickName}`
									: article.author.name}
							</MC.TableCell>
							<MC.TableCell className={classes.tableCell}>
								<DateFormat date={article.baseDateDataType.createDate} />
							</MC.TableCell>
						</MC.TableRow>

						{/*본문*/}
						<MC.TableRow>
							<MC.TableCell colSpan={4}>
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
									className="ql-editor"
									dangerouslySetInnerHTML={{ __html: article.content }}
									style={{ minHeight: 398, maxHeight: "none" }}
								></div>
							</MC.TableCell>
						</MC.TableRow>

						{/*답변*/}
						{menuKey === "ticket" && (
							<>
								<MC.TableRow>
									<MC.TableCell colSpan={4} style={{ borderBottom: "none" }}>
										<MC.Grid container spacing={1}>
											<MC.Grid item xs={6} md={6}>
												<MC.Grid
													container
													direction="row"
													justify="flex-start"
													alignItems="center"
													style={{ height: "100%" }}
												>
													<MC.Typography variant={"h5"}>답변</MC.Typography>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
									</MC.TableCell>
								</MC.TableRow>

								{article.isReply ? (
									<MC.TableRow>
										<MC.TableCell colSpan={4}>
											<MC.Grid item xs={12} md={12}>
												<MC.Grid container spacing={1}>
													<MC.Grid item xs={6} md={6}>
														<MC.Typography
															variant={"h6"}
															style={{ fontWeight: "bold" }}
														>
															{article.replyArticle
																? article.replyArticle.author.name
																: ""}
														</MC.Typography>
													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
											<MC.Grid item xs={12} md={12}>
												<MC.Grid container spacing={1}>
													<MC.Grid item xs={10} md={10}>
														<MC.Typography variant={"body1"}>
															{article.replyArticle
																? article.replyArticle.content
																: ""}
														</MC.Typography>
													</MC.Grid>
													<MC.Grid item xs={2} md={2}>
														<DateFormat
															date={
																article.replyArticle
																	? article.replyArticle.baseDateDataType
																			.createDate
																	: new Date()
															}
														/>
													</MC.Grid>
												</MC.Grid>
											</MC.Grid>
										</MC.TableCell>
									</MC.TableRow>
								) : (
									<MC.TableRow>
										<MC.TableCell colSpan={4}>
											<MC.Grid item xs={12} md={12}>
												<MC.Typography variant={"body1"}>
													아직 답변이 없습니다.
												</MC.Typography>
											</MC.Grid>
										</MC.TableCell>
									</MC.TableRow>
								)}
							</>
						)}

						{/*첨부파일*/}
						<MC.TableRow>
							<MC.TableCell colSpan={4}>
								<MC.Grid container>
									<MC.Grid item xs={2} md={2} style={{ display: "flex" }}>
										<MC.Typography>첨부파일</MC.Typography>
									</MC.Grid>
									<MC.Grid item xs={10} md={10} style={{ display: "flex" }}>
										{article.attachmentDataTypes &&
										article.attachmentDataTypes.length > 0 ? (
											<MC.Grid container spacing={1}>
												{article.attachmentDataTypes.map((file, index) => (
													<MC.Grid item xs={12} md={12} key={index}>
														<MC.Typography variant="body2">
															<MC.Link
																href={file.fileUrl}
																target="_blank"
																download
															>
																{file.fileOriginalName} (
																{filesize(file.fileSize)})
															</MC.Link>
														</MC.Typography>
													</MC.Grid>
												))}
											</MC.Grid>
										) : (
											<MC.Typography variant="body2">
												{"첨부된 파일이 없습니다."}
											</MC.Typography>
										)}
									</MC.Grid>
								</MC.Grid>
							</MC.TableCell>
						</MC.TableRow>

						{(menuKey === "complaints" ||
							menuKey === "suggestions" ||
							menuKey === "freeBoard" ||
							menuKey === "fleaMarket") && (
							<MC.TableRow>
								<MC.TableCell colSpan={4} style={{ border: "none" }}>
									<Comments
										SignInStore={SignInStore}
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
									<MC.TableCell>
										<MC.Typography className={classes.wrapIcon}>
											{"다음 글"}
											<PublishIcon fontSize="small" />
										</MC.Typography>
									</MC.TableCell>
									<MC.TableCell
										style={{
											width: "60%",
											cursor: "pointer",
											textDecoration:
												checkFleMarket() &&
												afterArticle.transactionType === "TRANSACTION_COMPLETE"
													? "line-through"
													: "none",
										}}
										onClick={() => goOtherArticle(afterArticle.id)}
									>
										{generateTitle(afterArticle, true)}
									</MC.TableCell>
									<MC.TableCell className={classes.tableCell}>
										{afterArticle &&
											(afterArticle.author.aptComplex
												? afterArticle.author.accountType ===
												  "MANAGEMENT_OFFICE_MANAGER"
													? `관리자`
													: `${afterArticle.author.userDataType.building}동 ${afterArticle.author.userDataType.nickName}`
												: afterArticle.author.name)}
									</MC.TableCell>
									<MC.TableCell className={classes.tableCell}>
										{afterArticle && (
											<DateFormat
												date={afterArticle.baseDateDataType.createDate}
											/>
										)}
									</MC.TableCell>
								</MC.TableRow>
							</>
						) : undefined}

						{/*이전글*/}
						{beforeArticle && beforeArticle.id ? (
							<>
								<MC.TableRow>
									<MC.TableCell>
										<MC.Typography className={classes.wrapIcon}>
											{"이전 글"}
											<GetAppIcon fontSize="small" />
										</MC.Typography>
									</MC.TableCell>
									<MC.TableCell
										style={{
											width: "60%",
											cursor: "pointer",
											textDecoration:
												checkFleMarket() &&
												beforeArticle.transactionType === "TRANSACTION_COMPLETE"
													? "line-through"
													: "none",
										}}
										onClick={() => goOtherArticle(beforeArticle.id)}
									>
										{generateTitle(beforeArticle, true)}
									</MC.TableCell>
									<MC.TableCell className={classes.tableCell}>
										{beforeArticle &&
											(beforeArticle.author.aptComplex
												? beforeArticle.author.accountType ===
												  "MANAGEMENT_OFFICE_MANAGER"
													? `관리자`
													: `${beforeArticle.author.userDataType.building}동 ${beforeArticle.author.userDataType.nickName}`
												: beforeArticle.author.name)}
									</MC.TableCell>
									<MC.TableCell className={classes.tableCell}>
										{beforeArticle && (
											<DateFormat
												date={beforeArticle.baseDateDataType.createDate}
											/>
										)}
									</MC.TableCell>
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
			</MC.CardContent>
		</MC.Card>
	);
};

export default ArticleDetailForm;
