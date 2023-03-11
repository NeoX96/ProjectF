import {
  Box,
  Button,
  Container,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { DOMAIN } from "../index";
import Cookies from "js-cookie";
import Title from "../components/title";
import LoginIcon from "@mui/icons-material/Login";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const MainContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const LoginContainer = styled(Container)({
  backgroundColor: "rgba(255, 255, 255, 0.65)",
  borderRadius: "10px",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.35)",
  backdropFilter: "blur(4px)",
  paddingTop: "30px",
  paddingBottom: "30px",
});

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const isDisabled = email.trim() === "" || password.trim() === "" || !email.includes("@") || password.length < 6 || !email.includes(".");

  const changeAuthMode = () => {
    navigate("/Register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${DOMAIN}/login`, {
        email,
        password,
      });

      if (data.token) {
        var isSecure = window.location.protocol === "https:" ? true : false;
        Cookies.set("sessionID", data.token, {
          expires: 1,
          secure: isSecure,
          sameSite: isSecure ? "none" : "lax",
        });

        Cookies.set("vorname", data.user);

        window.location.href = "/Home";
      } else {
        alert("Access token is not returned");
      }
    } catch (error) {
      // switch case for error.response.data
      switch (error.response.status) {
        case 400:
          alert("Email oder Passwort falsch");
          break;
        case 401:
          alert("User nicht verifiziert");
          break;

        default:
          alert("Fehler", error.response);
      }

      Cookies.remove("sessionID");
    }
  };

  return (
    <MainContainer>
      <LoginContainer maxWidth="sm">
        <Title />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Passwort"
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  onChange={(event) => setPassword(event.target.value)}
                  inputProps={{ minLength: 6 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant={isDisabled ? "outlined" : "contained"}
                    color="primary"
                    type="submit"
                    disabled={isDisabled}
                  >
                    <LoginIcon sx={{ mr: 1 }} />
                    Login
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={changeAuthMode}
                  >
                    Noch keinen Account? Registrieren
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </LoginContainer>
    </MainContainer>
  );
};

export default Login;
