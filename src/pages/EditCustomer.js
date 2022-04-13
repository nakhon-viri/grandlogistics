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
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import {
  AddAPhoto,
  DateRange,
  InsertDriveFile,
  ArrowBackRounded,
  SaveRounded,
  DeleteRounded,
} from "@mui/icons-material";
import {
  searchAddressByProvince,
  searchAddressByDistrict,
  searchAddressByAmphoe,
} from "thai-address-database";
import { useState, useRef, useEffect, useMemo } from "react";
import "dayjs/locale/th";
import {
  addCustomer,
  editCustomer,
  deletedCustomer,
} from "../store/CustomerStore";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";

import { useForm, Form } from "../components/useForm";
import useHover from "../hooks/UseHover";
import ImageCrop from "../utils/ImageCrop";
import { HttpClient } from "../utils/HttpClient";
import Loading from "../components/Loading";

import Provinces from '../utils/Provinces';
import convertToDefEventPara from '../utils/ConvertToDefEventPara';


const initialValues = {
  cus_name: "",
  address: {
    house_no: "",
    street: "",
    district: "",
    subdistrict: "",
    province: "",
    zip_code: "",
  },
  phone_no: "",
  corporate_tax: "",
  cus_img: "",
  text_id: "",
};

const formatID = (value, index) =>
  value.substring(0, index) + "-" + value.substring(index, value.length);

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
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
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

const EditCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [title, setTitle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [IDCustomer, setIDCustomer] = useState(null);
  //Img
  const [editor, setEditor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleValue, setScaleValue] = useState(1);
  const [openDialog, setopenDialog] = useState(false);
  const removeValue = useRef();

  let [hover, setHover] = useHover();
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
      handleInputChange(convertToDefEventPara("cus_img", url));
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
  function handleFormatPhoneNumber(e) {
    let number = e.target.value;
    number = number.replace(/-/g, "");
    if (e.target.value.length > 12) return;

    let lengthNumber = number.charAt(1) == 6 ? 2 : 3;

    if (number.length > lengthNumber) number = formatID(number, lengthNumber);
    if (number.length > 7) number = formatID(number, 7);
    handleInputChange(convertToDefEventPara("phone_no", number));
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("cus_name" in fieldValues)
      temp.cus_name = fieldValues.cus_name ? "" : "โปรดใส่ข้อมูลชื่อ";
    if ("corporate_tax" in fieldValues)
      temp.corporate_tax = fieldValues.corporate_tax
        ? ""
        : "โปรดใส่ข้อมูลเลขประจำตัวผู้เสียภาษีอากร";
    if ("text_id" in fieldValues)
      temp.text_id = fieldValues.text_id
        ? ""
        : "โปรดใส่ข้อมูลสำหรับงานของบริษัทนี้ เช่น (XX)12345678";
    if ("house_no" in fieldValues.address)
      temp.house_no = fieldValues.address.house_no
        ? ""
        : "โปรดใส่ข้อมูลบ้านเลขที่";
    if ("subdistrict" in fieldValues.address)
      temp.subdistrict = fieldValues.address.subdistrict
        ? ""
        : "โปรดใส่ข้อมูลตำบล/แขวง";
    if ("district" in fieldValues.address)
      temp.district = fieldValues.address.district
        ? ""
        : "โปรดใส่ข้อมูลอำเภอ/เขต";
    if ("province" in fieldValues.address)
      temp.province = fieldValues.address.province
        ? ""
        : "โปรดใส่ข้อมูลจังหวัด";
    if ("zip_code" in fieldValues.address)
      temp.zip_code = fieldValues.address.zip_code
        ? ""
        : "โปรดใส่ข้อมูลรหัสไปรษณีย์";
    if ("phone_no" in fieldValues)
      temp.phone_no = fieldValues.phone_no ? "" : "โปรดใส่ข้อมูลเบอร์ติดต่อ";
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
        let res = await HttpClient.put("/customer/" + IDCustomer, values);
        dispatch(editCustomer(res.data));
        navigate("/addorder");
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
      } catch (error) {
        console.log(error.response.data.error.message);
      }
    }
  };

  const handleDel = () => {
    Swal.fire({
      title: "คุณต้องการที่จะลบบริษัทนี้ใช่หรือไม่",
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
          let res = await HttpClient.delete("/customer/" + IDCustomer);
          if (res.data.sucess) {
            dispatch(deletedCustomer(IDCustomer));
            Swal.fire("ลบเสร็จสิ้น!", "", "success").then(() =>
              navigate("/customer")
            );
          } else {
            Swal.fire(
              "อาจมีปัญหาบางอย่างเกิดขึ้นกรุณาลองใหม่อีกครั้ง!",
              "",
              "warning"
            ).then(() => {
              navigate("/customer");
              window.location.reload();
            });
          }
        } catch (error) {
          console.log(error.response.data.error.message);
        } finally {
          setLoadingData(false);
        }
      }
    });
  };

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

  useEffect(() => {
    if (!state) navigate("/customer");
    if (state) {
      let customer = JSON.parse(JSON.stringify(state?.customer || null));
      setIDCustomer(customer._id);
      setValues({
        cus_name: customer.cus_name,
        address: {
          house_no: customer.address.house_no,
          street: customer.address.street,
          district: customer.address.district,
          subdistrict: customer.address.subdistrict,
          province: customer.address.province,
          zip_code: customer.address.zip_code,
        },
        phone_no: customer.phone_no,
        corporate_tax: customer.corporate_tax,
        cus_img: customer.cus_img,
        text_id: customer.text_id,
      });
    }
  }, [state]);

  useEffect(
    () => setTitle("แก้ไขโปรไฟล์ บริษัท " + values.cus_name),
    [values.cus_name]
  );

  if (loadingData) return <Loading />;

  return (
    <Container>
      <Box
        sx={{
          marginBottom: 5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          แก้ไขโปรไฟล์ บริษัท {values.cus_name}
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
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ py: 10, px: 3, position: "relative" }}>
              <Box>
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
                      {...setHover}
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
                        src={values.cus_img && values.cus_img}
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
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <InputGrid
                  sm
                  label="ชื่อ*"
                  name="cus_name"
                  type="text"
                  value={values.cus_name}
                  onChange={handleInputChange}
                  error={errors.cus_name}
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
                  label="ชื่อย่อ 2 หลัก*"
                  type="text"
                  name="text_id"
                  onChange={handleInputChange}
                  value={values.text_id}
                  error={errors.text_id}
                />
                <InputGrid
                  sm
                  label="เลขประจำตัวผู้เสียภาษีอากร*"
                  type="text"
                  name="corporate_tax"
                  onChange={handleInputChange}
                  value={values.corporate_tax}
                  error={errors.corporate_tax}
                />
                <InputGrid
                  sm
                  label="บ้านเลขที่*"
                  type="text"
                  name="address.house_no"
                  onChange={handleInputChange}
                  value={values.address.house_no}
                  error={errors.house_no}
                />
                <InputGridAddress
                  title="จังหวัด*"
                  name="address.province"
                  value={values.address.province}
                  onChange={handleInputChange}
                  addressQuery={Provinces}
                  error={errors.province}
                />
                <InputGridAddress
                  title="อำเภอ/เขต*"
                  name="address.district"
                  forEmpty="จังหวัด"
                  value={values.address.district}
                  fieldName="amphoe"
                  onChange={handleInputChange}
                  addressQuery={queryProvinces}
                  error={errors.district}
                />
                <InputGridAddress
                  title="ตำบล/แขวง*"
                  name="address.subdistrict"
                  forEmpty="อำเภอ/เขต"
                  value={values.address.subdistrict}
                  fieldName="district"
                  onChange={handleInputChange}
                  addressQuery={queryAmphoe}
                  error={errors.subdistrict}
                />
                <InputGrid
                  label="ถนน"
                  type="text"
                  name="address.street"
                  onChange={handleInputChange}
                  value={values.address.street}
                />
                <InputGridAddress
                  title="รหัสไปรษณีย์*"
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
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: "24px",
                }}
              >
                <Button
                  color="error"
                  startIcon={<DeleteRounded />}
                  fullWidth
                  variant="contained"
                  onClick={handleDel}
                  sx={styles.btnDel}
                >
                  ลบบริษัทนี้ออกจากระบบ
                </Button>
                <LoadingButton
                  startIcon={<SaveRounded />}
                  type="submit"
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

export default EditCustomer;
