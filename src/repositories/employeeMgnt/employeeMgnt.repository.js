import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class EmployeeMgntRepository {
	
	STATIC_URL = "/employee";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getEmployeeMgnts(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	getEmployeeMgnt(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerEmployeeMgntRequest
	 * @returns {Promise<*>}
	 */
	saveEmployeeMgnt(registerEmployeeMgntRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerEmployeeMgntRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateEmployeeMgntRequest
	 * @returns {Promise<*>}
	 */
	updateEmployeeMgnt(id, updateEmployeeMgntRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateEmployeeMgntRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeEmployeeMgnt(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new EmployeeMgntRepository();
