import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class ParkingCarMgntStore {

	@persist("object") @observable parkingCarsSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};

	constructor(){
		let firstAutorun = true;

		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("ParkingCarMgntStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.parkingCarsSearch = temp.parkingCarsSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}

	@action
	setParkingCarsSearch = (parkingCarsSearch) => {
		this.parkingCarsSearch = parkingCarsSearch;
	};

	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new ParkingCarMgntStore();
