import { styled } from "@mui/material/styles";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DOMAIN } from "../index";
import Title from "../components/title";

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
  maxWidth: "800px",
  padding: "50px",
  borderRadius: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
});

const RegisterForm = () => {
  const navigate = useNavigate();

  const [vorname, setVorname] = useState("");
  const [nickname, setNickname] = useState("");
  const [geburtstag, setGeburtstag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    try {
      const response = await axios.post(`${DOMAIN}/createUser`, registered);
      if (response.status === 200) {
        alert("Registrierung erfolgreich");
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
            type="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button variant="contained" type="submit">
            Registrieren
          </Button>
          <Button variant="contained" onClick={changeAuthMode}>
            Login
          </Button>
        </GridContainer>
      </form>
    </MainContainer>
  );
};

export default RegisterForm;
