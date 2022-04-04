import React from "react";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import "dayjs/locale/th";
import { DateRangeRounded } from "@mui/icons-material";
import { Stack, TextField } from "@mui/material";
const DatePicker = ({ errors, ...rest }) => {
  return (
    <LocalizationProvider locale={"th"} dateAdapter={AdapterDayjs}>
      <Stack>
        <MobileDatePicker
          {...rest}
          renderInput={(params) => (
            <TextField
              {...params}
              {...(errors && {
                error: true,
                helperText: errors,
              })}
              {...(!errors && {
                error: false,
              })}
              InputProps={{
                endAdornment: (
                  <DateRangeRounded sx={{ color: "text.secondary" }} />
                ),
              }}
              InputLabelProps={{
                style: { fontFamily: "Sarabun" },
              }}
              sx={styles.inputField}
            />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
};
const styles = {
  inputField: {
    borderRadius: 2,
    "& fieldset": {
      borderRadius: 2,
    },
    "& input::placeholder": {
      textOverflow: "ellipsis !important",
      fontWeight: 800,
      color: "text",
      opacity: 1,
    },
  },
};
export default DatePicker;
