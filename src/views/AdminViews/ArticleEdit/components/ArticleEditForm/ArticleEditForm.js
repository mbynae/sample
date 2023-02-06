import React, { useEffect, useState } from "react";
import * as MC                        from "@material-ui/core";
import * as MS                        from "@material-ui/styles";

import { HTMLEditor }                                  from "../../../../../components";
import { categoryRepository }                          from "../../../../../repositories";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils                                     from "@date-io/moment";

const useStyles = MS.makeStyles(theme => ({
	root:                     {
		padding: theme.spacing(3)
	},
	content:                  {
		marginTop: theme.spacing(2)
	},
	cardContent:              {},
	formControl:                {
		margin:       theme.spacing(1)
	},
	keyboardDatePicker:    {
		width: "100%"
	},
}));

const ArticleEditForm = props => {
	const classes = useStyles();

	const { isEdit, menuKey, aptId, article, setArticle, attachFiles, setAttachFiles, errors, setErrors } = props;

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const init = async () => {
			await getCategories();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const checkFleMarket = () => menuKey === "fleaMarket" && isEdit;

	const sort = (a, b) => a.sequence - b.sequence;

	const getCategories = async () => {
		let params = {
			menuKey: menuKey
		};

		if ( menuKey !== "ticket" ) {
			params.aptId = aptId;
		}

		const categories = await categoryRepository.getCategories(params);
		setCategories(categories.sort(sort));
	};

	const handleChange = async (event) => {
		let name = event.target.name;
		let value = event.target.value;

		// 입력 값 있을 경우 에러 초기화
		setErrors(prev => {
			if (name === "categoryId") return {...prev, isCategory: value === ""}
			else if (name === "title") return {...prev, isTitle: value === ""}
		});
		setArticle({
			...article,
			[name]: value
		});
	};

	const isScheduleChange = (event) => {
		let name = event.target.name;
		let checked = event.target.checked;

		let tempStartDate = checked ? new Date() : null;
		let tempEndDate = checked ? new Date() : null;

		setArticle(prev => {
			return {
				...prev,
				startDate: tempStartDate,
				endDate: tempEndDate,
				[name]: checked
			}
		})
	}

	const handleDateChange = (key, date) => {
		if ( key === "startDate" ) {
			date.set("hour", 0);
			date.set("minute", 0);
			date.set("second", 0);
			date.set("millisecond", 0);
		} else {
			date.set("hour", 23);
			date.set("minute", 59);
			date.set("second", 59);
			date.set("millisecond", 59);
		}

		setArticle(prev => {
			return {
				...prev,
				[key]: date.format('YYYY-MM-DD HH:mm:ss')
			};
		});
	};

	return (
		<MC.Card style={{ overflow: "visible" }}>
			<MC.CardContent className={classes.cardContent}>
				<form>
					<MC.Grid container spacing={1}>
						{/*카테고리*/}
						{
							categories.length > 0 &&
							<MC.Grid item xs={12} md={checkFleMarket() ? 2 : 3}>

								<MC.FormControl fullWidth className={classes.formControl} error={errors.isCategory}>
									<MC.InputLabel id="categoryId-label">카테고리</MC.InputLabel>
									<MC.Select
										labelId="categoryId-label"
										name="categoryId"
										id="categoryId-basic"
										defaultValue={""}
										value={article.categoryId || ""}
										onChange={handleChange}
									>
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
							checkFleMarket() &&
							<MC.Grid item xs={12} md={2}>
								<MC.FormControl fullWidth className={classes.formControl}>
									<MC.InputLabel id="transactionType-label">거래상태</MC.InputLabel>
									<MC.Select
										labelId="transactionType-label"
										name="transactionType"
										id="transactionType-basic"
										defaultValue={""}
										value={article.transactionType || ""}
										onChange={handleChange}>
										<MC.MenuItem value={"TRANSACTION_STATUS"}>거래상태</MC.MenuItem>
										<MC.MenuItem value={"RESERVATION"}>예약중</MC.MenuItem>
										<MC.MenuItem value={"TRADING"}>거래중</MC.MenuItem>
										<MC.MenuItem value={"TRANSACTION_COMPLETE"}>거래완료</MC.MenuItem>
									</MC.Select>
								</MC.FormControl>
							</MC.Grid>
						}

						{/*제목*/}
						<MC.Grid item xs={12} md={checkFleMarket() ? 8 : 9}>
							<MC.FormControl fullWidth className={classes.formControl}>
								<MC.TextField
									id="title-basic"
									name="title"
									label="제목"
									placeholder="제목을 입력해주세요."
									error={errors.isTitle}
									value={article.title || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>

						{/* 일정(공지사항일때만 보임) */}
						{
							menuKey === "notice" &&
							<MC.Grid container spacing={1}>
								<MC.Grid item xs={12} md={1}>
									<MC.FormControl fullWidth className={classes.formControl}>
										<MC.FormControlLabel
											control={<MC.Checkbox checked={article.isSchedule ? article.isSchedule : false} onClick={isScheduleChange} name={"isSchedule"}/>}
											label={"일정추가"}
										/>
									</MC.FormControl>
								</MC.Grid>

								<MC.Grid item xs={12} md={11}>
									<MuiPickersUtilsProvider utils={MomentUtils} locale={"ko"}>
										<MC.Grid container spacing={1} >
											<MC.Grid item xs={12} md={5}>
												<MC.FormControl fullWidth className={classes.formControl}>
													<KeyboardDatePicker
														autoOk
														disabled={!article.isSchedule}
														openTo="year"
														views={["year", "month", "date"]}
														variant="inline"
														margin="normal"
														id="contractStartDate-picker-dialog"
														label="시작일자"
														format="yyyy/MM/DD"
														disableToolbar
														minDate={new Date()}
														value={article.startDate ? article.startDate : new Date()}
														onChange={(date) => handleDateChange("startDate", date)}
														KeyboardButtonProps={{
															"aria-label": "change date"
														}}
														className={classes.keyboardDatePicker} />
												</MC.FormControl>
											</MC.Grid>
											<MC.Grid item xs={2} md={2}
															 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
												&nbsp; ~ &nbsp;
											</MC.Grid>
											<MC.Grid item xs={12} md={5}>
												<MC.FormControl fullWidth className={classes.formControl}>
													<KeyboardDatePicker
														autoOk
														disabled={!article.isSchedule}
														openTo="year"
														views={["year", "month", "date"]}
														variant="inline"
														margin="normal"
														id="contractStartDate-picker-dialog"
														label="종료일자"
														format="yyyy/MM/DD"
														disableToolbar
														minDate={article.endDate ? article.startDate : new Date()}
														value={article.endDate ? article.endDate : new Date()}
														onChange={(date) => handleDateChange("endDate", date)}
														KeyboardButtonProps={{
															"aria-label": "change date"
														}}
														className={classes.keyboardDatePicker} />
												</MC.FormControl>
											</MC.Grid>
										</MC.Grid>
									</MuiPickersUtilsProvider>
								</MC.Grid>
							</MC.Grid>
						}

						{/*본문*/}
						<MC.Grid item xs={12} md={12}>

							<HTMLEditor
								content={article.content || ""}
								obj={article}
								setObj={setArticle}
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

export default ArticleEditForm;
