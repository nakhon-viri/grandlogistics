import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  FormControlLabel,
  Avatar,
  Switch,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Stack,
  OutlinedInput,
  FormHelperText,
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Zoom,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import {
  AddAPhoto,
  DateRange,
  InsertDriveFile,
  Add,
} from "@mui/icons-material";
import {
  searchAddressByProvince,
  searchAddressByDistrict,
  searchAddressByAmphoe,
} from "thai-address-database";
import React, { useState, useRef, useEffect, useMemo } from "react";
import "dayjs/locale/th";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";

import { employeeStore } from "../store/EmployeeStore";
import { customerStore } from "../store/CustomerStore";
import { addOrder, editOrder } from "../store/OrderStore";
import { useForm, Form } from "../components/useForm";
import useHover from "../hooks/UseHover";
import ImageCrop from "../utils/ImageCrop";
import Controls from "../components/controls";
import { HttpClient } from "../utils/HttpClient";

const initialValues = {
  pickup_location: "",
  pickup_point: {
    pp_1: "",
    pp_2: "",
    pp_3: "",
    pp_4: "",
    pp_5: "",
  },
  delivery_location: "",
  pickup_date: "",
  price_order: 0,
  wage: 0,
  profit: 0,
  driver: "",
  per_time: "",
  area: "",
  car_type: "",
  personnel: "",
  customer: "",
  status: "",
  detail: "",
  other_msg: "",
  cost: 0,
  withdraw: 0,
  amount_of_invoice: 0,
};

const convertToDefEventPara = (name, value) => ({
  target: {
    name,
    value,
  },
});

const InputGrid = ({ sm, error = null, ...rest }) => {
  return (
    <Grid item xs={12} sm={sm ? 12 : 6}>
      <TextField
        fullWidth
        {...rest}
        {...(error && { error: true, helperText: error })}
        InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
        sx={styles.inputField}
      />
    </Grid>
  );
};

const EditOrder = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useOutletContext();
  const { employee } = useSelector(employeeStore);
  const [IDOrder, setIDOrder] = useState(null);
  //Loading
  const [loading, setLoading] = useState(false);
  //Employee
  const [employeeList, setEmployeeList] = useState(employee?.slice());
  //Form
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("pickup_location" in fieldValues)
      temp.pickup_location = fieldValues.pickup_location
        ? ""
        : "โปรดใส่ข้อมูลสถานที่รับสินค้า";
    if ("delivery_location" in fieldValues)
      temp.delivery_location = fieldValues.delivery_location
        ? ""
        : "โปรดใส่ข้อมูลสถานที่ส่งสินค้า";
    if ("pp_1" in fieldValues.pickup_point)
      temp.pp_1 = fieldValues.pickup_point.pp_1 ? "" : "โปรดใส่ข้อมูลช่องนี้";
    if ("pickup_date" in fieldValues)
      temp.pickup_date = fieldValues.pickup_date ? "" : "โปรดใส่ข้อมูลวันที่";
    if ("price_order" in fieldValues)
      temp.price_order = fieldValues.price_order.toString()
        ? ""
        : "โปรดใส่ข้อมูลค่างาน";
    if ("wage" in fieldValues)
      temp.wage = fieldValues.wage.toString()
        ? ""
        : "โปรดใส่ข้อมูลค่าเที่ยวพนักงาน";
    if ("personnel" in fieldValues)
      temp.personnel = fieldValues.personnel ? "" : "โปรดเลือกพนักงาน";
    if ("car_type" in fieldValues)
      temp.car_type = fieldValues.car_type ? "" : "โปรดใส่ข้อมูลประเภทรถ";
    if ("area" in fieldValues)
      temp.area = fieldValues.area ? "" : "โปรดใส่ข้อมูลช่องนี้";
    if ("per_time" in fieldValues)
      temp.per_time = fieldValues.per_time ? "" : "โปรดใส่ข้อมูลช่องนี้";
    if ("withdraw" in fieldValues)
      temp.withdraw = fieldValues.withdraw.toString()
        ? ""
        : "โปรดใส่ข้อมูลช่องนี้";
    if ("profit" in fieldValues)
      temp.profit = fieldValues.profit.toString() ? "" : "โปรดใส่ข้อมูลช่องนี้";
    if ("cost" in fieldValues)
      temp.cost = fieldValues.cost.toString() ? "" : "โปรดใส่ข้อมูลช่องนี้";
    if ("amount_of_invoice" in fieldValues)
      temp.amount_of_invoice = fieldValues.amount_of_invoice.toString()
        ? ""
        : "โปรดใส่ข้อมูลช่องนี้";

    setErrors({
      ...temp,
    });
    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialValues,
    false,
    validate
  );
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        let emp = JSON.parse(values.personnel);
        values.driver = emp.driver;
        values.personnel = emp._id;
        values.profit = values.price_order - values.wage;
        let res = await HttpClient.put("/order/" + IDOrder, values);
        dispatch(editOrder(res.data));
        navigate("/order");
        Toast.fire({
          icon: "success",
          title: "successfully",
        });
      } catch (error) {
        console.log(error.response.data.error.message);
      }
    }
  };

  useEffect(() => {
    if (!state) navigate("/order");
    if (employee && state) {
      let order = JSON.parse(JSON.stringify(state?.order || null));
      setIDOrder(order._id);
      setValues({
        pickup_location: order.pickup_location,
        pickup_point: {
          pp_1: order.pickup_point.pp_1,
          pp_2: order.pickup_point.pp_2,
          pp_3: order.pickup_point.pp_3,
          pp_4: order.pickup_point.pp_4,
          pp_5: order.pickup_point.pp_5,
        },
        delivery_location: order.delivery_location,
        pickup_date: order.pickup_date,
        price_order: order.price_order,
        wage: order.wage,
        profit: order.profit,
        driver: order.driver,
        per_time: order.per_time,
        area: order.area,
        car_type: order.car_type,
        personnel: JSON.stringify({
          driver: order.personnel.full_name.first_name,
          _id: order.personnel._id,
        }),
        customer: order.customer._id,
        status: order.status,
        detail: order.detail,
        other_msg: order.other_msg,
        cost: order.cost,
        withdraw: order.withdraw,
        amount_of_invoice: order.amount_of_invoice,
      });
    }
  }, [employee, state]);

  useEffect(() => setTitle("แก้ไขงาน"), []);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          {state?.order.customer.cus_name}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "rgb(32, 101, 209)",
            boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
            borderRadius: 2,
            "&:hover": {
              boxShadow: "none",
            },
            mr: 2,
          }}
        >
          กลับ
        </Button>
      </Box>
      <Form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3 }}>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <InputGrid
              label="สถานที่รับสินค้า*"
              name="pickup_location"
              type="text"
              value={values.pickup_location}
              onChange={handleInputChange}
              error={errors.pickup_location}
            />
            <InputGrid
              label="สถานที่ส่งสินค้า*"
              name="delivery_location"
              type="text"
              value={values.delivery_location}
              onChange={handleInputChange}
              error={errors.delivery_location}
            />
            <InputGrid
              sm
              label="สถานที่รับสินค้าที่ 1*"
              name="pickup_point.pp_1"
              type="text"
              value={values.pickup_point.pp_1}
              onChange={handleInputChange}
              error={errors.pp_1}
            />
            {values.pickup_point.pp_1 ? (
              <InputGrid
                sm
                label="สถานที่รับสินค้าที่ 2*"
                name="pickup_point.pp_2"
                type="text"
                value={values.pickup_point.pp_2}
                onChange={handleInputChange}
              />
            ) : (
              (values.pickup_point.pp_2 = "")
            )}
            {values.pickup_point.pp_2 ? (
              <InputGrid
                sm
                label="สถานที่รับสินค้าที่ 3*"
                name="pickup_point.pp_3"
                type="text"
                value={values.pickup_point.pp_3}
                onChange={handleInputChange}
              />
            ) : (
              (values.pickup_point.pp_3 = "")
            )}
            {values.pickup_point.pp_3 ? (
              <InputGrid
                sm
                label="สถานที่รับสินค้าที่ 4*"
                name="pickup_point.pp_4"
                type="text"
                value={values.pickup_point.pp_4}
                onChange={handleInputChange}
              />
            ) : (
              (values.pickup_point.pp_4 = "")
            )}
            {values.pickup_point.pp_4 ? (
              <InputGrid
                sm
                label="สถานที่รับสินค้าที่ 5*"
                name="pickup_point.pp_5"
                type="text"
                value={values.pickup_point.pp_5}
                onChange={handleInputChange}
              />
            ) : (
              (values.pickup_point.pp_5 = "")
            )}
            <Grid item xs={12} sm={6}>
              <Controls.DatePicker
                label="วัน/เดือน/ปี*"
                errors={errors.pickup_date}
                value={values.pickup_date}
                onChange={(v) =>
                  handleInputChange(convertToDefEventPara("pickup_date", v))
                }
              />
            </Grid>
            <InputGrid
              label="ประเภทรถ*"
              name="car_type"
              type="text"
              value={values.car_type}
              onChange={handleInputChange}
              error={errors.car_type}
            />
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth {...(errors.personnel && { error: true })}>
                <InputLabel id="search-select-label">พนักงาน*</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                  sx={{
                    borderRadius: 2,
                    ...(values.personnel
                      ? {
                          "& .MuiSelect-select": {
                            p: "8px 14px",
                          },
                        }
                      : null),
                  }}
                  labelId="search-select-label"
                  id="search-select"
                  name="personnel"
                  value={values.personnel}
                  onChange={handleInputChange}
                  input={
                    <OutlinedInput
                      sx={{
                        width: "100%",
                        borderRadius: 16,
                        "& fieldset": {
                          borderRadius: 16,
                        },
                      }}
                      label="พนักงาน"
                    />
                  }
                >
                  {employeeList?.map((item, i) => {
                    return (
                      <MenuItem
                        key={item._id}
                        sx={{
                          width: "100%",
                          borderRadius: "8px",
                          mb: 1,
                        }}
                        value={JSON.stringify({
                          driver: item.full_name.first_name,
                          _id: item._id,
                        })}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{ height: "40px", width: "40px", fontSize: 50 }}
                            alt={item.full_name.first_name}
                            src={item.photo}
                          />
                          <Typography sx={{ ml: 2 }}>
                            {item.full_name.first_name +
                              " " +
                              item.full_name.last_name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>
                  {errors.personnel && errors.personnel}
                </FormHelperText>
              </FormControl>
            </Grid>
            <InputGrid
              label="ค่างาน*"
              name="price_order"
              type="number"
              value={values.price_order}
              onChange={handleInputChange}
              error={errors.price_order}
            />
            <InputGrid
              label="ค่าเที่ยวพนักงาน*"
              name="wage"
              type="number"
              value={values.wage}
              onChange={handleInputChange}
              error={errors.wage}
            />
            <InputGrid
              label="กำไร*"
              name="profit"
              type="number"
              value={values.profit}
              onChange={handleInputChange}
              error={errors.profit}
            />
            <InputGrid
              label="เงินเบิกพนักงาน*"
              name="withdraw"
              type="number"
              value={values.withdraw}
              onChange={handleInputChange}
              error={errors.withdraw}
            />
            <InputGrid
              label="ค่าน้ำมันพนักงาน*"
              name="cost"
              type="number"
              value={values.cost}
              onChange={handleInputChange}
              error={errors.cost}
            />
            <InputGrid
              label="จำนวนบิล*"
              name="amount_of_invoice"
              type="number"
              value={values.amount_of_invoice}
              onChange={handleInputChange}
              error={errors.amount_of_invoice}
            />
            <InputGrid
              label="หมายเหตุ"
              name="other_msg"
              type="text"
              value={values.other_msg}
              onChange={handleInputChange}
              error={errors.other_msg}
            />
            <InputGrid
              label="รายละเอียดงาน"
              name="detail"
              type="text"
              value={values.detail}
              onChange={handleInputChange}
              error={errors.detail}
            />
            <InputGrid
              label="รอบ*"
              name="per_time"
              type="text"
              value={values.per_time}
              onChange={handleInputChange}
              error={errors.per_time}
            />
            <InputGrid
              label="กทม/ตจว*"
              name="area"
              type="text"
              value={values.area}
              onChange={handleInputChange}
              error={errors.area}
            />
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth {...(errors.personnel && { error: true })}>
                <InputLabel id="search-select-label">สถานะ</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                  labelId="search-select-label"
                  id="search-select"
                  name="status"
                  value={values.status}
                  onChange={handleInputChange}
                  input={
                    <OutlinedInput
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        "& fieldset": {
                          borderRadius: 2,
                        },
                      }}
                      label="สถานะ"
                    />
                  }
                >
                  {[
                    "ปฏิเสธงาน",
                    "ยอมรับ",
                    "มอบหมายงานเเล้ว",
                    "ส่งงานเเล้ว",
                  ].map((item, i) => {
                    return (
                      <MenuItem
                        key={item}
                        sx={{
                          width: "100%",
                          borderRadius: "8px",
                          mb: 1,
                        }}
                        value={item}
                      >
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginTop: "24px",
            }}
          >
            <LoadingButton
              type="submit"
              fullWidth
              loading={loading}
              variant="contained"
              sx={styles.btnSubmit}
            >
              บันทึก
            </LoadingButton>
          </Box>
        </Paper>
      </Form>
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
    "& input::placeholder": {
      textOverflow: "ellipsis !important",
      fontWeight: 800,
      color: "text",
      opacity: 1,
    },
  },
  btnSubmit: {
    backgroundColor: "rgb(32, 101, 209)",
    boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
    borderRadius: 2,
    minWidth: 16,
    height: 40,
    width: "auto",
    "&:hover": {
      boxShadow: "none",
    },
  },
};

export default EditOrder;
