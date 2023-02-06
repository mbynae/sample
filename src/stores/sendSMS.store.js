import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class SendSMSStore {
	
	@persist("object") @observable sendSMSSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("SendSMSStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.sendSMSSearch = temp.sendSMSSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setSendSMSSearch = (sendSMSSearch) => {
		this.sendSMSSearch = sendSMSSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new SendSMSStore();
