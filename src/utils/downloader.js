const axios = require("axios");
const fs = require("fs");

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

module.exports = downloadPages;
