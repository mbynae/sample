import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ResidentCardRepository {

	STATIC_URL = "/api/v1/mngr/gnrl/resident";

	/**
	 * 입주민 카드 읽기
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResidentCard(isUser){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/gnrlload");
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 해당 입주민 멤버 넘버 가져오기
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getMembNumb(params, isUser){
		let url = new URL(constants.API_BASE_URL + "/api/v1/mngr/gnrl/userinfo/" + params);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 해당 입주민 멤버 입주민 카드 읽기
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResidentCardAdmin(params, isUser){
		// console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/gnrlload?memb_numb=" + params);
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 입주민 카드 등록
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	createResidentCard(params, isUser){
		// console.log(JSON.stringify(params))
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/gnrlreg");
		// url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(params), isUser });
	}

	/**
	 * 입주민 카드 수정
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	updateResidentCard(params, isUser){
		// console.log("수정"+JSON.stringify(params))
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/gnrlupdate");
		return apiHelper.request({ url, method: "PATCH", body: JSON.stringify(params), isUser });
	}

	/**
	 * 시설/수강 상품유형 목록 조회
	 * @param searchKey
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getPrgmTypeList(searchKey, isUser){
		let url = new URL(constants.API_BASE_URL + "/api/v1/grcd/select/" + searchKey);
		return apiHelper.request({ url, method: "GET", isUser });
	}

}

export default new ResidentCardRepository();
