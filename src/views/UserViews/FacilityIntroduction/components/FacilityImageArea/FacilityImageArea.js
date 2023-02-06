import React          from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({
	container: {
		minHeight: 300,
	},
	image: {
		maxWidth: 300,
		maxHeight: 225,
		height: 225
	},
	noImage: {
		width: 225,
		height: 225,
		borderRadius: 150,
		color: "#C0C0C0",
		textAlign: "center",
		fontWeight: "bold",
		border: "1px solid #CCCCCC",
		paddingTop: 100
	},
}));


const FacilityImageArea = props => {
	const classes = useStyles();

	const {fcltAttachedFile} = props;

	const NoImageAvailable = (value) => {
		const result = [];

		for(let i=0; i < 3-value; i++) {
			result.push(<div key={i} className={classes.noImage}>이미지 없음</div>);
		}
		return result;
	};

	return (
		<MC.Grid container direction="row" justify="space-around" alignItems="center" className={classes.container}>
			{
				fcltAttachedFile && fcltAttachedFile.length > 0 &&
					fcltAttachedFile.map((file, index) => (
						<MC.Grid item key={index}>
							<img className={classes.image} src={file.imag_path} />
						</MC.Grid>
					))
			}
			{NoImageAvailable(fcltAttachedFile.length)}
		</MC.Grid>
	);
};

export default FacilityImageArea;
