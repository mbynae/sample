import React from "react";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import * as MI from "@material-ui/icons";

const useStyles1 = MS.makeStyles((theme) => ({
	root: {
		flexShrink: 0,
		marginLeft: theme.spacing(2.5)
	}
}));

const TablePaginationActions = (props) => {
	const classes = useStyles1();
	const theme = MS.useTheme();
	const { count, page, rowsPerPage, onChangePage } = props;
	
	const handleFirstPageButtonClick = (event) => {
		onChangePage(event, 0);
	};
	
	const handleBackButtonClick = (event) => {
		onChangePage(event, page - 1);
	};
	
	const handleNextButtonClick = (event) => {
		onChangePage(event, page + 1);
	};
	
	const handleLastPageButtonClick = (event) => {
		onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};
	
	return (
		<div className={classes.root}>
			<MC.IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? <MI.LastPage /> : <MI.FirstPage />}
			</MC.IconButton>
			<MC.IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
				{theme.direction === "rtl" ? <MI.KeyboardArrowRight /> : <MI.KeyboardArrowLeft />}
			</MC.IconButton>
			<MC.IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? <MI.KeyboardArrowLeft /> : <MI.KeyboardArrowRight />}
			</MC.IconButton>
			<MC.IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? <MI.FirstPage /> : <MI.LastPage />}
			</MC.IconButton>
		</div>
	);
};

export default TablePaginationActions;
