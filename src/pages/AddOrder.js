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
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import {
  AddAPhoto,
  DateRange,
  InsertDriveFile,
  Add,
  ChangeCircleRounded,
  SaveRounded,
} from "@mui/icons-material";
import {
  searchAddressByProvince,
  searchAddressByDistrict,
  searchAddressByAmphoe,
} from "thai-address-database";
import React, { useState, useRef, useMemo, useEffect } from "react";
import "dayjs/locale/th";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import cloneDeep from "lodash.clonedeep";

import { employeeStore } from "../store/EmployeeStore";
import { orderStore } from "../store/OrderStore";
import { customerStore } from "../store/CustomerStore";
import { addOrder } from "../store/OrderStore";
import { useForm, Form } from "../components/useForm";
import useHover from "../hooks/UseHover";
import ImageCrop from "../utils/ImageCrop";
import Controls from "../components/controls";
import { HttpClient } from "../utils/HttpClient";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import { Zoom } from "../components/Transition";
import convertToDefEventPara from "../utils/ConvertToDefEventPara";

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
  car_type: "รถกะบะตู้ทึบ",
  personnel: "",
  customer: "",
};

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

const SelectedCustomer = ({ onClose, selectedValue, open, listCustomer }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ px: 0, overflow: "hidden" }}>
        <Box sx={{ backgroundColor: "rgba(145, 158, 171, 0.16)", p: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontFamily: "Itim", textAlign: "center" }}
          >
            กรุณาเลือกบริษัทที่ต้องการจะเพิ่มงาน
          </Typography>
        </Box>
        <Box sx={{ maxHeight: "300px", px: 1, overflow: "auto" }}>
          <List sx={{ pt: 0 }}>
            {listCustomer?.map((item, index) => (
              <ListItem
                button
                onClick={() => handleListItemClick(item)}
                key={index}
                sx={{ borderRadius: 2, mt: index === 0 && 1 }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#bbdefb",
                      color: "#1e88e5",
                    }}
                    src={item.cus_img}
                  >
                    {item.cus_name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.cus_name} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            p: 1,
            backgroundColor: "rgba(145, 158, 171, 0.16)",
          }}
        >
          <ListItem
            autoFocus
            sx={{
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            button
            onClick={() => navigate("/addcustomer")}
          >
            <ListItemAvatar>
              <Avatar>
                <Add sx={{ color: "#fff" }} />
              </Avatar>
            </ListItemAvatar>
            <Typography>เพิ่มบริษัทคู่ค้า</Typography>
          </ListItem>
        </Box>
      </Paper>
    </Container>
  );
};

const AddOrder = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle, socket] = useOutletContext();
  // const { socket } = useOutletContext();
  const { customer } = useSelector(customerStore);
  const { employee } = useSelector(employeeStore);
  const { order } = useSelector(orderStore);
  const [selectedEmp, setSelectedEmp] = useState("");
  //Loading
  const [loading, setLoading] = useState(false);
  //Customer
  const [customerList] = useState(customer?.slice());
  //Employee
  const [employeeList, setEmployeeList] = useState(employee?.slice());
  //sort Employee
  const [sortEmp, setSortEmp] = useState(3);
  //Dialog
  const [openDialog, setOpenDialog] = useState(state ? false : true);
  const [selectedCustomer, setSelectedCustomer] = useState(
    state?.customer ? state.customer : null
  );
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
      temp.price_order = fieldValues.price_order ? "" : "โปรดใส่ข้อมูลค่างาน";
    if ("wage" in fieldValues)
      temp.wage = fieldValues.wage ? "" : "โปรดใส่ข้อมูลค่าเที่ยวพนักงาน";
    if (selectedEmp) {
      temp.personnel = "";
    } else {
      temp.personnel = "โปรดเลือกพนักงาน";
    }
    if ("car_type" in fieldValues)
      temp.car_type = fieldValues.car_type ? "" : "โปรดใส่ข้อมูลประเภทรถ";
    if ("area" in fieldValues)
      temp.area = fieldValues.area ? "" : "โปรดใส่ข้อมูลช่องนี้";
    if ("per_time" in fieldValues)
      temp.per_time = fieldValues.per_time ? "" : "โปรดใส่ข้อมูลช่องนี้";

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
        // setLoading(true);
        let emp = JSON.parse(selectedEmp);
        values.driver = emp.driver;
        values.personnel = emp._id;
        values.customer = selectedCustomer._id;
        values.profit = values.price_order - values.wage;
        values.pickup_date = JSON.stringify(values.pickup_date).replace(
          /"/g,
          ""
        );
        let res = await HttpClient.post("/order", {
          _order: values,
          _customer: selectedCustomer,
        });
        dispatch(addOrder(res.data));
        socket.emit("_AddOrder", res.data);
        navigate(-1);
        Toast.fire({
          icon: "success",
          title: "successfully",
        });
      } catch (error) {
        console.log(error.response);
      }
    }
  };
  //Dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = (value) => {
    setOpenDialog(false);
    setSelectedCustomer(value);
  };

  useEffect(() => setTitle("เพิ่มงาน"), []);

  let employeeQuery = useMemo(() => {
    if (!employee || !order) return [];
    let empList = cloneDeep(employee);

    empList = empList.map((item) => {
      item.orders = order.filter(
        (itemCurr) =>
          itemCurr.personnel == item._id &&
          dayjs(itemCurr.pickup_date).format("MMMM BBBB") ==
            dayjs(new Date()).format("MMMM BBBB")
      );

      let result = item.orders.reduce(
        (sum, curr) => {
          sum.count += 1;
          sum.total += curr.wage;
          return sum;
        },
        {
          count: 0,
          total: 0,
        }
      );

      item.countOrder = result.count;
      item.sumWage = result.total;
      return item;
    });

    if (sortEmp == 1) {
      empList.sort((a, b) => {
        if (b.full_name.first_name > a.full_name.first_name) {
          return -1;
        }
        if (b.full_name.first_name < a.full_name.first_name) {
          return 1;
        }
        return 0;
      });
    }
    if (sortEmp == 2) empList.sort((a, b) => a.countOrder - b.countOrder);

    if (sortEmp == 3) empList.sort((a, b) => a.sumWage - b.sumWage);
    return empList;
  }, [employee, order, sortEmp]);

  if (openDialog || !socket) {
    return (
      <Box>
        <SelectedCustomer
          listCustomer={customerList}
          selectedValue={selectedCustomer}
          open={openDialog}
          onClose={handleClose}
        />
      </Box>
    );
  }

  return (
    <Container>
      <Grid
        container
        rowSpacing={2}
        sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}
      >
        <Grid item xs={12} sm={9} sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
            {"เพิ่มงานบริษัท : " + selectedCustomer.cus_name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "end", xs: "start" },
            }}
          >
            <Button
              variant="contained"
              onClick={handleClickOpen}
              startIcon={<ChangeCircleRounded />}
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
              เปลี่ยนบริษัท
            </Button>
          </Box>
        </Grid>
      </Grid>
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
            <Grid item xs={12}>
              <FormControl sx={{ mb: 1 }}>
                <FormLabel id="sort-employee">เรียงลำดับ</FormLabel>
                <RadioGroup
                  row
                  value={sortEmp}
                  onChange={(e) => setSortEmp(e.target.value)}
                  aria-labelledby="sort-employee"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="ชื่อพนักงาน"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="จำนวนงานในเดือนนี้"
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label="รายได้ทั้งหมดในเดือนนี้"
                  />
                </RadioGroup>
              </FormControl>
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
                  value={selectedEmp}
                  onChange={(e) => setSelectedEmp(e.target.value)}
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
                  {employeeQuery?.map((item, i) => {
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
                            sx={{ height: "50px", width: "50px", fontSize: 50 }}
                            alt={item.full_name.first_name}
                            src={item.photo}
                          />
                          <Box>
                            <Typography variant="h6" sx={{ ml: 2 }}>
                              {item.full_name.first_name +
                                " " +
                                item.full_name.last_name}
                            </Typography>
                            <Typography variant="p" sx={{ ml: 2 }}>
                              {item.countOrder +
                                " งาน, " +
                                item.sumWage +
                                " บาท"}
                            </Typography>
                          </Box>
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
              label="ค่างาน(บาท)*"
              name="price_order"
              type="number"
              value={values.price_order}
              onChange={handleInputChange}
              error={errors.price_order}
            />
            <InputGrid
              label="ค่าเที่ยวพนักงาน(บาท)*"
              name="wage"
              type="number"
              value={values.wage}
              onChange={handleInputChange}
              error={errors.wage}
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
              startIcon={<SaveRounded />}
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

export default AddOrder;
