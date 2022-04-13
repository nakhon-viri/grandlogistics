import {
  Box,
  TableRow,
  TableCell,
  Collapse,
  Typography,
  IconButton,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Search,
  ManageAccounts,
  EditRounded,
  DeleteRounded,
} from "@mui/icons-material";
import React, { useState } from "react";

const TableRows = ({
  isCollapse,
  hover,
  Cell,
  CellCollapse,
  onClickRow,
  sxRow = {},
}) => {
  //   const theme = useTheme();
  //   let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  if (isCollapse && !onClickRow) onClickRow = () => setOpen(!open);
  return (
    <>
      <TableRow hover={hover} onClick={onClickRow} sx={sxRow}>
        {isCollapse && (
          <TableCell>
            <IconButton onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
        )}
        {Cell.map((item, index) => {
          return (
            <TableCell
              key={index}
              onClick={item.onClickCell}
              sx={item.sxCell}
              colSpan={item.colSpan}
              align={item.align}
            >
              {item.value}
            </TableCell>
          );
        })}
      </TableRow>
      {isCollapse && (
        <TableRow
          sx={
            {
              //   borderBottom: open ? 1 : 0,
              //   borderBottomColor: "#ccc",
            }
          }
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
                <Box sx={{ px: 3 }}>
                  {CellCollapse.map((curr, index) => {
                    if (index == 0) {
                      return Object.entries(curr.value).map((p, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography
                              sx={{
                                color: "text.secondary",
                                py: 2.5,
                                mr: 3,
                                borderRadius: i === 0 ? "16px 0px 0px 16px" : 0,
                              }}
                            >
                              {"จุดที่ " + (i + 1) + " : "}
                            </Typography>
                            <Typography
                              sx={{
                                py: 2.5,
                                borderRadius: i === 0 ? "16px 0px 0px 16px" : 0,
                              }}
                            >
                              {p[1]}
                            </Typography>
                          </Box>
                        );
                      });
                    }
                    return (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography
                          sx={{
                            py: 2.5,
                            color: "text.secondary",
                            mr: 3,
                            borderRadius: index === 0 ? "16px 0px 0px 16px" : 0,
                          }}
                        >
                          {curr.title + " : "}
                        </Typography>
                        <Typography
                          sx={{
                            py: 2.5,
                            borderRadius: index === 0 ? "16px 0px 0px 16px" : 0,
                          }}
                        >
                          {curr.value}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default TableRows;
