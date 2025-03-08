import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import futsalsRoute from "./routes/futsals.js"
import slotsRoute from "./routes/slots.js"
import usersRoute from "./routes/users.js"
import cookieParser from "cookie-parser";
//import cors from "cors";

const app = express()
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB.")
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => { //disconnect vako bella dekhaune
    console.log("mongoDB disconnected")
})

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected")
})

//app.get("/user", (req, res) => {
//res.send("Hello first request")

//})

//middlewares
app.use(cookieParser());
//app.use(cors());


app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/futsals", futsalsRoute);
app.use("/api/slots", slotsRoute);
app.use("/api/users", usersRoute);


app.use((err, req, res, next) => {


    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        sucess: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,

    });

});



app.listen(8800, () => {
    connect()
    console.log("Connected to backend!")
})