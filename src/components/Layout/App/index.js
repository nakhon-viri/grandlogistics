import { useState, useEffect } from "react";
import { CssBaseline, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import "dayjs/locale/th";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import { LocalizationProvider } from "@mui/lab";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { styled, useTheme } from "@mui/material/styles";

import AppBar from "./Header";
import Drawer from "./Menu";
import ThemeProvider from "./Theme";
import { authStore } from "../../../store/AuthStore";
import { upDateOneOrder } from "../../../store/OrderStore";
import { HttpClient } from "../../../utils/HttpClient";
import { io } from "socket.io-client";
const ContainerContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  ...(open && {
    marginLeft: 280,
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${280}px - 0px)`,
    },
  }),
  ...(!open && {
    width: `calc(100% -${theme.spacing(11)} + 1px)`,
    [theme.breakpoints.up("lg")]: {
      marginLeft: `calc(${theme.spacing(11)} + 1px)`,
    },
  }),
  // flexGrow: 1,
  padding: "116px 24px",
}));

export default function AppLayOut() {
  let { profile, isLogin } = useSelector(authStore);
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  let theme = useTheme();
  const matches = useMediaQuery("(min-width:1200px)");

  const handleDrawer = () => {
    setOpen(!open);
  };
  const handleDrawer2 = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!profile?.email && isLogin) {
      Swal.fire({
        title: "กรุณาใส่ email",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        confirmButtonText: "ยืนยัน",
        showLoaderOnConfirm: true,
        preConfirm: (email) => {
          return HttpClient.put("/personnel", { email })
            .then((response) =>
              response.data
                ? Swal.fire("อัปเดต email เสร็จสิ้น", "", "success")
                : null
            )
            .catch((error) => {
              Swal.showValidationMessage(
                `${error.response.data.error.message}`
              );
            });
        },
        allowOutsideClick: false,
      });
    }
  }, []);

  useEffect(() => {
    if (isLogin && !!profile) {
      // const newSocket = io("http://localhost:5000", {
        const newSocket = io("https://api-grandlogistics.herokuapp.com", {
        transports: ["websocket"],
      });
      // {
      //   secure: true,
      //   transports: ["websocket"],
      // }
      setSocket(newSocket);
      newSocket.emit("addUser", {
        token: "",
        _id: profile._id,
        platform: "web",
      });

      newSocket.on("_UpDateOrder", (order) => {
        console.log(order);
        dispatch(upDateOneOrder(order));
      });

      // return () => newSocket.close();
    }
  }, []);

  return (
    <ThemeProvider>
      <LocalizationProvider
        locale={"th"}
        dateFormats={{ year: "BBBB" }}
        dateAdapter={AdapterDayjs}
      >
        <Box sx={{ display: matches ? "flex" : null }}>
          <CssBaseline />
          <AppBar handleDrawer={handleDrawer} title={title} open={open} />
          <Drawer handleDrawer2={handleDrawer2} open={open} />

          <Box
            component="main"
            sx={{ flexGrow: 1, p: "116px 24px", overflow: "hidden" }}
          >
            <Outlet context={[title, setTitle, socket]} />
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
