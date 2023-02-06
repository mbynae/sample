import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class PreCheckDetailRepository {
	STATIC_URL = "/preCheckDetail";

	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getPreCheckDetails(params) {
		let url = new URL(
			constants.API_BASE_URL + this.STATIC_URL + "/" + params.preCheckuserId
		);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}

	/**
	 * 상세조회
	 * @param id
	 * @param params
	 * @returns {Promise<*>}
	 */
	getPreCheckDetail(id) {
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}

	/**
	 * 등록
	 * @param registerPreCheckDetailRequest
	 * @param isUser
	 * @param isPreCheckUser
	 * @returns {Promise<*>}
	 */
	savePreCheckDetail(
		registerPreCheckDetailRequest,
		isUser = false,
		isPreCheckUser = false
	) {
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({
			url,
			method: "POST",
			body: JSON.stringify(registerPreCheckDetailRequest),
			isUser,
			isPreCheckUser,
		});
	}

	/**
	 * 수정
	 * @param id
	 * @param updatePreCheckDetailRequest
	 * @returns {Promise<*>}
	 */
	updatePreCheckDetail(id, updatePreCheckDetailRequest) {
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({
			url,
			method: "PUT",
			body: JSON.stringify(updatePreCheckDetailRequest),
		});
	}

	/**
	 * 삭제
	 * @param id
	 * @returns {Promise<*>}
	 */
	removePreCheckDetail(id) {
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE" });
	}
}

export default new PreCheckDetailRepository();
