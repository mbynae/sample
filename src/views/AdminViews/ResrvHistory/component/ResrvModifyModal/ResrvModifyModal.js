import React, {useState} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
/**
 * 2021.04.12 | junghoon15 | 예약내역 변경 모달 created
 * @constructor
 * TODO | 좌석 관련 handling
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
    keyboardDatePicker:    {
        width: "40%"
    },
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvModifyModal = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const classes = useStyles();
    const {show, handleModify, hideModifyModal} = props;
    // Function --------------------------------------------------------------------------------------------------------
    const handleSubmit = event => {
        handleModify()
        hideModifyModal()
    }
    // LifeCycle -------------------------------------------------------------------------------------------------------

    // DOM -------------------------------------------------------------------------------------------------------------
    return (
        <MC.Modal
            open={show}
            onClose={hideModifyModal}
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
                    <span>예약 변경</span>
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
                        {/* 기간 시작 */}
                        <MC.Grid container style={{width: "100%"}} justify={"space-between"} alignItems={"center"} >
                            <MC.Grid item>
                                <span>기간</span>
                            </MC.Grid>
                            <MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
                                <MC.Grid container spacing={2} justify={"space-between"} style={{width: 400}}>
                                    <MC.Grid item
                                             className={classes.keyboardDatePicker}
                                    >
                                        <KeyboardDatePicker
                                            autoOk
                                            variant="inline"
                                            margin="normal"
                                            id="createFromDate-picker-dialog"
                                            label="등록일(시작)"
                                            format="yy/MM/DD"
                                            disableToolbar
                                            // maxDate={searchInfo.createToDate || new Date()}
                                            // value={searchInfo.createFromDate || new Date()}
                                            // onChange={(date, value) => handleDateChange("createFromDate", date, value, true)}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date"
                                            }}
                                            // className={classes.keyboardDatePicker}
                                        />
                                    </MC.Grid>
                                    <MC.Grid item
                                             style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        &nbsp; ~ &nbsp;
                                    </MC.Grid>
                                    <MC.Grid item
                                             className={classes.keyboardDatePicker}
                                    >
                                        <KeyboardDatePicker
                                            autoOk
                                            variant="inline"
                                            margin="normal"
                                            id="createToDate-picker-dialog"
                                            label="등록일(종료)"
                                            format="yy/MM/DD"
                                            disableToolbar
                                            // minDate={searchInfo.createFromDate || new Date()}
                                            // value={searchInfo.createToDate || new Date()}
                                            // onChange={(date, value) => handleDateChange("createToDate", date, value, false)}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date"
                                            }}
                                            // className={classes.keyboardDatePicker}
                                        />
                                    </MC.Grid>
                                </MC.Grid>
                            </MuiPickersUtilsProvider>
                        </MC.Grid>
                        {/* 기간 시작 */}

                        {/* 연장 사유 시작 */}
                        <MC.Grid container style={{width: "100%"}} justify={"flex-end"} alignItems={"center"}>
                            <MC.Grid item>
                                <MC.TextField
                                    variant={"outlined"}
                                    id={"reason"}
                                    name={"reason"}
                                    style={{width: 400}}
                                    placeholder={"기간변경 사유 입력"}
                                />
                            </MC.Grid>
                        </MC.Grid>
                        {/* 연장 사유 끝 */}

                        {/* 좌석 시작 */}
                        <MC.Grid container style={{width: "100%", marginTop: 10}} justify={"space-between"} alignItems={"center"}>
                            <MC.Grid item>
                                <span>좌석</span>
                            </MC.Grid>
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
                        {/* 좌석 끝 */}

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

export default ResrvModifyModal;
