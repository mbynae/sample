import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class AOPositionRepository {
	
	STATIC_URL = "/aOPosition";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getAOPositions(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	getAOPosition(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerAOPositionRequest
	 * @returns {Promise<*>}
	 */
	saveAOPosition(registerAOPositionRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerAOPositionRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateAOPositionRequest
	 * @returns {Promise<*>}
	 */
	updateAOPosition(id, updateAOPositionRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateAOPositionRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeAOPosition(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new AOPositionRepository();
