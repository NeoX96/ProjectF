import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import OtpInput from "react18-input-otp";
import axios from "axios";
import Title from "../components/title";

import { DOMAIN } from "../index";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [user_id, setUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const code = urlParams.get("code");
    if (id) {
      setUserId(id);
    }
    if (code) {
      setOtp(code);
    }
  }, []);

  const handleChange = (enteredOtp) => {
    setOtp(enteredOtp);
  };

 const handleSubmit = async () => {
  const verification = {
    ID: user_id,
    OTP: otp,
  };
  if (otp.length === 4 && !isNaN(otp)) {
    console.log(verification);

    axios.post(`${DOMAIN}/verifyEmail`, verification).then(res => {
      console.log(res.data);
      // if status 200
      if (res.status === 200) {
        alert("Email verified successfully");
        navigate("/Login");
      }

  }).catch(err => {
      switch (err.response.status) {
        case 400:
          alert(err.response.data);
          break;
        case 401:
          alert(err.response.data);
          break;
        case 402:
          alert(err.response.data);
          break;
        case 403:
          alert(err.response.data);
          break;

        default:
          alert(err.response.data);
          break;
      }
  });


  } else {
    alert("Please enter a valid OTP");
  }
};

  return (
    <Container
      className="d-flex align-items-center justify-content-center "
      style={{ height: "100vh" }}
    >
      <Row>
        <Col>
          <Title className="text-dark" />
        </Col>

        <Col xs={12} sm={15} md={18} lg={21}>
          <Card className="shadow-sm rounded text-primary">
            <Card.Body>
              <h1 className="text-center ">Verify</h1>
                <OtpInput
                  value={otp}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  numInputs={4}
                  separator={<span>-</span>}
                  inputStyle={{
                    width: "50px",
                    height: "50px",
                    fontSize: "20px",
                    margin: "10px",
                    textAlign: "center",
                    borderRadius: "10px",
                  }}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px 0",
                  }}
                />
            </Card.Body>
            <Card.Footer className="text-muted text-center">
              <p>
                Didn't receive an email?
                <a href="/verify" className="text-primary">
                  Resend 
                </a>
              </p>
              <Button className="btn margin-top--large" disabled={otp.length < 4} onClick={handleSubmit} type="submit">
                  Send
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
