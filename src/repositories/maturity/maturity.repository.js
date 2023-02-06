import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MaturityRepository {
	
	STATIC_URL = "/maturity";
	
	/**
	 * 상세조회
	 * @returns {Promise<*>}
	 */
	getMaturity(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 수정
	 * @param updateMaturityRequest
	 * @returns {Promise<*>}
	 */
	updateMaturity(updateMaturityRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(updateMaturityRequest) });
	}
	
}

export default new MaturityRepository();
