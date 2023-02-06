import { create } from "mobx-persist";

import SignInStore from "./signin.store";
import UserSignInStore from "./userSignin.store";
import ArticleStore from "./article.store";
import AptComplexStore from "./aptComplex.store";
import UserAptComplexStore from "./userAptComplex.store";
import CallBookStore from "./callBook.store";
import AutonomousOrganizationStore from "./autonomousOrganization.store";
import UserMgntStore from "./userMgnt.store";
import ContractStore from "./contract.store";
import MaintenanceStore from "./maintenance.store";
import EmployeeMgntStore from "./employeeMgnt.store";
import DocumentFormStore from "./documentForm.store";
import SendSMSStore from "./sendSMS.store";
import ManagementFeeStore from "./managementFee.store";
import VisitingCarStore from "./visitingCar.store";
import PreCheckSignInStore from "./preCheckSignin.store";
import PreCheckDetailStore from "./preCheckDetail.store";
import ResidentReservationStore from "./residentReservation.store";
import FacilityReservationStore from "./facilityReservation.store";
import ResrvHistStore from "./resrvHist.store";
import ParkingCarMgntStore from "./parkingCarMgnt.store";
import MoveReservationStore from "./moveReservation.store";
import PreCheckReportStore from "./preCheckReport.store";

const hydrate = create({
	storage: localStorage,
	jsonify: true,
});

hydrate("SignInStore", SignInStore);
hydrate("UserSignInStore", UserSignInStore);
hydrate("ArticleStore", ArticleStore);
hydrate("AptComplexStore", AptComplexStore);
hydrate("UserAptComplexStore", UserAptComplexStore);
hydrate("CallBookStore", CallBookStore);
hydrate("AutonomousOrganizationStore", AutonomousOrganizationStore);
hydrate("UserMgntStore", UserMgntStore);
hydrate("ContractStore", ContractStore);
hydrate("MaintenanceStore", MaintenanceStore);
hydrate("EmployeeMgntStore", EmployeeMgntStore);
hydrate("DocumentFormStore", DocumentFormStore);
hydrate("SendSMSStore", SendSMSStore);
hydrate("ManagementFeeStore", ManagementFeeStore);
hydrate("VisitingCarStore", VisitingCarStore);
hydrate("PreCheckSignInStore", PreCheckSignInStore);
hydrate("PreCheckDetailStore", PreCheckDetailStore);
hydrate("ResidentReservationStore", ResidentReservationStore);
hydrate("FacilityReservationStore", FacilityReservationStore);
hydrate("ResrvMgntStore", ResrvHistStore);
hydrate("ParkingCarMgntStore", ParkingCarMgntStore);
hydrate("MoveReservationStore", MoveReservationStore);
hydrate("PreCheckReportStore", PreCheckReportStore);

export default {
	SignInStore,
	UserSignInStore,
	ArticleStore,
	AptComplexStore,
	UserAptComplexStore,
	CallBookStore,
	AutonomousOrganizationStore,
	UserMgntStore,
	ContractStore,
	MaintenanceStore,
	EmployeeMgntStore,
	DocumentFormStore,
	SendSMSStore,
	ManagementFeeStore,
	VisitingCarStore,
	PreCheckSignInStore,
	PreCheckDetailStore,
	ResidentReservationStore,
	FacilityReservationStore,
	ResrvHistStore,
	ParkingCarMgntStore,
	MoveReservationStore,
	PreCheckReportStore,
};
