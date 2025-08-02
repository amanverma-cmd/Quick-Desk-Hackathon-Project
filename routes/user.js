const { Router } = require("express");
const userRouter = Router();
const bcrypt = require("bcrypt");
const { userModel } = require("../db");
const { jwt, JWT_SECRET } = require("../auth");

userRouter.post("/register", async function (req, res) {
 try {   
    const { email, password, name } = req.body;

    const passwordHash = await bcrypt.hash(password, 5);

    const response = await userModel.create({
        name: name,
        email: email,
        password: passwordHash
    });

    if (response) {
        res.json({
            message: "You are Registered"
        });
    }
} catch (e) {
     res.json({
        message: "User already exists"
     })
}
});

userRouter.post("/login", async function(req, res) {
    const { email, password } = req.body;
    const foundUser = await userModel.findOne({
        email: email
    });

    if (!foundUser) {
    return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    
    if (passwordMatch) {
        const token = jwt.sign({
            id: foundUser._id,
            role: foundUser.role
        }, JWT_SECRET, {
            expiresIn: "1d"
        });
        res.json({
            token: token
        })
    } else {
        res.json({
            message: "Invalid Credentials"
        });
    }
});

module.exports = {
    userRouter: userRouter
}