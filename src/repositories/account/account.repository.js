import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class AccountRepository {

	/**
	 * 로그인
	 * @param loginRequest
	 * @param isUser
	 * @returns {Promise<*>}
	 */
	login(loginRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/auth/login");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(loginRequest), isUser });
	}

	/**
	 * 회원정보 정보
	 * @returns {Promise<*>}
	 */
	userMe(isUser = false){
		let url = new URL(constants.API_BASE_URL + "/user/me");
		// url.search = new URLSearchParams().toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 아이디 중복검사
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	checkUserId(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/auth/checkId");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 닉네임 중복검사
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	checkNickname(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/auth/checkNickName");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 회원가입
	 * @param signUpRequest
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	signUp(signUpRequest, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/auth/signup");
		return apiHelper.request({ url, method: "POST", body: JSON.stringify(signUpRequest), isUser });
	}

	/**
	 * 아이디 찾기
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	findId(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/auth/findId");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 비밀번호 찾기
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	findPassword(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/auth/findPassword");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 회원정보 수정
	 * @param id
	 * @param updateUserRequest
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	updateUser(id, updateUserRequest, isUser){
		let url = new URL(constants.API_BASE_URL + `/user/normal/${id}`);
		return apiHelper.request({ url, method: "PUT", body: JSON.stringify(updateUserRequest), isUser });
	}

	/**
	 * 내 관리비 조회
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	findMyManagementFee(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/myPage/managementFee");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 인증번호 발송
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	getCertificationNumber(params, isUser = false){
		let url = new URL(constants.API_BASE_URL + "/auth/certificationNumber");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 입주민 유저 체크 (일괄 회원가입)
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	checkUserBatchUpload(params, isUser){
		let url = new URL(constants.API_BASE_URL + "/api/v1/mngr/gnrl/join/gnrlcheck");
		url.search = new URLSearchParams(params).toString();
		return apiHelper.request({ url, method: "GET", isUser });
	}

	/**
	 * 입주민 유저 일괄 회원가입)
	 * @param params
	 * @param isUser
	 * @returns {Promise<* | undefined>}
	 */
	addUserBatchUpload(params, isUser){
		let url = new URL(constants.API_BASE_URL + `/api/v1/mngr/gnrl/join/gnrlapprove`);
		return apiHelper.request({ url, method: "PUT", body: params, isUser });
	}
}

export default new AccountRepository();
