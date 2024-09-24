const Task = require("../../models/task.model.js");

// [GET] /tasks
module.exports.index = async (req,res) => {

    const find = {
        $or: [
            { createdBy : req.user.id },
            { listUser : req.user.id }
        ],
        deleted: false
    }

    // Loc theo Trang thai
    const status = req.query.status;
    if(status) {
        find.status = status;
    }
    //Het loc trang thai 

    //Sap xep
    const sort = {};

    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    if(sortKey && sortValue) {
        sort[sortKey] = sortValue;
    }
    //Het sap xep 

    //Phan trang
    let limitItems = 2;
    if(req.query.limitItems) {
        limitItems = parseInt(req.query.limitItems);
    }

    let page = 1;
    if(req.query.page) {
        page = parseInt(req.query.page);
    }

    const skip = (page-1) * limitItems;

    //Het phan trang

    //Tim kiem
    if(req.query.keyword) {
        const regax = new RegExp(req.query.keyword,"i");
        find.title = regax;
    }

    //Het tim kiem


    const tasks = await Task
        .find(find)
        .limit(limitItems)
        .skip(skip)
        .sort(sort);

    res.json(tasks);
}

// [GET] /tasks/detail/:id
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


// [PATCH] /tasks/change-status
module.exports.changeStatus = async (req,res) => {
    try {
        const ids = req.body.id;
        const status = req.body.status;
        
        await Task.updateMany({
            _id: { $in: ids }
        }, {
            status: status 
        })
        
        res.json({
            message: "Cập nhật dữ liệu thành công"
        });

    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
}


// [POST] /tasks/create
module.exports.create = async (req,res) => {
    try {   
        
        const id = req.user.id;

        req.body.createdBy = id;

        const task = new Task(req.body);
        await task.save();

        res.json({
            message: "Tạo công việc thành công!",
            task: task
        })

    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
}

// [PATCH] /tasks/edit/:id
module.exports.edit = async (req,res) => {
    try {   
        
        const id = req.params.id;
        const data = req.body;

        await Task.updateOne({
            _id: id
        }, data);

        res.json({
            message: "Cập nhật công việc thành công!"
        })

    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
}

// [PATCH] /tasks/delete
module.exports.delete = async (req,res) => {
    try {
        const ids = req.body.ids;
        
        await Task.updateMany({
            _id: { $in: ids }
        }, {
            deleted: true
        })
        
        res.json({
            message: "Xóa công việc thành công"
        });

    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
}
