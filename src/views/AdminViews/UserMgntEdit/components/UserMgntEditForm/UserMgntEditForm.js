import React, { useEffect } from "react";
import * as MC              from "@material-ui/core";
import * as MS              from "@material-ui/styles";

import { DateFormat, PhoneMask } from "../../../../../components";

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
	},
	rowHeight:                {
		height: 54
	}
}));

const UserMgntEditForm = props => {
	const classes = useStyles();

	const { userMgnt: obj, setUserMgnt: setObj, aoList, aoPositions, setAOPositions, getAOPositions, errors, setErrors,
	dongList, hoList, getHoNumList} = props;

	useEffect(() => {
		const init = () => {
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		let checked = event.target.checked;

		setErrors(prev => {
			if (name === "phoneNumber") return {...prev, isPhoneNumber: value === ""};
			else if (name === "userDataType.houseHolderType") return {...prev, isHouseHolder: false};
			else return {...prev}
		});

		if (name.indexOf("userDataType") !== -1) {
			let dotIndex = name.indexOf(".");
			let key = name.substring(dotIndex + 1, name.length);
			setObj(prev => {
				return {
					...prev,
					userDataType: {
						...prev.userDataType,
						[key]: value
					}
				};
			});

			// 동 값이 입력 되었을 때 호 Dropdown List 출력 함수 호출
			if (name === "userDataType.building") {
				getHoNumList(value);
				// 기존 선택된 Unit 초기화
				setObj(prev => {
					return {
						...prev,
						userDataType: {
							...prev.userDataType,
							[key]: value,
							unit: ""
						}
					};
				});
			}
		}
		else if ( name === "aoId" ) {
			let findAO = {
				id: 0
			};
			if ( value > 0 ) {
				findAO = aoList.find(ao => ao.id + "" === value + "");
				getAOPositions(value);
			}
			setAOPositions([]);
			setObj(prev => {
				return {
					...prev,
					autonomousOrganization: findAO,
					aoPosition:             {
						id: 0
					}
				};
			});
		}
		else if ( name === "aoPositionId" ) {
			let findAO = {
				aoPosition: { id: 0 }
			};
			if ( value > 0 ) {
				findAO = aoPositions.find(groups => groups.aoPosition.id + "" === value + "");
				delete findAO.aoPosition.autonomousOrganization;
			}
			setObj(prev => {
				return {
					...prev,
					aoPosition: findAO.aoPosition
				};
			});
		}
		else {
			setObj(prev => {
				return {
					...prev,
					[name]: value
				};
			});
		}
	};

	return (
		<MC.Card>
			<MC.CardHeader
				title={"입주민 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>

						{/*상태*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											상태
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>
									{
										obj.userDataType.residentsType === "AWAITING_RESIDENTS" ? <MC.Chip label={"승인대기"} /> :
											obj.userDataType.residentsType === "RESIDENTS" && <MC.Chip label={"입주민"} />
									}
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>

						{/*등록일*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											등록일
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>
									<DateFormat date={obj.baseDateDataType.createDate} format={"YYYY-MM-DD"} />
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>


						{/*아이디*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											아이디
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>
									{obj.userId}
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>

						{/*이름*/}
						<MC.Grid item xs={12} md={6} className={classes.rowHeight}>
							<MC.Grid container alignItems={"center"} style={{ height: "100%" }}>
								<MC.Grid item xs={2} md={2}>
									<MC.Grid container justify={"flex-start"} alignItems={"center"} style={{ height: "100%" }}>
										<MC.Typography variant={"subtitle2"}>
											이름
										</MC.Typography>
									</MC.Grid>
								</MC.Grid>
								<MC.Grid item xs={10} md={10}>
									{obj.name}
								</MC.Grid>
							</MC.Grid>
						</MC.Grid>

						{/*소유주 여부*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.InputLabel id="userDataType.ownerType-label">소유주 여부</MC.InputLabel>
								<MC.Select
									labelId="userDataType.ownerType-label"
									name="userDataType.ownerType"
									id="userDataType.ownerType-basic"
									defaultValue={""}
									value={obj.userDataType.ownerType || ""}
									onChange={handleChange}>
									<MC.MenuItem value={"TO_BE_CONFIRMED"}>확인예정</MC.MenuItem>
									<MC.MenuItem value={"NON_OWNER"}>비소유주</MC.MenuItem>
									<MC.MenuItem value={"OWNER"}>소유주</MC.MenuItem>
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>

						{/*세대주 여부*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isHouseHolder}>
								<MC.InputLabel id="userDataType.houseHolderType-label">세대주 여부</MC.InputLabel>
								<MC.Select
									labelId="userDataType.houseHolderType-label"
									name="userDataType.houseHolderType"
									id="userDataType.houseHolderType-basic"
									defaultValue={""}
									value={obj.userDataType.houseHolderType || ""}
									onChange={handleChange}>
									<MC.MenuItem value={"HOUSEHOLD_OWNER"}>세대주</MC.MenuItem>
									<MC.MenuItem value={"HOUSEHOLD_MEMBER"}>세대원</MC.MenuItem>
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>

						{/*동/호수*/}
						<MC.Grid item xs={12} md={3}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isBuilding}>
								<MC.InputLabel htmlFor="userDataType.building-basic">동</MC.InputLabel>
								<MC.Select
									id="userDataType.building-basic"
									name="userDataType.building"
									value={obj.userDataType.building || ""}
									onChange={handleChange}
								>
									{dongList.map((item, index) =>
										<MC.MenuItem key={index} value={item.dong_numb}>{item.dong_numb}동</MC.MenuItem>
									)}
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>
						<MC.Grid item xs={12} md={3}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isUnit}>
								<MC.InputLabel htmlFor="userDataType.unit-basic">호</MC.InputLabel>
								<MC.Select
									id="userDataType.unit-basic"
									name="userDataType.unit"
									value={obj.userDataType.unit || ""}
									onChange={handleChange}
									disabled={obj.userDataType.building === ""}
								>
									{hoList.map((item, index) =>
										<MC.MenuItem key={index} value={item.ho_numb}>{item.ho_numb}</MC.MenuItem>
									)}
								</MC.Select>
								{obj.userDataType.building === "" && <MC.FormHelperText>동을 먼저 선택해주세요.</MC.FormHelperText>}
							</MC.FormControl>
						</MC.Grid>

						{/*휴대폰번호*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isPhoneNumber}>
								<MC.InputLabel id="phoneNumber-label">휴대폰번호</MC.InputLabel>
								<MC.Input
									size="small"
									labelid="phoneNumber-label"
									id="phoneNumber-input"
									name="phoneNumber"
									value={obj.phoneNumber || ""}
									onChange={handleChange}
									inputComponent={PhoneMask}
								/>
							</MC.FormControl>
						</MC.Grid>

						{/*소속*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.InputLabel id="aoId-label">소속</MC.InputLabel>
								<MC.Select
									labelId="aoId-label"
									name="aoId"
									id="aoId-basic"
									value={obj.autonomousOrganization ? obj.autonomousOrganization.id : 0}
									onChange={handleChange}
								>
									<MC.MenuItem value={0}>소속 없음</MC.MenuItem>
									{
										aoList && aoList.length > 0 &&
										aoList.map((ao, index) => (
											<MC.MenuItem key={index} value={ao.id}>
												{ao.name}
											</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>

						{/*직책*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl
								fullWidth
								className={classes.formControl}
								disabled={!(aoPositions && aoPositions.length > 0)}
								error={errors.isAOPosition}>
								<MC.InputLabel id="aoPositionId-label">직책</MC.InputLabel>
								<MC.Select
									labelId="aoPositionId-label"
									name="aoPositionId"
									id="aoPositionId-basic"
									value={!(aoPositions && aoPositions.length > 0) ? 0 : (obj.aoPosition.id || 0)}
									onChange={handleChange}
								>
									<MC.MenuItem value={0}>직책 없음</MC.MenuItem>
									{
										aoPositions && aoPositions.length > 0 &&
										aoPositions.map((group, index) => (
											<MC.MenuItem key={index} value={group.aoPosition.id}>{group.aoPosition.name}</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>

					</MC.Grid>
				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default UserMgntEditForm;
