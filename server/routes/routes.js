const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
dotenv.config();
const JWTSEC = process.env.JWTSEC;

const UserModel = require("../models/Users");
const EventModel = require("../models/Events");
const verifyEmailModel = require("../models/Verify");
const { generateOTP } = require("./OTP");

const crypto = require('crypto');
const randomId = () => crypto.randomBytes(16).toString("hex");


router.get("/test", (req, res) => {
  console.log("Test");
  res.json({ message: "Test" });
});

  
const transport = nodemailer.createTransport({
  host: "mail.gonkle.de",
  port: 587,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  tls: {
      rejectUnauthorized: false,
    },
  });




router.post("/api/createUser", async (req, res) => {
  const user = req.body;
  user.sessionID = randomId();
  user.userID = randomId();

  // Das Passwort verschlüsseln
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;

  // Erstellen eines Eintrages in der MongoDB
  const newUser = new UserModel(user);
  await newUser.save();

  // Create a new token for the user
  const OTP = generateOTP();
  const getUser = await UserModel.findOne({ email: user.email });

  const newToken = new verifyEmailModel({
    user: getUser._id,
    token: OTP,
  });

  await newToken.save();

  try {

    // Anpassung des Nodemailers
    await transport.sendMail({
      from: "noreply@gonkle.de",
      to: user.email,
      subject: "Email-Verifizierung für Gonkle",
      html: `
          <html>
            <head>
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
              <style>
                body {
                  font-family: 'Open Sans', sans-serif;
                  font-size: 16px;
                  color: #222;
                  line-height: 1.5;
                }
                h1 {
                  font-size: 48px;
                  font-weight: 600;
                  color: #0077c2;
                  margin: 0 0 32px;
                }
                a {
                  color: #0077c2;
                }
                .container {
                  max-width: 700px;
                  margin: 0 auto;
                  padding: 32px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                }
                .logo {
                  display: block;
                  margin: 0 auto 32px;
                }
                .footer {
                  margin-top: 32px;
                  text-align: center;
                  color: #777;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="https://www.gonkle.de/logo.png" alt="Gonkle Logo" class="logo"> <br><br>
                Guten Tag ${getUser.vorname},<br>
                Wir heißen Sie herzlich willkommen bei Gonkle<br>

                Um sicherzustellen, dass Sie der rechtmäßige Inhaber der angegebenen E-Mail-Adresse sind, bitten wir Sie, Ihre Adresse zu verifizieren. Dafür benötigen wir von Ihnen den folgenden Code:<br>

                <h1 style="text-align:center"><a href="https://www.gonkle.de/Verify?id=${getUser._id}">${OTP}</a></h1>
          
                Bitte geben Sie diesen Code auf unserer Verifizierungsseite ein oder klicken Sie auf folgenden Button: <br>
                <a href="https://www.gonkle.de/Verify?id=${getUser._id}"https://www.gonkle.de/Verify?id=${getUser._id}</a><br>
          
                <p style="text-align:center"><a href="https://www.gonkle.de/Verify?id=${getUser._id}&code=${OTP}" style="background-color:#007bff;color:#fff;padding:10px;border-radius:5px;text-decoration:none;">E-Mail-Adresse verifizieren</a></p><br><br>

                
                Bitte beachten Sie, dass Sie Ihre E-Mail-Adresse innerhalb von 24 Stunden verifizieren müssen, damit wir Ihre Registrierung abschließen können. <br>
                Sollten Sie Probleme bei der Verifizierung haben, können Sie sich jederzeit an unser Support-Team wenden, das Ihnen gerne weiterhilft.<br>
                Wir bedanken uns für Ihr Vertrauen und freuen uns, Sie bei Gonkle begrüßen zu dürfen.<br>
                
                <p>Freundliche Grüße,<br>
                Ihr Gonkle-Team</p>
                
              </div>
              <div class="footer">
                <p>Gonkle | AbschlussProjekt | RDF<p>
              </div>
            </body>
          </html>
        `,
    });
    console.log("Email sent");
  } catch (err) {
    console.log(err);
  }

  console.log("User created");
  res
    .status(200)
    .json({
      Status: "Pending",
      msg: "Code per Email an: " + user.email,
      user: user._id,
    });
});

//verify email
router.post("/api/verifyEmail", async (req, res) => {
  try {
    const { ID, OTP } = req.body;

    const mainuser = await UserModel.findById(ID);
    if (!mainuser) return res.status(400).json("User not found");

    if (mainuser.verifed === true) {
      return res.status(401).json("User already verifed");
    }

    const token = await verifyEmailModel.findOne({ user: mainuser._id });
    if (!token) {
      return res.status(402).json("Sorry token not found");
    }

    const isMatch = await bcrypt.compareSync(OTP, token.token);
    if (!isMatch) {
      return res.status(403).json("Token is not valid");
    }

    mainuser.verifed = true;
    await verifyEmailModel.findByIdAndDelete(token._id);
    await mainuser.save();


    // Anpassung des Nodemailers
    await transport.sendMail({
      from: "noreply@gonkle.de",
      to: mainuser.email,
      subject: "Email-Verifizierung für Gonkle.de",
      html: `Erfolgeich verifiziert`,
    });
    return res.status(200).json("Verifizierung Erfolgreich");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server Error");
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "User not found" });
    }

    const password = req.body.password;
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log("Password is incorrect");
      return res.status(400).json({ error: "Password is incorrect" });
    }

    if (!user.verifed) {
      console.log("User not verifed");
      return res.status(401).json({ error: "User not verifed" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWTSEC
    );

    user.sessionID = accessToken;
    await user.save();

    res.status(200).json({ token: accessToken, user: user.vorname });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal error occurred" });
  }
});

router.post("/api/validateSession", async (req, res) => {
  const sessionID = req.body.sessionID;

  try {
    const user = await UserModel.findOne({ sessionID: sessionID });

    // If user is found, return true
    if (user) {
      console.log("SessionID found");
      res.status(200).json({ isValid: true });
    } else {
      console.log("SessionID not found");
      res.status(401).json({ isValid: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.post('/api/createEvent', async (req, res) => {

  try {
      const userID = await UserModel.findOne({ sessionID: req.body.sessionID }, { _id: 1 });

      const data = {
          user: userID,
          name: req.body.name,
          uhrzeit: req.body.uhrzeit,
          equipment: req.body.equipment,
          lat: req.body.lat,
          lng: req.body.lng
      }

      const newEvent = new EventModel(data);
      await newEvent.save();
      console.log("Event created");





  } catch (error) {
      console.log(error);
      res.status(500).send(error);
  }
});

router.post('/api/getEvents', async (req, res) => {
  try {
    const event = await EventModel.find(); // Veranstaltung anhand der ID abrufen
    console.log ("fetchedEvents");

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.status(200).json(event);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
