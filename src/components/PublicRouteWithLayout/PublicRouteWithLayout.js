import React                 from "react";
import { Route, withRouter } from "react-router-dom";
import PropTypes            from "prop-types";
import { inject, observer } from "mobx-react";

const PublicRouteWithLayout = props => {
	const { layout: Layout, component: Component, isAdmin, rootMatch, ...rest } = props;
	
	return (
		<Route
			{...rest}
			render={matchProps => (
				<Layout history={matchProps.history} match={rest.match}>
					<Component {...matchProps} rootMatch={rootMatch} isAdmin={!!isAdmin} />
				</Layout>
			)}
		/>
	);
};

PublicRouteWithLayout.propTypes = {
	component: PropTypes.any.isRequired,
	layout:    PropTypes.any.isRequired,
	path:      PropTypes.string
};

export default inject("SignInStore")(withRouter(observer(PublicRouteWithLayout)));
