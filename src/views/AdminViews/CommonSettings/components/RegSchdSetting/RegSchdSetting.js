import React, { useEffect, useState } from "react";
import * as MS                        from "@material-ui/styles";
import { AlertDialog }                from "../../../../../components";
import moment                         from "moment";
import {
	regSchdRepository,
	commonCodeRepository,
	prgmMgntRepository,
} from "../../../../../repositories";
import {RegSchdModal, RegSchdTable} from "./components"

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
}));

const RegSchdSetting = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, ...rest } = props;
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [regSchdList, setRegSchdList] = useState([]);	// 신청기간 목록 조회
	const [fcltList, setFcltList] = useState([]);	// 시설목록 조회
	const [regTypeList, setRegTypeList] = useState([]);
	const [regSchdInfo, setRegSchdInfo] = useState({});	// 신청기간 입력 정보
	const [isLoading, setIsLoading] = useState(true);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});
	const [errors, setErrors] = useState({schd_strt_time: false, schd_end_time: false}); //신청기간 시간 에러처리

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getRegSchdList();
			await getFcltList();
			await getRegTypeList();
			await setIsLoading(false)
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	// 신청기간 리스트 조회
	const getRegSchdList = (page, size) => {
		regSchdRepository.getRegSchdList({
			page: page ? page : 0,
			size: size ? size : 10
		})
		.then(result => {
			setRegSchdList(result.data_json_array)
			setPageInfo(result.paginginfo)
		})
	}

	// 시설리스트 조회
	const getFcltList = () => {
		prgmMgntRepository.getFcltList()
			.then(result => {
				setFcltList(result.data_json_array)
			})
	}

	// 예약유형 조회
	const getRegTypeList = () => {
		commonCodeRepository.getGrpCode("B160")
			.then(result => {
				setRegTypeList(result.data_json_array)
			})
	}

	// 신청기간정보 초기화
	const initRegSchdInfo = () => {
		setRegSchdInfo(prev => {
			return {
				...prev,
				schd_numb: null,
				fclt_numb: "0000",
				schd_clss: "1000",
				schd_strt_date: dateInit(true),
				schd_end_date: dateInit(false),
				schd_strt_time: "08:30:00",
				schd_end_time: "22:59:59"
			}
		})
	}

	// 날짜 초기화
	const dateInit = (isFrom) => {
		let date = moment(new Date());
		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 1);
		}

		return date.format('YYYY-MM-DD');
	};

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle()
	});

	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn: () => noCallback()
				};
			}
		);
	};

	const handleOpen = (obj, isEdit) => {
		if(isEdit) {	// 수정
			setIsEdit(true);
			setRegSchdInfo(prev => {
				return {
					...prev,
					schd_numb: obj.schd_numb,
					fclt_numb: obj.fclt_numb,
					schd_clss: obj.schd_clss,
					schd_strt_date: obj.schd_strt_date,
					schd_end_date: obj.schd_end_date,
					schd_strt_time: obj.schd_strt_time,
					schd_end_time: obj.schd_end_time
				}
			});
			setOpen(true);
		} else {	// 등록
			setIsEdit(false);
			initRegSchdInfo();
			setOpen(true);
		}
	};

	const handleClose = () => {
		setErrors({schd_strt_time: false, schd_end_time: false}) //모달 close시 시간 에러표시 초기화
		setOpen(false);
	};

	return (
		<div className={classes.root}>

			<div className={classes.content}>
				<RegSchdTable
					handleOpen={handleOpen}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					getRegSchdList={getRegSchdList}
					regSchdList={regSchdList}
					isLoading={isLoading}
				/>
			</div>

			<RegSchdModal
				open={open}
				setOpen={setOpen}
				handleClose={handleClose}
				isEdit={isEdit}
				regSchdInfo={regSchdInfo}
				setRegSchdInfo={setRegSchdInfo}
				fcltList={fcltList}
				regTypeList={regTypeList}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				getRegSchdList={getRegSchdList}
				pageInfo={pageInfo}
				errors={errors}
				setErrors={setErrors}
			/>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>

		</div>
	);

};

export default RegSchdSetting;
