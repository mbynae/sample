import React, { useEffect, useState } from "react";
import PropTypes                      from "prop-types";
import { makeStyles }                 from "@material-ui/styles";

import { Topbar }                                      from "./components";
import { aptComplexRepository, mainContentRepository } from "../../../repositories";
import { inject, observer }                            from "mobx-react";

const useStyles = makeStyles(() => ({
	root:    {
		paddingTop: 64,
		height:     "100%"
	},
	content: {
		height: "100%"
	}
}));

const Minimal = props => {
	const { children, AptComplexStore, history, match } = props;

	const classes = useStyles();
	const [mainContent, setMainContent] = useState({});

	useEffect(() => {
		const init = () => {
			getAptComplex();
		};
		setTimeout(() => {
			init();
		});
	}, []);

	const getAptComplex = async () => {
		try {
			const aptComplex = await aptComplexRepository.getAptComplex(match.params.aptComplexId);
			await AptComplexStore.setAptComplex(aptComplex);
			await getMainContent();
		} catch ( e ) {
			AptComplexStore.setAptComplex({});
			history.push(`${match.url}/not-found`);
		}
	};

	const getMainContent = async () => {
		const mainContent = await mainContentRepository.getMainContent({ aptId: AptComplexStore.aptComplex.id });
		setMainContent(mainContent);
	};

	return (
		<div className={classes.root}>
			<Topbar
				mainContent={mainContent}
			/>
			<main className={classes.content}>{children}</main>
		</div>
	);
};

Minimal.propTypes = {
	children:  PropTypes.node,
	className: PropTypes.string
};

export default inject("AptComplexStore")(observer(Minimal));
