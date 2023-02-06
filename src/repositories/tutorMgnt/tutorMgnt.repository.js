import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class TutorMgntRepository {

	STATIC_URL = "/api/v1/lecturer/inst/";

	/**
	 * 강사목록 조회
	 * @returns {Promise<*>}
	 */
	getTutorList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "list");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 강사정보 등록
	 * @param createTutorRequest
	 * @returns {Promise<*>}
	 */
	createTutorInfo(createTutorRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "insert");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(createTutorRequest), isUser});
	}

	/**
	 * 강사정보 수정
	 * @param updateTutorRequest
	 * @returns {Promise<*>}
	 */
	updateTutorInfo(clssCode, updateTutorRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "update/" + clssCode);
		return apiHelper.request({ url, method: "PATCH", body: JSON.stringify(updateTutorRequest), isUser});
	}

	/**
	 * 강사정보 삭제
	 * @param params
	 * @param clssCode
	 * @returns {Promise<*>}
	 */
	deleteTutorInfo(clssCode, params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "delete/" + clssCode);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

}

export default new TutorMgntRepository();
