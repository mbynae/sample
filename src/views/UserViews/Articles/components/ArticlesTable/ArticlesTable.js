import React, { useState } from "react";
import clsx from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import {
	AlertDialogUserView,
	DateFormat,
} from "../../../../../components";
import { CategoryTabs } from "../../components";
import * as ML from "@material-ui/lab";

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
		[theme.breakpoints.down("xs")]: {
			height: "auto",
			minHeight: "auto",
		},
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
			width: "25%",
		},
	},
}));

const ArticlesTable = (props) => {
	const classes = useStyles();
	const {
		className,
		history,
		isMobile,
		ArticleStore,
		board,
		currentUser,
		menuKey,
		rootUrl,
		getArticles,
		articles,
		categories,
		pageInfo,
		setPageInfo,
		staticContext,
		...rest
	} = props;

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		noTitle: "",
		yesTitle: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
		isOpenType: false,
		type: "",
	});
	const handleAlertToggle = (
		key,
		title,
		content,
		yesTitle,
		yesCallback,
		noTitle,
		noCallback,
		type
	) => {
		setAlertOpens((prev) => {
			return {
				...prev,
				title,
				content,
				noTitle,
				yesTitle,
				[key]: !alertOpens[key],
				yesFn: () => yesCallback(),
				noFn: () => noCallback(),
				type,
			};
		});
	};

	const [sizeOptions] = useState([10, 15, 30, 50, 100]);
	const [selectSizeOption, setSelectSizeOption] = useState(10);

	const handleSelectSizeOption = (event) => {
		setSelectSizeOption(event.target.value);
		setPageInfo((prev) => {
			return {
				...prev,
				page: 1,
				size: event.target.value,
			};
		});
		getArticles(1, event.target.value);
	};

	const handlePageChange = (event, page) => {
		setPageInfo((prev) => {
			return {
				...prev,
				page: page,
			};
		});
		getArticles(page, pageInfo.size);
	};

	const handleOpenRegisterPage = (event) => {
		if (menuKey !== "suggestions" && categories.length === 0) {
			handleAlertToggle(
				"isOpen",
				undefined,
				"카테고리를 먼저 등록이 필요합니다. 카테고리를 먼저 등록 해주세요.",
				undefined,
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			history.push(`${rootUrl}/articles/${menuKey}/edit`);
		}
	};

	const handleRowClick = (obj) => {
		if (!isSecretView(obj)) {
			history.push(`${rootUrl}/articles/${menuKey}/` + obj.id);
		}
	};

	const checkFleMarket = () => menuKey === "fleaMarket";

	const getTotalPage = () => {
		let totalPage = Math.floor(pageInfo.total / pageInfo.size);
		if (pageInfo.total % pageInfo.size > 0) {
			totalPage++;
		}
		return totalPage;
	};

	const isSecretView = (obj) => {
		return obj.isSecret && obj.authorId !== currentUser.id;
	};

	const generateTitle = (obj) => {
		let title = "";

		if (menuKey !== "suggestions") {
			title += `[${obj.categoryName}] `;
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
		if (
			menuKey === "complaints" ||
			menuKey === "fleaMarket" ||
			menuKey === "freeBoard" ||
			menuKey === "suggestions"
		) {
			if (obj.commentsCount > 0) {
				title += ` [${obj.commentsCount}]`;
			}
		}
		return title;
	};

	const objView = (obj, index) => (
		<MC.TableRow
			className={classes.tableRow}
			hover
			style={{
				borderTop: index === 0 && isMobile && "2px solid #222222",
				borderBottom: index === articles.length - 1 && "2px solid #222222",
			}}
			key={index}
		>
			{/*제목*/}
			<MC.TableCell
				onClick={() => handleRowClick(obj)}
				className={classes.body4}
				style={{
					color: isSecretView(obj) ? "#909090" : "#222222",
					fontWeight: 500,
				}}
				align={"left"}
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
									checkFleMarket() &&
									obj.transactionType === "TRANSACTION_COMPLETE"
										? "line-through"
										: "none",
							}}
						>
							{isSecretView(obj) ? (
								"비공개 건의사항"
							) : (
								<>{generateTitle(obj)}</>
							)}
						</MC.Grid>
						<MC.Grid item>
							<MC.Grid
								container
								direction="row"
								justify={"flex-start"}
								alignItems={"center"}
							>
								<MC.Grid
									item
									style={{
										fontSize: 12,
										color: isSecretView(obj) ? "#909090" : "#222222",
										fontWeight: "bold",
									}}
								>
									작성자&nbsp;
								</MC.Grid>
								<MC.Grid
									item
									style={{
										fontSize: 12,
										color: isSecretView(obj) ? "#909090" : "#222222",
									}}
								>
									{isSecretView(obj)
										? "비공개"
										: obj.accountType === "MANAGEMENT_OFFICE_MANAGER"
										? "관리자"
										: `${obj.building}동 ${obj.nickName}`}
								</MC.Grid>
								<MC.Grid item style={{ color: "#dedede" }}>
									&nbsp;|&nbsp;
								</MC.Grid>
								<MC.Grid
									item
									style={{
										fontSize: 12,
										color: isSecretView(obj) ? "#909090" : "#222222",
										fontWeight: "bold",
									}}
								>
									작성일&nbsp;
								</MC.Grid>
								<MC.Grid
									item
									style={{
										fontSize: 12,
										color: isSecretView(obj) ? "#909090" : "#222222",
									}}
								>
									{
										obj.createDate ?
											<DateFormat date={obj.createDate} format={"YYYY.MM.DD"}/>
											:
											""
									}
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				) : (
					<div
						style={{
							textDecoration:
								checkFleMarket() &&
								obj.transactionType === "TRANSACTION_COMPLETE"
									? "line-through"
									: "none",
						}}
					>
						{isSecretView(obj) ? "비공개 건의사항" : <>{generateTitle(obj)}</>}
					</div>
				)}
			</MC.TableCell>

			{!isMobile && (
				<>
					{/*작성자*/}
					<MC.TableCell
						onClick={() => handleRowClick(obj)}
						className={classes.body4}
						style={{
							color: isSecretView(obj) ? "#909090" : "#222222",
							fontWeight: 500,
						}}
						align={"center"}
					>
						{isSecretView(obj)
							? "비공개"
							: obj.accountType === "MANAGEMENT_OFFICE_MANAGER"
							? "관리자"
							: `${obj.building}동 ${obj.nickName}`}
					</MC.TableCell>

					{/*작성일*/}
					<MC.TableCell
						onClick={() => handleRowClick(obj)}
						className={classes.body4}
						style={{
							color: isSecretView(obj) ? "#909090" : "#222222",
							fontWeight: 500,
						}}
						align={"center"}
					>
						{
							obj.createDate ?
								<DateFormat date={obj.createDate} format={"YYYY.MM.DD"}/>
								:
								""
						}

					</MC.TableCell>
				</>
			)}
		</MC.TableRow>
	);

	return (
		<div {...rest} className={clsx(classes.root, className)}>
			{menuKey !== "suggestions" && (
				<CategoryTabs
					ArticleStore={ArticleStore}
					isMobile={isMobile}
					categories={categories}
					getArticles={getArticles}
					menuKey={menuKey}
				/>
			)}

			<MC.Grid
				container
				direction={"row"}
				justify={"space-between"}
				alignItems={"flex-end"}
				style={{ marginTop: 30 }}
			>
				<MC.Grid item>
					<MC.Typography className={classes.body5}>
						총&nbsp;
						<span style={{ color: "#449CE8" }}>{pageInfo.total}</span>
						개의 글이 있습니다.
					</MC.Typography>
				</MC.Grid>
				<MC.Grid item>
					<MC.FormControl
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
					</MC.FormControl>
				</MC.Grid>
			</MC.Grid>

			<MC.Table style={{ marginTop: 16 }}>
				<MC.TableHead className={classes.tableHead}>
					{!isMobile && (
						<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
							<MC.TableCell
								className={clsx(classes.body4, classes.tableHeadCell)}
								align={"center"}
							>
								제목
							</MC.TableCell>
							<MC.TableCell
								className={clsx(
									classes.body4,
									classes.tableHeadCell,
									classes.tableHeadCellFont
								)}
								align={"center"}
							>
								작성자
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
						</MC.TableRow>
					)}
				</MC.TableHead>
				<MC.TableBody>
					{articles ? (
						articles.length === 0 ? (
							<MC.TableRow className={classes.tableRow} hover>
								<MC.TableCell colSpan={3} align="center">
									조회된 게시판 데이터가 한 건도 없네요.
								</MC.TableCell>
							</MC.TableRow>
						) : (
							articles.map(objView)
						)
					) : (
						<MC.TableRow className={classes.tableRow} hover>
							<MC.TableCell colSpan={3} align="center">
								<MC.CircularProgress color="secondary" />
							</MC.TableCell>
						</MC.TableRow>
					)}
				</MC.TableBody>
			</MC.Table>

			{!(
				menuKey === "notice" ||
				menuKey === "migoNotice" ||
				menuKey === "mandatoryDisclosure" ||
				menuKey === "livingInformation"
			) && (
				<MC.Grid
					container
					direction={"row"}
					justify={"center"}
					alignItems={"center"}
					style={{ width: "100%", marginTop: 40 }}
				>
					<MC.Button
						size="large"
						disableElevation
						style={{
							padding: 0,
							borderRadius: 0,
							width: 140,
							height: 40,
							border: "1px solid rgb(51, 51, 51, 0.2)",
						}}
						onClick={handleOpenRegisterPage}
					>
						등록
					</MC.Button>
				</MC.Grid>
			)}

			<MC.Grid
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
			</MC.Grid>

			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
				noTitle={alertOpens.noTitle}
				yesTitle={alertOpens.yesTitle}
			/>
		</div>
	);
};

export default ArticlesTable;
