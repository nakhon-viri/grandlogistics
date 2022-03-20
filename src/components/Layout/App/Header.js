import React from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
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
  backgroundColor: "rgba(255, 255, 255, 0.8)",
}));

const Header = ({ handleDrawer, open }) => {
  const logOut = () => {
    localStorage.removeItem("ACTO");
    window.location.reload();
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
          sx={{
            marginX: 1,
            color: "#faf",
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
