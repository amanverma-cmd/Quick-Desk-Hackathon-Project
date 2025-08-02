const { Router } = require("express")
const ticketRouter = Router();
const { ticketModel } = require("../db");
const { userModel } = require("../db"); 
const { auth } = require("../auth");

ticketRouter.post("/create", auth, async function(req, res) {
    const { subject, description, category } = req.body;
    const ticket = await ticketModel.create({
        subject: subject,
        description: description,
        category: category,
        userId: req.userId
    });
    
    if (ticket) {
        res.json({
            ticket
        });
    } else {
        res.json({
            message: "Ticket not created"
        });
    }
});

ticketRouter.get("/my", auth, async function(req, res) {
    const tickets = await ticketModel.find({
        userId: req.userId
    });
    if (tickets) {
        res.json({
            tickets
        })
    } else {
        res.json({
            message: "There are no Tickets"
        });
    }
});

ticketRouter.post("/:id/upvote", auth, async function(req, res) {
    const ticket = await ticketModel.findByIdAndUpdate(
        req.params.id,
        { $inc: { upvotes: 1 } },
        { new: true }
    );
    res.json({
        ticket
    });
});

ticketRouter.post("/:id/downvote", auth, async function(req, res) {
    const ticket = await ticketModel.findByIdAndUpdate(
        req.params.id,
        { $inc: { downvotes: 1 } },
        { new: true }
    );
    res.json({
        ticket
    });
});

ticketRouter.patch("/:id/status", auth, async function(req, res) {
    const { status } = req.body;
    const ticket = await ticketModel.findByIdAndUpdate(
        req.params.id,
        { status: status },
        { new: true }
    );
    if (ticket) {
        res.json({ ticket });
    } else {
        res.json({ message: "No such ticket" });
    }
});

ticketRouter.patch("/:id/assign", auth, async function(req, res) {
    if (req.role !== "agent" && req.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    let agentId = req.role === "agent" ? req.userId : req.body.agentId;
    const ticket = await ticketModel.findByIdAndUpdate(
        req.params.id,
        { agentId: agentId },
        { new: true }
    );
    res.json({ ticket });
});

ticketRouter.patch("/user/:id/role", auth, async function(req, res) {
    if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const user = await userModel.findByIdAndUpdate(
        req.params.id,
        { role: req.body.role },
        { new: true }
    );
    res.json({ user });
});

ticketRouter.get("/search", auth, async function(req, res) {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.search)
        query.subject = { $regex: req.query.search, $options: "i" };

    if (req.role === "user") query.userId = req.userId;

    const tickets = await ticketModel.find(query).sort({ createdAt: -1 });
    res.json({ tickets });
});

module.exports = {
    ticketRouter: ticketRouter
}


