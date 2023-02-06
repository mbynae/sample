import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MaintenanceTypeRepository {
	
	STATIC_URL = "/maintenanceType";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getMaintenanceTypes(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @returns {Promise<*>}
	 */
	getMaintenanceType(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerMaintenanceTypeRequest
	 * @returns {Promise<*>}
	 */
	saveMaintenanceType(registerMaintenanceTypeRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerMaintenanceTypeRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateMaintenanceTypeRequest
	 * @returns {Promise<*>}
	 */
	updateMaintenanceType(id, updateMaintenanceTypeRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateMaintenanceTypeRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeMaintenanceType(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new MaintenanceTypeRepository();
