import React, { useEffect, useState }                                          from "react";
import { inject, observer }                                                    from "mobx-react";
import * as MC                                                                 from "@material-ui/core";
import * as MS                                                                 from "@material-ui/styles";
import {FacilityImageArea, FacilityInformationTable, FacilityInformationTabs } from "./components"
import {facilityIntroductionRepository}																				 from "../../../repositories"

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
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
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
	},
	body4:      {
		...theme.typography.body4,
		marginTop: 6
	}

}));

const FacilityIntroduction = props => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	const [rootUrl, setRootUrl] = useState("");

	const { UserAptComplexStore, history, match } = props;

	const { id } = match.params; // 시설 선택 메뉴 Index

	const [value, setValue] = useState(parseInt(id));
	const [isLoading, setIsLoading] = useState(true);
	const [fcltTabs, setFcltTabs] = useState([]);
	const [fcltCnts, setFcltCnts] = useState({});
	const [fcltAttachedFile, setFcltAttachedFile] = useState([]);
	//const [fcltStore, setFcltStore] = useState([]);

	useEffect(() => {
		const init = () => {
			setIsLoading(false);
			getFcltTabs();	// 처음 렌더링 시 1번만 실행

			setRootUrl(UserAptComplexStore.aptComplex.aptId)
			setValue(parseInt(id)) // 시설 안내 메뉴 적용
		};
		setTimeout(() => {
			init();
		});
	}, [id]);

	const getFcltTabs = () => {
		facilityIntroductionRepository.getUserFacilityList({
			cmpx_numb: UserAptComplexStore.cmpxNumb
		})
		.then(result => {

			let sorted_date_json_array = result.data_json_array.sort((a, b) => a.cnts_numb - b.cnts_numb) // Sort

			if(result.data_json_array_size != 0) {
				//setFcltStore(sorted_date_json_array);	// 시설안내 리스트 정보 전부 저장
				setFcltTabs(sorted_date_json_array);	// 시설안내 탭 정보 저장
				setFcltCnts(sorted_date_json_array[id].fcltinfodata);	// 특정 시설안내 내용 저장
				setFcltAttachedFile(sorted_date_json_array[id].imgdata);	// 시설안내 첨부파일 저장
			}
		});
	}

	const handleChangeTabs = (e, newValue) => {
		setValue(newValue);

		history.push("/" + rootUrl + "/facilityIntroduction/" + newValue)
	};

	return (
		<div className={classes.root}>
			{
				!isMobile &&
				<div className={classes.background} />
			}
			{
				!isLoading &&
				<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"} className={classes.content}>
					<div className={classes.layout}>

						{
							!isMobile &&
							<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
								<MC.Grid item>
									<MC.Typography variant="h3">
										커뮤니티 시설안내
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
						}

						<MC.Grid item style={{ marginTop: isMobile ? 0 : 73 }}>
							<FacilityInformationTabs
								value={value}
								fcltTabs={fcltTabs}
								handleChange={handleChangeTabs}
								isMobile={isMobile}
							/>
						</MC.Grid>

						<MC.Grid item style={{ width: "100%" }}>
							<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"}>
								<FacilityImageArea fcltAttachedFile={fcltAttachedFile}/>
								<FacilityInformationTable fcltCnts={fcltCnts} />
							</MC.Grid>
						</MC.Grid>

					</div>
				</MC.Grid>
			}
		</div>
	);
};

export default inject("UserSignInStore", "UserAptComplexStore")(observer(FacilityIntroduction));
