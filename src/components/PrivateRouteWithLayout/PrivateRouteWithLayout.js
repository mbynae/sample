import React, { useEffect, useState }            from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import PropTypes                       from "prop-types";
import { inject, observer }            from "mobx-react";
import "mobx-react-lite/batchingForReactDom";

const PrivateRouteWithLayout = props => {
	const { layout: Layout, component: Component, isAdmin, AptComplexStore, SignInStore, ...rest } = props;
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 로그인된 상태에서 url 주소에 aptId만 변경하여 이동할 경우 로그아웃 되도록 구현
		let storeAptId = AptComplexStore.aptComplex.aptId  // Store에 저장된 aptId
		let currentAptId = rest.match.params.aptComplexId // 주소값의 aptId

		if(storeAptId != currentAptId) {
			SignInStore.logout();
			rest.history.push(`${rest.match.url}/sign-in`);
		} else {
			setLoading(false);
		}

	}, [])

	let checkAccount = () => {
		let signInStore = JSON.parse(localStorage.getItem("SignInStore"));
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

PrivateRouteWithLayout.propTypes = {
	component: PropTypes.any.isRequired,
	layout:    PropTypes.any.isRequired,
	path:      PropTypes.string
};

export default inject("AptComplexStore", "SignInStore")(withRouter(observer(PrivateRouteWithLayout)));
