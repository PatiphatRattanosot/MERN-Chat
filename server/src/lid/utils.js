const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const node_mode = process.env.NODE_MODE;

exports.generateToken = (userId, res) => {
  const Token = jwt.sign({ userId }, secret, {
    expiresIn: "1h",
  });
  res.cookie("token", Token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, // XSS Attacks
    sameSite: "strict", //CSRF Attacks
    secure: node_mode !== "development", // true = https , false = http
  });

  console.log("Token Generated");
};
