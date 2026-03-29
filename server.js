const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "examResults.json";

// Get all results
app.get("/results", (req, res) => {
    if(!fs.existsSync(DATA_FILE)) return res.json([]);
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.json(data);
});

// Add a new result
app.post("/results", (req, res) => {
    const newResult = req.body;
    let data = [];
    if(fs.existsSync(DATA_FILE)){
        data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
    data.push(newResult);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({status:"success"});
});

// Get a single student's result by name
app.get("/results/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    if(!fs.existsSync(DATA_FILE)) return res.json(null);
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const student = data.find(s => s.name.toLowerCase() === name);
    res.json(student || null);
});

// Delete a record by index
app.delete("/results/:index", (req, res) => {
    const index = parseInt(req.params.index);
    if(!fs.existsSync(DATA_FILE)) return res.json({status:"error"});
    let data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    data.splice(index,1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({status:"success"});
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
