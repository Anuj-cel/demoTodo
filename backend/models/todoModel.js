const mongoose=require("mongoose");
const todoSchema=new mongoose.Schema({
    "task":String
})
const Tasks=mongoose.model("Tasks",todoSchema);
module.exports=Tasks;