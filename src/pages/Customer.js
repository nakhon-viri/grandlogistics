import { useState, useMemo } from "react";
import {
  searchAddressByProvince,
  searchAddressByDistrict,
  searchAddressByAmphoe,
} from "thai-address-database";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

const Provinces = [
  "กระบี่",
  "กรุงเทพมหานคร",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พะเยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยโสธร",
  "ยะลา",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "พระนครศรีอยุธยา",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี",
  "บึงกาฬ",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const Customer = () => {
  const [provinces, setProvinces] = useState("กรุงเทพมหานคร");
  const [district, setDritict] = useState("");
  const [amphoe, setAmphoe] = useState("");
  const [zipCode, setZipCode] = useState("");

  let queryAmphoe = useMemo(
    () => [
      ...new Map(
        searchAddressByAmphoe(amphoe, 10000).map((item) => [
          item.district,
          item,
        ])
      ).values(),
    ],
    [amphoe]
  );
  let queryDistrict = useMemo(
    () => [
      ...new Map(
        searchAddressByDistrict(district, 10000).map((item) => [
          item.district,
          item,
        ])
      ).values(),
    ],
    [district]
  );
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="search-select-label">Options</InputLabel>
        <Select
          MenuProps={MenuProps}
          labelId="search-select-label"
          id="search-select"
          value={provinces}
          input={
            <OutlinedInput
              sx={{
                width: "100%",
                borderRadius: 2,
                "& fieldset": {
                  borderRadius: 2,
                },
              }}
              label={"Options"}
            />
          }
          onChange={(e) => setProvinces(e.target.value)}
        >
          {Provinces.map((option, i) => (
            <MenuItem
              key={i}
              sx={{
                width: "100%",
                borderRadius: "8px",
                mb: 1,
              }}
              value={option}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel id="search-select-label">Options</InputLabel>
        <Select
          MenuProps={MenuProps}
          labelId="search-select-label"
          id="search-select"
          value={amphoe}
          input={
            <OutlinedInput
              sx={{
                width: "100%",
                borderRadius: 2,
                "& fieldset": {
                  borderRadius: 2,
                },
              }}
              label={"Options"}
            />
          }
          onChange={(e) => setAmphoe(e.target.value)}
        >
          {[
            ...new Map(
              searchAddressByProvince(provinces, 10000).map((item) => [
                item.amphoe,
                item,
              ])
            ).values(),
          ].map((item, i) => (
            <MenuItem
              key={i}
              sx={{
                width: "100%",
                borderRadius: "8px",
                mb: 1,
              }}
              value={item.amphoe}
            >
              {item.amphoe}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel id="search-select-label">Options</InputLabel>
        <Select
          MenuProps={MenuProps}
          labelId="search-select-label"
          id="search-select"
          value={district}
          input={
            <OutlinedInput
              sx={{
                width: "100%",
                borderRadius: 2,
                "& fieldset": {
                  borderRadius: 2,
                },
              }}
              label={"Options"}
            />
          }
          onChange={(e) => setDritict(e.target.value)}
        >
          {queryAmphoe.map((item, i) => {
            return (
              <MenuItem
                key={i}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  mb: 1,
                }}
                value={item.district}
              >
                {item.district}
              </MenuItem>
            );
          })}
          {!queryAmphoe.length && (
            <Box
              sx={{
                color: "text.secondary",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              value=""
            >
              <InsertDriveFileIcon />
              กรุณาเลือกอำเภอ
            </Box>
          )}
        </Select>
      </FormControl>
      <br />
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel id="search-select-label">Options</InputLabel>
        <Select
          MenuProps={MenuProps}
          labelId="search-select-label"
          id="search-select"
          value={zipCode}
          input={
            <OutlinedInput
              sx={{
                width: "100%",
                borderRadius: 2,
                "& fieldset": {
                  borderRadius: 2,
                },
              }}
              label={"Options"}
            />
          }
          onChange={(e) => setZipCode(e.target.value)}
        >
          {queryDistrict.map((item, i) => {
            return (
              <MenuItem
                key={i}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  mb: 1,
                }}
                value={item.zipcode}
              >
                {item.zipcode}
              </MenuItem>
            );
          })}
          {!queryDistrict.length && (
            <Box
              sx={{
                color: "text.secondary",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              value=""
            >
              <InsertDriveFileIcon />
              กรุณาเลือกตำบล
            </Box>
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default Customer;
