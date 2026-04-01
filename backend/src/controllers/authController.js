const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    res.status(201).json({
      message: "회원가입 성공",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await loginUser(email, password);

    res.status(200).json({
      message: "로그인 성공",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    res.status(200).json({
      message: "현재 사용자 정보",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  me,
};