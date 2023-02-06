import React, { useState } from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";

import { parkingMgntRepository }                           from "../../../../../repositories";
import { toJS }                                            from "mobx";
import moment                                              from "moment";
import { AlertDialog, DateFormat, TablePaginationActions } from "../../../../../components";
import clsx                                                from "clsx";
import palette                                             from "../../../../../theme/adminTheme/palette";
import PerfectScrollbar                                    from "react-perfect-scrollbar";

const useStyles = MS.makeStyles(theme => ({
	modalRoot: {
	},
	modalContent: {
		overflow: "hidden"
	}
}));

const FindingCarModal = props => {

	const classes = useStyles();
	const {open, hideModal, searchInfo, setSearchInfo, setVisitingCar,
		showSearchedTable, setShowSearchedTable} = props;

	const [searchedCarList, setSearchedCarList] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  5,
		total: 0
	});

	// Input Change Handler
	const handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;

		setSearchInfo({
			...searchInfo,
			[name]: value
		});
	};

	// 모달 검색 Submit Handler
	const handleSubmit = event => {
		event.preventDefault();
		setShowSearchedTable(true);
		getSearchedCars(0, 5);
	}

	// Row 클릭시 차 번호 선택 이후 모달 Close
	const handleRowClick = (obj) => {
		setVisitingCar(prev => {
			return {
				...prev,
				park_car_numb: obj.park_car_numb,
				car_numb: obj.car_numb
			};
		});
		hideModal();
	};

	// 검색 결과에 따른 차량 리스트 호출
	const getSearchedCars = async (page, size) => {

		let searchParams = {}
		searchParams.dong_numb =  searchInfo.dong_numb;
		searchParams.ho_numb = searchInfo.ho_numb;
		searchParams.car_numb = searchInfo.car_numb
		searchParams.strt_date = searchInfo.strt_date;
		searchParams.end_date = searchInfo.end_date;

		let findVisitingCars = await parkingMgntRepository.getParkingReservationList({
			...searchParams,
			direction: "DESC",
			page:      page ? page : 0,
			size:      size ? size : 5,
			sort:      "park_car_numb"
		});

		setSearchedCarList(findVisitingCars.data_json_array);
		setPageInfo({
			page:  findVisitingCars.paginginfo.page,
			size:  findVisitingCars.paginginfo.size,
			total: findVisitingCars.paginginfo.total
		});
	}

	// 테이블 각 Row Render 함수
	const objView = (obj, index) => (
		<MC.TableRow
			hover
			key={obj.park_car_numb}>

			{/* 순번 */}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{index}
			</MC.TableCell>

			{/* 차량 번호 */}
			<MC.TableCell onClick={() => handleRowClick(obj)} align={"center"}>
				{obj.car_numb}
			</MC.TableCell>

		</MC.TableRow>
	);

	const slice = () => (0, pageInfo.size);
	// Page Change Handler
	const handlePageChange = (event, page) => {
		setPageInfo(prev => {
			return {
				...prev,
				page: page
			};
		});
		getSearchedCars(page, pageInfo.size);
	};
	// Page Row Change Handler
	const handleRowsPerPageChange = event => {
		setPageInfo(prev => {
			return {
				...prev,
				page: 0,
				size: event.target.value
			};
		});
		getSearchedCars(0, event.target.value);
	};

	return (
		<MC.Dialog
			open={open}
			onClose={hideModal}
			aria-labelledby="form-dialog-title"
			maxWidth="lg"
			className={classes.modalRoot}
		>
			{/* 모달 Header */}
			<MC.DialogTitle id="form-dialog-title">
				<MC.Grid container justify={"space-between"} alignItems={"center"}>
					<span>주차차량번호 검색</span>
					<MI.Close onClick={hideModal} style={{cursor: "pointer"}}/>
				</MC.Grid>
			</MC.DialogTitle>

			{/* 모달 Content */}
			<MC.DialogContent className={classes.modalContent}>
				<MC.Grid item xs={12} md={12} style={{marginBottom: 20, padding: "0px 10px"}}>
					<MC.Grid container alignItems={"center"} spacing={3}>
						{/* 동 */}
						<MC.Grid item xs={12} md={3}>
							<MC.FormControl fullWidth>
								<MC.TextField
									id="dong_numb"
									name="dong_numb"
									label={"동"}
									value={searchInfo.dong_numb || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						{/* 호 */}
						<MC.Grid item xs={12} md={3}>
							<MC.FormControl fullWidth>
								<MC.TextField
									id="ho_numb"
									name="ho_numb"
									label={"호"}
									value={searchInfo.ho_numb || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						{/* 차량번호 */}
						<MC.Grid item xs={12} md={4}>
							<MC.FormControl fullWidth>
								<MC.TextField
									id="car_numb"
									name="car_numb"
									label={"차량번호"}
									value={searchInfo.car_numb || ""}
									onChange={handleChange} />
							</MC.FormControl>
						</MC.Grid>
						<MC.Grid item xs={12} md={1}>
							<MC.Button
								color={"primary"}
								size={"small"}
								onClick={handleSubmit}
								variant={"outlined"}
								style={{marginTop: 13}}>
								검색
							</MC.Button>
						</MC.Grid>
					</MC.Grid>
				</MC.Grid>
				<MC.Divider />

				{showSearchedTable &&
				<MC.Card>
					<MC.CardHeader
						title={"검색 결과"}
						subheader={
							<>
								총 {pageInfo.total} 건
							</>
						}
						titleTypographyProps={{ variant: "h4" }}
					/>

					<MC.Divider/>

					<MC.CardContent className={classes.content}>
						<PerfectScrollbar>
							<div className={classes.inner}>
								<MC.Table size="small">
									<MC.TableHead>
										<MC.TableRow>
											<MC.TableCell align={"center"}>순번</MC.TableCell>
											<MC.TableCell align={"center"}>차량번호</MC.TableCell>
										</MC.TableRow>
									</MC.TableHead>
									<MC.TableBody>
										{
											searchedCarList ?
												(
													searchedCarList.length === 0 ?
														<MC.TableRow>
															<MC.TableCell colSpan={7} align="center">
																조회된 차량 데이터가 한 건도 없네요.
															</MC.TableCell>
														</MC.TableRow>
														:
														searchedCarList.slice(slice).map(objView)
												)
												:
												<MC.TableRow>
													<MC.TableCell colSpan={7} align="center">
														<MC.CircularProgress color="secondary"/>
													</MC.TableCell>
												</MC.TableRow>
										}
									</MC.TableBody>

								</MC.Table>
							</div>
						</PerfectScrollbar>
					</MC.CardContent>

					<MC.Divider/>
					<MC.CardActions className={classes.actions}>
						<MC.TablePagination
							component="div"
							count={pageInfo.total}
							labelDisplayedRows={({
								from,
								to,
								count
							}) => "총 " + count + " 건 / " + from + " ~ " + (to === -1 ? count : to)}
							labelRowsPerPage={"페이지당 목록 수 : "}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
							ActionsComponent={TablePaginationActions}
							page={pageInfo.page}
							rowsPerPage={pageInfo.size}
							rowsPerPageOptions={[5, 10, 15, 30, 50]}
						/>
					</MC.CardActions>
				</MC.Card>
				}
			</MC.DialogContent>

			{/* 모달 버튼 그룹 */}
			<MC.DialogActions>
				<MC.Button onClick={hideModal} color="primary">
					취소
				</MC.Button>
			</MC.DialogActions>
		</MC.Dialog>
	)

}

export default FindingCarModal;
