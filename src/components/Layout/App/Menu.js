import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import MailIcon from "@mui/icons-material/Mail";
import AddModeratorTwoToneIcon from "@mui/icons-material/AddModeratorTwoTone";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import StarBorder from "@mui/icons-material/StarBorder";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Hidden from "@mui/material/Hidden";
import CloseIcon from "@mui/icons-material/Close";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 280;
let opendrawer;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(10)} + 7px)`,
  },
});

const DrawerFull = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const ListLink2 = (props) => {
  let { pathname } = useLocation();
  const MyNavLink = React.useMemo(
    () =>
      React.forwardRef((navLinkProps, ref) => {
        const { className: previousClasses, ...rest } = navLinkProps;
        const elementClasses = previousClasses?.toString() ?? "";
        return (
          <NavLink
            {...rest}
            ref={ref}
            to={props.to}
            end
            className={({ isActive }) =>
              isActive ? elementClasses + " Mui-selected" : elementClasses
            }
          />
        );
      }),
    [props.to]
  );

  return (
    <ListItemButton
      component={MyNavLink}
      sx={pathname === props.to ? styles.listButton : null}
    >
      <ListItemIcon
        sx={{
          ".Mui-selected > &": { color: (theme) => theme.palette.primary.main },
        }}
      >
        {props.icon}
      </ListItemIcon>
      <ListItemText
        sx={{
          color: pathname === props.to ? "primary.main" : "text.secondary",
          opacity: props.open ? 1 : 0,
        }}
        primary={props.text}
      />
    </ListItemButton>
  );
};

const ListLink = ({ to, text, icon }) => {
  let navigate = useNavigate();
  let { pathname } = useLocation();
  return (
    <ListItemButton onClick={() => navigate(to)} sx={styles.listButton}>
      <ListItemIcon
        sx={{
          ".Mui-selected > &": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        sx={{
          color: pathname === "/" ? "primary.main" : "text.secondary",
          opacity: opendrawer ? 1 : 0,
        }}
        primary={text}
      />
    </ListItemButton>
  );
};

const Menu = ({ handleDrawer2, open }) => {
  opendrawer = open;

  const ListMenu = () => (
    <>
      <Box sx={styles.drawerHeader}>
        <Box
          sx={{
            display: "flex",
            animationDuration: "400ms",
          }}
        >
          <img src="/img/loggrand.png" style={{ width: 40, height: 40 }} />
          <Box
            sx={{
              display: "flex",
              opacity: open ? 1 : 0,
              marginLeft: 1,
            }}
          >
            <Typography
              color="primary"
              variant="h5"
              sx={{ fontFamily: "Prompt", fontWeight: "700" }}
            >
              Grand
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontFamily: "Prompt", fontWeight: "700" }}
            >
              Logistics
            </Typography>
            <Hidden mdUp>
              <CloseIcon
                onClick={handleDrawer2}
                sx={{ position: "absolute", top: 10, right: 10 }}
              />
            </Hidden>
          </Box>
        </Box>
        <Typography
          component="div"
          sx={{
            padding: open ? "16px 20px" : "16px 0px",
            display: "flex",
            alignItems: "center",
            mt: 3,
            backgroundColor: open ? "rgba(145, 158, 171, 0.12)" : "none",
            borderRadius: 3,
            transition: "200ms  ",
          }}
        >
          <Avatar alt="Remy Sharp" src="/img/me.jpg" />
          <Box
            sx={{
              ml: 2,
              maxHeight: "44px",
              opacity: open ? 1 : 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "150px",
              }}
            >
              This is Name.!!!
            </Typography>
            <Typography
              variant="p"
              color="text.secondary"
              sx={{
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "150px",
                fontWeight: "600",
              }}
            >
              admin
            </Typography>
          </Box>
        </Typography>
      </Box>
      <List
        subheader={
          <ListSubheader
            component="li"
            sx={styles.listsubheader}
            id="nested-list-subheader"
          >
            พนักงาน
          </ListSubheader>
        }
      >
        <ListLink2 open={open} to="/" text="Employee" icon={<MailIcon />} />
        <ListLink to="/register" text="Employee" icon={<MailIcon />} />
        {ListLink("/", "Employee", () => (
          <MailIcon />
        ))}
      </List>
    </>
  );

  return (
    <>
      <Hidden mdDown>
        <DrawerFull variant="permanent" sx={styles.drawer} open={open}>
          {ListMenu()}
        </DrawerFull>
      </Hidden>
      <Hidden mdUp>
        <MuiDrawer anchor={"left"} open={open} onClose={handleDrawer2}>
          {ListMenu()}
        </MuiDrawer>
      </Hidden>
    </>
  );
};

const styles = {
  drawer: {
    "& .MuiPaper-root": {
      borderStyle: "dashed",
      borderBlock: "none",
      borderLeft: "none",
    },
  },
  drawerHeader: {
    padding: "24px 20px 16px",
    width: "100%",
    maxWidth: 360,
  },
  listsubheader: {
    pt: 3,
    pb: 1,
    pl: 2,
    lineHeight: 1.5,
    color: "text.primary",
    opacity: open ? 1 : 0,
  },
  listButton: {
    "&& .MuiTouchRipple-child": {
      backgroundColor: "#007bff",
    },
    backgroundColor: "#007bff14",
  },
};

export default Menu;
