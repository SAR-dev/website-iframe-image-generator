import express from "express";
import captureWebsite from "capture-website";
import { sequelize } from "./database.js";
import { Snapshot } from "./model.js";
import path from "path";

const app = express();
const __dirname = path.resolve();

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
  const fileName = `${uuidv4()}.jpeg`;
  await captureWebsite.file(req.query.url, `images/${fileName}`, {
    type: "jpeg",
    quality: 0.5,
  });
  const snapshot = await Snapshot.create({
    url: req.query.url,
    image: fileName,
    bg: req.query.bg ? req.query.bg : "#4C6EF5",
    color: req.query.color ? req.query.color : "#ffffff",
    text: req.query.text ? req.query.text : "Koji Me",
  });

  res.json({ data: snapshot });
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

app.listen(3000);
