import { constants } from "../../../commons";
import { apiHelper } from "../../../helpers";

class RegSchdRepository {

	STATIC_URL = "/api/v1/scheduler/"

	/**
	 * 신청기간 목록 조회
	 * @param pageInfo
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRegSchdList(pageInfo, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "list");
		url.search = new URLSearchParams(pageInfo).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 신청기간 등록
	 * @param createRegSchdRequest
	 * @returns {Promise<*>}
	 */
	createRegSchd(createRegSchdRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "reg");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(createRegSchdRequest), isUser});
	}

	/**
	 * 신청기간 수정
	 * @param updateRegSchdRequest
	 * @returns {Promise<*>}
	 */
	updateRegSchd(fcltNumb, schdClss, updateRegSchdRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "update/" + fcltNumb + "/" + schdClss);
		return apiHelper.request({ url, method: "PATCH", body: JSON.stringify(updateRegSchdRequest), isUser});
	}

	/**
	 * 신청기간 삭제
	 * @param deleteRegSchdRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteRegSchd(fcltNumb, schdClss, deleteRegSchdRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "delete/" + fcltNumb + "/" + schdClss);
		url.search = new URLSearchParams(deleteRegSchdRequest).toString();
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

}

export default new RegSchdRepository;
