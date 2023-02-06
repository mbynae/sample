import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

import { accountRepository } from "../repositories";
import { constants }         from "../commons";
import { AccountTypeKind }   from "../enums";
import moment                from "moment";



class SignInStore {

	@persist @observable authenticated = "";
	@persist("object") @observable currentUser = {};
	@persist @observable isAdmin = false;
	@persist @observable aptId = "";

	constructor(){
		let firstAutorun = true;

		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("SignInStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.authenticated = temp.authenticated;
					this.currentUser = temp.currentUser;
					this.isAdmin = temp.isAdmin;
					this.aptId = temp.aptId;
				}
				firstAutorun = false;
			}
		});
	}

	@action setInitialStore = (authenticated, currentUser, isAdmin, aptId) => {
		this.authenticated = authenticated;
		this.currentUser = currentUser;
		this.isAdmin = isAdmin;
		this.aptId = aptId;
	};

	@action setAuthenticated = (authenticated) => {
		this.authenticated = authenticated;
	};

	@action setCurrentUser = (currentUser) => {
		this.currentUser = currentUser;
	};

	@action setIsAdmin = (isAdmin) => {
		this.isAdmin = isAdmin;
	};

	@action setAptId = (aptId) => {
		this.aptId = aptId;
	};

	@action login = async (loginRequest) => {
		let result = await accountRepository.login(loginRequest);
		if ( result.accessToken ) {
			localStorage.setItem(constants.ACCESS_TOKEN, result.accessToken);
			this.setAuthenticated(true);
			this.setIsAdmin(loginRequest.accountTypeKind === AccountTypeKind.MANAGEMENT_OFFICE_MANAGER);
			// 토큰 만료시간 추가
			const accessTokenExpiration = moment().add(12, 'hours').format('YYYY-MM-DD HH:mm:ss');
			localStorage.setItem('accessTokenExpiration', accessTokenExpiration);

		}
		return result;
	};

	@action updateUserInfo = async () => {
		this.currentUser = await accountRepository.userMe();
		this.setAuthenticated(true);
		return this.currentUser;
	};

	@action logout = async () => {
		this.authenticated = false;
		this.currentUser = {};

		//accessToken 초기화
		//localStorage.removeItem(constants.ACCESS_TOKEN);
		//localStorage.removeItem('accessTokenExpiration');
		localStorage.setItem("access_token","");
		//history.push(`/${rootMatch.params.aptComplexId}/admin/sign-in`);

		// localStorage.clear();
	};
}

export default new SignInStore();
