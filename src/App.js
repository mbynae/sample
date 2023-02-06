import React, { Component } from "react";

import { Router }               from "react-router-dom";
import { createBrowserHistory } from "history";
import { LastLocationProvider } from "react-router-last-location";
import { Chart }                from "react-chartjs-2";
import validate                 from "validate.js";
import { ThemeProvider }        from "@material-ui/styles";

import Routes         from "./Routes";
import { chartjs }    from "./helpers";
import validators     from "./commons/validators";
import "react-perfect-scrollbar/dist/css/styles.css";
import { adminTheme } from "./theme";
import "./assets/scss/index.scss";

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
	draw: chartjs.draw
});

validate.validators = {
	...validate.validators,
	...validators
};

export default class App extends Component {
	render(){
		return (
			<ThemeProvider theme={adminTheme}>
				<Router history={browserHistory}>
					<LastLocationProvider>
						<Routes />
					</LastLocationProvider>
				</Router>
			</ThemeProvider>
		);
	}
}
