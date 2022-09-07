//import modules
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
require("dotenv").config()

//app
const app = express()

//db
//username: gamesdashboard    password: GamesDashBoard2022
//uri: mongodb+srv://gamesdashboard:GamesDashBoard2022@cluster0.xxrzcsn.mongodb.net/?retryWrites=true&w=majority
//process.env.MONGO_URI = mongodb+srv://gamesdashboard:GamesDashBoard2022@cluster0.xxrzcsn.mongodb.net/GamesDashBoardDB
mongoose.connect("mongodb+srv://gamesdashboard:GamesDashBoard2022@cluster0.xxrzcsn.mongodb.net/GamesDashBoardDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log("DB Connected"))
.catch((err)=>console.log("DB connection error", err));


//middleware
app.use(morgan("dev"));
app.use(helmet())
app.use(cors({origin: true, credentials: true}));
app.use(express.json());

//route
const findgames = require('./routes/FindGamesList');
app.use("/", findgames);
const userRoutes = require('./routes/UserRoute');
app.use("/", userRoutes);
const authRoutes = require('./routes/AuthRoute');
app.use("/", authRoutes);
const testRoutes = require('./routes/testapi');
app.use("/", testRoutes);
const addGameRoute = require('./routes/AddGameRoute');
app.use("/", addGameRoute);    // or   app.use("/", require("./routes/AddGameRoute")); 
const addFriendRoute = require('./routes/AddFriendRoute');
app.use("/", addFriendRoute); 

//port
const port = process.env.PORT || 8080;  //process.ev.PORT = 8080

//listener
app.listen(process.env.PORT || 8080, () => { 
    console.log("Server started on port 8080")
});


module.exports = app;