import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class VisitingCarRepository {

	STATIC_URL = "/visitingCar";
	STATIC_URL_V1 = "/api/v1/parkcmmt";

	//------------------------V1--------------------------//
	/**
	 * 주차 예약 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getParkingReservationList(params, isUser){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_V1 + "/parkrsvtsearch");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 계정별 주차 예약 조회
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getMyParkingReservation(isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_V1 + "/myparkrsvtsearch");
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 주차 예약 취소
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_V1 + "/myparkrsvtcancel");
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PUT", body: params, isUser });
	}

	/**
	 * 주차 예약 등록
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	addParkingReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_V1 + "/myparkrsvtinsert");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "POST", isUser });
	}

	//------------------------NOT USE--------------------------//
	// /**
	//  * 목록조회
	//  * @param params
	//  * @param isUser
	//  * @returns {Promise<*>}
	//  */
	// getVisitingCars(params, isUser = false){
	// 	let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
	// 	url.search = new URLSearchParams(params).toString();
	// 	return apiHelper.request({ url, method: "GET", isUser });
	// }
	//
	// /**
	//  * 상세조회
	//  * @param id
	//  * @param params
	//  * @param isUser
	//  * @returns {Promise<*>}
	//  */
	// getVisitingCar(id, params, isUser = false){
	// 	let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
	// 	url.search = new URLSearchParams(params).toString();
	// 	return apiHelper.request({ url, method: "GET", isUser });
	// }
	//
	// /**
	//  * 등록
	//  * @param registerVisitingCarRequest
	//  * @param isUser
	//  * @returns {Promise<*>}
	//  */
	// saveVisitingCar(registerVisitingCarRequest, isUser = false){
	// 	let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
	// 	return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerVisitingCarRequest), isUser });
	// }
	//
	// /**
	//  * 수정
	//  * @param id
	//  * @param updateVisitingCarRequest
	//  * @param isUser
	//  * @returns {Promise<*>}
	//  */
	// updateVisitingCar(id, updateVisitingCarRequest, isUser = false){
	// 	let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
	// 	return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateVisitingCarRequest), isUser });
	// }
	//
	// /**
	//  * 삭제
	//  * @param id
	//  * @param params
	//  * @param isUser
	//  * @returns {Promise<*>}
	//  */
	// removeVisitingCar(id, isUser = false){
	// 	let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
	// 	return apiHelper.request({ url, method: "DELETE", isUser });
	// }

}

export default new VisitingCarRepository();
