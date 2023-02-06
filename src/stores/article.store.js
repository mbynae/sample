import { action, autorun, observable } from "mobx";
import { persist }                     from "mobx-persist";

class ArticleStore {
	
	@persist("object") @observable articleSearch = {};
	@persist("object") @observable pageInfo = {
		page:  0,
		size:  10,
		total: 10
	};
	
	constructor(){
		let firstAutorun = true;
		
		autorun(async () => {
			if ( firstAutorun ) {
				const json = await localStorage.getItem("ArticleStore");
				if ( json != null ) {
					let temp = JSON.parse(json);
					this.articleSearch = temp.articleSearch;
					this.pageInfo = temp.pageInfo;
				}
				firstAutorun = false;
			}
		});
	}
	
	@action
	setArticleSearch = (boardSearch) => {
		this.articleSearch = boardSearch;
	};
	
	@action
	setPageInfo = (pageInfo) => {
		this.pageInfo = pageInfo;
	};
}

export default new ArticleStore();
