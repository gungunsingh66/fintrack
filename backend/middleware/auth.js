const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("RECEIVED HEADER:", req.headers.authorization);

    if (!token) {
      return res.status(401).json("No token");
    }

    const actualToken = token.split(" ")[1];

    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};

module.exports = verifyToken;