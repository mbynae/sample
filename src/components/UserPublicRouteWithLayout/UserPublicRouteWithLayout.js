import React, { useEffect, useState } from "react";
import { Route, withRouter }          from "react-router-dom";
import PropTypes                      from "prop-types";
import { inject, observer }           from "mobx-react";
import { constants }         from "../../commons";
import { aptComplexRepository, mainContentRepository, menuRepository } from "../../repositories";

const UserPublicRouteWithLayout = props => {
	const { layout: Layout, component: Component, isAdmin, rootMatch, UserAptComplexStore, UserSignInStore, ...rest } = props;

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 로그인된 상태에서 url 주소에 aptId만 변경하여 이동할 경우 로그아웃 되도록 구현
		let userAccessToken = localStorage.getItem('userAccessToken')	// 사용자 로그인 여부(public에서는 비로그인 경우에도 접근 가능하기 때문에 토큰 여부 파악 필요)
		if(userAccessToken != null) {
			let storeAptId = UserAptComplexStore.aptComplex.aptId  // Store에 저장된 aptId
			let currentAptId = rest.match.params.aptComplexId // 주소값의 aptId

			if(storeAptId != currentAptId && storeAptId != undefined) {
				UserSignInStore.logout();
				rest.history.push(`${rest.match.url}/sign-in`);
			}
		}

		const init = async () => {
			await getAptComplex();
			await getMenus();
			await getMainContent();
			await getCmpxNumb();
			setLoading(false);
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const getAptComplex = async () => {
		try {
			const aptComplex = await aptComplexRepository.getAptComplex(rest.match.params.aptComplexId, true);
			await UserAptComplexStore.setAptComplex(aptComplex);
		} catch ( e ) {
			UserAptComplexStore.setAptComplex({});
			rest.history.push(`${rest.match.url}/not-found`);
			setLoading(false);
		}
	};

	const getMenus = async () => {
		try {
			const menus = await menuRepository.getMenus({ aptId: rest.match.params.aptComplexId, menuType: "TOP_MENU_TYPE" }, true);
			await UserAptComplexStore.setMenus(menus);
		} catch ( e ) {
			console.error(e);
		}
	};

	const getMainContent = async () => {
		try {
			const mainContent = await mainContentRepository.getMainContent({ aptId: UserAptComplexStore.aptComplex.id }, true);
			await UserAptComplexStore.setMainContent(mainContent);
		} catch ( e ) {
			console.error(e);
		}
	};

	const getCmpxNumb = async () => {
		const cmpxNumbInfo = await aptComplexRepository.getUserCmpxNumb(UserAptComplexStore.aptComplex.aptId);
		await UserAptComplexStore.setCmpxNumb(cmpxNumbInfo.cmpx_numb);
	}

	return (
		<Route
			{...rest}
			render={matchProps => (
				!loading &&
				<Layout history={matchProps.history} match={rest.match}>
					<Component {...matchProps} rootMatch={rootMatch} isAdmin={!!isAdmin} />
				</Layout>
			)}
		/>
	);
};

UserPublicRouteWithLayout.propTypes = {
	component: PropTypes.any.isRequired,
	layout:    PropTypes.any.isRequired,
	path:      PropTypes.string
};

export default inject("UserSignInStore", "UserAptComplexStore")(withRouter(observer(UserPublicRouteWithLayout)));
