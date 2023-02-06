import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class MaintenanceStore {
	
	@persist("object") @observable maintenanceSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("MaintenanceStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.maintenanceSearch = temp.maintenanceSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setMaintenanceSearch = (maintenanceSearch) => {
		this.maintenanceSearch = maintenanceSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new MaintenanceStore();
