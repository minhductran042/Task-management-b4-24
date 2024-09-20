const User = require("../../models/user.model");
const md5 = require('md5');
const generateHelper = require("../../helpers/generate.hepler");
// [POST] /users/register
module.exports.register = async (req,res) => {
    try {   

        const existUser = await User.findOne({
            email: req.body.email,
            deleted: false
        }) 

        if(existUser) {
            res.json({
                code: 400
            })
            return;
        }

        
        const token = generateHelper.generateRandomString(30);
        const userDataRegister = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: md5(req.body.password),
            token: token
        }
        
        console.log(userDataRegister);
        res.json({
            code: 200,
            message: "Đăng ký thành công!"
        })
    } catch(error) {
        res.json({
            message: "Not Found"
        });
    }
}