import React, { useEffect, useState }                  from "react";
import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import clsx                                            from "clsx";
import { PhoneMask, PreviousLocationCheck }            from "../../../../../components";
import { inject, observer }                            from "mobx-react";
import { withRouter }                                  from "react-router-dom";
import { prgmMgntRepository }                          from "../../../../../repositories";
import format                                          from "date-fns/format";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";
import moment                                          from "moment";

const useStyles = MS.makeStyles(theme => ({
	root:                  {
		width:     "100%",
		marginTop: 16
	},
	formControl:           {
		margin:       theme.spacing(0),
		marginBottom: 10
	},
	buttonGroupLayout:     {
		display:        "flex",
		justifyContent: "center"
	},
	keyboardDatePicker:    {
		width: "100%"
	},
	buttonColorPrimary:    {
		color:       theme.palette.primary.main,
		borderColor: theme.palette.primary.main
	},
}));

const PrgmMgntSearch = props => {
	const classes = useStyles();

	const {searchInfo, setSearchInfo, setPageInfo, setPrgmList, allInitialize, getDate} = props;

	const [bigResult, setBigResult] = useState([]);
	const [midResult, setMidResult] = useState([]);

	useEffect(() => {
		//대분류 조회
		const getFcltList = prgmMgntRepository.getFcltList(searchInfo.fcltCategory==="" ? undefined : {fclt_code:searchInfo.fcltCategory});
		getFcltList.then(data => {
			setBigResult(data.data_json_array);
		});
	}, [searchInfo.fcltCategory]);

	const handleChange = (event, funcParam) => {
		let name = event.target.name;
		let value = event.target.value;
		let param = funcParam;

		//대분류 선택후 이벤트
		if(name == ("fcltCode")){
			const getPrgmList = prgmMgntRepository.getPrgmList(event.target.value);
			getPrgmList.then(data => {
				setMidResult(data.data_json_array);
			});
		}

		setSearchInfo(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	const handleDateChange = (key, date, value, isFrom) => {
		setSearchInfo({
			...searchInfo,
			[key]: getDate(date, isFrom)
		});
	};

	const getPrgmMstrList = async (page, size) => {
		await prgmMgntRepository.getPrgmMstrList({
			page: page ? page : 0,
			size: size ? size : 10,
			fclt_numb: searchInfo?.fcltCode?.substring(5,9), // 대분류
			prts_prgm_numb: searchInfo.fcltNumb, // 중분류
			prgm_name: searchInfo.prgmName, // 프로그램명
			fclt_code: searchInfo.fcltCategory, // 시설강좌구분
			prgm_strt_date: searchInfo.startDate.format('YYYY-MM-DD'), // 시작일
			prgm_end_date: searchInfo.endDate.format('YYYY-MM-DD')
		}).then(result => {
			setPrgmList(result.data_json_array);
			setPageInfo(result.paginginfo)
		})
	};

	const handleSearchList = event => {
		event.preventDefault();
		getPrgmMstrList();
	}

	return (
		<MC.Card
			{...props.rest}
			className={clsx(classes.root, props.className)}>

			<MC.CardContent className={classes.content}>
				<MC.Grid container spacing={3} justify={"space-between"} alignItems={"flex-start"}>
					<MC.Grid item xs={12} md={12}>
						{/* 프로그램명 / 시설강좌구분 시작 */}
						<MC.Grid container spacing={2}>
							<MC.Grid item xs={6} md={6}>
								{/* 시설강좌구분 체크박스 - 라디오버튼*/}
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.FormLabel component="legend">시설강좌구분</MC.FormLabel>
									<MC.RadioGroup
										row
										aria-label="stateCheckbox"
										name="fcltCategory"
										value={searchInfo.fcltCategory|| ""}
										onChange={handleChange}>
										<MC.FormControlLabel value="" control={<MC.Radio />} label="전체" /> &nbsp; &nbsp; &nbsp;
										<MC.FormControlLabel value="0000" control={<MC.Radio />} label="시설" /> &nbsp; &nbsp; &nbsp;
										<MC.FormControlLabel value="9000" control={<MC.Radio />} label="강좌" />
									</MC.RadioGroup>
								</MC.FormControl>
							</MC.Grid>
							<MC.Grid item xs={6} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="prgmName"
										name="prgmName"
										label="프로그램명"
										placeholder={""}
										value={searchInfo.prgmName || ""}
										onChange={handleChange}
									/>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
						{/* 프로그램명 / 시설강좌구분 끝 */}

						{/* 대분류 / 중분류 시작 */}
						<MC.Grid container spacing={2}>
							<MC.Grid item xs={6} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="fcltCode"
										name="fcltCode"
										label="대분류"
										placeholder={""}
										value={searchInfo.fcltCode || ""}
										select
										onChange={handleChange}
									>
										{bigResult.map((data, index) => (
											<MC.MenuItem key={data.fclt_numb || ''} value={data.fclt_code+"/"+data.fclt_numb || ''}>{data.fclm_name}</MC.MenuItem>
										))
										}
									</MC.TextField>
								</MC.FormControl>
							</MC.Grid>
							<MC.Grid item xs={6} md={6}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="fcltNumb"
										name="fcltNumb"
										label="중분류"
										placeholder={""}
										value={searchInfo.fcltNumb || ""}
										select
										onChange={handleChange}
									>
										{midResult.map((data, index) => (
											<MC.MenuItem key={index} value={data.prgm_numb}>{data.prgm_name}</MC.MenuItem>
										))
										}
									</MC.TextField>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
						{/* 동 / 호 끝 */}

						<MC.Grid container spacing={2}>
							<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
								{/* 시작일 */}
								<MC.Grid item xs={6} md={6}>
									<KeyboardDatePicker
										autoOk
										variant="inline"
										margin="normal"
										id="visitFromDate-picker-dialog"
										label="시작일"
										format="yyyy/MM/DD"
										disableToolbar
										maxDate={searchInfo.endDate || new Date()}
										value={searchInfo.startDate || new Date()}
										onChange={(date, value) => handleDateChange("startDate", date, value, true)}
										KeyboardButtonProps={{
											"aria-label": "change date"
										}}
										className={classes.keyboardDatePicker}/>
								</MC.Grid>
								{/* 종료일 */}
								<MC.Grid item xs={6} md={6}>
									<KeyboardDatePicker
										autoOk
										variant="inline"
										margin="normal"
										id="visitToDate-picker-dialog"
										label="종료일"
										format="yyyy/MM/DD"
										disableToolbar
										minDate={searchInfo.startDate || new Date()}
										value={searchInfo.endDate || new Date()}
										onChange={(date, value) => handleDateChange("endDate", date, value, false)}
										KeyboardButtonProps={{
											"aria-label": "change date"
										}}
										className={classes.keyboardDatePicker}/>
								</MC.Grid>
							</MuiPickersUtilsProvider>
						</MC.Grid>
					</MC.Grid>
					{/* 하단 검색 버튼 시작 */}
					<MC.Grid item xs={12} md={12}>
						<div className={classes.buttonGroupLayout}>
							<MC.ButtonGroup>
								<MC.Button
									className={classes.buttonColorPrimary}
									onClick={()=>allInitialize(undefined)}
								>
									초기화
								</MC.Button>
								<MC.Button
									className={classes.buttonColorPrimary}
									onClick={handleSearchList}
								>
									검색
								</MC.Button>
							</MC.ButtonGroup>
						</div>
					</MC.Grid>
					{/* 하단 검색 버튼 끝 */}
				</MC.Grid>
			</MC.CardContent>
		</MC.Card>
	)
}

export default PrgmMgntSearch;
