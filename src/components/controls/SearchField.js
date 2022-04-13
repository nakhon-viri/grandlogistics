import { FormControl, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import React from "react";

const SearchField = ({ handleSearch }) => {
  return (
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
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default SearchField;
