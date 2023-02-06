import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class AptComplexStore {

	@persist("object") @observable aptComplex = {};
	@persist("object") @observable aptComplexSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	@persist("object") @observable cmpxNumb = "";

	constructor(){
		let firstAutorun = true;

		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("aptComplexStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.aptComplex = temp.aptComplex;
					this.aptComplexSearch = temp.aptComplexSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}

	@action
	setAptComplex = (aptComplex) => {
		this.aptComplex = aptComplex;
	};

	@action
	setAptComplexSearch = (aptComplexSearch) => {
		this.aptComplexSearch = aptComplexSearch;
	};

	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};

	@action
	setCmpxNumb = (cmpxNumb) => {
		this.cmpxNumb = cmpxNumb;
	}
}

export default new AptComplexStore();
