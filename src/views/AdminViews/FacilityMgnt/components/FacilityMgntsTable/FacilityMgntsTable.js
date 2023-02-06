import React, {useState}        from "react";
import PerfectScrollbar         from "react-perfect-scrollbar";
import clsx                     from "clsx";
import * as MC                  from "@material-ui/core";
import * as MS                  from "@material-ui/styles";
import {TablePaginationActions} from "../../../../../components";
import { facilityIntroductionRepository }   from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
    inner: {
        minWidth: 1530
    },
    nameContainer: {
        display: "flex",
        alignItems: "center"
    },
    actions: {
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        justifyContent: "space-between"
    }
}));

const FacilityMgntsTable = props => {
    const classes = useStyles();

    const {className, history, rootUrl, AptComplexStore, SignInStore, facilityList, getFacilityList, alertOpens, setAlertOpens, handleAlertToggle, pageInfo, setPageInfo, isLoading, ...rest} = props;

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

		const handleCreate = (facility) => {
			history.push({
				pathname: `${rootUrl}/facilityMgnt/create`,
				state: {facility: facility}
			});
		}

    const handleEdit = (facility) => {
			history.push({
				pathname: `${rootUrl}/facilityMgnt/edit`,
				state: {facility: facility}
			});
    };

		const handleDelete = (facility) => {
			handleAlertToggle(
				"isConfirmOpen",
				"시설안내 삭제",
				"선택한 시설안내를 삭제하시겠습니까?",
				async () => {
					await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
					facilityIntroductionRepository.deleteFacility(facility.fclt_numb)
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
			);
		}

    return (
        <MC.Card
            {...rest}
            className={clsx(classes.root, className)}>

            <MC.CardHeader
                title={"시설 목록"}
                subheader={<>총 {pageInfo.total} 건</>}
                titleTypographyProps={{variant: "h4"}}
						/>

            <MC.Divider/>

            <MC.CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        <MC.Table size="small">
                            <MC.TableHead>
                                <MC.TableRow>
																	<MC.TableCell align={"center"}>시설번호</MC.TableCell>
                                    <MC.TableCell align={"center"}>시설명</MC.TableCell>
                                    <MC.TableCell align={"center"}>관리</MC.TableCell>
                                </MC.TableRow>
                            </MC.TableHead>
                            <MC.TableBody>
                                {
                                	isLoading ?
																		<MC.TableRow hover>
																			<MC.TableCell colSpan={3} align="center">
																				<MC.CircularProgress color="secondary" />
																			</MC.TableCell>
																		</MC.TableRow>
																		:
																		facilityList.length === 0 ?
																			<MC.TableRow hover>
																				<MC.TableCell colSpan={3} align="center">
																					조회된 시설 데이터가 없습니다
																				</MC.TableCell>
																			</MC.TableRow>
																			:
																			facilityList.map((facility, index) => (
																				<MC.TableRow hover key={index} >
																					<MC.TableCell align={"center"}>{facility.fclt_numb}</MC.TableCell>
																					<MC.TableCell align={"center"}>{facility.fclm_name}</MC.TableCell>
																					<MC.TableCell align={"center"}>
																						{
																							facility.fclt_count > 0 ? (
																									<MC.ButtonGroup variant="outlined" color="primary" aria-label="text primary button group">
																										<MC.Button onClick={()=>handleEdit(facility)}>수정</MC.Button>
																										<MC.Button onClick={()=>handleDelete(facility)}>삭제</MC.Button>
																									</MC.ButtonGroup>
																								)
																								:
																								(
																									<MC.Button variant="outlined" color="primary" onClick={() => handleCreate(facility)}>등록</MC.Button>
																								)
																						}
																					</MC.TableCell>
																				</MC.TableRow>
																			))

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
                    </MC.Grid>

                    <MC.Grid item>
                        <MC.TablePagination
                            component="div"
                            count={pageInfo.total}
                            labelDisplayedRows={({from, to, count}) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
                            labelRowsPerPage={"페이지당 목록 수 : "}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            ActionsComponent={TablePaginationActions}
                            page={pageInfo.page}
                            rowsPerPage={pageInfo.size}
                            rowsPerPageOptions={[10, 15, 30, 50, 100]}/>
                    </MC.Grid>
                </MC.Grid>
            </MC.CardActions>
        </MC.Card>
    );

};

export default FacilityMgntsTable;
