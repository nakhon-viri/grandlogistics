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

import { themeStore } from "../../../store/ThemeStore";
import { useSelector } from "react-redux";

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
          color: "text.secondary",
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

const ListGroup = ({ title, children }) => {
  let mode = useSelector(themeStore);
  return (
    <List
      subheader={
        <ListSubheader
          component="li"
          sx={styles.listsubheader(opendrawer, mode)}
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

const Menu = ({ handleDrawer2, open }) => {
  opendrawer = open;

  let mode = useSelector(themeStore);

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
              This is Name.!!!dfgsdfgsdfgdfsgsdfgkkkkkkkkkk
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
        <ListLink to="/createbill" text="สร้างใบวางบิล" icon={<FileCopyIcon />} />
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
        <DrawerFull variant="permanent" sx={styles.drawer(mode)} open={open}>
          {ListMenu()}
        </DrawerFull>
      </Hidden>
      <Hidden lgUp>
        <MuiDrawer
          sx={styles.drawer(mode)}
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
  drawer: (mode) => {
    return {
      "& .MuiPaper-root": {
        border: "1px dashed rgba(145, 158, 171, 0.24)",
        borderBlock: 0,
        borderLeft: 0,
        overflowY: "overlay",
        borderRadius: 0,
        paddingInline: 0,
        backgroundColor: mode === "dark" && "rgb(22, 28, 36)",
      },
      "& .MuiDrawer-paper": {
        backgroundImage: "none",
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
    };
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
  listsubheader: (open, mode) => {
    return {
      pt: 3,
      pb: 1,
      pl: 2,
      lineHeight: 1.5,
      color: "text.primary",
      opacity: open ? 1 : 0,
      backgroundColor: mode === "dark" && "rgb(22, 28, 36)",
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
