import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";

import * as MS from "@material-ui/styles";
import * as MC from "@material-ui/core";

import {
	preCheckDefectRepository,
	preCheckDetailRepository,
} from "../../../repositories";
import { AlertDialogUserView } from "../../../components";
import { ExportExcel, PreCheckDetailForm } from "./components";
import { toJS } from "mobx";
import { PreCheckDetailEditForm } from "../PreCheckDetailEdit/components";
import { apiObject } from "repositories/api";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.white,
		position: "relative",
	},
	background: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: 162,
		backgroundColor: "#fafafa",
		zIndex: 1,
	},
	content: {
		zIndex: 2,
		position: "relative",
		height: "100%",
		marginLeft: "auto",
		marginRight: "auto",
		maxWidth: "1180px",
		display: "flex",
		flexDirection: "column",
		[theme.breakpoints.down("xs")]: {
			maxWidth: "100%",
		},
	},
	layout: {
		// minWidth:                       600,
		// maxWidth:                       600,
		// minHeight:                      600,
		width: "100%",
		paddingTop: 73,
		paddingBottom: 80,
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
			padding: 0,
			paddingTop: 0,
			paddingBottom: 80,
		},
	},
	buttonLayoutRight: {
		// padding:        theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "center",
	},
}));

const PreCheckDetail = (props) => {
	const classes = useStyles();
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));

	const { PreCheckSignInStore, UserAptComplexStore, match } = props;
	const { id } = match.params;
	const [menuKey] = useState("preCheck");
	const [rootUrl, setRootUrl] = useState("");

	const generateRootUrl = async () => {
		let rootUrl = `/${PreCheckSignInStore.aptId}/pre-inspection`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const [loading, setLoading] = useState(true);
	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen: false,
		title: "",
		content: "",
		noTitle: "",
		yesTitle: "",
		yesFn: () => handleAlertToggle(),
		noFn: () => handleAlertToggle(),
		isOpenType: false,
		type: "",
	});
	const handleAlertToggle = (
		key,
		title,
		content,
		yesTitle,
		yesCallback,
		noTitle,
		noCallback,
		type
	) => {
		setAlertOpens((prev) => {
			return {
				...prev,
				title,
				content,
				noTitle,
				yesTitle,
				[key]: !alertOpens[key],
				yesFn: () => yesCallback(),
				noFn: () => noCallback(),
				type,
			};
		});
	};

	// 사전점검 관리 정보
	const [preCheckDetail, setPreCheckDetail] = useState({});
	const [errors, setErrors] = useState({
		isCarNumber: false,
	});

	useEffect(() => {
		window.scrollTo(0, 0);

		const init = async () => {
			await generateRootUrl();
		};

		setTimeout(async () => {
			await init();
		}, 100);
	}, [id]);

	return (
		<div className={classes.root}>
			{!isMobile && <div className={classes.background} />}
			<>
				<MC.Grid
					container
					direction={"column"}
					justify={"center"}
					alignItems={"center"}
					className={classes.content}
				>
					<div className={classes.layout}>
						<MC.Grid
							container
							direction={"column"}
							justify={"center"}
							alignItems={"center"}
						>
							{!isMobile && (
								<MC.Grid item style={{ width: "100%" }}>
									<MC.Grid
										container
										direction={"column"}
										justify={"center"}
										alignItems={"center"}
									>
										<MC.Grid item>
											<MC.Typography variant="h3">사전점검</MC.Typography>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
							)}

							<MC.Grid
								item
								style={{
									width: "100%",
									marginTop: isMobile ? 31 : 111,
									paddingLeft: 16,
									paddingRight: 16,
								}}
							>
								<MC.Grid
									container
									justify={"space-between"}
									alignItems={"flex-start"}
								>
									<MC.Grid item xs={12} md={12}>
										<PreCheckDetailForm
											isMobile={isMobile}
											menuKey={menuKey}
											aptComplex={toJS(UserAptComplexStore.aptComplex)}
											currentUser={toJS(PreCheckSignInStore.currentUser)}
											aptId={UserAptComplexStore.aptComplex.id}
											rootUrl={rootUrl}
											errors={errors}
											alertOpens={alertOpens}
											setAlertOpens={setAlertOpens}
											handleAlertToggle={handleAlertToggle}
										/>
									</MC.Grid>
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>
					</div>
				</MC.Grid>
			</>

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

export default inject(
	"PreCheckSignInStore",
	"UserAptComplexStore"
)(observer(PreCheckDetail));
