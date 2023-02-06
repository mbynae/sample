import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MemberRepository {
	
	STATIC_URL = "/members";
	
	/**
	 * 회원정보 조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getMemberInfo(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
}

export default new MemberRepository();
