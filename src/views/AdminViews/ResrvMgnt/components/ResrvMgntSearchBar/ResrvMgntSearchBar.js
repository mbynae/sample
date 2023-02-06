import React, {useEffect, useState}       from "react";
import { inject, observer }               from "mobx-react";
import * as MC                            from "@material-ui/core";
import * as MS                            from "@material-ui/styles";
import ExpandMoreIcon                     from "@material-ui/icons/ExpandMore";
import {ResrvMgntsTable, ResrvMgntSearch} from "../index";
import { toJS }                           from "mobx";
import { withRouter }                     from "react-router-dom";
import { userMgntRepository }             from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	root:                  {
		width:     "100%",
		marginTop: 16
	},
	heading:               {
		fontSize:   theme.typography.pxToRem(15),
		flexBasis:  "15%",
		flexShrink: 0,
		color:      theme.palette.secondary.contrastText
	},
	secondaryHeading:      {
		fontSize: theme.typography.pxToRem(13),
		color:    theme.palette.secondary.contrastText
	},
	expansionPanelSummary: {
		backgroundColor: theme.palette.info.light
	},
	buttonColorWhite:      {
		color: theme.palette.white
	}
}));

const ResrvMgntSearchBar = props => {

	const classes = useStyles();
	const {AptComplexStore, UserMgntStore, getUserMgnts, history, rootUrl, selectedUser, setSelectedUser, userMgnts, setUserMgnts, pageInfo, setPageInfo, setIsOpen, expanded, setExpanded} = props;

	const [searchInfo, setSearchInfo] = useState({});

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = () => {
			allInitialize(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const allInitialize = async (searchObj) => {
		let tempSearchInfo = {
			building: 			 searchObj ? searchObj.building: "",
			unit: 					 searchObj ? searchObj.unit: "",
			name:            searchObj ? searchObj.name : "",
			phoneNumber:     searchObj ? searchObj.phoneNumber : "",
			userId:          searchObj ? searchObj.userId : "",
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		if ( !searchObj ) {
			UserMgntStore.setUserMgntSearch(tempSearchInfo);
			await getUserMgnts(0, 10);
		} else {
			await getUserMgnts(UserMgntStore.pageInfo.page, UserMgntStore.pageInfo.size);
		}
	};

	return (
		<div className={classes.root}>
			<MC.Accordion square expanded={expanded} onChange={(event, isOpen) => setExpanded(isOpen)}>
				{/* 검색필터 영역 시작 */}
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon className={classes.buttonColorWhite}/>}
					aria-controls={"panel1a-content"}
					id="panel1a-header"
				>
					<MC.Typography className={classes.heading}>
						입주민 검색필터
					</MC.Typography>
					<MC.Typography className={classes.secondaryHeading}>
						검색 하려면 여기를 클릭해주세요.
					</MC.Typography>
				</MC.AccordionSummary>
				{/* 검색필터 영역 끝 */}

				{/* 검색상세필터 시작 */}
				<MC.AccordionDetails>
					<MC.Grid container spacing={3} justify={"space-between"} alignItems={"flex-start"}>
						<MC.Grid item xs={12} md={12}>
							<ResrvMgntSearch
								allInitialize={allInitialize}
								searchInfo={searchInfo}
								setSearchInfo={setSearchInfo}
								getUserMgnts={getUserMgnts}
							/>
						</MC.Grid>
					</MC.Grid>
				</MC.AccordionDetails>
				{/* 검색상세필터 끝 */}
			</MC.Accordion>
		</div>
	)
};

export default inject("UserMgntStore", "AptComplexStore")(withRouter(observer(ResrvMgntSearchBar)));
