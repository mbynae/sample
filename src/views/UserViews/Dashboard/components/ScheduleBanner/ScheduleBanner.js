import * as MC             from "@material-ui/core";
import { Fade }            from "react-slideshow-image";
import palette             from "../../../../../theme/adminTheme/palette";
import React, { useState } from "react";
import * as MS             from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	noticeFade: {
		position:  "absolute",
		bottom: 0,
		width:  "75%",
		height: "auto",
		marginLeft: "12%",
		marginBottom: "20px",
		borderRadius: "15px",
		zIndex: 1000,
		"& p": {
			textAlign: "center"
		},
		backgroundColor: "#fffaf5",
		padding: "10px 20px"
	}
}));


const ScheduleBanner = props => {
	const classes = useStyles();

	const {scheduleList, goArticleDetail} = props;

	const [isScheduleOpen, setIsScheduleOpen] = useState(false);
	const [scheduleIdx, setScheduleIdx] = useState(0);	// 일정 인덱스 번호

	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("sm"));

	const noticeZoomOutProperties = {
		infinite: !!(scheduleList && scheduleList.length >= 2),
		autoplay: !!(scheduleList && scheduleList.length >= 2),
		arrows: false,
		pauseOnHover: false,
		canSwipe: false,
		onChange: (prev, next) => scheduleIdxChange(prev, next)
	};

	const handleClose = () => {
		setIsScheduleOpen(true);
	}

	const scheduleIdxChange = (prev, next) => {
		setScheduleIdx(next);
	}

	return (
		<MC.Paper hidden={isScheduleOpen} elevation={3} className={classes.noticeFade}>

			<MC.Grid container alignItems={"center"} justify={"center"}>
				<MC.Grid item sm={12} md={3}>
					<MC.Typography variant={"h6"} style={{textAlign: "center"}}>오늘의 일정</MC.Typography>
				</MC.Grid>
				<MC.Grid item sm={12} md={6} style={{marginTop: isMobile? 7: 0}}>
					<Fade {...noticeZoomOutProperties}>
						{
							scheduleList.map((each, index) => (
								<div key={index}>
									<MC.Grid container spacing={1}>
										<MC.Grid item xs={12} md={6}>
											<MC.Typography variant={"body2"}
																		 style={{ fontSize: 14 }}>{each.startDate} ~ {each.endDate}</MC.Typography>
										</MC.Grid>
										<MC.Grid item xs={12} md={6}>
											<MC.Typography variant={"body2"} style={{ fontSize: 14 }}>{each.title}</MC.Typography>
										</MC.Grid>
									</MC.Grid>
								</div>
							))
						}
					</Fade>
				</MC.Grid>
				<MC.Grid item sm={12} md={3} style={{marginTop: isMobile? 7: 0, textAlign: "center"}}>
					<MC.ButtonGroup
						aria-label="text primary button group" color="primary">
						<MC.Button
							variant={"contained"}
							style={{
								borderColor: palette.primary,
								borderRadius: 4
							}}
							onClick={() => goArticleDetail("notice", scheduleList[scheduleIdx].id)}>
							상세보기
						</MC.Button>
						<MC.Button
							style={{
								borderTopLeftRadius: 4,
								borderBottomLeftRadius: 4,
								marginLeft: 10
							}}
							onClick={handleClose}>
							닫기
						</MC.Button>
					</MC.ButtonGroup>
				</MC.Grid>
			</MC.Grid>
		</MC.Paper>
	);
}

export default ScheduleBanner;
