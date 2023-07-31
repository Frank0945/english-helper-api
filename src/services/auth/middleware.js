const session = require("express-session");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function middlewareSetup(app) {
  app.use(
    session({
      secret: process.env.GOOGLE_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
}
const secretKey = "asfdafafsasfafs";

function authenticateToken(req, res, next) {
  // 获取请求的 Authorization 头（包含 token）
  const authHeader = req.headers.authorization;
  // 判断是否有 token
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // 没有提供 token，返回未授权状态码
  }

  // 验证 token
  jwt.verify(token, secretKey, (err, user) => {
    console.log(err);
    if (err) {
      return res.sendStatus(403); // token 无效，返回禁止访问状态码
    }

    // token 验证通过，将用户 profile 添加到请求对象中，供其他处理程序使用
    req.user = user;
    next();
  });
}

module.exports = {
  middlewareSetup,
  authenticateToken
};
