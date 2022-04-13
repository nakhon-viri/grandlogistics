import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import React, { useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import cloneDeep from "lodash.clonedeep";

const FormDateSort = ({
  text,
  changeValue,
  value,
  orderQuery,
  dateFormat,
  nameQuery = "pickup_date",
  ...rest
}) => {
  let yearQuery = useMemo(() => {
    if (!orderQuery) return [dayjs(new Date()).locale("th").format("BBBB")];
    let newOrders = cloneDeep(orderQuery);

    let newYear = [
      ...new Map(
        newOrders.map((item) => [
          dayjs(item[nameQuery]).locale("th").format("BBBB"),
          dayjs(item[nameQuery]).locale("th").format("BBBB"),
        ])
      ).values(),
    ];

    let now = newYear.find(
      (y) => y === dayjs(new Date()).locale("th").format("BBBB")
    );

    if (!now) {
      newYear.push(dayjs(new Date()).locale("th").format("BBBB"));
    }

    return newYear;
  }, [orderQuery]);

  let dateQuery =
    dateFormat == "BBBB"
      ? yearQuery
      : [
          ...new Map(
            orderQuery?.map((item) => [
              dayjs(item[nameQuery]).locale("th").format(dateFormat),
              dayjs(item[nameQuery]).locale("th").format(dateFormat),
            ])
          ).values(),
        ];
  return (
    <Grid item {...rest}>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-multiple-name-label">{text}</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={value}
          onChange={changeValue}
          input={
            <OutlinedInput
              sx={{
                width: "100%",
                borderRadius: 2,
                "& fieldset": {
                  borderRadius: 2,
                },
              }}
              label={text}
            />
          }
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
        >
          {dateFormat != "BBBB" ? (
            <MenuItem
              value={"ทั้งหมด"}
              sx={{
                width: "100%",
                borderRadius: "8px",
              }}
            >
              {`${text}ทั้งหมด`}
            </MenuItem>
          ) : null}
          {dateQuery.map((row, index) => {
            return (
              <MenuItem
                key={index}
                value={row}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  mt: 1,
                }}
              >
                {row}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Grid>
  );
};
const DateSort = ({
  order,
  isSubMonth,
  valueSubMonth,
  changeValueSubMonth,
  valueDay,
  changeValueDay,
  valueMonth,
  changeValueMonth,
  valueYear,
  changeValueYear,
  nameQuery,
}) => {
  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {isSubMonth && (
        <Grid item xs={12} md={3}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-multiple-name-label">{"ช่วงเดือน"}</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={valueSubMonth}
              onChange={(e) => {
                changeValueDay("ทั้งหมด");
                changeValueSubMonth(e.target.value);
              }}
              input={
                <OutlinedInput
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    "& fieldset": {
                      borderRadius: 2,
                    },
                  }}
                  label={"ช่วงเดือน"}
                />
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {["ทั้งเดือน", "ต้นเดือน", "ปลายเดือน"].map((row, index) => (
                <MenuItem
                  key={index}
                  value={row}
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    mt: index == 0 ? 0 : 1,
                  }}
                >
                  {row}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      <FormDateSort
        text="วัน"
        dateFormat="DD"
        xs={12}
        md={isSubMonth ? 3 : 4}
        orderQuery={order}
        nameQuery={nameQuery}
        value={valueDay}
        changeValue={(e) => {
          if (isSubMonth) {
            changeValueSubMonth("ทั้งเดือน");
          }
          changeValueDay(e.target.value);
        }}
      />
      <FormDateSort
        text="เดือน"
        dateFormat="MMMM"
        xs={12}
        md={isSubMonth ? 3 : 4}
        nameQuery={nameQuery}
        orderQuery={order}
        value={valueMonth}
        changeValue={(e) => changeValueMonth(e.target.value)}
      />
      <FormDateSort
        text="ปี"
        dateFormat="BBBB"
        xs={12}
        md={isSubMonth ? 3 : 4}
        nameQuery={nameQuery}
        orderQuery={order}
        value={valueYear}
        changeValue={(e) => changeValueYear(e.target.value)}
      />
    </Grid>
  );
};
export default DateSort;
