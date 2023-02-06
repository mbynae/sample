import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ResrvHistRepository {

	STATIC_URL = "/api/v1/dongho";

	/**
	 * 동 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getDongSearch(params, funcParam){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + funcParam);
		url.search = new URLSearchParams(params).toString();
		//return apiHelper.request({ url, method: "GET", body: JSON.stringify(params)});
		return apiHelper.request({ url, method: "GET"});
	}

	/**
	 * 호 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getHoSearch(params, funcParam){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + funcParam);
		url.search = new URLSearchParams(params).toString();
		//return apiHelper.request({ url, method: "GET", body: JSON.stringify(params)});
		return apiHelper.request({ url, method: "GET"});
	}

	STATIC_URL2 = "/api/v1/rsvtmngr/search";

	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRsvtNngrSearch(params){
		// console.log(constants.API_BASE_URL + this.STATIC_URL2);
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL2);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET"});
	}

	STATIC_URL3 = "/api/v1/mngr/rsvt";

	/**
	 * 대분류(시설 카테고리) 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getFcltSearch(params, funcParam, isUser = false){
		// console.log(constants.API_BASE_URL + this.STATIC_URL3 + "/" + funcParam)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL3 + "/" + funcParam);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser});
	}

	STATIC_URL4 = "/api/v1/mngr/rsvt/rsvtmidload";

	/**
	 * 중분류(상품) 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getPrgmSearch(params, funcParam, isUser = false){
		// console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL4 + "/" + funcParam);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser});
	}

	STATIC_URL5 = "/api/v1/rsvtmngr/batch/update/extended";

	/**
	 * 예약일괄연장(일괄연장 가능)
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResrvPeriodUpdate(params, funcParam){
		console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL5 + "/" + funcParam);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(params)});
	}

	STATIC_URL6 = "/api/v1/rsvtmngr/batch/delete";

	/**
	 * 예약일괄취소(단일취소 가능)
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResrvDeleteUpdate(params, funcParam){
		console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL6 + "/" + funcParam);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(params)});
	}

	STATIC_URL7 = "/api/v1/rsvtmngr/batch/sms";

	/**
	 * SMS일괄발송(단일발송 가능)
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getResrvSmsSubmit(params, funcParam){
		console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL7 + "/" + funcParam);
		return apiHelper.request({ url, method: "POST",  body: JSON.stringify(params)});
	}

	STATIC_URL8 = "/api/v1/rsvtmngr/update/update";
	/**
	 * 상품양도
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	setAssignInsert(params){
		console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL8 );
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(params)});
	}

	STATIC_URL9 = "/api/v1/mngr/gnrl/search";
	/**
	 * 입주민 삭제
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getUserMgnts(params){
		console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL9 + "/" + params);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET"});
	}

	STATIC_URL10 = "/api/v1/revhistory/"
	/**
	 * 고객 예약내역 리스트 호출
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRevHistoryList(fcltCode, params, isUser = true){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL10 + "findrevhistorylist/" + fcltCode);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	STATIC_URL11 = "/api/v1/history/cancel/"
	/**
	 * 고객 예약내역 리스트 호출
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRevCancelHistoryList(fcltCode, params, isUser = true){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL11 + "list/" + fcltCode);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	STATIC_URL12 = "/api/v1/rsvtmngr/rsvtapproves"
	/**
	 * 고객 예약내역 리스트 승인
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	setRevApprovesList(params, isUser = false){
		console.log(params)
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL12);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(params), isUser });
	}

	STATIC_URL13 = "/api/v1/mngr/rsvt/rsvtseatdetail/"
	/**
	 * 좌석 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getSeatList(params, isUser = true){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL13);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "POST", body: params, isUser });
	}

	STATIC_URL14 = "/api/v1/mngr/rsvt/rsvtbsktinsert/"
	/**
	 * 임시예약등록 --- For User
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	addReservationBasket(params, isUser = true){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL14);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "POST", body: params, isUser });
	}

	STATIC_URL15 = "/api/v1/mngr/rsvt/rsvtprgminsert/"
	/**
	 * 최종예약신청 --- For User
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	addReservationInsert(bskt_numb, params, isUser = true){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL15 + bskt_numb);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "POST", body: params, isUser });
	}

	STATIC_URL16 = "/api/v1/mngr/rsvt/rsvtprgminfoload/"
	/**
	 * 강좌 안내 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getCourseReservationInfo(prgm_numb, isUser = true){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL16 + prgm_numb);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	STATIC_URL17 = "/api/v1/mngr/rsvt/holidayload/"
	/**
	 * 강좌 안내 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getHolidayList(param, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL17 + param);
		//url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 환불유형 목록 조회
	 * @param searchKey
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRfndStatList(searchKey, isUser){
		let url = new URL(constants.API_BASE_URL + "/api/v1/grcd/select/" + searchKey);
		return apiHelper.request({ url, method: "GET"});
	}

	/**
	 * 아파트 단지코드 조회
	 * @param fcltNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getCmpxInfo(){
		let url = new URL(constants.API_BASE_URL + "/api/v1/cmpx/cmpxinfo");
		return apiHelper.request({ url, method: "GET"});
	}

	/**
	 * 환불규정 조회
	 * @param fcltNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRefundPolicy(params){
		let url = new URL(constants.API_BASE_URL + "/api/v1/refundpolicy/findrefundpolicylist/");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET"});
	}
}

export default new ResrvHistRepository();
