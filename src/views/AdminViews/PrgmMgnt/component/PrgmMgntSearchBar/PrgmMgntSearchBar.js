import React, {useEffect, useState}    from "react";
import { inject, observer }            from "mobx-react";
import * as MC                         from "@material-ui/core";
import * as MS                         from "@material-ui/styles";
import ExpandMoreIcon                  from "@material-ui/icons/ExpandMore";
import {PrgmMgntTable, PrgmMgntSearch} from "../../component";
import { toJS }                        from "mobx";
import { withRouter }                  from "react-router-dom";
import { userMgntRepository }          from "../../../../../repositories";
import moment                          from "moment";

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

const PrgmMgntSearchBar = props => {

	const classes = useStyles();
	const {history, rootUrl, setPrgmList, setPageInfo, expanded, setExpanded} = props;

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

	const getDate = (date, isFrom) => moment(date).hour(isFrom ? 0 : 23).minute(isFrom ? 0 : 59).second(isFrom ? 0 : 59).milliseconds(isFrom ? 0 : 59);

	const dateInit = (isFrom) => {
		let date = getDate(new Date(), isFrom);

		if ( !isFrom ) {
			let monthOfYear = date.month();
			date.month(monthOfYear + 12);
		} else {
			let monthOfYear = date.month();
			date.month(monthOfYear - 3);
		}
		return date;
	};

	const allInitialize = async (searchObj) => {
		let tempSearchInfo = {
			fcltCode: 			 searchObj ? searchObj.fcltCode: "", // ?????????
			fcltNumb: 			 searchObj ? searchObj.fcltNumb: "", // ?????????
			prgmName:        searchObj ? searchObj.prgmName : "", // ???????????????
			fcltCategory:    searchObj ? searchObj.fcltCategory : "", // ??????????????????
			startDate:       searchObj ? searchObj.startDate : dateInit(true), // ?????????
			endDate:         searchObj ? searchObj.endDate : dateInit(false) // ?????????
		};

		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});

		// if ( !searchObj ) {
		// 	UserMgntStore.setUserMgntSearch(tempSearchInfo);
		// 	await getUserMgnts(0, 10);
		// } else {
		// 	await getUserMgnts(UserMgntStore.pageInfo.page, UserMgntStore.pageInfo.size);
		// }
	};

	return (
		<div className={classes.root}>
			<MC.Accordion square expanded={expanded} onChange={(event, isOpen) => setExpanded(isOpen)}>
				{/* ???????????? ?????? ?????? */}
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon className={classes.buttonColorWhite}/>}
					aria-controls={"panel1a-content"}
					id="panel1a-header"
				>
					<MC.Typography className={classes.heading}>
						?????? ????????????
					</MC.Typography>
					<MC.Typography className={classes.secondaryHeading}>
						?????? ????????? ????????? ??????????????????.
					</MC.Typography>
				</MC.AccordionSummary>
				{/* ???????????? ?????? ??? */}

				{/* ?????????????????? ?????? */}
				<MC.AccordionDetails>
					<MC.Grid container spacing={3} justify={"space-between"} alignItems={"flex-start"}>
						<MC.Grid item xs={12} md={12}>
							<PrgmMgntSearch
								allInitialize={allInitialize}
								searchInfo={searchInfo}
								setSearchInfo={setSearchInfo}
								setPrgmList={setPrgmList}
								getDate={getDate}
								setPageInfo={setPageInfo}
							/>
						</MC.Grid>
					</MC.Grid>
				</MC.AccordionDetails>
				{/* ?????????????????? ??? */}
			</MC.Accordion>
		</div>
	)
};

export default PrgmMgntSearchBar;
