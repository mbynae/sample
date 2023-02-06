import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class VisitingCarMgntRepository {

	STATIC_URL = "/api/v1/parkmgntrsvt";

	/**
	 * 주차 예약 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getParkingReservationList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkmgntrsvtsearch/");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 주차 예약 취소
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkmgntrsvtdelete");
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE", body: params, isUser });
	}

	/**
	 * 주차 예약 수정
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	updateParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkmgntrsvtupdate");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PUT", isUser });
	}

	/**
	 * 주차 예약 등록
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	addParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkmgntrsvtinsert");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "POST", isUser });
	}

	/**
	 * 주차 예약 상세
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	detailParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkmgntrsvtsearchdetail");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

}

export default new VisitingCarMgntRepository();
