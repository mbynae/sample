import React, { useEffect, useState } from "react";
import moment                         from "moment";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { useLastLocation }            from "react-router-last-location";

import * as MC                                         from "@material-ui/core";
import * as MS                                         from "@material-ui/styles";
import ExpandMoreIcon                                  from "@material-ui/icons/ExpandMore";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import "moment/locale/ko";
import MomentUtils                                     from "@date-io/moment";

import { PreviousLocationCheck } from "../../../../../components";
import palette                   from "../../../../../theme/adminTheme/palette";

moment.locale("ko");

const useStyles = MS.makeStyles((theme) => ({
	root:                  {
		width:     "100%",
		marginTop: 16
	},
	heading:               {
		fontSize:   theme.typography.pxToRem(15),
		flexBasis:  "15%",
		flexShrink: 0,
		color:      palette.secondary.contrastText
	},
	secondaryHeading:      {
		fontSize: theme.typography.pxToRem(13),
		color:    palette.secondary.contrastText
	},
	formControl:           {
		margin:       theme.spacing(0),
		marginBottom: 10
	},
	buttonGroupLayout:     {
		display:        "flex",
		justifyContent: "center"
	},
	expansionPanelSummary: {
		backgroundColor: palette.info.light
	},
	cardHeader:            {
		color:           palette.icon,
		backgroundColor: palette.info.moreLight
	},
	keyboardDatePicker:    {
		width: "100%"
	}
}));

const AutonomousOrganizationsSearchBar = props => {
	const classes = useStyles();
	
	const { AutonomousOrganizationStore, getAutonomousOrganizations } = props;
	const [searchInfo, setSearchInfo] = useState({});
	const lastLocation = useLastLocation();
	
	useEffect(() => {
		const init = () => {
			PreviousLocationCheck(lastLocation, "/autonomousOrganizations") ? allInitialize(AutonomousOrganizationStore.autonomousOrganizationSearch) : allInitialize(undefined);
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const allInitialize = async (autonomousOrganizationsSearch) => {
		let tempSearchInfo = {
			name: autonomousOrganizationsSearch ? autonomousOrganizationsSearch.name : ""   // ??????
		};
		
		setSearchInfo(prev => {
			return {
				...prev,
				...tempSearchInfo
			};
		});
		
		if ( !autonomousOrganizationsSearch ) {
			AutonomousOrganizationStore.setAutonomousOrganizationSearch(tempSearchInfo);
			getAutonomousOrganizations(0, 10);
		} else {
			getAutonomousOrganizations(AutonomousOrganizationStore.pageInfo.page, AutonomousOrganizationStore.pageInfo.size);
		}
	};
	
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		setSearchInfo({
			...searchInfo,
			[name]: value
		});
	};
	
	const handleSearchList = event => {
		event.preventDefault();
		AutonomousOrganizationStore.setAutonomousOrganizationSearch(searchInfo);
		getAutonomousOrganizations(0, AutonomousOrganizationStore.pageInfo.size);
	};
	
	return (
		<div className={classes.root}>
			<MC.Accordion square>
				{/*expanded={true}>*/}
				
				<MC.AccordionSummary
					className={classes.expansionPanelSummary}
					expandIcon={<ExpandMoreIcon style={{ color: palette.white }} />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<MC.Typography className={classes.heading}>
						???????????? ????????????
					</MC.Typography>
					<MC.Typography className={classes.secondaryHeading}>
						?????? ????????? ????????? ??????????????????.
					</MC.Typography>
				</MC.AccordionSummary>
				
				<MC.AccordionDetails>
					<form onSubmit={handleSearchList} style={{ width: "100%" }}>
						
						<MC.Grid
							container
							spacing={3}
							justify={"space-between"}
							alignItems={"flex-start"}>
							
							<MC.Grid item xs={12} md={12}>
								<MC.Grid container spacing={3}>
									<MC.Grid item xs={12} md={12}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.TextField
												id="name-basic"
												name="name"
												label="???????????????"
												placeholder={"??????????????? ??????????????????."}
												value={searchInfo.name || ""}
												onChange={handleChange} />
										</MC.FormControl>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
							
							{/*?????? ?????? ?????? ??????*/}
							<MC.Grid item xs={12} md={12}>
								<div className={classes.buttonGroupLayout}>
									<MC.ButtonGroup
										aria-label="text primary button group"
										color="primary">
										<MC.Button
											style={{
												color:       palette.primary.main,
												borderColor: palette.primary.main
											}}
											onClick={() => allInitialize(undefined)}>
											?????????
										</MC.Button>
										<MC.Button
											style={{
												color:       palette.secondary.main,
												borderColor: palette.secondary.main
											}}
											type={"submit"}>
											??????
										</MC.Button>
									</MC.ButtonGroup>
								</div>
							</MC.Grid>
						
						</MC.Grid>
					</form>
				
				</MC.AccordionDetails>
			
			</MC.Accordion>
		</div>
	);
	
};

export default inject("AutonomousOrganizationStore")(withRouter(observer(AutonomousOrganizationsSearchBar)));
