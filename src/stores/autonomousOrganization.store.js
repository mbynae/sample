import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class AutonomousOrganizationStore {
	
	@persist("object") @observable autonomousOrganizationSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("AutonomousOrganizationStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.autonomousOrganizationSearch = temp.autonomousOrganizationSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setAutonomousOrganizationSearch = (autonomousOrganizationSearch) => {
		this.autonomousOrganizationSearch = autonomousOrganizationSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new AutonomousOrganizationStore();
