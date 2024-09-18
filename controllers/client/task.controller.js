const Task = require("../../models/task.model.js");

// [GET] /tasks
module.exports.index = async (req,res) => {

    const find = {
        deleted: false
    }

    // Loc theo Trang thai
    const status = req.query.status;
    if(status) {
        find.status = status;
    }
    //Het loc trang thai 


    const tasks = await Task.find(find);

    res.json(tasks);
}

module.exports.detail = async (req,res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false 
        });

        res.json(task);

    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
}


