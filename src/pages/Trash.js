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
// import { useHorizontalScroll } from "../hooks/useSideScroll";
import { HttpClient } from "../utils/HttpClient";

const Trash = () => {
  let dispatch = useDispatch();
  let { orderDeleted } = useSelector(orderStore);
  // const scrollRef = useHorizontalScroll();

  const handleRecover = async (id) => {
    try {
      let { data } = await HttpClient.post("/order/" + id);
      if (data.sucess) {
        dispatch(recoverOrder(id));
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const newOrder = useMemo(() => {
    let queryOrder = orderDeleted?.slice();
    // ?.filter((a) => {
    //     if (!a.deleted) return;
    //     return a;
    //   }) || [];

    return queryOrder;
  }, [orderDeleted]);

  const RowGrid = ({ label, value }) => {
    return (
      <Grid item xs={12}>
        <Grid container sx={{ borderBottom: "1px solid #ccc", pb: 2 }}>
          <Grid item xs={6}>
            <Typography>{label}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{value}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container maxWidth={"lg"}>
      <Box sx={{ display: "flex" }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          งานทั้งหมดที่ถูกลบ
        </Typography>
        <Typography variant="h6">{newOrder?.length + " งาน"}</Typography>
      </Box>
      <Box
        // ref={scrollRef}
        sx={{ display: "flex", overflow: "auto", p: "24px" }}
      >
        {newOrder?.slice().map((item) => {
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
        })}
      </Box>
    </Container>
  );
};

export default Trash;
