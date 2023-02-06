import React, { useEffect, useState }  from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import PropTypes                       from "prop-types";
import { inject, observer }            from "mobx-react";

import "mobx-react-lite/batchingForReactDom";

import { aptComplexRepository, mainContentRepository, menuRepository } from "../../repositories";

const UserPrivateRouteWithLayout = props => {
	const { layout: Layout, component: Component, isAdmin, UserAptComplexStore, UserSignInStore, ...rest } = props;

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 로그인된 상태에서 url 주소에 aptId만 변경하여 이동할 경우 로그아웃 되도록 구현
		let storeAptId = UserAptComplexStore.aptComplex.aptId  // Store에 저장된 aptId
		let currentAptId = rest.match.params.aptComplexId // 주소값의 aptId

		if(storeAptId != currentAptId) {
			UserSignInStore.logout();
			rest.history.push(`${rest.match.url}/sign-in`);
		} else {
			const init = async () => {
				await getAptComplex();
				await getMenus();
				await getMainContent();
				setLoading(false);
			};
			setTimeout(() => {
				init();
			});
		}
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

	let checkAccount = () => {
		let signInStore = JSON.parse(localStorage.getItem("UserSignInStore"));
		if ( signInStore ) {
			let userInfo = signInStore.currentUser;
			let authenticated = signInStore.authenticated;

			if ( authenticated && userInfo.id && userInfo.userId ) {
				return true;
			} else {
				return false;
			}
		}
	};

	return (
		<Route
			{...rest}
			render={matchProps => {
				return !loading && (checkAccount() ?
					<Layout history={matchProps.history} match={rest.match}>
						<Component {...matchProps} />
					</Layout>
					:
					<Redirect
						to={{
							pathname: `/${rest.match.params.aptComplexId}${isAdmin ? "/admin" : ""}/sign-in`,
							state:    { from: matchProps.location }
						}}
					/>);
			}}
		/>
	);
};

UserPrivateRouteWithLayout.propTypes = {
	component: PropTypes.any.isRequired,
	layout:    PropTypes.any.isRequired,
	path:      PropTypes.string
};

export default inject("UserSignInStore", "UserAptComplexStore")(withRouter(observer(UserPrivateRouteWithLayout)));
