import React, {useState} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
/**
 * 2021.04.12 | junghoon15 | 예약내역 승인 모달 생성 created
 * @constructor
 */

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
    modalRoot: {
        width: 600,
        padding: 10,
        backgroundColor: "white"
    },
    textRow: {
        width: "100%",
        display: "flex",
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: "center",
        alignItems: "center"
    },
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvConfirmModal = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const classes = useStyles();
    const {show, handleConfirm , hideConfirmModal} = props;
    // Function --------------------------------------------------------------------------------------------------------
    const handleCancel = event => {
        hideConfirmModal();
    }

    const handleSubmit = event => {
        handleConfirm();
        hideConfirmModal();
    }
    // LifeCycle -------------------------------------------------------------------------------------------------------

    // DOM -------------------------------------------------------------------------------------------------------------
    return (
        <MC.Modal
            open={show}
            onClose={handleCancel}
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <MC.Grid container className={classes.modalRoot}>
                {/* Header 시작 */}
                <MC.Grid item className={classes.itemRow}>
                    <span>예약내역 승인</span>
                </MC.Grid>
                {/* Header 끝 */}

                <MC.Grid item style={{width: "100%", marginTop: 10, marginBottom: 10}}>
                    <MC.Divider />
                </MC.Grid>

                {/* Body 시작 */}
                <MC.Grid item className={classes.textRow}>
                    <span>선택한 예약내역을 승인하시겠습니까?</span>
                </MC.Grid>
                {/* Body 끝 */}

                <MC.Grid item style={{width: "100%", display: "flex", justifyContent:"center", alignItems:"center"}}>
                    <MC.Grid container justify={"center"} alignItems={"center"} spacing={2}>
                        <MC.Grid item>
                            <MC.Button
                                style={{width: 100, height:40}}
                                variant={"outlined"}
                                onClick={handleCancel}
                            >
                                취소
                            </MC.Button>
                        </MC.Grid>
                        <MC.Grid item>
                            <MC.Button
                                style={{width: 100, height:40}}
                                color={"primary"}
                                variant={"outlined"}
                                onClick={handleSubmit}
                            >
                                확인
                            </MC.Button>
                        </MC.Grid>
                    </MC.Grid>
                </MC.Grid>
            </MC.Grid>
        </MC.Modal>
    )
};

export default ResrvConfirmModal;
