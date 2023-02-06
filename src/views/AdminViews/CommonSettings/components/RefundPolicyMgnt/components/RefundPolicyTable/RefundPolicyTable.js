import clsx                       from "clsx";
import * as MC                    from "@material-ui/core";
import PerfectScrollbar           from "react-perfect-scrollbar";
import { TablePaginationActions } from "../../../../../../../components";
import React                      from "react";
import palette                    from "../../../../../../../theme/adminTheme/palette";
import { refundPolicyRepository } from "../../../../../../../repositories";
import * as MS                    from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	root: {
		borderRadius: 0
	},
	content: {
		padding: 0
	},
	inner: {
		minWidth: 1530
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between"
	},
}));

const RefundPolicyTable = props => {

	const classes = useStyles();
	const {className, handleOpen, alertOpens, setAlertOpens, handleAlertToggle, getFacilityList, pageInfo, setPageInfo, facilityList, isLoading, ...rest} = props;

	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getFacilityList(page, pageInfo.size);
	};

	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getFacilityList(0, event.target.value);
	};

	const handleDelete = (obj) => {
		handleAlertToggle(
			"isConfirmOpen",
			"환불규정 삭제",
			"선택한 환불규정을 삭제하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				refundPolicyRepository.deleteRefundPolicy(obj.fclt_numb)
					.then(result => {
						getFacilityList(pageInfo.page, pageInfo.size);
					}).catch(e => {
						handleAlertToggle(
							"isOpen",
							e.msg,
							e.errormsg + "\n" + "errorcode: " + e.errorcode,
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
							},
							undefined
						);
				})
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		)
	}

	const slice = () => (0, pageInfo.size);

	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={index}>

			{/*대분류*/}
			<MC.TableCell align={"center"}>
				{obj.fclt_info_taf}
			</MC.TableCell>

			{/*중분류*/}
			<MC.TableCell align={"center"}>
				{obj.fclt_info_tfm}
			</MC.TableCell>

			{/*수량정원*/}
			<MC.TableCell align={"center"}>
				{obj.prtm_clss}
			</MC.TableCell>

			{/*등록건수*/}
			<MC.TableCell align={"center"}>
				{obj.cnt}
			</MC.TableCell>

			{/*관리*/}
			<MC.TableCell align={"center"}>
				{
					obj.fclt_numb != "0000" ?
						(
						obj.cnt > 0 ?
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
							<MC.Button
								style={{
									color: palette.primary.main,
									borderColor: palette.primary.main,
									marginLeft: 10,
									borderTopLeftRadius: 4,
									borderBottomLeftRadius: 4
								}}
								onClick={() => handleOpen(obj, true)}>
								수정
							</MC.Button>
							<MC.Button
								style={{
									color: palette.primary.main,
									borderColor: palette.primary.main,
									marginLeft: 10,
									borderTopLeftRadius: 4,
									borderBottomLeftRadius: 4
								}}
								onClick={() => handleDelete(obj)}>
								삭제
							</MC.Button>
						</MC.ButtonGroup>
						:
						<MC.Button style={{ marginTop: 10 }} variant={"outlined"} color="primary" onClick={() => handleOpen(obj, false)}>등록</MC.Button>
						)
						:
						<MC.ButtonGroup
							aria-label="text primary button group"
							color="primary">
						<MC.Button
							style={{
								color: palette.primary.main,
								borderColor: palette.primary.main,
								marginLeft: 10,
								borderTopLeftRadius: 4,
								borderBottomLeftRadius: 4
							}}
							onClick={() => handleOpen(obj, true)}>
							수정
						</MC.Button>
						</MC.ButtonGroup>
				}
			</MC.TableCell>
		</MC.TableRow>
	);

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"환불규정 설정"}
				titleTypographyProps={{ variant: "h4" }}/>

			<MC.Divider/>

			<MC.CardContent className={classes.content}>
				<PerfectScrollbar>
					<div className={classes.inner}>
						<MC.Table size="small">
							<MC.TableHead>
								<MC.TableRow>
									<MC.TableCell align={"center"}>상품분류</MC.TableCell>
									<MC.TableCell align={"center"}>대분류</MC.TableCell>
									<MC.TableCell align={"center"}>수량/정원</MC.TableCell>
									<MC.TableCell align={"center"}>등록건수</MC.TableCell>
									<MC.TableCell align={"center"}>관리</MC.TableCell>
								</MC.TableRow>
							</MC.TableHead>
							<MC.TableBody>
								{
									isLoading ?
										<MC.TableRow hover>
											<MC.TableCell colSpan={6} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
										:
										facilityList.length === 0 ?
											<MC.TableRow hover>
												<MC.TableCell colSpan={6} align="center">
													조회된 신청기간 데이터가 한 건도 없네요.
												</MC.TableCell>
											</MC.TableRow>
											:
											facilityList.slice(slice).map(objView)
								}
							</MC.TableBody>
						</MC.Table>
					</div>
				</PerfectScrollbar>
			</MC.CardContent>

			<MC.Divider/>

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
								onClick={() => handleOpen(undefined, false)}>
								환불규정 등록
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
		</MC.Card>
	)
}

export default RefundPolicyTable
