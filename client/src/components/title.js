import React from "react";
import { Box, Container, Typography } from "@mui/material";

const Title = () => {
  return (
    <Container sx={{ display: "flex", justifyContent: "center"}}>
      <Box>
        <Typography
          sx={{
            fontSize: "4rem",
            color: "red",
            fontWeight: "bold",
            fontFamily: "Montserrat, sans-serif",
            textShadow: "4px 4px 4px rgba(100, 0, 0, 0.99)",
          }}
        >
          Go
        </Typography>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "4rem",
            fontWeight: "bold",
            fontFamily: "Montserrat, sans-serif",
            textShadow: "4px 4px 4px rgba(30, 30, 30, 0.6)",
          }}
        >
          nkle
        </Typography>
      </Box>
    </Container>
  );
};

export default Title;
