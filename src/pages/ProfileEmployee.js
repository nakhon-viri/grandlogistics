import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AddAPhoto } from "@mui/icons-material";
import React from "react";

import useHover from "../hooks/UseHover";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 35,
  height: 20,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(15px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 15,
    height: 15,
    borderRadius: "50%",
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const ProfileEmployee = () => {
  let [y, x] = useHover();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const account = {
      _uid: data.get("username"),
      password: data.get("password"),
    };
    dispatch(loginReq(account));
  };
  return (
    <Container>
      <Box component="form" validate onSubmit={handleSubmit} sx={styles.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ py: 10, px: 3, position: "relative" }}>
              <Box
                component={"span"}
                sx={{
                  height: "22px",
                  minWidth: "22px",
                  lineHeight: 0,
                  borderRadius: "6px",
                  cursor: "default",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  justifyContent: "center",
                  padding: "0px 8px",
                  color: "rgb(255, 164, 141)",
                  fontSize: "0.75rem",
                  backgroundColor: "rgba(255, 72, 66, 0.16)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                }}
              >
                {"Active"}
              </Box>
              <Box sx={{ mb: "40px" }}>
                <Box
                  sx={{
                    margin: "auto",
                    width: 144,
                    height: 144,
                    borderRadius: "50%",
                    p: 1,
                    border: "1px dashed rgba(145, 158, 171, 0.32)",
                  }}
                >
                  <Button
                    sx={{
                      borderRadius: "50%",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      outline: "none",
                      width: "100%",
                      height: "100%",
                      p: 0,
                    }}
                  >
                    <input
                      {...x}
                      type="file"
                      autoComplete="off"
                      style={{
                        width: "100%",
                        position: "absolute",
                        height: "100%",
                        appearance: "none",
                        backgroundColor: "initial",
                        cursor: "pointer",
                        alignItems: "baseline",
                        color: "inherit",
                        textOverflow: "ellipsis",
                        whiteSpace: "pre",
                        textAlign: "start",
                        padding: "initial",
                        border: "initial",
                        overflow: "hidden",
                        zIndex: 2,
                        opacity: 0,
                      }}
                    />
                    <Box
                      component={"span"}
                      sx={{
                        overflow: "hidden",
                        backgroundSize: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Box
                        component={"img"}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        src="/img/me.jpg"
                        alt=""
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        position: "absolute",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                        color: "#fff",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgb(22, 28, 36,0.5)",
                        opacity: y ? 1 : 0,
                      }}
                      component={"div"}
                    >
                      <AddAPhoto />
                      <Typography
                        component={"span"}
                        sx={{ textTransform: "none" }}
                      >
                        Update Photo
                      </Typography>
                    </Box>
                  </Button>
                </Box>
                <Typography
                  sx={{
                    m: "16px auto 0px",
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif <br />
                  max size of 3.1 MB
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <AntSwitch
                    //   checked={dense}
                    //   onChange={handleChangeDense}
                    inputProps={{ "aria-label": "ant design" }}
                  />
                }
                label={
                  <Typography component={"span"}>
                    <Typography
                      component={"h6"}
                      sx={{ fontWeight: 800, fontSize: "0.875rem", mb: 0.5 }}
                    >
                      แก้ไขรูป
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                    >
                      อนุญาตให้พนักงานสามารถแก้ไขรูปภาพของตนเองได้
                    </Typography>
                  </Typography>
                }
                sx={{
                  m: 0,
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row-reverse",
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="รหัสผ่าน"
                    type="password"
                    id="password"
                    // error={error ? true : false}
                    // helperText={error ? error : null}
                    InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
                    autoComplete="current-password"
                    sx={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    // error={error ? true : false}
                    id="username1"
                    label="ชื่อผู้ใช้"
                    name="username"
                    autoComplete="username"
                    InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
                    autoFocus
                    sx={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    // error={error ? true : false}
                    id="username2"
                    label="ชื่อผู้ใช้"
                    name="username"
                    autoComplete="username"
                    InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
                    autoFocus
                    sx={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    // error={error ? true : false}
                    id="username3"
                    label="ชื่อผู้ใช้"
                    name="username"
                    autoComplete="username"
                    InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
                    autoFocus
                    sx={styles.inputField}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={styles.btnSubmit}
              >
                Sign In
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
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
export default ProfileEmployee;
