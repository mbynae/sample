import { constants } from "../../commons";
import { apiHelper } from "../../helpers";


class scheduleMgntRepository {

	STATIC_URL = "/api/v1/calendar/list";

	/**
	 * 일정목록 조회
	 * @returns {Promise<*>}
	 */
	getScheduleList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 일정 상세조회
	 * @returns {Promise<*>}
	 */
	getScheduleDetailList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/detail");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

}
export default new scheduleMgntRepository();
