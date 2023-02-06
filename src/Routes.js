import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import {
	PublicRouteWithLayout,
	PrivateRouteWithLayout,
	UserPublicRouteWithLayout,
	UserPrivateRouteWithLayout,
	PreCheckUserPublicRouteWithLayout,
	PreCheckUserPrivateRouteWithLayout,
} from "./components";
import {
	AdminViewMainLayout,
	AdminViewMinimalLayout,
	UserViewMainLayout,
	UserViewMinimalLayout,
	PreCheckViewMinimalLayout,
} from "./layouts";

import {
	NotFound as NotFoundView,
	AdminViewSignIn,
	AdminViewDashboard,
	AdminViewArticles,
	AdminViewArticleEdit,
	AdminViewArticleDetail,
	AdminViewIntroductionDetail,
	AdminViewIntroductionEdit,
	AdminViewCallBooks,
	AdminViewCallBookEdit,
	AdminViewCallBookDetail,
	AdminViewAutonomousOrganizations,
	AdminViewAutonomousOrganizationEdit,
	AdminViewAutonomousOrganizationDetail,
	AdminViewUserMgnts,
	AdminViewUserMgntDetail,
	AdminViewUserMgntEdit,
	AdminViewContracts,
	AdminViewContractEdit,
	AdminViewContractDetail,
	AdminViewMaintenances,
	AdminViewMaintenanceEdit,
	AdminViewMaintenanceDetail,
	AdminViewEmployeeMgnts,
	AdminViewEmployeeMgntEdit,
	AdminViewEmployeeMgntDetail,
	AdminViewDocumentForms,
	AdminViewDocumentFormEdit,
	AdminViewDocumentFormDetail,
	AdminViewSendSMSs,
	AdminViewSendSMSEdit,
	AdminViewMenuMgntDetail,
	AdminViewMenuMgntEdit,
	AdminViewMainContentDetail,
	AdminViewMainContentEdit,
	AdminViewMyPage,
	AdminViewManagementFees,
	AdminViewManagementFeeEdit,
	AdminViewManagementFeeDetail,
	UserViewDashboard,
	UserViewSignIn,
	UserViewSignUp,
	UserViewFindIdPassword,
	UserViewMyPage,
	UserViewArticles,
	UserViewArticleEdit,
	UserViewArticleDetail,
	UserViewCallBooks,
	UserViewIntroductions,
	UserViewAutonomousOrganizations,
	// 2차
	AdminViewVisitingCars,
	AdminViewVisitingCarEdit,
	AdminViewVisitingCarDetail,
	UserViewVisitingCars,
	UserViewVisitingCarEdit,
	UserViewVisitingCarDetail,
	PreCheckViewSignIn,
	PreCheckDetails,
	PreCheckDetailEdit,
	PreCheckDetail,
	AdminViewPreCheckDetails,
	AdminViewPreCheckDetail,
	AdminViewResidentReservations,
	UserViewResidentReservation,
	UserViewMoveReservation,
	AdminViewMoveReservations,
	AdminViewMoveReservationEdit,
	AdminViewMoveReservationDetail,
	AdminViewResidentReservationDetail,
	AdminViewFacilityReservations,
	AdminViewResrvHist,
	AdminViewUsageHist,
	AdminViewResrvModifyHist,
	AdminViewTutorMgnt,
	AdminViewPrgmMgnt,
	AdminViewPrgmMgntEdit,
	UserViewFacilityReservation,
	AdminViewResrvMgnt,
	AdminViewUserMgntsRegister,
	UserViewFacilityIntroduction,
	AdminViewFacilityMgnt,
	AdminViewFacilityMgntEdit,
	AdminViewCategoryMgnt,
	AdminViewSalesMgnt,
	AdminViewCommonSettings,
	AdminViewBannerMgnt,
	AdminViewBannerMgntEdit,
	AdminViewPosMgnt,
	AdminViewPreferencesMgnt,
	AdminViewStatistics,
	AdminViewParkingCarMgnt,
	AdminViewParkingCarMgntDetail,
	AdminViewParkingCarMgntEdit,
	AdminViewScheduleMgnt,
	UserViewScheduleMgnt,
} from "./views";
import { ThemeProvider } from "@material-ui/styles";
import { adminTheme, userTheme } from "./theme";

const UserRoute = ({ match }) => {
	return (
		<ThemeProvider theme={userTheme}>
			<Switch>
				console.log("match.url : " + `${match.url}/`)
				<Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
				<UserPublicRouteWithLayout
					component={UserViewDashboard}
					exact
					layout={UserViewMainLayout}
					path={`${match.url}/dashboard`}
				/>
				{/*마이페이지*/}
				<UserPrivateRouteWithLayout
					component={UserViewMyPage}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/myPage/:id/:reserveMenu`}
				/>
				{/*게시글 목록*/}
				<UserPublicRouteWithLayout
					component={UserViewArticles}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/articles/:menuKey`}
				/>
				{/*게시글 등록 */}
				<UserPrivateRouteWithLayout
					component={UserViewArticleEdit}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/articles/:menuKey/edit`}
				/>
				{/*게시글 수정 */}
				<UserPrivateRouteWithLayout
					component={UserViewArticleEdit}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/articles/:menuKey/edit/:id`}
				/>
				{/*게시글 상세 */}
				<UserPublicRouteWithLayout
					component={UserViewArticleDetail}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/articles/:menuKey/:id`}
				/>
				{/*아파트소개*/}
				<UserPublicRouteWithLayout
					component={UserViewIntroductions}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/introduction/:menuKey`}
				/>
				{/*자치기구소개*/}
				<UserPublicRouteWithLayout
					component={UserViewAutonomousOrganizations}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/autonomousOrganization/:id`}
				/>
				{/*전호번호부 목록*/}
				<UserPublicRouteWithLayout
					component={UserViewCallBooks}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/callBook`}
				/>
				{/*방문차량예약 목록*/}
				<UserPrivateRouteWithLayout
					component={UserViewVisitingCars}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/visitingCar`}
				/>
				{/*방문차량예약 등록*/}
				<UserPrivateRouteWithLayout
					component={UserViewVisitingCarEdit}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/visitingCar/edit`}
				/>
				{/*방문차량예약 수정*/}
				<UserPrivateRouteWithLayout
					component={UserViewVisitingCarEdit}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/visitingCar/edit/:id`}
				/>
				{/*방문차량예약 상세*/}
				<UserPrivateRouteWithLayout
					component={UserViewVisitingCarDetail}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/visitingCar/:id`}
				/>
				{/*입주예약*/}
				<UserPrivateRouteWithLayout
					component={UserViewResidentReservation}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/residentReservation`}
				/>
				{/*이사예약*/}
				<UserPrivateRouteWithLayout
					component={UserViewMoveReservation}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/moveReservation`}
				/>
				{/* 커뮤니티 시설예약 */}
				<UserPrivateRouteWithLayout
					component={UserViewFacilityReservation}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/facilityReservation`}
				/>
				{/*예약하기*/}
				<UserPrivateRouteWithLayout
					component={UserViewFacilityReservation}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/reservation`}
				/>
				{/*시설안내*/}
				<UserPublicRouteWithLayout
					component={UserViewFacilityIntroduction}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/facilityIntroduction/:id`}
				/>
				{/* 아파트 일정 */}
				<UserPublicRouteWithLayout
					component={UserViewScheduleMgnt}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/scheduleMgnt`}
				/>
				<UserPublicRouteWithLayout
					component={UserViewSignIn}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/sign-in`}
				/>
				<UserPublicRouteWithLayout
					component={UserViewFindIdPassword}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/findIdPassword`}
				/>
				<UserPublicRouteWithLayout
					component={UserViewSignUp}
					exact
					rootMatch={match}
					layout={UserViewMainLayout}
					path={`${match.url}/sign-up`}
				/>
				<UserPublicRouteWithLayout
					component={NotFoundView}
					exact
					layout={UserViewMinimalLayout}
					path={`${match.url}/not-found`}
				/>
				<Redirect to={`${match.url}/not-found`} />
			</Switch>
		</ThemeProvider>
	);
};

const AdminRoute = ({ match }) => {
	return (
		<ThemeProvider theme={adminTheme}>
			<Switch>
				<Redirect exact from={`${match.url}/`} to={`${match.url}/sign-in`} />

				{/*메인*/}
				<PrivateRouteWithLayout
					component={AdminViewDashboard}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/dashboard`}
				/>

				{/*게시글 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewArticles}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/articles/:menuKey`}
				/>
				{/*게시글 등록 */}
				<PrivateRouteWithLayout
					component={AdminViewArticleEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/articles/:menuKey/edit`}
				/>
				{/*게시글 수정 */}
				<PrivateRouteWithLayout
					component={AdminViewArticleEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/articles/:menuKey/edit/:id`}
				/>
				{/*게시글 상세 */}
				<PrivateRouteWithLayout
					component={AdminViewArticleDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/articles/:menuKey/:id`}
				/>

				{/*소개글 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewIntroductionEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/introduction/:menuKey/edit`}
				/>
				{/*소개글 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewIntroductionDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/introduction/:menuKey`}
				/>

				{/*전호번호부 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewCallBooks}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/callBook`}
				/>
				{/*전호번호부 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewCallBookEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/callBook/edit`}
				/>
				{/*전호번호부 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewCallBookEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/callBook/edit/:id`}
				/>
				{/*전호번호부 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewCallBookDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/callBook/:id`}
				/>

				{/*자치기구관리 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewAutonomousOrganizations}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/autonomousOrganizations`}
				/>
				{/*자치기구관리 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewAutonomousOrganizationEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/autonomousOrganizations/edit`}
				/>
				{/*자치기구관리 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewAutonomousOrganizationEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/autonomousOrganizations/edit/:id`}
				/>
				{/*자치기구관리 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewAutonomousOrganizationDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/autonomousOrganizations/:id`}
				/>

				{/*입주민관리 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewUserMgnts}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/userMgnt`}
				/>
				{/* 입주민관리 신규생성 */}
				<PrivateRouteWithLayout
					component={AdminViewUserMgntsRegister}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/userMgnt/register`}
				/>
				{/*입주민관리 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewUserMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/userMgnt/edit/:id`}
				/>
				{/*입주민관리 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewUserMgntDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/userMgnt/:id`}
				/>

				{/*계약 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewContracts}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/contract`}
				/>
				{/*계약 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewContractEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/contract/edit/`}
				/>
				{/*계약 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewContractEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/contract/edit/:id`}
				/>
				{/*계약 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewContractDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/contract/:id`}
				/>

				{/*유지보수 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewMaintenances}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/maintenance`}
				/>
				{/*유지보수 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewMaintenanceEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/maintenance/edit/`}
				/>
				{/*유지보수 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewMaintenanceEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/maintenance/edit/:id`}
				/>
				{/*유지보수 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewMaintenanceDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/maintenance/:id`}
				/>

				{/*직원관리 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewEmployeeMgnts}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/employeeMgnt`}
				/>
				{/*직원관리 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewEmployeeMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/employeeMgnt/edit/`}
				/>
				{/*직원관리 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewEmployeeMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/employeeMgnt/edit/:id`}
				/>
				{/*직원관리 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewEmployeeMgntDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/employeeMgnt/:id`}
				/>

				{/*문서양식 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewDocumentForms}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/documentForm`}
				/>
				{/*문서양식 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewDocumentFormEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/documentForm/edit/`}
				/>
				{/*문서양식 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewDocumentFormEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/documentForm/edit/:id`}
				/>
				{/*문서양식 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewDocumentFormDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/documentForm/:id`}
				/>

				{/*문자발송 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewSendSMSs}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/sendSMS`}
				/>
				{/*문자발송 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewSendSMSEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/sendSMS/edit/`}
				/>
				{/*/!*문자발송 수정*!/*/}
				{/*<PrivateRouteWithLayout component={AdminViewSendSMSEdit} exact isAdmin rootMatch={match} layout={AdminViewMainLayout} path={`${match.url}/documentForm/edit/:id`} />*/}
				{/*/!*문자발송 상세*!/*/}
				{/*<PrivateRouteWithLayout component={AdminViewSendSMSDetail} exact isAdmin rootMatch={match} layout={AdminViewMainLayout} path={`${match.url}/documentForm/:id`} />*/}

				{/*메뉴관리 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewMenuMgntDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/menuMgnt`}
				/>
				{/*메뉴관리 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewMenuMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/menuMgnt/edit/`}
				/>

				{/*메인컨텐츠 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewMainContentDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/mainContent`}
				/>
				{/*메인컨텐츠 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewMainContentEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/mainContent/edit/`}
				/>

				{/*마이페이지 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewMyPage}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/myPage`}
				/>
				{/*/!*메인컨텐츠 수정*!/*/}
				{/*<PrivateRouteWithLayout component={AdminViewMainContentEdit} exact isAdmin rootMatch={match} layout={AdminViewMainLayout} path={`${match.url}/mainContent/edit/`} />*/}

				{/*관리비 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewManagementFees}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/managementFee`}
				/>
				{/*관리비 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewManagementFeeEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/managementFee/edit/`}
				/>
				{/*관리비 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewManagementFeeEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/managementFee/edit/:id`}
				/>
				{/*관리비 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewManagementFeeDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/managementFee/:id`}
				/>

				{/*방문차량예약 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewVisitingCars}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/visitingCar`}
				/>
				{/*방문차량예약 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewVisitingCarEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/visitingCar/edit`}
				/>
				{/*방문차량예약 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewVisitingCarEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/visitingCar/edit/:id`}
				/>
				{/*/!*방문차량예약 상세*!/*/}
				<PrivateRouteWithLayout
					component={AdminViewVisitingCarDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/visitingCar/:id`}
				/>

				{/*이사예약 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewMoveReservations}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/moveReservation`}
				/>
				{/*이사예약 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewMoveReservationEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/moveReservation/edit`}
				/>
				{/*이사예약 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewMoveReservationEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/moveReservation/edit/:id`}
				/>
				{/*이사예약 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewMoveReservationDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/moveReservation/:id`}
				/>

				{/*사전점검 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewPreCheckDetails}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/preCheck`}
				/>
				{/*사전점검 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewPreCheckDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/preCheck/:id`}
				/>

				{/*입주예약 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewResidentReservations}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/residentReservation`}
				/>
				{/*입주예약 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewResidentReservationDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/residentReservation/:id`}
				/>

				{/*시설예약 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewFacilityReservations}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/facilityReservation`}
				/>

				<PrivateRouteWithLayout
					component={AdminViewResrvMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/reservation`}
				/>
				{/* 예약내역 */}
				<PrivateRouteWithLayout
					component={AdminViewResrvHist}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/resrvHist`}
				/>
				{/*이용내역 */}
				<PrivateRouteWithLayout
					component={AdminViewUsageHist}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/usageHist`}
				/>
				{/* 취소/변경내역 */}
				<PrivateRouteWithLayout
					component={AdminViewResrvModifyHist}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/modifyHist`}
				/>

				{/* 강사관리 */}
				<PrivateRouteWithLayout
					component={AdminViewTutorMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/tutorMgnt`}
				/>

				{/* 상품관리 */}
				<PrivateRouteWithLayout
					component={AdminViewPrgmMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/prgmMgnt`}
				/>
				{/* 상품등록 */}
				<PrivateRouteWithLayout
					component={AdminViewPrgmMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/prgmMgnt/edit`}
				/>
				{/* 상품수정 */}
				<PrivateRouteWithLayout
					component={AdminViewPrgmMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/prgmMgnt/edit/:prgmNumb`}
				/>

				{/* 시설안내관리 */}
				<PrivateRouteWithLayout
					component={AdminViewFacilityMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/facilityMgnt`}
				/>
				<PrivateRouteWithLayout
					component={AdminViewFacilityMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/facilityMgnt/:type`}
				/>

				{/* 카테고리관리 */}
				<PrivateRouteWithLayout
					component={AdminViewCategoryMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/categoryMgnt`}
				/>

				{/* 서비스운영관리 */}
				{/* 매출관리 */}
				<PrivateRouteWithLayout
					component={AdminViewSalesMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/salesMgnt`}
				/>
				{/* 현황통계 */}
				<PrivateRouteWithLayout
					component={AdminViewStatistics}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/statistics`}
				/>
				{/* 배너관리 */}
				<PrivateRouteWithLayout
					component={AdminViewBannerMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/bannerMgnt`}
				/>
				{/* 배너등록 */}
				<PrivateRouteWithLayout
					component={AdminViewBannerMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/bannerMgnt/edit`}
				/>
				{/* 배너수정 */}
				<PrivateRouteWithLayout
					component={AdminViewBannerMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/bannerMgnt/edit/:evnt_numb`}
				/>

				{/* 설정/관리 */}
				<PrivateRouteWithLayout
					component={AdminViewCommonSettings}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/commonSettings`}
				/>
				<PrivateRouteWithLayout
					component={AdminViewPosMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/posMgnt`}
				/>
				<PrivateRouteWithLayout
					component={AdminViewPreferencesMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/preferencesMgnt`}
				/>
				<PrivateRouteWithLayout
					component={AdminViewScheduleMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/scheduleMgnt`}
				/>

				{/*주차차량관리 목록*/}
				<PrivateRouteWithLayout
					component={AdminViewParkingCarMgnt}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/parkingCarMgnt`}
				/>
				{/*주차차량관리 수정*/}
				<PrivateRouteWithLayout
					component={AdminViewParkingCarMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/parkingCarMgnt/edit/:id`}
				/>
				{/*주차차량관리 등록*/}
				<PrivateRouteWithLayout
					component={AdminViewParkingCarMgntEdit}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/parkingCarMgnt/edit`}
				/>
				{/*주차차량관리 상세*/}
				<PrivateRouteWithLayout
					component={AdminViewParkingCarMgntDetail}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMainLayout}
					path={`${match.url}/parkingCarMgnt/:id`}
				/>

				<PublicRouteWithLayout
					component={AdminViewSignIn}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMinimalLayout}
					path={`${match.url}/sign-in`}
				/>
				<PublicRouteWithLayout
					component={NotFoundView}
					exact
					isAdmin
					rootMatch={match}
					layout={AdminViewMinimalLayout}
					path={`${match.url}/not-found`}
				/>
				<Redirect to={`${match.url}/not-found`} />
			</Switch>
		</ThemeProvider>
	);
};

const PreCheckRoute = ({ match }) => {
	return (
		<ThemeProvider theme={userTheme}>
			<Switch>
				<Redirect exact from={`${match.url}/`} to={`${match.url}/sign-in`} />

				{/*사전점검 목록*/}
				<PreCheckUserPrivateRouteWithLayout
					component={PreCheckDetails}
					exact
					rootMatch={match}
					layout={PreCheckViewMinimalLayout}
					path={`${match.url}/preCheck`}
				/>
				{/*사전점검 등록*/}
				<PreCheckUserPrivateRouteWithLayout
					component={PreCheckDetailEdit}
					exact
					rootMatch={match}
					layout={PreCheckViewMinimalLayout}
					path={`${match.url}/preCheck/edit`}
				/>
				{/*사전점검 상세*/}
				<PreCheckUserPrivateRouteWithLayout
					component={PreCheckDetail}
					exact
					rootMatch={match}
					layout={PreCheckViewMinimalLayout}
					path={`${match.url}/preCheck/detail/:id`}
				/>

				<PreCheckUserPublicRouteWithLayout
					component={PreCheckViewSignIn}
					exact
					rootMatch={match}
					layout={PreCheckViewMinimalLayout}
					path={`${match.url}/sign-in`}
				/>
				<Redirect to={`${match.url}/sign-in`} />
			</Switch>
		</ThemeProvider>
	);
};

const Routes = () => {
	return (
		<Switch>
			{/*메인*/}
			{/*루트 입력 시 urbanlt 홈페이지 이동*/}
			<Route
				exact
				path="/"
				render={() => (window.location = "https://www.urbanlt.co.kr/")}
			/>

			<Route path={"/:aptComplexId/admin"} component={AdminRoute} />
			<Route path={"/:aptComplexId/pre-inspection"} component={PreCheckRoute} />
			<Route path={"/:aptComplexId"} component={UserRoute} />
			<PublicRouteWithLayout
				component={NotFoundView}
				exact
				layout={AdminViewMinimalLayout}
				path={`/all/not-found`}
			/>
			<Redirect to={`/all/not-found`} />
		</Switch>
	);
};

export default Routes;
