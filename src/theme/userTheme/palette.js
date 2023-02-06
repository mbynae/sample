import { colors } from "@material-ui/core";

const white = "#FFFFFF";
const black = "#000000";
const divider2 = "#f4f6f8";

export default {
	black,
	white,
	primary:    {
		contrastText: white,
		main:         "#449CE8"
	},
	secondary:  {
		contrastText: white,
		main:         "#4A4745"
	},
	fontColor:  {
		color1: "#4A4A4A",
		color2: "#636363",
		color3: "#818181",
		color4: "#898989",
		color5: "#909090",
		color6: "#929292",
		color7: "#BCBCBC",
		color8: "#FFFFFF"
	},
	success:    {
		contrastText: white,
		dark:         colors.green[900],
		main:         colors.green[600],
		light:        colors.green[400]
	},
	info:       {
		contrastText: white,
		dark:         colors.blue[900],
		main:         colors.blue[600],
		light:        colors.blue[400],
		moreLight:    colors.blue[100]
	},
	warning:    {
		contrastText: white,
		dark:         colors.orange[900],
		main:         colors.orange[600],
		light:        colors.orange[400]
	},
	error:      {
		contrastText: white,
		dark:         colors.red[900],
		main:         colors.red[600],
		light:        colors.red[400]
	},
	text:       {
		primary:   colors.blueGrey[900],
		secondary: colors.blueGrey[600],
		link:      colors.blue[600]
	},
	background: {
		default: "#FAFAFA",
		paper:   white,
		white:   "#FFFFFF",
		grey:    "#FAFAFA"
	},
	icon:       colors.blueGrey[600],
	divider:    colors.grey[200],
	divider2
};
