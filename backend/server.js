const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch video metadata
app.post('/metadata', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ error: 'URL is required' });
  }

  const command = `yt-dlp --dump-json ${url}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      return res.status(500).send({ error: 'Failed to fetch metadata' });
    }
    res.send(JSON.parse(stdout));
  });
});

// Endpoint to download video
app.post('/download', (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) {
    return res.status(400).send({ error: 'URL and format are required' });
  }

  const command = `yt-dlp -f ${format} -o "./downloads/%(title)s.%(ext)s" ${url}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      return res.status(500).send({ error: 'Failed to download video' });
    }
    res.send({ message: 'Download complete', output: stdout });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});