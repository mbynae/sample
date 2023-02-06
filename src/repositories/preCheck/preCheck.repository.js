import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class PreCheckRepository {
	
	STATIC_URL = "/preCheck";
	
	/**
	 * 상세조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getPreCheck(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerPreCheckRequest
	 * @returns {Promise<*>}
	 */
	savePreCheck(registerPreCheckRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerPreCheckRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updatePreCheckRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	updatePreCheck(id, updatePreCheckRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updatePreCheckRequest), isUser });
	}
	
	/**
	 * 삭제
	 * @param userId
	 * @returns {Promise<*>}
	 */
	removePreCheck(userId){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + userId);
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new PreCheckRepository();
