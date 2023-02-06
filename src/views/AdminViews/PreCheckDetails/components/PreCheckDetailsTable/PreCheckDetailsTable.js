import React, { useState }  from "react";
import { inject, observer } from "mobx-react";
import { withRouter }       from "react-router-dom";
import PerfectScrollbar     from "react-perfect-scrollbar";
import clsx                 from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import palette                                                          from "../../../../../theme/adminTheme/palette";
import { AlertDialog, DateFormat, PhoneHyphen, TablePaginationActions } from "../../../../../components";
import { aptComplexRepository, preCheckDetailRepository }               from "../../../../../repositories";

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

const PreCheckDetailsTable = props => {
	const classes = useStyles();
	const { className, history, PreCheckDetailStore, getPreCheckDetails, preCheckDetails, pageInfo, setPageInfo, rootUrl, staticContext, ...rest } = props;
	
	const [selectedObjects, setSelectedObjects] = useState([]);
	
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
	
	const handleSelectAll = event => {
		let selectedList;
		event.target.checked ? selectedList = preCheckDetails.map(preCheckDetail => preCheckDetail) : selectedList = [];
		setSelectedObjects(selectedList);
	};
	
	const handleSelectOne = (event, selectedObject) => {
		const selectedIndex = selectedObjects.indexOf(selectedObject);
		let newSelectedObjects = [];
		
		if ( selectedIndex === -1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects, selectedObject);
		} else if ( selectedIndex === 0 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
		} else if ( selectedIndex === selectedObjects.length - 1 ) {
			newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
		} else if ( selectedIndex > 0 ) {
			newSelectedObjects = newSelectedObjects.concat(
				selectedObjects.slice(0, selectedIndex),
				selectedObjects.slice(selectedIndex + 1)
			);
		}
		
		setSelectedObjects(newSelectedObjects);
	};
	
	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getPreCheckDetails(page, pageInfo.size);
	};
	
	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getPreCheckDetails(0, event.target.value);
	};
	
	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/preCheck/${obj.id}`);
	};
	
	const removeObject = async (id) => {
		return preCheckDetailRepository.removePreCheckDetail(id);
	};
	
	const handleDeleteAllClick = async () => {
		// 선택된 데이터의 상태 값 검사
		handleAlertToggle(
			"isConfirmOpen",
			"사전점검 삭제",
			"선택하신 사전점검에 등록된 모든 데이터가 삭제 됩니다. \n 정말로 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				await selectedObjects.map(async (obj) => {
					await removeObject(obj.id);
				});
				handleAlertToggle(
					"isOpen",
					"삭제완료",
					"선택된 사전점검 정보 모두를 삭제 하였습니다.",
					() => {
						setSelectedObjects([]);
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
				await getPreCheckDetails();
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};
	const slice = () => (0, pageInfo.size);
	
	const objView = (obj, index) => (
		<MC.TableRow
			className={classes.tableRow}
			hover
			key={obj.id}
			selected={selectedObjects.indexOf(obj) !== -1}>
			
			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>
			
			{/*동*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.building}
			</MC.TableCell>
			
			{/*호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.unit}
			</MC.TableCell>
			
			{/*이름*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.name}
			</MC.TableCell>
			
			{/*휴대폰번호*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{PhoneHyphen(obj.phoneNumber)}
			</MC.TableCell>
			
			{/*점검일*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.preCheckDate} format={"YYYY.MM.DD"} />
			</MC.TableCell>
			
			{/*점검표작성*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{
					obj.isCheck === true ? "Y" : "N"
				}
			</MC.TableCell>
			
			{/*등록일*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.createDate} format={"YYYY.MM.DD"} />
			</MC.TableCell>
		
		</MC.TableRow>
	);
	
	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>
			
			<MC.CardHeader
				title={"사전점검 목록"}
				subheader={
					<>
						총 {pageInfo.total} 건
					</>
				}
				titleTypographyProps={{ variant: "h4" }}
				action={
					<MC.ButtonGroup
						aria-label="text primary button group"
						style={{ marginTop: 12 }}
						color="primary">
						<MC.Button
							disabled={selectedObjects.length === 0}
							style={{
								color:                  selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.26)" : palette.error.main,
								borderColor:            selectedObjects.length === 0 ? "rgba(0, 0, 0, 0.12)" : palette.error.main,
								marginLeft:             10,
								borderTopLeftRadius:    4,
								borderBottomLeftRadius: 4
							}}
							onClick={handleDeleteAllClick}>
							삭제
						</MC.Button>
					</MC.ButtonGroup>
				} />
			<MC.Divider />
			
			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"} padding={"checkbox"}>
										<MC.Checkbox
											checked={
												preCheckDetails ?
													(preCheckDetails.length === 0 ? false : selectedObjects.length === preCheckDetails.length) : false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0
												&& selectedObjects.length < (preCheckDetails ? preCheckDetails.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>동</MC.TableCell>
									<MC.TableCell align={"center"}>호</MC.TableCell>
									<MC.TableCell align={"center"}>이름</MC.TableCell>
									<MC.TableCell align={"center"}>휴대폰번호</MC.TableCell>
									<MC.TableCell align={"center"}>점검일</MC.TableCell>
									<MC.TableCell align={"center"}>점검표작성</MC.TableCell>
									<MC.TableCell align={"center"}>등록일</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									preCheckDetails ?
										(
											preCheckDetails.length === 0 ?
												<MC.TableRow>
													<MC.TableCell colSpan={8} align="center">
														조회된 사전점검 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												preCheckDetails.slice(slice).map(objView)
										)
										:
										<MC.TableRow>
											<MC.TableCell colSpan={8} align="center">
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

export default inject("PreCheckDetailStore")(withRouter(observer(PreCheckDetailsTable)));
