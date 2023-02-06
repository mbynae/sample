import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class BoardRepository {
	
	STATIC_URL = "/board";
	
	/**
	 * 상세조회
	 * @param menuKey
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getBoardByMenuKey(menuKey, params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + menuKey);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
}

export default new BoardRepository();
