import clsx                   from "clsx";
import * as MC                from "@material-ui/core";
import palette                from "../../../../../../../theme/adminTheme/palette";
import React                  from "react";
import { useGuideRepository } from "../../../../../../../repositories";
import * as MS                from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	root: {
		borderRadius: 0
	},
	content: {
		padding: 15
	},
	inner: {
		minWidth: 1530,
		minHeight: 630,
	},
	actions: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: "space-between"
	}
}));

const UseGuideTable = props => {

	const classes = useStyles();
	const {className, isEdit, handleOpen, alertOpens, setAlertOpens, handleAlertToggle, getUseGuide, useGuideInfo, ...rest } = props;

	const handleDelete = () => {
		handleAlertToggle(
			"isConfirmOpen",
			"이용안내 삭제",
			"이용안내를 삭제하시겠습니까?",
			async () => {
				await setAlertOpens({ ...alertOpens, isConfirmOpen: false });
				useGuideRepository.deleteUseGuide(useGuideInfo.cnts_numb)
					.then(result => {
						getUseGuide();
					}).catch(e => {
						handleAlertToggle(
							"isOpen",
							e.msg,
							e.errormsg + "\n" + "errorcode: " + e.errorcode,
							() => {
								setAlertOpens({ ...alertOpens, isOpen: false });
							},
							undefined
						);
				})
			},
			() => {
				// 삭제안하기
				setAlertOpens({ ...alertOpens, isConfirmOpen: false });
			}
		)
	}

	return (
		<MC.Card
			{...rest}
			className={clsx(classes.root, className)}>

			<MC.CardHeader
				title={"예약이용안내 관리"}
				titleTypographyProps={{ variant: "h4" }}/>

			<MC.Divider/>

			<MC.CardContent className={classes.content}>
				<div className={classes.inner}>
					{
						useGuideInfo ?
							(useGuideInfo.use_info || '').split("\n").map((line,index) => {
								return (<MC.Typography key={index} variant={"button"}>{line}<br/></MC.Typography>)
							})
							: <MC.Typography variant={"h4"} style={{textAlign:"center", paddingTop:"20%"}}>등록된 내용이 없습니다.</MC.Typography>
					}
				</div>
			</MC.CardContent>

			<MC.Divider/>

			<MC.CardActions className={classes.actions}>
				<MC.Grid
					container
					justify={"space-between"}
					alignItems={"center"}>
					<MC.Grid item>
						{
							isEdit ?
								<MC.ButtonGroup
									aria-label="text primary button group"
									color="primary">
									<MC.Button
										style={{
											color: palette.primary.main,
											borderColor: palette.primary.main,
											borderTopLeftRadius: 4,
											borderBottomLeftRadius: 4
										}}
										onClick={handleOpen}>
										수정
									</MC.Button>
									<MC.Button
										style={{
											color: palette.primary.main,
											borderColor: palette.primary.main,
											marginLeft: 10,
											borderTopLeftRadius: 4,
											borderBottomLeftRadius: 4
										}}
										onClick={handleDelete}>
										삭제
									</MC.Button>
								</MC.ButtonGroup>
								:
								<MC.Button  variant={"outlined"} color="primary" onClick={handleOpen}>등록</MC.Button>
						}
					</MC.Grid>
				</MC.Grid>
			</MC.CardActions>
		</MC.Card>
	)
}

export default UseGuideTable;
