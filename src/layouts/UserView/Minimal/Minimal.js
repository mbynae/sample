import React, { useEffect, useState } from "react";
import PropTypes                      from "prop-types";
import { inject, observer }           from "mobx-react";
import { toJS }                       from "mobx";
import { makeStyles }                 from "@material-ui/styles";

import { Topbar, Footer }                              from "./components";
import { aptComplexRepository, mainContentRepository } from "../../../repositories";

const useStyles = makeStyles(() => ({
	root:    {
		paddingTop: 64,
		height:     "100%"
	},
	content: {
		// height: "100%"
	}
}));

const Minimal = props => {
	const { children, PreCheckSignInStore, UserAptComplexStore, history, match } = props;
	
	const classes = useStyles();
	const [mainContent, setMainContent] = useState({});
	
	// useEffect(() => {
	// 	const init = () => {
	// 		// getAptComplex();
	// 	};
	// 	setTimeout(() => {
	// 		init();
	// 	});
	// }, [PreCheckSignInStore.currentUser]);
	
	const getAptComplex = async () => {
		try {
			// const aptComplex = await aptComplexRepository.getAptComplex(match.params.aptComplexId);
			// await UserAptComplexStore.setAptComplex(aptComplex);
			await getMainContent();
		} catch ( e ) {
			UserAptComplexStore.setAptComplex({});
			history.push(`${match.url}/not-found`);
		}
	};
	
	const getMainContent = async () => {
		// const mainContent = await mainContentRepository.getMainContent({ aptId: UserAptComplexStore.aptComplex.id });
		setMainContent(toJS(UserAptComplexStore.mainContent));
	};
	
	return (
		<div className={classes.root}>
			
			<Topbar
				aptComplexId={match.params.aptComplexId}
				mainContent={toJS(UserAptComplexStore.mainContent)}
				PreCheckSignInStore={PreCheckSignInStore}
				history={history}
			/>
			
			<main className={classes.content}>{children}</main>
			
			<Footer aptComplex={toJS(UserAptComplexStore.aptComplex)} />
			
		</div>
	);
};

Minimal.propTypes = {
	children:  PropTypes.node,
	className: PropTypes.string
};

export default inject("PreCheckSignInStore", "UserAptComplexStore")(observer(Minimal));
