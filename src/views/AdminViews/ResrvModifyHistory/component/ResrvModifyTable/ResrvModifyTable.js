import React, {useState,useEffect} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import ResrvModifyTableRow from "../ResrvModifyTableRow";
/**
 * 2021.04.14 | junghoon15 | 변경내역 테이블 created
 * @constructor
 */

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
    root:          {},
    content:       {
        padding: 0
    },
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvModifyTable = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const classes = useStyles();
    const {className, history, menuKey, ...rest} = props;
    // Function --------------------------------------------------------------------------------------------------------

    // LifeCycle -------------------------------------------------------------------------------------------------------

    // DOM -------------------------------------------------------------------------------------------------------------
    return (
        <MC.Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <MC.CardHeader
                title={"취소/변경내역"}
                subheader={
                    <>총 n 건</>
                }
                />

            <MC.Divider />

            <MC.CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div>
                        <MC.Table size={"small"}>
                            {/* 헤더시작 */}
                            <MC.TableHead>
                                <MC.TableCell align={"center"} style={{width: 150}}>구분</MC.TableCell>
                                <MC.TableCell align={"center"} style={{width: 150}}>동</MC.TableCell>
                                <MC.TableCell align={"center"} style={{width: 150}}>호</MC.TableCell>
                                <MC.TableCell align={"center"} style={{width: 150}}>예약자명</MC.TableCell>
                                <MC.TableCell align={"center"}>상품</MC.TableCell>
                                <MC.TableCell align={"center"}>기간</MC.TableCell>
                                <MC.TableCell align={"center"}>구분</MC.TableCell>
                                <MC.TableCell align={"center"}>관리</MC.TableCell>
                            </MC.TableHead>
                            {/* 헤더끝 */}

                            {/* 바디 시작 */}
                            <MC.TableBody>
                                <MC.TableRow hover>
                                    <MC.TableCell colSpan={8} align={"center"}>
                                        조회된 이용내역이 없습니다.
                                    </MC.TableCell>
                                </MC.TableRow>

                                <MC.TableRow hover>
                                    <MC.TableCell colSpan={7} align={"center"}>
                                        <MC.CircularProgress color={"secondary"} />
                                    </MC.TableCell>
                                </MC.TableRow>

                                {[1,2].map((obj, idx) => (
                                    ResrvModifyTableRow
                                    ))
                                }
                            </MC.TableBody>
                            {/* 바디 끝 */}
                        </MC.Table>
                    </div>
                </PerfectScrollbar>
            </MC.CardContent>
        </MC.Card>
    )
};

export default ResrvModifyTable;
