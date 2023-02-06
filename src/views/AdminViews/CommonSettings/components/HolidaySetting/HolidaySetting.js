import React, { useEffect, useState } from "react";
import * as MS                        from "@material-ui/styles";
import { AlertDialog }                from "../../../../../components";

import { holidayRepository, commonCodeRepository } from "../../../../../repositories";
import { HolidayTable, HolidayModal }              from "./components";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
}));

const HolidaySetting = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, ...rest } = props;
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [holidayDivision, setHolidayDivision] = useState([])	// 휴일정보 구분 변수
	const [holidayList, setHolidayList] = useState([]);	// 휴일정보 리스트
	const [holidayInfo, setHolidayInfo] = useState({});	// 휴일정보 저장
	const [isLoading, setIsLoading] = useState(true);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});

	useEffect( () => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getHolidayList();
			await setIsLoading(false)
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	// 휴일정보 조회
	const getHolidayList = (page, size) => {
		holidayRepository.getHolidayList(
			"0000",
			{
				page: page? page : 0,
				size: size ? size : 10
			}).then(result => {
			setHolidayList(result.data_json_array);
			setPageInfo(result.paginginfo);
		})
	}

	// 주말 구분 조회
	const getHolidayDivision = () => {
		commonCodeRepository.getGrpCode("B430")
			.then(result => {
				setHolidayDivision(result.data_json_array)
				setHolidayInfo(prev => {
					return {
						...prev,
						holi_numb: null,
						holi_date: new Date(),
						holi_type_name: result.data_json_array[0].commname,
						holi_type: result.data_json_array[0].commcode,
						holi_name: "",
						holi_strt_time: '',
						holi_end_time: '',
						holi_dayw: '',
						cycl_at: 'N'
					}
				})
			})
	}

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
			setIsEdit(isEdit);
			setHolidayInfo(prev => {
				return {
					...prev,
					holi_numb: obj.holi_numb,
					holi_date: obj.holi_date,
					holi_name: obj.holi_name,
					holi_type_name: obj.holi_type_name,
					holi_type: obj.holi_type,
					holi_strt_time: obj.holi_strt_time,
					holi_end_time: obj.holi_end_time,
					holi_dayw: obj.holi_dayw,
					cycl_at: obj.cycl_at
				}
			})
			setOpen(true);
		} else {	// 등록
			setIsEdit(isEdit);
			// 휴일 구분 조회
			getHolidayDivision();
			setOpen(true);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<HolidayTable
					open={open}
					setOpen={setOpen}
					handleOpen={handleOpen}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					getHolidayList={getHolidayList}
					holidayList={holidayList}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					isLoading={isLoading}
				/>
			</div>

			<HolidayModal
				open={open}
				setOpen={setOpen}
				handleClose={handleClose}
				isEdit={isEdit}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				holidayInfo={holidayInfo}
				setHolidayInfo={setHolidayInfo}
				holidayDivision={holidayDivision}
				getHolidayList={getHolidayList}
				pageInfo={pageInfo}
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

export default HolidaySetting;
