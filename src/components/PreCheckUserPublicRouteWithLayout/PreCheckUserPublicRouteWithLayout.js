import React, { useEffect, useState } from "react";
import { Route, withRouter }          from "react-router-dom";
import PropTypes                      from "prop-types";
import { inject, observer }           from "mobx-react";

import { aptComplexRepository, mainContentRepository, menuRepository } from "../../repositories";

const PreCheckUserPublicRouteWithLayout = props => {
	const { layout: Layout, component: Component, isAdmin, rootMatch, UserAptComplexStore, ...rest } = props;
	
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

PreCheckUserPublicRouteWithLayout.propTypes = {
	component: PropTypes.any.isRequired,
	layout:    PropTypes.any.isRequired,
	path:      PropTypes.string
};

export default inject("UserSignInStore", "UserAptComplexStore")(withRouter(observer(PreCheckUserPublicRouteWithLayout)));
