import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTheme } from "@mui/material/styles";

export default function ProjectHeader({ onAddProject }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleAdd = () => {
    handleClose();
    onAddProject();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        position: "sticky",
        top: 0,
        bgcolor: "background.default",
        zIndex: 10,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h5" fontWeight={700} component="h1">
        Projects
      </Typography>

      <IconButton
        onClick={handleMenuClick}
        sx={{
          color: "text.secondary",
          "&:hover": { color: "primary.main", bgcolor: "action.hover" },
        }}
      >
        <MoreHorizIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleAdd}>
          <ListItemIcon>
            <FolderRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Project</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}