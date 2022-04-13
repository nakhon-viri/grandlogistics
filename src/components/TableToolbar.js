import { Toolbar, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const TableToolbar = ({ numSelected, children }) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: (theme) =>
          alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          ),
      }}
    >
      <Typography
        sx={{ flex: 1 }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {numSelected} เลือก
      </Typography>
      {children}
    </Toolbar>
  );
};

export default TableToolbar;
