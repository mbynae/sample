import React, { useEffect } from "react";
import * as MC              from "@material-ui/core";
import * as MS              from "@material-ui/styles";

import { PhoneMask }             from "../../../../../components";
import { InputAdornment }        from "@material-ui/core";
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

const CallBookEditForm = props => {
	const classes = useStyles();
	
	const { isEdit, callBook, setCallBook, categories, errors } = props;
	
	useEffect(() => {
		const init = () => {
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		setCallBook({
			...callBook,
			[name]: value
		});
	};
	
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
				<form>
					<MC.Grid container spacing={1}>
						
						{/*카테고리*/}
						{
							categories.length > 0 &&
							<MC.Grid item xs={12} md={3}>
								<MC.FormControl fullWidth className={classes.formControl} error={errors.isCategory}>
									<MC.InputLabel id="categoryId-label">카테고리</MC.InputLabel>
									<MC.Select
										labelId="categoryId-label"
										name="categoryId"
										id="categoryId-basic"
										defaultValue={""}
										value={callBook.categoryId || ""}
										onChange={handleChange}>
										{
											categories.map((category, index) => (
												<MC.MenuItem value={category.id} key={index}>
													{category.name}
												</MC.MenuItem>
											))
										}
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
						}
						
						{/*전호번호부명*/}
						<MC.Grid item xs={12} md={9}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="title-basic"
									name="title"
									label={"전화번호부명"}
									placeholder={"명칭을 입력해주세요."}
									error={errors.isTitle}
									value={callBook.title || ""}
									inputProps={{
										maxLength: 20
									}}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*전화번호*/}
						<MC.Grid item xs={12} md={12}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isCallNumber}>
								<MC.InputLabel id="callNumber-label">전화번호</MC.InputLabel>
								<MC.Input
									size="small"
									labelid="callNumber-label"
									id="callNumber-input"
									name="callNumber"
									value={callBook.callNumber || ""}
									startAdornment={
										<MC.InputAdornment position={"start"}>
											<PhoneCallbackTwoToneIcon fontSize={"small"} />
										</MC.InputAdornment>
									}
									onChange={handleChange}
									inputComponent={PhoneMask}
								/>
							</MC.FormControl>
						</MC.Grid>
						
						{/*팩스번호*/}
						<MC.Grid item xs={12} md={12}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.InputLabel id="faxNumber-label">팩스번호</MC.InputLabel>
								<MC.Input
									size="small"
									labelid="faxNumber-label"
									id="faxNumber-input"
									name="faxNumber"
									value={callBook.faxNumber || ""}
									startAdornment={
										<MC.InputAdornment position={"start"}>
											<LocalPrintshopTwoToneIcon fontSize={"small"} />
										</MC.InputAdornment>
									}
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

export default CallBookEditForm;
