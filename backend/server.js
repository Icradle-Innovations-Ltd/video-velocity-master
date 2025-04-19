const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: "URL is required" });
    }

    try {
        const videoInfo = await ytdl.getInfo(url);
        const title = videoInfo.videoDetails.title;
        let formats = videoInfo.formats.filter(
            f => f.hasAudio && f.hasVideo && f.container === "mp4"
        );
        console.log(formats)

        res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
        ytdl(url, { format: formats[formats.length - 1].itag }).pipe(res);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).send({ error: "Failed to download video" });
    }
});

app.post('/metadata', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: "URL is required" });
    }

    try {
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, "audioandvideo").map(format => ({ itag: format.itag, qualityLabel: format.qualityLabel }));
        res.json({ title: info.videoDetails.title, formats });
    } catch (error) {
        console.error("Metadata error:", error);
        res.status(500).send({ error: "Failed to fetch metadata" });
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});