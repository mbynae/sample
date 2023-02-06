import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ResidentReservationRepository {
	
	STATIC_URL = "/residentReservation";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResidentReservations(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @returns {Promise<*>}
	 */
	getResidentReservation(id, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 등록
	 * @param registerResidentReservationRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	saveResidentReservation(registerResidentReservationRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerResidentReservationRequest), isUser });
	}
	
	/**
	 * 등록
	 * @param registerResidentReservationRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	adminSaveResidentReservation(registerResidentReservationRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/adminSave");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerResidentReservationRequest), isUser });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	removeResidentReservation(id, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}
	
}

export default new ResidentReservationRepository();
