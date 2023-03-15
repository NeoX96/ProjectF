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
const FriendModel = require("../models/Friends");


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

  console.log(user);

  // Check if mail already exists
  const findMail = UserModel.findOne({ email: user.email });
  if (!findMail) {
    return res.status(401).json({ message: "Email already exists" });
  }

  // Check if username already exists
  const findUsername = UserModel.findOne({ username: user.username });
  if(!findUsername) {
  return res.status(402).json({ message: "Username already exists" });
  }

  
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
    return res.status(200).json({ message: "Email sent" });
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
      const userID = await UserModel.findOne({ sessionID: req.body.user }, { _id: 1 });

      if (!userID) {
          console.log("User not found");
          return res.status(400).json({ error: "User not found" });
      }

      const data = {
          user: userID,
          name: req.body.name,
          uhrzeit: req.body.uhrzeit,
          equipment: req.body.equipment,
          lat: req.body.lat,
          lng: req.body.lng,
          index: req.body.index,
          vorname: req.body.vorname,
          teilnehmer: req.body.teilnehmer,
      }

      const newEvent = new EventModel(data);
      await newEvent.save();
      console.log("Event created");

      res.status(200).json({ msg: 'Event created' });


  } catch (error) {
      console.log(error);
      res.status(500).send(error);
  }
});

router.post("/api/joinEvent", async (req, res) => {

  try {

    const userID = await UserModel.find({ sessionID: req.body.user }, { _id: 1 });
    const eventData = await EventModel.find({ _id: req.body.eventID });

    if (!userID) {
      return res.status(403).json({ msg: 'User not found' });
    }


    if (!eventData) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (eventData[0].teilnehmer.includes(userID[0]._id)) {
      return res.status(405).json({ msg: 'User already joined' });
    }

    eventData[0].teilnehmer.push(userID[0]._id);
    await eventData[0].save();

    res.status(200).json({ msg: 'User joined' });
  
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/api/getEvents', async (req, res) => {
  try {
    const event = await EventModel.find(); // Veranstaltung anhand der ID abrufen

    // map Events and add to all the username out of user Object ID
    const events = await Promise.all(
      event.map(async (event) => {
        // find the user by id and get the username
        const user = await UserModel.findById(event.user);
        
        // write in teilnehmer only the username of the array of teilnehmer in events
        const teilnehmer = await UserModel.find({ _id: { $in: event.teilnehmer } }, { username: 1 });
        
        if (!user) {
          return { ...event._doc, owner: 'User not found' };
        }

        if (user) {
          const updatedEvent = { ...event._doc, owner: user.username };
          if (teilnehmer) {
            updatedEvent.usernames = teilnehmer.map((user) => user.username);
          }
          return updatedEvent;
        }
       
      })
    );

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    console.log(events);

    res.status(200).json(events);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await EventModel.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    console.log("Event deleted");
    res.status(200).json({ msg: "Event deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete('/api/events/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    // Find the event by ID
    const event = await Event.findById(eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is a participant of the event
    if (!event.participants.includes(userId)) {
      return res.status(403).json({ message: 'You are not a participant of this event' });
    }

    // Remove the user from the event's participants array
    event.participants = event.participants.filter(participant => participant.toString() !== userId);

    // Save the updated event to the database
    const updatedEvent = await event.save();

    // Send a success response
    res.status(200).json(updatedEvent);

  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: 'Failed to delete object' });
  }
});

router.post('/api/sendFriendRequest', async (req, res) => {
  try {
      const user = await UserModel.find({ sessionID: req.body.user }, { _id: 1 });
      const owner = await EventModel.find({ _id: req.body.eventID }, { user: 1 });

      const ownerFriendModel = await FriendModel.find({ user: owner[0].user });

      if (!user) {
          return res.status(403).json({ msg: 'User not found' });
      }

      if (!owner) {
          return res.status(404).json({ msg: 'Event not found' });
      }

      // if Owner is user 
      if (owner[0].user == user[0]._id) {
          return res.status(405).json({ msg: 'User is owner' });
      }

      if (ownerFriendModel[0].friends.includes(user[0]._id)) {
          return res.status(406).json({ msg: 'User already in friends' });
      }

      if (ownerFriendModel[0].pending.includes(user[0]._id)) {
          return res.status(407).json({ msg: 'User already send request' });
      }

      ownerFriendModel[0].pending.push(user[0]._id);
      await ownerFriendModel[0].save();

      res.status(200).json({ msg: 'Request send' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
  }
});



module.exports = router;