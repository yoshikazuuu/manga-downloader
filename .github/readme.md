# Manga Downloader

Manga Downloader is a lightweight Express.js application that allows you to download manga chapters from Mangadex and nhentai galleries easily by providing the chapterID or galleryID. The app utilizes Docker for easy deployment and management.

## Features

- Download manga chapters from Mangadex
- Download nhentai galleries

## Getting Started

Follow these simple steps to get Manga Downloader up and running.

### 1. Clone the repository

Clone the GitHub repository to your local machine:

```bash
git clone https://github.com/yoshikazuuu/manga-downloader.git
cd manga-downloader
```

### 2. Build the Docker image

Build the Docker image with the following command:

```bash
docker build -t manga-downloader .
```

### 3. Run the Docker container

Run the Docker container, mapping your desired port to the container's port 3069:

```bash
docker run -d -p 3069:3069 --name manga-downloader manga-downloader

```

## Usage

### Downloading a chapter from Mangadex

Send a POST request to create a download job for a Mangadex chapter:

```bash
curl -X POST http://localhost:3069/download/mangadex/{chapterID}

```

The server will return a JSON response indicating whether the task was successful or failed:

```json
{
  "success": true
}
```

If the task is successful, you can download the chapter archive using the following command:

```bash
curl http://localhost:3069/download/mangadex/{chapterID}.zip
```

## Downloading a gallery from nhentai

Replace {galleryID} with the desired nhentai gallery ID and follow the same steps as for Mangadex:

```bash
curl -X POST http://localhost:3069/download/nhen/{galleryID}
```

```json
{
  "success": true
}
```

```bash
curl http://localhost:3069/download/nhen/{galleryID}.zip
```

## Contributing

Feel free to fork the repository, make changes, and submit a pull request. We appreciate your contributions!

## License

Manga Downloader is released under the MIT License.
