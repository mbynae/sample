import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class DocumentFormRepository {
	
	STATIC_URL = "/documentForm";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getDocumentForms(params){
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
	getDocumentForm(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerDocumentFormRequest
	 * @returns {Promise<*>}
	 */
	saveDocumentForm(registerDocumentFormRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(registerDocumentFormRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateDocumentFormRequest
	 * @returns {Promise<*>}
	 */
	updateDocumentForm(id, updateDocumentFormRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		const formData = this.generateFormData(updateDocumentFormRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}
	
	generateFormData(request){
		const formData = new FormData();
		formData.append("documentFormRequest", JSON.stringify(request));
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
	removeDocumentForm(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new DocumentFormRepository();
