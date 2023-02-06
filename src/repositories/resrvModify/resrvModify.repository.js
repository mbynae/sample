import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ResrvModifyRepository {

	STATIC_URL = "/api/v1/history";

	/**
	 * 예약취소내역 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRfndSearch(params, funcParam){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + funcParam);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET"});
	}

	/**
	 * 예약취소내역 상세조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRfndDetailSearch(params, funcParam){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + funcParam);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET"});
	}

}

export default new ResrvModifyRepository();
