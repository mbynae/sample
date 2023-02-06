import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ParkingMgntRepository {

	STATIC_URL = "/api/v1/parkmgnt";

	/**
	 * 주차 관리 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getParkingReservationList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkcarsearch/");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 주차 관리 취소
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkcardelete");
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE", body: params, isUser });
	}

	/**
	 * 주차 관리 수정
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	updateParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkcarupdate");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PUT", isUser });
	}

	/**
	 * 주차 관리 등록
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	addParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkcarinsert");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "POST", isUser });
	}

	/**
	 * 주차 관리 상세
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	detailParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/parkcarsearchdetail");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}


}

export default new ParkingMgntRepository();
