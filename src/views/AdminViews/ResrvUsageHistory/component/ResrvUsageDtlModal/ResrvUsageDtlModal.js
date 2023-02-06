import React, {useState,useEffect} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
/**
 * 2021.04.14 | junghoon15 | 사용자 신규 생성 created
 * @constructor
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
const ResrvUsageDtlModal = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const classes = useStyles();
    const {show, handleClose} = props;
    // Function --------------------------------------------------------------------------------------------------------
    const modalRow = (obj) => {
        return (
            <MC.TableRow
            >
                <MC.TableCell align={"center"}>
                    2021-01-01
                </MC.TableCell>
                <MC.TableCell align={"center"}>
                    09:01
                </MC.TableCell>
                <MC.TableCell align={"center"}>
                    입실
                </MC.TableCell>
            </MC.TableRow>
        )
    };
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
                    <span>이용내역 상세보기</span>
                </MC.Grid>
                {/* Header 끝 */}

                <MC.Grid item style={{width: "100%", marginTop: 10, marginBottom: 10}}>
                    <MC.Divider />
                </MC.Grid>

                {/* Body 시작 */}
                <MC.Grid item className={classes.centerLayout}>
                    <PerfectScrollbar style={{width: "100%"}}>
                        <div style={{width: "100%"}}>
                            <MC.Table size={"small"}>
                                <MC.TableHead>
                                    <MC.TableRow>
                                        <MC.TableCell align={"center"}>이용일</MC.TableCell>
                                        <MC.TableCell align={"center"}>시간</MC.TableCell>
                                        <MC.TableCell align={"center"}>구분</MC.TableCell>
                                    </MC.TableRow>
                                </MC.TableHead>

                                <MC.TableBody>
                                    {modalRow()}
                                </MC.TableBody>
                            </MC.Table>
                        </div>
                    </PerfectScrollbar>
                </MC.Grid>
                {/* Body 끝 */}

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

export default ResrvUsageDtlModal;
