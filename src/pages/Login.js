import React from "react";

import Button from "@mui/material/Button";

import { useNavigate, useLocation } from "react-router-dom";

import { upDateLogin } from "../store/Auth";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || "/";

  const loginSubmit = () => {
    dispatch(upDateLogin(true));
    navigate(from, { replace: true });
  };

  return (
    <div>
      <Button variant="outlined" onClick={loginSubmit}>
        Primary
      </Button>
    </div>
  );
};

export default Login;
