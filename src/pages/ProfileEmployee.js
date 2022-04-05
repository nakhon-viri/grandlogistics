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
  FormHelperText,
} from "@mui/material";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import {
  AddAPhoto,
  DateRange,
  InsertDriveFile,
  SaveRounded,
  DeleteRounded,
  ArrowBackRounded,
} from "@mui/icons-material";
import {
  searchAddressByProvince,
  searchAddressByDistrict,
  searchAddressByAmphoe,
} from "thai-address-database";
import { useState, useRef, useMemo, useEffect } from "react";
import "dayjs/locale/th";
import { addEmployee } from "../store/EmployeeStore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import { useForm, Form } from "../components/useForm";
import {
  employeeStore,
  editEmployee,
  deletedEmployee,
} from "../store/EmployeeStore";
import useHover from "../hooks/UseHover";
import ImageCrop from "../utils/ImageCrop";
import { HttpClient } from "../utils/HttpClient";
import Loading from "../components/Loading";

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

const InputGrid = ({ sm, error = null, ...rest }) => {
  return (
    <Grid item xs={12} sm={sm ? 12 : 6}>
      <TextField
        fullWidth
        autoComplete="off"
        {...rest}
        {...(error && { error: true, helperText: error })}
        InputLabelProps={{ style: { fontFamily: "Sarabun" } }}
        sx={styles.inputField}
      />
    </Grid>
  );
};

const InputGridAddress = ({
  title,
  addressQuery,
  fieldName,
  forEmpty,
  error,
  ...rest
}) => {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth {...(error && { error: true })}>
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
                value={fieldName ? option[fieldName] : option}
              >
                {fieldName ? option[fieldName] : option}
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
        <FormHelperText>{error && error}</FormHelperText>
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

const initialValues = {
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
};

const formatID = (value, index) => {
  return value.substring(0, index) + "-" + value.substring(index, value.length);
};

const convertToDefEventPara = (name, value) => ({
  target: {
    name,
    value,
  },
});

const ProfileEmployee = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { state } = useLocation();
  let { employee } = useSelector(employeeStore);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [IDUser, setIDUser] = useState(null);
  //Img
  const [editor, setEditor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleValue, setScaleValue] = useState(1);
  const [openDialog, setopenDialog] = useState(false);
  const removeValue = useRef();
  //CheckID Card
  const [validationID, setValidationID] = useState(false);
  // const [initialValues, setInitialValues] = useState(null);
  //Hooks
  let [hover, eventHover] = useHover();
  //Form
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    let labelEmpty = "โปรดใส่ข้อมูลให้ครบถ้วน";
    if ("first_name" in fieldValues.full_name)
      temp.first_name = fieldValues.full_name.first_name ? "" : labelEmpty;
    if ("last_name" in fieldValues.full_name)
      temp.last_name = fieldValues.full_name.last_name ? "" : labelEmpty;
    if ("car_no" in fieldValues)
      temp.car_no = fieldValues.car_no ? "" : labelEmpty;
    if ("birthday" in fieldValues)
      temp.birthday = fieldValues.birthday ? "" : labelEmpty;
    if ("password" in fieldValues)
      temp.password = fieldValues.password ? "" : labelEmpty;
    if ("phone_no" in fieldValues) {
      temp.phone_no = fieldValues.phone_no ? "" : labelEmpty;
      if (fieldValues.phone_no.length != 12 && fieldValues.phone_no)
        temp.phone_no = "หมายเลขโทรศัพท์ไม่ถูกต้อง";
    }
    if ("gender" in fieldValues)
      temp.gender = fieldValues.gender ? "" : labelEmpty;
    if ("department" in fieldValues)
      temp.department = fieldValues.department ? "" : labelEmpty;
    if ("reference_id" in fieldValues) {
      temp.reference_id = fieldValues.reference_id ? "" : labelEmpty;
      if (
        (validationID || fieldValues.reference_id.length != 17) &&
        fieldValues.reference_id
      )
        temp.reference_id = "เลขบัตรประจำตัวประชาชนไม่ถูกต้อง";
    }
    if ("bank_no" in fieldValues) {
      temp.bank_no = fieldValues.bank_no ? "" : labelEmpty;
      if (fieldValues.bank_no.length != 13 && fieldValues.bank_no)
        temp.bank_no = "หมายเลขบัญชีไม่ถูกต้อง";
    }
    if ("bank_name" in fieldValues)
      temp.bank_name = fieldValues.bank_name ? "" : labelEmpty;
    if ("house_no" in fieldValues.address)
      temp.house_no = fieldValues.address.house_no ? "" : labelEmpty;
    if ("subdistrict" in fieldValues.address)
      temp.subdistrict = fieldValues.address.subdistrict ? "" : labelEmpty;
    if ("district" in fieldValues.address)
      temp.district = fieldValues.address.district ? "" : labelEmpty;
    if ("province" in fieldValues.address)
      temp.province = fieldValues.address.province ? "" : labelEmpty;
    if ("zip_code" in fieldValues.address)
      temp.zip_code = fieldValues.address.zip_code ? "" : labelEmpty;
    if ("photo" in fieldValues)
      temp.photo = fieldValues.photo ? "" : labelEmpty;

    setErrors({
      ...temp,
    });
    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialValues,
    false,
    validate
  );

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        // values.birthday = JSON.stringify(values.birthday).replace(/"/g, "");
        // values.reference_id = values.reference_id.replace(/-/g, "");
        let res = await HttpClient.put("/personnel/" + IDUser, values);
        dispatch(editEmployee(res.data));
        navigate("/");
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
      } catch (error) {
        console.log(error.response.data.error.message);
      }
    }
  };
  //Img
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
      handleInputChange(convertToDefEventPara("photo", url));
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
  //FormatID
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

    if (id.length > 1) id = formatID(id, 1);
    if (id.length > 6) id = formatID(id, 6);
    if (id.length > 12) id = formatID(id, 12);
    if (id.length > 15) id = formatID(id, 15);
    handleInputChange(convertToDefEventPara("reference_id", id));
  }
  function handleFormatBank(e) {
    let id = e.target.value;
    id = id.replace(/-/g, "");
    if (e.target.value.length > 13) return;

    if (id.length > 3) id = formatID(id, 3);
    if (id.length > 5) id = formatID(id, 5);
    if (id.length > 11) id = formatID(id, 11);
    handleInputChange(convertToDefEventPara("bank_no", id));
  }
  function handleFormatPhoneNumber(e) {
    let number = e.target.value;
    number = number.replace(/-/g, "");
    if (e.target.value.length > 12) return;

    let lengthNumber = number.charAt(1) == 6 ? 2 : 3;

    if (number.length > lengthNumber) number = formatID(number, lengthNumber);
    if (number.length > 7) number = formatID(number, 7);
    handleInputChange(convertToDefEventPara("phone_no", number));
  }

  const handleDel = () => {
    Swal.fire({
      title: "คุณต้องการที่จะลบพนักงานนี้ใช่หรือไม่",
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
          let res = await HttpClient.delete("/personnel/" + IDUser);
          if (res.data.sucess) {
            dispatch(deletedEmployee(IDUser));
            Swal.fire("ลบเสร็จสิ้น!", "", "success").then(() => navigate("/"));
          } else {
            Swal.fire(
              "อาจมีปัญหาบางอย่างเกิดขึ้นกรุณาลองใหม่อีกครั้ง!",
              "",
              "warning"
            ).then(() => {
              navigate("/");
              window.location.reload();
            });
          }
        } catch (error) {
          console.log(error.respose);
        } finally {
          setLoadingData(false);
        }
      }
    });
  };

  useEffect(() => {
    if (!state) navigate("/");
    if (employee && state) {
      let user = JSON.parse(JSON.stringify(state?.user || null));
      setIDUser(user._id);
      setValues({
        full_name: {
          first_name: user.full_name.first_name,
          last_name: user.full_name.last_name,
        },
        department: user.department,
        reference_id: user.reference_id,
        address: {
          house_no: user.address.house_no,
          street: user.address.street,
          subdistrict: user.address.subdistrict,
          district: user.address.district,
          province: user.address.province,
          zip_code: user.address.zip_code,
        },
        bank_no: user.bank_no,
        bank_name: user.bank_name,
        photo: user.photo,
        car_no: user.car_no,
        phone_no: user.phone_no,
        birthday: user.birthday,
        gender: user.gender,
      });
    }
  }, [employee, state]);

  //QueryAddress
  let queryProvinces = useMemo(
    () => [
      ...new Map(
        searchAddressByProvince(values.address.province, 10000).map((item) => [
          item.amphoe,
          item,
        ])
      ).values(),
    ],
    [values.address.province]
  );
  let queryAmphoe = useMemo(
    () => [
      ...new Map(
        searchAddressByAmphoe(values.address.district, 10000).map((item) => [
          item.district,
          item,
        ])
      ).values(),
    ],
    [values.address.district]
  );
  let queryDistrict = useMemo(
    () => [
      ...new Map(
        searchAddressByDistrict(values.address.subdistrict, 10000).map(
          (item) => [item.district, item]
        )
      ).values(),
    ],
    [values.address.subdistrict]
  );

  if (!initialValues) return <div>Something</div>;
  if (loadingData) return <Loading />;

  return (
    <LocalizationProvider locale={"th"} dateAdapter={AdapterDayjs}>
      <Container>
        <Box
          sx={{
            flexGrow: 1,
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
            แก้ไขโปรไฟล์
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "rgb(32, 101, 209)",
              boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
              borderRadius: 2,
              "&:hover": {
                boxShadow: "none",
              },
              mr: 2,
            }}
          >
            กลับ
          </Button>
        </Box>
        <Form onSubmit={handleSubmit} sx={styles.form}>
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
                      ...(errors.photo && {
                        borderColor: "#eb7878",
                      }),
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
                            ...(errors.photo && {
                              backgroundColor: "rgb(255, 231, 217)",
                            }),
                          }}
                          alt={"Nake"}
                          src={values.photo && values.photo}
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
                  <FormHelperText
                    sx={{
                      textAlign: "center",
                      pt: 2,
                      color: "red",
                    }}
                  >
                    {errors.photo && errors.photo}
                  </FormHelperText>
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
                    onChange={handleInputChange}
                    error={errors.first_name}
                  />
                  <InputGrid
                    name="full_name.last_name"
                    label="นามสกุล"
                    type="text"
                    value={values.full_name.last_name}
                    onChange={handleInputChange}
                    error={errors.last_name}
                  />
                  <InputGrid
                    name="phone_no"
                    label="เบอร์ติดต่อ"
                    placeholder="__-____-____"
                    type="tel"
                    value={values.phone_no}
                    onChange={handleFormatPhoneNumber}
                    error={errors.phone_no}
                  />
                  <InputGrid
                    label="ทะเบียนรถ"
                    type="text"
                    name="car_no"
                    onChange={handleInputChange}
                    value={values.car_no}
                    error={errors.car_no}
                  />
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      {...(errors.gender && { error: true })}
                    >
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
                        onChange={handleInputChange}
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
                      <FormHelperText>
                        {errors.gender && errors.gender}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <InputGrid
                    label="แพนก"
                    type="text"
                    name="department"
                    onChange={handleInputChange}
                    value={values.department}
                    error={errors.department}
                  />
                  <InputGrid
                    label="บัตรประชาชน"
                    type="text"
                    placeholder="_-____-_____-__-_"
                    name="reference_id"
                    helperText={
                      validationID ? "เลขประจำตัวประชาชนไม่ถูกต้อง" : null
                    }
                    onChange={handleCheckID}
                    value={values.reference_id}
                    error={errors.reference_id}
                  />
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <MobileDatePicker
                        label="วัน/เดือน/ปีเกิด"
                        value={values.birthday}
                        onChange={(v) =>
                          handleInputChange(
                            convertToDefEventPara("birthday", v)
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...(errors.birthday && {
                              error: true,
                              helperText: errors.birthday,
                            })}
                            {...(!errors.birthday && {
                              error: false,
                            })}
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
                    value={values.bank_no}
                    error={errors.bank_no}
                  />
                  <InputGrid
                    label="ชื่อบัญชีธนาคาร"
                    type="text"
                    name="bank_name"
                    onChange={handleInputChange}
                    value={values.bank_name}
                    error={errors.bank_name}
                  />
                  <InputGrid
                    sm
                    label="บ้านเลขที่"
                    type="text"
                    name="address.house_no"
                    onChange={handleInputChange}
                    value={values.address.house_no}
                    error={errors.house_no}
                  />
                  <InputGridAddress
                    title="จังหวัด"
                    name="address.province"
                    value={values.address.province}
                    onChange={handleInputChange}
                    addressQuery={Provinces}
                    error={errors.province}
                  />
                  <InputGridAddress
                    title="อำเภอ/เขต"
                    name="address.district"
                    forEmpty="จังหวัด"
                    value={values.address.district}
                    fieldName="amphoe"
                    onChange={handleInputChange}
                    addressQuery={queryProvinces}
                    error={errors.district}
                  />
                  <InputGridAddress
                    title="ตำบล/แขวง"
                    name="address.subdistrict"
                    forEmpty="อำเภอ/เขต"
                    value={values.address.subdistrict}
                    fieldName="district"
                    onChange={handleInputChange}
                    addressQuery={queryAmphoe}
                    error={errors.subdistrict}
                  />
                  <InputGridAddress
                    title="รหัสไปรษณีย์"
                    forEmpty="ตำบล/แขวง"
                    name="address.zip_code"
                    fieldName="zipcode"
                    value={values.address.zip_code}
                    onChange={handleInputChange}
                    addressQuery={queryDistrict}
                    error={errors.zip_code}
                  />
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginTop: "24px",
                  }}
                >
                  <Button
                    color="error"
                    fullWidth
                    startIcon={<DeleteRounded />}
                    variant="contained"
                    onClick={handleDel}
                    sx={styles.btnDel}
                  >
                    ลบพนักงาน
                  </Button>
                  <LoadingButton
                    type="submit"
                    startIcon={<SaveRounded />}
                    fullWidth
                    loading={loading}
                    variant="contained"
                    sx={styles.btnSubmit}
                  >
                    บันทึก
                  </LoadingButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Form>
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
  btnDel: {
    boxShadow: "rgb(211 47 47 / 24%) 0px 8px 16px 0px",
    borderRadius: 2,
    minWidth: 16,
    height: 40,
    width: "auto",
    "&:hover": {
      boxShadow: "none",
    },
  },
};
export default ProfileEmployee;
