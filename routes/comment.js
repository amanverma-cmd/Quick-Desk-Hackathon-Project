const { Router } = require("express");
const commentRouter = Router();
const { commentModel, ticketModel } = require("../db");
const { auth } = require("../auth");

commentRouter.post("/:ticketId", auth, async function(req, res) {
    const ticket = await ticketModel.findById(req.params.ticketId);
    if (!ticket) return res.json({ message: "No ticket" });
    if (
        req.userId != ticket.userId.toString() &&
        (!ticket.agentId || req.userId != ticket.agentId.toString()) &&
        req.role !== "admin"
    ) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const comment = await commentModel.create({
        ticketId: ticket._id,
        userId: req.userId,
        text: req.body.text
    });
    res.json({ comment });
});

commentRouter.get("/:ticketId", auth, async function(req, res) {
    const comments = await commentModel.find({ ticketId: req.params.ticketId }).sort({ createdAt: 1 });
    res.json({ comments });
});

module.exports = { 
    commentRouter: commentRouter 
};
