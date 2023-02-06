import React, { useEffect, useState, useRef }          from "react";
import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import MomentUtils                                     from "@date-io/moment";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as MI                                         from "@material-ui/icons";
import { prgmMgntRepository }                          from "../../../../../repositories";
import moment                                          from "moment";
import CalendarTodayOutlinedIcon                       from "@material-ui/icons/CalendarTodayOutlined";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
		marginTop: theme.spacing(2)
	},
	cardContent:              {
		width:"90%", marginLeft:"5%", marginTop:"1%"
	},
	tableCellTitle:           {
		width: "15%",
		backgroundColor: "#f2f2f2"
	},
	tableCellFull:            {
		backgroundColor: "#fafafa",
		height: "30px"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%"
	},
	formControl:              {
		margin:       theme.spacing(1)
	},
	infoAlert:								{
		color: "#f44336",
		width: "100%",
		whiteSpace: "pre-line",
		margin: 0,
	}

}));

const PrgmMgntEditForm = props => {
	const classes = useStyles();
	const { isEdit, AptComplexStore, programInfo:obj, setProgramInfo:setObj, prgmName, setPrgmName, showDetInfoModal, showSeatModal, dateInit, errors, setErrors, pymtCheck, setPymtCheck, rsvtCheck, setRsvtCheck } = props;
	const [fcltList, setFcltList] = useState([]); // 대분류
	const [prgmList, setPrgmList] = useState([]); // 중분류(이용권)
	const [dayList, setDayList] = useState([]); // group_C100 운영요일
	const [paymentList, setPaymentList] = useState([]); // group_B240 결제구분
	const [ticketList, setTicketList] = useState([]); // group_B320 이용권유형
	const [resrvMethodList, setResrvMethodList] = useState([]);  // group_B170 예약방법
	const [termCodeList, setTermCodeList] = useState([]); // group_B340
	const [maxTermCodeList, setMaxTermCodeList] = useState([]); // group_B341
	// const [monthDtl, setMonthDtl] = useState(false); // 월간 선택시 나오는 체크박스 관리 state
	const [fop, setFop] = useState("N"); // 1인 입실제한 관리 state
	const [instList, setInstList] = useState([]); // 강사선택
	const [schdList, setSchdList] = useState([]); // 신청기간선택

	const handleDateChange = (key, date) => {
		setObj(prev => {
			return {
				...prev,
				[key]: date.format('yyyy-MM-DD')
			}
		});

		if (key === "prgm_end_date") {
			if (obj.prgm_end_date < obj.prgm_strt_date) { // 종료일보다 시작일이 크면
				setErrors(prev => {
					return {...prev, prgm_end_date: true, prgm_strt_date: false}
				});
			}
			else {
				setErrors(prev => {
					return {...prev, prgm_end_date: false, prgm_strt_date: false}
				});
			}
		}

	};

	const [selectedPayMethod, setSelectedPayMethod] = useState([]);																									// 분기 관리 state
	const [selectedWeek, setSelectedWeek] = useState([]);																												// 요일 관리 state
	const [selectedResrvMethod, setSelectedResrvMethod] = useState([]);																					// 예약방법 관리 state

	const prgmStartTime = [
		{ value: "00:00:00", label: "오전 00:00" },
		{ value: "01:00:00", label: "오전 01:00" },
		{ value: "02:00:00", label: "오전 02:00" },
		{ value: "03:00:00", label: "오전 03:00" },
		{ value: "04:00:00", label: "오전 04:00" },
		{ value: "05:00:00", label: "오전 05:00" },
		{ value: "06:00:00", label: "오전 06:00" },
		{ value: "07:00:00", label: "오전 07:00" },
		{ value: "08:00:00", label: "오전 08:00" },
		{ value: "09:00:00", label: "오전 09:00" },
		{ value: "10:00:00", label: "오전 10:00" },
		{ value: "11:00:00", label: "오전 11:00" },
		{ value: "12:00:00", label: "오후 12:00" },
		{ value: "13:00:00", label: "오후 01:00" },
		{ value: "14:00:00", label: "오후 02:00" },
		{ value: "15:00:00", label: "오후 03:00" },
		{ value: "16:00:00", label: "오후 04:00" },
		{ value: "17:00:00", label: "오후 05:00" },
		{ value: "18:00:00", label: "오후 06:00" },
		{ value: "19:00:00", label: "오후 07:00" },
		{ value: "20:00:00", label: "오후 08:00" },
		{ value: "21:00:00", label: "오후 09:00" },
		{ value: "22:00:00", label: "오후 10:00" },
		{ value: "23:00:00", label: "오후 11:00" }
	];

	const [prgmEndTime, setPrgmEndTime] = useState([
		{ value: "00:59:59", label: "오전 00:59" },
		{ value: "01:59:59", label: "오전 01:59" },
		{ value: "02:59:59", label: "오전 02:59" },
		{ value: "03:59:59", label: "오전 03:59" },
		{ value: "04:59:59", label: "오전 04:59" },
		{ value: "05:59:59", label: "오전 05:59" },
		{ value: "06:59:59", label: "오전 06:59" },
		{ value: "07:59:59", label: "오전 07:59" },
		{ value: "08:59:59", label: "오전 08:59" },
		{ value: "09:59:59", label: "오전 09:59" },
		{ value: "10:59:59", label: "오전 10:59" },
		{ value: "11:59:59", label: "오전 11:59" },
		{ value: "12:59:59", label: "오후 12:59" },
		{ value: "13:59:59", label: "오후 01:59" },
		{ value: "14:59:59", label: "오후 02:59" },
		{ value: "15:59:59", label: "오후 03:59" },
		{ value: "16:59:59", label: "오후 04:59" },
		{ value: "17:59:59", label: "오후 05:59" },
		{ value: "18:59:59", label: "오후 06:59" },
		{ value: "19:59:59", label: "오후 07:59" },
		{ value: "20:59:59", label: "오후 08:59" },
		{ value: "21:59:59", label: "오후 09:59" },
		{ value: "22:59:59", label: "오후 10:59" },
		{ value: "23:59:59", label: "오후 11:59" }
	]);

	useEffect(() => {
		const init = async () => {
			await getFcltList();
			await getPrgmcodeLoad();
			await getPrgmUnitcodeLoad();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	useEffect(() => {
		const func = async () => {
			await prgmNameLoadHandler();
		};

		if(!isEdit){ // 등록시 채번 허용
			if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "10") {
				func();
			} else if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "20"
				&& obj.prgm_strt_time !== "" && obj.prgm_end_time !== ""){
				func();
			} else if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "40"
				&& obj.prgm_strt_date !== "" && obj.prgm_end_date !== ""){
				func();
			} else if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "60"
				&& obj.prgm_strt_date !== "" && obj.prgm_end_date !== ""){
				func();
			} else if(obj.fclt_code === "9000" && obj.fclt_numb !== "" && obj.prtm_clss === "60"
				&& obj.prgm_strt_date !== "" && obj.prgm_end_date !== ""){
				func();
			}
		} else { // 수정시 자식코드일경우에만 허용
			if(obj.program_son!=="" && obj.program_son_chck==="N"){
				if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "10") {
					func();
				} else if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "20"
					&& obj.prgm_strt_time !== "" && obj.prgm_end_time !== ""){
					func();
				} else if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "40"
					&& obj.prgm_strt_date !== "" && obj.prgm_end_date !== ""){
					func();
				} else if(obj.fclt_code === "0000" && obj.fclt_numb !== "" && obj.prtm_clss === "60"
					&& obj.prgm_strt_date !== "" && obj.prgm_end_date !== ""){
					func();
				} else if(obj.fclt_code === "9000" && obj.fclt_numb !== "" && obj.prtm_clss === "60"
					&& obj.prgm_strt_date !== "" && obj.prgm_end_date !== ""){
					func();
				}
			}
		}
	}, [obj]);

	// 부모코드인경우 상품명고정
	useEffect(() => {
		const func = async () => {
			await prgmNameLoad();
		};
		if(isEdit){
			if(obj.program_son==="" || obj.program_son_chck==="Y"){
				func();
			}
		}
	}, [obj]);

	useEffect(() => {
		const func = async () => {
			await getPrgmList(obj.fclt_name);
		};
		if(obj.fclt_name !== "") {
			func();
		}
	}, [obj.fclt_name]);

	// 강사명 불러오기
	useEffect(() => {
		const func = async () => {
			if(obj.fclt_name!==undefined)
			await getInstList(obj.fclt_name);
		};
		if(obj.fclt_name !== "") {
			func();
		}
	}, [obj.fclt_name]);

	// 신청기간 불러오기
	useEffect(() => {
		const func = async () => {
			await getSchdList(obj.fclt_numb);
		};
		if(obj.fclt_name !== "") {
			func();
		}
	}, [obj.fclt_name]);


	// console.log(pymtCheck)

	// useEffect(() => {
	// 	if(obj && obj.pymt_info && obj.pymt_info[0] !== ""){
	// 		setPymtCheck('Y');
	// 	} else if(obj && obj.pymt_info && obj.pymt_info[0]) {
	// 		setPymtCheck('N');
	// 	} else {
	// 		setPymtCheck('N');
	// 	}
	// 	if(obj.rsvt_info !== ['']){
	// 		setRsvtCheck('Y');
	// 	} else {
	// 		setRsvtCheck('N');
	// 	}
	// }, [obj.pymt_info, obj.rsvt_info]);

	useEffect(() => {
		if(obj.prtm_clss=== "10" || obj.prtm_clss=== "20"){
			setObj(prev => {
				return {
					...prev,
					dayw_clss_info: "",
					prgm_strt_date: moment(obj.prgm_strt_date).format('YYYY-MM-DD'),
					prgm_end_date: moment(obj.prgm_end_date).format('YYYY-MM-DD'),
					term_code: obj.term_code,
					max_term_code: obj.max_term_code ,
				};
			});
		}

		if(obj.prtm_clss=== "40" || obj.prtm_clss=== "60"){
			let weeks = selectedWeek.toString().replace(/,/g, "");
			setObj(prev => {
				return {
					...prev,
					dayw_clss_info: weeks,
					prgm_strt_date: moment(obj.prgm_strt_date).format('YYYY-MM-DD'),
					prgm_end_date: moment(obj.prgm_end_date).format('YYYY-MM-DD'),
					prgm_strt_time: obj.prgm_strt_time,
					prgm_end_time: obj.prgm_end_time
				};
			});
		}

	}, [obj.prtm_clss]);

	useEffect(() => {
		if(obj.fclt_code==="9000"){
			setObj(prev => {
				return {
					...prev,
					prtm_clss: "60"
				};
			});
		}
	}, [obj.fclt_code]);

	// 운영요일
	useEffect(() => {
		if(isEdit && obj?.dayw_clss_info) {
			setSelectedWeek(obj.dayw_clss_info);
		}
	}, [obj.dayw_clss_info]);

	useEffect(()=> {
		let weeks = selectedWeek.toString().replace(/,/g, "");
		setObj(prev => {
			return {
				...prev,
				dayw_clss_info: weeks
			}
		});
	}, [selectedWeek]);

	// 예약방법
	useEffect(() => {
		if(isEdit && obj?.rsvt_info) {
			setSelectedResrvMethod(obj.rsvt_info);
		}
	}, [obj.rsvt_info]);

	useEffect(()=> {
		setObj(prev => {
			return {
				...prev,
				rsvt_info: selectedResrvMethod
			}
		});
	}, [selectedResrvMethod]);

	// 결제구분
	useEffect(() => {
		if(isEdit && obj?.pymt_info) {
			setSelectedPayMethod(obj.pymt_info);
		}
	}, [obj.pymt_info]);

	useEffect(()=> {
		setObj(prev => {
			return {
				...prev,
				pymt_info: selectedPayMethod
			}
		});
	}, [selectedPayMethod]);

	useEffect(() => {
		if(fop === "N"){
			setObj(prev => {
				return {
					...prev,
					cnt_chck : 0
				};
			});
		} else if(fop === "Y" || obj.cnt_chck > 0) {
			setObj(prev => {
				return {
					...prev,
					cnt_chck : 1
				};
			});
		}
	}, [fop]);

	useEffect(() => {
		if(isNaN(obj.min_cnt)) {
			setObj(prev => {
				return {
					...prev,
					min_cnt: ""
				}
			});
		}
	}, [obj.min_cnt]);

	useEffect(() => {
		if(isNaN(obj.max_cnt)) {
			setObj(prev => {
				return {
					...prev,
					max_cnt: "",
					recp_cnt: "",
					totl_cnt: ""
				}
			});
		}
	}, [obj.max_cnt]);

	useEffect(() => {
		if(isNaN(obj.use_amt)) {
			setObj(prev => {
				return {
					...prev,
					use_amt: ""
				}
			});
		}
	}, [obj.use_amt]);

	useEffect(() => {
		if(obj.prgm_end_date < obj.prgm_strt_date) {
			setErrors(prev => {
				return {
					...prev,
					prgm_end_date: true,
					prgm_strt_date: true,
				};
			});
		}
	}, [obj.prgm_end_date, obj.prgm_strt_date]);

	// useEffect(()=>{
	// 	if(selectedWeek.length>0){
	// 		setObj(prev => {
	// 			return {
	// 				...prev,
	// 				dayw_clss_info: selectedWeek.sort().join('')
	// 			};
	// 		});
	// 	} else if (selectedWeek.length===0){
	// 		setObj(prev => {
	// 			return {
	// 				...prev,
	// 				dayw_clss_info: "",
	// 			};
	// 		});
	// 	}
	// },[selectedWeek]);

	// useEffect(() => {
	// 	setMaxTermCodeList(maxTermCodeList.filter(a => a.commcode > termCode));
	// }, [termCode]);

	// useEffect(() => {
	// 	setPrgmEndTime(prgmEndTime.filter(a => a.value.substring(0,2) >= strTime.substring(0,2)));
	// }, [strTime]);

	// Function ----------------------------------------------------------------------------------------------------------
	// 대분류 불러오기
	const getFcltList = async() => {
		const fclt_code = null;
		await prgmMgntRepository.getFcltList(fclt_code)
			.then(result => {
				setFcltList(result.data_json_array);
		});
	};

	// 중분류 불러오기
	const getPrgmList = (params) => {
		prgmMgntRepository.getPrgmList(params)
			.then(result => {
				setPrgmList(result.data_json_array);
			})
	};

	// 예약방법,결제구분
	const getPrgmcodeLoad = async() => {
		await prgmMgntRepository.getPrgmcodeLoad()
			.then(result => {
				setDayList(result.data_json_array[0].group_C100);
				setPaymentList(result.data_json_array[0].group_B240);
				setTicketList(result.data_json_array[0].group_B320);
				setResrvMethodList(result.data_json_array[0].group_B170);
			})
	};

	// 이용단위시간
	const getPrgmUnitcodeLoad = async() => {
		await prgmMgntRepository.getPrgmUnitcodeLoad()
			.then(result => {
				setTermCodeList(result.data_json_array[0].group_B340.filter(a => a.commcode>2000 && a.commcode<3000))
				setMaxTermCodeList(result.data_json_array[0].group_B341)
			})
	};

	// 강사선택 불러오기
	const getInstList = async(params) => {
		await prgmMgntRepository.getInstList(params)
			.then(result => {
				setInstList(result.data_json_array);
			});
	};

	// 신청기간 불러오기
	const getSchdList = async(params) => {
		await prgmMgntRepository.getSchdList(params)
			.then(result => {
				setSchdList(result.data_json_array);
			});
	};

	// 대분류
	const handleBigChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		if(event.target.name === "fclt_name"){
			getPrgmList(event.target.value);
		}

		setObj(prev => {
			return {
				...prev,
				fclt_code: value.substring(0,4),
				fclt_numb: value.substring(5,9),
				fclt_name: value
			}
		});

		if (name === "fclt_name") {
			setErrors(prev => {
				return {...prev, fclt_name: value === ""}
			});
		}
		// setBigSelect(value.substring(0,4));
	};


	// 상품명채번 공통
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setObj(prev => {
			return {
				...prev,
				[name]: value
			}
		});

		// setErrors(prev => {
		// 	if (name === "prts_prgm_numb") return {...prev, prts_prgm_numb: value === ""}
		// 	else if (name === "term_code") return {...prev, term_code: value === ""}
		// 	else if (name === "max_term_code") return {...prev, max_term_code: value === ""}
		// 	else { return {...prev} }
		// });

		if (name === "prts_prgm_numb") {
			setErrors(prev => {
				return {...prev, prts_prgm_numb: value === ""}
			});
		}

		// Validation 체크 - 최소운영시간
		if (name === "term_code") {
			if (obj.max_term_code < value) { // 최소운영이 최대운영보다 크면
				setErrors(prev => {
					return {...prev, term_code: true, max_term_code: false}
				});
			}
			else {
				setErrors(prev => {
					return {...prev, term_code: false, max_term_code: false}
				});
				}
		}
		// Validation 체크 - 최대운영시간
		else if (name === "max_term_code") {
			if (obj.term_code > value) {
				setErrors(prev => {
					return {...prev, term_code: false, max_term_code: true}
				});
			}
			else {
				setErrors(prev => {
					return {...prev, term_code: false, max_term_code: false}
				});
			}
		}

		// Validation 체크 - 시작시간
		if (name === "prgm_strt_time") {
			if ((moment(obj.prgm_strt_time).format('YYYY-MM-DD') === moment(obj.prgm_end_time).format('YYYY-MM-DD')) || obj.prtm_clss === "20") {
				if (obj.prgm_end_time < value) { // 시작시간이 끝나는시간보다 크면(빠르면)
					setErrors(prev => {
						return {...prev, prgm_strt_time: true, prgm_end_time: false} // 시작시간 에러
					});
				}
				else {
					setErrors(prev => {
						return {...prev, prgm_strt_time: false, prgm_end_time: false}
					});
				}
			}
		}
		// Validation 체크 - 종료시간
		else if (name === "prgm_end_time") {
			if ((moment(obj.prgm_strt_time).format('YYYY-MM-DD') === moment(obj.prgm_end_time).format('YYYY-MM-DD')) || obj.prtm_clss === "20") {
				if (obj.prgm_strt_time > value) {
					setErrors(prev => {
						return {...prev, prgm_strt_time: false, prgm_end_time: true}
					});
				}
				else {
					setErrors(prev => {
						return {...prev, prgm_strt_time: false, prgm_end_time: false}
					});
				}
			}
		}
	};

	const prgmNameLoadHandler = async() => {
		let program = {
			fclt_code: obj.fclt_code,
			fclt_numb: obj.fclt_numb,
			prtm_clss: obj.prtm_clss,
			dayw_clss_info: obj.dayw_clss_info,
			prgm_strt_date: obj.prgm_strt_date,
			prgm_end_date: obj.prgm_end_date,
			prgm_strt_time: obj.prgm_strt_time,
			prgm_end_time: obj.prgm_end_time,
			prts_prgm_numb: obj.prts_prgm_numb,
			term_code: obj.term_code,
			max_term_code: obj.max_term_code,
		}
		await prgmMgntRepository.getPrgmNameLoad(program)
			.then(result => {
				if(isEdit){
					// 부모코드일때
					if(obj.program_son==="" || obj.program_son_chck==="Y"){
						setPrgmName(obj.prgm_name)
					} else { // 자식코드일때만
						setPrgmName(result.prgm_name)
					}
				} else {
					setPrgmName(result.prgm_name)
				}
			})
	};

	const prgmNameLoad = async() => {
		setPrgmName(obj.prgm_name)
	};

	const handleTicket = event => {																																												// 이용권 선택
		let name = event.target.name;
		let value = event.target.value;

		setErrors(prev => {
			if (name === "prtm_clss") return {...prev, prtm_clss: value === ""}
		});

		setObj(prev => {
			return {
				...prev,
				[name]: value
			}
		});
	};

	// 최소인원
	const handleMinCnt = event => {
		let name = event.target.name;
		let value = event.target.value;

		setObj(prev => {
			return {
				...prev,
				[name]: parseInt(value)
			}
		});

		if (name === "min_cnt") {
			setErrors(prev => {
				return {...prev, min_cnt: value === ""}
			});
		}

		if (name === "min_cnt") {
			if (obj.max_cnt < value) { // 최소가 최대보다 크면
				setErrors(prev => {
					return {...prev, max_cnt: true, min_cnt: false}
				});
			}
			else {
				setErrors(prev => {
					return {...prev, max_cnt: false, min_cnt: false}
				});
			}
		}
	};

	// 최대인원
	const handleMaxCnt = event => {
		let name = event.target.name;
		let value = event.target.value;

		setObj(prev => {
			return {
				...prev,
				[name]: parseInt(value),
				recp_cnt: parseInt(value),
				totl_cnt: parseInt(value)
			}
		});

		if (name === "max_cnt") {
			if (obj.min_cnt > value) { // 최대가 최소보다 작으면
				setErrors(prev => {
					return {...prev, max_cnt: false, min_cnt: true}
				});
			}
			else {
				setErrors(prev => {
					return {...prev, max_cnt: false, min_cnt: false}
				});
			}
		}

	};

	// 가격
	const handlePrice = event => {																																												// 이용가격
		let name = event.target.name;
		let value = event.target.value;

		setObj(prev => {
			return {
				...prev,
				[name]: parseFloat(value)
			}
		});

		if (name === "use_amt" && parseFloat(value) < 1) {
			setErrors(prev => {
				return {...prev, use_amt: value === ""}
			});
		}

	};

	// 성별
	const handleGender = event => {																																												// 성별 선택
		let name = event.target.name;
		let value = event.target.value;
		setObj(prev => {
			return {
				...prev,
				[name]: value
			}
		});
	};

	// 1일 입실제한
	const handleFop = event => {
		setFop(event.target.value);
		if(event.target.value === 'N'){
			setObj(prev => {
				return {
					...prev,
					cnt_chck: 0
				}
			});
		}
	};

	// 1일 입실제한 횟수
	const handleCntChck = event => {
		let name = event.target.name;
		let value = event.target.value;
		setObj(prev => {
			return {
				...prev,
				[name]: parseInt(value)
			}
		});
	};

	// 운영요일
	const handleWeek = event => {																																													// 운영요일 선택 함수
		let weekAray = Array.from(selectedWeek);
		if (weekAray.includes(event.target.value)) {																																		// week에 값이 있으면 추가
			let temp = weekAray.filter(item => item !== event.target.value);
			setSelectedWeek(temp.sort());
		} else {																																																						// selectedWeek에 값이 없으면 제거
			let temp = weekAray.concat(event.target.value);
			setSelectedWeek(temp.sort());
		}
	};

	// 예약방법
	const handleResrvMethod = event => {
		let name = event.target.name;
		let value = event.target.value;
		if (selectedResrvMethod.includes(event.target.value)) {																															// week에 값이 있으면 추가
			let temp = selectedResrvMethod.filter(item => item !== event.target.value);
			setSelectedResrvMethod(temp);
		} else {																																																						// selectedResrvMethod에 값이 없으면 제거
			let temp = selectedResrvMethod.concat(event.target.value);
			setSelectedResrvMethod(temp);
		}
		if (name === "rsvt_info") {
			setErrors(prev => {
				return {...prev, rsvt_info: value === ""}
			});
		}

	};

	// 결제구분
	const handlePaymentMethod = event => {
		let name = event.target.name;
		let value = event.target.value;
		if (selectedPayMethod.includes(event.target.value)) {
			let temp = selectedPayMethod.filter(item => item !== event.target.value);
			setSelectedPayMethod(temp);
		} else {
			let temp = selectedPayMethod.concat(event.target.value);
			setSelectedPayMethod(temp);
		}
		if (name === "pymt_info") {
			setErrors(prev => {
				return {...prev, pymt_info: value === ""}
			});
		}
	};

	// 강사선택, 신청기간선택
	const handleInst = event => {																																												// 성별 선택
		let name = event.target.name;
		let value = event.target.value;
		setObj(prev => {
			return {
				...prev,
				[name]: value
			}
		});
	};

	// console.log(obj)

	const renderTime = () => {
		return (
			// <MC.FormControl fullWidth className={classes.formControl} key={idx}>
				<MC.Grid container spacing={2} alignItems={"center"}>
					<MC.Grid item xs={12} md={5}>
						<MC.TextField
							select
							variant={"outlined"}
							name={"prgm_strt_time"}
							label={"시작시간"}
							style={{width:"100%"}}
							onChange={handleChange}
							value={obj.prgm_strt_time}
							error={errors.prgm_strt_time}
						>
							{
								prgmStartTime.map((item, idx) => (
									<MC.MenuItem value={item.value} key={idx}>{item.label}</MC.MenuItem>
								))
							}
						</MC.TextField>
					</MC.Grid>
					<MC.Grid item xs={12} md={5}>
						<MC.TextField
							select
							variant={"outlined"}
							name={"prgm_end_time"}
							id={"endTime"}
							label={"종료시간"}
							style={{width:"100%"}}
							onChange={handleChange}
							value={obj.prgm_end_time}
							error={errors.prgm_end_time}
						>
							{
								prgmEndTime.map((item, idx) => (
									<MC.MenuItem value={item.value} key={idx}>{item.label}</MC.MenuItem>
								))
							}
						</MC.TextField>
					</MC.Grid>
				</MC.Grid>
			// </MC.FormControl>
		);
	};

	// 일간, 월간
	const renderDate = () => {
		return (
			<MC.Grid container spacing={4} alignItems={"center"}>
				<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"} style={{ display: "flex", alignItems: "center"}}>
					<MC.Grid item xs={12} md={4}>
						<KeyboardDatePicker
							autoOk
							variant="inline"
							margin="normal"
							id="prgm_strt_date-picker-dialog"
							label="시작일"
							format="yyyy.MM.DD"
							inputVariant="outlined"
							disableToolbar
							disablePast
							maxDate={moment(obj.prgm_strt_date).add("3", "M")}
							value={obj.prgm_strt_date || dateInit(true)}
							onChange={(date, value) => handleDateChange("prgm_strt_date", date, value, true)}
							// disabled={!searchInfo.isUseSendDate}
							// maxDate={searchInfo.sendEndDate || new Date()}
							// value={searchInfo.sendStartDate || new Date()}
							// onChange={(date, value) => handleDateChange("sendStartDate", date, value, true)}
							KeyboardButtonProps={{
								"aria-label": "change date"
							}}
							style={{width: "100%"}}
							error={errors.prgm_strt_date}
							className={classes.keyboardDatePicker} />
					</MC.Grid>
					<MC.Grid item xs={1} md={1} style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
						&nbsp; ~ &nbsp;
					</MC.Grid>
					<MC.Grid item xs={12} md={4}>
						<KeyboardDatePicker
							autoOk
							variant="inline"
							margin="normal"
							id="prgm_end_date-picker-dialog"
							label="종료일"
							format="yyyy.MM.DD"
							inputVariant="outlined"
							disableToolbar
							disablePast
							minDate={obj.prgm_strt_date || new Date()}
							value={obj.prgm_end_date || dateInit(false)}
							onChange={(date, value) => handleDateChange("prgm_end_date", date, value, true)}
							// disabled={!searchInfo.isUseSendDate}
							// maxDate={searchInfo.sendEndDate || new Date()}
							// value={searchInfo.sendStartDate || new Date()}
							// onChange={(date, value) => handleDateChange("sendStartDate", date, value, true)}
							KeyboardButtonProps={{
								"aria-label": "change date"
							}}
							style={{width: "100%"}}
							error={errors.prgm_end_date}
							className={classes.keyboardDatePicker} />
					</MC.Grid>
				</MuiPickersUtilsProvider>
			</MC.Grid>
		)
	}

	return (
		<MC.Card style={{ overflow: "visible"}}>
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.TableContainer component={MC.Paper}>
						<MC.Table size={"small"}>
							<MC.TableBody>
								{/* 대분류 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>대분류</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										{/*<MC.FormControl fullWidth className={classes.formControl}>*/}
											<MC.TextField
												disabled = {isEdit}
												select
												variant="outlined"
												name="fclt_name"
												id="fclt_name"
												style={{ width: "100%" }}
												label="시설 및 강좌선택"
												value={obj.fclt_name || ""}
												error={errors.fclt_name}
												onChange={handleBigChange}
											>
												{
													fcltList.map((data, idx) => (
														<MC.MenuItem value={data.fclt_code+"/"+data.fclt_numb} key={data.fclt_numb}>{data.fclm_name}</MC.MenuItem>
													))
												}
											</MC.TextField>
										{/*</MC.FormControl>*/}
									</MC.TableCell>
								</MC.TableRow>
								{/* 대분류 끝 */}

								{/* 중분류 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>중분류</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										{/*<MC.FormControl fullWidth className={classes.formControl}>*/}
											<MC.TextField
												disabled = {isEdit}
												select
												variant="outlined"
												name="prts_prgm_numb"
												id="prts_prgm_numb"
												label="이용권선택"
												style={{ width: "100%" }}
												value={obj.prts_prgm_numb || ""}
												error={errors.prts_prgm_numb}
												onChange={handleChange}
											>
												{
													prgmList.map((data, idx) => (
														<MC.MenuItem value={data.prgm_numb} key={idx}>{data.prgm_name}</MC.MenuItem>
													))
												}
											</MC.TextField>
										{/*</MC.FormControl>*/}
									</MC.TableCell>
								</MC.TableRow>
								{/* 중분류 끝 */}

								{/* 이용권유형 시작 */}
								{obj.fclt_code ?
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>이용권유형</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										<MC.Grid container spacing={2} justify={"flex-start"} alignItems={"center"}>
											<MC.FormControl fullWidth className={classes.formControl}>
												<MC.RadioGroup
													row
													aria-label={"ticket"}
													name={"prtm_clss"}
													error={errors.prtm_clss}
													onChange={handleTicket}
													value={obj.prtm_clss || ""} // ticket
												>
													{obj.fclt_code
														? obj.fclt_code === "9000"
															? <MC.FormControlLabel control={<MC.Radio color={"primary"} onChange={handleTicket} name={"prtm_clss"} value={"60"}/>} label="월간"/>
															: ticketList.map((data, idx) => (
																<MC.FormControlLabel
																	key={idx}
																	control={<MC.Radio color={"primary"} onChange={handleTicket} name={"prtm_clss"} value={data.commcode}/>}
																	label={data.comminfo}
																/>
															))
														:null
													}
												</MC.RadioGroup>
											</MC.FormControl>
										</MC.Grid>
									</MC.TableCell>
								</MC.TableRow> : null }
								{/* 이용권유형 끝 */}

								{/* 이용권상세 시작 */}
								{parseInt(obj.prtm_clss) < 20 ? null :
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>이용권 상세</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										{
											// 최소 운영, 최대 운영시간
											parseInt(obj.prtm_clss) === 20 ?
												// <MC.FormControl fullWidth className={classes.formControl}>
													<MC.Grid container spacing={2} alignItems={"center"}>
														<MC.Grid item xs={12} md={5}>
															<MC.TextField
																select
																variant={"outlined"}
																name={"term_code"}
																id={"minTime"}
																style={{width:"100%"}}
																label={"최소운영시간"}
																onChange={handleChange}
																value={obj.term_code}
																error={errors.term_code}
															>
																<MC.MenuItem value={"0000"}>설정안함</MC.MenuItem>
																{
																	termCodeList.map((data, idx) => (
																		<MC.MenuItem value={data.commcode} key={idx}>{data.comminfo}</MC.MenuItem>
																	))
																}
															</MC.TextField>
														</MC.Grid>
														<MC.Grid item xs={12} md={5}>
															<MC.TextField
																select
																variant={"outlined"}
																name={"max_term_code"}
																id={"maxTime"}
																style={{width:"100%"}}
																label={"최대 이용가능시간"}
																onChange={handleChange}
																value={obj.max_term_code}
																error={errors.max_term_code}
															>
																{
																	maxTermCodeList.map((data, idx) => (
																		<MC.MenuItem value={data.commcode} key={idx}>{data.comminfo}</MC.MenuItem>
																	))
																}
															</MC.TextField>
														</MC.Grid>
													</MC.Grid>
												// </MC.FormControl>
												 : null
												// parseInt(obj.prtm_clss) === 2 &&
												// 	<MC.FormControlLabel
												// 		control={<MC.Checkbox checked={monthDtl} onChange={() => setMonthDtl(!monthDtl)} name={"monthDtl"}/>}
												// 		label={"매월 1일부터 시작"}/>
										}

										{
											// 일간
											parseInt(obj.prtm_clss) === 40 ?
												renderDate() :
												// 월간
												parseInt(obj.prtm_clss) === 60 ?
													renderDate()
											: null
										}

										{
											// 시간 (시간)
											parseInt(obj.prtm_clss) === 20 &&
												renderTime()
										}

										{
											// 시간 (월간 강좌)
											parseInt(obj.prtm_clss) === 60 && obj.fclt_code === "9000" &&
												renderTime()
										}
									</MC.TableCell>
								</MC.TableRow> }
								{/* 이용권상세 끝 */}

								{/* 운영요일 시작 */}
								{parseInt(obj.prtm_clss) < 40 ? null :
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>운영요일</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										{
											dayList.map((data, idx) => (
												<MC.FormControlLabel
													key={idx}
													control={<MC.Checkbox checked={selectedWeek.includes(data.commcode)} onChange={handleWeek} name={"dayw_clss_info"} value={data.commcode || ""}/>} // obj.dayw_clss_info
													label={data.comminfo}
												/>
											))
										}
									</MC.TableCell>
								</MC.TableRow>}
								{/* 운영요일 끝 */}

								{/* 상품명(자식코드일때만) 시작 */}
								{/*{obj.program_son==="" || obj.program_son_chck==="Y" ? null*/}
								{/*	:*/}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>상품명</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										{prgmName}
									</MC.TableCell>
								</MC.TableRow>
								{/*}*/}
								{/* 상품명 끝 */}

								{/* 인원,정원 / 성별구분 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>인원/정원</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.Grid container spacing={2} alignItems={"center"}>
											<MC.Grid item xs={12} md={6}>
												<MC.TextField
													label={"최소"}
													id={"min_cnt"}
													name={"min_cnt"}
													variant={"outlined"}
													onChange={handleMinCnt}
													placeholder={"최소"}
													style={{ width: "100%"}}
													error={errors.min_cnt}
													value={obj.min_cnt || ""}
												/>
											</MC.Grid>
											<MC.Grid item xs={12} md={6}>
												<MC.TextField
													label={"최대"}
													id={"max_cnt"}
													name={"max_cnt"}
													variant={"outlined"}
													onChange={handleMaxCnt}
													placeholder={"최대"}
													style={{ width: "100%" }}
													error={errors.max_cnt}
													value={obj.max_cnt || ""}
												/>
											</MC.Grid>
										</MC.Grid>
									</MC.TableCell>

									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>성별</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.FormControl className={classes.formControl}>
											<MC.RadioGroup
												row
												aria-label={"gender"}
												name={"gend_clss"}
												onChange={handleGender}
												value={obj.gend_clss || ""} // gender
											>
												<MC.FormControlLabel label={"남"} control={<MC.Radio color={"primary"} value={"M"}/>}/>
												<MC.FormControlLabel label={"여"} control={<MC.Radio color={"primary"} value={"F"}/>}/>
												<MC.FormControlLabel label={"공통"} control={<MC.Radio color={"primary"} value={"N"}/>}/>
											</MC.RadioGroup>
										</MC.FormControl>
									</MC.TableCell>

								</MC.TableRow>
								{/* 인원,정원 / 성별구분 끝 */}

								{/* 예약방법 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>예약방법</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										{
											resrvMethodList.map((data, idx) => (
												<MC.FormControlLabel
													key={idx}
													control={<MC.Checkbox checked={selectedResrvMethod.includes(data.commcode)} error={errors.rsvt_info} onChange={handleResrvMethod} name={"rsvt_info"} value={data.commcode || ""}/>} // data.commcode
													label={data.comminfo}
												/>
											))
										}
										{/*{rsvtCheck === 'N' &&*/}
										{/*<MC.DialogContentText className={classes.infoAlert} id="alert-dialog-slide-description">*/}
										{/*	1개 이상 선택해주세요.*/}
										{/*</MC.DialogContentText>*/}
										{/*}*/}
									</MC.TableCell>
								</MC.TableRow>
								{/* 예약방법 끝 */}

								{/* 결제구분 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>결제구분</MC.TableCell>
									<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
										{
											paymentList.map((data, idx) => (
												<MC.FormControlLabel
													key={idx}
													control={<MC.Checkbox checked={selectedPayMethod.includes(data.commcode)} error={errors.pymt_info} onChange={handlePaymentMethod} name={"pymt_info"} value={data.commcode || ""}/>} // obj.pymt_info
													label={data.comminfo}
												/>
											))
										}
										{/*{pymtCheck === 'N' &&*/}
										{/*<MC.DialogContentText className={classes.infoAlert} id="alert-dialog-slide-description">*/}
										{/*	1개 이상 선택해주세요.*/}
										{/*</MC.DialogContentText>*/}
										{/*}*/}
									</MC.TableCell>
								</MC.TableRow>
								{/* 결제구분 끝 */}

								{/* 가격 / 1일 입실제한 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>가격</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.TextField
											id={"price"}
											name={"use_amt"}
											variant={"outlined"}
											onChange={handlePrice}
											value={obj.use_amt || ""} // price
											error={errors.use_amt}
											label="가격"
											style={{ width: "100%" }}/>
									</MC.TableCell>

									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>1일 입실제한</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.FormControl className={classes.formControl}>
											<MC.RadioGroup
												row
												aria-label={"fop"}
												name={"cnt_chck"}
												onChange={handleFop}
												value={obj.cnt_chck>0 ? "Y" : "N"}
											>
												<MC.FormControlLabel label={"있음"} control={<MC.Radio color={"primary"} value={"Y"}/>}/>
												<MC.FormControlLabel label={"없음"} control={<MC.Radio color={"primary"} value={"N"}/>}/>
												{fop === "Y" || parseInt(obj.cnt_chck) > 0?
													<MC.TextField
														label={"횟수"}
														id={"cnt_chck"}
														name={"cnt_chck"}
														variant={"outlined"}
														value={obj.cnt_chck || ""} //cntChck
														// endAdornment={<MC.InputAdornment position="end">회</MC.InputAdornment>}
														onChange={handleCntChck}
														style={{ width: "30%" }}
													/>
												: null}
											</MC.RadioGroup>
										</MC.FormControl>
									</MC.TableCell>
								</MC.TableRow>
								{/* 가격 / 1일 입실제한 끝 */}

								{isEdit ?<>
							{/* 부모코드일때 등장 */}
							{obj.program_son==="" || obj.program_son_chck==="Y" ?
								<>
									<MC.TableRow>
										<MC.TableCell className={classes.tableCellFull}></MC.TableCell>
										<MC.TableCell className={classes.tableCellFull}></MC.TableCell>
										<MC.TableCell className={classes.tableCellFull}></MC.TableCell>
										<MC.TableCell className={classes.tableCellFull}></MC.TableCell>
									</MC.TableRow>
								{/* 좌석배치/ 신청기간 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>좌석배치</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.Grid container spacing={2} alignItems={"center"}>
											<MC.Grid item xs={12} md={6}>
												<MC.Button
													color={"primary"}
													size={"large"}
													variant={"outlined"}
													disableElevation
													style={{ width: "100%" }}
													onClick={showSeatModal} >
													좌석등록
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.TableCell>

									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>상세정보</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.Grid container spacing={2} alignItems={"center"}>
											<MC.Grid item xs={12} md={6}>
												<MC.Button
													color={"primary"}
													size={"large"}
													variant={"outlined"}
													disableElevation
													style={{ width: "100%" }}
													onClick={showDetInfoModal} >
													안내등록
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.TableCell>
								</MC.TableRow>
								{/* 좌석배치/신청기간 끝 */}

								{/* 상세정보/강사명 시작 */}
								<MC.TableRow>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>강사명</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.TextField
											select
											variant={"outlined"}
											name={"inst_numb"}
											id={"inst_numb"}
											label="강사선택"
											style={{ width: "100%" }}
											value={obj.inst_numb || ""}
											onChange={handleInst}
										>
											{
												instList.map((data, idx) => (
													<MC.MenuItem value={data.inst_numb} key={idx}>{data.inst_name}</MC.MenuItem>
												))
											}
										</MC.TextField>
									</MC.TableCell>
									<MC.TableCell variant={"head"} align="center" className={classes.tableCellTitle}>신청기간</MC.TableCell>
									<MC.TableCell width="35%">
										<MC.TextField
											select
											variant={"outlined"}
											name={"schd_numb"}
											id={"schd_numbb"}
											label="신청기간"
											style={{ width: "100%" }}
											value={obj.schd_numb || ""}
											onChange={handleInst}
										>
											{
												schdList.map((data, idx) => (
													<MC.MenuItem value={data.schd_numb} key={idx}>{data.schd_name}</MC.MenuItem>
												))
											}
										</MC.TextField>
									</MC.TableCell>
								</MC.TableRow></> : null}
								{/* 상세정보/강사명 끝 */}
									</>: null}
							</MC.TableBody>
						</MC.Table>
					</MC.TableContainer>
				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default PrgmMgntEditForm;
