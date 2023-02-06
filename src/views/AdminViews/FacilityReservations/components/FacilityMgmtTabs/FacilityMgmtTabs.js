import React, { useEffect, useState } from "react";
import { inject, observer }           from "mobx-react";
import { withRouter }                 from "react-router-dom";
import { toJS }                       from "mobx";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const a11yProps = index => {
	return {
		id:              `tab-${index}`,
		"aria-controls": `tabpanel-${index}`
	};
};

const useStyles = MS.makeStyles(theme => ({
	root: {
		backgroundColor: theme.white
	}
}));

const FacilityMgmtTabs = props => {
	const classes = useStyles();
	
	const { FacilityReservationStore, facilityMgmts, getFacilityReservations } = props;
	
	const [value, setValue] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	
	useEffect(() => {
		const init = () => {
			setTotalCount(0);
			
			let facilityReservationSearch = toJS(FacilityReservationStore.facilityReservationSearch);
			if ( facilityReservationSearch.facilityMgmtId && facilityMgmts.length > 0 ) {
				let findIndex = facilityMgmts.findIndex(c => c.id === facilityReservationSearch.facilityMgmtId);
				setValue(findIndex + 1);
			} else {
				setValue(0);
			}
			
			facilityMgmts.map(category => {
				setTotalCount(prev => {
					return prev + category.count;
				});
			});
		};
		setTimeout(() => {
			init();
		});
	}, [facilityMgmts]);
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
		
		let searchInfo = FacilityReservationStore.facilityReservationSearch;
		
		if ( newValue > 0 ) {
			searchInfo = {
				...searchInfo,
				facilityMgmtId: facilityMgmts[newValue - 1].id
			};
			FacilityReservationStore.setFacilityReservationSearch(searchInfo);
		} else {
			searchInfo = {
				...searchInfo,
				facilityMgmtId: undefined
			};
			FacilityReservationStore.setFacilityReservationSearch(searchInfo);
		}
		getFacilityReservations(0, FacilityReservationStore.pageInfo.size);
	};
	
	return (
		<div className={"lmsTabs"}>
			<MC.AppBar position="static">
				<MC.Tabs
					key={`tabs`}
					value={value}
					onChange={handleChange}
					aria-label="simple tabs example"
					style={{ backgroundColor: "#fff" }}
					textColor="primary">
					<MC.Tab label={`전체`} {...a11yProps(0)} />
					{
						facilityMgmts && facilityMgmts.map((facilityMgmt, index) => (
							<MC.Tab key={index} label={`${facilityMgmt.facilityTitle}`} {...a11yProps(index + 1)} />
						))
					}
				</MC.Tabs>
			</MC.AppBar>
		</div>
	);
};

export default inject("FacilityReservationStore")(withRouter(observer(FacilityMgmtTabs)));
