import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { themeStore } from "../../../store/ThemeStore";
import { useSelector } from "react-redux";

export default function Theme({ children }) {
  let mode = useSelector(themeStore);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#007bff",
          },
          text: {
            primary: mode === "dark" ? "#fff" : "#000",
            secondary: "#7c8d9c",
          },
          ...(mode === "dark" && {
            background: {
              default: "rgb(22, 28, 36)",
              paper: "rgb(33, 43, 54)",
            },
          }),
        },
        typography: {
          fontFamily: "Sarabun",
        },
        components: {
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBlockWidth: 0,
                borderRadius: 0,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: "16px",
                paddingInline: 8,
                backgroundImage: "none",
                boxShadow:
                  mode === "dark"
                    ? "rgb(0 0 0 / 20%) 0px 0px 2px 0px, rgb(0 0 0 / 12%) 0px 12px 24px -4px"
                    : "rgb(134 147 160 / 20%) 0px 0px 2px 0px, rgb(134 147 160 / 12%) 0px 12px 24px -4px",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                minHeight: "48px",
                borderRadius: "8px",
                marginBottom: "4px",
                "&& .MuiTouchRipple-rippleVisible": {
                  animationDuration: "400ms",
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                minWidth: "auto",
                marginRight: "16px",
                width: "22px",
                height: "22px",
              },
            },
          },
        },
      }),
    [mode]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
