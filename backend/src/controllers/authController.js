const { registerUser } = require("../services/authService");

const register = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await registerUser(email, password);

        res.status(201).json({
            message : "회원가입 성공",
            user,
        });
    }catch (error) {
        res.status(400).json({
            message : error.message,
        });
    }
};

module.exports = {
    register,
};