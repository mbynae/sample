import React, { useEffect, useState }   from "react";
import * as MS                          from "@material-ui/styles";
import { AlertDialog }                  from "../../../../../components";
import { UseGuideModal, UseGuideTable } from "./components";
import { useGuideRepository }           from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
	inner: {
		minWidth: 1530,
		minHeight: 630,
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between"
	}
}));

const UseGuideMgnt = props => {
	const classes = useStyles();
	const { className, history, menuKey, rootUrl, ...rest } = props;
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [useGuideInfo, setUseGuideInfo] = useState({});	// 이용안내 정보
	const [tempUseGuide, setTempUseGuide] = useState({ use_info: "" });	// 수정에 필요한 임시 이용안내 정보
	const [errors, setErrors] = useState({
		use_info: false
	});

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getUseGuide();
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getUseGuide = () => {
		useGuideRepository.getUseGuide()
			.then(result => {
				if(result.data_json == null) {
					setIsEdit(false);
				} else {
					setIsEdit(true);
				}
				setUseGuideInfo(result.data_json);
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

	const handleOpen = () => {
		if(isEdit) {
			setTempUseGuide(prev => {
				return {
					...prev,
					use_info: useGuideInfo.use_info
				}
			});
		} else {
			setTempUseGuide(prev => {
				return {
					...prev,
					use_info: ""
				}
			});
		}
		setOpen(true);
	};

	const handleClose = () => {
		// UseGuideModal 에러값 초기화
		setErrors(prev => {
			return {
				...prev,
				use_info: false
			};
		});
		setOpen(false);
	};

	return (
		<div className={classes.root}>

			<div className={classes.content}>
				<UseGuideTable
					isEdit={isEdit}
					handleOpen={handleOpen}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					getUseGuide={getUseGuide}
					useGuideInfo={useGuideInfo}
				/>
			</div>

			<UseGuideModal
				open={open}
				handleClose={handleClose}
				isEdit={isEdit}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				getUseGuide={getUseGuide}
				useGuideInfo={useGuideInfo}
				tempUseGuide={tempUseGuide}
				setTempUseGuide={setTempUseGuide}
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

export default UseGuideMgnt;
