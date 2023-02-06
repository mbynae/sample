import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { AlertDialogUserView }                                   from "../../../components";
import { resrvHistRepository } 							 from "../../../repositories";

import { FacilityMgmtTabs, FacilityReservationRegisterForm, CourseReservationRegisterForm } from "./components";

const useStyles = MS.makeStyles(theme => ({
	root:       {
		backgroundColor: theme.palette.white,
		position:        "relative"
	},
	background: {
		position:        "absolute",
		top:             0,
		left:            0,
		width:           "100%",
		height:          245,
		backgroundColor: "#fafafa",
		zIndex:          1
	},
	content:    {
		zIndex:                         2,
		position:                       "relative",
		height:                         "100%",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		maxWidth:                       "1180px",
		display:                        "flex",
		flexDirection:                  "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%"
		}
	},
	layout:     {
		width:                          "100%",
		paddingTop:                     85,
		paddingBottom:                  80,
		[theme.breakpoints.down("xs")]: {
			width:         "100%",
			minWidth:      "100%",
			maxWidth:      "100%",
			margin:        0,
			padding:       10,
			paddingTop:    0,
			paddingBottom: 80
		}
	}
}));

const FacilityReservation = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { UserSignInStore, UserAptComplexStore, FacilityReservationStore, match, history } = props;

	// Root Url 설정
	const [rootUrl, setRootUrl] = useState("");
	const generateRootUrl = async () => {
		let rootUrl = `/${UserSignInStore.aptId}${UserSignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const [reservationType, setReservationType] = useState(0); // 시설 or 강좌
	const [facilityBigList, setFacilityBigList] = useState([]); // 대분류 시설 리스트
	const [facilityMidList, setFacilityMidList] = useState([]); // 중분류 시설 리스트
	const [facilityAdditionalList, setFacilityAdditionalList] = useState([]); // 추가상품 시설 리스트
	const [facilityAdditionalFlag, setFacilityAdditionalFlag] = useState(false); // 추가상품 시설 리스트 여부
	const [prtmclss, setPrtmclss] = useState(""); // 시설 이용권 유형 - 10: 일회, 20: 시간, 40: 일간, 60: 월간

	// Alert Handler
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		noTitle:       "",
		yesTitle:      "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle(),
		isOpenType:    false,
		type:          ""
	});
	const handleAlertToggle = (key, title, content, yesTitle, yesCallback, noTitle, noCallback, type) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					noTitle,
					yesTitle,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback(),
					type
				};
			}
		);
	};

	// Tab Change Handler
	const handleChangeTabs = (e, newValue) => {
		setReservationType(newValue);
		setFacilityAdditionalList([]) // Tab 바뀔시 추가상품 리스트 초기화
		setPrtmclss("")
	};

	// 대분류 정보 조회
	const getFacilityBigList = (value) => {
		resrvHistRepository.getFcltSearch({}, `rsvtbigload/${value}/`, true)
			.then(result => {
				setFacilityBigList(result.data_json_array)
			})
	}
	// 중분류 정보 조회
	const getFacilityMidList = (value) => {
		resrvHistRepository.getPrgmSearch({}, value, true)
			.then(result => {
				setFacilityMidList(result.data_json_array)
			})
	}
	// 추가상품 정보 조회
	const getFacilityAdditionalList = (value) => {
		let valueList = value.split("|")
		resrvHistRepository.getFcltSearch({}, "rsvtprgmlistload/" + valueList[0], true)
			.then(result => {
				setFacilityAdditionalList(result.data_json_array)
				if (result.data_json_array.length === 0) {
					setFacilityAdditionalFlag(true)
					setPrtmclss(valueList[1])
				}
				else {
					setFacilityAdditionalFlag(false)
				}
			})
	}

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			await generateRootUrl();

			if (reservationType === 0) {
				await getFacilityBigList("0000");
			}
			else {
				await getFacilityBigList("9000");
			}
		};
		setTimeout(async () => {
			await init();
		}, 100);
	}, [reservationType]);

	return (
		<div className={classes.root}>
			{
				!isMobile &&
				<div className={classes.background} />
			}
			<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"} className={classes.content}>
				<div className={classes.layout}>

					{
						!isMobile &&
						<MC.Grid item style={{ width: "100%" }}>
							<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
								<MC.Grid item>
									<MC.Typography variant="h3">
										{reservationType === 0 ? "시설예약" : "강좌예약"}
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					}

					{/* 시설 or 강좌 선택 Tab */}
					<MC.Grid item style={{ marginTop: isMobile ? 0 : 73 }}>
						<FacilityMgmtTabs
							value={reservationType}
							fcltTabs={["시설예약", "강좌예약"]}
							handleChange={handleChangeTabs}/>
					</MC.Grid>

					<MC.Grid item style={{ paddingTop: 30, width: "100%" }}>
						{/* 시설 예약 */}
						{
							reservationType === 0 &&
							<FacilityReservationRegisterForm
								history={history}
								rootUrl={rootUrl}
								isMobile={isMobile}
								alertOpens={alertOpens}
								setAlertOpens={setAlertOpens}
								handleAlertToggle={handleAlertToggle}
								facilityBigList={facilityBigList}
								getFacilityMidList={getFacilityMidList}
								facilityMidList={facilityMidList}
								getFacilityAdditionalList={getFacilityAdditionalList}
								facilityAdditionalList={facilityAdditionalList}
								facilityAdditionalFlag={facilityAdditionalFlag}
								prtmclss={prtmclss}
								setPrtmclss={setPrtmclss}
							/>
						}
						{/* 강좌 예약 */}
						{
							reservationType === 1 &&
							<CourseReservationRegisterForm
								history={history}
								rootUrl={rootUrl}
								isMobile={isMobile}
								alertOpens={alertOpens}
								setAlertOpens={setAlertOpens}
								handleAlertToggle={handleAlertToggle}
								facilityBigList={facilityBigList}
								getFacilityMidList={getFacilityMidList}
								facilityMidList={facilityMidList}
								getFacilityAdditionalList={getFacilityAdditionalList}
								facilityAdditionalList={facilityAdditionalList}
								setFacilityAdditionalList={setFacilityAdditionalList}
							/>
						}
					</MC.Grid>

				</div>
			</MC.Grid>

			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
				noTitle={alertOpens.noTitle}
				yesTitle={alertOpens.yesTitle}
			/>

		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore", "FacilityReservationStore")(observer(FacilityReservation));
