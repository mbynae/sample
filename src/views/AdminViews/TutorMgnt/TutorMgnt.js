import React, {useState,useEffect}           from "react";
import clsx                                  from "clsx";
import * as MC                               from "@material-ui/core";
import * as MS                               from "@material-ui/styles";
import {inject, observer}                    from "mobx-react";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import {TutorMgntTable, TutorMgntRegModal}   from "./component"
import { tutorMgntRepository }               from "../../../repositories";

const useStyles = MS.makeStyles(theme => ({
    root:{
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const TutorMgnt = props => {

	const classes = useStyles();
	const {SignInStore } = props;
	const [rootUrl, setRootUrl] = useState("");
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [tutorList, setTutorList] = useState([]);
	const [tutorInfo, setTutorInfo] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState({
		inst_name: false,
		inst_teln: false,
	});
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});

	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "시설/강좌관리",
			href: `${rootUrl}/dashboard`
		},
		{
			title: "강사관리",
			href: `${rootUrl}/tutorMgnt`
		}
	]);

	useEffect(() => {
			window.scrollTo(0,0);
			const init = async () => {
				await generateRootUrl();
				await getTutorList();
				await setIsLoading(false);
			};
			setTimeout(() => {
					init();
			}, 100);
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
	};

	const getTutorList = (page, size) => {
		tutorMgntRepository.getTutorList({
			page: page ? page : 0,
			size: size ? size : 10
		}).then(result => {
			setTutorList(result.data_json_array);
			setPageInfo(result.paginginfo);
		})
	}

	const handleOpen = (obj, isEdit) => {

		if(isEdit) {	// 수정
			setIsEdit(isEdit);
			setTutorInfo(prev => {
				return {
					...prev,
					inst_numb: obj.inst_numb,
					clss_code: obj.clss_code,
					inst_name: obj.inst_name,
					inst_teln: obj.inst_teln
				}
			});
			setOpen(true);
		} else {	// 등록
			setIsEdit(isEdit);
			initTutorInfo();
			setOpen(true);
		}
	}

	const handleClose = () => {
		// 에러값 초기화
		setErrors(prev => {
			return {
				...prev,
				inst_name: false,
				inst_teln: false,
			}
		});

		setOpen(false);
	}

	// 강사 정보 초기화
	const initTutorInfo = () => {
		setTutorInfo(prev => {
			return {
				...prev,
				inst_numb: null,
				clss_code: "00000000",
				inst_name: "",
				inst_teln: ""
			}
		});
	}

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
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
					noFn:  () => noCallback()
				};
			}
		);
	};

	return (
			<div className={classes.root}>
					<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

					<div className={classes.content}>
						<TutorMgntTable
							handleOpen={handleOpen}
							handleClose={handleClose}
							alertOpens={alertOpens}
							setAlertOpens={setAlertOpens}
							handleAlertToggle={handleAlertToggle}
							getTutorList={getTutorList}
							tutorList={tutorList}
							pageInfo={pageInfo}
							setPageInfo={setPageInfo}
							isLoading={isLoading}
						/>
					</div>

				<TutorMgntRegModal
					open={open}
					setOpen={setOpen}
					handleClose={handleClose}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					getTutorList={getTutorList}
					tutorInfo={tutorInfo}
					setTutorInfo={setTutorInfo}
					isEdit={isEdit}
					errors={errors}
					setErrors={setErrors}
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
	)
};

export default inject("SignInStore")(observer(TutorMgnt));
