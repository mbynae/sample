import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MoveReservationRepository {

	STATIC_URL = "/api/v1/rsvt/mvio/rsvt";
	STATIC_URL_INFO = "/api/v1/rsvt/mvio/info";

	/**
	 * 이사 예약 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getMoveReservationList(params, isUser= false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/list");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 이사 예약 상세
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getMoveReservation(params, isUser= false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/detail");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 이사 예약 등록
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	addMoveReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PUT", body: params, isUser });
	}

	/**
	 * 이사 예약 수정
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	editMoveReservation (id, params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/NONE"+ `/${id}`);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PATCH", body: params, isUser });
	}

	/**
	 * 이사 예약 삭제 (관리자)
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteMoveReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/DELETE" + `/${params.mvio_numb}`);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PATCH", isUser });
	}

	/**
	 * 이사 예약 승인
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	approveMoveReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/APPROVE" + `/${params.mvio_numb}`);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PATCH", isUser });
	}

	/**
	 * 이사 예약 취소(반려) (유저, 관리자)
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	cancelMoveReservation (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/CANCEL" + `/${params.mvio_numb}`);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PATCH", isUser });
	}
	cancelMoveReservationMgnt (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/CANCEL" + `/${params.mvio_numb}`);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PATCH", isUser });
	}

	/**
	 * 이사 예약 안내문 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getMoveReservationInfo(params, isUser= false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_INFO + "/detail/cmpx");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	/**
	 * 이사 예약 안내문 등록
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	addMoveReservationInfo (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_INFO);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PUT", isUser });
	}
	/**
	 * 이사 예약 안내문 수정
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	editMoveReservationInfo (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_INFO + "/cmpx");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PATCH", isUser });
	}
	/**
	 * 이사 예약 안내문 삭제
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteMoveReservationInfo (params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL_INFO+ "/cmpx");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PATCH", isUser });
	}

}

export default new MoveReservationRepository();
