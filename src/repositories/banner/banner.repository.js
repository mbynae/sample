import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class BannerRepository {

	STATIC_URL = "/api/v1/banner/";

	/**
	 * 배너목록 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getBannerList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "findbannerlist");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 배너 상세조회
	 * @param evntNumb
	 * @returns {Promise<*>}
	 */
	getBannerDetail(evntNumb, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "findbannerdetail/" + evntNumb);
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 배너등록
	 * @param updateBannerRequest
	 * @returns {Promise<*>}
	 */
	createBanner(createBannerRequest, imageFile, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "createbanner");
		const formData = new FormData();
		formData.append("bannerData", JSON.stringify(createBannerRequest));
		formData.append("bannerimg", imageFile);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true, isUser});
	}

	/**
	 * 배너수정
	 * @param updateBannerRequest
	 * @returns {Promise<*>}
	 */
	updateBanner(evntNumb, imageFile, updateBannerRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "updatebanner/" + evntNumb);
		const formData = new FormData();
		formData.append("bannerData", JSON.stringify(updateBannerRequest));
		formData.append("bannerimg", imageFile);
		return apiHelper.request({ url, method: "PATCH", body: formData, contentTypeFalse: true, isUser});
	}

	/**
	 * 배너삭제
	 * @param evntNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	deleteBanner(evntNumb, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "deletebanner/" + evntNumb);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

	/**
	 * 배너 이미지 목록 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getBannerImageList(aptId, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "viewer/cmpx/" + aptId);
		return apiHelper.request({ url, method: "GET", isUser });
	}
}

export default new BannerRepository();
