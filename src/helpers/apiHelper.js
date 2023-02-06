import { constants } from "../commons";

const request = (options) => {
	let headers = {};
	if (!options.contentTypeFalse) {
		headers = {
			...headers,
			"Content-Type": "application/json; charset=UTF-8",
		};
	}
	let accessToken = undefined;

	if (
		options.isPreCheckUser &&
		localStorage.getItem(constants.PRE_CHECK_ACCESS_TOKEN) != null
	) {
		accessToken = localStorage.getItem(constants.PRE_CHECK_ACCESS_TOKEN);
	} else if (
		!options.isUser &&
		localStorage.getItem(constants.ACCESS_TOKEN) != null
	) {
		accessToken = localStorage.getItem(constants.ACCESS_TOKEN);
	} else if (
		(options.isUser &&
			localStorage.getItem(constants.USER_ACCESS_TOKEN) != null) ||
		localStorage.getItem(constants.USER_ACCESS_TOKEN) != null
	) {
		accessToken = localStorage.getItem(constants.USER_ACCESS_TOKEN);
	}
	if (accessToken) {
		headers = {
			...headers,
			Authorization: "Bearer " + accessToken,
		};
	}

	const defaults = { headers: headers };
	options = Object.assign({}, defaults, options);

	let signInStore = {};

	const setSignInStore = async () => {
		let json = undefined;
		if (options.isPreCheckUser) {
			json = await localStorage.getItem("PreCheckSignInStore");
		} else {
			json = options.isUser
				? await localStorage.getItem("UserSignInStore")
				: await localStorage.getItem("SignInStore");
		}
		if (json != null) {
			signInStore = JSON.parse(json);
		}
	};

	return fetch(options.url, options).then(async (response) => {
		await setSignInStore();
		if (response.status === 401) {
			if (options.isPreCheckUser) {
				localStorage.removeItem(constants.PRE_CHECK_ACCESS_TOKEN);
			} else {
				options.isUser
					? localStorage.removeItem(constants.USER_ACCESS_TOKEN)
					: localStorage.removeItem(constants.ACCESS_TOKEN);
			}
			if (!options.url.href.includes("/auth/login")) {
				if (options.isPreCheckUser) {
					window.location.href = `${constants.WEB_BASE_URL}/${signInStore.aptId}/pre-inspection/sign-in`;
				} else {
					window.location.href = `${constants.WEB_BASE_URL}/${
						signInStore.aptId
					}${options.isUser ? "" : "/admin"}/sign-in`;
				}
			}
		} else {
			let res = await response.json();
			if (!response.ok) {
				return Promise.reject(res);
			}
			return res;
		}
	});
};

export default {
	request,
};
