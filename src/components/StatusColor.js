const colorBgStatus = (status, mode) => {
  let _mode = mode === "dark" ? 1 : 0.16;
  let color = "";
  if (status === "มอบหมายงานเเล้ว") {
    color =
      mode === "dark" ? `rgb(223, 227, 232)` : "rgba(145, 158, 171, 0.16)";
  } else if (status === "ปฏิเสธงาน") {
    color = `rgb(255, 72, 66, ${_mode})`;
  } else if (status === "ยอมรับ") {
    color = `rgb(85, 153, 242, ${_mode})`;
  } else if (status === "ส่งงานเเล้ว") {
    color = `rgb(95, 325, 55, ${_mode})`;
  }

  return color;
};

const colorTextStatus = (status, mode) => {
  let _mode = mode === "dark";
  let color = "";
  if (status === "มอบหมายงานเเล้ว") {
    color = `rgb(99, 115, 129)`;
  } else if (status === "ปฏิเสธงาน") {
    color = _mode ? "#fff" : "rgb(183, 33, 54)";
  } else if (status === "ยอมรับ") {
    color = _mode ? "#fff" : `rgb(85, 153, 242)`;
  } else if (status === "ส่งงานเเล้ว") {
    color = _mode ? "#333" : `rgb(95, 325, 55)`;
  }

  return color;
};

const colorStatus = {
  colorTextStatus,
  colorBgStatus,
};
export default colorStatus;
