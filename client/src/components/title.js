import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

const Title = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ display: "flex", justifyContent: "center", mb: 1}} >
      <Box>
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontSize: "4rem",
            color: "red",
            fontWeight: "bold",
            fontFamily: "Montserrat, sans-serif",
            textShadow: "4px 4px 4px rgba(100, 0, 0, 0.95)",
            textDecoration: "none", cursor: "pointer",
          }}
        >
          Go
        </Typography>
      </Box>
      <Box>
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontSize: "4rem",
            fontWeight: "bold",
            fontFamily: "Montserrat, sans-serif",
            textShadow: "4px 4px 4px rgba(30, 30, 30, 0.6)",
            textDecoration: "none", cursor: "pointer",
          }}
        >
          nkle
        </Typography>
      </Box>
    </Container>
  );
};

export default Title;
