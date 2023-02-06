import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MaintenanceRepository {
	
	STATIC_URL = "/maintenance";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getMaintenances(params){
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
	getMaintenance(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerMaintenanceRequest
	 * @returns {Promise<*>}
	 */
	saveMaintenance(registerMaintenanceRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(registerMaintenanceRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateMaintenanceRequest
	 * @returns {Promise<*>}
	 */
	updateMaintenance(id, updateMaintenanceRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		const formData = this.generateFormData(updateMaintenanceRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}
	
	generateFormData(request){
		const formData = new FormData();
		formData.append("maintenanceRequest", JSON.stringify(request));
		for ( let x = 0; x < request.files.length; x++ ) {
			formData.append("files", request.files[x]);
		}
		return formData;
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeMaintenance(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new MaintenanceRepository();
