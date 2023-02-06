import React, { useEffect, useState } from "react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import { HTMLEditor, PhoneMask } from "../../../../../components";

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

const AutonomousOrganizationEditForm = props => {
	const classes = useStyles();
	
	const { aoList, autonomousOrganization, setAutonomousOrganization, attachFiles, setAttachFiles, errors } = props;
	
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
		
		setAutonomousOrganization({
			...autonomousOrganization,
			[name]: value
		});
	};
	
	return (
		<MC.Card>
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>
						
						{/*순번*/}
						<MC.Grid item xs={12} md={2}>
							<MC.FormControl fullWidth className={classes.formControl} error={errors.isSequence}>
								<MC.InputLabel id="sequence-label">순번</MC.InputLabel>
								<MC.Select
									labelId="sequence-label"
									name="sequence"
									id="sequence-basic"
									defaultValue={""}
									value={autonomousOrganization.sequence || ""}
									onChange={handleChange}>
									{
										aoList.length > 0 ?
											aoList.map((ao, index) => (
												<MC.MenuItem value={ao.sequence} key={index}>
													{ao.sequence}
												</MC.MenuItem>
											))
											:
											<MC.MenuItem value={1}> 1 </MC.MenuItem>
									}
								</MC.Select>
							</MC.FormControl>
						</MC.Grid>
						
						{/*자치기구명칭*/}
						<MC.Grid item xs={12} md={2}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="name-basic"
									name="name"
									label="자치기구명칭"
									placeholder="자치기구명칭을 입력해주세요."
									error={errors.isName}
									value={autonomousOrganization.name || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*제목*/}
						<MC.Grid item xs={12} md={8}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="title-basic"
									name="title"
									label="제목"
									placeholder="제목을 입력해주세요."
									error={errors.isTitle}
									value={autonomousOrganization.title || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						
						{/*본문*/}
						<MC.Grid item xs={12} md={12}>
							<HTMLEditor
								content={autonomousOrganization.content || ""}
								obj={autonomousOrganization}
								setObj={setAutonomousOrganization}
								attachFiles={attachFiles}
								setAttachFiles={setAttachFiles}
							/>
						</MC.Grid>
					
					</MC.Grid>
				</form>
			</MC.CardContent>
		</MC.Card>
	);
};

export default AutonomousOrganizationEditForm;
