// IMPORTS
require("dotenv").config();
const express = require("express");
const chats = require("./data/data");
const cors = require("cors");
const main = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

//middlewares
const app = express();
app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: "https://chatbase-rcs5.onrender.com"
}
))
app.options('*', cors())
main(); //connecting to mongodb


//REST APIs
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



//-------------DEPLOYMENT-----------------------

const __dirname1 = path.resolve();

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname1, "/frontend/build")))

  app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
  })
}
else{
  app.get("/",(req,res) => {
    res.send("api running succesfully");
  })
}

//-------------DEPLOYMENT-----------------------



// SERVER LISTENING
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("server started at port 5000");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("joined chat " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) {
      console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) {
        return;
      }

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id)
  })
});

console.log("hii");
