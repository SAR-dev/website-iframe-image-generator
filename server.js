import express from "express";
import captureWebsite from "capture-website";
import { sequelize } from "./database.js";
import { Snapshot } from "./model.js";
import cors from "cors";
import path from "path";
import imgbbUploader from "imgbb-uploader";

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "images")));

sequelize.sync().then(() => {
  console.log("DB ready");
});

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

app.post("/generate", async (req, res) => {
  try {
    let image_url = "";
    const base64 = await captureWebsite.base64(req.query.url, {
      type: "jpeg",
      quality: 0.5,
      width: 800,
      height: 450,
    });
    const options = {
      apiKey: "556e30531604cd496c21c9892e7305a4",
      base64string: base64,
    };
    await imgbbUploader(options)
      .then((response) => {
        image_url = response.url
      })
      .catch((error) => console.error(error));
    const snapshot = await Snapshot.create({
      url: req.query.url,
      image: image_url,
      bg: req.query.bg ? req.query.bg : "#4C6EF5",
      color: req.query.color ? req.query.color : "#ffffff",
      text: req.query.text ? req.query.text : "Koji Me",
    });
    res.json({ data: snapshot });
  } catch {
    res.json({ err: "err" });
  }
});

app.get("/generate", async (req, res) => {
  try {
    const data = await Snapshot.findOne({ where: { id: req.query.id } });
    const snapshot = JSON.parse(JSON.stringify(data));
    res.render("index", { snapshot: snapshot });
  } catch {
    res.json({ err: "err" });
  }
});

app.get("/iframe", async (req, res) => {
  res.send(
    `<iframe src="http://localhost:3000/generate?id=${req.query.id}" title="description" scrolling="no" height="400" width="650"></iframe>`
  );
});

app.listen(3001);
