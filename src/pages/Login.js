import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingButton from "@mui/lab/LoadingButton";

import { loginReq, authStore } from "../store/AuthStore";
import { useDispatch, useSelector } from "react-redux";
const theme = createTheme();

const Login = () => {
  const matches = useMediaQuery("(min-width:768px)");
  const dispatch = useDispatch();
  const { loadingAuth, error } = useSelector(authStore);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const account = {
      _uid: data.get("username"),
      password: data.get("password"),
    };
    dispatch(loginReq(account));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <CssBaseline />
        <Box sx={styles.bgImg} />
        <Box sx={styles.containerForm(matches)}>
          <Box sx={styles.containerBrand}>
            <Avatar sx={styles.logo} src="/img/loggrand.png" />
            <Typography sx={styles.nameBrand}>
              <span style={{ color: "#007bff" }}>Grand</span>
              <br />
              Logistics
            </Typography>
          </Box>
          <Typography sx={styles.textLogin}>
            ลงชื่อเข้าใช้บัญชีของคุณ
          </Typography>
          <Box
            component="form"
            validate
            onSubmit={handleSubmit}
            sx={styles.form}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              error={error ? true : false}
              id="username"
              label="ชื่อผู้ใช้"
              name="username"
              autoComplete="username"
              InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
              autoFocus
              sx={styles.inputField}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type="password"
              id="password"
              error={error ? true : false}
              helperText={error ? error : null}
              InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
              autoComplete="current-password"
              sx={styles.inputField}
            />
            <LoadingButton
              type="submit"
              fullWidth
              loading={loadingAuth ? true : false}
              variant="contained"
              sx={styles.btnSubmit}
            >
              Sign In
            </LoadingButton>

            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const styles = {
  bgImg: {
    backgroundImage: "url(/img/loginscreen.jpg)",
    backgroundColor: (t) => t.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  containerForm: (matches) => {
    return {
      display: "flex",
      flexDirection: "column",
      width: matches ? 385 : "100%",
      height: "100vh",
      backgroundColor: "#fff",
      padding: "50px",
      paddingTop: 20,
      zIndex: 2,
      position: "absolute",
      left: 0,
    };
  },
  containerBrand: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    mr: 2,
  },
  nameBrand: {
    lineHeight: 0.9,
    fontFamily: "Prompt",
    fontWeight: "700",
    fontSize: "2.8em",
    justifyContent: "center",
  },
  textLogin: {
    fontFamily: "Sarabun",
    fontWeight: 700,
    letterSpacing: "0.8px",
    fontSize: "1.65em",
  },
  form: {
    mt: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputField: {
    borderRadius: 2,
    margin: "24px 0px 0px 0px",
    "& fieldset": {
      borderRadius: 2,
    },
  },
  btnSubmit: {
    backgroundColor: "rgb(32, 101, 209)",
    boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
    borderRadius: 2,
    minWidth: 16,
    margin: "32px 0px 20px 0px",
    width: "60%",
    height: 40,
    "&:hover": {
      boxShadow: "none",
    },
  },
};

export default Login;
