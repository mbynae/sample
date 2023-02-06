import React, { useEffect, useState } from "react";
import * as MS                        from "@material-ui/styles";
import { CarsInfoTable }              from "./components";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
}));

const CarsInfo = props => {

	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(true);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 0
	});
	const [carsInfoList, setCarsInfoList] = useState([]); // 차량 정보 List 저장 State

	useEffect( () => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getCarsInfoList();
			await setIsLoading(false)
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getCarsInfoList = (page, size) => {
		setCarsInfoList([])
	}

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<CarsInfoTable
					getCarsInfoList={getCarsInfoList}
					carsInfoList={carsInfoList}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);

}

export default CarsInfo;
