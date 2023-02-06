import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class PrgmMgntRepository {

	STATIC_URL = "/api/v1/mngr/prgmmstr";
	STATIC_URL2 = "/api/v1/mngr/prgm";

	/**
	 * 상품목록 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getPrgmMstrList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/prgmmstrload");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상품 상세조회
	 * @returns {Promise<*>}
	 */
	getPrgmDetl(prgmNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/prgmsondetlload/" + prgmNumb);
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상품등록
	 * @param prgmMstrRequest
	 * @returns {Promise<*>}
	 */
	prgmmstrInsert(params, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/prgmmstrinsert");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(params), isUser});
	}

	/**
	 * 상품수정
	 * @param prgmMstrRequest
	 * @returns {Promise<*>}
	 */
	prgmmstrUpdate(params, prgmNumb, isUser=false){
		// console.log(prgmNumb)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/prgmmstrupdate/" + prgmNumb);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(params), isUser});
	}

	/**
	 * 상품 좌석 및 배치도 등록
	 * @param prgmMstrRequest
	 * @returns {Promise<*>}
	 */
	prgmSeat(params, prgmNumb, image, isUser=false){
		// console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmsalt/" + prgmNumb);
		const formData = new FormData();
		formData.append("detl_name", params.detl_name);
		formData.append("user_cnt", params.user_cnt);
		formData.append("add_cnt", params.add_cnt);
		formData.append("img", image);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true, isUser});
	}

	/**
	 * 상품 좌석 및 배치도 상세조회
	 * @returns {Promise<*>}
	 */
	getPrgmSeat(prgmNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmsalt/" + prgmNumb);
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 컨텐츠 안내 등록
	 * @param prgmMstrRequest
	 * @returns {Promise<*>}
	 */
	prgmLecture(params, prgmNumb, file, isUser=false){
		// console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmmaterials/" + prgmNumb);
		const formData = new FormData();
		formData.append("cnts_info", params.cnts_info);
		formData.append("cnts_memo", params.cnts_memo);
		formData.append("file", file);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true, isUser});
	}

	/**
	 * 컨텐츠 안내 상세조회
	 * @returns {Promise<*>}
	 */
	getPrgmLecture(prgmNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmmaterials/" + prgmNumb);
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상품삭제
	 * @param prgm_numb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	prgmmstrDelete(prgm_numb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/prgmmstrdelete/" + prgm_numb);
		url.search = new URLSearchParams(prgm_numb).toString();
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

	/**
	 * 대분류(시설)정보 조회
	 * @param fclt_code
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getFcltList(fclt_code, isUser = false){
		// console.log(fclt_code);
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 +"/prgmbigload");
		if(fclt_code !== null) {
			url.search = new URLSearchParams(fclt_code).toString();
		}
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 중분류(시설)정보 조회
	 * @param prgm_numb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getPrgmList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmmidload/" + params);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상품등록 공통코드 정보 조회
	 * @returns {Promise<*>}
	 */
	getPrgmcodeLoad(isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmgrpcodeload");
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상품등록 세부공통코드 정보 조회
	 * @returns {Promise<*>}
	 */
	getPrgmUnitcodeLoad(isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmunitcodeload");
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상품명채번 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getPrgmNameLoad(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/prgmnameload");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser});
	}

	/**
	 * 강사 정보 조회
	 * @returns {Promise<*>}
	 */
	getInstList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgminstload/" + params);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 신청기간 조회
	 * @returns {Promise<*>}
	 */
	getSchdList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2 + "/prgmschdload/" + params);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

}

export default new PrgmMgntRepository();
