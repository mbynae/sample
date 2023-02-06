import React, {useState} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import clsx from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import {AlertDialog, DateFormat, PhoneHyphen, TablePaginationActions} from "../../../../../components";
import palette from "../../../../../theme/adminTheme/palette";

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

const SalesMgntsTable = props => {
    const classes = useStyles();
    const {className, history, menuKey, rootUrl, salesMgnts, getSalesMgnts, pageInfo, setPageInfo, staticContext, ...rest} = props;

    const [selectedObjects, setSelectedObjects] = useState([]);

    const [alertOpens, setAlertOpens] = useState({
        isConfirmOpen: false,
        isOpen: false,
        title: "",
        content: "",
        yesFn: () => handleAlertToggle(),
        noFn: () => handleAlertToggle()
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
                    noFn: () => noCallback()
                };
            }
        );
    };

    const handleSelectAll = event => {
        let selectedList;
        event.target.checked ? selectedList = salesMgnts.map(salesMgnt => salesMgnt) : selectedList = [];
        setSelectedObjects(selectedList);
    };

    const handleSelectOne = (event, selectedObject) => {
        const selectedIndex = selectedObjects.indexOf(selectedObject);
        let newSelectedObjects = [];

        if (selectedIndex === -1) {
            newSelectedObjects = newSelectedObjects.concat(selectedObjects, selectedObject);
        } else if (selectedIndex === 0) {
            newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(1));
        } else if (selectedIndex === selectedObjects.length - 1) {
            newSelectedObjects = newSelectedObjects.concat(selectedObjects.slice(0, -1));
        } else if (selectedIndex > 0) {
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
        getSalesMgnts(page, pageInfo.size);
    };

    const handleRowsPerPageChange = event => {
        setPageInfo(prev => {
            return {
                ...prev,
                page: 0,
                size: event.target.value
            };
        });
        getSalesMgnts(0, event.target.value);
    };

    const handleRowClick = (obj) => {
        history.push(`${rootUrl}/salesMgnt/${obj.id}`);
    };

    const removeObject = async (id) => {
    };

    // TODO | 2021.04.12 | ldy8385 | 다운로드버튼 작성 필요
    const handleDownload = () => {
        console.log('다운로드 버튼 만들어야함')
    };

    const slice = () => (0, pageInfo.size);

    const objView = (obj, index) => (
        <MC.TableRow
            hover
            key={obj.id}>

            {/*동*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                {obj.salesTitle}
            </MC.TableCell>

            {/*호*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                {obj.salesInfo}
            </MC.TableCell>

            {/*연락처*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                {obj.fromTimeType}
            </MC.TableCell>

            {/*상품명*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                {obj.toTimeType}
            </MC.TableCell>

            {/*구분*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                {obj.isUse}
            </MC.TableCell>

            {/*금액*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                {obj.maxReservationType}
            </MC.TableCell>

            {/*결제수단*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                <DateFormat date={obj.reservationFromDate} format={"YYYY-MM-DD"}/>
                <DateFormat date={obj.reservationToDate} format={"YYYY-MM-DD"}/>
                {obj.reservationTotalCount}
            </MC.TableCell>

            {/*구분*/}
            <MC.TableCell onClick={() => handleRowClick(obj)}
                          align={"center"}>
                {
                    obj.salesDataType.reservationType === "MONTH" ? <MC.Chip label={"월간"}/> :
                        obj.salesDataType.reservationType === "DAY" && <MC.Chip label={"일간"}/>
                }
            </MC.TableCell>

        </MC.TableRow>
    );

    return (
        <MC.Card
            {...rest}
            className={clsx(classes.root, className)}>

            <MC.CardHeader
                title={"매출 목록"}
                subheader={
                    <>
                        총 {pageInfo.total} 건
                    </>
                }
                titleTypographyProps={{variant: "h4"}}/>

            <MC.Divider/>

            <MC.CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        <MC.Table size="small">
                            <MC.TableHead>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"}>동</MC.TableCell>
                                    <MC.TableCell align={"center"}>호</MC.TableCell>
                                    <MC.TableCell align={"center"}>연락처</MC.TableCell>
                                    <MC.TableCell align={"center"}>상품명</MC.TableCell>
                                    <MC.TableCell align={"center"}>구분</MC.TableCell>
                                    <MC.TableCell align={"center"}>금액</MC.TableCell>
                                    <MC.TableCell align={"center"}>결제수단</MC.TableCell>
                                    <MC.TableCell align={"center"}>구분</MC.TableCell>
                                </MC.TableRow>
                            </MC.TableHead>
                            <MC.TableBody>
                                {
                                    salesMgnts ?
                                        (
                                            salesMgnts.length === 0 ?
                                                <MC.TableRow hover>
                                                    <MC.TableCell colSpan={9} align="center">
                                                        조회된 매출 데이터가 한 건도 없네요.
                                                    </MC.TableCell>
                                                </MC.TableRow>
                                                :
                                                salesMgnts.slice(slice).map(objView)
                                        )
                                        :
                                        <MC.TableRow hover>
                                            <MC.TableCell colSpan={9} align="center">
                                                <MC.CircularProgress color="secondary"/>
                                            </MC.TableCell>
                                        </MC.TableRow>
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
                                onClick={handleDownload}>
                                다운로드
                            </MC.Button>
                        </MC.ButtonGroup>
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

export default SalesMgntsTable;
