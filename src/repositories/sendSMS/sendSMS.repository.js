import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class SendSMSRepository {
	
	STATIC_URL = "/sendSMS";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getSendSMSs(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 수정
	 * @param saveSendSMSRequest
	 * @returns {Promise<*>}
	 */
	saveSendSMS(saveSendSMSRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(saveSendSMSRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	removeSendSMS(id, params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new SendSMSRepository();
