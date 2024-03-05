require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
let array = [];
let shortUrl = 0;
function validator(url) {
  url = url.split("://");
  if(url[0] === "http" || url[0] === "https") {
    return true;
  }
  return false;
}
app.post('/api/shorturl', function(req, res) {
  if(validator(req.body.url)) {
    shortUrl++;
    array.push({ original_url: req.body.url, short_url: shortUrl })
    res.json(array[array.length - 1]);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:url_id", (req, res) => {
  array.map((item) => {
    if(item.short_url == req.params.url_id) {
      res.redirect(item.original_url);
    }
  });
  res.json({ error: "invalid url" });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
