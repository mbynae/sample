import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MapsRepository {
	
	STATIC_URL = "/geocode";
	
	/**
	 * 주소로 좌표 조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getGeocode(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
}

export default new MapsRepository();
