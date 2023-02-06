import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class FacilityCategoryRepository {

	STATIC_URL = "/api/v1/mngr/fcltcategory/";

	/**
	 * 시설/수강 카테고리 목록 조회
	 * @param fcltNumb
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getCategoryList(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "list");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 시설/수강 카테고리 상세조회
	 * @param fcltCode
	 * @param fcltNumb
	 * @param prgmNumb
	 * @returns {Promise<*>}
	 */
	getCategoryDetail(fcltCode, fcltNumb, prgmNumb, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "detail/" + fcltCode + "/" + fcltNumb + "/" + prgmNumb);
		return apiHelper.request({ url, method: "GET", isUser});
	}

	/**
	 * 시설/수강 카테고리 등록
	 * @param fcltCode
	 * @param fcltNumb
	 * @param createCategoryRequest
	 * @returns {Promise<*>}
	 */
	createCategory(fcltCode, fcltNumb, createCategoryRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "update/" + fcltCode + "/" + fcltNumb);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(createCategoryRequest), isUser});
	}

	/**
	 * 시설/수강 카테고리 수정
	 * @param fcltCode
	 * @param fcltNumb
	 * @param prgmNumb
	 * @param updateCategoryRequest
	 * @returns {Promise<*>}
	 */
	updateCategory(fcltCode, fcltNumb, prgmNumb, updateCategoryRequest, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "update/" + fcltCode + "/" + fcltNumb + "/" + prgmNumb);
		return apiHelper.request({ url, method: "PATCH", body: JSON.stringify(updateCategoryRequest), isUser});
	}

	/**
	 * 시설/수강 상품유형 목록 조회
	 * @param searchKey
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getPrgmTypeList(searchKey, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/api/v1/grcd/select/" + searchKey);
		return apiHelper.request({ url, method: "GET", isUser });
	}
}

export default new FacilityCategoryRepository();
