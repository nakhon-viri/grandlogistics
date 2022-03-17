import React from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";

import { upDateLogin } from "../../../store/Auth";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

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
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px - 0px)`,
    },
  }),
  ...(!open && {
    width: `100%`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${theme.spacing(11)} + 1px)`,
    },
  }),
  boxShadow: "none",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
}));

const Header = ({ handleDrawer, open }) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <AppBar position="fixed" open={open} sx={{ zIndex: 10 }}>
      <Toolbar>
        <div style={{ flex: 1, justifyContent: "start" }}></div>
        <div>
          <IconButton
            // aria-label="open drawer"
            onClick={() => handleDrawer()}
            edge="start"
            sx={{
              marginX: 1,
              color: "#faf",
            }}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <IconButton
          sx={{
            marginX: 1,
            // color: "#faf",
          }}
          color="primary"
          onClick={() => {
            navigate("/login");
          }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          sx={{
            marginX: 1,
            color: "#faf",
          }}
          onClick={() => dispatch(upDateLogin(false))}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
