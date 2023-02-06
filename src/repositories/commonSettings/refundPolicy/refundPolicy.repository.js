import { constants } from "../../../commons";
import { apiHelper } from "../../../helpers";

class RefundPolicyRepository {

	STATIC_URL = "/api/v1/refundpolicy/";

	/**
	 * 시설목록 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getFacilityList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "findfacilitylist");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 환불규정 조회
	 * @param fcltNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getRefundPolicyList(fcltNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "findrefundpolicylist/" + fcltNumb);
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 환불규정 등록
	 * @param fcltNumb
	 * @param createPolicyRequest
	 * @returns {Promise<*>}
	 */
	createRefundPolicy(fcltNumb, createPolicyRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "addrefundpolicy/" + fcltNumb);
		const formData = new FormData();
		formData.append("policyList", JSON.stringify(createPolicyRequest.policyList));
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true, isUser});
	}

	/**
	 * 환불규정 수정
	 * @param updatePolicyRequest
	 * @returns {Promise<*>}
	 */
	updateRefundPolicy(fcltNumb, updatePolicyRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "updaterefundpolicy/" + fcltNumb);
		const formData = new FormData();
		formData.append("policyList", JSON.stringify(updatePolicyRequest.policyList));
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true, isUser});
	}

	/**
	 * 환불규정 삭제
	 * @param fcltNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteRefundPolicy(fcltNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "deleterefundpolicy/" + fcltNumb);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

}

export default new RefundPolicyRepository();
