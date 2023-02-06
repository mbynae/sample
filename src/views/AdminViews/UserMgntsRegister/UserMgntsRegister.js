import React, {useState, useEffect} from "react";
import {inject, observer}           from "mobx-react";
import clsx                         from "clsx";
import validate                     from "validate.js";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

import {ActiveLastBreadcrumb, AlertDialogUserView, PhoneMask} from "../../../components";
import {toJS}                                                         from "mobx";
import { accountRepository, resrvHistRepository, userMgntRepository } from "../../../repositories";
import useCountDown                                                   from "react-countdown-hook";
import {AccountTypeKind, OwnerTypeKind, ResidentsTypeKind}    from "../../../enums";
import palette                                                from "../../../theme/adminTheme/palette";

/**
 * 2021.03.03 | junghoon15 | 사용자 신규 생성 created
 * @param props
 * @constructor
 */

/* =====================================================================================================================
 * 커스텀 스타일
===================================================================================================================== */
const useStyles = MS.makeStyles(theme => ({
	root:    {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	},
	paper:             {
		padding: theme.spacing(2)
	},
	divider:           {
		marginTop:       theme.spacing(2),
		marginBottom:    theme.spacing(2),
		backgroundColor: "rgba(0, 0, 0, 0.12)"
	},
	form: {
		width: "50%",
		marginLeft: "20%",
	},
	textFieldLayout: {
		width           : "100%",
		paddingLeft     : 40,
		paddingRight    : 40,
		marginTop       : 20,
		[theme.breakpoints.down("xs")]: {
			paddingLeft:  0,
			paddingRight: 0
		}
	},
	textField:        {
		"& input": {
			fontWeight: "normal"
		},
		"& p":     {
			color:      "#222222",
			fontWeight: "normal",
			marginLeft: 0
		}
	},
	inputLabelLayout: {
		left:                15,
		top:                 -7,
		"& fieldset legend": {
			width: 200
		}
	},
	actionButton: {
		width: "100%",
		height: 53,
		fontSize: 14
	},
	smsButton: {
		width: "100%",
		height: 53,
		fontSize: 14,
		background: "#f9f9f9",
		border: "1px solid #ebebeb"
	}
}));

/* =====================================================================================================================
 * 리액트 컴포넌트
===================================================================================================================== */
const UserMgntsRegister = props => {
	// State -----------------------------------------------------------------------------------------------------------
	const {AptComplexStore, history} = props;
	const [aptComplex, setAptComplex] = useState();
	const classes = useStyles();                                                                                                                                                                        // 스타일 정의
	const [rootUrl, setRootUrl] = useState("");                                                                                                                                               // 경로
	const [breadcrumbs, setBreadcrumbs] = useState([                                                                                                                                          // 상단 gnb 레벨 표시
		{
			title: "관리자",
			href:  `${rootUrl}/dashboard`
		},
		{
			title: `입주민 관리`,
			href:  `${rootUrl}/userMgnt`
		},
		{
			title: `등록`,
			href: `${rootUrl}/userMgnt/register`
		}
	]);
	const theme = MS.useTheme();
	const isMobile = MC.useMediaQuery(theme.breakpoints.down("xs"));                                               // 현재 기기가 모바일,pc인지 구분
	const [loading, setLoading] = useState(true);
	const [dongList, setDongList] = useState([]); // 동 Dropdown 리스트
	const [hoList, setHoList] = useState([]); // 호 Dropdown 리스트
	const [formState, setFormState] = useState({
		isValid: false,
		values: {
			allAgree            : true,
			isAgreeTermsService : true,
			isAgreePrivacyPolicy: true,
			userId              : "",
			password            : "",
			passwordCheck       : "",
			name                : "",
			phoneNumber         : "",
			certificationNumber : "",
			building            : "",
			unit                : "",
			nickName            : "",
			houseHolderType     : "HOUSEHOLD_MEMBER"
		},
		touched: {
			allAgree            : false,
			isAgreeTermsService : false,
			isAgreePrivacyPolicy: false,
			userId              : false,
			password            : false,
			passwordCheck       : false,
			name                : false,
			phoneNumber         : false,
			certificationNumber : false,
			building            : false,
			unit                : false,
			nickName            : false,
			houseHolderType     : false
		},
		errors: {}
	});

	const schema = {
		userId:{
			presence: true,
			length: {
				maximum: 13
			},
			format: {
				pattern: "(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,13}",
				message: "^아이디는 영문+숫자 6 ~ 13 자리로 입력해주세요."
			}
		},
		password:             {
			presence: true,
			length:   {
				maximum: 18
			},
			format:   {
				pattern:    "^(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,18}",
				allowEmpty: false,
				message:    "^비밀번호는 알파벳,특수문자,숫자 8자리 이상으로 입력해주세요."
			}
		},
		passwordCheck:        {
			presence: true,
			equality: {
				attribute: "password",
				message:   "^비밀번호가 맞지 않습니다."
			},
			length:   {
				maximum: 18
			},
			format:   {
				pattern:    "^(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,18}",
				allowEmpty: false,
				message:    "^비밀번호 확인을 입력해주세요."
			}
		},
		name:                 {
			presence: { allowEmpty: false, message: "^이름을 입력해주세요." },
			length:   {
				maximum: 20
			}
		},
		phoneNumber:          {
			presence: { allowEmpty: false, message: "^휴대폰번호를 입력해주세요." },
			length:   {
				maximum: 20
			}
		},
		certificationNumber:  {
			presence: true,
			length:   {
				minimum: 6,
				maximum: 6,
				message: "^인증번호를 입력해주세요."
			}
		},
		building:             {
			presence: { allowEmpty: false, message: "^동을 입력해주세요." },
			length:   {
				maximum: 10
			}
		},
		unit:                 {
			presence: { allowEmpty: false, message: "^호를 입력해주세요." },
			length:   {
				maximum: 10
			}
		},
		nickName:             {
			presence: { allowEmpty: false, message: "^닉네임을 입력해주세요." },
			length:   {
				maximum: 128
			}
		},
		isAgreeTermsService:  {
			inclusion: {
				within:  [true],
				message: "^서비스 이용약관에 동의 해주세요."
			}
		},
		isAgreePrivacyPolicy: {
			inclusion: {
				within:  [true],
				message: "^개인정보처리방침에 동의 해주세요."
			}
		}
	};

	const [alertOpens, setAlertOpens] = useState({
		isConfirmOpen   : false,
		isOpen          : false,
		title           : "",
		content         : "",
		noTitle         : "",
		yesTitle        : "",
		yesFn           : () => handleAlertToggle(),
		noFn            : () => handleAlertToggle(),
		isOpenType      : false,
		type            : ""
	});

	const [isDupId, setIsDupId] = useState(false);                                                            // 중복아이디 확인
	const [isIdChecked, setIsIdChecked] = useState(false);                                                    // 아이디 값이 정상적으로 기입되었는지 확인
	const [isDupNickName, setIsDupNickName] = useState(false);                                                // 중복 닉네임 확인
	const [isNickChecked, setIsNickChecked] = useState(false);                                                // 닉네임이 정상적으로 기입되었는지 확인
	const [smsSend, setSmsSend] = useState(false);                                                            // sms가 발송되었는지 확인
	const [isTimeOver, setIsTimeOver] = useState(false);                                                      // 3분안에 문자 인증을 했는지 확인
	const [isCertify, setIsCertify] = useState(false);                                                        // 휴대폰 인증 했는지 확인
	const [certifyNumber, setCertifyNumber] = useState();                                                               // 휴대폰 인증번호
	const initialTime = 3 * 60 * 1000;
	const interval = 1000;
	const [timeLeft, {start, pause, resume, reset}] = useCountDown(initialTime, interval);

	// Function --------------------------------------------------------------------------------------------------------
	const handleAlertToggle = (key, title, content, yesTitle, yesCallback, noTitle, noCallback, type) => {
		setAlertOpens(
			prev => {
				return {
					...prev,
					title,
					content,
					noTitle,
					yesTitle,
					[key]: !alertOpens[key],
					yesFn: () => yesCallback(),
					noFn:  () => noCallback(),
					type
				};
			}
		);
	};

	const hasError = field =>!!(formState.touched[field] && formState.errors[field]);                                   // 정상 기입 확인

	const handleChange = (event, value) => {                                                                            // form 입력에 따라 값을 넣어주는 함수
		if (event.target) {
			event.persist();                                                                                            // 이벤트에 따른 오브젝트 관리
			if (event.target.name === "userId") {
				setIsIdChecked(false);
				setIsDupId(false);
			}

			setFormState(fs => ({
				...formState,
				values: {
					...formState.values,
					[event.target.name] : event.target.value
				}
			}));
		}

		setFormState(fs => ({
			...fs,
			values: {
				...fs.values,
				[event.target.name] : event.target.value,
				allAgree: event.target.name === 'isAgreeTermsService' ? fs.values.isAgreePrivacyPolicy : fs.values.isAgreeTermsService
			},
			touched : {
				...fs.touched,
				[event.target.name]: true,
				allAgree: true
			}
		}));
		// 동 값이 입력 되었을 때 호 Dropdown List 출력 함수 호출
		if (event.target.name === "building") {
			getHoNumList(event.target.value);
		}
	}

	const checkDuplicateId = () => {                                                                                    // 아이디 중복 체크
		setIsDupId(false);
		setFormState(prev => {
			prev.touched["userId"] = true;
			return {
				...prev,
			};
		});

		if (!hasError("userId")) {
			accountRepository.checkUserId({
				aptId: aptComplex.aptId,
				userId: formState.values.userId
			}, true).then(res => {
				if (res.success) {
					handleAlertToggle(
						"isOpen",
						undefined,
						"이미 사용중인 아이디 입니다.",
						undefined,
						() => {
							setIsDupId(true);
							setAlertOpens({ ...alertOpens, isOpen: false });
						}
					);
				} else {
					setIsDupId(false);
					setIsIdChecked(true);
				}
			})
		}
	}

	// 인증번호 받기
	const getCertificationNumber = () => {
		if (formState.values.phoneNumber) {
			accountRepository.getCertificationNumber({
				aptId: aptComplex.id,
				phoneNumber: formState.values.phoneNumber
			}).then(res => {
				setSmsSend(true);
				setIsTimeOver(false);
				start();
				setCertifyNumber(res);
			})
		}
		else {
			handleAlertToggle(
				"isOpen",
				undefined,
				"휴대폰 번호를 입력해주세요.",
				undefined,
				() => {
					setAlertOpens(prev => {
						return { ...prev, isOpen: false };
					});
				}
			);
		}
	}

	const convertToMinute = (time) => {
		let hours = Math.floor(time / 3600);
		let minutes = Math.floor((time - (hours * 3600)) / 60);
		let seconds = time - (hours * 3600) - (minutes * 60);

		if ( hours < 10 ) {
			hours = "0" + hours;
		}
		if ( minutes < 10 ) {
			minutes = "0" + minutes;
		}
		if ( seconds < 10 ) {
			seconds = "0" + seconds;
		}

		return `${minutes}:${seconds}`;
	};

	const checkCertificationNumber = () => {                                                                            // 인증번호확인
		// console.log('val', formState.values.certificationNumber);
		// console.log('cn', certifyNumber);
		const errors = validate({certificationNumber: formState.values.certificationNumber}, {certificationNumber: {...schema.certificationNumber}});
		setFormState(fs => ({
			...fs,
			isValid: !errors,
			errors: {...fs.errors, ...errors} || {}
		}));

		if (!errors) {
			if (formState.values.certificationNumber === certifyNumber) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"인증되었습니다",
					undefined,
					() => {
						setAlertOpens(prev => {return {...prev, isOpen: false}});
						setIsCertify(true);
					},
					undefined
				);
				pause();
			} else {
				setFormState(fs => ({
					...fs,
					isValid: !errors,
					errors: {...fs.errors, certificationNumber: ["인증번호가 다릅니다"]}
				}));
				handleAlertToggle(
					"isOpen",
					undefined,
					"인증번호가 다릅니다",
					undefined,
					() => {
						setAlertOpens(prev => {return {...prev, isOpen: false}});
					},
					undefined
				);
			}
		}
	};

	const checkDuplicatedNickName = () => {                                                                             // 닉네임 중복체크
		setIsDupNickName(false);
		setFormState(prev => {
			prev.touched["nickName"] = true;
			return {
				...prev
			};
		});

		if (!hasError("nickName")) {
			accountRepository.checkNickname({
				aptId: aptComplex.aptId,
				nickName: formState.values.nickName
			}, false).then(result => {
				if (result.success) {
					handleAlertToggle(
						"isOpen",
						undefined,
						"이미 사용중인 닉네임 입니다.",
						undefined,
						() => {
							setIsDupNickName(true);
							setAlertOpens({...alertOpens, isOpen: false});
						}
					);
				} else {
					setIsDupNickName(false);
					setIsNickChecked(true);
				}
			});
		}
	};

	const changeAllTouched = () => {
		Object
			.entries(formState.touched)
			.map(async obj => {
				let [key] = obj;
				setFormState(prev => {
					prev.touched[key] = true;
					return {
						...prev
					};
				});
			});
	};

	const getUserMgntsByBuildingAndUnit = async (building, unit) => {
		return userMgntRepository
			.getUserMgntsByBuildingAndUnit({
				aptId: AptComplexStore.aptComplex.id,
				building: building,
				unit: unit
			}, true);
	};

	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (동)
	const getDongNumList = () => {
		resrvHistRepository.getDongSearch({}, "donghosearch/dong")
			.then(result => {
				setDongList(result.data_json_array)
			})
	}

	// 등록 화면에서 사용될 Dropdown의 목록 가져옴 (호)
	const getHoNumList = (hoNumb) => {
		resrvHistRepository.getHoSearch({}, `donghosearch/ho/${hoNumb}`)
			.then(result => {
				setHoList(result.data_json_array)
			})
	}

	const handleSignUp = async (event) => {                                                                             // 회원가입
		event.preventDefault();
		changeAllTouched();

		const errors = validate(formState.values, schema);                                                              // 필요 값들이 전부 입력되었는지 확인
		setFormState(fs => ({
			...fs,
			isValid: !errors,
			errors: errors || {}
		}));

		if (!errors && isIdChecked && !isDupId && isNickChecked && !isDupNickName) {
			try {
				if (formState.values.houseHolderType === "HOUSEHOLD_OWNER") {
					const result = await getUserMgntsByBuildingAndUnit(formState.values.building, formState.values.unit);
					if (result.id) {
						handleAlertToggle(
							"isOpen",
							undefined,
							"해당 동/호수에 이미 세대주가 있습니다. \n다시 확인하시고 회원가입을 해주세요.",
							undefined,
							() => {
								setAlertOpens(prev => {return {...prev, isOpen: false}});
							},
							undefined
						);
						return;
					}
				}
				const signUp = await accountRepository.signUp({
					aptId: aptComplex.id,
					userId:               formState.values.userId.trim(),
					password:             formState.values.password.trim(),
					name:                 formState.values.name.trim(),
					phoneNumber:          formState.values.phoneNumber.replaceAll("-", ""),
					accountTypeKind:      AccountTypeKind.USER,
					userDataType:         {
						nickName:             formState.values.nickName.trim(),
						building:             formState.values.building,
						unit:                 formState.values.unit,
						houseHolderType:      formState.values.houseHolderType,
						residentsType:        ResidentsTypeKind.AWAITING_RESIDENTS,
						ownerType:            OwnerTypeKind.TO_BE_CONFIRMED,
						isPhoneCertification: true
					},
					isAgreeTermsService:  formState.values.isAgreeTermsService,
					isAgreePrivacyPolicy: formState.values.isAgreePrivacyPolicy
				}, false);
				if (signUp.success) {
					history.push(`/${aptComplex.aptId}/admin/userMgnt`);
				};
			} catch (err) {
				handleAlertToggle(
					"isOpen",
					undefined,
					"입력하신 정보를 다시 확인해주세요",
					undefined,
					() => {
						setAlertOpens({...alertOpens, isOpen: false});
					}
				)
			}
		}
	}

	// LifeCycle -------------------------------------------------------------------------------------------------------
	useEffect(() => {                                                                                             // 최초 화면 입장시, store값 저장.
		const init = async () => {
			setAptComplex(toJS(AptComplexStore.aptComplex));
			setLoading(false);
			await getDongNumList();
		};
		setTimeout(() => {
			init();
		});
	},[]);

	useEffect(() => {                                                                                             // form 입력값들이 수정될때마다 schema에 지정된 값을 통과하는지 확인
		const init = () => {
			const tempErrors = validate(formState.values,schema);
			setFormState(prev => ({
				...prev,
				isValid: tempErrors ? false : true,
				errors : tempErrors || {}
			}));
		};
		setTimeout(() => {
			init();
		});
	}, [formState.values]);

	useEffect(() => {
		const init = () => {
			if (timeLeft === 0) {
				setIsTimeOver(true);
			} else {
				setIsTimeOver(false);
			}
		};
		setTimeout(() => {
			init();
		});
	});

	const handleGoBack = () => {
		history.goBack();
	};

	// Dom -------------------------------------------------------------------------------------------------------------
	return (
		<div className={classes.root}>
			<ActiveLastBreadcrumb breadcrumbs={breadcrumbs} />

			<MC.Grid className={classes.content}>
				<MC.Typography variant="h3">
					입주민 등록
				</MC.Typography>
				<MC.Divider className={classes.divider} />

				<MC.Paper elevation={2} className={classes.paper}>
					<MC.Card style={{ overflow: "visible"}}>
						<MC.CardContent className={classes.cardContent}>
							<form
								className={classes.form}
								onSubmit={handleSignUp}
							>
								{/* 컨테이너 그리드 : depth 1 시작 */}
								<MC.Grid container direction={"column"} justify={"center"} alignItems={"center"} >
									{/* 아이디 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.Grid container spacing={3}>
											<MC.Grid item xs={12} md={9} >
												<MC.TextField
													className={classes.textField}
													fullWidth
													label="아이디"
													name="userId"
													variant="outlined"
													placeholder="아이디 입력"
													type="text"
													inputProps={{
														autoComplete: "username",
														maxLength: 13
													}}
													error={hasError("userId") || (formState.values.userId !== "" && (isDupId || !isIdChecked))}
													helperText = {
														hasError("userId") ? formState.errors.userId[0]:
															isDupId ? "이미 사용중인 아이디 입니다" :
																isIdChecked ? "사용가능한 아이디 입니다." :
																	formState.values.userId !== "" ? "아이디 중복체크를 해주세요" : null
													}
													value={formState.values.userId || ""}
													onChange={handleChange}
												/>
											</MC.Grid>
											<MC.Grid item xs={12} md={3}>
												<MC.Button
													color="primary"
													size="large"
													variant="contained"
													disableElevation
													className={classes.actionButton}
													onClick={checkDuplicateId}
												>
													중복체크
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
									{/* 아이디 그리드 : depth 2 끝 */}

									{/* 비밀번호 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.TextField
											className={classes.textField}
											error={hasError("password")}
											fullWidth
											helperText={
												hasError("password") ? formState.errors.password[0] : formState.touched.password && "사용가능한 비밀번호입니다."
											}
											label="비밀번호"
											name="password"
											onChange={handleChange}
											type="password"
											placeholder="비밀번호는 알파벳,특수문자,숫자 8자리 이상으로 입력해주세요."
											value={formState.values.password || ""}
											inputProps={{
												autoComplete: "new-password",
												maxLength: 18
											}}
											variant="outlined"
										/>
									</MC.Grid>
									{/* 비밀번호 그리드 : depth 2 끝 */}

									{/* 비밀번호 확인 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.TextField
											className={classes.textField}
											error={hasError("passwordCheck")}
											fullWidth
											helperText={
												hasError("passwordCheck") ? formState.errors.passwordCheck[0]: null
											}
											label="비밀번호 확인"
											name="passwordCheck"
											onChange={handleChange}
											type="password"
											placeholder="비밀번호를 한번 더 입력해주세요."
											inputProps={{
												autoComplete: "new-password",
												maxLength: 18
											}}
											variant="outlined"
										/>
									</MC.Grid>
									{/* 비밀번호 확인 그리드 : depth 2 끝 */}

									{/* 이름 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.TextField
											className={classes.textField}
											fullWidth
											label="이름"
											name="name"
											variant="outlined"
											placeholder="이름"
											error={hasError("name")}
											helperText={
												hasError("name") ? formState.errors.name[0] : null
											}
											onChange={handleChange}
											value={formState.values.name || ""}
											inputProps={{
												maxLength: 20
											}}
										/>
									</MC.Grid>
									{/* 이름 그리드 : depth 2 끝 */}

									{/* 휴대폰번호 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.Grid container spacing={3}>
											<MC.Grid item xs={12} md={9}>
												<MC.FormControl fullWidth className={classes.formControl} error={hasError("phoneNumber") || formState.values.phoneNumber !== "" && !isCertify}>
													<MC.InputLabel id="phoneNumber-label" className={classes.inputLabelLayout}>휴대폰번호</MC.InputLabel>
													<MC.OutlinedInput
														className={classes.textField}
														disabled={isCertify || smsSend}
														label="휴대폰번호"
														labelid="phoneNumber-label"
														id="phoneNumber-label"
														name="phoneNumber"
														placeholder={"숫자만 입력해주세요"}
														value={formState.values.phoneNumber || ""}
														onChange={handleChange}
														inputComponent={PhoneMask}
													/>
													{
														hasError("phoneNumber")
															? <MC.FormHelperText id="phoneNumber-label-text">{formState.errors.phoneNumber[0]}</MC.FormHelperText>
															: (formState.values.phoneNumber !== "" && !isCertify)
																? <MC.FormHelperText id="phoneNumber-label-text">휴대폰 번호 인증을 진행해 주세요.</MC.FormHelperText> : null
													}
												</MC.FormControl>
											</MC.Grid>
											<MC.Grid item xs={12} md={3}>
												<MC.Button
													color="primary"
													size="large"
													variant="contained"
													disableElevation
													disabled={smsSend}
													onClick={getCertificationNumber}
													className={classes.actionButton}
												>
													인증번호 받기
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
									{
										smsSend &&
										<MC.Grid item className={classes.textFieldLayout}>
											<MC.Grid container spacing={3}>
												<MC.Grid item xs={12} md={8}>
													<MC.FormControl fullWidth className={classes.formControl} error={hasError("certificationNumber") || isTimeOver}>
														<MC.InputLabel htmlFor="certificationNumber-basic" className={classes.inputLabelLayout}>인증번호</MC.InputLabel>
														<MC.OutlinedInput
															className={classes.textField}
															disabled={isCertify}
															label={"인증번호"}
															id="certificationNumber-basic"
															labelid="certificationNumber-basic"
															name="certificationNumber"
															inputProps={{
																maxLength: 6
															}}
															endAdornment={<MC.InputAdornment position="end">{convertToMinute(timeLeft/1000)}</MC.InputAdornment>}
															value={formState.values.certificationNumber || ""}
															onChange={handleChange}
														/>
													</MC.FormControl>
												</MC.Grid>
												<MC.Grid item xs={12} md={2}>
													<MC.Button
														size="large"
														variant="contained"
														disableElevation
														disabled={isTimeOver || isCertify}
														onClick={checkCertificationNumber}
														className={classes.smsButton}
													>
														확인
													</MC.Button>
												</MC.Grid>
												<MC.Grid item xs={12} md={2}>
													<MC.Button
														size="large"
														variant="contained"
														disableElevation
														disabled={isCertify}
														onClick={getCertificationNumber}
														className={classes.smsButton}
													>
														재발송
													</MC.Button>
												</MC.Grid>
											</MC.Grid>
										</MC.Grid>
									}
									{/* 휴대폰번호 그리드 : depth 2 끝 */}

									{/* 동/호 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.Grid container spacing={3}>
											<MC.Grid item xs={12} md={6}>
												<MC.FormControl fullWidth className={classes.formControl} error={hasError("building")}>
													<MC.TextField
														select
														label="동"
														name="building"
														id="dong_numb"
														defaultValue={""}
														variant={"outlined"}
														value={formState.values.building || ""}
														onChange={handleChange}>
														{dongList.map((item, index) =>
															<MC.MenuItem key={index} value={item.dong_numb}>{item.dong_numb}</MC.MenuItem>
														)}
													</MC.TextField>
												</MC.FormControl>
											</MC.Grid>
											<MC.Grid item xs={12} md={6}>
												<MC.FormControl fullWidth className={classes.formControl} error={hasError("unit")}>
													<MC.TextField
														select
														label="호"
														name="unit"
														id="ho_numb"
														defaultValue={""}
														variant={"outlined"}
														disabled={formState.values.building === ""}
														value={formState.values.unit || ""}
														onChange={handleChange}>
														{hoList.map((item, index) =>
															<MC.MenuItem key={index} value={item.ho_numb}>{item.ho_numb}</MC.MenuItem>
														)}
													</MC.TextField>
													{formState.values.building === "" && <MC.FormHelperText>동을 먼저 선택해주세요.</MC.FormHelperText>}
												</MC.FormControl>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
									{/* 동/호 그리드 : depth 2 끝 */}

									{/* 닉네임 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.Grid container spacing={3}>
											<MC.Grid item xs={12} md={9}>
												<MC.TextField
													className={classes.textField}
													fullWidth
													label="닉네임"
													name="nickName"
													variant="outlined"
													type="text"
													placeholder="닉네임 입력해주세요."
													error={hasError("nickName") || (formState.values.nickName !== "" && (isDupNickName || !isNickChecked))}
													helperText={
														hasError("nickName") ? formState.errors.nickName[0]:
															isDupNickName ? "이미 사용중인 닉네임입니다." :
																isNickChecked ? "사용가능한 닉네임입니다." :
																	formState.values.nickName !== "" ? "닉네임 중복체크를 해주세요." : null
													}
													onChange={handleChange}
													inputProps={{
														maxLength: 20
													}}
													value={formState.values.nickName || ""}
												/>
												<MC.FormHelperText id="unit-label-text">게시글에 작성자는 동과 닉네임이 같이 표기됩니다. (예. 101동 미고)</MC.FormHelperText>
											</MC.Grid>
											<MC.Grid item xs={12} md={3}>
												<MC.Button
													color="primary"
													size="large"
													variant="contained"
													disableElevation
													className={classes.actionButton}
													onClick={checkDuplicatedNickName}
												>중복체크
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
									{/* 닉네임 그리드 : depth 2 끝 */}

									{/* 세대주여부 그리드 : depth 2 시작 */}
									<MC.Grid item className={classes.textFieldLayout}>
										<MC.FormControl fullWidth className={classes.formControl}>
											<MC.FormLabel component="legend">세대주여부</MC.FormLabel>
											<MC.RadioGroup
												row
												aria-label="houseHolderType"
												name="houseHolderType"
												value={formState.values.houseHolderType || "HOUSEHOLD_MEMBER"}
												onChange={handleChange}
											>
												<MC.FormControlLabel value="HOUSEHOLD_OWNER" control={<MC.Radio color={"primary"} />} label="예" style={{marginRight: 50}} />
												<MC.FormControlLabel value="HOUSEHOLD_MEMBER" control={<MC.Radio color={"primary"} />} label="아니오" />
											</MC.RadioGroup>
										</MC.FormControl>
									</MC.Grid>
									{/* 세대주여부 그리드 : depth 2 끝 */}

									<MC.Grid item className={classes.textFieldLayout}>
										<MC.Grid container spacing={3}>
											<MC.Grid item xs={12} md={6}>
												<MC.Button
													fullWidth
													size="large"
													variant="contained"
													style={{
														color:                  palette.error.main,
														borderColor:            palette.error.main,
														marginLeft:             10,
														borderTopLeftRadius:    4,
														borderBottomLeftRadius: 4
													}}
													onClick={handleGoBack} >
													취소
												</MC.Button>
											</MC.Grid>
											<MC.Grid item xs={12} md={6}>
												<MC.Button
													fullWidth
													color="primary"
													size="large"
													type="submit"
													variant="contained"
													disableElevation>
													등록
												</MC.Button>
											</MC.Grid>
										</MC.Grid>
									</MC.Grid>
								</MC.Grid>
								{/* 컨테이너 그리드 : depth 1 끝 */}
							</form>
						</MC.CardContent>
					</MC.Card>
					{/* 폼 끝 */}
				</MC.Paper>
			</MC.Grid>

			<AlertDialogUserView
				isOpen={alertOpens.isOpenType}
				type={alertOpens.type}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				yesTitle={alertOpens.yesTitle}
				handleYes={() => alertOpens.yesFn()}
			/>

			<AlertDialogUserView
				isOpen={alertOpens.isConfirmOpen}
				title={alertOpens.title}
				content={alertOpens.content}
				handleYes={() => alertOpens.yesFn()}
				handleNo={() => alertOpens.noFn()}
				noTitle={alertOpens.noTitle}
				yesTitle={alertOpens.yesTitle}
			/>
		</div>
	);
};

export default inject("SignInStore", "AptComplexStore", "UserMgntStore")(observer(UserMgntsRegister));
