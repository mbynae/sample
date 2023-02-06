import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class FacilityReservationStore {
	
	@persist("object") @observable facilityReservationSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 0
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("FacilityReservationStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.facilityReservationSearch = temp.facilityReservationSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setFacilityReservationSearch = (facilityReservationSearch) => {
		this.facilityReservationSearch = facilityReservationSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new FacilityReservationStore();
