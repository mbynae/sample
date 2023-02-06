import { constants } from "../../commons";
import { apiHelper } from "../../helpers";
import queryString from "query-string";

export const apiObject = {
	createNote: ({ aptId, title, content, receiverId }) => {
		const body = {
			aptId: aptId,
			title: title,
			content: content,
			receiverId: receiverId,
		};

		const url = `${constants.API_BASE_URL}/noteSave`;

		return apiHelper.request({
			url,
			method: "POST",
			body: JSON.stringify(body),
			contentTypeFalse: false,
			isUser: true,
		});
	},
	listNote: ({ direction, page, size, sort }) => {
		const path = `/getNoteList`;
		const queryParams = queryString.stringify(
			{
				direction: direction,
				page: page,
				size: size,
				sort: sort,
			},
			{
				skipEmptyString: true,
			}
		);

		const url = `${constants.API_BASE_URL}${path}?${queryParams}`;

		return apiHelper.request({
			url,
			method: "GET",
			contentTypeFalse: false,
			isUser: true,
		});
	},
	deleteNote: ({ id }) => {
		const path = `/noteDelete`;
		const body = {
			id: id,
		};

		const url = `${constants.API_BASE_URL}${path}`;

		return apiHelper.request({
			url,
			method: "DELETE",
			body: JSON.stringify(body),
			contentTypeFalse: false,
			isUser: true,
		});
	},
	getPreCheckInfo(aptId) {
		const path = `/preCheck`;
		const queryParams = queryString.stringify(
			{
				aptId: aptId,
			},
			{
				skipEmptyString: true,
			}
		);

		const url = `${constants.API_BASE_URL}${path}?${queryParams}`;

		return apiHelper.request({
			url,
			method: "GET",
			contentTypeFalse: false,
			isPreCheckUser: true,
		});
	},

	getPreCheckByUserId(preCheckuserId) {
		const path = `/preCheckDetailView/${preCheckuserId}`;
		const url = `${constants.API_BASE_URL}${path}`;

		return apiHelper.request({
			url,
			method: "GET",
			contentTypeFalse: false,
			isPreCheckUser: true,
		});
	},

	deletePreCheck: ({ id }) => {
		const path = `/preCheckDetailView/${id}`;
		// const body = {
		// 	id: id,
		// };

		const url = `${constants.API_BASE_URL}${path}`;

		return apiHelper.request({
			url,
			method: "DELETE",
			contentTypeFalse: false,
			isPreCheckUser: true,
		});
	},

	createPreCheck: (params) => {
		const { aptId, preCheckDate, preCheckStTime } = params;
		const path = `/preCheckDetail`;
		const body = {
			aptId: aptId,
			preCheckDate: preCheckDate,
			preCheckStTime: preCheckStTime,
		};

		const url = `${constants.API_BASE_URL}${path}`;

		return apiHelper.request({
			url,
			method: "POST",
			body: JSON.stringify(body),
			contentTypeFalse: false,
			isPreCheckUser: true,
		});
	},

	getPreCheckOpenTime({ aptId, preCheckDate }) {
		const path = `/preCheckTimeList`;
		const queryParams = queryString.stringify(
			{
				aptId: aptId,
				preCheckDate: preCheckDate,
			},
			{
				skipEmptyString: true,
			}
		);

		const url = `${constants.API_BASE_URL}${path}?${queryParams}`;

		return apiHelper.request({
			url,
			method: "GET",
			contentTypeFalse: false,
			isPreCheckUser: true,
		});
	},

	getPhoneCheckAccessToken({ building, unit, name, phoneNumber, preCheckId }) {
		const path = `/preCheckUser/phoneChkUser`;
		const queryParams = queryString.stringify(
			{
				building: building,
				unit: unit,
				name: name,
				phoneNumber: phoneNumber,
				preCheckId: preCheckId,
			},
			{
				skipEmptyString: true,
			}
		);

		const url = `${constants.API_BASE_URL}${path}?${queryParams}`;

		return apiHelper.request({
			url,
			method: "GET",
			contentTypeFalse: false,
			isPreCheckUser: false,
		});
	},
	createPreCheckUser: (params) => {
		const {
			building,
			unit,
			name,
			phoneNumber,
			certificationNumber,
			preCheckId,
		} = params;
		const path = `/preCheckUser/login`;

		const body = {
			building: building,
			unit: unit,
			name: name,
			phoneNumber: phoneNumber,
			certificationNumber: certificationNumber,
			preCheckId: preCheckId,
		};

		const url = `${constants.API_BASE_URL}${path}`;

		return apiHelper.request({
			url,
			method: "POST",
			body: JSON.stringify(body),
			contentTypeFalse: false,
			isPreCheckUser: false,
		});
	},
};
