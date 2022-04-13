import { Tabs, Tab } from "@mui/material";
import React from "react";

const TabStatus = ({ value, onChange }) => {
  return (
    <Tabs
      value={value}
      onChange={(e, v) => onChange(v)}
      variant="scrollable"
      scrollButtons="auto"
      indicatorColor="primary"
      textColor="inherit"
      sx={{
        px: 2,
        maxHeight: 48,
        backgroundColor: "rgba(145, 158, 171, 0.16)",
      }}
    >
      <Tab value="ทั้งหมด" label="ทั้งหมด" disableRipple />
      <Tab value="มอบหมายงานเเล้ว" label="มอบหมายงานเเล้ว" disableRipple />
      <Tab value="ปฏิเสธงาน" label="ปฏิเสธงาน" disableRipple />
      <Tab value="ยอมรับ" label="ยอมรับ" disableRipple />
      <Tab value="ส่งงานเเล้ว" label="ส่งงานเเล้ว" disableRipple />
    </Tabs>
  );
};

export default TabStatus;
