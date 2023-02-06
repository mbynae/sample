import React, {useState,useEffect} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
/**
 * 2021.04.14 | junghoon15 | 사용자 신규 생성 created
 * @constructor
 * TODO | 상세내용 기입 필요
 */

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
    modalRoot: {
        width: 400,
        padding: 10,
        backgroundColor: "white"
    },
    itemRow: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    centerLayout: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems:"center"
    }
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvModifyDtlModal = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const classes = useStyles();
    const {show, handleClose} = props
    // Function --------------------------------------------------------------------------------------------------------

    // LifeCycle -------------------------------------------------------------------------------------------------------

    // DOM -------------------------------------------------------------------------------------------------------------
    return (
        <MC.Modal
            open={show}
            onClose={handleClose}
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            className={classes.centerLayout}
        >
            <MC.Grid container className={classes.modalRoot}>
                {/* Header 시작 */}
                <MC.Grid item className={classes.itemRow}>
                    <span>취소/환불내역 상세보기</span>
                </MC.Grid>
                {/* Header 끝 */}

                <MC.Grid item style={{width: "100%", marginTop: 10, marginBottom: 10}}>
                    <MC.Divider />
                </MC.Grid>

                {/* body 시작 */}
                <MC.Grid item className={classes.centerLayout}>
                    <PerfectScrollbar style={{width: "100%"}}>
                        <div style={{width: "100%"}}>
                            <MC.Table size={"small"}>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"} style={{backgroundColor: "#f2f2f2"}}>상품</MC.TableCell>
                                    <MC.TableCell align={"center"}>골프 - 1개월권</MC.TableCell>
                                </MC.TableRow>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"} style={{backgroundColor: "#f2f2f2"}}>기간</MC.TableCell>
                                    <MC.TableCell align={"center"}>21.01.01 ~ 21.01.31</MC.TableCell>
                                </MC.TableRow>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"} style={{backgroundColor: "#f2f2f2"}}>금액</MC.TableCell>
                                    <MC.TableCell align={"center"}>200000</MC.TableCell>
                                </MC.TableRow>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"} style={{backgroundColor: "#f2f2f2"}}>구분</MC.TableCell>
                                    <MC.TableCell align={"center"}>개별취소 - 고객</MC.TableCell>
                                </MC.TableRow>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"} style={{backgroundColor: "#f2f2f2"}}>취소/변경일자</MC.TableCell>
                                    <MC.TableCell align={"center"}>21.01.05</MC.TableCell>
                                </MC.TableRow>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"} style={{backgroundColor: "#f2f2f2"}}>환불수수료</MC.TableCell>
                                    <MC.TableCell align={"center"}>50%</MC.TableCell>
                                </MC.TableRow>
                                <MC.TableRow>
                                    <MC.TableCell align={"center"} style={{backgroundColor: "#f2f2f2"}}>환불금액</MC.TableCell>
                                    <MC.TableCell align={"center"}>100000</MC.TableCell>
                                </MC.TableRow>
                            </MC.Table>
                        </div>
                    </PerfectScrollbar>
                </MC.Grid>
                {/* body 끝 */}
                <MC.Grid item className={classes.centerLayout} style={{width: "100%", marginTop: 10}}>
                    <MC.Button
                        style={{width: 100, height:40}}
                        color={"primary"}
                        variant={"contained"}
                        onClick={handleClose}
                    >
                        확인
                    </MC.Button>
                </MC.Grid>
            </MC.Grid>
        </MC.Modal>
    )
};

export default ResrvModifyDtlModal;
