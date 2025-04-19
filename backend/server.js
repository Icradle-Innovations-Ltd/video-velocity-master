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
        const info = await ytdl.getInfo(url);
        const format = info.formats.find(f => f.itag === parseInt(formatId));

        if (!format) {
            return res.status(400).send({ error: "Invalid format ID" });
        }

        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");
        const sanitizedTitle = title.replace(/[/\\?%*:|"<>]/g, '');
        const filename = `${sanitizedTitle}.${format.container}`;

        res.header("Content-Disposition", `attachment; filename="${filename}"`);
        ytdl(url, { format: format.itag }).pipe(res);

    } catch (error) {
        console.log(error)
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