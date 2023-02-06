import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class CommonCodeRepository {

	STATIC_URL = "/api/v1/grcd/"

	/**
	 * 공통코드 조회
	 * @param grpCode
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getGrpCode(grpCode, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL + "select/" + grpCode);
		return apiHelper.request({ url, method: "GET", isUser });
	}

}

export default new CommonCodeRepository();
