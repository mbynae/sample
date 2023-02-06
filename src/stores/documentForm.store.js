import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class DocumentFormStore {
	
	@persist("object") @observable documentFormSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("DocumentFormStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.documentFormSearch = temp.documentFormSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setDocumentFormSearch = (documentFormSearch) => {
		this.documentFormSearch = documentFormSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new DocumentFormStore();
