const fs = require("fs");
const axios = require("axios");
const { deleteZipAndFolder, zipFolder } = require("./fileOperations");

// Downloads a single page
async function downloadPage(link, folderPath) {
  try {
    const resp = await axios({
      method: "GET",
      url: link,
      responseType: "arraybuffer",
    });

    const lastBackslashIndex = link.lastIndexOf("/");
    const result = link.substring(lastBackslashIndex + 1);

    console.log(`Downloading ${result}...`);
    fs.writeFileSync(`${folderPath}/${result}`, resp.data);
  } catch (error) {
    console.error(`Error downloading page:`, error);
  }
}

// Downloads all pages in the chapter
async function downloadPages(links, folderPath) {
  for (const link of links) {
    await downloadPage(link, folderPath);
  }
}

module.exports = function mainDownloader(fetchGalleryData, basePath) {
  return async function (galleryID) {
    const data = await fetchGalleryData(galleryID);

    const folderPath = `${basePath}/${galleryID}`;
    const zipFile = `${folderPath}.zip`;

    // Precheck if the file has already downloaded or not
    if (fs.existsSync(folderPath && zipFile)) {
      console.log("File already exist...");
      return;
    } else {
      fs.mkdirSync(folderPath, { recursive: true });
      await downloadPages(data.links, folderPath);
    }

    return zipFolder(galleryID, basePath)
      .then(() => {
        console.log("Folder zipped successfully!");
        setTimeout(() => {
          deleteZipAndFolder(galleryID, basePath);
        }, 5 * 60 * 1000);
      })
      .catch((error) => {
        console.error("Error zipping folder:", error);
        throw error;
      });
  };
};
