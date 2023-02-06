import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ContractTypeRepository {
	
	STATIC_URL = "/contractType";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getContractTypes(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 상세조회
	 * @param id
	 * @returns {Promise<*>}
	 */
	getContractType(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerContractTypeRequest
	 * @returns {Promise<*>}
	 */
	saveContractType(registerContractTypeRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerContractTypeRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateContractTypeRequest
	 * @returns {Promise<*>}
	 */
	updateContractType(id, updateContractTypeRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateContractTypeRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeContractType(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new ContractTypeRepository();
