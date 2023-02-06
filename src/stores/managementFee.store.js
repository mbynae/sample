import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class ManagementFeeStore {
	
	@persist("object") @observable managementFeeSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("ManagementFeeStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.managementFeeSearch = temp.managementFeeSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setManagementFeeSearch = (managementFeeSearch) => {
		this.managementFeeSearch = managementFeeSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new ManagementFeeStore();
