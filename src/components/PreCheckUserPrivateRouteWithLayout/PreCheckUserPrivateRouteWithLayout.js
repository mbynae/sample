import React, { useEffect, useState }  from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import PropTypes                       from "prop-types";
import { inject, observer }            from "mobx-react";

import "mobx-react-lite/batchingForReactDom";

import { aptComplexRepository, mainContentRepository, menuRepository } from "../../repositories";

const PreCheckUserPrivateRouteWithLayout = props => {
	const { layout: Layout, component: Component, isAdmin, UserAptComplexStore, ...rest } = props;
	
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		const init = async () => {
			await getAptComplex();
			await getMainContent();
			setLoading(false);
		};
		setTimeout(() => {
			init();
		});
	}, []);
	
	const getAptComplex = async () => {
		try {
			const aptComplex = await aptComplexRepository.getAptComplex(rest.match.params.aptComplexId, false, true);
			await UserAptComplexStore.setAptComplex(aptComplex);
		} catch ( e ) {
			UserAptComplexStore.setAptComplex({});
			rest.history.push(`${rest.match.url}/sign-in`);
			setLoading(false);
		}
	};
	
	const getMainContent = async () => {
		try {
			const mainContent = await mainContentRepository.getMainContent({ aptId: UserAptComplexStore.aptComplex.id }, false, true);
			await UserAptComplexStore.setMainContent(mainContent);
		} catch ( e ) {
			console.error(e);
		}
	};
	
	const checkAccount = () => {
		let signInStore = JSON.parse(localStorage.getItem("PreCheckSignInStore"));
		if ( signInStore ) {
			let userInfo = signInStore.currentUser;
			let authenticated = signInStore.authenticated;
			
			if ( authenticated && userInfo.id && userInfo.name ) {
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
							pathname: `/${rest.match.params.aptComplexId}/pre-inspection/sign-in`,
							state:    { from: matchProps.location }
						}}
					/>);
			}}
		/>
	);
};

PreCheckUserPrivateRouteWithLayout.propTypes = {
	component: PropTypes.any.isRequired,
	layout:    PropTypes.any.isRequired,
	path:      PropTypes.string
};

export default inject("PreCheckSignInStore", "UserAptComplexStore")(withRouter(observer(PreCheckUserPrivateRouteWithLayout)));
