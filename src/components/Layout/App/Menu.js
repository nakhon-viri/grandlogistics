import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Hidden from "@mui/material/Hidden";
import CloseIcon from "@mui/icons-material/Close";

import { useLocation, useNavigate } from "react-router-dom";

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

const ListLink = ({ to, text, icon }) => {
  let navigate = useNavigate();
  let { pathname } = useLocation();
  return (
    <ListItemButton
      sx={pathname === to ? styles.listButton : null}
      className={pathname === to ? " Mui-selected" : null}
      onClick={() => navigate(to)}
    >
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
          color: pathname === to ? "primary.main" : "text.secondary",
          opacity: opendrawer ? 1 : 0,
        }}
        primary={text}
      />
    </ListItemButton>
  );
};

const Menu = ({ handleDrawer2, open }) => {
  opendrawer = open;

  const Brand = ({ text, ...rest }) => (
    <Typography {...rest} variant="h5" sx={styles.nameBrand}>
      {text}
    </Typography>
  );

  const ListMenu = () => (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.headerBrand}>
          <img src="/img/loggrand.png" style={styles.logo} />
          <Box sx={styles.containerNameBrand(open)}>
            <Brand text="Grand" color="primary" />
            <Brand text="Logistics" />
            <Hidden mdUp>
              <CloseIcon onClick={handleDrawer2} sx={styles.closeBtn} />
            </Hidden>
          </Box>
        </Box>
        <Typography component="div" sx={styles.containerCard(open)}>
          <Avatar alt="Remy Sharp" src="/img/me.jpg" />
          <Box sx={{ ...styles.cardDetail, opacity: open ? 1 : 0 }}>
            <Typography variant="h6" sx={styles.nameUser}>
              This is Name.!!!
            </Typography>
            <Typography
              variant="p"
              color="text.secondary"
              sx={styles.department}
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
            sx={styles.listsubheader(open)}
            id="nested-list-subheader"
          >
            พนักงาน
          </ListSubheader>
        }
        sx={styles.list}
      >
        <ListLink to="/" text="Employee" icon={<MailIcon />} />
        <ListLink to="/register" text="Employee" icon={<MailIcon />} />
      </List>
      <List
        subheader={
          <ListSubheader
            component="li"
            sx={styles.listsubheader(open)}
            id="nested-list-subheader"
          >
            งาน
          </ListSubheader>
        }
        sx={styles.list}
      >
        <ListLink to="/order" text="Order" icon={<MailIcon />} />
      </List>
      <List
        subheader={
          <ListSubheader
            component="li"
            sx={styles.listsubheader(open)}
            id="nested-list-subheader"
          >
            ลูกค้า
          </ListSubheader>
        }
        sx={styles.list}
      >
        <ListLink to="/customer" text="Customer" icon={<MailIcon />} />
      </List>
    </>
  );

  return (
    <>
      <Hidden lgDown>
        <DrawerFull variant="permanent" sx={styles.drawer} open={open}>
          {ListMenu()}
        </DrawerFull>
      </Hidden>
      <Hidden lgUp>
        <MuiDrawer
          sx={styles.drawer}
          anchor={"left"}
          open={open}
          onClose={handleDrawer2}
        >
          {ListMenu()}
        </MuiDrawer>
      </Hidden>
    </>
  );
};

const styles = {
  drawer: {
    "& .MuiPaper-root": {
      border: "1px dashed rgba(145, 158, 171, 0.24)",
      borderBlock: 0,
      borderLeft: 0,
      overflowY: "overlay",
      borderRadius: 0,
      paddingInline: 0,
    },
    "& .MuiPaper-root::-webkit-scrollbar": {
      width: 10,
      background: "transparent",
      position: "absolute",
    },

    "& .MuiPaper-root::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "& .MuiPaper-root::-webkit-scrollbar-thumb": {
      background: "transparent",
    },
    "&:hover .MuiPaper-root::-webkit-scrollbar-thumb": {
      background: "#ddd",
      borderRadius: 2,
      border: "2px solid transparent",
      backgroundClip: "content-box",
    },
  },
  container: {
    padding: "24px 20px 16px",
    width: "100%",
    maxWidth: 360,
  },
  headerBrand: {
    display: "flex",
    animationDuration: "400ms",
  },
  logo: {
    width: 40,
    height: 40,
  },
  containerNameBrand: (open) => {
    return {
      display: "flex",
      marginLeft: 1,
      opacity: open ? 1 : 0,
    };
  },
  nameBrand: {
    fontFamily: "Prompt",
    fontWeight: "700",
  },
  containerCard: (open) => {
    return {
      padding: open ? "16px 20px" : "16px 0px",
      display: "flex",
      alignItems: "center",
      mt: 3,
      backgroundColor: open ? "rgba(145, 158, 171, 0.12)" : "none",
      borderRadius: 3,
      transition: "200ms  ",
    };
  },
  cardDetail: {
    ml: 2,
    maxHeight: "44px",
  },
  nameUser: {
    fontWeight: 600,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "150px",
  },
  department: {
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "150px",
    fontWeight: "600",
  },
  list: { padding: "0px 16px", maxWidth: 360, width: "100%" },
  listsubheader: (open) => {
    return {
      pt: 3,
      pb: 1,
      pl: 2,
      lineHeight: 1.5,
      color: "text.primary",
      opacity: open ? 1 : 0,
    };
  },
  listButton: {
    "&& .MuiTouchRipple-child": {
      backgroundColor: "#007bff",
    },
    backgroundColor: "#007bff14",
  },
  closeBtn: { position: "absolute", top: 10, right: 10 },
};

export default Menu;
