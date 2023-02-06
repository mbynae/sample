import React, {useState,useEffect} from "react";
import clsx              from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import ResrvModifyDtlModal from "../ResrvModifyDtlModal";
/**
 * 2021.04.14 | junghoon15 | 사용자 신규 생성 created
 * @constructor
 */

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({

}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvModifyTableRow = props => {
    // State -----------------------------------------------------------------------------------------------------------
    const [modal, setModal] = useState(false);
    // Function --------------------------------------------------------------------------------------------------------
    const showModal = () => setModal(true);
    const hideModal = () => setModal(false);

    // LifeCycle -------------------------------------------------------------------------------------------------------

    // DOM -------------------------------------------------------------------------------------------------------------
    return (
        <>
            <MC.TableRow hover>
                {/* 구분 시작 */}
                <MC.TableCell align={"center"}>
                    시설
                </MC.TableCell>
                {/* 구분 끝 */}

                {/* 동 시작 */}
                <MC.TableCell align={"center"}>
                    동
                </MC.TableCell>
                {/* 동 끝 */}

                {/* 호 시작 */}
                <MC.TableCell align={"center"}>
                    호
                </MC.TableCell>
                {/* 호 끝 */}

                {/* 예약자명 시작 */}
                <MC.TableCell align={"center"}>
                    예약자명
                </MC.TableCell>
                {/* 예약자명 끝 */}

                {/* 상품 시작 */}
                <MC.TableCell align={"center"}>
                    상품
                </MC.TableCell>
                {/* 상품 끝 */}

                {/* 기간 시작 */}
                <MC.TableCell align={"center"}>
                    기간
                </MC.TableCell>
                {/* 기간 끝 */}

                {/* 구분 시작 */}
                <MC.TableCell align={"center"}>
                    구분
                </MC.TableCell>
                {/* 구분 끝 */}

                {/* 관리 시작 */}
                <MC.TableCell align={"center"}>
                    <MC.Button
                        style={{width: 40, height:30}}
                        color={"primary"}
                        variant={"outlined"}
                        onClick={showModal}
                    >
                        관리
                    </MC.Button>
                </MC.TableCell>
                {/* 관리 끝 */}
            </MC.TableRow>

            <ResrvModifyDtlModal
                show={modal}
                handleClose={hideModal}
            />
        </>
    )
};

export default ResrvModifyTableRow;
