const Task = require("../../models/task.model.js");

// [GET] /tasks
module.exports.index = async (req,res) => {
    const tasks = await Task.find({
        deleted: false 
    })

    console.log(tasks);

    res.json(tasks);
}

module.exports.detail = async (req,res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false 
        });

        res.json(tasks);

    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
}
