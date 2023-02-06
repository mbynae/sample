import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class UserMgntRepository {
	
	STATIC_URL = "/user/normal";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getUserMgnts(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 동 & 호 로 목록조회
	 *
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	getUserMgntsByBuildingAndUnit(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/findHolderOwner");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	getUserMgnt(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateUserMgntRequest
	 * @returns {Promise<*>}
	 */
	updateUserMgnt(id, updateUserMgntRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateUserMgntRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeUserMgnt(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new UserMgntRepository();
