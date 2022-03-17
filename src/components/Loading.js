import React from "react";

import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";


const spin = keyframes`
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(900deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(1800deg);
  }
`;

const jump1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;
const jump2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`;
const jump3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;
const Loading = () => {
  const Ellipsis = ({ lf, jump }) => (
    <Box
      sx={{
        ...styles.ellipsis,
        left: lf,
        animation: `${jump} 0.6s infinite`,
      }}
    />
  );

  return (
    <Box sx={styles.container}>
      <CssBaseline />
      <Box sx={styles.containerSpin}>
        <Avatar sx={styles.logoSpin} src="/img/loggrand.png" />
      </Box>
      <Box sx={styles.containerEllipsis}>
        <Ellipsis lf="8px" jump={jump1} />
        <Ellipsis lf="8px" jump={jump2} />
        <Ellipsis lf="32px" jump={jump2} />
        <Ellipsis lf="56px" jump={jump3} />
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  ellipsis: {
    position: "absolute",
    top: "15px",
    width: "13px",
    height: "13px",
    borderRadius: "50%",
    backgroundColor: "grey.200",
  },
  containerEllipsis: {
    display: "inline-block",
    position: "relative",
    width: "100px",
    height: "100px",
    marginLeft: 2.8,
  },
  containerSpin: {
    display: "inline-block",
    transform: "translateZ(1px)",
  },
  logoSpin: {
    display: "inline-block",
    width: 100,
    height: 100,
    animation: `${spin} 2.5s infinite cubic-bezier(0.5, 0, 1, 0.5)`,
  },
};

export default Loading;
