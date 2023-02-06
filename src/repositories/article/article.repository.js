import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ArticleRepository {

	STATIC_URL = "/article";

	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getArticles(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 상세조회
	 * @param id
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getArticle(id, params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 등록
	 * @param registerArticleRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	saveArticle(registerArticleRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = this.generateFormData(registerArticleRequest);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true, isUser });
	}

	generateFormData(request){
		const formData = new FormData();
		formData.append("articleRequest", JSON.stringify(request));
		for ( let x = 0; x < request.files.length; x++ ) {
			formData.append("files", request.files[x]);
		}
		return formData;
	}

	/**
	 * 수정
	 * @param articleId
	 * @param updateArticleRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	updateArticle(articleId, updateArticleRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + articleId);
		const formData = this.generateFormData(updateArticleRequest);
		return apiHelper.request({ url, method: "PUT", body: formData, contentTypeFalse: true, isUser });
	}

	/**
	 * 삭제
	 * @param articleId
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	removeArticle(articleId, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + articleId);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}

	/**
	 * 내가 쓴 글 목록 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	findMyArticles(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/myPage/articles");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
}

export default new ArticleRepository();
