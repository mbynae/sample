import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ManagementFeeItemItemRepository {
	
	STATIC_URL = "/managementFeeItems";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getManagementFeeItems(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerManagementFeeItemRequest
	 * @returns {Promise<*>}
	 */
	saveManagementFeeItem(registerManagementFeeItemRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerManagementFeeItemRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateManagementFeeItemRequest
	 * @returns {Promise<*>}
	 */
	updateManagementFeeItem(id, updateManagementFeeItemRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateManagementFeeItemRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeManagementFeeItem(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new ManagementFeeItemItemRepository();
