const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());

app.post("/api/google-login", async (req, res) => {
  let ticket;
  let token = req.body.token.split(" ")[1];

  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
  } catch (err) {
    console.log("ERROR IS : " + err);

    return;
  }

  const payload = ticket.getPayload();
  const { name, email, picture } = payload;

  res.status(200).json({ name, email, picture });
});

app.listen(5000, () => console.log("APP RUNNING"));
