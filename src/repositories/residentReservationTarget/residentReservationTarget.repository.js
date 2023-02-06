import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ResidentReservationTargetRepository {
	
	STATIC_URL = "/residentReservationTarget";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResidentReservationTargets(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @returns {Promise<*>}
	 */
	getResidentReservationTarget(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerResidentReservationTargetRequest
	 * @returns {Promise<*>}
	 */
	saveResidentReservationTarget(registerResidentReservationTargetRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerResidentReservationTargetRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeResidentReservationTarget(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new ResidentReservationTargetRepository();
