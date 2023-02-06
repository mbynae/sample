import React, { useEffect, useState } from "react";
import * as MC              from "@material-ui/core";
import * as MS 					from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	root: {
		marginTop: 10
	},
	tableCellTitle:           {
		width: "15%",
		minWidth: 100,
		backgroundColor: "#f2f2f2"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%"
	},
	formControl:                {
		margin:       theme.spacing(1)
	},
}));


const FacilityInformationTable = props => {
	const classes = useStyles();

	const {fcltCnts} = props;

	useEffect(() => {
		const init = () => {

		};
		setTimeout(() => {
			init();
		});
	}, []);

	return (
		<MC.TableContainer className={classes.root} component={MC.Paper}>
			<MC.Table size={"small"}>
				<MC.TableBody>
					<MC.TableRow>
						<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이용안내</MC.TableCell>
						<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
							<MC.FormControl fullWidth className={classes.formControl}>
								{
									(fcltCnts.cnts_info|| '').split("\n").map((line,index) => {
										return (<span key={index}>{line}<br/></span>)
									})
								}
							</MC.FormControl>
						</MC.TableCell>
					</MC.TableRow>

					<MC.TableRow>
						<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이용시간</MC.TableCell>
						<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
							<MC.FormControl fullWidth className={classes.formControl}>
								{
									(fcltCnts.cnts_schd|| '').split("\n").map((line,index) => {
										return (<span key={index}>{line}<br/></span>)
									})
								}
							</MC.FormControl>
						</MC.TableCell>
					</MC.TableRow>

					<MC.TableRow>
						<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">이용요금</MC.TableCell>
						<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
							<MC.FormControl fullWidth className={classes.formControl}>
								{
									(fcltCnts.cnts_amt|| '').split("\n").map((line,index) => {
										return (<span key={index}>{line}<br/></span>)
									})
								}
							</MC.FormControl>
						</MC.TableCell>
					</MC.TableRow>

					<MC.TableRow>
						<MC.TableCell className={classes.tableCellTitle} variant={"head"} align="center">취소/환불정책</MC.TableCell>
						<MC.TableCell colSpan={3} className={classes.tableCellDescriptionFull}>
							<MC.FormControl fullWidth className={classes.formControl}>
								{
									(fcltCnts.cnts_rfnd|| '').split("\n").map((line,index) => {
										return (<span key={index}>{line}<br/></span>)
									})
								}
							</MC.FormControl>
						</MC.TableCell>
					</MC.TableRow>

				</MC.TableBody>
			</MC.Table>
		</MC.TableContainer>
	);
};

export default FacilityInformationTable;
