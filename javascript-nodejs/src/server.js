#!/usr/bin/env node

var express = require("express")
var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/users", (req, res, next) => {

    const n = req.query.n;

    console.log(n);

    if (true) {
        res.status(400).json({"error":"err.message"});
        return;
    } else {
        res.json({
            "message":"success",
            "data":"rows"
        })
    }
});



// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
