import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class ContractStore {
	
	@persist("object") @observable contractSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("ContractStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.contractSearch = temp.contractSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setContractSearch = (contractSearch) => {
		this.contractSearch = contractSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new ContractStore();
