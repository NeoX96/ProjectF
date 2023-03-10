import { Box, Button, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import images from "./assets/home";
import { useNavigate } from "react-router-dom";
import Title from "../components/title";


const MainContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  overflow: "hidden",
});

const StyledBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "20px",
  padding: "15px",
  paddingBottom: "30px",
  borderRadius: "25px",
  backgroundColor: "rgba(0, 10, 30, 0.9)", // setzen Sie eine Hintergrundfarbe für die Box
  boxShadow: "8px 50px 25px rgba(0, 0, 0, 0.6)", // fügen Sie einen Schatten zur Box hinzu
});

const StyledImg = styled("img")({
  width: "auto",
  borderRadius: "10px",
  height: "50vh",
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <MainContainer>
      <Box>
        <Box className="d-flex">
          <Title />
        </Box>
        <StyledBox sx={{ mb: 5 }}>
          <StyledImg src={images.sportsgif} alt="my" />
          <Box sx={{ display: "flex", gap: "40px" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/Register")}
              sx={{
                borderRadius: "50px",
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/Login")}
              sx={{
                borderRadius: "50px",
              }}
            >
              Login
            </Button>
          </Box>
        </StyledBox>
      </Box>
    </MainContainer>
  );
};

export default LandingPage;
