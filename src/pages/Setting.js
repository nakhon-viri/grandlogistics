import {
  Container,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ExpandMore } from "@mui/icons-material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  settingStore,
  addDepartment,
  editDepartment,
  delDepartment,
} from "../store/SettingStore";
import { useOutletContext } from "react-router-dom";
import cloneDeep from "lodash.clonedeep";
import { HttpClient } from "../utils/HttpClient";
import Swal from "sweetalert2";

const Setting = () => {
  let { department } = useSelector(settingStore);
  let dispatch = useDispatch();
  const [title, setTitle] = useOutletContext();
  const [dep, setDep] = useState([]);
  const [editDep, setEditDep] = useState("");
  const [loading, setLoading] = useState(false);
  const [indexEditDep, setIndexEditDep] = useState(null);

  const [err, setErr] = useState({
    department: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newDepartment = data.get("department");
    if (!newDepartment) {
      setErr({ ...err, department: "คุณยังไม่ได้ป้อนแผนก" });
      return;
    }
    setErr({ ...err, department: "" });
    e.currentTarget.reset();
    try {
      setLoading(true);
      let { data } = await HttpClient.post("/department", {
        department: newDepartment,
      });
      dispatch(addDepartment(data));
    } catch (error) {
      console.log("error.response", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDel = async (id) => {
    Swal.fire({
      title: `คุณต้องการที่จะลบแผนกนี้ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ใม่",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          console.log(id);
          let { data } = await HttpClient.delete("/department/delete/" + id);
          if (data) {
            dispatch(delDepartment(id));
          }
        } catch (error) {
          console.log("error.response", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSubmitEditDepartment = async (e, id) => {
    e.preventDefault();
    if (!editDep) {
      setErr({ ...err, editDepartment: "คุณยังไม่ได้ป้อนแผนก" });
      return;
    }
    setErr({ ...err, editDepartment: "" });
    try {
      setLoading(true);
      let { data } = await HttpClient.post("/department/edit/" + id, {
        department: editDep,
      });
      dispatch(editDepartment(data));
      setIndexEditDep(null);
    } catch (error) {
      console.log("error.response", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!department) return [];
    setDep(cloneDeep(department));
  }, [department]);

  useEffect(() => {
    setTitle("ตั่งค่าระบบ");
  }, []);

  return (
    <Container>
      <Box>
        <Box mb={3}>
          <Typography>ระบบ</Typography>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Accordion
            sx={{
              boxShadow: "none",
              px: 0,
            }}
          >
            <AccordionSummary
              sx={{
                minHeight: 0,
                p: 0,
                "&.Mui-expanded": {
                  minHeight: 0,
                  m: 0,
                },
                "& .MuiAccordionSummary-content ": {
                  my: 1,
                  "&.Mui-expanded": {
                    my: 1,
                  },
                },
              }}
              expandIcon={<ExpandMore />}
            >
              <Typography>แผนก</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3 }}>
              <Box>
                <Box>
                  <Typography>แผนกทั้งหมด</Typography>
                </Box>
                <List>
                  {dep.map((item, index) => {
                    if (indexEditDep == index) {
                      return (
                        <ListItem key={index} disablePadding>
                          <Box
                            component={"form"}
                            onSubmit={(e) =>
                              handleSubmitEditDepartment(e, item._id)
                            }
                            sx={{
                              display: "flex",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              name="editDepartment"
                              fullWidth
                              label="แก้ไขแผนก"
                              variant="outlined"
                              error={!!err.editDepartment}
                              value={editDep ? editDep : item.department}
                              onChange={(e) => setEditDep(e.target.value)}
                              helperText={
                                !!err.editDepartment ? err.editDepartment : null
                              }
                            />
                            <LoadingButton
                              type="submit"
                              loading={loading}
                              sx={{ ml: 3, borderRadius: 2 }}
                            >
                              ยืนยัน
                            </LoadingButton>
                          </Box>
                          <LoadingButton
                            disableFocusRipple
                            disableRipple
                            loading={loading}
                            sx={{
                              ml: 3,
                              color: "text.secondary",
                              "&.MuiButtonBase-root:hover": {
                                bgcolor: "transparent",
                              },
                            }}
                            onClick={() => {
                              setErr({ ...err, editDepartment: "" });
                              setIndexEditDep(null);
                            }}
                          >
                            ยกเลิก
                          </LoadingButton>
                        </ListItem>
                      );
                    }

                    return (
                      <ListItem key={index}>
                        <ListItemText primary={item.department} />
                        <LoadingButton
                          loading={loading}
                          color="warning"
                          sx={{
                            borderRadius: 2,
                          }}
                          onClick={() => setIndexEditDep(index)}
                        >
                          แก้ไข
                        </LoadingButton>
                        <LoadingButton
                          loading={loading}
                          color="error"
                          sx={{
                            borderRadius: 2,
                          }}
                          onClick={() => handleSubmitDel(item._id)}
                        >
                          ลบ
                        </LoadingButton>
                      </ListItem>
                    );
                  })}
                </List>
                <Box
                  component={"form"}
                  if="form-department"
                  onSubmit={handleSubmit}
                  sx={{
                    display: "flex",
                    flexDirection: { sm: "row", xs: "column" },
                  }}
                >
                  <TextField
                    name="department"
                    fullWidth
                    label="เพิ่มแผนก"
                    variant="outlined"
                    error={!!err.department}
                    helperText={!!err.department ? err.department : null}
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={loading}
                    sx={{ ml: 3, mt: { xs: 3, sm: 0 } }}
                  >
                    ยืนยัน
                  </LoadingButton>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          {/* <Divider /> */}
        </Paper>
      </Box>
    </Container>
  );
};

export default Setting;
