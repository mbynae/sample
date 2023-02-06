import React, {useState} from "react";
import * as MC from "@material-ui/core";
import * as MS from "@material-ui/styles";

const useStyles = MS.makeStyles(theme => ({

}));

const a11yProps = index => {
    return {
        id:              `tab-${index}`,
        "aria-controls": `tabpanel-${index}`
    };
};

const AntTabs = MS.withStyles((theme) => ({
    root:          {
        paddingLeft:  theme.spacing(1),
        width:        "100%",
        "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.04)"
    },
    scrollButtons: {
        color: "#222222"
    },
    indicator:     {
        display:         "flex",
        justifyContent:  "center",
        backgroundColor: "transparent",
        // height:          4,
        "& > span": {
            // maxWidth:        "100%",
            // height:          4,
            width:           "100%",
            backgroundColor: "#42a5f5"
        }
    }
}))((props) => <MC.Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const AntTab = MS.withStyles((theme) => ({
    root:     {
        textTransform: "none",
        fontSize:      18,
        minWidth:      72,
        color:         "#bcbcbc",
        marginRight:   theme.spacing(1),
        height:        60,
        "&:hover":     {
            color:   "#42a5f5",
            opacity: 1
        },
        "&$selected":  {
            color:      "#222222",
            fontSize:   18,
            fontWeight: theme.typography.fontWeightBold
        },
        "&:focus":     {
            color: "#222222"
        }
    },
    selected: {}
}))((props) => <MC.Tab {...props} />);

const ResrvTabs = props => {
    const classes = useStyles();

    const {value, setValue, handleChange} = props;

    return (
        <div className={"lmsTabs"}>
            <MC.AppBar position="static" elevation={0}>
                <AntTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs"
                    classes={{
                        scrollButtons: classes.scrollButtons
                    }}
                    variant="fullWidth"
                    style={{backgroundColor : "#F8F8FF"}}
                    textColor="primary"
                >
                    <AntTab label={"시설예약"} {...a11yProps(0)} />
                    <AntTab label={"강좌예약"} {...a11yProps(1)} />
                </AntTabs>
            </MC.AppBar>
        </div>
    )
};

export default ResrvTabs;
