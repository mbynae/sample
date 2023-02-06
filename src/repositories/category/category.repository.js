import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class CategoryRepository {

	STATIC_URL = "/category";

	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getCategories(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상세조회
	 * @param id
	 * @returns {Promise<*>}
	 */
	getCategory(id){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "GET" });
	}

	/**
	 * 등록
	 * @param registerCategoryRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	saveCategory(registerCategoryRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerCategoryRequest), isUser });
	}

	/**
	 * 수정
	 * @param userId
	 * @param updateCategoryRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	updateCategory(userId, updateCategoryRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + userId);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateCategoryRequest), isUser });
	}

	/**
	 * 삭제
	 * @param id
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	removeCategory(id, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

}

export default new CategoryRepository();
