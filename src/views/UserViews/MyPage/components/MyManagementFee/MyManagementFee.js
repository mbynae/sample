import React, { useEffect, useState } from "react";
import moment from "moment";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import {
	accountRepository,
	managementFeeItemRepository,
	managementFeeRepository,
} from "../../../../../repositories";
import { CDivider, DateFormat, NumberComma } from "../../../../../components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Stack, Box, Grid } from "@mui/material";
import { toJS } from "mobx";

const useStyles = MS.makeStyles((theme) => ({
	root: {
		width: "100%",
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			minWidth: "100%",
			maxWidth: "100%",
			margin: 0,
		},
	},
	formControl: {},
	select: {
		...theme.typography.h6,
	},
	body4: {
		...theme.typography.body4,
		color: "#ffffff",
		height: 24,
		lineHeight: "24px",
	},
	h6: {
		...theme.typography.h6,
	},
	tableHead: {
		height: 50,
		minHeight: 50,
		maxHeight: 50,
		backgroundColor: "transparent",
	},
	tableRow: {
		height: 50,
		minHeight: 50,
		maxHeight: 50,
	},
}));
const MyManagementFee = (props) => {
	const classes = useStyles();

	const {
		value,
		isMobile,
		UserAptComplexStore,
		setAlertOpens,
		handleAlertToggle,
		setPayInfoOpen,
	} = props;

	const [managementFees, setManagementFees] = useState([]);
	const [selectYearMonth, setSelectYearMonth] = useState("");
	const [fees, setFees] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalMom, setTotalMom] = useState(0);
	const [noFee, setNoFee] = useState(true);

	useEffect(() => {
		const init = async () => {
			let result = await getManagementFees();

			if (result.content && result.content.length > 0) {
				setManagementFees(result.content);
				setSelectYearMonth(
					convertToYearMonth(result.content[0].billingYearMonth)
				);
				await feeAssign(result.content[0].billingYearMonth);
			} else {
				setNoFee(true);
			}
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const getManagementFees = () => {
		return managementFeeRepository.getManagementFees({
			aptId: UserAptComplexStore.aptComplex.id,
			direction: "DESC",
			page: 0,
			size: 100000,
			sort: "baseDateDataType.createDate",
		});
	};

	const getManagementFeeItems = async () => {
		return await managementFeeItemRepository.getManagementFeeItems({
			aptId: UserAptComplexStore.aptComplex.id,
		});
	};

	const findMyManagementFeeInfos = async (billingYearMonth) => {
		let feeDate = moment(billingYearMonth);
		return await accountRepository.findMyManagementFee(
			{ managementFeeDate: feeDate.format("YYYYMM") },
			true
		);
	};

	const feeAssign = async (billingYearMonth) => {
		const sort = (a, b) => a.position - b.position;
		try {
			let tempFeeItemResults = [];
			let feeInfoResults = await findMyManagementFeeInfos(billingYearMonth);

			let feeItemResults = await getManagementFeeItems();
			feeItemResults = feeItemResults
				.filter(
					(obj) =>
						obj.position !== 0 && obj.position !== 1 && obj.position !== 2
				)
				.sort(sort);
			feeItemResults = feeItemResults.filter(
				(obj) => !obj.title.includes("unknown")
			);
			feeItemResults.map((feeItem) => {
				tempFeeItemResults.push(
					Object.assign(
						feeItem,
						feeInfoResults.find((obj) => obj.position === feeItem.position)
					)
				);
			});

			setFees(tempFeeItemResults);
			sumTotalPrice(tempFeeItemResults);
			sumTotalMom(tempFeeItemResults);
			setNoFee(false);
		} catch (e) {
			setNoFee(true);
		}
	};

	const objView = (obj, index) => (
		<MC.TableRow
			className={classes.tableRow}
			style={{ borderBottom: index === fees.length - 1 && "2px solid #222222" }}
			key={obj.id}
		>
			{/*제목*/}
			<MC.TableCell
				className={classes.body4}
				style={{ color: "#222222", fontWeight: 500 }}
				align={"left"}
			>
				{obj.title}
			</MC.TableCell>

			{/*당월금액(원)*/}
			<MC.TableCell
				className={classes.body4}
				style={{ color: "#222222", fontWeight: 500 }}
				align={"center"}
			>
				{NumberComma(obj.price)}
			</MC.TableCell>

			{/*당월금액(원)*/}
			<MC.TableCell
				className={classes.body4}
				style={{ color: "#222222", fontWeight: 500 }}
				align={"center"}
			>
				{obj.mom > 0 ? (
					<span style={{ fontWeight: "bold", color: "#e43d3d" }}>
						{NumberComma(obj.mom)}
					</span>
				) : obj.mom < 0 ? (
					<span style={{ fontWeight: "bold", color: "#3db268" }}>
						{NumberComma(obj.mom)}
					</span>
				) : (
					<span style={{ fontWeight: "bold" }}>{NumberComma(obj.mom)}</span>
				)}
			</MC.TableCell>
		</MC.TableRow>
	);

	const handleChange = async (event) => {
		setSelectYearMonth(convertToYearMonth(event.target.value));
		await feeAssign(event.target.value);
	};

	const changeMonth = async (billingYearMonth) => {
		setSelectYearMonth(convertToYearMonth(billingYearMonth));
		await feeAssign(billingYearMonth);
	};

	const convertToYearMonth = (value) => {
		return moment(value)
			.date(1)
			.hour(0)
			.minute(0)
			.second(0)
			.milliseconds(0)
			.valueOf();
	};

	const sumTotalPrice = (feeItemResults) => {
		let total = 0;
		feeItemResults.map((fee) => {
			if (fee.price) {
				total += fee.price;
			}
		});
		setTotalPrice(total);
	};

	const sumTotalMom = (feeItemResults) => {
		let total = 0;
		feeItemResults.map((fee) => {
			if (fee.mom) {
				total += fee.mom;
			}
		});
		setTotalMom(total);
	};

	return (
		<div hidden={value !== 2} className={classes.root}>
			<Stack
				direction="row"
				justifyContent="center"
				sx={{ pt: (theme) => theme.spacing(3) }}
			>
				<Box
					sx={{
						mx: (theme) => theme.spacing(2),
						width: "100%",
						maxWidth: 800,
						height: (theme) => theme.spacing(7),
						"& button": {
							height: "100%",
						},
					}}
				>
					<MC.Button
						size="large"
						color="primary"
						variant="contained"
						fullWidth
						onClick={() => {
							setPayInfoOpen(true);
						}}
					>
						관리비 납부안내 보기
					</MC.Button>
				</Box>
			</Stack>

			<MC.Grid
				container
				direction={"column"}
				justify={"center"}
				alignItems={"center"}
			>
				<MC.Grid item style={{ width: "100%", marginTop: 45 }}>
					{!noFee && (
						<MC.Grid
							container
							direction={"row"}
							justify={"space-between"}
							alignItems={"center"}
						>
							<MC.Grid item>
								{managementFees && managementFees.length > 0 && (
									<MC.Button
										size={"small"}
										disabled={
											convertToYearMonth(
												managementFees[managementFees.length - 1]
													.billingYearMonth
											) === convertToYearMonth(selectYearMonth)
										}
										onClick={() =>
											changeMonth(
												moment(selectYearMonth).add(-1, "month").valueOf()
											)
										}
										startIcon={
											<ArrowRightAltIcon
												style={{ transform: "rotate(180deg)" }}
											/>
										}
									>
										이전 달
									</MC.Button>
								)}
							</MC.Grid>
							<MC.Grid item xs={5} md={5}>
								<MC.Grid
									container
									direction={"row"}
									justify={"center"}
									alignItems={"center"}
								>
									<MC.FormControl className={classes.formControl}>
										<MC.Select
											value={selectYearMonth}
											onChange={handleChange}
											className={classes.select}
											disableUnderline
											inputProps={{ "aria-label": "Without label" }}
										>
											{managementFees && managementFees.length > 0 ? (
												managementFees.map((managementFee, index) => (
													<MC.MenuItem
														key={index}
														value={convertToYearMonth(
															managementFee.billingYearMonth
														)}
													>
														<DateFormat
															date={managementFee.billingYearMonth}
															format={"YYYY년 MM월"}
														/>
													</MC.MenuItem>
												))
											) : (
												<MC.MenuItem value="">
													<em>관리비 없음</em>
												</MC.MenuItem>
											)}
										</MC.Select>
									</MC.FormControl>
								</MC.Grid>
							</MC.Grid>
							<MC.Grid item>
								{managementFees && managementFees.length > 0 && (
									<MC.Button
										size={"small"}
										disabled={
											convertToYearMonth(managementFees[0].billingYearMonth) ===
											convertToYearMonth(selectYearMonth)
										}
										onClick={() =>
											changeMonth(
												moment(selectYearMonth).add(1, "month").valueOf()
											)
										}
										endIcon={<ArrowRightAltIcon />}
									>
										다음 달
									</MC.Button>
								)}
							</MC.Grid>
						</MC.Grid>
					)}
				</MC.Grid>

				<CDivider style={{ marginTop: 35, backdropColor: "#ebebeb" }} />

				<MC.Grid item style={{ width: "100%", marginTop: 60 }}>
					<MC.Grid
						container
						direction={"row"}
						justify={"center"}
						alignItems={"center"}
					>
						<MC.Grid
							item
							style={{
								width: 156,
								height: 24,
								backgroundColor: "#222222",
								textAlign: "center",
							}}
						>
							{noFee ? (
								<MC.Typography className={classes.body4}>
									등록된 관리비 없음
								</MC.Typography>
							) : (
								<MC.Typography className={classes.body4}>
									전월대비&nbsp;
									{totalMom > 0 ? (
										<span style={{ color: "#f95151" }}>
											{NumberComma(totalMom)}원 증가
										</span>
									) : totalMom < 0 ? (
										<span style={{ color: "#3db268" }}>
											{NumberComma(totalMom)}원 감소
										</span>
									) : (
										<span style={{ color: "#ffffff" }}>동일</span>
									)}
								</MC.Typography>
							)}
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>

				<MC.Grid item style={{ width: "100%", marginTop: 10 }}>
					<MC.Grid
						container
						direction={"row"}
						justify={"center"}
						alignItems={"center"}
					>
						<MC.Grid item style={{ textAlign: "center" }}>
							<MC.Typography variant={"h1"}>
								{NumberComma(totalPrice)} <span className={classes.h6}>원</span>
							</MC.Typography>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>

				<MC.Grid item style={{ width: "100%", marginTop: 40 }}>
					<PerfectScrollbar>
						<div className={classes.inner}>
							<MC.Table>
								<MC.TableHead className={classes.tableHead}>
									<MC.TableRow
										className={classes.tableRow}
										style={{ borderTop: "2px solid #222222" }}
									>
										<MC.TableCell
											className={classes.body4}
											align={"left"}
											style={{
												height: "50px !important",
												fontWeight: "bold",
												color: "#222222",
											}}
										>
											항목
										</MC.TableCell>
										<MC.TableCell
											className={classes.body4}
											align={"center"}
											style={{
												height: "50px !important",
												fontSize: isMobile ? 12 : 14,
												fontWeight: "bold",
												color: "#222222",
												width: isMobile ? "25%" : "15%",
											}}
										>
											당월금액(원)
										</MC.TableCell>
										<MC.TableCell
											className={classes.body4}
											align={"center"}
											style={{
												height: "50px !important",
												fontSize: isMobile ? 12 : 14,
												fontWeight: "bold",
												color: "#222222",
												width: isMobile ? "25%" : "15%",
											}}
										>
											증감액(원)
										</MC.TableCell>
									</MC.TableRow>
								</MC.TableHead>
								<MC.TableBody>
									{fees ? (
										fees.length === 0 ? (
											<MC.TableRow className={classes.tableRow} hover>
												<MC.TableCell colSpan={3} align="center">
													조회된 관리비 내역이 한 건도 없네요.
												</MC.TableCell>
											</MC.TableRow>
										) : (
											fees.map((obj, index) => objView(obj, index))
										)
									) : (
										<MC.TableRow className={classes.tableRow} hover>
											<MC.TableCell colSpan={3} align="center">
												<MC.CircularProgress color="secondary" />
											</MC.TableCell>
										</MC.TableRow>
									)}
								</MC.TableBody>
							</MC.Table>
						</div>
					</PerfectScrollbar>
				</MC.Grid>
			</MC.Grid>
		</div>
	);
};

export default MyManagementFee;
