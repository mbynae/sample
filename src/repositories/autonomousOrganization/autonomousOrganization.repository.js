import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class AutonomousOrganizationRepository {
	
	STATIC_URL = "/autonomousOrganization";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getAutonomousOrganizations(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getAutonomousOrganization(id, params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 등록
	 * @param registerAutonomousOrganizationRequest
	 * @returns {Promise<*>}
	 */
	saveAutonomousOrganization(registerAutonomousOrganizationRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(registerAutonomousOrganizationRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateAutonomousOrganizationRequest
	 * @returns {Promise<*>}
	 */
	updateAutonomousOrganization(id, updateAutonomousOrganizationRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		const formData = this.generateFormData(updateAutonomousOrganizationRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}
	
	generateFormData(request){
		const formData = new FormData();
		formData.append("autonomousOrganizationRequest", JSON.stringify(request));
		if ( request.files ) {
			for ( let x = 0; x < request.files.length; x++ ) {
				formData.append("files", request.files[x]);
			}
		}
		return formData;
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeAutonomousOrganization(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new AutonomousOrganizationRepository();
