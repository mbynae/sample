import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class FacilityIntroductionRepository {

	STATIC_URL = "/api/v1/mngr/facility/";

	/**
	 * 시설안내목록 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getFacilityList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "list");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 시설안내 상세조회
	 * @param updateBannerRequest
	 * @returns {Promise<*>}
	 */
	getFacilityDetail(fclt_numb, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "detail/" + fclt_numb);
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 시설안내등록
	 * @param updateFacilityRequest
	 * @returns {Promise<*>}
	 */
	createFacility(createFacilityRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "add/");
		const formData = this.generateFormData(createFacilityRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true, isUser});
	}

	generateFormData(request){
		const formData = new FormData();
		formData.append("req", JSON.stringify(request));
		for ( let x = 0; x < request.files.length; x++ ) {
			formData.append("filelist", request.files[x]);
		}
		return formData;
	}

	/**
	 * 시설안내수정
	 * @param updateFacilityRequest
	 * @returns {Promise<*>}
	 */
	updateFacility(updateFacilityRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "add/");
		const formData = this.generateFormData(updateFacilityRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true, isUser});
	}

	/**
	 * 시설안내삭제
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteFacility(fcltNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "delete/" + fcltNumb);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

	/* USER_VIEW 시설안내 정보 조회 */
	USER_STATIC_URL = "/api/v1/user/fcltinfo/";

	/**
	 * USER_VIEW 시설안내정보 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getUserFacilityList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.USER_STATIC_URL + "info");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
}

export default new FacilityIntroductionRepository();
