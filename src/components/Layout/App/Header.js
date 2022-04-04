import React from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { themeStore, upDateTheme } from "../../../store/ThemeStore";
import { useSelector, useDispatch } from "react-redux";

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,

    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${drawerWidth}px - 0px)`,
    },
  }),
  ...(!open && {
    width: `100%`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${theme.spacing(11)} + 1px)`,
    },
  }),
  boxShadow: "none",
  borderRadius: 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgb(22, 28, 36, 0.8)"
      : "rgba(255, 255, 255, 0.8)",
}));

const Header = ({ handleDrawer, open }) => {
  let dispatch = useDispatch();
  const theme = useTheme();
  // let mode = useSelector(themeStore);
  const logOut = () => {
    localStorage.removeItem("ACTO");
    window.location.reload();
  };
  const handleTheme = () => {
    dispatch(upDateTheme());
  };
  return (
    <AppBar position="fixed" open={open} sx={{ zIndex: 10 }}>
      <Toolbar>
        <IconButton
          onClick={() => handleDrawer()}
          edge="start"
          sx={{
            marginX: 1,
            color: "#faf",
          }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ flex: 1 }} />
        <IconButton
          color="secondary"
          sx={{
            marginX: 1,
            // color: ,
          }}
          onClick={handleTheme}
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
        <IconButton
          color="secondary"
          sx={{
            marginX: 1,
            // color: ,
          }}
          onClick={() => logOut()}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
