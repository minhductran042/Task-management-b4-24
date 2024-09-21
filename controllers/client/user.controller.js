const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require('md5');
const generateHelper = require("../../helpers/generate.hepler");
const sendEmailHelper = require("../../helpers/sendEmail.helper");

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
        
        const user = new User(userDataRegister);
        await user.save();
        
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


// [POST] /users/login
module.exports.login = async (req,res) => {
    
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        })
        return;
    }

    if(md5(password) != user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu"
        })
        return;
    }

    
    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: user.token
    })
}


module.exports.forgotPassword = async (req,res) => {
    
    
    const email = req.body.email;

    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại trong hệ thống!"
        })
        return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    //Viec 1: Luu email, OTP vao database 
    const forgotPasswordData = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 3 * 60 * 1000
    }
    
    console.log(forgotPasswordData);


    const forgotPassword = new ForgotPassword(forgotPasswordData);
    await forgotPassword.save();

    //Viec 2 : Gui ma OTP qua email cua User

    const subject = "Mã OTP lấy lại mật khẩu.";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác.`;

    sendEmailHelper.sendEmail(email,subject,htmlSendMail);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email"
    })
}


module.exports.otpPassword = async (req,res) => {

    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result) {
        res.json({
            code:400,
            message: "Mã OTP không hợp lệ"
        })
        return;
    }

    //Sau khi da nhap dung ma OTP
    const user = await User.findOne({
        email: email
    });

    // console.log(user);

    res.json({
        code: 200,
        message: "Xác thực thành công",
        token: user.token
    })
}

module.exports.reset = async (req,res) => {

    const token = req.body.token;
    const password = req.body.password;

    await User.updateOne({
        token: token,
        deleted: false
      }, {
        password: md5(password)
      });

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công",
    })
}