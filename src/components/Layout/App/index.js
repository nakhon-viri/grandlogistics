import { useState, useEffect } from "react";
import { CssBaseline, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import "dayjs/locale/th";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import { LocalizationProvider } from "@mui/lab";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Swal from "sweetalert2";

import AppBar from "./Header";
import Drawer from "./Menu";
import ThemeProvider from "./Theme";
import { authStore } from "../../../store/AuthStore";
import { HttpClient } from "../../../utils/HttpClient";

export default function AppLayOut() {
  let { profile, isLogin } = useSelector(authStore);
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("");

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

          <Box component="main" sx={{ flexGrow: 1, p: "116px 24px" }}>
            <Outlet context={[title, setTitle]} />
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
