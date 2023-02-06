import { action, autorun, observable } from "mobx";
import { persist } from "mobx-persist";

class PreCheckReportStore {
	@persist("object") @observable preCheckReport = {};

	constructor() {
		let firstAutorun = true;

		autorun(async () => {
			if (firstAutorun) {
				const json = await localStorage.getItem("PreCheckReportStore");
				if (json != null) {
					let temp = JSON.parse(json);
					this.preCheckReport = temp.preCheckReport;
				}
				firstAutorun = false;
			}
		});
	}

	@action
	setPreCheckReport = (preCheckReport) => {
		this.preCheckReport = preCheckReport;
	};
}

export default new PreCheckReportStore();
