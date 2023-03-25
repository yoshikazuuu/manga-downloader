const fs = require("fs");
const axios = require("axios");
const archiver = require("archiver");
const downloadPages = require("./utils/downloader.js");

// Helper function to delete the zip file and the associated folder
function deleteZipAndFolder(chapterID) {
  const zipFilePath = `md/${chapterID}.zip`;

  // Delete the zip file
  fs.unlink(zipFilePath, (err) => {
    if (err) {
      console.error("Error deleting zip file:", err);
    } else {
      console.log("Zip file deleted successfully.");
    }
  });

  // Delete the folder
  fs.rm(`md/${chapterID}`, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("Error deleting folder:", err);
    } else {
      console.log("Folder deleted successfully.");
    }
  });
}

// Retrieves the chapter information
async function getChapterInfo(chapterID) {
  // Replace with your actual API call to get chapter info
  const resp = await getLinkImage(chapterID);
  return {
    host: resp.data.baseUrl,
    chapterHash: resp.data.chapter.hash,
    data: resp.data.chapter.data,
  };
}

// Zips the folder containing the downloaded pages
async function zipFolder(chapterID) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`md/${chapterID}.zip`);
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
    archive.directory(`md/${chapterID}`, false);
    archive.finalize();
  });
}

// GET the chapter info
async function getLinkImage(chapterID) {
  const baseUrl = "https://api.mangadex.org";

  const resp = await axios({
    method: "GET",
    url: `${baseUrl}/at-home/server/${chapterID}`,
  });

  return resp;
}

// Main function to download and zip a chapter
async function downloadChapter(chapterID) {
  const { host, chapterHash, data } = await getChapterInfo(chapterID);

  const folderPath = `md/${chapterID}`;
  fs.mkdirSync(folderPath, { recursive: true });

  let links = [];
  for (const page of data) {
    links.push(`${host}/data/${chapterHash}/${page}`);
  }

  // Download the pages
  await downloadPages(links, folderPath);

  // Return a promise that resolves when the zipping process is complete
  return zipFolder(chapterID)
    .then(() => {
      console.log("Folder zipped successfully!");
      setTimeout(() => {
        deleteZipAndFolder(chapterID);
      }, 5 * 60 * 1000);
    })
    .catch((error) => {
      console.error("Error zipping folder:", error);
      throw error;
    });
}

module.exports = downloadChapter;
