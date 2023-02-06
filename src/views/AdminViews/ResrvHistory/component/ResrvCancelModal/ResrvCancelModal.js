import React, {useState} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
/**
 * 2021.04.12 | junghoon15 | 예약취소 모달 created
 * @constructor
 * TODO | 문자 발송 api
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
    itemRow: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvCancelModal = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const classes = useStyles();
    const {show, handleCancel, hideCancelModal} = props;
    // Function --------------------------------------------------------------------------------------------------------
    const handleSubmit = (event) => {
        handleCancel();
        hideCancelModal();
    }
    // LifeCycle -------------------------------------------------------------------------------------------------------

    // DOM -------------------------------------------------------------------------------------------------------------
    return (
        <MC.Modal
            open={show}
            onClose={hideCancelModal}
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <MC.Grid container className={classes.modalRoot}>
                {/* Header 시작 */}
                <MC.Grid item className={classes.itemRow}>
                    <span>예약내역 취소</span>
                </MC.Grid>
                {/* Header 끝 */}

                <MC.Grid item style={{width: "100%", marginTop: 10, marginBottom: 10}}>
                    <MC.Divider />
                </MC.Grid>

                {/* Body 시작 */}
                <MC.Grid item className={classes.itemRow}>
                    <form
                        style={{width: "100%"}}
                        onSubmit={handleSubmit}
                    >
                        {/* 환불수수료율 취소 시작 */}
                        <MC.Grid container style={{width: "100%"}} justify={"space-between"} alignItems={"center"}>
                            <MC.Grid item>
                                <span>환불수수료</span>
                            </MC.Grid>
                            <MC.Grid item>
                                <MC.TextField
                                    select
                                    variant={"outlined"}
                                    name={"refund"}
                                    id={"refund"}
                                    style={{width: 400}}
                                    // value={}
                                    // onChange
                                    >
                                    <MC.MenuItem value={"hi"}>hi</MC.MenuItem>
                                </MC.TextField>
                            </MC.Grid>
                        </MC.Grid>
                        {/* 환불수수료율 취소 시작 */}

                        {/* 취소사유 시작 */}
                        <MC.Grid container style={{width: "100%", marginTop: 10}} justify={"space-between"} alignItems={"center"}>
                            <MC.Grid item>
                                <span>취소사유</span>
                            </MC.Grid>
                            <MC.Grid item>
                                <MC.TextField
                                    variant={"outlined"}
                                    id={"cancel"}
                                    name={"cancel"}
                                    style={{width: 400}}
                                    placeholder={""}
                                    // value={}
                                    // onChange={}
                                />
                            </MC.Grid>
                        </MC.Grid>
                        {/* 취소사유 끝 */}

                        {/* 문자전송여부 시작 */}
                        <MC.Grid container style={{width: "100%", marginTop: 10}} justify={"space-between"} alignItems={"center"}>
                            <MC.Grid item>
                                <span>문자전송여부</span>
                            </MC.Grid>
                            <MC.Grid item style={{width: 400,display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                                <MC.Checkbox
                                    // checked={}
                                    // onChange={}
                                    color={"primary"}
                                />
                            </MC.Grid>
                        </MC.Grid>
                        {/* 문자전송여부 끝 */}

                        <MC.Grid container style={{width: "100%", marginTop: 10}} justify={"center"} alignItems={"center"}>
                            <MC.Grid item>
                                <MC.Button
                                    style={{width: 100, height:40}}
                                    color={"primary"}
                                    variant={"contained"}
                                    type={"submit"}
                                >
                                    등록
                                </MC.Button>
                            </MC.Grid>
                        </MC.Grid>
                    </form>
                </MC.Grid>
                {/* Body 끝 */}
            </MC.Grid>
        </MC.Modal>
    )
};

export default ResrvCancelModal;
