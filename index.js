const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const israelpostrace = require("./israelPost");
const aramextrace = require("./aramex");
const dhl = require("./dhl");
const boxit = require("./boxit");

dotenv.config({ path: "./config.env" });

const app = express();
app.use(morgan("dev"));
//app.use(express.json());

app.get("/israelpost/:barcode", (req, res) => {
  console.log(req.params);
  let barcodes = req.params.barcode.split(",");
  let results = [];
  const allRequests = barcodes.map(barcode => israelpostrace(barcode).then());
  Promise.all(allRequests)
    .then(result => results.push(result))
    .then(() => {
      let resultStr = "[" + results.toString() + "]";
      //console.log(`results:${results}`);
      res.json(JSON.parse(resultStr));
    })
    .catch(err => {
      console.log(`ERROR: ${err}`);
      res.finished(err);
    });
});

app.get("/aramex/:barcode", (req, res) => {
  aramextrace(req.params.barcode).then(result => res.json(result));
});

app.get("/dhl/:barcode", (req, res) => {
  dhl(req.params.barcode).then(result => res.json(JSON.parse(result)));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});
