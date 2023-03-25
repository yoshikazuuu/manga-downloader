const fs = require("fs");
const axios = require("axios");
const archiver = require("archiver");
const downloadPages = require("./utils/downloader.js");

const NHENTAI_CUSTOM_ENDPOINT = "https://janda.sinkaroid.org/nhentai/get?book=";

// Helper function to delete the zip file and the associated folder
function deleteZipAndFolder(galleryID) {
  const zipFilePath = `nhen/${galleryID}.zip`;

  // Delete the zip file
  fs.unlink(zipFilePath, (err) => {
    if (err) {
      console.error("Error deleting zip file:", err);
    } else {
      console.log("Zip file deleted successfully.");
    }
  });

  // Delete the folder
  fs.rm(`nhen/${galleryID}`, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("Error deleting folder:", err);
    } else {
      console.log("Folder deleted successfully.");
    }
  });
}

// Zips the folder containing the downloaded pages
async function zipFolder(ID) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`nhen/${ID}.zip`);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Set the compression level.
    });

    output.on("close", () => {
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(`nhen/${ID}`, false);
    archive.finalize();
  });
}

// Main function to download and zip a chapter
async function downloadGallery(galleryID) {
  const { data } = await axios.get(NHENTAI_CUSTOM_ENDPOINT + galleryID);

  const folderPath = `nhen/${galleryID}`;
  fs.mkdirSync(folderPath, { recursive: true });

  if (data.success) {
    await downloadPages(data.data.image, folderPath);
  } else {
    throw error;
  }

  // Return a promise that resolves when the zipping process is complete
  return zipFolder(galleryID)
    .then(() => {
      console.log("Folder zipped successfully!");
      setTimeout(() => {
        deleteZipAndFolder(galleryID);
      }, 5 * 60 * 1000);
    })
    .catch((error) => {
      console.error("Error zipping folder:", error);
      throw error;
    });
}

module.exports = downloadGallery;
