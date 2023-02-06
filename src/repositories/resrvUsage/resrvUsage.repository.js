import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ResrvUsageRepository {

	STATIC_URL = "/api/v1/mngr/used/usedlistload/";

	/**
	 * 이용내역조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRsvtUsageSearch(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET"});
	}

	STATIC_URL2 = "/api/v1/mngr/used/entrlistload";

	/**
	 * 이용내역상세
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRsvtUsageDetailSearch(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET"});
	}
}

export default new ResrvUsageRepository();
