import React from 'react';
import { Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';


const LogoutButton = () => {


  const handleLogout = () => {
    document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  return (
    <Button
    variant={"contained"}
    color="primary"
    onClick={handleLogout}
    sx={{ 
      backdropFilter: "blur(2px)",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 401,
      position: "fixed",
      top: -10,
      right: -20,
      borderRadius: 4,
      boxShadow: 6,
      transform: 'rotate(-90deg)',
    }}
  >
    <LogoutIcon sx={{ pt: 0.5, m: 1, transform: 'rotate(+90deg)' }} />
  </Button>
  );
};

export default LogoutButton;
