import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class IntroductionRepository {
	
	STATIC_URL = "/introduction";
	
	/**
	 * 상세조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getIntroduction(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 수정
	 * @param menuKey
	 * @param updateIntroductionRequest
	 * @returns {Promise<*>}
	 */
	updateIntroduction(menuKey, updateIntroductionRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + menuKey);
		
		const formData = new FormData();
		formData.append("introductionRequest", JSON.stringify(updateIntroductionRequest));
		for ( let x = 0; x < updateIntroductionRequest.files.length; x++ ) {
			formData.append("files", updateIntroductionRequest.files[x]);
		}
		
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}
	
}

export default new IntroductionRepository();
