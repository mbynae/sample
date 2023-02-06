import React, { useEffect, useState } from "react";
import * as MS                        from "@material-ui/styles";
import { ParkinglotInfoTable }        from "./components";

const useStyles = MS.makeStyles(theme => ({
	root: {},
	content: {
		padding: 0
	},
}));

const ParkinglotInfo = props => {

	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(true);
	const [pageInfo, setPageInfo] = useState({
		page:  0,
		size:  10,
		total: 0
	});

	const [parkinglotInfoList, setParkinglotInfoList] = useState([]); // 주차장 정보 저장 State

	useEffect( () => {
		window.scrollTo(0, 0);
		const init = async () => {
			await getParkinglotList();
			await setIsLoading(false)
		};
		setTimeout(() => {
			init();
		}, 100);
	}, []);

	const getParkinglotList = (page, size) => {
		setParkinglotInfoList([])
	}

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<ParkinglotInfoTable
					getParkinglotList={getParkinglotList}
					parkinglotInfoList={parkinglotInfoList}
					pageInfo={pageInfo}
					setPageInfo={setPageInfo}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);

}

export default ParkinglotInfo;
