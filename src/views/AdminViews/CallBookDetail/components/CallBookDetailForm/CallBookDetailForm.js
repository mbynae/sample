import React   from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { PhoneHyphen }           from "../../../../../components";
import PhoneCallbackTwoToneIcon  from "@material-ui/icons/PhoneCallbackTwoTone";
import LocalPrintshopTwoToneIcon from "@material-ui/icons/LocalPrintshopTwoTone";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
		marginTop: theme.spacing(2)
	},
	cardHeader:               {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:              {},
	tableCellTitle:           {
		width: "15%"
	},
	tableCellDescriptionFull: {
		width:    "85%",
		maxWidth: "85%"
	},
	buttonLayoutRight:        {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	}
}));

const CallBookDetailForm = props => {
	const classes = useStyles();
	
	const { callBook } = props;
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"전화번호부 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				
				<MC.Table>
					<MC.TableBody>
						
						{/*전화번호부명*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle}>
								전화번호부명
							</MC.TableCell>
							<MC.TableCell>
								{`[ ${callBook.category.name} ] ${callBook.title}`}
							</MC.TableCell>
						</MC.TableRow>
						
						{/*전화번호*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle}>
								<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}>
									<PhoneCallbackTwoToneIcon fontSize={"small"} />
									&nbsp;전화번호
								</MC.Grid>
							</MC.TableCell>
							<MC.TableCell>
								{PhoneHyphen(callBook.callNumber || "")}
							</MC.TableCell>
						</MC.TableRow>
						
						{/*팩스번호*/}
						<MC.TableRow>
							<MC.TableCell className={classes.tableCellTitle}>
								<MC.Grid container direction="row" justify={"flex-start"} alignItems={"center"}>
									<LocalPrintshopTwoToneIcon fontSize={"small"} />
									&nbsp;팩스번호
								</MC.Grid>
							</MC.TableCell>
							<MC.TableCell>
								{PhoneHyphen(callBook.faxNumber || "")}
							</MC.TableCell>
						</MC.TableRow>
					
					</MC.TableBody>
				</MC.Table>
			
			</MC.CardContent>
		</MC.Card>
	);
};

export default CallBookDetailForm;
