import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class PreCheckDetailStore {
	
	@persist("object") @observable preCheckDetailSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 0
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("PreCheckDetailStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.preCheckDetailSearch = temp.preCheckDetailSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setPreCheckDetailSearch = (preCheckDetailSearch) => {
		this.preCheckDetailSearch = preCheckDetailSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new PreCheckDetailStore();
