import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Zoom, Paper, Container, Button } from "@mui/material";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

import { loginReq, authStore } from "../store/AuthStore";
import { useDispatch, useSelector } from "react-redux";
import { HttpClient } from "../utils/HttpClient";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const ForgetPassword = ({ open, handleClose }) => {
  const [err, setErr] = useState("");
  const [loadingForgetPassword, setLoadingForgetPassword] = useState(false);
  const [finish, setFinish] = useState(false);
  const validate = (email) => {
    let err = "";
    if (!validateEmail(email)) err = "ที่อยู่ email ไม่ถูกต้อง";
    if (!email) err = "กรุณาป้อนที่อยู่ email";
    setErr(err);
    if (!err) return true;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let email = data.get("email");
    if (validate(email)) {
      try {
        setLoadingForgetPassword(true);
        let { data } = await HttpClient.post("/personnel/forgotPassword", {
          email,
        });
        setFinish(true);
      } catch (error) {
        if (error.response.data.error.message === "ไม่มี email นี้อยู่ในระบบ") {
          setErr(error.response.data.error.message);
        }
        console.log(error.response.data.error.message);
      } finally {
        setLoadingForgetPassword(false);
      }
    }
  };

  const FromForgetPassword = () => (
    <Paper
      sx={{
        p: 3,
        overflow: "hidden",
        borderRadius: 3,
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Box sx={{ px: { xs: 1, sm: 9, xl: 10 } }}>
        <Typography
          variant="h4"
          sx={{ fontSize: "2rem", fontFamily: "Itim", textAlign: "center" }}
        >
          กรุณาป้อนที่อยู่ email สำหรับรหัสผ่านใหม่
        </Typography>
      </Box>
      <TextField
        id="outlined-basic"
        sx={styles.inputField}
        placeholder="กรุณาป้อนที่อยู่ email"
        fullWidth
        name="email"
        variant="outlined"
        error={!!err}
        helperText={!!err ? err : null}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <LoadingButton
          loading={loadingForgetPassword}
          type="submit"
          variant="contained"
          sx={styles.btnSubmitForgetPassword}
        >
          ยืนยัน
        </LoadingButton>
      </Box>
    </Paper>
  );

  const FromFinish = () => (
    <Paper
      sx={{
        p: 3,
        overflow: "hidden",
        borderRadius: 3,
      }}
    >
      <Box sx={{ px: { xs: 1, sm: 9, xl: 10 } }}>
        <Typography
          variant="h4"
          sx={{ fontSize: "2rem", fontFamily: "Itim", textAlign: "center" }}
        >
          เราได้ส่งรหัสผ่านใหม่ไปให้คุณแล้ว กรุราเช็ค email ของคุณ
          และกรุณาเปลียนรหัสผ่าน
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={() => {
            setFinish(false);
            handleClose();
          }}
          sx={styles.btnSubmitForgetPassword}
        >
          ยืนยัน
        </Button>
      </Box>
    </Paper>
  );

  const FromAuth = () => {
    if (finish) return FromFinish();
    return FromForgetPassword();
  };

  return (
    <Dialog
      PaperComponent={Box}
      onClose={() => {
        loadingForgetPassword ? null : (handleClose(), setFinish(false));
      }}
      TransitionComponent={Transition}
      open={open}
    >
      <Container disableGutters>{FromAuth()}</Container>
    </Dialog>
  );
};

const Login = () => {
  const theme = createTheme();
  const matches = useMediaQuery("(min-width:768px)");
  const dispatch = useDispatch();
  const { loadingAuth, error } = useSelector(authStore);
  const [open, setOpen] = useState(false);

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
        <ForgetPassword open={open} handleClose={() => setOpen(false)} />
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
            sx={{
              p: 2,
              mt: 3,
              mb: -2,
              bgcolor: "rgb(0, 110, 255,0.2)",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box align="center" sx={{ display: "flex", flexGrow: 1,justifyContent:"center" }}>
              <ErrorRoundedIcon sx={{ color: "#4e93ed" }} />
              <Typography
                variant="h7"
                sx={{ pb: 1, ml: 1, fontFamily: "Itim", color: "#146bc9" }}
              >
                อยู่ในช่วงทดลอง
              </Typography>
            </Box>
            <Typography
              variant="h7"
              align="center"
              sx={{ fontWeight: 500, fontFamily: "Itim", color: "#146bc9" }}
            >
              ชื่อผู้ใช้ :{" "}
              <Typography
                component={"span"}
                sx={{ fontWeight: 600, fontFamily: "Itim", color: "#255594" }}
              >
                6501020012
              </Typography>
            </Typography>
            <Typography
              variant="h7"
              align="center"
              sx={{
                fontWeight: 500,
                fontFamily: "Itim",
                color: "#146bc9",
                textAlign: "center",
              }}
            >
              รหัสผ่าน :{" "}
              <Typography
                component={"span"}
                sx={{ fontWeight: 600, fontFamily: "Itim", color: "#255594" }}
              >
                12345678
              </Typography>
            </Typography>
          </Box>
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

            <Typography
              color="primary"
              variant="body2"
              onClick={() => setOpen(true)}
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                userSelect: "none",
              }}
            >
              Forgot password?
            </Typography>
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
  btnSubmitForgetPassword: {
    backgroundColor: "rgb(32, 101, 209)",
    boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
    borderRadius: 2,
    mt: 3,
    height: 40,
    "&:hover": {
      boxShadow: "none",
    },
  },
};

export default Login;
