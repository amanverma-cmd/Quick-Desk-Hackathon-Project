const { Router } = require("express");
const categoryRouter = Router();
const { categoryModel } = require("../db");
const { auth } = require("../auth");

categoryRouter.post("/create", auth, async function(req, res) {
    if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const category = await categoryModel.create({ name: req.body.name });
    res.json({ category });
});

categoryRouter.get("/all", auth, async function(req, res) {
    const categories = await categoryModel.find();
    res.json({ categories });
});

categoryRouter.delete("/:id", auth, async function(req, res) {
    if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    await categoryModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
});

module.exports = { 
    categoryRouter: categoryRouter
};
