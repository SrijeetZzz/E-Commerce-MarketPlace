const authService = require("./auth.service");

// 🔥 REGISTER
const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/refresh",
    });

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔥 LOGIN
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔥 REFRESH
const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const result = await authService.refreshAccessToken(token);

    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// 🔥 LOGOUT
const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    console.log("token",token);
    if (token) {
      await authService.logoutUser(token);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
    });

    res.json({ message: "Logged out jiiiiiii" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔥 ME
const me = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};