import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class FacilityReservationRepository {
	
	STATIC_URL = "/facilityReservation";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getFacilityReservations(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @returns {Promise<*>}
	 */
	getFacilityReservation(id, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 등록
	 * @param registerFacilityReservationRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	saveFacilityReservation(registerFacilityReservationRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerFacilityReservationRequest), isUser });
	}
	
	/**
	 * 등록
	 * @param registerFacilityReservationRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	adminSaveFacilityReservation(registerFacilityReservationRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/adminSave");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerFacilityReservationRequest), isUser });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	removeFacilityReservation(id, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}
	
}

export default new FacilityReservationRepository();
