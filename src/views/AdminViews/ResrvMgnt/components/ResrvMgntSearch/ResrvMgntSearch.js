import React, { useEffect, useState }       from "react";
import * as MC                              from "@material-ui/core";
import * as MS                              from "@material-ui/styles";
import clsx                                 from "clsx";
import { PhoneMask, PreviousLocationCheck } from "../../../../../components";
import { inject, observer }                 from "mobx-react";
import { withRouter }                       from "react-router-dom";
import { resrvHistRepository }              from "../../../../../repositories";
import format                               from "date-fns/format";

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

const ResrvMgntSearch = props => {
	const classes = useStyles();

	const {UserMgntStore, searchInfo, setSearchInfo, allInitialize, getUserMgnts} = props;

	const [dongDataResult, setDongDataResult] = useState([]);
	const [hoDataResult, setHoDataResult] = useState([]);

	useEffect(() => {
		//동 조회
		const resrvHistorySearchAdmins = resrvHistRepository.getDongSearch({}, "donghosearch/dong/");
		resrvHistorySearchAdmins.then(data => {
			setDongDataResult(data.data_json_array);
		});
	}, []);

	const handleChange = (event, funcParam) => {
		let name = event.target.name;
		let value = event.target.value;
		let param = funcParam;

		//동 선택후 이벤트
		if(name == ("building")){
			if(value != "") {
				const resrvHistorySearchAdmins = resrvHistRepository.getHoSearch({}, "donghosearch/ho/" + value);
				resrvHistorySearchAdmins.then(data => {
					setHoDataResult(data.data_json_array);
				});
			}
		}

		setSearchInfo(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};

	const handleSearchList = event => {
		event.preventDefault();
		UserMgntStore.setUserMgntSearch(searchInfo);
		getUserMgnts(0, UserMgntStore.pageInfo.size);
	}

	return (
		<MC.Card
			{...props.rest}
			className={clsx(classes.root, props.className)}>

			<MC.CardContent className={classes.content}>
				<MC.Grid container spacing={3} justify={"space-between"} alignItems={"flex-start"}>

					<MC.Grid item xs={12} md={12} >

						{/* 동 / 호 시작 */}
						<MC.Grid container spacing={2} justify={"space-around"}>
							<MC.Grid item xs={12} md={4}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="building"
										name="building"
										label="동"
										placeholder={""}
										value={searchInfo.building || ""}
										select
										onChange={handleChange}
									>
										<MC.MenuItem value="">:::Select:::</MC.MenuItem>
										{dongDataResult.map((data, index) => (
											<MC.MenuItem key={data.dong_numb || ''} value={data.dong_numb || ''}>{data.dong_numb}동</MC.MenuItem>
										))
										}
									</MC.TextField>
								</MC.FormControl>
							</MC.Grid>
							<MC.Grid item xs={12} md={2}/>
							<MC.Grid item xs={12} md={4}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="unit"
										name="unit"
										label="호"
										placeholder={""}
										value={searchInfo.unit || ""}
										select
										onChange={handleChange}
									>
										<MC.MenuItem value=''>:::Select:::</MC.MenuItem>
										{hoDataResult.map((data, index) => (
											<MC.MenuItem key={data.ho_numb || ''} value={data.ho_numb || ''}>{data.ho_numb}호</MC.MenuItem>
										))
										}
									</MC.TextField>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
						{/* 동 / 호 끝 */}

						{/* 이름 / 핸드폰번호 입력 시작 */}
						<MC.Grid container spacing={2} justify={"space-around"}>
							<MC.Grid item xs={12} md={4}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="name"
										name="name"
										label="이름"
										placeholder={""}
										value={searchInfo.name || ""}
										onChange={handleChange}
									/>
								</MC.FormControl>
							</MC.Grid>
							<MC.Grid item xs={12} md={2}/>
							<MC.Grid item xs={12} md={4}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.InputLabel id="phoneNumber">연락처</MC.InputLabel>
									<MC.Input
										size="small"
										labelid="phoneNumber"
										id="phoneNumber"
										name="phoneNumber"
										value={searchInfo.phoneNumber || ""}
										onChange={handleChange}
										inputComponent={PhoneMask}
									/>
								</MC.FormControl>
							</MC.Grid>
						</MC.Grid>
						{/* 이름 / 핸드폰번호 입력 끝 */}

						{/* 대분류 / 중분류 입력 시작 */}
						<MC.Grid container spacing={2} justify={"space-around"}>
							<MC.Grid item xs={12} md={4}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.TextField
										id="userId"
										name="userId"
										label="아이디"
										placeholder={""}
										value={searchInfo.userId || ""}
										onChange={handleChange}
									/>
								</MC.FormControl>
							</MC.Grid>
							<MC.Grid item xs={12} md={2}/>
							<MC.Grid item xs={12} md={4}>
							</MC.Grid>
						</MC.Grid>
						{/* 대분류 / 중분류 입력 끝 */}
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

export default inject("UserMgntStore", "AptComplexStore")(withRouter(observer(ResrvMgntSearch)));
