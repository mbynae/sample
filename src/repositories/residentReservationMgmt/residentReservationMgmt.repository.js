import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ResidentReservationMgmtRepository {
	
	STATIC_URL = "/residentReservationMgmt";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResidentReservationMgmts(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 상세조회
	 * @returns {Promise<*>}
	 */
	getResidentReservationMgmt(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerResidentReservationMgmtRequest
	 * @returns {Promise<*>}
	 */
	saveResidentReservationMgmt(registerResidentReservationMgmtRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerResidentReservationMgmtRequest) });
	}
	
	/**
	 * 수정
	 * @param id
	 * @param updateResidentReservationMgmtRequest
	 * @returns {Promise<*>}
	 */
	updateResidentReservationMgmt(id, updateResidentReservationMgmtRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateResidentReservationMgmtRequest) });
	}
	
	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removeResidentReservationMgmt(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE" });
	}
	
}

export default new ResidentReservationMgmtRepository();
