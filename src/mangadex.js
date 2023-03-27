const axios = require("axios");
const mainDownloader = require("./utils/mainDownloader");

// GET the chapter info
async function getChapterInfo(chapterID) {
  const resp = await axios({
    method: "GET",
    url: `https://api.mangadex.org/at-home/server/${chapterID}`,
  });

  return {
    host: resp.data.baseUrl,
    chapterHash: resp.data.chapter.hash,
    data: resp.data.chapter.data,
  };
}

const fetchChapterData = async (chapterID) => {
  const { host, chapterHash, data } = await getChapterInfo(chapterID);
  const links = data.map((page) => `${host}/data/${chapterHash}/${page}`);
  return { links };
};

module.exports = mainDownloader(fetchChapterData, "md");
