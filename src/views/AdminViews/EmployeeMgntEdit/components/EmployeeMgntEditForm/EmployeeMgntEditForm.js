import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { PhoneMask } from "../../../../../components";

const useStyles = MS.makeStyles(theme => ({
	root:              {
		padding: theme.spacing(3)
	},
	content:           {
		marginTop: theme.spacing(2)
	},
	cardHeader:        {
		color:           theme.palette.icon,
		backgroundColor: theme.palette.info.moreLight
	},
	cardContent:       {},
	buttonLayoutRight: {
		padding:        theme.spacing(1),
		display:        "flex",
		flexDirection:  "row",
		justifyContent: "flex-end",
		alignContent:   "center"
	}, attachLayout:   {
		padding:        theme.spacing(2),
		display:        "flex",
		flexDirection:  "column",
		justifyContent: "center"
	}
}));
const EmployeeMgntEditForm = props => {
	const classes = useStyles();
	
	const { employeeMgnt, setEmployeeMgnt, departments, officialPositions, setOfficialPositions, getOfficialPositions, errors } = props;
	
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		if ( name === "departmentId" ) {
			if ( value === "total" ) {
				setOfficialPositions([]);
				setEmployeeMgnt(prev => {
					return {
						...prev,
						officialPositionId: "total"
					};
				});
			} else {
				getOfficialPositions(value);
			}
		}
		
		setEmployeeMgnt(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	};
	
	return (
		<MC.Card>
			<MC.CardHeader
				title={"직원 정보"}
				classes={{
					root:  classes.cardHeader,
					title: classes.cardHeader
				}}
			/>
			<MC.Divider />
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>
						
						{/*부서*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isDepartment}>
								<MC.InputLabel id="departmentId-label">부서</MC.InputLabel>
								<MC.Select
									labelId="departmentId-label"
									name="departmentId"
									id="departmentId-basic"
									value={employeeMgnt.departmentId || "total"}
									onChange={handleChange}>
									<MC.MenuItem value="total">없음</MC.MenuItem>
									{
										departments.map((department, index) => (
											<MC.MenuItem value={department.id} key={index}>
												{department.title}
											</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>
						
						{/*직책*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isOfficialPosition}>
								<MC.InputLabel id="officialPositionId-label">직책</MC.InputLabel>
								<MC.Select
									labelId="officialPositionId-label"
									name="officialPositionId"
									id="officialPositionId-basic"
									disabled={!(officialPositions && officialPositions.length > 0)}
									value={!(officialPositions && officialPositions.length > 0) ? "total" : (employeeMgnt.officialPositionId || "total")}
									onChange={handleChange}>
									<MC.MenuItem value="total">없음</MC.MenuItem>
									{
										officialPositions.map((officialPosition, index) => (
											<MC.MenuItem value={officialPosition.id} key={index}>
												{officialPosition.title}
											</MC.MenuItem>
										))
									}
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>
						
						{/*이름*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="name-basic"
									name="name"
									label={"이름"}
									error={errors.isName}
									value={employeeMgnt.name || ""}
									inputProps={{
										maxLength: 20
									}}
									onChange={handleChange} />
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
									value={employeeMgnt.phoneNumber || ""}
									onChange={handleChange}
									inputComponent={PhoneMask}
								/>
							</MC.FormControl>
						</MC.Grid>
						
						{/*내선번호*/}
						<MC.Grid item xs={12} md={6}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.InputLabel id="callNumber-label">내선번호</MC.InputLabel>
								<MC.Input
									size="small"
									labelid="callNumber-label"
									id="callNumber-input"
									name="callNumber"
									value={employeeMgnt.callNumber || ""}
									onChange={handleChange}
									inputComponent={PhoneMask}
								/>
							</MC.FormControl>
						</MC.Grid>
					
					</MC.Grid>
				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default EmployeeMgntEditForm;
