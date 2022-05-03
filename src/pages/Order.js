import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Search,
  ManageAccounts,
  EditRounded,
  DeleteRounded,
  Add,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orderStore, deleteOrder } from "../store/OrderStore";
import cloneDeep from "lodash.clonedeep";
import TablePaginations from "../components/TablePagination";
import TableRows from "../components/TableRows";
import dayjs from "dayjs";
import "dayjs/locale/th";
import StatusColor from "../components/StatusColor";
import TableHeader from "../components/TableHeader";
import getComparator from "../utils/TableSort";
import Swal from "sweetalert2";
import { HttpClient } from "../utils/HttpClient";
import TabStatus from "../components/TabStatus";
import DateSort from "../components/DateSort";
import { useOutletContext } from "react-router-dom";
import { SearchField } from "../components/controls";

const Order = () => {
  let theme = useTheme();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { order } = useSelector(orderStore);
  const [title, setTitle, socket] = useOutletContext();
  const [loadingData, setLoadingData] = useState(false);
  const [valueTabs, setValueTabs] = useState("ทั้งหมด");
  //Pagination
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("pickup_date");
  //Date Sort
  const [valueSubMonth, setValueSubMonth] = useState("ทั้งเดือน");
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(dayjs(new Date()).format("BBBB"));
  //Search
  const [search, setSearch] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "asc";
    setSortType(isAsc ? "desc" : "asc");
    setSortByName(property);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "คุณต้องการที่จะลบเที่ยววิ่งนี้ใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: "ตกลง",
      cancelButtonText: "ปิด",
    }).then(async (result) => {
      if (result.isDenied) {
        try {
          setLoadingData(true);
          let res = await HttpClient.delete("/order/" + id);
          if (res.data.sucess) {
            dispatch(deleteOrder(id));
            let newOrder = cloneDeep(order).find((item) => item._id == id);
            newOrder.deleted = true;
            socket.emit("_EditOrder", newOrder);
            Swal.fire("ลบเสร็จสิ้น!", "", "success");
          } else {
            Swal.fire(
              "อาจมีปัญหาบางอย่างเกิดขึ้นกรุณาลองใหม่อีกครั้ง!",
              "",
              "warning"
            ).then(() => window.location.reload());
          }
        } catch (error) {
          console.log(error.respose);
        } finally {
          setLoadingData(false);
        }
      }
    });
  };

  let orderQuery = useMemo(() => {
    if (!order) return [];
    let newOrder = cloneDeep(order);

    if (valueTabs !== "ทั้งหมด") {
      newOrder = newOrder.filter((item) => item.status === valueTabs);
    }

    newOrder = newOrder.filter(
      (a) => dayjs(a.pickup_date).locale("th").format("BBBB") === valueYear
    );

    if (valueSubMonth !== "ทั้งเดือน") {
      newOrder = newOrder.filter((order) => {
        let day = dayjs(order.pickup_date).format("D");
        if (valueSubMonth === "ต้นเดือน") {
          return day < 16;
        } else {
          return day > 15;
        }
      });
    }

    if (valueMonth !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("MMMM") === valueMonth
      );
    }

    if (valueDay !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("DD") === valueDay
      );
    }

    if (search) {
      newOrder = newOrder.filter((s) => {
        if (
          s.delivery_location
            .trim()
            .toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          s.pickup_location
            .trim()
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
          return s;
      });
    }

    for (var i = 0; i < newOrder.length; i++) {
      newOrder[i] = { ...newOrder[i], row_number: i };
    }

    return newOrder;
  }, [
    order,
    valueTabs,
    valueDay,
    valueMonth,
    valueYear,
    valueSubMonth,
    search,
  ]);

  React.useEffect(() => setTitle("งานทั้งหมด"), []);

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    headCell: [
      { id: "row_number", label: "ลำดับ" },
      { id: "pickup_date", label: "วันที่" },
      { id: "_oid", label: "รหัสงาน" },
      { id: "pickup_location", label: "ที่รับสินค้า" },
      { id: "delivery_location", label: "ที่ส่งสินค้า" },
      { id: "driver", label: "พนักงาน" },
      { id: "price_order", label: "ค่างาน(บาท)" },
      { id: "per_time", label: "รอบ" },
      { id: "status", label: "สถานะ" },
    ],
  };
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
            งานทั้งหมด
          </Typography>
        </Box>
        <Box>
          <Button
            startIcon={<Add />}
            onClick={() => navigate("/addorder")}
            variant="contained"
            sx={{
              backgroundColor: "rgb(32, 101, 209)",
              boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
              borderRadius: 2,
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            เพิ่มงาน
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 0, overflow: "hidden" }}>
        <TabStatus value={valueTabs} onChange={(v) => setValueTabs(v)} />

        <DateSort
          isSubMonth
          order={order}
          valueSubMonth={valueSubMonth}
          changeValueSubMonth={(v) => setValueSubMonth(v)}
          valueDay={valueDay}
          changeValueDay={(v) => setValueDay(v)}
          valueMonth={valueMonth}
          changeValueMonth={(v) => setValueMonth(v)}
          valueYear={valueYear}
          changeValueYear={(v) => setValueYear(v)}
        />
        <Box sx={{ p: 3, pt: 0 }}>
          <SearchField handleSearch={(e) => setSearch(e.target.value)} />
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <TableContainer
            sx={{
              position: "relative",
              minWidth: "972px",
            }}
          >
            <Table size={dense ? "small" : "normall"}>
              <TableHeader {...tableHeaderProps} />
              <TableBody>
                {orderQuery
                  .sort(getComparator(sortType, sortByName))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => {
                    return (
                      <TableRows
                        key={item._id}
                        isCollapse
                        Cell={[
                          {
                            value: item.row_number,
                          },
                          {
                            value: dayjs(item.pickup_date)
                              .locale("th")
                              .format("DD MMMM BBBB"),
                          },
                          {
                            value: item._oid,
                            align: "right",
                          },
                          {
                            value: item.pickup_location,
                            align: "right",
                          },
                          {
                            value: item.delivery_location,
                            align: "right",
                          },
                          {
                            value: item.driver,
                            align: "right",
                          },
                          {
                            value: item.price_order,
                            align: "right",
                          },
                          {
                            value: item.per_time,
                            align: "right",
                          },
                          {
                            value: (
                              <Typography
                                variant="p"
                                sx={{
                                  bgcolor: StatusColor.colorBgStatus(
                                    item.status,
                                    theme.palette.mode
                                  ),
                                  color: StatusColor.colorTextStatus(
                                    item.status,
                                    theme.palette.mode
                                  ),
                                  px: 0.7,
                                  py: 0.5,
                                  fontSize: "0.8rem",
                                  borderRadius: 2,
                                  fontFamily: "Prompt",
                                  fontWeight: 500,
                                  height: "22px",
                                }}
                              >
                                {item.status}
                              </Typography>
                            ),
                            align: "center",
                          },
                        ]}
                        CellCollapse={[
                          {
                            value: item.pickup_point,
                          },
                          {
                            value: item.wage,
                            title: "ค่าเที่ยววิ่งพนักงาน(บาท)",
                          },
                          {
                            value: item.profit,
                            title: "กำไร(บาท)",
                          },
                          {
                            value: item.cost,
                            title: "น้ำมัน(บาท)",
                          },
                          {
                            value: item.area,
                            title: "ตจว./กทม.",
                          },
                          {
                            value: (
                              <>
                                <Button
                                  startIcon={<EditRounded />}
                                  onClick={() =>
                                    navigate("/editorder", {
                                      state: { order: item },
                                    })
                                  }
                                  sx={{ borderRadius: 2 }}
                                  color="warning"
                                >
                                  แก้ไข
                                </Button>
                                <Button
                                  startIcon={<DeleteRounded />}
                                  onClick={() => handleDelete(item._id)}
                                  sx={{ borderRadius: 2 }}
                                  color="error"
                                >
                                  ลบ
                                </Button>
                              </>
                            ),
                            title: "Action",
                          },
                          {
                            value: <img src={item.path_image} alt="" />,
                            title: "รูป",
                          },
                        ]}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePaginations
          checked={dense}
          onChecked={(v) => setDense(v)}
          count={orderQuery.length}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Order;
