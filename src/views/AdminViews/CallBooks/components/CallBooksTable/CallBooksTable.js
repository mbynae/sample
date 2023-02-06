import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, PhoneHyphen, TablePaginationActions } from "../../../../../components";
import { CategoryTabs }                                     from "../../components";

import PhoneCallbackTwoToneIcon  from "@material-ui/icons/PhoneCallbackTwoTone";
import LocalPrintshopTwoToneIcon from "@material-ui/icons/LocalPrintshopTwoTone";

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

const CallBooksTable = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, callBooks, getCallBooks, categories, pageInfo, setPageInfo, staticContext, ...rest } = props;
	
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
	
	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getCallBooks(page, pageInfo.size);
	};
	
	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getCallBooks(0, event.target.value);
	};
	
	const handleOpenRegisterPage = event => {
		if ( categories.length === 0 ) {
			handleAlertToggle(
				"isOpen",
				"카테고리 등록 필요",
				"카테고리를 먼저 등록이 필요합니다. 카테고리를 먼저 등록 해주세요.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			history.push(`${rootUrl}/callBook/edit`);
		}
	};
	
	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/callBook/${obj.id}`);
	};
	
	const slice = () => (0, pageInfo.size);
	
	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.id}>
			{/*전화번호부명*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{`[ ${obj.categoryName} ] ${obj.title}`}
			</MC.TableCell>
			
			{/*전화번호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}
				         style={{ width: "30%", marginLeft: "auto", marginRight: "auto" }}>
					<PhoneCallbackTwoToneIcon fontSize={"small"} />
					&nbsp; {PhoneHyphen(obj.callNumber)}
				</MC.Grid>
			</MC.TableCell>
			
			{/*팩스번호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}
				         style={{ width: "30%", marginLeft: "auto", marginRight: "auto" }}>
					<LocalPrintshopTwoToneIcon fontSize={"small"} />
					&nbsp; {PhoneHyphen(obj.faxNumber)}
				</MC.Grid>
			</MC.TableCell>
		
		</MC.TableRow>
	);
	
	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>
			
			<MC.CardHeader
				title={"전화번호부 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
				titleTypographyProps={{ variant: "h4" }} />
			
			<CategoryTabs
				categories={categories}
				getCallBooks={getCallBooks}
				menuKey={menuKey}
			/>
			
			<MC.Divider />
			
			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>전화번호부명</MC.TableCell>
									<MC.TableCell align={"center"}>전화번호</MC.TableCell>
									<MC.TableCell align={"center"}>팩스번호</MC.TableCell>
								</MC.TableRow>
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
												callBooks.slice(slice).map(objView)
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
							<MC.Button onClick={handleOpenRegisterPage}>
								등록
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

export default CallBooksTable;
