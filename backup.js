import React, { useState, useEffect } from "react";
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
import FolderSharedTwoToneIcon from "@mui/icons-material/FolderSharedTwoTone";
import GroupAddTwoToneIcon from "@mui/icons-material/GroupAddTwoTone";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useLocation, useNavigate } from "react-router-dom";
import cloneDeep from "lodash.clonedeep";
import useMediaQuery from "@mui/material/useMediaQuery";

import { themeStore } from "../../../store/ThemeStore";
import { authStore } from "../../../store/AuthStore";
import { useSelector } from "react-redux";

const drawerWidth = 280;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
    // duration: "100ms",
  }),
  overflowX: "hidden",
  // backgroundColor: theme.palette.mode === "dark" && "rgb(22, 28, 36)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
    // duration: "100ms",
  }),
  overflowX: "hidden",
  width: 0,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(10)} + 7px)`,
  },
  // backgroundColor: theme.palette.mode === "dark" && "rgb(22, 28, 36)",
});

const DrawerFull = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  backgroundImage: "none",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
    "& .MuiDrawer-paper .drawerHover": { opacity: 1 },
    "& .MuiDrawer-paper .containerCardHover": {
      backgroundColor: "rgba(145, 158, 171, 0.12)",
      padding: "16px 20px",
    },
    "& .MuiDrawer-paper .titleName ": { opacity: 1 },
    "& .MuiDrawer-paper .listItemText ": { opacity: 1 },
    "& .MuiDrawer-paper .listsubheader ": { opacity: 1 },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
    "&:hover  .MuiDrawer-paper": {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: "hidden",
      backdropFilter: " blur(2px)",
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgb(22, 28, 36,0.85)"
          : "rgb(255, 255, 255,0.85)",
      boxShadow: "rgb(0 0 0 / 15%) 0px 24px 48px 0px",
    },
    "& .MuiDrawer-paper .drawerHover": { opacity: 0 },
    "&:hover  .MuiDrawer-paper .drawerHover ": { opacity: 1 },
    "& .MuiDrawer-paper .listItemText": { opacity: 0 },
    "&:hover  .MuiDrawer-paper .listItemText ": { opacity: 1 },
    "& .MuiDrawer-paper .listsubheader": { opacity: 0 },
    "&:hover  .MuiDrawer-paper .listsubheader ": { opacity: 1 },
    "& .MuiDrawer-paper .titleName": { opacity: 0 },
    "&:hover  .MuiDrawer-paper .titleName ": { opacity: 1 },
    "& .MuiDrawer-paper .containerCardHover": {
      backgroundColor: "none",
      padding: "16px 0px",
    },
    "&:hover  .MuiDrawer-paper .containerCardHover ": {
      backgroundColor: "rgba(145, 158, 171, 0.12)",
      padding: "16px 20px",
    },
  }),
}));

const Menu = ({ handleDrawer2, open }) => {
  const matches = useMediaQuery("(max-width:1200px)");
  let { profile } = useSelector(authStore);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (profile) {
      const user = cloneDeep(profile);
      setUser(user);
    }
  }, [profile]);

  const Brand = ({ text, ...rest }) => (
    <Typography {...rest} variant="h5" sx={styles.nameBrand}>
      {text}
    </Typography>
  );

  const ListGroup = ({ title, children }) => {
    let mode = useSelector(themeStore);
    return (
      <List
        subheader={
          <ListSubheader
            disableSticky
            component="li"
            className="listsubheader"
            sx={styles.listsubheader(mode)}
            id="nested-list-subheader"
          >
            {title}
          </ListSubheader>
        }
        sx={styles.list}
      >
        {children}
      </List>
    );
  };

  const ListLink = ({ to, text, icon }) => {
    let navigate = useNavigate();
    let { pathname } = useLocation();
    return (
      <ListItemButton
        sx={pathname === to ? styles.listButton : null}
        className={pathname === to ? " Mui-selected" : null}
        onClick={() => {
          if (matches) handleDrawer2();
          navigate(to);
        }}
      >
        <ListItemIcon
          sx={{
            ".Mui-selected > &": {
              color: (theme) => theme.palette.primary.main,
            },
            color: "text.secondary",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          className="listItemText"
          sx={{
            color: pathname === to ? "primary.main" : "text.secondary",
          }}
          primary={text}
        />
      </ListItemButton>
    );
  };

  const ListMenu = () => (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.headerBrand}>
          <img src="/img/loggrand.png" style={styles.logo} />
          <Box className="drawerHover" pt={0.5} sx={styles.containerNameBrand}>
            <Brand text="Grand" color="primary" />
            <Brand text="Logistics" />
          </Box>
        </Box>
        <Typography
          className="containerCardHover"
          component="div"
          sx={styles.containerCard}
        >
          <Avatar src={user?.photo || null} />
          <Box className="titleName" sx={styles.cardDetail}>
            <Typography variant="h6" sx={styles.nameUser}>
              {user?.full_name.first_name + " " + user?.full_name?.last_name}
            </Typography>
            <Typography
              variant="p"
              color="text.secondary"
              sx={styles.department}
            >
              {user?.role}
            </Typography>
          </Box>
        </Typography>
      </Box>
      <ListGroup title="พนักงาน">
        <ListLink to="/" text="พนักงานทั้งหมด" icon={<PersonRoundedIcon />} />
        <ListLink
          to="/register"
          text="ลงทะเบียนพนักงาน"
          icon={<GroupAddTwoToneIcon />}
        />
      </ListGroup>
      <ListGroup title="งาน">
        <ListLink
          to="/order"
          text="เที่ยววิ่งทั้งหมด"
          icon={<WorkRoundedIcon />}
        />
        <ListLink to="/addorder" text="เพิ่มงาน" icon={<AddBoxRoundedIcon />} />
      </ListGroup>
      <ListGroup title="ลูกค้า">
        <ListLink
          to="/customer"
          text="บริษัทคู่ค้า"
          icon={<StoreRoundedIcon />}
        />
        <ListLink
          to="/addcustomer"
          text="เพิ่มบริษัทคู่ค้า"
          icon={<AddBusinessRoundedIcon />}
        />
      </ListGroup>
      <ListGroup title="รายงาน">
        <ListLink to="/report" text="รายงาน" icon={<MailIcon />} />
        <ListLink
          to="/reportcustomer"
          text="รายงานบริษัทคู่ค้า"
          icon={<MailIcon />}
        />
        <ListLink
          to="/reportallemp"
          text="รายงานพนักงานทั้งหมด"
          icon={<MailIcon />}
        />
        <ListLink
          to="/reportemp"
          text="รายงานพนักงานรายบุคคล"
          icon={<MailIcon />}
        />
      </ListGroup>
      <ListGroup title="ใบแจ้งหนี้">
        <ListLink to="/bills" text="ใบวางบิล" icon={<FileCopyIcon />} />
        <ListLink
          to="/createbill"
          text="สร้างใบวางบิล"
          icon={<FileCopyIcon />}
        />
        <ListLink to="/invoices" text="ใบแจ้งหนี้" icon={<DescriptionIcon />} />
      </ListGroup>
      <ListGroup title="ถังขยะ">
        <ListLink to="/trash" text="ถังขยะ" icon={<DeleteRoundedIcon />} />
      </ListGroup>
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
  containerNameBrand: {
    display: "flex",
    marginLeft: 1,
  },
  nameBrand: {
    fontFamily: "Prompt",
    fontWeight: "700",
  },
  containerCard: {
    display: "flex",
    alignItems: "center",
    mt: 3,
    borderRadius: 3,
    transition: "200ms  ",
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
  listsubheader: (mode) => {
    return {
      pt: 3,
      pb: 1,
      pl: 2,
      lineHeight: 1.5,
      color: "text.primary",
      backgroundImage: "none",
      backgroundColor:
        mode === "dark" ? "rgb(22, 28, 36,0)" : "rgb(255, 255, 255, 0)",
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
