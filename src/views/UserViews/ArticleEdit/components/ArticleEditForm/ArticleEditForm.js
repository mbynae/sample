import React, { useEffect, useState } from "react";
import clsx                           from "clsx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import { UserHTMLEditor }     from "../../../../../components";
import { categoryRepository } from "../../../../../repositories";

const useStyles = MS.makeStyles(theme => ({
	formControl:      {
		width:  "100%",
		height: 42
	},
	body5:            {
		...theme.typography.body5,
		whiteSpace: "pre-line"
	},
	select:           {
		paddingLeft:   15,
		paddingTop:    11,
		paddingBottom: 11
	},
	inputLabelLayout: {
		left:                0,
		top:                 -5,
		"& fieldset legend": {
			width: 200
		}
	}
}));

const ArticleEditForm = props => {
	const classes = useStyles();
	
	const { isEdit, isMobile, menuKey, aptId, article, setArticle, attachFiles, setAttachFiles, errors } = props;
	
	const [categories, setCategories] = useState([]);
	
	useEffect(() => {
		const init = async () => {
			await getCategories();
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const sort = (a, b) => a.sequence - b.sequence;
	
	const getCategories = async () => {
		let params = {
			menuKey: menuKey
		};
		
		if ( menuKey !== "ticket" ) {
			params.aptId = aptId;
		}
		
		const categories = await categoryRepository.getCategories(params, true);
		setCategories(categories.sort(sort));
	};
	
	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;
		
		setArticle({
			...article,
			[name]: value
		});
	};
	
	const checkFleMarket = () => menuKey === "fleaMarket" && isEdit;
	
	return (
		<div>
			
			<form>
				<MC.Grid container spacing={isMobile ? 1 : 2} style={{ borderTop: "2px solid #222222", paddingTop: 24, paddingLeft: isMobile ? 0 : 25, paddingRight: isMobile ? 0 : 25 }}>
					
					{/*카테고리*/}
					{
						categories.length > 0 &&
						<MC.Grid item xs={12} md={checkFleMarket() ? 2 : menuKey === "complaints" ? 6 : 3}>
							
							<MC.FormControl variant="outlined" className={classes.formControl} error={errors.isCategory}>
								<MC.Select
									name="categoryId"
									id="categoryId-basic"
									defaultValue={""}
									value={article.categoryId || 0}
									className={clsx(classes.formControl, classes.body5)}
									classes={{
										select: classes.select
									}}
									onChange={handleChange}>
									<MC.MenuItem value={0}><em>카테고리</em></MC.MenuItem>
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
					
					{/*벼룩시장 전용*/}
					{
						checkFleMarket() ?
							<MC.Grid item xs={12} md={2}>
								<MC.FormControl variant="outlined" className={classes.formControl}>
									<MC.Select
										labelId="transactionType-label"
										name="transactionType"
										id="transactionType-basic"
										defaultValue={""}
										value={article.transactionType || "TRANSACTION_STATUS"}
										className={clsx(classes.formControl, classes.body5)}
										classes={{
											select: classes.select
										}}
										onChange={handleChange}>
										<MC.MenuItem value={"TRANSACTION_STATUS"}><em>거래상태</em></MC.MenuItem>
										<MC.MenuItem value={"RESERVATION"}>예약중</MC.MenuItem>
										<MC.MenuItem value={"TRADING"}>거래중</MC.MenuItem>
										<MC.MenuItem value={"TRANSACTION_COMPLETE"}>거래완료</MC.MenuItem>
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
							:
							(menuKey === "complaints" || menuKey === "suggestions") &&
							<MC.Grid item xs={12} md={menuKey === "suggestions" ? 2 : 6}>
								<MC.FormControl variant="outlined" className={classes.formControl} error={errors.isSecret}>
									<MC.Select
										labelId="isSecret-label"
										name="isSecret"
										id="isSecret-basic"
										defaultValue={""}
										value={article.isSecret + "" || "none"}
										className={clsx(classes.formControl, classes.body5)}
										classes={{
											select: classes.select
										}}
										onChange={handleChange}>
										<MC.MenuItem value={"none"}><em>비공개여부</em></MC.MenuItem>
										<MC.MenuItem value={"true"}>비공개</MC.MenuItem>
										<MC.MenuItem value={"false"}>공개</MC.MenuItem>
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
					}
					
					{/*제목*/}
					<MC.Grid item xs={12} md={checkFleMarket() ? 8 : menuKey === "complaints" ? 12 : menuKey === "suggestions" ? 10 : 9}>
						<MC.FormControl fullWidth>
							<MC.TextField
								id="title-basic"
								name="title"
								variant="outlined"
								placeholder="제목을 입력해주세요."
								className={clsx(classes.formControl, classes.body5)}
								style={{ height: 42 }}
								inputProps={{
									style: {
										height:  42,
										padding: "0 14px"
									}
								}}
								error={errors.isTitle}
								value={article.title || ""}
								onChange={handleChange} />
						</MC.FormControl>
					</MC.Grid>
					
					{/*본문*/}
					<MC.Grid item xs={12} md={12}>
						<UserHTMLEditor
							content={article.content || ""}
							obj={article}
							isMobile={isMobile}
							setObj={setArticle}
							attachFiles={attachFiles}
							setAttachFiles={setAttachFiles}
						/>
					</MC.Grid>
				</MC.Grid>
			</form>
		
		</div>
	);
};

export default ArticleEditForm;
