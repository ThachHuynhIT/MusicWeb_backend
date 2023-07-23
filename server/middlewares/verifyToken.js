const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token)
    return res
      .status(401)
      .render("./users/login", { message: "Bạn chưa đăng nhập" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    console.error("Error:", error);

    return res
      .status(401)
      .render("./users/login", { message: "Bạn chưa đăng nhập" });
  }
};
