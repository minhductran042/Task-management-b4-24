const express = require('express');
require('dotenv').config();

const database = require("./config/database.js");
database.connect();

const app = express();
const port = process.env.PORT;

const Task = require("./models/task.model.js");

app.get("/tasks", async (req,res) => {

    const tasks = await Task.find({
        deleted: false 
    })

    console.log(tasks);

    res.json(tasks);
})

app.get("/tasks/detail/:id", async (req,res) => {
    try {
        const id = req.params.id;
        const task = await Task.find({
            _id: id,
            deleted: false 
        });

        res.json(tasks);

    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
    
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});