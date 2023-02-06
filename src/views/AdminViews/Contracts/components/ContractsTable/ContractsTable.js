import React, { useState } from "react";
import PerfectScrollbar    from "react-perfect-scrollbar";
import clsx                from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialog, DateFormat, TablePaginationActions } from "../../../../../components";
import palette                                             from "../../../../../theme/adminTheme/palette";
import { contractRepository }                              from "../../../../../repositories";

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

const ContractsTable = props => {
	const classes = useStyles();
	const { className, history, menuKey, aptId, rootUrl, contracts, getContracts, contractTypes, getContractTypes, pageInfo, setPageInfo, staticContext, ...rest } = props;
	
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
		event.target.checked ? selectedList = contracts.map(contract => contract) : selectedList = [];
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
		getContracts(page, pageInfo.size);
	};
	
	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getContracts(0, event.target.value);
	};
	
	const handleRowClick = (obj) => {
		history.push(`${rootUrl}/contract/${obj.id}`);
	};
	
	const removeObject = async (id) => {
		return contractRepository.removeContract(id, { aptId });
	};
	
	const handleDeleteAllClick = async () => {
		// 선택된 데이터의 상태 값 검사
		handleAlertToggle(
			"isConfirmOpen",
			"계약 삭제",
			"선택하신 계약에 연결된 모든 데이터가 삭제가 됩니다. \n 정말로 계약을 삭제하겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				await selectedObjects.map(async (obj) => {
					await removeObject(obj.id);
				});
				handleAlertToggle(
					"isOpen",
					"삭제완료",
					"선택된 계약 정보 모두를 삭제 하였습니다.",
					() => {
						setSelectedObjects([]);
						getContracts(pageInfo.page, pageInfo.size);
						setAlertOpens({ ...alertOpens, isOpen: false });
					}
				);
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		);
	};
	
	const handleOpenRegisterPage = event => {
		if ( contractTypes.length === 0 ) {
			handleAlertToggle(
				"isOpen",
				"계약종류 등록 필요",
				"계약종류를 먼저 등록이 필요합니다. 계약종류를 먼저 등록 해주세요.",
				() => {
					setAlertOpens({ ...alertOpens, isOpen: false });
				}
			);
		} else {
			history.push(`${rootUrl}/contract/edit`);
		}
	};
	
	const slice = () => (0, pageInfo.size);
	
	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.id}>
			
			{/*체크박스*/}
			<MC.TableCell align={"center"} padding={"checkbox"}>
				<MC.Checkbox
					checked={selectedObjects.indexOf(obj) !== -1}
					color={"primary"}
					onChange={event => handleSelectOne(event, obj)}
					value={true} />
			</MC.TableCell>
			
			{/*구분*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{
					obj.contractTypeKind === "BIDDING" ? <MC.Chip label={"입찰"} /> :
						obj.contractTypeKind === "PRIVATE_CONTRACT" && <MC.Chip label={"수의계약"} />
				}
			</MC.TableCell>
			
			{/*계약종류*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.contractType}
			</MC.TableCell>
			
			{/*회사명*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				{obj.companyName}
			</MC.TableCell>
			
			{/*계약일자*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.contractStartDate}
				            format={"YYYY.MM.DD"} />
				&nbsp; ~ &nbsp;
				<DateFormat date={obj.contractEndDate}
				            format={"YYYY.MM.DD"} />
			</MC.TableCell>
			
			{/*등록일*/}
			<MC.TableCell onClick={() => handleRowClick(obj)}
			              align={"center"}>
				<DateFormat date={obj.createDate} format={"YYYY-MM-DD"} />
			</MC.TableCell>
		
		</MC.TableRow>
	);
	
	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>
			
			<MC.CardHeader
				title={"계약 목록"}
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
												contracts ?
													(contracts.length === 0 ? false : selectedObjects.length === contracts.length) : false
											}
											color={"primary"}
											indeterminate={
												selectedObjects.length > 0
												&& selectedObjects.length < (contracts ? contracts.length : 10)
											}
											onChange={handleSelectAll}
										/>
									</MC.TableCell>
									<MC.TableCell align={"center"}>구분</MC.TableCell>
									<MC.TableCell align={"center"}>계약종류</MC.TableCell>
									<MC.TableCell align={"center"}>회사명</MC.TableCell>
									<MC.TableCell align={"center"}>계약일</MC.TableCell>
									<MC.TableCell align={"center"}>등록일</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									contracts ?
										(
											contracts.length === 0 ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={6} align="center">
														조회된 계약 데이터가 한 건도 없네요.
													</MC.TableCell>
												</MC.TableRow>
												:
												contracts.slice(slice).map(objView)
										)
										:
										<MC.TableRow hover>
											<MC.TableCell colSpan={6} align="center">
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
							<MC.Button
								onClick={handleOpenRegisterPage}>
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

export default ContractsTable;
