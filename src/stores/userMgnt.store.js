import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class UserMgntStore {
	
	@persist("object") @observable userMgntSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("UserMgntStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.userMgntSearch = temp.userMgntSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setUserMgntSearch = (userMgntSearch) => {
		this.userMgntSearch = userMgntSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new UserMgntStore();
