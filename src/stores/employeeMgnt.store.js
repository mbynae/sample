import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class EmployeeMgntStore {
	
	@persist("object") @observable employeeMgntSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("EmployeeMgntStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.employeeMgntSearch = temp.employeeMgntSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setEmployeeMgntSearch = (employeeMgntSearch) => {
		this.employeeMgntSearch = employeeMgntSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new EmployeeMgntStore();
