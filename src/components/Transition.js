import { Zoom as NewZoom } from "@mui/material";
import React from "react";

export const Zoom = React.forwardRef(function Transition(props, ref) {
  return <NewZoom ref={ref} {...props} />;
});
