const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const router = Router();


let tableData = []
router.get("/table", (req, res) => {
  fs.readFile(path.join(__dirname, "table-data.json"), (err, data) => {
    tableData = JSON.parse(data.toString())
    if (!tableData[0]) {
      tableData = []
    }
    res.send(JSON.stringify(tableData));
  });

});

router.post("/table/add", async (req, res) => {
  const data = JSON.parse(Object.keys(req.body)[0]);
  const newObj = data.data;
  tableData.push(newObj)
  updateJSON(JSON.stringify(tableData));
  console.log(tableData)
  res.end();
});

router.post("/table/delete", async (req, res) => {
  const id = JSON.parse(Object.keys(req.body)[0]);
  delete tableData[id];
  updateJSON(JSON.stringify(tableData));
  console.log(tableData)
  res.end();
});

router.post("/table/change", async (req, res) => {
  let data = JSON.parse(Object.keys(req.body)[0]);
  const number = data.number;
  data = data.data;
  tableData[number] = data;
  updateJSON(JSON.stringify(tableData));
  res.end();
});

function updateJSON(stringifiedDataFromJson) {
  fs.writeFile(path.join(__dirname, "table-data.json"), stringifiedDataFromJson, (err) => {
    if (err) throw err;
  });
}

module.exports = router;
