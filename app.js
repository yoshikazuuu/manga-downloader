const express = require("express");
const app = express();
const path = require("path");
const https = require("https");
const fs = require("fs");
const downloadMD = require("./src/mangadex");
const downloadNH = require("./src/nhentai");
const dotenv = require("dotenv");

// Read the environment variable
dotenv.config();
const PORT = process.env.PORT || 3069;

// Middleware to log the requested URL
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Middleware to disable caching
function noCache(req, res, next) {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
}

// Route to process the  chapter
app.post("/download/md/:chapterID", noCache, async (req, res) => {
  const chapterID = req.params.chapterID;

  try {
    await downloadMD(chapterID);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing the chapter:", error);
    res.status(500).json({ success: false });
  }
});

app.post("/download/nhen/:galleryID", noCache, async (req, res) => {
  const galleryID = req.params.galleryID;

  try {
    await downloadNH(galleryID);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing the chapter:", error);
    res.status(500).json({ success: false });
  }
});

// Route to download the zipped chapter
app.get("/download/md/:chapterID.zip", noCache, (req, res) => {
  const chapterID = req.params.chapterID;
  const zipFilePath = path.join(__dirname, "md", `${chapterID}.zip`);

  res.download(zipFilePath, (err) => {
    if (err && !res.headersSent) {
      console.error("Error sending the zip file:", err);
      res.status(500).send("Error sending the zip file.");
    } else if (!err) {
      console.log("Zip file sent successfully.");
    }
  });
});

app.get("/download/nhen/:galleryID.zip", noCache, (req, res) => {
  const galleryID = req.params.galleryID;
  const zipFilePath = path.join(__dirname, "nhen", `${galleryID}.zip`);

  res.download(zipFilePath, (err) => {
    if (err && !res.headersSent) {
      console.error("Error sending the zip file:", err);
      res.status(500).send("Error sending the zip file.");
    } else if (!err) {
      console.log("Zip file sent successfully.");
    }
  });
});

// Create the server
// Checking if the server does utilize https or not
if (process.env.HTTPS && process.env.HTTPS.toLowerCase() === "true") {
  // Bind the credentials
  const certsDir = process.env.CERTS_DIR;
  const pkey = fs.readFileSync(`${certsDir}/${process.env.PRIVATEKEY}`);
  const certificate = fs.readFileSync(`${certsDir}/${process.env.CERT}`);
  const ca = fs.readFileSync(`${certsDir}/${process.env.CA}`);

  const credentials = { key: pkey, cert: certificate, ca: ca };

  // Launch it
  console.log("Running on HTTPS.");
  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  // Normal http server
  console.log("Running on HTTP.");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
