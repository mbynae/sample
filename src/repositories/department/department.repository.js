import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class DepartmentRepository {
	
	STATIC_URL = "/department";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getDepartments(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @returns {Promise<*>}
	 */
	getDepartment(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerDepartmentRequest
	 * @returns {Promise<*>}
	 */
	saveDepartment(registerDepartmentRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerDepartmentRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateDepartmentRequest
	 * @returns {Promise<*>}
	 */
	updateDepartment(id, updateDepartmentRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateDepartmentRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeDepartment(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new DepartmentRepository();
