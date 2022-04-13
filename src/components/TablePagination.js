import {
  Box,
  FormControlLabel,
  TablePagination,
  Typography,
} from "@mui/material";
import React from "react";
import Controls from "../components/controls";

const TablePaginations = ({
  checked,
  onChecked,
  count = 0,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
}) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        overflowX: "hidden",
      }}
    >
      <FormControlLabel
        control={
          <>
            <Controls.AntSwitch
              checked={checked}
              onChange={(e) => onChecked(e.target.checked)}
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
          mb: 1,
        }}
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 25, 30, 35, 40, 45]}
        component="div"
        count={count}
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
  );
};

export default TablePaginations;
