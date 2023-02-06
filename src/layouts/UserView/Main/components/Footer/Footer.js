import React, { useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { PhoneHyphen, TermsDialog } from "../../../../../components";

const useStyle = MS.makeStyles(theme => ({
	root:   {
		height: 116
	},
	layout: {
		height:                         "100%",
		width:                          "1180px",
		marginLeft:                     "auto",
		marginRight:                    "auto",
		[theme.breakpoints.down("xs")]: {
			width: "100%"
		}
	}
}));
const Footer = props => {
	const classes = useStyle();
	const { aptComplex } = props;
	
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));
	
	const [termsOpen, setTermsOpen] = useState({
		isOpen:    false,
		isPrivacy: false,
		yesFn:     () => handleTermsToggle()
	});
	const handleTermsToggle = (key, isPrivacy, yesCallback) => {
		setTermsOpen(prev => {
			return {
				...prev,
				[key]: !termsOpen[key],
				isPrivacy,
				yesFn: () => yesCallback()
			};
		});
	};
	
	const viewTerms = (isPrivacy) => {
		handleTermsToggle(
			"isOpen",
			isPrivacy,
			() => {
				setTermsOpen(prev => {
					return {
						...prev,
						isOpen: false
					};
				});
			}
		);
	};
	
	return (
		<div className={classes.root}
		     style={{ backgroundColor: "#525252" }}>
			
			<div className={classes.layout}>
				{
					aptComplex.aptInformationDataType &&
					<MC.Grid container direction={isMobile ? "column" : "row"} justify={isMobile ? "center" : "space-between"} alignItems={"center"} style={{ height: "100%" }}>
						
						<MC.Grid item>
							<MC.Grid container direction={"column"} justify={"center"} alignItems={"flex-start"} style={{ height: "100%" }}>
								<MC.Grid item>
									<MC.Typography variant={"subtitle2"} style={{ color: "#fff" }}>
										{`${aptComplex.aptInformationDataType.aptName} | 대표번호 : ${PhoneHyphen(aptComplex.aptInformationDataType.officeCallNumber)} | 팩스번호 : ${PhoneHyphen(
											aptComplex.aptInformationDataType.officeFaxNumber)}`}
									</MC.Typography>
								</MC.Grid>
								<MC.Grid item>
									<MC.Typography variant={"subtitle2"} style={{ color: "#fff" }}>
										{`주소 : ${aptComplex.aptInformationDataType.address}`}
									</MC.Typography>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
						
						<MC.Grid item style={{ marginTop: isMobile ? 10 : 0 }}>
							<MC.Grid container direction={"row"} justify={"flex-end"} alignItems={"center"} style={{ height: "100%" }}>
								
								<MC.Grid item>
									<MC.Typography className={classes.body4} style={{ color: "#bcbcbc", marginTop: 0, cursor: "pointer" }}>
										<MC.Link name="sign-up" onClick={() => viewTerms(false)} color="inherit">
											이용약관
										</MC.Link>
									</MC.Typography>
								</MC.Grid>
								
								<MC.Grid item>
									<MC.Typography className={classes.body4} style={{ color: "#bcbcbc", marginTop: 0, cursor: "pointer" }}>
										{/*<MC.Link name="sign-up" onClick={() => viewTerms(false)} color="inherit">*/}
										&nbsp;|&nbsp;
										{/*</MC.Link>*/}
									</MC.Typography>
								</MC.Grid>
								
								<MC.Grid item>
									<MC.Typography className={classes.body4} style={{ color: "#bcbcbc", marginTop: 0, cursor: "pointer" }}>
										<MC.Link name="sign-up" onClick={() => viewTerms(true)} color="inherit">
											개인정보처리방침
										</MC.Link>
									</MC.Typography>
								</MC.Grid>
							
							</MC.Grid>
						</MC.Grid>
					
					</MC.Grid>
				}
			</div>
			
			<TermsDialog
				isOpen={termsOpen.isOpen}
				isMobile={isMobile}
				isPrivacy={termsOpen.isPrivacy}
				handleYes={() => termsOpen.yesFn()}
			/>
		
		</div>
	);
};

export default Footer;
