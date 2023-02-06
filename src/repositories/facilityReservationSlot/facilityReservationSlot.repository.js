import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class FacilityReservationSlotRepository {
	
	STATIC_URL = "/facilityReservationSlot";
	
	/**
	 * 목록조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	getFacilityReservationSlots(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}
	
}

export default new FacilityReservationSlotRepository();
