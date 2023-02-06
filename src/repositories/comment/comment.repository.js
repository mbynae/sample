import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class CommentRepository {
	
	STATIC_URL = "/comment";
	
	/**
	 * 목록조회
	 * @param params
	 * @returns {Promise<*>}
	 */
	getComments(params){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 상세조회
	 * @param commentId
	 * @returns {Promise<*>}
	 */
	getComment(commentId){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + commentId);
		return apiHelper.request({ url, method: "GET" });
	}
	
	/**
	 * 등록
	 * @param registerCommentRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	saveComment(registerCommentRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(registerCommentRequest), isUser });
	}
	
	/**
	 * 수정
	 * @param commentId
	 * @param updateCommentRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	updateComment(commentId, updateCommentRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + commentId);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateCommentRequest), isUser });
	}
	
	/**
	 * 삭제
	 * @param commentId
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	removeComment(commentId, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + commentId);
		return apiHelper.request({ url, method: "DELETE", isUser });
	}
	
}

export default new CommentRepository();
