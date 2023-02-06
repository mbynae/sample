import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ManagementFeeRepository {
	
	STATIC_URL = "/managementFee";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getManagementFees(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 중복조회
	 * @param params
	 * @returns {Promise<* | undefined>}
	 */
	getDuplicate(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/find/duplicate");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	getManagementFee(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerManagementFeeRequest
	 * @returns {Promise<*>}
	 */
	saveManagementFee(registerManagementFeeRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(registerManagementFeeRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateManagementFeeRequest
	 * @returns {Promise<*>}
	 */
	updateManagementFee(id, updateManagementFeeRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		const formData = this.generateFormData(updateManagementFeeRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}
	
	generateFormData(request){
		const formData = new FormData();
		formData.append("managementFeeRequest", JSON.stringify(request));
		formData.append("file", request.file);
		return formData;
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeManagementFee(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new ManagementFeeRepository();
