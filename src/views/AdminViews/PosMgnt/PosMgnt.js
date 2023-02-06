import React, { useEffect, useState }        from "react";
import { toJS }                              from "mobx";
import { inject, observer }                  from "mobx-react";
import * as MC                               from "@material-ui/core";
import * as MS                               from "@material-ui/styles";
import { ActiveLastBreadcrumb, AlertDialog } from "../../../components";
import PerfectScrollbar                      from "react-perfect-scrollbar";
import clsx                                  from "clsx";
import palette                               from "../../../theme/adminTheme/palette";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	paper:             {
		padding: theme.spacing(2)
	},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	},
	errorButton:       {
		color:                  theme.palette.error.main,
		borderColor:            theme.palette.error.main,
		marginLeft:             10,
		borderTopLeftRadius:    4,
		borderBottomLeftRadius: 4
	},
	inner: {
		// minWidth: 1530
		marginTop: "20px",
		marginBottom: "20px"
	}
}));

const PosMgnt = props => {

	const classes = useStyles();
	const { className, history, SignInStore, AptComplexStore, match, ...rest } = props;
	const { id } = match.params;
	const [menuKey] = useState("mainContent");
	const [rootUrl, setRootUrl] = useState("");
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `포스 관리`,
			href:  `${rootUrl}/${menuKey}`
		}
	]);
	const [posList, setPosList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [posInfo, setPosInfo] = useState({});

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen: false,
		isOpen:        false,
		title:         "",
		content:       "",
		yesFn:         () => handleAlertToggle(),
		noFn:          () => handleAlertToggle()
	});
	const handleAlertToggle = (key, title, content, yesCallback, noCallback) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback()
				};
			}
		);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		const init = async () => {
			let rootUrl = generateRootUrl();
			await setBreadcrumbs(prev => {
				prev = [
					{
						title: "관리자",
						href:  `${rootUrl}/dashboard`
					},
					{
						title: `포스 관리`,
						href:  `${rootUrl}/${menuKey}`
					}
				];
				return [
					...prev
				];
			});
			await getCategoryList();
			await setIsLoading(false);
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const generateRootUrl = async () => {
		let rootUrl = `/${SignInStore.aptId}${SignInStore.isAdmin ? "/admin" : ""}`;
		await setRootUrl(rootUrl);
		return rootUrl;
	};

	const getCategoryList = () => {
		setPosList([
			{code:"21180001", posNo:"01", interPos:"N", sendPort:"22239", receivePort:"22240", fingerUse:"Y", zoneUse:"Y"},
			{code:"21180001", posNo:"02", interPos:"Y", sendPort:"22241", receivePort:"22242", fingerUse:"Y", zoneUse:"Y"},
			{code:"21180001", posNo:"03", interPos:"N", sendPort:"22243", receivePort:"22244", fingerUse:"Y", zoneUse:"N"},
		])
	}

	const dataBinding = (obj) => {
		setPosInfo(prev => {
			return {
				...prev,
				code: obj ? obj.code : "",
				posNo: obj ? obj.posNo : "",
				interPos: obj ? obj.interPos : "",
				sendPort: obj ? obj.sendPort : "",
				receivePort: obj ? obj.receivePort : "",
				fingerUse: obj ? obj.fingerUse : "",
				zoneUse: obj ? obj.zoneUse : ""
			};
		});
	};

	const handleEdit = event => {
		let name = event.target.name;
		let value = event.target.value;

		setPosInfo(prev => {
			return {
				...prev,
				[name]: value
			}
		});
	};

	const handleRowClick = (obj) => {
		setPosInfo(obj)
	};

	const addPos = () => {
		if(posInfo.posNo!==undefined && posInfo.interPos!==undefined && posInfo.sendPort !==undefined
			&& posInfo.receivePort !==undefined && posInfo.fingerUse !==undefined && posInfo.zoneUse!==undefined){
			posList.push({
				code: posInfo.code,
				posNo: posInfo.posNo,
				interPos: posInfo.interPos,
				sendPort: posInfo.sendPort,
				receivePort: posInfo.receivePort,
				fingerUse: posInfo.fingerUse,
				zoneUse: posInfo.zoneUse
			})
		}
		dataBinding(undefined);
	};

	const editPos = () => {
		// if(posInfo)
		// setPostList()
	};

	const deletePos = (index) => {
		setPosList(posList.filter((data, eIdx) => eIdx !== index));
	};

	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />
			<div className={classes.content}>

				<MC.Typography variant="h2" gutterBottom>
					포스 관리
				</MC.Typography>
				<MC.Divider className={classes.divider} />

				<MC.Paper elevation={2} className={classes.paper}>
					<MC.CardContent className={classes.content}>
						<PerfectScrollbar>
							<div className={classes.inner}>
								<MC.Table size="small">
									<MC.TableHead style={{backgroundColor: "#3f51b5"}}>
										<MC.TableRow>
											<MC.TableCell align={"center"} style={{color:"#fff"}}>지점코드</MC.TableCell>
											<MC.TableCell align={"center"} style={{color:"#fff"}}>PosNo</MC.TableCell>
											<MC.TableCell align={"center"} style={{color:"#fff"}}>Pos 연동</MC.TableCell>
											<MC.TableCell align={"center"} style={{color:"#fff"}}>전송 포트</MC.TableCell>
											<MC.TableCell align={"center"} style={{color:"#fff"}}>수신 포트</MC.TableCell>
											<MC.TableCell align={"center"} style={{color:"#fff"}}>지문인식</MC.TableCell>
											<MC.TableCell align={"center"} style={{color:"#fff"}}>영역구분</MC.TableCell>
										</MC.TableRow>
									</MC.TableHead>
									<MC.TableBody>
										<MC.TableRow>
											<MC.TableCell align="center">
												<MC.TextField
													name="code"
													variant="outlined"
													onChange={handleEdit}
													value={"2118000"}
													disabled
													// value={posInfo.code || ""}
												/>
											</MC.TableCell>
											<MC.TableCell align="center">
												<MC.TextField
													name="posNo"
													variant="outlined"
													onChange={handleEdit}
													value={posInfo.posNo || ""}
												/>
											</MC.TableCell>
											<MC.TableCell align="center">
												<MC.RadioGroup
													name="interPos"
													onChange={handleEdit}
													value={posInfo.interPos || ""}
												>
													<MC.FormControlLabel label={"Y"} control={<MC.Radio color={"primary"} value={"Y"}/>}/>
													<MC.FormControlLabel label={"N"} control={<MC.Radio color={"primary"} value={"N"}/>}/>
												</MC.RadioGroup>
											</MC.TableCell>
											<MC.TableCell align="center">
												<MC.TextField
													name="sendPort"
													variant="outlined"
													onChange={handleEdit}
													value={posInfo.sendPort || ""}
												/>
											</MC.TableCell>
											<MC.TableCell align="center">
												<MC.TextField
													name="receivePort"
													variant="outlined"
													onChange={handleEdit}
													value={posInfo.receivePort || ""}
												/>
											</MC.TableCell>
											<MC.TableCell align="center">
												<MC.RadioGroup
													name="fingerUse"
													onChange={handleEdit}
													value={posInfo.fingerUse || ""}
												>
													<MC.FormControlLabel label={"Y"} control={<MC.Radio color={"primary"} value={"Y"}/>}/>
													<MC.FormControlLabel label={"N"} control={<MC.Radio color={"primary"} value={"N"}/>}/>
												</MC.RadioGroup>
											</MC.TableCell>
											<MC.TableCell align="center">
												<MC.RadioGroup
													name="zoneUse"
													onChange={handleEdit}
													value={posInfo.zoneUse || ""}
												>
													<MC.FormControlLabel label={"Y"} control={<MC.Radio color={"primary"} value={"Y"}/>}/>
													<MC.FormControlLabel label={"N"} control={<MC.Radio color={"primary"} value={"N"}/>}/>
												</MC.RadioGroup>
											</MC.TableCell>
										</MC.TableRow>
									</MC.TableBody>
								</MC.Table>
							</div>

							<div className={classes.inner}>
								<MC.Table size="small">
									<MC.TableHead>
										<MC.TableRow>
											<MC.TableCell align={"center"}>PosNo</MC.TableCell>
											<MC.TableCell align={"center"}>Pos 연동</MC.TableCell>
											<MC.TableCell align={"center"}>전송 포트</MC.TableCell>
											<MC.TableCell align={"center"}>수신 포트</MC.TableCell>
											<MC.TableCell align={"center"}>지문인식</MC.TableCell>
											<MC.TableCell align={"center"}>영역구분</MC.TableCell>
											<MC.TableCell align={"center"}>관리</MC.TableCell>
										</MC.TableRow>
									</MC.TableHead>
									<MC.TableBody>
										{
											isLoading ?
												<MC.TableRow hover>
													<MC.TableCell colSpan={5} align="center">
														<MC.CircularProgress color="secondary" />
													</MC.TableCell>
												</MC.TableRow>
												:
												posList.length > 0 &&
												posList.map((pos, index) => (
													<MC.TableRow key={index} hover>
														<MC.TableCell align="center" onClick={()=>handleRowClick(pos)}>{pos.posNo}</MC.TableCell>
														<MC.TableCell align="center" onClick={()=>handleRowClick(pos)}>{pos.interPos}</MC.TableCell>
														<MC.TableCell align="center" onClick={()=>handleRowClick(pos)}>{pos.sendPort}</MC.TableCell>
														<MC.TableCell align="center" onClick={()=>handleRowClick(pos)}>{pos.receivePort}</MC.TableCell>
														<MC.TableCell align="center" onClick={()=>handleRowClick(pos)}>{pos.fingerUse}</MC.TableCell>
														<MC.TableCell align="center" onClick={()=>handleRowClick(pos)}>{pos.zoneUse}</MC.TableCell>
														<MC.TableCell align="center">
															<MC.Button
																variant="outlined"
																style={{
																	color: palette.error.main,
																	borderColor: palette.error.main
																}}
																onClick={() => deletePos(index)}
															>
																삭제
															</MC.Button>
														</MC.TableCell>
													</MC.TableRow>
												))
										}
									</MC.TableBody>
								</MC.Table>
							</div>
						</PerfectScrollbar>
					</MC.CardContent>
					<MC.CardActions>
						<MC.Grid container justifyContent={"space-between"} alignItems={"center"}>
							<MC.Grid item xs={12} md={12}
											 className={classes.buttonLayoutRight}>
								<MC.ButtonGroup
									aria-label="text primary button group"
									size="large"
									style={{ marginTop: 0 }}
									color="primary">
									<MC.Button
										variant="outlined"
										color="primary"
										onClick={() => addPos()}
									>
										등록
									</MC.Button>
									{posList.length > 0 ?
										<MC.Button
											variant="outlined"
											color="primary"
											onClick={() => editPos()}
										>
											수정
										</MC.Button> : null
									}
								</MC.ButtonGroup>
							</MC.Grid>
						</MC.Grid>
					</MC.CardActions>
				</MC.Paper>
			</div>

			<AlertDialog
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialog
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
			/>

		</div>
	)
}

export default inject("SignInStore", "AptComplexStore")(observer(PosMgnt));
