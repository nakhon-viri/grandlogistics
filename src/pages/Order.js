import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { Block } from "@mui/icons-material";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { orderStore } from "../store/OrderStore";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(orderSort, orderBy) {
  return orderSort === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
const headCells = [
  {
    id: "row_number",
    numeric: true,
    disablePadding: true,
    label: "ลำดับ",
  },
  {
    id: "pickup_date",
    numeric: false,
    disablePadding: true,
    label: "วันที่",
  },
  {
    id: "pickup_location",
    numeric: false,
    disablePadding: false,
    label: "สถานที่รับ",
  },
  {
    id: "delivery_location",
    numeric: false,
    disablePadding: false,
    label: "สถานที่ส่ง",
  },
  {
    id: "driver",
    numeric: false,
    disablePadding: false,
    label: "พนักงาน",
  },
  {
    id: "per_time",
    numeric: false,
    disablePadding: false,
    label: "รอบ",
  },
  {
    id: "price_order",
    numeric: true,
    disablePadding: false,
    label: "ค่าเที่ยว",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "สถานะ",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "#c7dcff" }}>
        <TableCell sx={{ p: 0, pl: 3, maxWidth: "40px" }} />
        <TableCell padding="checkbox" sx={{ p: 0, pr: 3 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            sx={{
              py: 2,
              px: 0,
              Width: "100%",
            }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

export default function EnhancedTable() {
  const [orderSort, setOrderSort] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("pickup_date");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState("one");
  const [filterYear, setFilterYear] = React.useState("ทั้งหมด");
  const { order } = useSelector(orderStore);

  const tablePagination = useMediaQuery("(min-width:600px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && orderSort === "asc";
    setOrderSort(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = newOrder.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    console.log(newSelected);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const [personName, setPersonName] = React.useState("ทั้งหมด");
  const [filterDay, setFilterDay] = React.useState([]);
  const [month, setMonth] = React.useState([]);
  const [filterMonth, setFilterMonth] = React.useState("ทั้งหมด");
  const [search, setSearch] = React.useState("");
  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event;
    setPage(0);
    setPersonName(value);
  };
  const handleChageMonth = (e) => {
    const {
      target: { value },
    } = e;
    setPage(0);
    setFilterMonth(value);
  };

  const handleChageYear = (e) => {
    const {
      target: { value },
    } = e;
    setPage(0);
    setFilterYear(value);
  };

  const handleSearchFieldOnChange = (e) => {
    const {
      target: { value },
    } = e;
    setSearch(value);
  };

  // console.log = console.warn = console.error = () => {};
  const newOrder =
    React.useMemo(() => {
      let queryOrder = order?.filter((a) => a) || [];
      let number = 0;
      queryOrder = queryOrder.filter((a) => {
        if (filterYear !== "ทั้งหมด") {
          return dayjs(a.pickup_date).format("YYYY") === filterYear;
        }
        return a;
      });
      setMonth([...queryOrder]);
      queryOrder = queryOrder.filter((a) => {
        if (filterMonth !== "ทั้งหมด") {
          return (
            dayjs(a.pickup_date).locale("th").format("MMMM") === filterMonth
          );
        }
        return a;
      });
      setFilterDay([...queryOrder]);
      queryOrder = queryOrder.filter((a) => {
        if (personName !== "ทั้งหมด") {
          return dayjs(a.pickup_date).locale("th").format("DD") === personName;
        }
        return a;
      });
      for (var i = 0; i < queryOrder.length; i++) {
        queryOrder[i] = { ...queryOrder[i], row_number: i };
      }

      if (search) {
        queryOrder = queryOrder.filter((s) => {
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

      return queryOrder;
    }, [order, filterYear, filterMonth, personName, search]) || [];
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newOrder.length) : 0;

  const Row = ({ row, isItemSelected, labelId, handleClick }) => {
    const [open, setOpen] = React.useState(false);
    // console.log("Row");
    return (
      <>
        <TableRow
          hover
          onClick={() => {
            console.log("open", !open);
            setOpen(!open);
          }}
          role="checkbox"
          sx={{
            backgroundColor: open ? "#c7dcff" : null,
            "&&:hover": {
              backgroundColor: open ? "#b3d0ff" : null,
            },
          }}
        >
          <TableCell sx={{ p: 0, pl: "24px", maxWidth: "40px" }}>
            <IconButton aria-label="expand row" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            role="checkbox"
            tabIndex={-1}
            aria-checked={isItemSelected}
            selected={isItemSelected}
            padding="checkbox"
            sx={{ p: 0, cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              handleClick(event, row);
            }}
          >
            <Checkbox
              color="primary"
              checked={isItemSelected}
              inputProps={{
                "aria-labelledby": labelId,
              }}
            />
          </TableCell>
          <TableCell align="right" sx={{ paddingRight: 6 }}>
            {row.row_number}
          </TableCell>
          <TableCell align="left" id={labelId} scope="row" padding="none">
            {dayjs(row.pickup_date).locale("th").format("DD MMMM YYYY")}
          </TableCell>
          <TableCell align="center">{row.pickup_location}</TableCell>
          <TableCell align="center">{row.delivery_location}</TableCell>
          <TableCell align="center">{row.driver}</TableCell>
          <TableCell align="center">{row.per_time}</TableCell>
          <TableCell align="center">{row.price_order}</TableCell>
          <TableCell
            align="center"
            sx={{ color: row.status === "จัดส่งสำเร็จ" ? "#4a4" : "#4a93ed" }}
          >
            {row.status}
          </TableCell>
        </TableRow>
        <TableRow
          sx={{
            borderBottom: open ? 1 : 0,
            borderBottomColor: "#ccc",
          }}
        >
          <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={18}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  margin: 1,
                  borderBottom: 1,
                  borderBottomColor: "#aeaeae",
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  รายละเอียด
                </Typography>
                <Table size="normal">
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: "#eaeaea", borderRadius: 2 }}
                    >
                      {Object.entries(row.pickup_point).map((p, i) => {
                        if (p[1]) {
                          return (
                            <TableCell
                              key={i}
                              sx={{
                                py: 2.5,
                                borderRadius: i === 0 ? "16px 0px 0px 16px" : 0,
                              }}
                            >
                              {"จุดที่ " + (i + 1)}
                            </TableCell>
                          );
                        }
                      })}
                      <TableCell>จ่ายค่างาน</TableCell>
                      <TableCell>กำไร</TableCell>
                      <TableCell align="right">น้ำมัน</TableCell>
                      <TableCell align="right">ตจว./กทม.</TableCell>
                      <TableCell
                        align="right"
                        sx={{ borderRadius: "0px 16px 16px 0px" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {Object.entries(row.pickup_point).map((p, i) => {
                        if (p[1]) {
                          return <TableCell key={i}>{p[1]}</TableCell>;
                        }
                      })}
                      <TableCell>{row.wage}</TableCell>
                      <TableCell>{row.profit}</TableCell>
                      <TableCell align="right">{row.cost}</TableCell>
                      <TableCell align="right">{row.area}</TableCell>
                      <TableCell align="right">
                        <Button>asdf</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              <Box>
                <img src="/img/me.jpg" alt="" />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <Box>
      <CssBaseline />
      <Container>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">Order ทั้งหมด</Typography>
          </Box>
          <Box>
            <Button
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
              + New order
            </Button>
          </Box>
        </Box>
        <Paper
          sx={{
            paddingInline: 0,
            boxSizing: "border-box",
            mb: 2,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            variant="scrollable"
            indicatorColor="primary"
            sx={{ px: 4, maxHeight: 48, backgroundColor: "#c7dcff" }}
          >
            <Tab value="one" label="Item One" disableRipple />
            <Tab value="two" label="Item Two" disableRipple />
            <Tab value="three" label="Item Three" disableRipple />
          </Tabs>
          <Divider />
          <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid item xs={6} sm={4} md={2}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">วัน</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={personName}
                  onChange={handleChange2}
                  input={
                    <OutlinedInput
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        "& fieldset": {
                          borderRadius: 2,
                        },
                      }}
                      label="Name"
                    />
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem
                    value="ทั้งหมด"
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      mb: 1,
                    }}
                  >
                    วันทั้งหมด
                  </MenuItem>

                  {[
                    ...new Map(
                      filterDay.map((item) => [
                        dayjs(item.pickup_date).locale("th").format("DD"),
                        item,
                      ])
                    ).values(),
                  ]
                    .sort(function (a, b) {
                      return (
                        dayjs(b.pickup_date).format("DD") -
                        dayjs(a.pickup_date).format("DD")
                      );
                    })
                    .map((row, index) => (
                      <MenuItem
                        key={index}
                        value={dayjs(row.pickup_date).locale("th").format("DD")}
                        sx={{
                          width: "100%",
                          borderRadius: "8px",
                          mb: 1,
                        }}
                      >
                        {dayjs(row.pickup_date).locale("th").format("DD")}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">เดือน</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={filterMonth}
                  onChange={handleChageMonth}
                  input={
                    <OutlinedInput
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        "& fieldset": {
                          borderRadius: 2,
                        },
                      }}
                      label="Name"
                    />
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem
                    value="ทั้งหมด"
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      mb: 1,
                    }}
                  >
                    เดือนทั้งหมด
                  </MenuItem>
                  {[
                    ...new Map(
                      month?.map((item) => [
                        dayjs(item.pickup_date).format("MMMM"),
                        item,
                      ])
                    ).values(),
                  ]
                    .sort(function (a, b) {
                      return new Date(b.pickup_date) - new Date(a.pickup_date);
                    })
                    .map((month, index) => (
                      <MenuItem
                        key={index}
                        value={dayjs(month.pickup_date)
                          .locale("th")
                          .format("MMMM")}
                        sx={{
                          width: "100%",
                          borderRadius: "8px",
                          mb: 1,
                        }}
                      >
                        {dayjs(month.pickup_date).locale("th").format("MMMM")}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel
                  sx={{ textAlign: "center" }}
                  id="demo-multiple-name-label"
                >
                  ปี
                </InputLabel>
                <Select
                  labe="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={filterYear}
                  onChange={handleChageYear}
                  input={
                    <OutlinedInput
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        "& fieldset": {
                          borderRadius: 2,
                        },
                      }}
                      label="Name"
                    />
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem
                    value="ทั้งหมด"
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      mb: 1,
                    }}
                  >
                    ปีทั้งหมด
                  </MenuItem>
                  {[
                    ...new Map(
                      order?.map((item) => [
                        dayjs(item.pickup_date).format("YYYY"),
                        item,
                      ])
                    ).values(),
                  ]
                    .sort(function (a, b) {
                      return new Date(b.pickup_date) - new Date(a.pickup_date);
                    })
                    .map((row, index) => (
                      <MenuItem
                        key={index}
                        value={dayjs(row.pickup_date).format("YYYY")}
                        sx={{
                          width: "100%",
                          borderRadius: "8px",
                          mb: 1,
                        }}
                      >
                        {dayjs(row.pickup_date).format("YYYY")}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormControl
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              >
                <TextField
                  placeholder="Search"
                  type="search"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  size="medium"
                  onChange={handleSearchFieldOnChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer>
            <Table
              sx={{
                "& th": { lineHeight: 0 },
                "& td": dense ? { lineHeight: 0 } : null,
                "& .MuiCheckbox-root": {
                  p: 0,
                  ml: "16px",
                },
              }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={orderSort}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={newOrder.length}
              />
              <TableBody>
                {newOrder !== null
                  ? newOrder
                      .sort(getComparator(orderSort, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <Row
                            key={index}
                            row={row}
                            isItemSelected={isItemSelected}
                            labelId={labelId}
                            handleClick={handleClick}
                            newOrder={newOrder}
                          />
                        );
                      })
                  : null}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              flexDirection: tablePagination ? "row" : "column-reverse",
              overflowX: "hidden",
            }}
          >
            <FormControlLabel
              control={
                <>
                  <AntSwitch
                    checked={dense}
                    onChange={handleChangeDense}
                    inputProps={{ "aria-label": "ant design" }}
                  />
                  <Typography sx={{ ml: 1 }}>แคบ</Typography>
                </>
              }
              label={""}
              sx={{
                flex: 1,
                margin: 0,
                pl: "31px",
                mb: tablePagination ? 0 : 1,
              }}
            />
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 25, 30, 35, 40, 45]}
              component="div"
              count={newOrder?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={"จำนวนแถว"}
              sx={{
                "& .MuiToolbar-root": {
                  p: 0,
                  pr: 2,
                },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
