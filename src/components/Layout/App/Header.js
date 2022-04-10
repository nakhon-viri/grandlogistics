import React from "react";
import MuiAppBar from "@mui/material/AppBar";
import { Avatar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

import { themeStore, upDateTheme } from "../../../store/ThemeStore";
import { authStore } from "../../../store/AuthStore";
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
      // duration: "100ms",
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
      // duration: "100ms",
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

const Header = ({ handleDrawer, open, title }) => {
  let dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  let { profile } = useSelector(authStore);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.removeItem("ACTO");
    window.location.reload();
  };
  const handleTheme = () => {
    dispatch(upDateTheme());
  };
  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        sx={{ zIndex: 10, color: theme.palette.text.primary }}
      >
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

          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "Itim",
              fontWeight: 600,
              fontSize: "1.8rem",
            }}
          >
            {title}
          </Typography>
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
            disableRipple
            disableFocusRipple
            color="secondary"
            aria-controls={openMenu ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            sx={{
              marginX: 1,
              p: 0,
            }}
            onClick={handleClick}
          >
            <Avatar src={profile?.photo || null} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          sx: { p: 0 },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            p: 0,
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box p={1}>
          <MenuItem
            sx={{
              width: "100%",
              borderRadius: "8px",
            }}
            onClick={() => navigate("/profile")}
          >
            <ListItemIcon>
              <ManageAccountsIcon fontSize="small" />
            </ListItemIcon>
            โปรไฟล์
          </MenuItem>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        <Box p={1}>
          <MenuItem
            sx={{
              width: "100%",
              borderRadius: "8px",
            }}
            onClick={() => logOut()}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default Header;
