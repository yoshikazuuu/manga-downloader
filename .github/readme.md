# Manga Downloader

Manga Downloader is a lightweight Express.js application that allows you to download manga chapters from Mangadex and nhentai galleries easily by providing the chapterID or galleryID. The app utilizes Docker for easy deployment and management.

## About

This project was created to support my Discord bot [Mizuki](https://github.com/yoshikazuuu/mizuki) and primarily serves as a self-learning exercise. If you find the code helpful and notice areas for improvement, please feel free to contribute.

## Features

- Download manga chapters from Mangadex
- Download nhentai galleries
- Easily integrate with other applications

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yoshikazuuu/manga-downloader.git
cd manga-downloader
```

### 2. Set up the environment file.

Enable HTTPS configuration in this step. Create a copy of the example environment file, and rename it to .env.

```bash
cp .env.example .env
nano .env
```

Customize the environment variables to your needs.

```env
HTTPS=true
PRIVATEKEY=private.pem
CERT=cert.pem
CA=ca.pem
```

### 3. Build the Docker image.

You can configure it to link with the docker hub or just leave it as it is.

```bash
docker build -t manga-downloader .
```

### 4. Run the Docker container.

Ensure you provide the path to your environment file.

```bash
docker run -d -p 3069:3069 -v /path/to/your/certs:/certs --name manga-downloader --env-file .env manga-downloader
```

## Usage

To download a chapter from mangadex or nhentai or integrate it to your app, follow these steps:

1. Send a POST request to create a job. Replace {chapterID} or {galleryID} with the actual ID of the chapter or gallery you want to download.

```bash
   curl -X POST http://localhost:3069/download/mangadex/{chapterID}
   curl -X POST http://localhost:3069/download/nhentai/{galleryID}
```

2. If the job is successful, the app will return a JSON response with `{success: true}`.

3. To download the file, send a GET request to the same endpoint with .zip appended to the end of the URL.

```bash
curl http://localhost:3069/download/mangadex/{chapterID}.zip
curl http://localhost:3069/download/nhentai/{galleryID}.zip
```

## Contributing

Feel free to fork the repository, make changes, and submit a pull request. We appreciate your contributions!

## License

Manga Downloader is released under the MIT License.
