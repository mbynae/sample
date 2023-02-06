import React, {useState} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
/**
 * 2021.04.12 | junghoon15 | 일괄취소 모달 created
 * @constructor
 */

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
    modalRoot:{
        width: 600,
        padding: 10,
        backgroundColor: "white"
    },
    itemRow:{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    textRow: {
        width: "100%",
        paddingTop: 20,
        paddingBottom: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const CancelAllModal = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const classes = useStyles();
    const {show, handleCancelAll, hideCancelAllModal} = props;
    // Function --------------------------------------------------------------------------------------------------------
    const handleSubmit = event => {
        handleCancelAll();
        hideCancelAllModal();
    }
    // LifeCycle -------------------------------------------------------------------------------------------------------

    // DOM -------------------------------------------------------------------------------------------------------------
    return (
        <MC.Modal
            open={show}
            onClose={hideCancelAllModal}
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
                    <span>예약내역 일괄취소</span>
                </MC.Grid>
                {/* Header 끝 */}

                <MC.Grid item style={{width: "100%", marginTop: 10, marginBottom: 10}}>
                    <MC.Divider />
                </MC.Grid>

                {/* Body 시작 */}
                <MC.Grid item className={classes.itemRow}>
                    <form style={{width: "100%"}}
                          onSubmit={handleSubmit}>
                        {/* 설명문 시작 */}
                        <MC.Grid container style={{width: "100%"}} justify={"space-between"} alignItems={"center"}>
                            <MC.Grid item className={classes.textRow}>
                                <p>예약 일괄 취소는 동일한 상품만 가능합니다. (예약 일자가 다를 시 일괄취소 불가)</p>
                                <br />
                                <p>취소하고자 하는 기간과 취소사유를 입력하신 후 등록해주세요.</p>
                            </MC.Grid>
                        </MC.Grid>
                        {/* 설명문 끝 */}

                        <MC.Grid container style={{width: "100%", marginTop: 10, marginBottom: 10}}>
                            <MC.Divider style={{width: "100%"}}/>
                        </MC.Grid>

                        {/* 환불수수료율 시작 */}
                        <MC.Grid container style={{width: "100%", marginTop: 10}} justify={"space-between"} alignItems={"center"}>
                            <MC.Grid item>
                                <span>환불수수료율</span>
                            </MC.Grid>
                            <MC.Grid item>
                                <MC.TextField
                                    select
                                    variant={"outlined"}
                                    name={"refund"}
                                    id={"refund"}
                                    style={{width: 400}}
                                >
                                    <MC.MenuItem value={"100"}>100%</MC.MenuItem>
                                    <MC.MenuItem value={"75"}>75%</MC.MenuItem>
                                    <MC.MenuItem value={"50"}>50%</MC.MenuItem>
                                    <MC.MenuItem value={"25"}>25%</MC.MenuItem>
                                </MC.TextField>
                            </MC.Grid>
                        </MC.Grid>
                        {/* 환불수수료율 시작 */}

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

export default CancelAllModal;
