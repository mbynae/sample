import { constants } from "../../../commons";
import { apiHelper } from "../../../helpers";

class HolidayRepository {

	STATIC_URL = "/api/v1/mngr/fcltholi/"

	/**
	 * 휴일목록 조회
	 * @param fcltNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getHolidayList(fcltNumb, params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "fcltholiload/" + fcltNumb);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 휴일정보 등록
	 * @param createHolidayRequest
	 * @returns {Promise<*>}
	 */
	createHoliday(createHolidayRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "fcltholiinsert");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(createHolidayRequest), isUser});
	}

	/**
	 * 휴일정보 수정
	 * @param updateHolidayNumb
	 * @returns {Promise<*>}
	 */
	updateHoliday(updateHolidayRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "fcltholiupdate");
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateHolidayRequest), isUser});
	}

	/**
	 * 휴일정보 삭제
	 * @param deleteHolidayNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteHoliday(deleteHolidayNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "fcltholidelete/" + deleteHolidayNumb);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

}

export default new HolidayRepository;
