import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class AptComplexRepository {

	STATIC_URL = "/aptComplex";

	/**
	 * 상세조회
	 * @param aptId
	 * @param isUser
	 * @param isPreCheckUser
	 * @returns {Promise<*>}
	 */
	getAptComplex(aptId, isUser = false, isPreCheckUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/aptId/" + aptId);
		return apiHelper.request({ url, method: "GET", isUser, isPreCheckUser });
	}

	/**
	 * 수정
	 * @param aptId
	 * @param updateAptComplexRequest
	 * @returns {Promise<*>}
	 */
	updateAptComplex(aptId, updateAptComplexRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + aptId);

		const formData = new FormData();
		formData.append("aptComplexRequest", JSON.stringify(updateAptComplexRequest));
		formData.append("file", updateAptComplexRequest.file);

		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}

	/**
	 * ADMIN_VIEW CMPX_NUMB 조회
	 * @returns {Promise<*>}
	 * 로그인 권한이 있어야 cmpx_numb 호출 가능
	 */
	getAdminCmpxNumb(isUser = false){
		let url = new URL(constants.API_BASE_URL + "/api/v1/cmpx/cmpxinfo");
		return apiHelper.request({ url, method: "GET", isUser});
	}

	/**
	 * USER_VIEW CMPX_NUMB 조회
	 * @returns {Promise<*>}
	 * 로그인 권한 없어도 cmpx_numb 호출 가능
	 */
	getUserCmpxNumb(aptId, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/api/v1/cmpx/cmpxinfo/aptid/" + aptId);
		return apiHelper.request({ url, method: "GET", isUser});
	}
}

export default new AptComplexRepository();
