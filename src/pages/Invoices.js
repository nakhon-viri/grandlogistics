import {
  Container,
  Paper,
  TableContainer,
  TableBody,
  Table,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import {
  Search,
  Delete,
  RemoveRedEyeRounded,
  Close,
  Add,
} from "@mui/icons-material";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import cloneDeep from "lodash.clonedeep";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { invoiceStore } from "../store/InvoiceStore";
import { orderStore } from "../store/OrderStore";
import TableHeader from "../components/TableHeader";
import ReportInvoice from "../components/ReportInvoice";

function descendingComparator(a, b, sortByName) {
  if (b[sortByName] < a[sortByName]) {
    return -1;
  }
  if (b[sortByName] > a[sortByName]) {
    return 1;
  }
  return 0;
}

function getComparator(sortType, sortByName) {
  return sortType === "desc"
    ? (a, b) => descendingComparator(a, b, sortByName)
    : (a, b) => -descendingComparator(a, b, sortByName);
}

const DialogInvoice = ({
  open,
  docID,
  listBil,
  handleClose,
  customerDetail,
  dateDoc,
}) => {
  let theme = useTheme();
  return (
    <Dialog
      fullScreen
      PaperComponent={"div"}
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          ...(theme.palette.mode === "dark"
            ? {
                bgcolor: "rgb(22, 28, 36)",
              }
            : {
                bgcolor: "rgb(255, 255, 255)",
              }),
        },
      }}
    >
      <AppBar
        sx={{
          position: "relative",
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              ml: 2,
              ...(theme.palette.mode === "light"
                ? {
                    color: "rgb(22, 28, 36)",
                  }
                : {
                    color: "rgb(255, 255, 255)",
                  }),
            }}
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ReportInvoice
        listBil={listBil}
        dateDoc={dateDoc}
        docID={docID}
        customerDetail={customerDetail}
      />
    </Dialog>
  );
};

const Invoices = () => {
  const { invoice } = useSelector(invoiceStore);
  const { order } = useSelector(orderStore);
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("wage");
  //invoice
  const [openInvoice, setOpenInvoice] = useState(false);
  const [invoiceProps, setInvoiceProps] = useState({});

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "desc";
    setSortType(isAsc ? "asc" : "desc");
    setSortByName(property);
  };

  const handleShowInvoice = (value) => {
    setInvoiceProps({
      listBil: listInvoice(value.id_bill),
      docID: value._bid,
      dateDoc: {
        dateDoc: value.docDate,
        dueDate: value.dueDate,
      },
      customerDetail: value.id_customer,
      handleClose: () => setOpenInvoice(false),
    });
    setOpenInvoice(true);
  };

  let listInvoice = (listOrder) => {
    let sumReport = {};
    let newOrder = cloneDeep(order);
    sumReport = listOrder?.reduce((acc, curr) => {
      // let total = curr.id_order.reduce((sum, order) => {
      //   return sum + order.price_order;
      // }, 0);
      let total = [];
      newOrder.map((currOrder) => {
        curr.id_order.map((currOrder2) => {
          if (currOrder._id === currOrder2) {
            console.log(currOrder.price_order);
            total.push(currOrder.price_order);
          }
        });
      });

      total = total.reduce((sum, currtotal) => {
        return sum + currtotal;
      }, 0);
      const str =
        "รถกะบะ 4 ล้อ ตู้ทึบ จำนวน " +
        curr.id_order.length +
        " คัน วิ่งงานวันที่ " +
        dayjs(curr.dateWork).format("DD/MM/YYYY") +
        "@" +
        total +
        "@" +
        curr._bid;
      acc[str] = (acc[str] || 0) + 1;
      return acc;
    }, {});

    let DR = [];
    for (const key in sumReport) {
      DR.push({
        list: key.split("@")[0],
        price: parseInt(key.split("@")[1]),
        id: key.split("@")[2],
      });
    }
    return DR;
  };

  let invoiceQuery = useMemo(() => {
    let newInvoice = cloneDeep(invoice);
    newInvoice = newInvoice?.filter((item) => {
      item.cus_name = item.id_customer.cus_name;
      item.countBill = item.id_bill.length;
      return item;
    });
    return newInvoice;
  }, [invoice]);

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    styleCellProps: {
      fontSize: "1.1rem",
    },
    headCell: [
      { id: "cus_name", label: "ชื่อบริษัท" },
      { id: "_bid", label: "เลขที่เอกสาร" },
      { id: "docDate", label: "วันที่เอกสาร" },
      { id: "dueDate", label: "วันครบกำหนด" },
      { id: "countBill", label: "จำนวนใบวางบิล" },
      { id: "", label: "" },
    ],
  };

  return (
    <Container>
      <DialogInvoice open={openInvoice} {...invoiceProps} />
      <Paper sx={{ p: 0, overflow: "hidden" }}>
        <TableContainer>
          <Table
            // size={dense ? "small" : "medium"}
            sx={{
              minWidth: 700,
              "& td": {
                borderBlockWidth: 1,
                fontSize: "1.1rem",
              },
            }}
            aria-label="spanning table"
          >
            <TableHeader isOpenFirstCell {...tableHeaderProps} />
            <TableBody>
              {invoiceQuery
                ?.sort(getComparator(sortType, sortByName))
                .map((item, index) => {
                  return (
                    <TableRow
                      hover
                      key={index}
                      sx={{
                        "& td, & th": {
                          borderBlockWidth:
                            index === invoiceQuery.length - 1 ? 0 : 1,
                        },
                      }}
                    >
                      <TableCell align="center">{item.cus_name}</TableCell>
                      <TableCell align="center">{item._bid}</TableCell>
                      <TableCell align="center">
                        {dayjs(item.docDate)
                          .locale("th")
                          .format("DD MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        {" "}
                        {dayjs(item.dueDate)
                          .locale("th")
                          .format("DD MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">{item.countBill}</TableCell>
                      <TableCell align="center" sx={{ textAlign: "left" }}>
                        <IconButton
                          onClick={() => handleShowInvoice(item)}
                          sx={{ p: 1, color: "#4287f5" }}
                        >
                          <RemoveRedEyeRounded />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Invoices;
