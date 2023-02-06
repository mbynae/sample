import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class ResidentReservationStore {
	
	@persist("object") @observable residentReservationSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 0
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("ResidentReservationStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.residentReservationSearch = temp.residentReservationSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setResidentReservationSearch = (residentReservationSearch) => {
		this.residentReservationSearch = residentReservationSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new ResidentReservationStore();
