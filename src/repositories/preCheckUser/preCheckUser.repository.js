import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class PreCheckUserRepository {
	
	STATIC_URL = "/preCheckUser";
	
	/**
	 * 로그인
	 * @param loginRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	login(loginRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/login");
		let isPreCheckUser = true;
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(loginRequest), isUser, isPreCheckUser });
	}
	
	/**
	 * 사전점검 고객 정보 조회
	 * @returns {Promise<*>}
	 */
	userMe(isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/me");
		let isPreCheckUser = true;
		return apiHelper.request({ url, method: "GET", isUser, isPreCheckUser });
	}
	
}

export default new PreCheckUserRepository();
