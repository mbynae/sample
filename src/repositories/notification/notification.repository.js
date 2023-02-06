import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class NotificationRepository {
	
	STATIC_URL = "/notification";
	
	/**
	 * 목록조회
	 * @returns {Promise<*>}
	 */
	getNotifications(isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
	/**
	 * 수정
	 * @returns {Promise<*>}
	 * @param id
	 * @param isUser
	 */
	updateNotification(id, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "/" + id);
		return apiHelper.request({ url, method: "POST", isUser });
	}
	
}

export default new NotificationRepository();
