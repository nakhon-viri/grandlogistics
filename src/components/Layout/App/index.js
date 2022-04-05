import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "./Header";
import Drawer from "./Menu";
import ThemeProvider from "./Theme";
import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function AppLayOut() {
  const [open, setOpen] = React.useState(true);

  const matches = useMediaQuery("(min-width:1200px)");

  const handleDrawer = () => {
    setOpen(!open);
  };
  const handleDrawer2 = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider>
      <Box sx={{ display: matches ? "flex" : null }}>
        <CssBaseline />
        <AppBar handleDrawer={handleDrawer} open={open} />
        <Drawer handleDrawer2={handleDrawer2} open={open} />

        <Box component="main" sx={{ flexGrow: 1, p: "116px 8px" }}>
          <Outlet/>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
