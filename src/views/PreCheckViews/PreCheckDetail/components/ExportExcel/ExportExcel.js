import React from "react";
import moment from "moment";
import ReactExport from "react-export-excel";

import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";
import GetAppIcon from "@material-ui/icons/GetApp";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const useStyles = MS.makeStyles((theme) => ({
	button: {
		padding: 0,
		borderRadius: 0,
		width: 140,
		height: 40,
		border: "1px solid rgb(51, 51, 51, 0.2)",
		[theme.breakpoints.down("xs")]: {
			width: "100%",
		},
	},
}));

const Download = (props) => {
	const classes = useStyles();

	const dateFormat = (timestamp, isTime) => {
		if (isTime) {
			return moment(timestamp).format("YYYY-MM-DD hh:mm");
		} else {
			return moment(timestamp).format("YYYY-MM-DD");
		}
	};

	return (
		<div>
			{props.disabled ? (
				<MC.Button
					size="large"
					disableElevation
					className={classes.button}
					startIcon={<GetAppIcon fontSize={"small"} />}
					disabled={props.disabled}
				>
					엑셀다운로드
				</MC.Button>
			) : (
				<ExcelFile
					filename={"하자내용_" + moment().format("LL")}
					element={
						<MC.Button
							size="large"
							disableElevation
							startIcon={<GetAppIcon fontSize={"small"} />}
							className={classes.button}
						>
							엑셀다운로드
						</MC.Button>
					}
				>
					<ExcelSheet data={props.dataSet} name="하자내용">
						<ExcelColumn
							label="구분"
							value={(col) =>
								col.defectType === "LIVING_ROOM"
									? "거실"
									: col.defectType === "ROOM"
									? "방"
									: col.defectType === "KITCHEN"
									? "주방"
									: col.defectType === "MAIN_DOOR"
									? "현관문"
									: col.defectType === "VERANDA"
									? "베란다"
									: col.defectType === "BATHROOM"
									? "욕실"
									: col.defectType === "ETC" && "기타"
							}
						/>
						<ExcelColumn label="하자내용" value={(col) => col.content} />
						<ExcelColumn
							label="등록일"
							value={(col) =>
								dateFormat(col.baseDateDataType.lastModifiedDate, false)
							}
						/>
					</ExcelSheet>
				</ExcelFile>
			)}
		</div>
	);
};

export default Download;
