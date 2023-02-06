import { constants } from "../../commons";
import { apiHelper } from "../../helpers";

class ImageUploadRepository {
	
	STATIC_URL = "/s3Transfer";
	
	uploadFile(file, isUser=false){
		let url = new URL(constants.API_BASE_URL + this.STATIC_URL);
		const formData = new FormData();
		formData.append("file", file);
		return apiHelper.request({ url, method: "POST", body: formData, contentTypeFalse: true, isUser });
	};
	
}

export default new ImageUploadRepository();
