import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, PhoneHyphen, TablePaginationActions } from "../../../../../components";

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

const AutonomousOrganizationsTable = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, autonomousOrganizations, getAutonomousOrganizations, categories, pageInfo, setPageInfo, staticContext, ...rest } = props;
	
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
		getAutonomousOrganizations(page, pageInfo.size);
	};
	
	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getAutonomousOrganizations(0, event.target.value);
	};
	
	const handleOpenRegisterPage = event => {
		history.push(`${rootUrl}/autonomousOrganizations/edit`);
	};
	
	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/autonomousOrganizations/${obj.id}`);
	};
	
	const slice = () => (0, pageInfo.size);
	
	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.id}>
			
			{/*노출순서*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.sequence}
			</MC.TableCell>
			
			{/*자치기구명*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{`[ ${obj.name} ] ${obj.title}`}
			</MC.TableCell>
			
			{/*등록일*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.createDate}/>
			</MC.TableCell>
		
		</MC.TableRow>
	);
	
	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>
			
			<MC.CardHeader
				title={"자치기구 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
				titleTypographyProps={{ variant: "h4" }} />
			
			<MC.Divider />
			
			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>노출순서</MC.TableCell>
									<MC.TableCell align={"center"}>제목</MC.TableCell>
									<MC.TableCell align={"center"}>등록일</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									autonomousOrganizations ?
										(
											autonomousOrganizations.length === 0 ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={3} align="center">
														조회된 자치기구 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												autonomousOrganizations.slice(slice).map(objView)
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

export default AutonomousOrganizationsTable;
