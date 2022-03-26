import React, { useState, useEffect } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { useForm, Form } from "../components/useForm";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import "dayjs/locale/th";
const initialFValues = {
  id: 0,
  fullName: "",
  email: "",
  hireDate: new Date(),
};

function DatePicker(props) {
  const { name, label, value, onChange } = props;

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <LocalizationProvider locale={"th"} dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        label="วัน/เดือน/ปีเกิด"
        value={value}
        onChange={(date) => onChange(convertToDefEventPara(name, date))}
        renderInput={(params) => (
          <TextField
            {...params}
            error={false}
            InputLabelProps={{
              style: { fontFamily: "Sarabun" },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}

function Input(props) {
  const { name, label, value, error = null, onChange } = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
    />
  );
}
function MyButton(props) {
  const { text, size, color, variant, onClick, ...other } = props;
  return (
    <Button
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      onClick={onClick}
      {...other}
    >
      {text}
    </Button>
  );
}

export default function EmployeeForm() {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("fullName" in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "This field is required.";
    if ("email" in fieldValues) {
      temp.email = fieldValues.email ? "" : "This field is required.";
      if (!temp.email)
        temp.email = /$^|.+@.+..+/.test(fieldValues.email)
          ? ""
          : "Email is not valid.";
    }
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, false, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      (values.hireDate = JSON.stringify(values.hireDate).replace(/"/g, "")),
        console.log(values);
      resetForm();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Input
            name="fullName"
            label="Full Name"
            value={values.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
          />
          <Input
            label="Email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            name="hireDate"
            label="Hire Date"
            value={values.hireDate}
            onChange={handleInputChange}
          />
          <div>
            <MyButton type="submit" text="Submit" />
            <MyButton text="Reset" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
