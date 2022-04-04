import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Box,
  useMediaQuery,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";

const TableHeader = ({
  sortType,
  sortByName,
  onRequestSort,
  headCell,
  children,
  isOpenFirstCell,
  styleCellProps,
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const media = useMediaQuery("(max-width:1200px)");
  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: "rgba(145, 158, 171, 0.16)",
          "& td, & th": { px: 0, py: 2, ...styleCellProps },
        }}
      >
        {!isOpenFirstCell ? (
          <TableCell sx={{ p: 0, pl: 3, maxWidth: "40px" }} />
        ) : null}
        {children}
        {headCell.map((Cell) => (
          <TableCell
            key={Cell.id}
            align="center"
            sx={{
              color: "text.secondary",
            }}
            sortDirection={sortByName === Cell.id ? sortType : false}
          >
            <TableSortLabel
              active={sortByName === Cell.id}
              direction={sortByName === Cell.id ? sortType : "asc"}
              onClick={createSortHandler(Cell.id)}
            >
              {Cell.label}
              {sortByName === Cell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {sortType === "desc"
                    ? "sorted descending"
                    : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

TableHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  sortType: PropTypes.oneOf(["asc", "desc"]).isRequired,
  sortByName: PropTypes.string.isRequired,
};

export default TableHeader;
