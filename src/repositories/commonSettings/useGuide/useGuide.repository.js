import { constants } from "../../../commons";
import { apiHelper } from "../../../helpers";

class UseGuideRepository {

	STATIC_URL = "/api/v1/useguide/"

	/**
	 * 이용안내 조회
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getUseGuide(isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "finduseguide");
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 이용안내 등록
	 * @param createUseGuideRequest
	 * @returns {Promise<*>}
	 */
	createUseGuide(createUseGuideRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "adduseguide");
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(createUseGuideRequest), isUser});
	}

	/**
	 * 이용안내 수정
	 * @param updateUseGuideRequest
	 * @returns {Promise<*>}
	 */
	updateUseGuide(updateUseGuideRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "updateuseguide");
		return apiHelper.request({ url, method: "PATCH", body: JSON.stringify(updateUseGuideRequest), isUser});
	}

	/**
	 * 이용안내 삭제
	 * @param useGuideNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteUseGuide(useGuideNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "deleteuseguide/" + useGuideNumb);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

}

export default new UseGuideRepository;
