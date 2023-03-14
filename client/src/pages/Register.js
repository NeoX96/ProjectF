import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField,
  Fab,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DOMAIN } from "../index";
import Title from "../components/title";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const MainContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const GridContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "30px",
  width: "100%",
  maxWidth: "80vh",
  padding: "50px",
  borderRadius: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(4px)",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.35)",
});

const RegisterForm = () => {
  const navigate = useNavigate();

  const [vorname, setVorname] = useState("");
  const [nickname, setNickname] = useState("");
  const [geburtstag, setGeburtstag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const changeAuthMode = () => {
    navigate("/Login");
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const registered = {
      vorname: vorname,
      username: nickname,
      birthday: geburtstag,
      email: email,
      password: password,
    };
  
    const today = new Date();
    const birthdate = new Date(geburtstag);
    const age = today.getFullYear() - birthdate.getFullYear();
  
    if (age < 18) {
      alert("Es tut uns leid, du musst mindestens 18 Jahre alt sein, um dich zu registrieren. Bitte komm später wieder!");
      return;
    }
  
    try {
      const response = await axios.post(`${DOMAIN}/createUser`, registered);
      if (response.status === 200) {
        alert("Registrierung erfolgreich. Bitte Verifikations-Email bestätigen. Sieh auch im Spam-Ordner nach!");
        navigate("/Login");
      }
    } catch (error) {
      switch (error.response.status) {
        case 401:
          alert("Bereits Registriert");
          break;
  
        case 402:
          alert("Fehler bei der Registrierung");
          break;
  
        default:
          alert("Fehler bei der Registrierung");
          break;
      }
    }
  };
  

  return (
    <MainContainer>
      <form onSubmit={handleRegister}>
        <GridContainer>
          <Title />
          <TextField
            label="Vorname"
            variant="outlined"
            value={vorname}
            required
            onChange={(event) => setVorname(event.target.value)}
          />
          <TextField
            label="Nickname"
            variant="outlined"
            value={nickname}
            required
            onChange={(event) => setNickname(event.target.value)}
          />
          <TextField
            label="Geburtstag"
            variant="outlined"
            type="date"
            value={geburtstag}
            required
            onChange={(event) => setGeburtstag(event.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Passwort"
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
          <Fab
            variant="extended"
            color="primary"
            type="submit"
            aria-label="register"
          >
            <HowToRegIcon sx={{ mr: 1 }} />
            Registrieren
          </Fab>
          <Button
            variant="text"
            color="primary"
            onClick={changeAuthMode}
            aria-label="login"
            disabled
          >
            Bereits Registriert? Login
          </Button>
        </GridContainer>
      </form>
    </MainContainer>
  );
};

export default RegisterForm;
