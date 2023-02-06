import { action, autorun, observable } from "mobx";
import { persist }                                      from "mobx-persist";
import { accountRepository, resrvHistRepository } from "../repositories";
import { constants }                                    from "../commons";
import { AccountTypeKind }             from "../enums";

class ResrvHistStore {

	@persist("object") @observable resrvHistSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};

	constructor(){

		let firstAutorun = true;
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("ResrvHistStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.resrvHistSearch = temp.resrvHistSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = true;
			}
		});
	}

	@action
	setResrvHistSearch = (resrvHistSearch) => {
		this.resrvHistSearch = resrvHistSearch;
	};

	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new ResrvHistStore();
