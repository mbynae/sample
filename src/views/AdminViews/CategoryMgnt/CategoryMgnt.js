import React, { useEffect, useState }                   from "react";
import { toJS }                                         from "mobx";
import { inject, observer }                             from "mobx-react";
import moment                                           from "moment";
import * as MS                                          from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog, PhoneMask } from "../../../components";
import { CategoryMgntsTable, CategoryMgntModal }          from "./components";
import { facilityCategoryRepository } from "../../../repositories"
import * as MC                                            from "@material-ui/core";

const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	},
}));

const CategoryMgnt = props => {
	const classes = useStyles();
	const { SignInStore, AptComplexStore } = props;
	const [menuKey] = useState("categoryMgnt");
	const [rootUrl, setRootUrl] = useState("");
	const [categoryList, setCategoryList] = useState([]);
	const [open, setOpen] = useState(false);
	const [categoryInfo, setCategoryInfo] = useState({});
	const [prgmTypeList, setPrgmTypeList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 10
	});
	const [errors, setErrors] = useState({
		fclt_info: false,
		prgm_name: false,
		prgm_type: false
	})

	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "시설/강좌관리",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `카테고리설정`,
			href:  `${rootUrl}/categoryMgnt`
		}
	]);

	useEffect(() => {
		window.scrollTo(0,0);
		const init = async () => {
			await generateRootUrl();
			await getCategoryList();
			await getPrgmTypeList();
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

	const getCategoryList = async (page, size) => {
		facilityCategoryRepository.getCategoryList({
			page: page ? page : 0,
			size: size ? size : 10
		}).then(result => {
			setCategoryList(result.data_json_array);
			setPageInfo(result.paginginfo);
		})
	};

	const getCategoryDetail = (obj) => {
		facilityCategoryRepository.getCategoryDetail(obj.fclt_code, obj.fclt_numb, obj.prgm_numb)
			.then(result => {
				setCategoryInfo(result.data_json)
			})
	}

	const getPrgmTypeList = () => {
		facilityCategoryRepository.getPrgmTypeList("C230")
			.then(result => {
				setPrgmTypeList(result.data_json_array)
			})
	}

	const [alertOpens, setAlertOpens] = useState({
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

	const handleOpen = (obj, isEdit) => {
		setIsEdit(isEdit);

		if(isEdit) {	// 수정
			getCategoryDetail(obj);
		} else {	// 등록
			setCategoryInfo({
				fclt_code: obj.fclt_code,
				fclt_numb: obj.fclt_numb,
				fclt_info: obj.exist === 2 ? obj.fclt_info : "",
				prgm_name: "",
				prgm_type: "",
				exist: obj.exist === 2 ? obj.exist : ""
			})
		}
		setOpen(true);
	}

	const handleClose = () => {
		// 에러값 초기화
		setErrors(prev => {
			return {
				...prev,
				fclt_info: false,
				prgm_name: false,
				prgm_type: false
			}
		});
		setOpen(false);
	}

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<div className={classes.content}>
				<CategoryMgntsTable
					history={props.history}
					menuKey={menuKey}
					rootUrl={rootUrl}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					alertOpens={alertOpens}
					setAlertOpens={setAlertOpens}
					handleAlertToggle={handleAlertToggle}
					categoryList={categoryList}
					getCategoryList={getCategoryList}
					handleOpen={handleOpen}
					isLoading={isLoading}
				/>
			</div>

			<CategoryMgntModal
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
				alertOpens={alertOpens}
				setAlertOpens={setAlertOpens}
				handleAlertToggle={handleAlertToggle}
				getCategoryList={getCategoryList}
				categoryInfo={categoryInfo}
				setCategoryInfo={setCategoryInfo}
				prgmTypeList={prgmTypeList}
				pageInfo={pageInfo}
				isEdit={isEdit}
				errors={errors}
				setErrors={setErrors}
			/>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore")(observer(CategoryMgnt));
