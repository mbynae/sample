import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import "moment-timezone";

import * as serviceWorker from "./serviceWorker";
import App from "./App";
import rootStore from "./stores/root.store";

ReactDOM.render(
	<Provider {...rootStore}>
		<App />
	</Provider>,
	document.getElementById("root")
);

serviceWorker.unregister();
