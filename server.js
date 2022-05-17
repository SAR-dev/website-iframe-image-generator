import express from "express"
import captureWebsite from 'capture-website'

const app = express()
app.set("view engine", "ejs");

// http://localhost:3000/?url=http://tailwindcss.com/

app.get("/", async (req, res) => {
    const src = await captureWebsite.base64(req.query.url);
    res.render("index", {src: src})
})

app.listen(3000)
