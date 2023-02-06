import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MenuRepository {

	STATIC_URL = "/menu";

	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getMenus(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 수정
	 * @param updateMenusRequest
	 * @returns {Promise<*>}
	 */
	updateMenus(updateMenusRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateMenusRequest) });
	}

	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getMenus_V1(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/mngmedit");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 수정
	 * @param updateMenusRequest
	 * @returns {Promise<*>}
	 */
	updateMenus_V1(updateMenusRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/mngmedit/update");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(updateMenusRequest) });
	}


}

export default new MenuRepository();
