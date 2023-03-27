const mainDownloader = require("./utils/mainDownloader");
const axios = require("axios");

const NHENTAI_CUSTOM_ENDPOINT = "https://janda.sinkaroid.org/nhentai/get?book=";

const fetchGalleryData = async (galleryID) => {
  const { data } = await axios.get(NHENTAI_CUSTOM_ENDPOINT + galleryID);
  if (!data.success) throw new Error("Error fetching data");
  return { links: data.data.image };
};

module.exports = mainDownloader(fetchGalleryData, "nhen");
