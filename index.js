const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const { Parser } = require("json2csv");

const app = express();
const PORT = process.env.PORT || 3000;

const results = [];
const csvFilePath = "Pai_Brothers_Hourly_report_Main_Incomer_Sun_Jan_01_2023_to_Wed_Nov.csv";

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    const jsonFilePath = "output.json";
    fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2), (err) => {
      if (err) {
        console.error("Error writing to JSON file", err);
      } else {
        console.log("CSV successfully converted to JSON and saved as:", jsonFilePath);
      }
    });
  });

app.get("/", (req, res) => {
  res.send("<h1>Fetch the data</h1>");
});

app.get("/data", (req, res) => {
  res.json(results);
});

app.get("/csv", (req, res) => {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(results);

  res.header("Content-Type", "text/csv");
  res.attachment("data.csv");
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
