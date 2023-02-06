import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class FacilityMgmtRepository {
	
	STATIC_URL = "/facilityMgmt";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getFacilityMgmts(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @returns {Promise<*>}
	 */
	getFacilityMgmt(id, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 등록
	 * @param registerFacilityMgmtRequest
	 * @returns {Promise<*>}
	 */
	saveFacilityMgmt(registerFacilityMgmtRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerFacilityMgmtRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateFacilityMgmtRequest
	 * @returns {Promise<*>}
	 */
	updateFacilityMgmt(id, updateFacilityMgmtRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateFacilityMgmtRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeFacilityMgmt(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new FacilityMgmtRepository();
