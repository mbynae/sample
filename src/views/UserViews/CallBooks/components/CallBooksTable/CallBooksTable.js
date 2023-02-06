import React, { useState } from "react";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as ML from "@material-ui/lab";

import PhoneCallbackTwoToneIcon  from "@material-ui/icons/PhoneCallbackTwoTone";
import LocalPrintshopTwoToneIcon from "@material-ui/icons/LocalPrintshopTwoTone";

import { PhoneHyphen }  from "../../../../../components";
import { CategoryTabs } from "../../components";

const useStyles = MS.makeStyles(theme => ({
	root:              {},
	content:           {
		padding: 0
	},
	nameContainer:     {
		display:    "flex",
		alignItems: "center"
	},
	actions:           {
		padding:        theme.spacing(1),
		paddingLeft:    theme.spacing(2),
		paddingRight:   theme.spacing(2),
		justifyContent: "space-between"
	},
	body5:             {
		...theme.typography.body5,
		whiteSpace: "pre-line"
	},
	formControlSelect: {
		width:  130,
		height: 36
	},
	select:            {
		paddingLeft:   13,
		paddingTop:    8,
		paddingBottom: 8
	},
	tableHead:         {
		height:          50,
		minHeight:       50,
		maxHeight:       50,
		backgroundColor: "transparent"
	},
	body4:             {
		...theme.typography.body4,
		color:      "#ffffff",
		height:     24,
		lineHeight: "24px"
	},
	tableHeadCell:     {
		height:     "50px !important",
		fontWeight: "bold",
		color:      "#222222"
	},
	tableHeadCellFont: {
		fontSize:                       14,
		width:                          "20%",
		[theme.breakpoints.down("xs")]: {
			fontSize: 12,
			width:    "50%"
		}
	},
	dotDivider:        {
		width:           "4px",
		height:          "4px",
		margin:          "8px",
		backgroundColor: "#c4c4c4"
	}
}));

const CallBooksTable = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, CallBookStore, isMobile, callBooks, getCallBooks, categories, pageInfo, setPageInfo, staticContext, ...rest } = props;

	const [sizeOptions] = useState([10, 15, 30, 50, 100]);
	const [selectSizeOption, setSelectSizeOption] = useState(10);

	const handleSelectSizeOption = (event) => {
		setSelectSizeOption(event.target.value);
		setPageInfo(prev => {
			return {
				...prev,
				page: 1,
				size: event.target.value
			};
		});
		getCallBooks(1, event.target.value);
	};

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getCallBooks(page, pageInfo.size);
	};

	const getTotalPage = () => {
		let totalPage = Math.floor(pageInfo.total / pageInfo.size);
		if ( pageInfo.total % pageInfo.size > 0 ) {
			totalPage++;
		}
		return totalPage;
	};

	const objView = (obj, index) => (
		<MC.TableRow
			hover
			style={{ borderBottom: index === (callBooks.length - 1) && "2px solid #222222" }}
			key={obj.id}>

			{
				isMobile ?
					(
						<>
							{/*전화번호부명*/}
							<MC.TableCell align={"left"}>
								{`[ ${obj.categoryName} ] ${obj.title}`}
							</MC.TableCell>

							{/*전화번호*/}
							<MC.TableCell align={"center"}>
								<MC.Grid container direction="column" justify={"center"} alignItems={"flex-start"}>
									<MC.Grid item>
										<MC.Grid container direction="row" justify={"flex-start"} alignItems={"flex-start"}
										         style={{ width: "100%", marginLeft: "auto", marginRight: "auto", fontSize: 12 }}>
											<PhoneCallbackTwoToneIcon fontSize={"small"} color={"primary"} />
											&nbsp; {PhoneHyphen(obj.callNumber)}
										</MC.Grid>
									</MC.Grid>
									<MC.Grid item>
										<MC.Grid container direction="row" justify={"flex-start"} alignItems={"flex-start"}
										         style={{ width: "100%", marginLeft: "auto", marginRight: "auto", fontSize: 12 }}>
											<LocalPrintshopTwoToneIcon fontSize={"small"} color={"primary"} />
											&nbsp; {PhoneHyphen(obj.faxNumber)}
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							</MC.TableCell>
						</>
					)
					:
					(
						<>
							{/*전화번호부명*/}
							<MC.TableCell align={"left"}>
								{`[ ${obj.categoryName} ] ${obj.title}`}
							</MC.TableCell>

							{/*전화번호*/}
							<MC.TableCell align={"center"}>
								<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}
								         style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}>
									<PhoneCallbackTwoToneIcon fontSize={"small"} color={"primary"} />
									&nbsp; {PhoneHyphen(obj.callNumber)}
								</MC.Grid>
							</MC.TableCell>

							{/*팩스번호*/}
							<MC.TableCell align={"center"}>
								<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}
								         style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}>
									<LocalPrintshopTwoToneIcon fontSize={"small"} color={"primary"} />
									&nbsp; {PhoneHyphen(obj.faxNumber)}
								</MC.Grid>
							</MC.TableCell>
						</>
					)
			}

		</MC.TableRow>
	);

	return (
		<div
			{...rest}
			className={clsx(classes.root, className)}>

			<CategoryTabs
				CallBookStore={CallBookStore}
				isMobile={isMobile}
				categories={categories}
				getCallBooks={getCallBooks}
				menuKey={menuKey}
			/>

			<MC.Grid container direction={"row"} justify={"space-between"} alignItems={"flex-end"} style={{ marginTop: 30 }}>
				<MC.Grid item>
					<MC.Typography className={classes.body5}>
						총&nbsp;
						<span style={{ color: "#449CE8" }}>
							{pageInfo.total}
						</span>
						개의 연락처가 있습니다.
					</MC.Typography>
				</MC.Grid>
				<MC.Grid item>
					<MC.FormControl variant="outlined" className={classes.formControlSelect}>
						<MC.Select
							id="sizeOptions"
							name="sizeOptions"
							value={selectSizeOption}
							className={clsx(classes.formControlSelect, classes.body5)}
							classes={{
								select: classes.select
							}}
							onChange={handleSelectSizeOption}>
							{
								sizeOptions.map((so, index) => (
									<MC.MenuItem key={index} value={so}>{`${so} 개씩 보기`}</MC.MenuItem>
								))
							}
						</MC.Select>
					</MC.FormControl>
				</MC.Grid>
			</MC.Grid>

			<MC.Table style={{ marginTop: 16 }}>
				<MC.TableHead className={classes.tableHead}>
					{
						isMobile ?
							(
								<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
									<MC.TableCell className={clsx(classes.body4, classes.tableHeadCell)} align={"center"}>명칭</MC.TableCell>
									<MC.TableCell
										className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
										align={"center"}>
										<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"}>
											<MC.Grid item>전화번호</MC.Grid>
											<div className={classes.dotDivider} />
											<MC.Grid item>팩스</MC.Grid>
										</MC.Grid>
									</MC.TableCell>
								</MC.TableRow>
							)
							:
							(
								<MC.TableRow style={{ borderTop: "2px solid #222222" }}>
									<MC.TableCell className={clsx(classes.body4, classes.tableHeadCell)} align={"center"}>명칭</MC.TableCell>
									<MC.TableCell
										className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
										align={"center"}>
										전화번호
									</MC.TableCell>
									<MC.TableCell
										className={clsx(classes.body4, classes.tableHeadCell, classes.tableHeadCellFont)}
										align={"center"}>
										팩스번호
									</MC.TableCell>
								</MC.TableRow>
							)
					}

				</MC.TableHead>
				<MC.TableBody>
					{
						callBooks ?
							(
								callBooks.length === 0 ?
									<MC.TableRow hover>
										<MC.TableCell colSpan={3} align="center">
											조회된 전화번호부 데이터가 한 건도 없네요.
										</MC.TableCell>
									</MC.TableRow>
									:
									callBooks.map(objView)
							)
							:
							<MC.TableRow hover>
								<MC.TableCell colSpan={3} align="center">
									<MC.CircularProgress color="secondary" />
								</MC.TableCell>
							</MC.TableRow>
					}
				</MC.TableBody>
			</MC.Table>

			<MC.Grid container direction={"row"} justify={"center"} alignItems={"center"} style={{ width: "100%", marginTop: 49 }}>
				<ML.Pagination
					count={getTotalPage()}
					page={pageInfo.page}
					onChange={handlePageChange}
					showFirstButton
					showLastButton />
			</MC.Grid>

		</div>
	);
};

export default CallBooksTable;
