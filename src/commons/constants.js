// const LOCAL_ADDRESS = "http://10.23.100.101:8080";
// const LOCAL_ADDRESS = "http://localhost:8080";
const LOCAL_ADDRESS = "http://aptmoa.urbanlt.xyz:13080";


const API_BASE_URL =
	process.env.REACT_APP_MODE === "production"
		? "https://aptmoa.urbanlt.co.kr"
		: process.env.REACT_APP_MODE === "dev"
		? "https://aptmoa.urbanlt.xyz"
		: process.env.REACT_APP_MODE === "local" && LOCAL_ADDRESS;
const WEB_BASE_URL =
	process.env.REACT_APP_MODE === "production"
		? "https://aptmoa.urbanlt.co.kr"
		: process.env.REACT_APP_MODE === "dev"
		? "https://aptmoa.urbanlt.xyz"
		: process.env.REACT_APP_MODE === "local" && "http://localhost:3001";
const ACCESS_TOKEN = "accessToken";
const USER_ACCESS_TOKEN = "userAccessToken";
const PRE_CHECK_ACCESS_TOKEN = "preCheckAccessToken";
const NAVER_MAP_API_KEY = "9h6e1qk8t1";
const PRECHECK_REPORT_TYPE = {
	LIVING_ROOM: "거실",
	ROOM: "방",
	KITCHEN: "주방",
	MAIN_DOOR: "현관문",
	VERANDA: "베란다",
	BATHROOM: "욕실",
	ETC: "기타",
};

export default {
	API_BASE_URL,
	WEB_BASE_URL,
	ACCESS_TOKEN,
	USER_ACCESS_TOKEN,
	PRE_CHECK_ACCESS_TOKEN,
	NAVER_MAP_API_KEY,
	PRECHECK_REPORT_TYPE,
};
