import React, { useEffect, useState } from "react";
import clsx                           from "clsx";

import * as MC                                       from "@material-ui/core";
import * as MS                                       from "@material-ui/styles";
import ExpandMoreIcon                                from "@material-ui/icons/ExpandMore";
import { PhoneMask, PreviousLocationCheck }          from "../../../../../components";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils                                   from "@date-io/moment";
import { useLastLocation }                           from "react-router-last-location";
import moment                                        from "moment";
import { inject, observer }                          from "mobx-react";
import { withRouter }                                from "react-router-dom";
import format                                        from "date-fns/format";

import { resrvHistRepository } from "../../../../../repositories";

/* =====================================================================================================================================================================================================
 * 커스텀 스타일
===================================================================================================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
    root:                  {
        width:     "100%",
        marginTop: 16
    },
    heading:               {
        fontSize:   theme.typography.pxToRem(15),
        flexBasis:  "15%",
        flexShrink: 0,
        color:      theme.palette.secondary.contrastText
    },
    secondaryHeading:      {
        fontSize: theme.typography.pxToRem(13),
        color:    theme.palette.secondary.contrastText
    },
    formControl:           {
        margin:       theme.spacing(0),
        marginBottom: 10
    },
    buttonGroupLayout:     {
        display:        "flex",
        justifyContent: "center"
    },
    expansionPanelSummary: {
        backgroundColor: theme.palette.info.light
    },
    cardHeader:            {
        color:           theme.palette.icon,
        backgroundColor: theme.palette.info.moreLight
    },
    keyboardDatePicker:    {
        width: "100%"
    },
    buttonColorPrimary:    {
        color:       theme.palette.primary.main,
        borderColor: theme.palette.primary.main
    },
    buttonColorSecondary:  {
        color:       theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main
    },
    buttonColorWhite:      {
        color: theme.palette.white
    }
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const ResrvHistSearchBar = props => {
    // State ---------------------------------------------------------------------------------------
    const classes = useStyles();

		const { ResrvHistStore, getResrvHists, aptId, facilityAdditionalFlag, setFacilityAdditionalFlag } = props;
    const [searchInfo, setSearchInfo] = useState({
        userDataType: {}
    });
    const [menuKey, setMenuKey] = useState("");

	//@park
	const [dongDataSize, setDongDataSize] = useState();
	const [dongDataResult, setDongDataResult] = useState([]);
	const [hoDataSize, setHoDataSize] = useState();
	const [hoDataResult, setHoDataResult] = useState([]);
	const [fcltDataSize, setFcltDataSize] = useState();
	const [fcltDataResult, setFcltDataResult] = useState([]);
	const [prgmDataSize, setPrgmDataSize] = useState();
	const [prgmDataResult, setPrgmDataResult] = useState([]);
	const [additionalPrgmDataResult, setAdditionalPrgmDataResult] = useState([]);

	const lastLocation = useLastLocation();

	useEffect(() => {

		if(window.location.pathname == "/gogo/admin/usageHist"){
			setMenuKey("이용 일자");
		}else if(window.location.pathname == "/gogo/admin/resrvHist"){
			setMenuKey("예약 일자");
		}else if(window.location.pathname == "/gogo/admin/modifyHist"){
			setMenuKey("취소/변경 일자");
		}

		const init = () => {
			PreviousLocationCheck(lastLocation, "/resrvHist") ? dataBinding(ResrvHistStore.resrvHistSearch) : dataBinding(undefined);
		};

		//동 조회
		const resrvHistorySearchAdmins = resrvHistRepository.getDongSearch({}, "donghosearch/dong/");
		resrvHistorySearchAdmins.then(data => {
			setDongDataSize(data.data_json_array_size);
			setDongDataResult(data.data_json_array);
		});

		//대분류 조회
		const resrvFcltSearchAdmins = resrvHistRepository.getFcltSearch({}, "rsvtbigload/");

		resrvFcltSearchAdmins.then(data => {
			setFcltDataSize(data.data_json_array_size);
			setFcltDataResult(data.data_json_array);
		});

		setTimeout(() => {
			init();
		});
	}, []);

	const dataBinding = async (searchObj) => {
		let tempSearchInfo = {
			dong_numb: 					 searchObj ? searchObj.dong_numb : "",
			ho_numb:   					 searchObj ? searchObj.ho_numb : "",
			memb_name:        	 searchObj ? searchObj.memb_name : "",
			fclt_name:        	 searchObj ? searchObj.fclt_name : "",
			fclt_numb:        	 searchObj ? searchObj.fclt_numb : "",
			additionalPrgm_numb: searchObj ? searchObj.additionalPrgm_numb : "",
			prgm_numb:        	 searchObj ? searchObj.prgm_numb : "",
			rsvt_strt_date:      searchObj ? searchObj.rsvt_strt_date : dateInit(true),
			rsvt_end_date:       searchObj ? searchObj.rsvt_end_date : dateInit(false)
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			ResrvHistStore.setResrvHistSearch(tempSearchInfo);
			getResrvHists(0, 10);
		} else {
			getResrvHists(ResrvHistStore.pageInfo.page, ResrvHistStore.pageInfo.size);
		}
	};

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);

	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);
		let monthOfYear = date.month();

		if ( !isFrom ) {
			date.month(monthOfYear + 3);
		}
		else {
			date.month(monthOfYear - 3);
		}
		return date;
	};

	const handleDateChange = (key, date, value, isFrom) => {
		setSearchInfo({
			...searchInfo,
			[key]: getDate(date, isFrom)
		});
	};

	//이벤트 bind
	const handleChange = (event, funcParam) => {
		event.preventDefault();

		let name = event.target.name;
		let value = event.target.value;
		let param = funcParam;

		setSearchInfo({
			...searchInfo,
			[name]: value
		});

		//동 선택후 이벤트
		if(name === "dong_numb"){
			// 기존 입력된 호 Number 초기화
			setSearchInfo(prev => {
				return {...prev, ho_numb: ""};
			});

			if(value != "") {

				const resrvHistorySearchAdmins = resrvHistRepository.getHoSearch({}, "donghosearch/ho/" + param.props.value);

				resrvHistorySearchAdmins.then(data => {
					setHoDataSize(data.data_json_array_size);
					setHoDataResult(data.data_json_array);
				});
			}
			else{
				setHoDataSize(0);
				setHoDataResult([]);
			}
		}

		//대분류 선택 후 이벤트
		else if (name === "fclt_name") {

			let fcltNumbParam = value.substring(0, 4);
			let fcltCodeParam = value.substring(4, 8);

			if (value != "") {
				const resrvPrgmSearchAdmins = resrvHistRepository.getPrgmSearch({
					fclt_code : fcltCodeParam,
					fclt_numb : fcltNumbParam
				}, "list/0/");
				resrvPrgmSearchAdmins.then(data => {
					setPrgmDataSize(data.data_json_array_size);
					setPrgmDataResult(data.data_json_array);
				});
			}
			else {
				setPrgmDataSize(0);
				setPrgmDataResult([]);
			}

			// 기존 선택된 중분류, 추가상품 초기화
			setSearchInfo(prev => {
				return {...prev, prgm_numb: "", additionalPrgm_numb: ""};
			});

			// 추가상품 여부 초기화
			setFacilityAdditionalFlag(false);
		}
		// 중분류 선택 후 이벤트
		else if (name === "prgm_numb") {
			// 추가상품 정보 조회
			if (value != "") {
				resrvHistRepository.getFcltSearch({}, "rsvtprgmlistload/" + value, false)
					.then(result => {
						setAdditionalPrgmDataResult(result.data_json_array);
						if (result.data_json_array.length === 0) {
							setFacilityAdditionalFlag(true);
						} else {
							setFacilityAdditionalFlag(false);
						}
					});
			}
			else {
				setAdditionalPrgmDataResult([]);
			}

			// 기존 선택된 추가상품 초기화
			setSearchInfo(prev => {
				return { ...prev, additionalPrgm_numb: "" };
			});
		}
	}

    // Function ------------------------------------------------------------------------------------
    const handleSearchList = event => {
        event.preventDefault();
				ResrvHistStore.setResrvHistSearch(searchInfo);
				getResrvHists(0, ResrvHistStore.pageInfo.size);
    }
    // LifeCycle -----------------------------------------------------------------------------------

    // DOM -----------------------------------------------------------------------------------------
    return (
        <div className={classes.root}>
            <MC.Accordion square>
                {/* 검색필터 영역 시작 */}
                <MC.AccordionSummary
                    className={classes.expansionPanelSummary}
                    expandIcon={<ExpandMoreIcon className={classes.buttonColorWhite}/>}
                    aria-controls={"panel1a-content"}
                    id="panel1a-header"
                >
                    <MC.Typography className={classes.heading}>
                        예약관리 검색필터
                    </MC.Typography>
                    <MC.Typography className={classes.secondaryHeading}>
                        검색 하려면 여기를 클릭해주세요.
                    </MC.Typography>
                </MC.AccordionSummary>
                {/* 검색필터 영역 끝 */}

                {/* 검색상세필터 시작 */}
                <MC.AccordionDetails>
                    <form onSubmit={handleSearchList} style={{width: "100%"}}>
                        <MC.Grid container spacing={3} justify={"space-between"} alignItems={"flex-start"}
												style={{padding: "0px 20px"}}>

													<MC.Grid item xs={12} md={12}>
														{/* 동 / 호 시작 */}
														<MC.Grid container spacing={3}>
															<MC.Grid item xs={12} md={4}>
																<MC.FormControl fullWidth className={classes.formControl}>
																	<MC.TextField
																		id="dong_numb"
																		name="dong_numb"
																		label="동"
																		placeholder={""}
																		select
																		value={searchInfo.dong_numb || ""}
																		onChange={handleChange}
																	>
																		<MC.MenuItem value="">:::Select:::</MC.MenuItem>
																		{dongDataSize > 0 &&
																		dongDataResult.map((data, index) => (
																			<MC.MenuItem key={index} value={data.dong_numb}>{data.dong_numb}동</MC.MenuItem>
																		))
																		}
																	</MC.TextField>
																</MC.FormControl>
															</MC.Grid>

															<MC.Grid item xs={12} md={4}>
																<MC.FormControl fullWidth className={classes.formControl}>
																	<MC.TextField
																		id="ho_numb"
																		name="ho_numb"
																		label="호"
																		placeholder={""}
																		disabled={searchInfo.dong_numb === ""}
																		value={searchInfo.ho_numb || ""}
																		select
																		onChange={handleChange}
																	>
																		<MC.MenuItem value="">:::Select:::</MC.MenuItem>
																		{hoDataSize > 0 &&
																		hoDataResult.map((data, index) => (
																			<MC.MenuItem key={index} value={data.ho_numb}>{data.ho_numb}호</MC.MenuItem>
																		))
																		}
																	</MC.TextField>
																	{searchInfo.dong_numb === "" && <MC.FormHelperText>동을 먼저 선택해주세요.</MC.FormHelperText>}
																</MC.FormControl>
															</MC.Grid>
															{/* 동 / 호 끝 */}

															{/* 이름 입력 시작 */}
															<MC.Grid item xs={12} md={4}>
																<MC.FormControl fullWidth className={classes.formControl}>
																	<MC.TextField
																		id="memb_name"
																		name="memb_name"
																		label="예약자명"
																		placeholder={""}
																		value={searchInfo.memb_name || ""}
																		onChange={handleChange}
																	/>
																</MC.FormControl>
															</MC.Grid>
															{/* 이름 입력 끝 */}
														</MC.Grid>

														{/*-------------------NOT USE--------------------*/}
														{/*/!* 대분류 / 중분류 / 추가상품 입력 시작 *!/*/}
														{/*<MC.Grid container spacing={3}>*/}
														{/*	/!* 대분류 *!/*/}
														{/*	<MC.Grid item xs={12} md={4}>*/}
														{/*		<MC.FormControl fullWidth className={classes.formControl}>*/}
														{/*			<MC.TextField*/}
														{/*				id="fclt_name"*/}
														{/*				name="fclt_name"*/}
														{/*				label="시설이름"*/}
														{/*				placeholder={""}*/}
														{/*				select*/}
														{/*				value={searchInfo.fclt_name || ""}*/}
														{/*				onChange={handleChange}*/}
														{/*			>*/}
														{/*				<MC.MenuItem value="">:::Select:::</MC.MenuItem>*/}
														{/*				{fcltDataSize > 0 &&*/}
														{/*				fcltDataResult.map((data, index) => (*/}
														{/*					<MC.MenuItem*/}
														{/*						key={index} value={data.fclt_numb + data.fclt_code}>{data.fclm_name}</MC.MenuItem>*/}
														{/*				))*/}
														{/*				}*/}
														{/*			</MC.TextField>*/}
														{/*		</MC.FormControl>*/}
														{/*	</MC.Grid>*/}
														{/*	/!* 중분류 *!/*/}
														{/*	<MC.Grid item xs={12} md={4}>*/}
														{/*		<MC.FormControl fullWidth className={classes.formControl}>*/}
														{/*			<MC.TextField*/}
														{/*				id="prgm_numb"*/}
														{/*				name="prgm_numb"*/}
														{/*				label="상품이름"*/}
														{/*				placeholder={""}*/}
														{/*				// value={searchInfo.depthTwo || ""}*/}
														{/*				value={searchInfo.prgm_numb || ""}*/}
														{/*				disabled={searchInfo.fclt_name === ""}*/}
														{/*				select*/}
														{/*				onChange={handleChange}*/}
														{/*			>*/}
														{/*				<MC.MenuItem value="">:::Select:::</MC.MenuItem>*/}
														{/*				{prgmDataSize > 0 &&*/}
														{/*				prgmDataResult.map((data, index) => (*/}
														{/*					<MC.MenuItem key={index} value={data.prgm_numb}>{data.prgm_name}</MC.MenuItem>*/}
														{/*				))*/}
														{/*				}*/}
														{/*			</MC.TextField>*/}
														{/*			{searchInfo.fclt_name === "" && <MC.FormHelperText>시설을 먼저 선택해주세요.</MC.FormHelperText>}*/}
														{/*		</MC.FormControl>*/}
														{/*	</MC.Grid>*/}
														{/*	/!* 추가 상품 *!/*/}
														{/*	<MC.Grid item xs={12} md={4}>*/}
														{/*		<MC.FormControl fullWidth className={classes.formControl}>*/}
														{/*			<MC.TextField*/}
														{/*				id="additionalPrgm_numb"*/}
														{/*				name="additionalPrgm_numb"*/}
														{/*				label="추가상품"*/}
														{/*				placeholder={""}*/}
														{/*				value={searchInfo.additionalPrgm_numb || ""}*/}
														{/*				disabled={searchInfo.prgm_numb === "" || facilityAdditionalFlag}*/}
														{/*				select*/}
														{/*				onChange={handleChange}*/}
														{/*			>*/}
														{/*				<MC.MenuItem value="">:::Select:::</MC.MenuItem>*/}
														{/*				{prgmDataSize > 0 &&*/}
														{/*				additionalPrgmDataResult.map((data, index) => (*/}
														{/*					<MC.MenuItem key={index} value={data.prgm_numb}>{data.prgm_name}</MC.MenuItem>*/}
														{/*				))*/}
														{/*				}*/}
														{/*			</MC.TextField>*/}
														{/*			{searchInfo.prgm_numb === "" && <MC.FormHelperText>상품을 먼저 선택해주세요.</MC.FormHelperText>}*/}
														{/*			{facilityAdditionalFlag && <MC.FormHelperText>선택하신 상품에 대한 추가상품이 없습니다.</MC.FormHelperText>}*/}
														{/*		</MC.FormControl>*/}
														{/*	</MC.Grid>*/}
														{/*</MC.Grid>*/}
														{/*/!* 대분류 / 중분류 입력 끝 *!/*/}

														{/* 시작일 / 종료일 입력 시작 */}
														<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
															<MC.Grid container spacing={2}>
																<MC.Grid item xs={12} md={4}>
																	<KeyboardDatePicker
																		autoOk
																		variant="inline"
																		margin="normal"
																		id="rsvt_strt_date"
																		name="rsvt_strt_date"
																		label={"예약시작일자"}
																		format="yyyy-MM-DD"
																		disableToolbar
																		maxDate={searchInfo.rsvt_end_date || new Date()}
																		value={searchInfo.rsvt_strt_date || new Date()}
																		onChange={(date, value) => handleDateChange("rsvt_strt_date", date, value, true)}
																		KeyboardButtonProps={{
																			"aria-label": "change date"
																		}}
																		className={classes.keyboardDatePicker}/>
																</MC.Grid>
																<MC.Grid item xs={12} md={4}>
																	<KeyboardDatePicker
																		autoOk
																		variant="inline"
																		margin="normal"
																		id="rsvt_end_date"
																		name="rsvt_end_date"
																		label={"예약종료일자"}
																		format="yyyy-MM-DD"
																		disableToolbar
																		minDate={searchInfo.rsvt_strt_date || new Date()}
																		value={searchInfo.rsvt_end_date || new Date()}
																		onChange={(date, value) => handleDateChange("rsvt_end_date", date, value, false)}
																		KeyboardButtonProps={{
																			"aria-label": "change date"
																		}}
																		className={classes.keyboardDatePicker}/>
																</MC.Grid>
															</MC.Grid>
														</MuiPickersUtilsProvider>
														{/* 프로그램 시작일자 / 프로그램 종료일자 입력 끝 */}
													</MC.Grid>

													{/* 하단 검색 버튼 시작 */}
													<MC.Grid item xs={12} md={12}>
														<div className={classes.buttonGroupLayout}>
															<MC.ButtonGroup>
																<MC.Button
																	className={classes.buttonColorPrimary}
																	onClick={() => dataBinding(undefined)}
																>
																	초기화
																</MC.Button>
																<MC.Button
																	className={classes.buttonColorPrimary}
																	type={"submit"}
																>
																	검색
																</MC.Button>
															</MC.ButtonGroup>
														</div>
													</MC.Grid>
													{/* 하단 검색 버튼 끝 */}
												</MC.Grid>
                    </form>
                </MC.AccordionDetails>
                {/* 검색상세필터 끝 */}
            </MC.Accordion>
        </div>
    )
};

export default inject("ResrvHistStore")(withRouter(observer(ResrvHistSearchBar)));
