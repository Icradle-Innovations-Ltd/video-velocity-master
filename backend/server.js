const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/download', (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('URL parameter is required');
  }

  const outputDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
    
  const outputFileTemplate = path.join(outputDir, '%(title)s-%(id)s.%(ext)s');

  const ytDlpProcess = spawn('yt-dlp', [
    '-o', outputFileTemplate,
    videoUrl,
  ]);

  ytDlpProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ytDlpProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ytDlpProcess.on('close', (code) => {
    if (code === 0) {
      res.send('Download complete!');
    } else {
      res.status(500).send(`Download failed with code ${code}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});