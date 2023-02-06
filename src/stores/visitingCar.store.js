import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class VisitingCarStore {
	
	@persist("object") @observable visitingCarSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("VisitingCarStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.visitingCarSearch = temp.visitingCarSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setVisitingCarSearch = (visitingCarSearch) => {
		this.visitingCarSearch = visitingCarSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new VisitingCarStore();
