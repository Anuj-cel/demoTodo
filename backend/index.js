require("dotenv").config();
const express=require("express")
const app=express();
const port=process.env.port;
const dbUrl=process.env.dbUrl;
const Tasks=require("./models/todoModel");
const mongoose=require("mongoose");
const cors=require("cors");
const http=require("http");
const server=http.createServer(app);
const {Server}=require("socket.io");
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173"
    },
method:["GET","POST"]}
);

io.on("connection",(socket)=>{
    console.log("New user is added ",socket.id);
    socket.on("disconnect",()=>{
        console.log("Socket disconnected ",socket.id);
    })

})

const dbConnect=async()=>{
try {
    console.log("db connected");
    await mongoose.connect(dbUrl);

}catch(err)
{
    console.log("Cannot connect DB",err)
}
}

dbConnect();

app.use(cors());
app.use(express.json());

app.get("/todos",async(req,res)=>{
   console.log( 'task sent' )
   const allTasks=await Tasks.find();
//    console.log("This is all tasks",allTasks);
   res.send(allTasks)
})
app.post("/todos",async(req,res)=>{
    // console.log(req.body);
    const addTask=new Tasks({task:req.body.task})
    // console.log(addTask)
    
  try{ 
    await  addTask.save();
    io.emit("task",addTask);
console.log("Task is saved ");
 res.json(addTask);
}
  catch(err){
    console.log("This is error during savind task to atlas ",err);
}
})
app.put("/todos/:id",(req,res)=>{
    console.log("edit request ");
})
app.delete("/todos/:id",(req,res)=>{
    console.log("Delete request ");
})


    server.listen(port,(req,res)=>{
    console.log("Server started ",port );
})