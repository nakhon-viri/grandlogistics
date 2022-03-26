import { Box } from "@mui/material";
import React, { useState } from "react";
import cloneDeep from "lodash.clonedeep";

export function useForm(initialValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => {
      const clonedPrevValue = cloneDeep(prevValues);
      const keys = name.split(".");
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key] = value;
        }
        return acc[key];
      }, clonedPrevValue);
      return clonedPrevValue;
    });
    if (validateOnChange) validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
}

export function Form(props) {
  const { children, ...other } = props;
  return (
    <Box component={"form"} autoComplete="off" {...other}>
      {children}
    </Box>
  );
}
