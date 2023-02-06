import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class CallBookStore {
	
	@persist("object") @observable callBookSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("CallBookStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.callBookSearch = temp.callBookSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setCallBookSearch = (callBookSearch) => {
		this.callBookSearch = callBookSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new CallBookStore();
