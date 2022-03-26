import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  FormControlLabel,
  Avatar,
  Switch,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Stack,
  OutlinedInput,
} from "@mui/material";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { styled } from "@mui/material/styles";
import { AddAPhoto, DateRange, InsertDriveFile } from "@mui/icons-material";
import {
  searchAddressByProvince,
  searchAddressByDistrict,
  searchAddressByAmphoe,
} from "thai-address-database";
import { useState, useRef, useMemo } from "react";
import { useFormik } from "formik";
import "dayjs/locale/th";

import useHover from "../hooks/UseHover";
import ImageCrop from "../utils/ImageCrop";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 35,
  height: 20,
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
      transform: "translateX(15px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 15,
    height: 15,
    borderRadius: "50%",
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
};

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
  "บึงกาฬ",
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
];

const InputGrid = ({ sm, ...rest }) => {
  return (
    <Grid item xs={12} sm={sm ? 12 : 6}>
      <TextField
        required
        fullWidth
        autoComplete="off"
        {...rest}
        InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
        sx={styles.inputField}
      />
    </Grid>
  );
};

const InputGridAddress = ({ title, addressQuery, forEmpty, name, ...rest }) => {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel id="search-select-label">{title}</InputLabel>
        <Select
          MenuProps={MenuProps}
          labelId="search-select-label"
          id="search-select"
          {...rest}
          input={
            <OutlinedInput
              sx={{
                width: "100%",
                borderRadius: 2,
                "& fieldset": {
                  borderRadius: 2,
                },
              }}
              label={title}
            />
          }
        >
          {addressQuery.map((option, i) => {
            return (
              <MenuItem
                key={i}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  mb: 1,
                }}
                value={name ? option[name] : option}
              >
                {name ? option[name] : option}
              </MenuItem>
            );
          })}
          {!addressQuery.length && (
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
              <InsertDriveFile />
              กรุณาเลือก{forEmpty}
            </Box>
          )}
        </Select>
      </FormControl>
    </Grid>
  );
};
function Script_checkID(id) {
  if (!IsNumeric(id)) return false;
  if (id.substring(0, 1) == 0) return false;
  if (id.length != 13) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseFloat(id.charAt(i)) * (13 - i);
  if ((11 - (sum % 11)) % 10 != parseFloat(id.charAt(12))) return false;
  return true;
}

function IsNumeric(input) {
  var RE =
    /^-?(0|INF|(0[1-7][0-7]*)|(0x[0-9a-fA-F]+)|((0|[1-9][0-9]*|(?=[\.,]))([\.,][0-9]+)?([eE]-?\d+)?))$/;
  return RE.test(input);
}

const Register = () => {
  const [provinces, setProvinces] = useState("กรุงเทพมหานคร");
  const [district, setDritict] = useState("");
  const [amphoe, setAmphoe] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [editor, setEditor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [baseImage, setBaseImage] = useState("");
  const [scaleValue, setScaleValue] = useState(1);
  const [openDialog, setopenDialog] = useState(false);

  const [idNumber, setIdNumber] = useState("");
  const [validationID, setValidationID] = useState(false);

  const [dateValue, setDateValue] = useState(new Date());

  const [bankID, setBankID] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const removeValue = useRef();
  let [hover, eventHover] = useHover();

  let queryProvinces = useMemo(
    () => [
      ...new Map(
        searchAddressByProvince(provinces, 10000).map((item) => [
          item.amphoe,
          item,
        ])
      ).values(),
    ],
    [provinces]
  );
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

  const { handleSubmit, values, handleChange, isValid, dirty } = useFormik({
    initialValues: {
      full_name: {
        first_name: "",
        last_name: "",
      },
      department: "",
      reference_id: "",
      address: {
        house_no: "",
        street: "",
        subdistrict: "",
        district: "",
        province: "",
        zip_code: "",
      },
      bank_no: "",
      bank_name: "",
      photo: "",
      car_no: "",
      password: "",
      phone_no: "",
      birthday: "",
      gender: "",
    },
    onSubmit: (values) => {
      values.photo = baseImage;
      values.reference_id = idNumber;
      values.phone_no = phoneNumber;
      values.birthday = JSON.stringify(dateValue).replace(/"/g, "");
      values.bank_no = bankID;
      console.log(values);
    },
  });

  const profileImageChange = (fileChangeEvent) => {
    const file = fileChangeEvent.target.files[0];
    const { type } = file;
    if (type.endsWith("jpg") || type.endsWith("png") || type.endsWith("jpeg")) {
      setSelectedImage(file);
      removeValue.current.value = "";
      setopenDialog(true);
    }
  };

  const setEditorRef = (editor) => setEditor(editor);

  const onCrop = () => {
    const editors = editor;
    if (editor != null) {
      const url = editors.getImageScaledToCanvas().toDataURL("image/jpeg", 0.5);
      setBaseImage(url);
      setSelectedImage(null);
      setopenDialog(false);
    }
  };

  const onClose = () => {
    if (editor != null) {
      setSelectedImage(null);
      setopenDialog(false);
    }
  };

  const onScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    setScaleValue(scaleValue);
  };

  function handleCheckID(e) {
    let id = e.target.value;
    id = id.replace(/-/g, "");
    if (e.target.value.length > 16) return;

    if (id !== undefined && id.toString().length == 13 && Script_checkID(id)) {
      setValidationID(false);
    } else if (
      id !== undefined &&
      id.toString().length == 13 &&
      !Script_checkID(id)
    ) {
      setValidationID(true);
    }

    if (id.length > 1)
      id = id.substring(0, 1) + "-" + id.substring(1, id.length);
    if (id.length > 6)
      id = id.substring(0, 6) + "-" + id.substring(6, id.length);
    if (id.length > 12)
      id = id.substring(0, 12) + "-" + id.substring(12, id.length);
    if (id.length > 15)
      id = id.substring(0, 15) + "-" + id.substring(15, id.length);
    setIdNumber(id);
  }

  function handleFormatBank(e) {
    let id = e.target.value;
    id = id.replace(/-/g, "");
    if (e.target.value.length > 13) return;

    if (id.length > 3)
      id = id.substring(0, 3) + "-" + id.substring(3, id.length);
    if (id.length > 5)
      id = id.substring(0, 5) + "-" + id.substring(5, id.length);
    if (id.length > 11)
      id = id.substring(0, 11) + "-" + id.substring(11, id.length);
    setBankID(id);
  }
  function handleFormatPhoneNumber(e) {
    let number = e.target.value;
    number = number.replace(/-/g, "");
    if (e.target.value.length > 12) return;

    let lengthNumber = number.charAt(1) == 6 ? 2 : 3;

    if (number.length > lengthNumber)
      number =
        number.substring(0, lengthNumber) +
        "-" +
        number.substring(lengthNumber, number.length);
    if (number.length > 7)
      number =
        number.substring(0, 7) + "-" + number.substring(7, number.length);
    setPhoneNumber(number);
  }
  console.log(typeof JSON.stringify(dateValue));
  return (
    <LocalizationProvider locale={"th"} dateAdapter={AdapterDayjs}>
      <Container>
        <Box component="form" validate onSubmit={handleSubmit} sx={styles.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ py: 10, px: 3, position: "relative" }}>
                <Box
                  component={"span"}
                  sx={{
                    height: "22px",
                    minWidth: "22px",
                    lineHeight: 0,
                    borderRadius: "6px",
                    cursor: "default",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    justifyContent: "center",
                    padding: "0px 8px",
                    color: "rgb(255, 164, 141)",
                    fontSize: "0.75rem",
                    backgroundColor: "rgba(255, 72, 66, 0.16)",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                  }}
                >
                  {"Active"}
                </Box>
                <Box sx={{ mb: "40px" }}>
                  <Box
                    sx={{
                      margin: "auto",
                      width: 144,
                      height: 144,
                      borderRadius: "50%",
                      p: 1,
                      border: "1px dashed rgba(145, 158, 171, 0.32)",
                    }}
                  >
                    <Box
                      component={"div"}
                      role="button"
                      sx={{
                        borderRadius: "50%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        outline: "none",
                        width: "100%",
                        height: "100%",
                        p: 0,
                      }}
                    >
                      <input
                        {...eventHover}
                        type="file"
                        autoComplete="off"
                        ref={removeValue}
                        onChange={profileImageChange}
                        style={{
                          width: "100%",
                          position: "absolute",
                          height: "100%",
                          appearance: "none",
                          backgroundColor: "initial",
                          cursor: "pointer",
                          alignItems: "baseline",
                          color: "inherit",
                          textOverflow: "ellipsis",
                          whiteSpace: "pre",
                          textAlign: "start",
                          padding: "initial",
                          border: "initial",
                          overflow: "hidden",
                          zIndex: 2,
                          opacity: 0,
                        }}
                      />

                      <ImageCrop
                        imageSrc={selectedImage}
                        setEditorRef={setEditorRef}
                        onCrop={onCrop}
                        onClose={onClose}
                        scaleValue={scaleValue}
                        onScaleChange={onScaleChange}
                        openDialog={openDialog}
                      />
                      {/* {selectedImage && ()} */}
                      <Box
                        component={"span"}
                        sx={{
                          overflow: "hidden",
                          backgroundSize: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Avatar
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt={"Nake"}
                          src={baseImage && baseImage}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          position: "absolute",
                          alignItems: "center",
                          flexDirection: "column",
                          justifyContent: "center",
                          color: "#fff",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgb(22, 28, 36,0.5)",
                          opacity: hover ? 1 : 0,
                        }}
                        component={"div"}
                      >
                        <AddAPhoto />
                        <Typography
                          component={"span"}
                          sx={{ textTransform: "none" }}
                        >
                          Update Photo
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      m: "16px auto 0px",
                      textAlign: "center",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <AntSwitch
                      //   checked={dense}
                      //   onChange={handleChangeDense}
                      inputProps={{ "aria-label": "ant design" }}
                    />
                  }
                  label={
                    <Typography component={"span"}>
                      <Typography
                        component={"h6"}
                        sx={{ fontWeight: 800, fontSize: "0.875rem", mb: 0.5 }}
                      >
                        แก้ไขรูป
                      </Typography>
                      <Typography
                        component={"p"}
                        sx={{
                          color: "text.secondary",
                          pr: 5,
                          fontSize: "0.875rem",
                        }}
                      >
                        อนุญาตให้พนักงานสามารถแก้ไขรูปภาพของตนเองได้
                      </Typography>
                    </Typography>
                  }
                  sx={{
                    m: 0,
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Grid container rowSpacing={3} columnSpacing={2}>
                  <InputGrid
                    label="ชื่อ"
                    name="full_name.first_name"
                    type="text"
                    value={values.full_name.first_name}
                    onChange={handleChange}
                  />
                  <InputGrid
                    name="full_name.last_name"
                    label="นามสกุล"
                    type="text"
                    value={values.full_name.last_name}
                    onChange={handleChange}
                  />
                  <InputGrid
                    sm
                    name="password"
                    label="รหัสผ่าน"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  <InputGrid
                    name="phone_no"
                    label="เบอร์ติดต่อ"
                    placeholder="__-____-____"
                    type="tel"
                    value={phoneNumber}
                    onChange={handleFormatPhoneNumber}
                  />
                  <InputGrid
                    label="ทะเบียนรถ"
                    type="text"
                    name="car_no"
                    onChange={handleChange}
                    value={values.car_no}
                  />
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="select-gender">เพศ</InputLabel>
                      <Select
                        labelId="select-gender"
                        name="gender"
                        value={values.gender}
                        label="เพศ"
                        sx={{
                          width: "100%",
                          borderRadius: 2,
                          "& fieldset": {
                            borderRadius: 2,
                          },
                        }}
                        onChange={handleChange}
                      >
                        {["ชาย", "หญิง", "อื่น ๆ"].map((item) => (
                          <MenuItem
                            key={item}
                            value={item}
                            sx={{
                              width: "100%",
                              borderRadius: "8px",
                              mb: 1,
                            }}
                          >
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <InputGrid
                    label="แพนก"
                    type="text"
                    name="department"
                    onChange={handleChange}
                    value={values.department}
                  />
                  <InputGrid
                    label="บัตรประชาชน"
                    type="text"
                    placeholder="_-____-_____-__-_"
                    name="reference_id"
                    error={validationID}
                    helperText={
                      validationID ? "เลขประจำตัวประชาชนไม่ถูกต้อง" : null
                    }
                    onChange={handleCheckID}
                    value={idNumber}
                  />
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <MobileDatePicker
                        label="วัน/เดือน/ปีเกิด"
                        value={dateValue}
                        onChange={(v) => setDateValue(v)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={false}
                            InputProps={{
                              endAdornment: (
                                <DateRange sx={{ color: "text.secondary" }} />
                              ),
                            }}
                            InputLabelProps={{
                              style: { fontFamily: "Sarabun" },
                            }}
                            sx={styles.inputField}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <InputGrid
                    label="เลขบัญชีธนาคาร"
                    type="text"
                    placeholder="___-_-_____-_"
                    name="bank_no"
                    onChange={handleFormatBank}
                    value={bankID}
                  />
                  <InputGrid
                    label="ชื่อบัญชีธนาคาร"
                    type="text"
                    name="bank_name"
                    onChange={handleChange}
                    value={values.bank_name}
                  />
                  <InputGrid
                    sm
                    label="บ้านเลขที่"
                    type="text"
                    name="address.house_no"
                    onChange={handleChange}
                    value={values.address.house_no}
                  />
                  <InputGridAddress
                    title="จังหวัด"
                    value={provinces}
                    onChange={(e) => setProvinces(e.target.value)}
                    addressQuery={Provinces}
                  />
                  <InputGridAddress
                    title="อำเภอ/เขต"
                    name="amphoe"
                    value={amphoe}
                    onChange={(e) => setAmphoe(e.target.value)}
                    addressQuery={queryProvinces}
                  />
                  <InputGridAddress
                    title="ตำบล/แขวง"
                    name="district"
                    forEmpty="อำเภอ/เขต"
                    value={district}
                    onChange={(e) => setDritict(e.target.value)}
                    addressQuery={queryAmphoe}
                  />
                  <InputGridAddress
                    title="รหัสไปรษณีย์"
                    forEmpty="ตำบล/แขวง"
                    name="zipcode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    addressQuery={queryDistrict}
                  />
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    marginTop: "24px",
                  }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    disabled={
                      !(isValid && dirty) &&
                      !idNumber &&
                      !baseImage &&
                      !dateValue
                    }
                    variant="contained"
                    sx={styles.btnSubmit}
                  >
                    Sign In
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

const styles = {
  bgImg: {
    backgroundImage: "url(/img/loginscreen.jpg)",
    backgroundColor: (t) => t.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  containerForm: (matches) => {
    return {
      display: "flex",
      flexDirection: "column",
      width: matches ? 385 : "100%",
      height: "100vh",
      backgroundColor: "#fff",
      padding: "50px",
      paddingTop: 20,
      zIndex: 2,
      position: "absolute",
      left: 0,
    };
  },
  containerBrand: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    mr: 2,
  },
  nameBrand: {
    lineHeight: 0.9,
    fontFamily: "Prompt",
    fontWeight: "700",
    fontSize: "2.8em",
    justifyContent: "center",
  },
  textLogin: {
    fontFamily: "Sarabun",
    fontWeight: 700,
    letterSpacing: "0.8px",
    fontSize: "1.65em",
  },
  form: {
    mt: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputField: {
    borderRadius: 2,
    "& fieldset": {
      borderRadius: 2,
    },
    "& input::placeholder": {
      textOverflow: "ellipsis !important",
      fontWeight: 800,
      color: "text",
      opacity: 1,
    },
  },
  btnSubmit: {
    backgroundColor: "rgb(32, 101, 209)",
    boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
    borderRadius: 2,
    minWidth: 16,
    height: 40,
    width: "auto",
    "&:hover": {
      boxShadow: "none",
    },
  },
};
export default Register;
