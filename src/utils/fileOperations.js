const archiver = require("archiver");
const fs = require("fs");

// Helper function to delete the zip file and the associated folder
function deleteZipAndFolder(ID, basePath) {
  const zipFilePath = `${basePath}/${ID}.zip`;

  // Check if the file exist or not
  if (!fs.existsSync(zipFilePath)) {
    console.log("File doesn't exist!");
    return;
  }

  // Delete the zip file
  fs.unlink(zipFilePath, (err) => {
    if (err) {
      console.error("Error deleting zip file:", err);
    } else {
      console.log("Zip file deleted successfully.");
    }
  });

  // Delete the folder
  fs.rm(`${basePath}/${ID}`, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("Error deleting folder:", err);
    } else {
      console.log("Folder deleted successfully.");
    }
  });
}

// Zips the folder containing the downloaded pages
async function zipFolder(ID, basePath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${basePath}/${ID}.zip`);
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
    archive.directory(`${basePath}/${ID}, false`);
    archive.finalize();
  });
}

// Put deleteZipAndFolder, zipFolder functions here
module.exports = { deleteZipAndFolder, zipFolder };
