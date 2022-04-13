import {
  Box,
  Button,
  Stack,
  Dialog,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { ImageRounded } from "@mui/icons-material";
import AvatarEditor from "react-avatar-editor";

const ImageCrop = ({
  imageSrc,
  onCrop,
  setEditorRef,
  scaleValue,
  onScaleChange,
  onClose,
  openDialog,
}) => {
  const fullScreen = useMediaQuery("(max-width:600px)");

  const dialogProps = {
    fullScreen: fullScreen,
    open: openDialog,
    onClose: onClose,
  };

  const avatarProps = {
    image: imageSrc,
    width: 500,
    height: 500,
    border: 0.5,
    scale: scaleValue,
    rotate: 0,
    ref: setEditorRef,
    borderRadius: 250,
    style: styles.avatar,
  };

  const sliderProps = {
    component: "input",
    type: "range",
    value: scaleValue,
    name: "points",
    min: "1",
    step: "0.001",
    max: "2",
    onChange: onScaleChange,
    sx: { width: "100%" },
  };
  const stackProps = {
    spacing: 2,
    direction: "row",
    sx: { mb: 1 },
    alignItems: "center",
  };

  return (
    <Dialog {...dialogProps}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, pb: 2 }}>
          แก้ไขรูปภาพ
        </Typography>
        <Box sx={styles.containerAvatar}>
          <AvatarEditor {...avatarProps} />
        </Box>
        <Stack {...stackProps}>
          <ImageRounded sx={styles.imgDown} />
          <Box {...sliderProps} />
          <ImageRounded sx={styles.imgUp} />
        </Stack>
        <Box sx={styles.containerButton}>
          <Button
            disableElevation
            disableFocusRipple
            disableRipple
            variant="contained"
            type="button"
            onClick={onCrop}
          >
            ใช้
          </Button>
          <Button
            color="inherit"
            type="button"
            onClick={onClose}
            disableFocusRipple
            disableRipple
            sx={{
              mr: 2,
              "&.MuiButtonBase-root:hover": {
                bgcolor: "transparent",
              },
            }}
          >
            ยกเลิก
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

const styles = {
  containerAvatar: {
    mb: 2,
    p: 1,
    pb: 0.5,
    borderRadius: "8px",
    border: "1px dashed rgba(145, 158, 171, 0.32)",
  },
  avatar: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  imgDown: {
    color: "text.secondary",
  },
  imgUp: {
    fontSize: "35px",
    color: "text.secondary",
  },
  containerButton: {
    display: "flex",
    flexDirection: "row-reverse",
  },
};

export default ImageCrop;
