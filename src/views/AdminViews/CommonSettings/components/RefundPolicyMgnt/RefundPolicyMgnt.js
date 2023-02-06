import React, { useEffect, useState } from "react";
import * as MS                        from "@material-ui/styles";
import { AlertDialog }                from "../../../../../components";
import {
	refundPolicyRepository,
	facilityIntroductionRepository
}                                               from "../../../../../repositories";
import { RefundPolicyModal, RefundPolicyTable } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
}));

const RefundPolicyMgnt = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, ...rest } = props;
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [fcltNumb, setFcltNumb] = useState(""); // 시설번호
	const [facilityList, setFacilityList] = useState([]); // 취소환불규정 테이블 리스트
	const [fcltNumbList, setFcltNumbList] = useState([]); // 모달에서 사용될 시설 리스트
	const [policySlots, setPolicySlots] = useState([{ dday_name: "", dday_day: "", rfnd_rate: "" }]); // 환불정책 입력 슬롯
	const [errors, setErrors] = useState([{ dday_name: false, dday_day: false, rfnd_rate: false }]); // 환불정책 입력 슬롯 Validation
	const [errorDropdown, setErrorDropdown] = useState(false); // 모달 내 시설 선택 Dropdown Validation
	const [isLoading, setIsLoading] = useState(true);
	const [pageInfo, setPageInfo] = useState({
		page: 0,
		size: 10,
		total: 10
	});

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getFacilityList();
			await getfcltNumbList();
			await setIsLoading(false);
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	// 취소환불규정 테이블 리스트 조회
	const getFacilityList = (page, size) => {
		refundPolicyRepository.getFacilityList({
			page: page ? page : 0,
			size: size ? size : 10
		}).then(result => {
			setFacilityList(result.data_json_array);
			setPageInfo(result.paginginfo);
		});
	};

	// 모달에서 사용될 시설 리스트 조회
	const getfcltNumbList = () => {
		facilityIntroductionRepository.getFacilityList()
			.then(result => {
				setFcltNumbList(result.fcltCntList);
			});
	};

	// 시설번호, 규정슬롯, 에러정보 초기화
	const initAll = () => {
		setFcltNumb("");
		setPolicySlots([{ dday_name: "", dday_day: "", rfnd_rate: "" }]);
		setErrors([{ dday_name: false, dday_day: false, rfnd_rate: false }]);
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
		if (isEdit) {	// 수정
			setIsEdit(isEdit);
			refundPolicyRepository.getRefundPolicyList(obj.fclt_numb)
				.then(result => {
					// 환불규정 개수에 따라 에러항목 추가
					let tempErrors = [];
					for (let i = 0; i < result.data_json_size; i++) {
						tempErrors.push({ dday_name: false, dday_day: false, rfnd_rate: false });
					}
					setErrors(tempErrors); // 에러 항목 Set (수정 이전: setErrors(errors.concat(tempErrors));)
					setPolicySlots(result.data_json_array); // 환불정책 입력 슬롯 Set
					setFcltNumb(obj.fclt_numb);
					setOpen(true);
				});
		} else {	// 등록
			setIsEdit(isEdit);
			initAll();
			setOpen(true);
		}
	};

	const handleClose = () => {
		// 환불정책 입력 슬롯 초기화
		setPolicySlots([{ dday_name: "", dday_day: "", rfnd_rate: "" }]);
		// 에러값 초기화
		setErrors((prevErrors) =>
			prevErrors.map((error) => {
				return {
					...error,
					dday_name: false,
					dday_day: false,
					rfnd_rate: false
				};
			})
		);
		setErrorDropdown(false);
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<RefundPolicyTable
					handleOpen={handleOpen}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					getFacilityList={getFacilityList}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					facilityList={facilityList}
					isLoading={isLoading}
				/>
			</div>

			<RefundPolicyModal
				open={open}
				setOpen={setOpen}
				handleClose={handleClose}
				isEdit={isEdit}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				policySlots={policySlots}
				setPolicySlots={setPolicySlots}
				getFacilityList={getFacilityList}
				errors={errors}
				setErrors={setErrors}
				fcltNumb={fcltNumb}
				setFcltNumb={setFcltNumb}
				pageInfo={pageInfo}
				fcltNumbList={fcltNumbList}
				setErrorDropdown={setErrorDropdown}
				errorDropdown={errorDropdown}
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

export default RefundPolicyMgnt;
