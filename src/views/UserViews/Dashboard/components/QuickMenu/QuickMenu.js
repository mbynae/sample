import React, { useEffect, useState } from "react";

import * as MC  from "@material-ui/core";
import * as MS  from "@material-ui/styles";
import { toJS } from "mobx";

const useStyles = MS.makeStyles(theme => ({
	root:       {
		position:  "absolute",
		top:       150,
		right:     0,
		width:     120,
		zIndex:    1000,
		borderTop: "2px solid #449CE8"
	},
	iconLayout: {
		height:          120,
		width:           "100%",
		backgroundColor: "#fff",
		cursor:          "pointer"
	}

}));
const QuickMenu = props => {
	const classes = useStyles();
	const { rootUrl, history, aptComplex, UserAptComplexStore } = props;
	const [menu, setMenu] = useState();

  useEffect(() => {
		const init = () => {
			setMenu(prev => {
				let temp = toJS(UserAptComplexStore.menus).find(menu => menu.menuKey === "extraService");
				temp.childMenus = temp.childMenus.filter(menu => !(menu.menuKey === "preCheck" || menu.menuKey === "moveReservation" || menu.menuKey === "reservation"));
				temp.childMenus = temp.childMenus.filter(menu => menu.isViewForUser);
				let index = temp.childMenus.findIndex(menu => menu.menuKey === "residentReservation");
				if ( !UserAptComplexStore.aptComplex.contractInformationDataType.isResidentReservation ) {
					temp.childMenus.splice(index, 1);
				}
				return {
					...temp
				};
			});
		};
		setTimeout(() => {
			init();
		}, 100);

	}, []);

	const goMenu = (menuKey) => {
		if ( menuKey === "myPage" ) {
			history.push({
				pathname: `${rootUrl}/${menuKey}`,
				state:    { value: 2 }
			});
		} else if ( menuKey === "visitingCar") {
			// 퀵메뉴에서 방문차량예약 선택시 방문차량예약 예약 기능으로 이동
			history.push(`${rootUrl}/${menuKey}/edit`);
		}
		else {
			history.push(`${rootUrl}/${menuKey}`);
		}
	};

	return (
		<MC.Grid
			container
			direction="column"
			justify={"center"}
			alignItems={"center"}
			className={classes.root}>

			<MC.Grid item className={classes.iconLayout} onClick={() => goMenu("myPage/2/0")}>
				<MC.Grid container direction="column" justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
					<MC.Grid item>
						<img src={"/images/icons/floating-01-icon.svg"} width={40} height={40} />
					</MC.Grid>
					<MC.Grid item style={{ marginTop: 10 }}>
						<MC.Typography variant="body1">
							관리비조회
						</MC.Typography>
					</MC.Grid>
				</MC.Grid>
			</MC.Grid>

			{
				menu && menu.childMenus.map((childMenu, index) => (
					<MC.Grid key={index} item className={classes.iconLayout} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }} onClick={() => goMenu(childMenu.menuKey)}>
						<MC.Grid container direction="column" justify={"center"} alignItems={"center"} style={{ height: "100%" }}>
							<MC.Grid item>
								<img src={`/images/icons/${childMenu.menuKey}.svg`} width={40} height={40} />
							</MC.Grid>
							<MC.Grid item style={{ marginTop: 10 }}>
								<MC.Typography variant="body1">
									{childMenu.title}
								</MC.Typography>
							</MC.Grid>
						</MC.Grid>
					</MC.Grid>
				))
			}

		</MC.Grid>
	);
};

export default QuickMenu;
