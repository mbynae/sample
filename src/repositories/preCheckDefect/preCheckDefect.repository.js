import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class PreCheckDefectRepository {
	
	STATIC_URL = "/preCheckDefect";
	
	/**
	 * 등록
	 * @param registerPreCheckDefectRequest
	 * @param isUser
	 * @param isPreCheckUser
	 * @returns {Promise<*>}
	 */
	savePreCheckDefect(registerPreCheckDefectRequest, isUser = false, isPreCheckUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(registerPreCheckDefectRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true, isUser, isPreCheckUser });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updatePreCheckDefectRequest
	 * @param isUser
	 * @param isPreCheckUser
	 * @returns {Promise<*>}
	 */
	updatePreCheckDefect(id, updatePreCheckDefectRequest, isUser = false, isPreCheckUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		const formData = this.generateFormData(updatePreCheckDefectRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true, isUser, isPreCheckUser });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param isUser
	 * @param isPreCheckUser
	 * @returns {Promise<*>}
	 */
	removePreCheckDefect(id, isUser = false, isPreCheckUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE", isUser, isPreCheckUser });
	}
	
	generateFormData(request){
		const formData = new FormData();
		formData.append("preCheckDefectRequest", JSON.stringify(request));
		for ( let x = 0; x < request.files.length; x++ ) {
			formData.append("files", request.files[x]);
		}
		return formData;
	}
}

export default new PreCheckDefectRepository();
