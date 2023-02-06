import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class MoveReservationStore {

	@persist("object") @observable moveReservationSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};

	constructor(){
		let firstAutorun = true;

		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("MoveReservationStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.moveReservationSearch = temp.moveReservationSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}

	@action
	setMoveReservationSearch = (moveReservationSearch) => {
		this.moveReservationSearch = moveReservationSearch;
	};

	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new MoveReservationStore();
