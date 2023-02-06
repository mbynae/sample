import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class OfficeAdminRepository {
	
	STATIC_URL = "/user/admin";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getOfficeAdmins(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 수정
	 * @param userId
	 * @param updateOfficeAdminRequest
	 * @returns {Promise<*>}
	 */
	updateOfficeAdmin(userId, updateOfficeAdminRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + userId);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateOfficeAdminRequest) });
	}
}

export default new OfficeAdminRepository();
