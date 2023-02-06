import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

import { preCheckUserRepository } from "../repositories";
import { constants }              from "../commons";

class PreCheckSignInStore {
	
	@persist @observable authenticated = "";
	@persist("object") @observable currentUser = {};
	@persist @observable isAdmin = false;
	@persist @observable aptId = "";
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("PreCheckSignInStore");
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
		let result = await preCheckUserRepository.login(loginRequest, true);
		if ( result.accessToken ) {
			localStorage.setItem(constants.PRE_CHECK_ACCESS_TOKEN, result.accessToken);
			this.setAuthenticated(true);
			this.setIsAdmin(false);
		}
		return result;
	};
	
	@action updateUserInfo = async () => {
		this.currentUser = await preCheckUserRepository.userMe(true);
		this.setAuthenticated(true);
		return this.currentUser;
	};
	
	@action logout = async () => {
		this.authenticated = false;
		this.currentUser = {};
		localStorage.removeItem(constants.PRE_CHECK_ACCESS_TOKEN);
		// localStorage.clear();
	};
}

export default new PreCheckSignInStore();
