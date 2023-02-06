import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class OfficialPositionRepository {
	
	STATIC_URL = "/officialPosition";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getOfficialPositions(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @returns {Promise<*>}
	 */
	getOfficialPosition(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerOfficialPositionRequest
	 * @returns {Promise<*>}
	 */
	saveOfficialPosition(registerOfficialPositionRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerOfficialPositionRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateOfficialPositionRequest
	 * @returns {Promise<*>}
	 */
	updateOfficialPosition(id, updateOfficialPositionRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateOfficialPositionRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeOfficialPosition(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new OfficialPositionRepository();
