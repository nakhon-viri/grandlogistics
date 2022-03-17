import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // mode: "dark",
    primary: {
      info: "#a12",
      main: "#007bff",
    },
    secondary: {
      main: "#11cb5f",
    },
    text: {
      // primary: "#000",
      secondary: "#8595a3",
    },
    // background: {
    //   default: " rgb(22, 28, 36)",
    //   paper: "rgb(22, 28, 36)",
    // },
  },
  typography: {
    fontFamily: "Sarabun",
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          padding: "0px 16px",
          width: "100%",
          maxWidth: 360,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          zIndex: 11,
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
});

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
