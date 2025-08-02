const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET;

function auth(req, res, next) {
   try {
    const token = req.headers.authorization;

    const response = jwt.verify(token, JWT_SECRET);

    if (response) {
        req.userId = response.id;
        req.role = response.role;
        next();
    } else {
        res.json({
           message: "Invalid Token"
        })
    }
} catch (e) {
    res.json({
        message: "Invalid Token"
    })
}
}

module.exports = {
    auth,
    JWT_SECRET,
    jwt
}