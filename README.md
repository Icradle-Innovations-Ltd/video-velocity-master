
# Video Velocity Master

A fast, efficient video downloader application built with React and TypeScript.

## Features

- Download videos from YouTube and other sources
- Multi-resolution options (1080p, 720p, 480p)
- Audio-only download option
- Download progress tracking
- Responsive design for all device sizes

## How to Run Locally

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn package manager

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Step 2: Navigate to the project directory
cd video-velocity-master

# Step 3: Install dependencies
npm install
# or
yarn install

# Step 4: Start the development server
npm run dev
# or
yarn dev
```

The application will start running at [http://localhost:5173](http://localhost:5173)

## How to Use

1. Open the application in your web browser
2. Paste a YouTube URL in the input field (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
3. Click "Analyze" to fetch video details
4. Select your preferred format and quality
5. Click "Download" to start downloading
6. Monitor download progress in the "Active Downloads" section
7. Files will be saved to your default downloads folder

## Important Notes for YouTube Downloads

This is a client-side application that demonstrates downloading capabilities with sample videos. For actual YouTube video downloads:

1. YouTube's terms of service should be followed
2. For production use, a backend server would typically be needed to handle the actual YouTube video extraction
3. The current implementation will download sample demo videos instead of actual YouTube content

## Limitations

- Only downloads sample videos (not actual YouTube videos)
- Pause/resume functionality is simulated
- Limited to browser download capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.
