import { createMuiTheme } from "@material-ui/core";

import palette    from "./palette";
import typography from "./typography";
import overrides  from "./overrides";

const theme = createMuiTheme({
	palette,
	typography,
	overrides,
	zIndex:      {
		appBar: 1200,
		drawer: 1100
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920
		}
	}
});

export default theme;
