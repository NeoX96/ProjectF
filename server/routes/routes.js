const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
dotenv.config();
const JWTSEC = process.env.JWTSEC;

const UserModel = require('../models/Users');
const verifyEmailModel = require('../models/Verify');
const crypto = require('crypto');
const { generateOTP } = require('./OTP');
const randomId = () => crypto.randomBytes(16).toString("hex");


router.post("/createUser", async (req, res) => {
    const user = req.body;
    user.sessionID = randomId();
    user.userID = randomId();

    // Das Passwort verschlüsseln
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    const OTP = generateOTP();

    const verifyToken = await verifyEmailModel.create({
      user:user._id,
      token:OTP
    });

    verifyToken.save();

    // Erstellen eines Eintrages in der MongoDB
    const newUser = new UserModel(user);
    await newUser.save();

    // Anpassung des Nodemailers
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        // .env Datei mit den Zugangsdaten
        login: process.env.USER,
        pass: process.env.PASS
      }
    });

    // Anpassung des Nodemailers
    transport.sendMail({
      from:"sociaMedia@gmail.com",
      to: user.email,
      subject: "Email-Verifizierung für Sport-Connect.de",
      html: `
        <html>
          <head>
            <style>
              /* Hier können Sie Ihre eigenen Styles definieren */
            </style>
          </head>
          <body>
            <p>Guten Tag ${user.vorname},</p>
            <p>Vielen Dank für Ihre Registrierung bei Sport-Connect.de. Zur Verifizierung Ihrer E-Mail-Adresse benötigen wir von Ihnen den folgenden Code:</p>
            <h1>${OTP}</h1>
            <p>Bitte geben Sie diesen Code auf der Verifizierungsseite ein oder klicken Sie auf den folgenden Link:</p>
            <p><a href="https://www.sport-connect.de/verify?code=${OTP}">https://www.sport-connect.de/verify?code=${OTP}</a></p>
            <p>Vielen Dank und freundliche Grüße</p>
            <p>Ihr Sport-Connect.de-Team</p>
          </body>
        </html>
      `,
    })


    console.log("User created");
    res.status(200).json({Status:"Pending" , msg:"Code per Email an: " + user.email , user:user._id})
    res.json(user);
});

//verify email
router.post("/verifyEmail" , async(req , res)=>{
  const {user , OTP} = req.body;
  const mainuser = await UserModel.findById(user);
  if(!mainuser) return res.status(400).json("User not found");
  if(mainuser.verifed === true){
      return res.status(400).json("User already verifed")
  };
  const token = await verifyEmailModel.findOne({user:mainuser._id});
  if(!token){
      return res.status(400).json("Sorry token not found")
  }
  const isMatch = await bcrypt.compareSync(OTP , token.token);
  if(!isMatch){return res.status(400).json("Token is not valid")};

  mainuser.verifed = true;
  await verifyEmailModel.findByIdAndDelete(token._id);
  await mainuser.save();

  // Anpassung des Nodemailers
  const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    // Anpassung des Nodemailers
    transport.sendMail({
      from:"sociaMedia@gmail.com",
      to:mainuser.email,
      subject:"Email-Verifizierung für Sport-Connect.de",
      html:`Erfolgeich verifiziert`
    })
    return res.status(200).json("Verifizierung Erfolgreich")
})

router.post("/login", async (req, res) => {
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

        const accessToken = jwt.sign({
            id: user._id,
            username: user.username
        }, JWTSEC);

        user.sessionID = accessToken;
        await user.save();

        res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal error occurred" });
    }
});



router.post('/validateSession', async (req, res) => {
    const sessionID = req.body.sessionID;
  
    try {
      const user = await UserModel.findOne({ sessionID: sessionID });

      // If user is found, return true
      if (user) {
        console.log('SessionID found');
        res.status(200).json({ isValid: true });
      } else {
        console.log('SessionID not found');
        res.status(401).json({ isValid: false });
      }

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });

  



module.exports = rout