import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ContractRepository {
	
	STATIC_URL = "/contract";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getContracts(params){
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
	getContract(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerContractRequest
	 * @returns {Promise<*>}
	 */
	saveContract(registerContractRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(registerContractRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateContractRequest
	 * @returns {Promise<*>}
	 */
	updateContract(id, updateContractRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		const formData = this.generateFormData(updateContractRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}
	
	generateFormData(request){
		const formData = new FormData();
		formData.append("contractRequest", JSON.stringify(request));
		for ( let x = 0; x < request.files.length; x++ ) {
			formData.append("files", request.files[x]);
		}
		return formData;
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeContract(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new ContractRepository();
