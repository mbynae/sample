import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class MainContentRepository {
	
	STATIC_URL = "/mainContent";
	
	/**
	 * 상세조회
	 * @param params
	 * @param isUser
	 * @param isPreCheckUser
	 * @returns {Promise<*>}
	 */
	getMainContent(params, isUser = false, isPreCheckUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser, isPreCheckUser });
	}
	
	/**
	 * 수정
	 * @param updateMainContentRequest
	 * @returns {Promise<*>}
	 */
	updateMainContent(updateMainContentRequest){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(updateMainContentRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true });
	}
	
	generateFormData(request){
		const formData = new FormData();
		formData.append("mainContentRequest", JSON.stringify(request));
		if ( request.mainBannerFiles ) {
			for ( let x = 0; x < request.mainBannerFiles.length; x++ ) {
				formData.append("mainBannerFiles", request.mainBannerFiles[x]);
			}
		}
		formData.append("newLogoFile", request.newLogoFile);
		return formData;
	}
	
}

export default new MainContentRepository();
