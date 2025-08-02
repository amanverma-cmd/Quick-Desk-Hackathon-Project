const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
async function DBConnect(){
await mongoose.connect(process.env.DB);
}
DBConnect();
console.log("DB Connected")

const userSchema = new Schema ({
    name: String,
    email: { type: String, unique: true},
    password: String,
    role: { type: String, default: "user"}
})

const ticketSchema = new Schema ({
    subject: String,
    description: String,
    category: String,
    status: { type: String, default: "Open"},
    agentId: ObjectId,
    userId: ObjectId,
    upvotes: { type: Number, default: 0},
    downvotes: { type: Number, default: 0}
})

const commentSchema = new Schema({
    ticketId: ObjectId,
    userId: ObjectId,
    text: String,
    createdAt: { type: Date, default: Date.now }
});


const categorySchema = new Schema({
    name: { type: String, unique: true }
});


const categoryModel = mongoose.model("Category", categorySchema);
const commentModel = mongoose.model("Comment", commentSchema);
const userModel = mongoose.model("users", userSchema);
const ticketModel = mongoose.model("tickets", ticketSchema);


module.exports = {
    userModel: userModel,
    ticketModel: ticketModel,
    commentModel: commentModel,
    categoryModel: categoryModel
}