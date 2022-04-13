import {
  Box,
  Paper,
  Typography,
  Grid,
  Container,
  Button,
  Dialog,
} from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderStore, recoverOrder } from "../store/OrderStore";
import { employeeStore, recoverEmployee } from "../store/EmployeeStore";
import { customerStore, recoverCustomer } from "../store/CustomerStore";
import cloneDeep from "lodash.clonedeep";
import { HttpClient } from "../utils/HttpClient";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useOutletContext } from "react-router-dom";

const Trash = () => {
  let dispatch = useDispatch();
  const [title, setTitle] = useOutletContext();
  let { orderDeleted } = useSelector(orderStore);
  let { deletedEmployee } = useSelector(employeeStore);
  let { deletedCustomer } = useSelector(customerStore);
  const [order, setOrder] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [customer, setCustomer] = useState(null);

  const handleRecoverOrder = async (id) => {
    try {
      let { data } = await HttpClient.post("/order/" + id);
      if (data.sucess) {
        dispatch(recoverOrder(id));
      }
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const handleRecoverEmployee = async (id) => {
    try {
      let { data } = await HttpClient.post("/personnel/" + id);
      if (data.sucess) {
        dispatch(recoverEmployee(id));
      }
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const handleRecoverCustomer = async (id) => {
    try {
      let { data } = await HttpClient.post("/customer/" + id);
      if (data.sucess) {
        dispatch(recoverCustomer(id));
      }
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  useEffect(() => {
    const delOdr = cloneDeep(orderDeleted);
    const delEmp = cloneDeep(deletedEmployee);
    const delCus = cloneDeep(deletedCustomer);
    setOrder(delOdr);
    setEmployee(delEmp);
    setCustomer(delCus);
  }, [orderDeleted, deletedEmployee, deletedCustomer]);

  useEffect(() => setTitle("เอกสารที่ถูกลบ"), []);

  const RowGrid = ({ label, value }) => {
    return (
      <Grid item xs={12}>
        <Grid container sx={{ borderBottom: "1px solid #ccc", pb: 2 }}>
          <Grid item xs={6}>
            <Typography>{label}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ pl: 2, overflowWrap: "break-word" }}>
              {value}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", mb: 1 }}>
          <Typography variant="h4" sx={{ flex: 1, fontFamily: "Itim" }}>
            งานทั้งหมดที่ถูกลบ
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "Itim" }}>
            {order?.length + " งาน"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            overflow: "auto",
            p: "24px",
            flexWrap: "nowrap",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "inset 1.5px 1.5px 8px #e0e0e0",
          }}
        >
          {order?.slice().map((item) => {
            return (
              <Paper
                elevation={3}
                key={item._id}
                sx={{
                  minWidth: "400px",
                  maxWidth: "400px",
                  marginRight: "20px",
                  p: "16px",
                }}
              >
                <Grid container spacing={2}>
                  <RowGrid label="รหัสงาน" value={item._oid} />
                  <RowGrid
                    label="สถานที่รับสินค้า"
                    value={item.pickup_location}
                  />
                  <RowGrid
                    label="สถานที่รับสินค้า"
                    value={item.delivery_location}
                  />
                  <RowGrid label="พนักงาน" value={item.driver} />
                  <RowGrid label="ค่างาน" value={item.price_order} />
                  <RowGrid label="สถานะ" value={item.status} />
                  <Box
                    sx={{
                      px: 1,
                      pt: 1,
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      disableRipple
                      disableFocusRipple
                      onClick={() => handleRecoverOrder(item._id)}
                      sx={{
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      กู้คืน
                    </Button>
                  </Box>
                </Grid>
              </Paper>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", mb: 1 }}>
          <Typography variant="h4" sx={{ flex: 1, fontFamily: "Itim" }}>
            พนักงานทั้งหมดที่ถูกลบ
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "Itim" }}>
            {employee?.length + " งาน"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            overflow: "auto",
            p: "24px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "inset 1.5px 1.5px 8px #e0e0e0",
          }}
        >
          {employee?.slice().map((item) => {
            return (
              <Paper
                elevation={3}
                key={item._id}
                sx={{
                  minWidth: "400px",
                  maxWidth: "400px",
                  marginRight: "20px",
                  p: "16px",
                }}
              >
                <Grid container spacing={2}>
                  <RowGrid
                    label="ชื่อ"
                    value={
                      item.full_name.first_name + " " + item.full_name.last_name
                    }
                  />
                  <RowGrid label="แผนก" value={item.department} />
                  <RowGrid
                    label="อายุ"
                    value={
                      new Date().getFullYear() -
                      parseInt(item.birthday.split("-")[0])
                    }
                  />
                  <RowGrid label="รหัสพนักงาน" value={item._uid} />
                  <RowGrid label="เบอร์ติดต่อ" value={item.phone_no} />
                  <RowGrid
                    label="เลขประจำตัวประชาชน"
                    value={item.reference_id}
                  />
                  <Box
                    sx={{
                      px: 1,
                      pt: 1,
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      disableRipple
                      disableFocusRipple
                      onClick={() => handleRecoverEmployee(item._id)}
                      sx={{
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      กู้คืน
                    </Button>
                  </Box>
                </Grid>
              </Paper>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", mb: 1 }}>
          <Typography variant="h4" sx={{ flex: 1, fontFamily: "Itim" }}>
            บริษัทคู่ค้าทั้งหมดที่ถูกลบ
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "Itim" }}>
            {customer?.length + " งาน"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            overflow: "auto",
            p: "24px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "inset 1.5px 1.5px 8px #e0e0e0",
          }}
        >
          {customer?.slice().map((item) => {
            return (
              <Paper
                elevation={3}
                key={item._id}
                sx={{
                  minWidth: "400px",
                  maxWidth: "400px",
                  marginRight: "20px",
                  p: "16px",
                }}
              >
                <Grid container spacing={2}>
                  <RowGrid label="ชื่อบริษัท" value={item.cus_name} />
                  <RowGrid label="เบอร์ติดต่อ" value={item.phone_no} />
                  <RowGrid
                    label="เลขประจำตัวผู้เสียภาษีอากร"
                    value={item.corporate_tax}
                  />
                  <RowGrid
                    label="ที่อยู่"
                    value={`${item.address.house_no} ${item.address.street} ตำบล${item.address.subdistrict} อำเภอ${item.address.district} จังหวัด${item.address.province} ${item.address.zip_code}`}
                  />
                  <Box
                    sx={{
                      px: 1,
                      pt: 1,
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      disableRipple
                      disableFocusRipple
                      onClick={() => handleRecoverCustomer(item._id)}
                      sx={{
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      กู้คืน
                    </Button>
                  </Box>
                </Grid>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Trash;
{
  /* {newOrder?.slice().map((item) => {
          return (
            <Paper
              elevation={3}
              key={item._id}
              sx={{ minWidth: "400px", marginRight: "20px", p: "16px" }}
            >
              <Grid container spacing={2}>
                <RowGrid label="รหัสงาน" value={item._oid} />
                <RowGrid
                  label="สถานที่รับสินค้า"
                  value={item.pickup_location}
                />
                <RowGrid
                  label="สถานที่รับสินค้า"
                  value={item.delivery_location}
                />
                <RowGrid label="พนักงาน" value={item.driver} />
                <RowGrid label="ค่างาน" value={item.price_order} />
                <RowGrid label="สถานะ" value={item.status} />
                <Box
                  sx={{
                    px: 1,
                    pt: 1,
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    disableRipple
                    disableFocusRipple
                    onClick={() => handleRecover(item._id)}
                    sx={{
                      "&.MuiButtonBase-root:hover": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    กู้คืน
                  </Button>
                </Box>
              </Grid>
            </Paper>
          );
        })} */
}
